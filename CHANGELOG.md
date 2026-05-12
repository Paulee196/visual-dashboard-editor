# Changelog

## 0.2.5

- Force Home Assistant to load the new frontend by changing the custom element name and panel module version.

## 0.2.4

- Bust frontend cache with a versioned panel URL.
- Prefer frontend labels derived from controlled entities, HA friendly names, icons and sensor content.

## 0.2.3

- Improve element labels so custom cards are named by their visible purpose instead of card implementation.
- Add a selectable element list in the left sidebar for overlapped or hard-to-click elements.

## 0.2.2

- Improve the preview for this 3Dplan style: data images, transparent hotspots, icon controls, widgets and element picking.

## 0.2.1

- Expose nested picture-elements children, especially elements inside `conditional` wrappers.

## 0.2.0

- Add support for UI-managed Lovelace storage dashboards.
- Show storage dashboards before raw YAML files in the picker.
- Save storage dashboard element edits through the Home Assistant Lovelace runtime and create JSON backups.

## 0.1.3

- Fix WebSocket command schemas for Home Assistant versions that expect raw dict schemas.

## 0.1.2

- Make panel and websocket registration more conservative for Home Assistant setup compatibility.

## 0.1.1

- Lazy-load Home Assistant runtime dependencies so the config flow can import cleanly.

## 0.1.0

- Initial MVP for YAML `picture-elements` dashboards.
- Sidebar panel with file picker, preview, element inspector, drag positioning, YAML fragment editing and backup-on-save.
