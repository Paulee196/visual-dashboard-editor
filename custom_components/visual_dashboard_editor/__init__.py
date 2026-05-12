"""Visual editor helpers for YAML Home Assistant dashboards."""

from __future__ import annotations

import copy
from datetime import datetime
import io
import json
import logging
from pathlib import Path
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    PANEL_ELEMENT,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL,
    STATIC_URL,
    LOVELACE_PATH_PREFIX,
    WS_LIST_FILES,
    WS_LOAD_FILE,
    WS_SAVE_ELEMENT,
)

_LOGGER = logging.getLogger(__name__)

EXCLUDED_DIRS = {
    ".cloud",
    ".storage",
    ".visual_dashboard_editor_backups",
    "__pycache__",
    "backups",
    "custom_components",
    "deps",
    "node_modules",
    "tts",
}
MAX_FILE_BYTES = 5 * 1024 * 1024

async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up from YAML."""
    if DOMAIN in config:
        await _async_setup_runtime(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up from a config entry."""
    await _async_setup_runtime(hass)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload the integration entry."""
    return True


async def _async_setup_runtime(hass: HomeAssistant) -> None:
    """Register the frontend panel and websocket commands once."""
    from homeassistant.components import panel_custom, websocket_api

    domain_data = hass.data.setdefault(DOMAIN, {})

    if not domain_data.get("static_registered"):
        panel_dir = Path(__file__).parent / "www"
        try:
            from homeassistant.components.http import StaticPathConfig
        except ImportError:  # pragma: no cover - compatibility for older HA builds
            StaticPathConfig = None

        if StaticPathConfig is not None:
            await hass.http.async_register_static_paths(
                [StaticPathConfig(STATIC_URL, str(panel_dir), cache_headers=True)]
            )
        else:  # pragma: no cover - compatibility for older HA builds
            hass.http.register_static_path(STATIC_URL, str(panel_dir), cache_headers=True)
        domain_data["static_registered"] = True

    if not domain_data.get("panel_registered"):
        await panel_custom.async_register_panel(
            hass,
            webcomponent_name=PANEL_ELEMENT,
            frontend_url_path=PANEL_URL,
            module_url=f"{STATIC_URL}/visual-dashboard-editor.js",
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            require_admin=True,
            embed_iframe=False,
        )
        domain_data["panel_registered"] = True

    if not domain_data.get("websocket_registered"):
        _register_websocket_commands(hass, websocket_api)
        domain_data["websocket_registered"] = True


def _register_websocket_commands(hass: HomeAssistant, websocket_api: Any) -> None:
    """Register websocket commands without importing websocket API at module load."""
    import voluptuous as vol

    list_files_schema = {vol.Required("type"): WS_LIST_FILES}
    load_file_schema = {
        vol.Required("type"): WS_LOAD_FILE,
        vol.Required("path"): str,
    }
    save_element_schema = {
        vol.Required("type"): WS_SAVE_ELEMENT,
        vol.Required("path"): str,
        vol.Required("element_path"): [vol.Any(str, int)],
        vol.Optional("element"): object,
        vol.Optional("fragment"): str,
    }

    for schema, handler in (
        (list_files_schema, _ws_list_files),
        (load_file_schema, _ws_load_file),
        (save_element_schema, _ws_save_element),
    ):
        decorated = websocket_api.async_response(handler)
        decorated = websocket_api.websocket_command(schema)(decorated)
        websocket_api.async_register_command(hass, decorated)


async def _ws_list_files(
    hass: HomeAssistant,
    connection: Any,
    msg: dict[str, Any],
) -> None:
    """List candidate YAML dashboard files."""
    try:
        yaml_result = await hass.async_add_executor_job(
            _list_yaml_files, hass.config.path()
        )
        dashboards = await _list_lovelace_dashboards(hass)
        result = {"files": [*dashboards, *yaml_result["files"]]}
    except Exception as err:  # noqa: BLE001 - user-facing websocket error
        _LOGGER.exception("Failed to list YAML files")
        connection.send_error(msg["id"], "list_failed", str(err))
        return

    connection.send_result(msg["id"], result)


async def _ws_load_file(
    hass: HomeAssistant,
    connection: Any,
    msg: dict[str, Any],
) -> None:
    """Load a YAML dashboard file."""
    try:
        if msg["path"].startswith(LOVELACE_PATH_PREFIX):
            result = await _load_lovelace_dashboard(hass, msg["path"])
        else:
            result = await hass.async_add_executor_job(
                _load_dashboard_file, hass.config.path(), msg["path"]
            )
    except Exception as err:  # noqa: BLE001 - user-facing websocket error
        _LOGGER.exception("Failed to load dashboard file")
        connection.send_error(msg["id"], "load_failed", str(err))
        return

    connection.send_result(msg["id"], result)


async def _ws_save_element(
    hass: HomeAssistant,
    connection: Any,
    msg: dict[str, Any],
) -> None:
    """Save a single element back into a YAML dashboard file."""
    try:
        if msg["path"].startswith(LOVELACE_PATH_PREFIX):
            result = await _save_lovelace_element(
                hass,
                msg["path"],
                msg["element_path"],
                msg.get("element"),
                msg.get("fragment"),
            )
        else:
            result = await hass.async_add_executor_job(
                _save_element,
                hass.config.path(),
                msg["path"],
                msg["element_path"],
                msg.get("element"),
                msg.get("fragment"),
            )
    except Exception as err:  # noqa: BLE001 - user-facing websocket error
        _LOGGER.exception("Failed to save dashboard element")
        connection.send_error(msg["id"], "save_failed", str(err))
        return

    connection.send_result(msg["id"], result)


def _list_yaml_files(config_dir: str) -> dict[str, Any]:
    """Return YAML files that look useful for dashboard editing."""
    root = Path(config_dir).resolve()
    files: list[dict[str, Any]] = []

    for path in list(root.rglob("*.yaml")) + list(root.rglob("*.yml")):
        rel = path.relative_to(root)
        if any(part in EXCLUDED_DIRS for part in rel.parts):
            continue
        try:
            stat = path.stat()
        except OSError:
            continue
        if stat.st_size > MAX_FILE_BYTES:
            continue

        score = 0
        kind = "yaml"
        try:
            sample = path.read_text(encoding="utf-8", errors="ignore")[:200_000]
        except OSError:
            sample = ""

        if "picture-elements" in sample:
            score += 100
            kind = "picture-elements"
        if "views:" in sample:
            score += 20
            kind = "dashboard"
        if "elements:" in sample:
            score += 15
        if "cards:" in sample:
            score += 10

        files.append(
            {
                "path": rel.as_posix(),
                "source": "yaml",
                "label": rel.as_posix(),
                "kind": kind,
                "size": stat.st_size,
                "modified": int(stat.st_mtime),
                "score": score,
            }
        )

    files.sort(key=lambda item: (-item["score"], item["path"]))
    return {"files": files[:200]}


async def _list_lovelace_dashboards(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Return UI-managed Lovelace dashboards from Home Assistant runtime."""
    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA, MODE_STORAGE
    except ImportError:
        return []

    lovelace_data = hass.data.get(LOVELACE_DATA)
    if lovelace_data is None:
        return []

    dashboards: list[dict[str, Any]] = []
    for url_path, dashboard in lovelace_data.dashboards.items():
        if getattr(dashboard, "mode", None) != MODE_STORAGE:
            continue

        config = getattr(dashboard, "config", None) or {}
        title = config.get("title") or ("Overview" if url_path is None else str(url_path))
        token = "default" if url_path is None else str(url_path)

        try:
            loaded = await dashboard.async_load(False)
            cards = _find_picture_cards(loaded)
            score = 200 + (100 if cards else 0)
            card_count = len(cards)
        except Exception:  # noqa: BLE001 - auto-generated or unavailable dashboard
            score = 190
            card_count = 0

        dashboards.append(
            {
                "path": f"{LOVELACE_PATH_PREFIX}{token}",
                "source": "lovelace",
                "label": f"{title} (UI dashboard)",
                "kind": "storage-dashboard",
                "size": 0,
                "modified": 0,
                "score": score,
                "cards": card_count,
            }
        )

    dashboards.sort(key=lambda item: (-item["score"], item["label"]))
    return dashboards


def _load_dashboard_file(config_dir: str, relative_path: str) -> dict[str, Any]:
    """Load dashboard YAML and extract editable cards."""
    path = _safe_yaml_path(config_dir, relative_path)
    text = path.read_text(encoding="utf-8")
    data = _load_yaml(text)
    cards = _find_picture_cards(data)

    return {
        "path": path.relative_to(Path(config_dir).resolve()).as_posix(),
        "yaml": text,
        "cards": cards,
    }


async def _load_lovelace_dashboard(
    hass: HomeAssistant, dashboard_path: str
) -> dict[str, Any]:
    """Load a UI-managed Lovelace dashboard."""
    dashboard, title = _find_lovelace_dashboard(hass, dashboard_path)
    data = await dashboard.async_load(False)
    cards = _find_picture_cards(data)

    return {
        "path": dashboard_path,
        "source": "lovelace",
        "title": title,
        "yaml": _dump_yaml(data),
        "cards": cards,
    }


def _save_element(
    config_dir: str,
    relative_path: str,
    element_path: list[str | int],
    element: Any | None,
    fragment: str | None,
) -> dict[str, Any]:
    """Replace one element in the YAML document and save the file."""
    if element is None and fragment is None:
        raise ValueError("No element or YAML fragment was provided")

    path = _safe_yaml_path(config_dir, relative_path)
    original = path.read_text(encoding="utf-8")
    data = _load_yaml(original)
    replacement = _load_yaml(fragment) if fragment is not None else element

    parent = _node_at_path(data, element_path[:-1])
    key = element_path[-1]
    parent[key] = replacement

    new_text = _dump_yaml(data)
    backup_path = _write_backup(Path(config_dir).resolve(), path, original)
    path.write_text(new_text, encoding="utf-8")

    loaded = _load_dashboard_file(config_dir, relative_path)
    loaded["backup_path"] = backup_path.relative_to(Path(config_dir).resolve()).as_posix()
    return loaded


async def _save_lovelace_element(
    hass: HomeAssistant,
    dashboard_path: str,
    element_path: list[str | int],
    element: Any | None,
    fragment: str | None,
) -> dict[str, Any]:
    """Replace one element in a UI-managed Lovelace dashboard."""
    if element is None and fragment is None:
        raise ValueError("No element or YAML fragment was provided")

    dashboard, title = _find_lovelace_dashboard(hass, dashboard_path)
    original = copy.deepcopy(await dashboard.async_load(False))
    updated = copy.deepcopy(original)
    replacement = _plain(_load_yaml(fragment)) if fragment is not None else element

    parent = _node_at_path(updated, element_path[:-1])
    key = element_path[-1]
    parent[key] = replacement

    backup_path = await hass.async_add_executor_job(
        _write_storage_backup,
        Path(hass.config.path()).resolve(),
        dashboard_path,
        title,
        original,
    )
    await dashboard.async_save(updated)

    loaded = await _load_lovelace_dashboard(hass, dashboard_path)
    loaded["backup_path"] = backup_path.relative_to(
        Path(hass.config.path()).resolve()
    ).as_posix()
    return loaded


def _find_lovelace_dashboard(
    hass: HomeAssistant, dashboard_path: str
) -> tuple[Any, str]:
    """Find a Lovelace dashboard by editor path."""
    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA, MODE_STORAGE
    except ImportError as err:
        raise ValueError("Lovelace is not available") from err

    lovelace_data = hass.data.get(LOVELACE_DATA)
    if lovelace_data is None:
        raise ValueError("Lovelace data is not loaded yet")

    token = dashboard_path.removeprefix(LOVELACE_PATH_PREFIX)
    url_path = None if token == "default" else token
    dashboard = lovelace_data.dashboards.get(url_path)
    if dashboard is None and token == "lovelace":
        dashboard = lovelace_data.dashboards.get(None)
    if dashboard is None:
        raise ValueError(f"Dashboard {token} was not found")
    if getattr(dashboard, "mode", None) != MODE_STORAGE:
        raise ValueError("Only UI-managed storage dashboards can be saved here")

    config = getattr(dashboard, "config", None) or {}
    title = config.get("title") or ("Overview" if url_path is None else str(url_path))
    return dashboard, title


def _safe_yaml_path(config_dir: str, relative_path: str) -> Path:
    """Resolve a user-provided relative YAML path inside the HA config dir."""
    root = Path(config_dir).resolve()
    path = (root / relative_path).resolve()

    if path != root and root not in path.parents:
        raise ValueError("Path must stay inside the Home Assistant config directory")
    if path.suffix.lower() not in {".yaml", ".yml"}:
        raise ValueError("Only YAML files can be edited")
    if not path.exists():
        raise ValueError("YAML file does not exist")
    if path.stat().st_size > MAX_FILE_BYTES:
        raise ValueError("YAML file is too large for the first MVP")

    return path


def _write_backup(root: Path, source_path: Path, content: str) -> Path:
    """Write a timestamped backup before modifying a dashboard file."""
    backup_dir = root / ".visual_dashboard_editor_backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    rel_name = source_path.relative_to(root).as_posix().replace("/", "__")
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_path = backup_dir / f"{rel_name}.{stamp}.bak.yaml"
    backup_path.write_text(content, encoding="utf-8")
    return backup_path


def _write_storage_backup(
    root: Path, dashboard_path: str, title: str, content: dict[str, Any]
) -> Path:
    """Write a timestamped backup before modifying a storage dashboard."""
    backup_dir = root / ".visual_dashboard_editor_backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    token = dashboard_path.removeprefix(LOVELACE_PATH_PREFIX).replace("/", "_")
    safe_title = "".join(ch if ch.isalnum() else "_" for ch in title).strip("_")
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_path = backup_dir / f"lovelace_{token}_{safe_title}.{stamp}.bak.json"
    backup_path.write_text(
        json.dumps(content, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return backup_path


def _new_yaml() -> Any:
    """Create a ruamel YAML instance when available."""
    try:
        from ruamel.yaml import YAML
    except ImportError:
        return None

    yaml = YAML()
    yaml.preserve_quotes = True
    yaml.indent(mapping=2, sequence=4, offset=2)
    return yaml


def _load_yaml(text: str | None) -> Any:
    """Load YAML with comment-preserving ruamel when possible."""
    if not text:
        return {}
    yaml = _new_yaml()
    if yaml is not None:
        data = yaml.load(text)
    else:
        import yaml as pyyaml

        data = pyyaml.safe_load(text)
    return data if data is not None else {}


def _dump_yaml(data: Any) -> str:
    """Dump YAML."""
    stream = io.StringIO()
    yaml = _new_yaml()
    if yaml is not None:
        yaml.dump(data, stream)
    else:
        import yaml as pyyaml

        stream.write(pyyaml.safe_dump(data, sort_keys=False, allow_unicode=True))
    return stream.getvalue()


def _node_at_path(data: Any, path: list[str | int]) -> Any:
    """Find a nested node by a mixed list/dict path."""
    node = data
    for part in path:
        node = node[part]
    return node


def _find_picture_cards(data: Any) -> list[dict[str, Any]]:
    """Find picture-elements cards anywhere in a Lovelace YAML tree."""
    cards: list[dict[str, Any]] = []

    def walk(node: Any, path: list[str | int]) -> None:
        if isinstance(node, dict):
            if node.get("type") == "picture-elements" and isinstance(
                node.get("elements"), list
            ):
                card_index = len(cards)
                cards.append(_describe_picture_card(node, path, card_index))
            for key, value in node.items():
                walk(value, [*path, key])
        elif isinstance(node, list):
            for index, value in enumerate(node):
                walk(value, [*path, index])

    walk(data, [])
    return cards


def _describe_picture_card(
    card: dict[str, Any], path: list[str | int], card_index: int
) -> dict[str, Any]:
    """Create frontend metadata for one picture-elements card."""
    elements = _describe_picture_elements(card.get("elements", []), [*path, "elements"])

    return {
        "index": card_index,
        "path": path,
        "line": _line_number(card),
        "title": str(card.get("title") or f"Picture elements {card_index + 1}"),
        "image": card.get("image") or card.get("dark_mode_image") or "",
        "elements": elements,
    }


def _describe_picture_elements(
    elements_node: Any, path: list[str | int], parent_label: str | None = None
) -> list[dict[str, Any]]:
    """Describe picture-elements recursively, including conditional children."""
    if not isinstance(elements_node, list):
        return []

    elements: list[dict[str, Any]] = []
    for index, element in enumerate(elements_node):
        if not isinstance(element, dict):
            continue

        element_path = [*path, index]
        label = _element_label(element, index)
        display_label = f"{parent_label} / {label}" if parent_label else label
        elements.append(
            {
                "index": len(elements),
                "path": element_path,
                "line": _line_number(element),
                "label": display_label,
                "config": _plain(element),
                "fragment": _dump_yaml(element).strip(),
                "parent": parent_label,
            }
        )

        child_label = label if element.get("type") == "conditional" else display_label
        elements.extend(
            _describe_picture_elements(
                element.get("elements"),
                [*element_path, "elements"],
                child_label,
            )
        )

    return elements


def _line_number(node: Any) -> int | None:
    """Return a ruamel 1-based line number if available."""
    line_col = getattr(node, "lc", None)
    line = getattr(line_col, "line", None)
    return line + 1 if isinstance(line, int) else None


def _element_label(element: dict[str, Any], index: int) -> str:
    """Build a compact label for an element."""
    for key in ("name", "title", "entity", "icon", "image"):
        value = element.get(key)
        if value:
            return str(value)
    return f"{element.get('type', 'element')} #{index + 1}"


def _plain(value: Any) -> Any:
    """Convert ruamel containers into JSON-friendly Python containers."""
    if isinstance(value, dict):
        return {str(key): _plain(child) for key, child in value.items()}
    if isinstance(value, list):
        return [_plain(child) for child in value]
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)
