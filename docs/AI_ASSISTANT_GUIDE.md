# AI Assistant Guide

This file helps an AI assistant support a user who installed Visual Dashboard Editor for Home Assistant.

## What This Integration Does

Visual Dashboard Editor is a Home Assistant custom integration for editing Lovelace `picture-elements` dashboards visually. The main use case is a floorplan or 3D plan where each element has YAML properties such as:

- `style.left`
- `style.top`
- `style.width`
- `style.height`
- `style.opacity`
- `style.z-index`
- `style.transform`
- `entity`
- `icon`
- `image`

The editor renders the real dashboard preview and places an invisible edit layer over the rendered `picture-elements` elements. The user can click an element, nudge it, drag it, edit basic fields, or open the advanced YAML fragment.

## First Questions To Ask The User

When the user asks for help changing a dashboard element, ask for the smallest useful context:

1. Which dashboard and `picture-elements` card are they editing?
2. What visible element should change? Ask for its name from the left element list if possible.
3. What should change: position, size, icon, entity, image, opacity, z-index, or YAML fragment?
4. What viewport preset is active if the issue is responsive layout?
5. If clicking is inaccurate, ask them to enable `Show click areas` and describe or screenshot the highlighted area.

## Best User Workflow

1. Open `Visual Dashboard Editor` from the Home Assistant sidebar.
2. Select the dashboard.
3. Select the `picture-elements` card.
4. Use the left element list filters:
   - `Visible now`
   - `Hotspots`
   - `Text/widgets`
   - `Images`
   - `Conditional`
5. Click the element in the preview or in the list.
6. Use inspector fields, drag, or nudge controls.
7. Use `Undo` if the change is wrong.
8. Save the element.

## Useful Troubleshooting

If the wrong element is selected:

- Ask the user to turn on `Show click areas`.
- Check whether a large hotspot overlaps the visible element.
- Check whether the element is inside a `conditional` block.
- Ask whether the expected element is visible in the current Home Assistant state.
- Ask for the selected element name shown in the inspector.

If the mobile or monitor preview does not match the real device:

- Ask for the exact preset and orientation selected in the editor.
- Ask for the real device screenshot.
- Explain that Home Assistant layout depends on CSS viewport pixels, app WebView chrome, browser zoom and device pixel ratio, not only physical inches.

If the user wants an AI to edit YAML directly:

- Ask them to open the target element and copy the advanced YAML fragment.
- Ask for the intended change in plain language.
- Return the minimal YAML change only for that element unless they explicitly ask for broader refactoring.

## Safety Rules For AI Help

- Do not ask the user for Home Assistant tokens, GitHub tokens, private SSH keys or secrets.
- Prefer changing one selected element at a time.
- Recommend using the built-in backup and `Undo` before larger edits.
- Avoid rewriting a full dashboard YAML when only one element needs a small style change.

## Suggested User Phrase

If the user wants help from an AI assistant, they can say:

```text
I am using Visual Dashboard Editor. I selected the element named "...".
Current viewport preset is "...".
I want to change ...
Here is the advanced YAML fragment:
...
```
