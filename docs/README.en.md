# Visual Dashboard Editor

**Language:** [Čeština](../README.md) | English | [Deutsch](README.de.md)

Visual Dashboard Editor is a Home Assistant custom integration for editing Lovelace `picture-elements` dashboards visually. It is aimed mainly at floorplan and 3D plan dashboards where moving one element in a large YAML file is slow and error-prone.

## What It Does

- Adds a `Visual Dashboard Editor` sidebar panel to Home Assistant.
- Finds UI/storage dashboards and YAML dashboards that contain editable `picture-elements` cards.
- Renders the real Lovelace dashboard preview with an editor layer above it.
- Lets you click an element, edit its position, size, entity, icon, image, opacity, z-index, color, background and transform.
- Lets you move the selected element with drag, nudge buttons or keyboard arrows.
- Lets you resize the selected element with buttons and convert the rendered size to responsive percentages.
- Shows click areas for troubleshooting selection.
- Supports undo for the last local edit before saving.
- Adds new `picture-elements` elements with the `+` button, either through a basic form or direct YAML.
- Deletes the selected element and can restore it with `Undo`.
- Saves the selected element back into the dashboard and creates a backup first.

## Quick Install

[![Open your Home Assistant instance and open this repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Paulee196&repository=visual-dashboard-editor&category=integration)

After installing and restarting Home Assistant, add the integration here:

[![Open your Home Assistant instance and start setting up Visual Dashboard Editor.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=visual_dashboard_editor)

## Notes

The Home Assistant panel follows the language configured in Home Assistant. GitHub Markdown cannot automatically switch the visible README language, so this repository provides separate language links at the top of each README.
