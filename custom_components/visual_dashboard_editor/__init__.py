"""Visual editor helpers for YAML Home Assistant dashboards."""

from __future__ import annotations

import copy
from datetime import datetime
import io
import json
import logging
from pathlib import Path
import re
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
    VERSION,
    WS_ADD_ELEMENT,
    WS_DELETE_ELEMENT,
    WS_LIST_FILES,
    WS_LOAD_FILE,
    WS_RESTORE_ELEMENT,
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
                [StaticPathConfig(STATIC_URL, str(panel_dir), cache_headers=False)]
            )
        else:  # pragma: no cover - compatibility for older HA builds
            hass.http.register_static_path(STATIC_URL, str(panel_dir), cache_headers=False)
        domain_data["static_registered"] = True

    if not domain_data.get("panel_registered"):
        await panel_custom.async_register_panel(
            hass,
            webcomponent_name=PANEL_ELEMENT,
            frontend_url_path=PANEL_URL,
            module_url=f"{STATIC_URL}/visual-dashboard-editor.js?v={VERSION}",
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
    add_element_schema = {
        vol.Required("type"): WS_ADD_ELEMENT,
        vol.Required("path"): str,
        vol.Required("card_path"): [vol.Any(str, int)],
        vol.Optional("element"): object,
        vol.Optional("fragment"): str,
    }
    delete_element_schema = {
        vol.Required("type"): WS_DELETE_ELEMENT,
        vol.Required("path"): str,
        vol.Required("element_path"): [vol.Any(str, int)],
    }
    restore_element_schema = {
        vol.Required("type"): WS_RESTORE_ELEMENT,
        vol.Required("path"): str,
        vol.Required("element_path"): [vol.Any(str, int)],
        vol.Required("element"): object,
    }

    for schema, handler in (
        (list_files_schema, _ws_list_files),
        (load_file_schema, _ws_load_file),
        (save_element_schema, _ws_save_element),
        (add_element_schema, _ws_add_element),
        (delete_element_schema, _ws_delete_element),
        (restore_element_schema, _ws_restore_element),
    ):
        decorated = websocket_api.async_response(handler)
        decorated = websocket_api.websocket_command(schema)(decorated)
        websocket_api.async_register_command(hass, decorated)


async def _ws_list_files(
    hass: HomeAssistant,
    connection: Any,
    msg: dict[str, Any],
) -> None:
    """List editable dashboards."""
    try:
        yaml_result = await hass.async_add_executor_job(
            _list_yaml_files, hass.config.path()
        )
        dashboards = await _list_lovelace_dashboards(hass)
        result = {"files": [*dashboards, *yaml_result["files"]]}
    except Exception as err:  # noqa: BLE001 - user-facing websocket error
        _LOGGER.exception("Failed to list dashboards")
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


async def _ws_add_element(
    hass: HomeAssistant,
    connection: Any,
    msg: dict[str, Any],
) -> None:
    """Append a new element to a picture-elements card."""
    try:
        if msg["path"].startswith(LOVELACE_PATH_PREFIX):
            result = await _add_lovelace_element(
                hass,
                msg["path"],
                msg["card_path"],
                msg.get("element"),
                msg.get("fragment"),
            )
        else:
            result = await hass.async_add_executor_job(
                _add_element,
                hass.config.path(),
                msg["path"],
                msg["card_path"],
                msg.get("element"),
                msg.get("fragment"),
            )
    except Exception as err:  # noqa: BLE001 - user-facing websocket error
        _LOGGER.exception("Failed to add dashboard element")
        connection.send_error(msg["id"], "add_failed", str(err))
        return

    connection.send_result(msg["id"], result)


async def _ws_delete_element(
    hass: HomeAssistant,
    connection: Any,
    msg: dict[str, Any],
) -> None:
    """Delete one element from a picture-elements card."""
    try:
        if msg["path"].startswith(LOVELACE_PATH_PREFIX):
            result = await _delete_lovelace_element(
                hass,
                msg["path"],
                msg["element_path"],
            )
        else:
            result = await hass.async_add_executor_job(
                _delete_element,
                hass.config.path(),
                msg["path"],
                msg["element_path"],
            )
    except Exception as err:  # noqa: BLE001 - user-facing websocket error
        _LOGGER.exception("Failed to delete dashboard element")
        connection.send_error(msg["id"], "delete_failed", str(err))
        return

    connection.send_result(msg["id"], result)


async def _ws_restore_element(
    hass: HomeAssistant,
    connection: Any,
    msg: dict[str, Any],
) -> None:
    """Restore a previously deleted picture-elements element."""
    try:
        if msg["path"].startswith(LOVELACE_PATH_PREFIX):
            result = await _restore_lovelace_element(
                hass,
                msg["path"],
                msg["element_path"],
                msg["element"],
            )
        else:
            result = await hass.async_add_executor_job(
                _restore_element,
                hass.config.path(),
                msg["path"],
                msg["element_path"],
                msg["element"],
            )
    except Exception as err:  # noqa: BLE001 - user-facing websocket error
        _LOGGER.exception("Failed to restore dashboard element")
        connection.send_error(msg["id"], "restore_failed", str(err))
        return

    connection.send_result(msg["id"], result)


def _list_yaml_files(config_dir: str) -> dict[str, Any]:
    """Return YAML dashboards with editable picture-elements cards."""
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

        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            text = ""

        if "picture-elements" not in text:
            continue

        try:
            data = _load_yaml(text)
            card_count = len(_find_picture_cards(data))
        except Exception:  # noqa: BLE001 - invalid or partial YAML is not a dashboard
            card_count = 0

        if card_count == 0:
            continue

        files.append(
            {
                "path": rel.as_posix(),
                "source": "yaml",
                "label": rel.as_posix(),
                "kind": "yaml-dashboard",
                "cards": card_count,
                "size": stat.st_size,
                "modified": int(stat.st_mtime),
                "score": 100 + card_count,
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
            card_count = len(cards)
        except Exception:  # noqa: BLE001 - auto-generated or unavailable dashboard
            continue

        if card_count == 0:
            continue

        dashboards.append(
            {
                "path": f"{LOVELACE_PATH_PREFIX}{token}",
                "source": "lovelace",
                "label": f"{title} (UI dashboard)",
                "kind": "storage-dashboard",
                "size": 0,
                "modified": 0,
                "score": 300 + card_count,
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
    _attach_lovelace_preview_urls(cards, dashboard_path, data)

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


def _add_element(
    config_dir: str,
    relative_path: str,
    card_path: list[str | int],
    element: Any | None,
    fragment: str | None,
) -> dict[str, Any]:
    """Append one element to a YAML picture-elements card and save the file."""
    replacement = _new_element_from_payload(element, fragment)

    path = _safe_yaml_path(config_dir, relative_path)
    original = path.read_text(encoding="utf-8")
    data = _load_yaml(original)
    element_path = _append_element_to_card(data, card_path, replacement)

    new_text = _dump_yaml(data)
    backup_path = _write_backup(Path(config_dir).resolve(), path, original)
    path.write_text(new_text, encoding="utf-8")

    loaded = _load_dashboard_file(config_dir, relative_path)
    loaded["backup_path"] = backup_path.relative_to(Path(config_dir).resolve()).as_posix()
    loaded["element_path"] = element_path
    return loaded


def _delete_element(
    config_dir: str,
    relative_path: str,
    element_path: list[str | int],
) -> dict[str, Any]:
    """Delete one element from a YAML dashboard file and save it."""
    path = _safe_yaml_path(config_dir, relative_path)
    original = path.read_text(encoding="utf-8")
    data = _load_yaml(original)
    _remove_element_at_path(data, element_path)

    new_text = _dump_yaml(data)
    backup_path = _write_backup(Path(config_dir).resolve(), path, original)
    path.write_text(new_text, encoding="utf-8")

    loaded = _load_dashboard_file(config_dir, relative_path)
    loaded["backup_path"] = backup_path.relative_to(Path(config_dir).resolve()).as_posix()
    return loaded


def _restore_element(
    config_dir: str,
    relative_path: str,
    element_path: list[str | int],
    element: Any,
) -> dict[str, Any]:
    """Restore one deleted element into a YAML dashboard file."""
    path = _safe_yaml_path(config_dir, relative_path)
    original = path.read_text(encoding="utf-8")
    data = _load_yaml(original)
    restored_path = _insert_element_at_path(data, element_path, element)

    new_text = _dump_yaml(data)
    backup_path = _write_backup(Path(config_dir).resolve(), path, original)
    path.write_text(new_text, encoding="utf-8")

    loaded = _load_dashboard_file(config_dir, relative_path)
    loaded["backup_path"] = backup_path.relative_to(Path(config_dir).resolve()).as_posix()
    loaded["element_path"] = restored_path
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


async def _add_lovelace_element(
    hass: HomeAssistant,
    dashboard_path: str,
    card_path: list[str | int],
    element: Any | None,
    fragment: str | None,
) -> dict[str, Any]:
    """Append one element to a UI-managed Lovelace picture-elements card."""
    replacement = _plain(_new_element_from_payload(element, fragment))

    dashboard, title = _find_lovelace_dashboard(hass, dashboard_path)
    original = copy.deepcopy(await dashboard.async_load(False))
    updated = copy.deepcopy(original)
    element_path = _append_element_to_card(updated, card_path, replacement)

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
    loaded["element_path"] = element_path
    return loaded


async def _delete_lovelace_element(
    hass: HomeAssistant,
    dashboard_path: str,
    element_path: list[str | int],
) -> dict[str, Any]:
    """Delete one element from a UI-managed Lovelace dashboard."""
    dashboard, title = _find_lovelace_dashboard(hass, dashboard_path)
    original = copy.deepcopy(await dashboard.async_load(False))
    updated = copy.deepcopy(original)
    _remove_element_at_path(updated, element_path)

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


async def _restore_lovelace_element(
    hass: HomeAssistant,
    dashboard_path: str,
    element_path: list[str | int],
    element: Any,
) -> dict[str, Any]:
    """Restore one deleted element into a UI-managed Lovelace dashboard."""
    dashboard, title = _find_lovelace_dashboard(hass, dashboard_path)
    original = copy.deepcopy(await dashboard.async_load(False))
    updated = copy.deepcopy(original)
    restored_path = _insert_element_at_path(updated, element_path, _plain(element))

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
    loaded["element_path"] = restored_path
    return loaded


def _new_element_from_payload(element: Any | None, fragment: str | None) -> Any:
    """Create an element mapping from structured JSON or YAML text."""
    if element is None and fragment is None:
        raise ValueError("No element or YAML fragment was provided")

    replacement = _load_yaml(fragment) if fragment is not None else element
    if not isinstance(replacement, dict):
        raise ValueError("The new element must be a YAML mapping/object")
    if not replacement.get("type"):
        raise ValueError("The new element must define a type")
    return replacement


def _append_element_to_card(
    data: Any, card_path: list[str | int], element: Any
) -> list[str | int]:
    """Append an element to a picture-elements card and return its new path."""
    card = _node_at_path(data, card_path)
    if not isinstance(card, dict) or card.get("type") != "picture-elements":
        raise ValueError("Target path is not a picture-elements card")

    elements = card.get("elements")
    if elements is None:
        elements = []
        card["elements"] = elements
    if not isinstance(elements, list):
        raise ValueError("Target picture-elements card has no editable elements list")

    elements.append(element)
    return [*card_path, "elements", len(elements) - 1]


def _remove_element_at_path(data: Any, element_path: list[str | int]) -> Any:
    """Remove an element from an elements list or mapping."""
    parent = _node_at_path(data, element_path[:-1])
    key = element_path[-1]

    if isinstance(parent, list):
        if not isinstance(key, int):
            raise ValueError("Element path does not point to a list item")
        return parent.pop(key)

    if isinstance(parent, dict):
        return parent.pop(key)

    raise ValueError("Element path parent is not editable")


def _insert_element_at_path(
    data: Any, element_path: list[str | int], element: Any
) -> list[str | int]:
    """Insert an element at its previous path and return the real restored path."""
    parent = _node_at_path(data, element_path[:-1])
    key = element_path[-1]

    if isinstance(parent, list):
        if not isinstance(key, int):
            raise ValueError("Element path does not point to a list item")
        index = max(0, min(key, len(parent)))
        parent.insert(index, element)
        return [*element_path[:-1], index]

    if isinstance(parent, dict):
        parent[key] = element
        return element_path

    raise ValueError("Element path parent is not editable")


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
        raise ValueError("YAML file is too large to edit safely")

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


def _attach_lovelace_preview_urls(
    cards: list[dict[str, Any]], dashboard_path: str, data: Any
) -> None:
    """Attach same-origin Lovelace URLs for exact viewport previews."""
    for card in cards:
        preview_url = _lovelace_preview_url(dashboard_path, data, card.get("path", []))
        if preview_url:
            card["preview_url"] = preview_url


def _lovelace_preview_url(
    dashboard_path: str, data: Any, card_path: list[str | int]
) -> str:
    """Build a dashboard URL for the view containing a picture-elements card."""
    token = dashboard_path.removeprefix(LOVELACE_PATH_PREFIX).strip("/")
    base = "/lovelace" if token in {"", "default", "lovelace"} else f"/{token}"
    view_path = _view_path_for_card(data, card_path)
    return f"{base}/{view_path}" if view_path else base


def _view_path_for_card(data: Any, card_path: list[str | int]) -> str:
    """Infer the Lovelace view path from a card path."""
    if not (
        isinstance(data, dict)
        and isinstance(data.get("views"), list)
        and len(card_path) >= 2
        and card_path[0] == "views"
        and isinstance(card_path[1], int)
    ):
        return ""

    view_index = card_path[1]
    try:
        view = data["views"][view_index]
    except (IndexError, TypeError):
        return ""
    if not isinstance(view, dict):
        return ""
    return str(view.get("path") or view_index).strip("/")


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
        "config": _plain(card),
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
        elements.append(
            {
                "index": len(elements),
                "path": element_path,
                "line": _line_number(element),
                "label": label,
                "config": _plain(element),
                "fragment": _dump_yaml(element).strip(),
                "parent": parent_label,
            }
        )

        child_label = label if element.get("type") == "conditional" else parent_label
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
    if element.get("type") == "conditional":
        conditions = element.get("conditions")
        if isinstance(conditions, list) and conditions:
            first = conditions[0]
            if isinstance(first, dict) and first.get("entity"):
                state = first.get("state") or first.get("state_not")
                entity = _humanize_entity_id(str(first["entity"]))
                suffix = f" {state}" if state else ""
                return f"Podmínka: {entity}{suffix}"

    card_type = element.get("card_type")
    if card_type:
        custom_label = _label_from_custom_content(element)
        if custom_label:
            return custom_label

        name = element.get("name")
        if name:
            return str(name)

        custom_fields = element.get("custom_fields")
        if isinstance(custom_fields, dict):
            for field_name in ("title", "name", "main", "body"):
                field_label = _label_from_field(custom_fields.get(field_name))
                if field_label:
                    return field_label

        if card_type == "horizontal-stack":
            stack_label = _label_from_stack(element)
            if stack_label:
                return stack_label
        if "calendar" in str(card_type):
            return "Kalendář"

        entity = element.get("entity")
        if entity:
            return _humanize_entity_id(str(entity))
        icon = element.get("icon")
        if icon:
            return _humanize_icon(str(icon))
        return _humanize_card_type(str(card_type))

    if element.get("type") == "image":
        image_label = _label_from_image(element.get("image"))
        if image_label:
            return image_label

    for key in ("name", "title", "entity", "icon", "image"):
        value = element.get(key)
        if value:
            if key == "entity":
                return _humanize_entity_id(str(value))
            if key == "icon":
                return _humanize_icon(str(value))
            if key == "image":
                return _label_from_image(value) or str(value)
            return str(value)
    return f"{element.get('type', 'element')} #{index + 1}"


def _label_from_custom_content(element: dict[str, Any]) -> str | None:
    """Infer a user-facing label from custom card content."""
    haystack = json.dumps(_plain(element), ensure_ascii=False)
    lowered = haystack.lower()

    known_fragments = (
        ("mhd_skola_snp", "Škola SNP MHD"),
        ("status-line", "Stav domácnosti"),
        ("outside-row", "Venkovní klima"),
        ("teplota_obyvak", "Obývák klima"),
        ("loznice_teplota", "Ložnice klima"),
        ("senzor_kvality_vzduchu_loznice", "Ložnice klima"),
        ("presence_multi_sensor_fp300", "Koupelna klima"),
        ("pracka_vykon", "Pračka / sušička"),
        ("susicka_vykon", "Pračka / sušička"),
        ("batteryids", "Baterie"),
        ("availabilityids", "Dostupnost zařízení"),
        ("hosti_pin", "Nastavení hostů"),
    )
    for needle, label in known_fragments:
        if needle in lowered:
            return label

    return None


def _label_from_field(value: Any) -> str | None:
    """Extract a readable label from a custom field value."""
    if not isinstance(value, str):
        return None

    stripped = value.strip()
    if not stripped:
        return None

    if "[[[" not in stripped and "{%" not in stripped and "{{" not in stripped:
        cleaned = re.sub(r"<[^>]+>", " ", stripped)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned[:60] if 1 < len(cleaned) <= 60 else None

    for pattern in (
        r"return\s+[`'\"]([^`'\"]{2,60})[`'\"]",
        r"title:\s*[`'\"]([^`'\"]{2,60})[`'\"]",
    ):
        match = re.search(pattern, stripped)
        if match:
            return match.group(1).strip()

    return None


def _label_from_stack(element: dict[str, Any]) -> str | None:
    """Infer labels for horizontal/vertical stacks."""
    cards = element.get("cards")
    if not isinstance(cards, list):
        return None

    entities = [
        str(card.get("entity"))
        for card in cards
        if isinstance(card, dict) and card.get("entity")
    ]
    if entities and all(entity.startswith("person.") for entity in entities):
        return "Osoby"
    if entities:
        return ", ".join(_humanize_entity_id(entity) for entity in entities[:2])
    return None


def _label_from_image(value: Any) -> str | None:
    """Infer labels for image elements."""
    if not value:
        return None
    image = str(value)
    lowered = image.lower()
    if lowered.startswith("data:image") and "fill='black'" in lowered:
        return "Levý panel pozadí"
    name = Path(image.split("?", 1)[0]).stem
    if not name:
        return None
    name = name.removeprefix("Planek-").removeprefix("planek-")
    return _humanize_identifier(name)


def _humanize_card_type(card_type: str) -> str:
    """Make a card type readable."""
    value = card_type.removeprefix("custom:").replace("-", " ")
    return value.capitalize()


def _humanize_icon(icon: str) -> str:
    """Make an icon id readable."""
    icon_map = {
        "mdi:robot-vacuum": "Bob",
        "mdi:television": "TV",
        "mdi:lock": "Otevírání dveří",
        "mdi:music": "Hudba",
        "mdi:cog": "Nastavení",
        "mdi:lightning-bolt": "Energie",
        "mdi:washing-machine": "Pračka / sušička",
    }
    if icon in icon_map:
        return icon_map[icon]
    return _humanize_identifier(icon.removeprefix("mdi:"))


def _humanize_entity_id(entity_id: str) -> str:
    """Make an entity id readable without requiring HA state access."""
    if "." in entity_id:
        entity_id = entity_id.split(".", 1)[1]
    entity_id = entity_id.removesuffix("_group")
    return _humanize_identifier(entity_id)


def _humanize_identifier(value: str) -> str:
    """Turn ids, file names and icon names into compact Czech-ish labels."""
    cleaned = re.sub(r"[^0-9A-Za-zÀ-ž]+", " ", value).strip()
    words = cleaned.split()
    replacements = {
        "obyvak": "Obývák",
        "loznice": "Ložnice",
        "kuchyn": "Kuchyň",
        "koupelna": "Koupelna",
        "zachod": "Záchod",
        "pracovna": "Pracovna",
        "svetla": "Světla",
        "svetlo": "Světlo",
        "vypinac": "Vypínač",
        "hosti": "Hosté",
        "otevirani": "Otevírání",
        "dveri": "dveří",
        "mhd": "MHD",
        "skola": "Škola",
        "snp": "SNP",
        "next": "odjezdy",
        "time": "Čas",
        "vykon": "výkon",
        "susicka": "sušička",
        "pracka": "pračka",
    }
    readable = [replacements.get(word.lower(), word) for word in words]
    return " ".join(readable).strip() or value


def _plain(value: Any) -> Any:
    """Convert ruamel containers into JSON-friendly Python containers."""
    if isinstance(value, dict):
        return {str(key): _plain(child) for key, child in value.items()}
    if isinstance(value, list):
        return [_plain(child) for child in value]
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)
