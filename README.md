# 🎛️ Visual Dashboard Editor for Home Assistant

[![GitHub Release](https://img.shields.io/github/v/release/Paulee196/visual-dashboard-editor?style=flat-square)](https://github.com/Paulee196/visual-dashboard-editor/releases)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://github.com/hacs/integration)
[![Downloads](https://img.shields.io/github/downloads/Paulee196/visual-dashboard-editor/total?style=flat-square)](https://github.com/Paulee196/visual-dashboard-editor/releases)

Edit Home Assistant Lovelace `picture-elements` dashboards visually - built for floorplans and 3D plan dashboards where moving one element inside a large YAML file is slow and easy to get wrong. Open the editor from the sidebar, click an element in the rendered dashboard preview, adjust it in the inspector and save it back with a backup.

[![Open your Home Assistant instance and add this repository to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Paulee196&repository=visual-dashboard-editor&category=integration)
[![Open your Home Assistant instance and start setting up the integration](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=visual_dashboard_editor)

## ✨ Features

- **Sidebar visual editor** - edit `picture-elements` dashboards directly from Home Assistant
- **Real Lovelace preview** - UI-managed dashboards render inside the actual dashboard iframe with an editor overlay
- **YAML dashboard support** - raw YAML dashboards are detected when they contain editable `picture-elements` cards
- **Inspector editing** - update `entity`, `name`, `icon`, `image`, position, size, opacity, z-index, color, background and transform
- **Drag, nudge and resize** - move elements with the mouse, buttons, keyboard arrows or resize handles
- **Responsive sizing tools** - convert the currently rendered size into percentage-based width and height
- **Device preview presets** - phone, tablet and display presets use physical resolution + DPR metadata to calculate the CSS viewport
- **Custom physical display** - enter your own physical resolution and DPR for exact device matching
- **Element management** - add new `picture-elements` entries, delete the selected element and restore it with undo
- **Filtering and hitboxes** - filter by visible elements, hotspots, widgets, images or conditions and show real click areas
- **Draft persistence** - restores the last open dashboard, undo stack and unsaved local changes after the panel is recreated
- **Safe saves** - creates timestamped backups before modifying storage or YAML dashboards
- **Localized UI** - Czech, English and German strings follow your Home Assistant language

## 📦 Installation

### HACS (recommended)

1. HACS → ⋮ → **Custom repositories** → add `Paulee196/visual-dashboard-editor` (type: *Integration*)
2. Search for **Visual Dashboard Editor** and download it
3. Restart Home Assistant
4. **Settings → Devices & Services → Add Integration** → search for **Visual Dashboard Editor**
5. Open **Visual Dashboard Editor** from the Home Assistant sidebar

### Manual

1. Copy `custom_components/visual_dashboard_editor` into `/config/custom_components/`
2. Restart Home Assistant
3. Add the integration from **Settings → Devices & Services**, or add this to `configuration.yaml`:

```yaml
visual_dashboard_editor:
```

4. Restart Home Assistant and open the sidebar panel

## 🖼️ Editing dashboards

Open **Visual Dashboard Editor** in the sidebar, pick a UI/storage dashboard or a YAML dashboard and click **Load**. If the dashboard contains multiple `picture-elements` cards, choose the card you want to edit from the toolbar. Click an element in the preview, change values in the inspector, drag or resize it in the overlay and save when the local changes look right.

The editor is intentionally focused on `picture-elements` because that is the card type most commonly used for floorplans, 3D home views and layered dashboard layouts.

## 📱 Device previews

Preview presets are calculated the same way a browser lays out the dashboard:

```text
CSS viewport = physical resolution / devicePixelRatio
```

For example, a phone rendering at `2316 x 1080` with `DPR 2.625` produces roughly `882 x 411` CSS pixels in landscape. The preview frame is then fixed to that CSS viewport and only visually scaled to fit the editor workspace.

## 🗂 Dashboard data

The editor works with `picture-elements` cards such as:

```yaml
type: picture-elements
image: /local/floorplan.png
elements:
  - type: state-icon
    entity: light.kitchen
    style:
      left: 42%
      top: 58%
```

UI-managed dashboards are saved through the Home Assistant Lovelace runtime. YAML dashboards are loaded from files inside the Home Assistant config directory and are written back with `ruamel.yaml`.

## 🛡 Safety model

- The panel requires Home Assistant admin access.
- YAML paths must stay inside the Home Assistant config directory.
- Only `.yaml` and `.yml` files are editable.
- Large YAML files are rejected instead of being modified blindly.
- Every save creates a backup in `.visual_dashboard_editor_backups`.
- YAML saves try to preserve the surrounding file, but formatting or comments inside the edited element may change.

## 🧱 Repository layout

```text
custom_components/visual_dashboard_editor/
  __init__.py                  WebSocket API, dashboard loading and saving
  config_flow.py               UI setup entry point
  const.py                     version and panel constants
  manifest.json                Home Assistant integration metadata
  strings.json                 config flow strings
  translations/                localized Home Assistant strings
  www/visual-dashboard-editor.js
                               sidebar panel, preview, inspector and editor UI
.github/workflows/release.yml  GitHub release workflow
docs/AI_ASSISTANT_GUIDE.md     notes for AI-assisted dashboard editing
examples/                      example picture-elements YAML
```

## 🗺 Roadmap

- Redo
- Diff before saving
- Search elements by entity
- Better support for `custom:config-template-card`
- Optional dashboard resource with a small **Visual edit** button inside normal dashboards

---

<details>
<summary>🇨🇿 <strong>Rychlý start česky</strong></summary>

1. **HACS** → Custom repositories → přidejte `Paulee196/visual-dashboard-editor` jako *Integration*, stáhněte a restartujte Home Assistant.
2. **Nastavení → Zařízení a služby → Přidat integraci → Visual Dashboard Editor**.
3. V levém menu otevřete **Visual Dashboard Editor**.
4. Vyberte UI/storage dashboard nebo YAML dashboard, který obsahuje kartu `picture-elements`.
5. Klikněte na prvek ve floorplanu, upravte hodnoty v inspectoru nebo ho přesuňte myší.
6. Po kontrole klikněte na **Uložit**. Před zápisem se vytvoří backup.

Editor je určený hlavně pro floorplany a 3D plány. U YAML souborů se snaží zachovat zbytek souboru, ale uvnitř upraveného prvku se může změnit ruční formátování nebo komentáře.

</details>

<details>
<summary>🇩🇪 <strong>Kurzstart auf Deutsch</strong></summary>

1. **HACS** → Custom repositories → `Paulee196/visual-dashboard-editor` als *Integration* hinzufügen, herunterladen und Home Assistant neu starten.
2. **Einstellungen → Geräte & Dienste → Integration hinzufügen → Visual Dashboard Editor**.
3. Öffne **Visual Dashboard Editor** in der Seitenleiste.
4. Wähle ein UI-/Storage-Dashboard oder ein YAML-Dashboard mit einer `picture-elements`-Karte.
5. Klicke ein Element im Floorplan an, ändere Werte im Inspector oder verschiebe es mit der Maus.
6. Nach der Kontrolle auf **Speichern** klicken. Vor dem Schreiben wird ein Backup erstellt.

</details>
