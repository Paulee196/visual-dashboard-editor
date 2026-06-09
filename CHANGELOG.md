# Changelog

## 0.3.13

- Use the real Lovelace dashboard iframe again for UI-managed dashboard previews, inside the fixed device viewport.
- Apply draft `picture-elements` changes into the iframe card when possible, keeping live inspector updates while preserving real dashboard responsive layout.
- Add a custom physical display preset that converts physical pixels and DPR into the CSS viewport used by Home Assistant.
- Add physical resolution and DPR metadata to every preview preset, including Galaxy S22 Ultra QHD+/FHD+.

## 0.3.12

- Preserve the fixed device viewport after the live preview card mounts or fails to mount.
- Re-apply the selected preview width and height after live render refreshes so the stage cannot fall back to content-driven sizing.

## 0.3.11

- Make the preview stage a fixed-size viewport that always uses the selected device preset width and height.
- Scale the fixed viewport visually in fit mode without changing the CSS size used by the rendered dashboard card.

## 0.3.10

- Render the editable preview from the current draft card instead of the saved dashboard iframe, so name and other inspector edits update live before saving.
- Make phone/tablet presets scale to the rendered `picture-elements` card height instead of forcing the full device viewport height as the card height.

## 0.3.9

- Update inspector fields live while typing or choosing values, including name, entity, icon, opacity, z-index, transform, image, text color and background color.
- Add palette buttons for inspector color fields and a transparent background toggle for selected elements.
- Keep live edits grouped into a single undo step per field interaction.

## 0.3.8

- Make the preview toolbar more compact, especially the `picture-elements` card selector.
- Allow toolbar controls to wrap more naturally on narrower editor widths.

## 0.3.7

- Prevent the dashboard picker panel from starting hidden when no dashboard draft is restored.
- Add a recovery `Show dashboards` action to the empty preview state.

## 0.3.6

- Persist the currently loaded dashboard draft in browser storage, including unsaved element changes, selected card, selected element, YAML fragment text, undo stack and preview settings.
- Restore the draft automatically when Home Assistant recreates the panel after browser idle time, reconnects or frontend refreshes.

## 0.3.5

- Add draggable column dividers for resizing the dashboard/elements panel and inspector panel.
- Add a dashboard panel hide/show toggle to free more preview space on smaller screens.
- Move the `+ Add element` action into the central preview area below the dashboard preview.

## 0.3.4

- Add a `name` field to the inspector, so the selected element display name can be edited without opening YAML.
- Add drag resize handles to the selected preview element for direct width/height editing.
- Make inspector editing segments vertically resizable for more flexible work in the right panel.

## 0.3.3

- Make the basic add-element flow always create a `custom:button-card`.
- Add a transparent background option next to the new element background color control.
- Make resize controls use the same four-button footprint as the nudge controls.

## 0.3.2

- Restore the release workflow to the original tag-only publishing flow used by previous working releases.
- Keep the delete/restore functionality from `0.3.0`.

## 0.3.1

- Make the release workflow run from `main` pushes as well as tag pushes, so HACS releases can be created even if a tag event does not publish a GitHub Release.
- Keep the delete/restore functionality from `0.3.0`.

## 0.3.0

- Add a `Delete` action in the inspector for removing the selected `picture-elements` element.
- Create a backup before deleting YAML and UI-managed Lovelace elements.
- Extend `Undo` so a deleted element can be restored to its previous position in the element list.

## 0.2.23

- Add inspector size controls for shrinking/growing the selected element by 0.1% or 1%.
- Support separate width, height and whole-element resize actions.
- Add a `Current size as %` action that converts the rendered element size into percentages relative to the picture-elements plan, making the element scale more naturally across monitor and phone previews.

## 0.2.22

- Add a `+ Add element` action in the editor that can append a new element to the current `picture-elements` card.
- Add a basic create form for common element types and a YAML mode for direct AI/user-authored element snippets.
- Add a backend `add_element` websocket command for both YAML dashboards and UI-managed Lovelace dashboards, with backups before saving.
- Add English and German GitHub README pages and a language selector at the top of the Czech README.

## 0.2.21

- Keep locally edited element position and size active in the editor preview until the element is saved, so nudge buttons and percent fields visibly move the selected element immediately.
- Apply local style changes to the rendered Lovelace preview when possible, instead of letting the periodic hitbox measurement snap the element back to the saved dashboard state.
- Allow positioned `image` layers with `pointer-events: none` to stay selectable in the editor, which makes large decorative/editable panels such as a left sidebar image adjustable again.
- Add simple inspector controls for `style.color` and `style.background` with both a color picker and a CSS text value.

## 0.2.20

- Add a `Show click areas` toggle that visualizes the real editor hitboxes when selection feels off.
- Add inspector nudge controls for moving the selected element by 0.1% or 1%, plus keyboard arrow support.
- Add undo for the last local edit before saving.
- Add element list filters for visible elements, hotspots, widgets, images and conditional elements.
- Add an AI assistant guide with the context an assistant should ask for when helping users edit a dashboard.

## 0.2.19

- Add frontend localization that follows the Home Assistant language setting via `hass.locale.language`.
- Localize the editor UI, status messages, preview controls, inspector labels and generated element names for Czech, English and German, with English fallback for unsupported languages.
- Add English and German config flow translations.

## 0.2.18

- Measure editor hitboxes from Home Assistant's rendered `.element` nodes inside `picture-elements`, so large auto-height widgets such as calendar, transit and status panels are clickable across their full visible area.
- Align drag math to the measured edit overlay instead of the whole preview viewport.
- Hide inactive conditional element hitboxes from the preview/list to avoid invisible duplicates catching clicks.

## 0.2.17

- Align invisible editor hitboxes to the actually rendered `picture-elements` card inside the Lovelace iframe instead of the whole preview viewport.
- Keep the overlay bounds in sync while the iframe loads so right-side widgets such as transit schedules use the correct target area.

## 0.2.16

- Restore native per-element overlay hit targets from the earlier framed editor, but keep the hitbox borders invisible.
- Keep only hover/selected labels visible so the dashboard preview stays clean while clicking follows the old reliable target boxes.

## 0.2.15

- Replace native overlay button hit-testing with a custom point picker that prefers visible widgets over large invisible hotspots.
- Limit the dashboard picker to UI dashboards and YAML dashboards that actually contain editable `picture-elements` cards.
- Polish visible Czech UI text with diacritics.

## 0.2.14

- Make preview element selection more accurate by letting YAML `pointer-events: none` layers pass clicks through in the editor overlay.
- Keep the original pointer offset while dragging so large clickable zones no longer jump under the cursor.
- Apply element `z-index` in the editor overlay so overlapping click targets follow the dashboard stacking order more closely.

## 0.2.13

- Add a preview scale selector with a whole-dashboard fit mode and an exact 1:1 CSS viewport mode.
- Keep large monitor and phone previews contained inside the editor while allowing exact viewport comparison between Full HD, QHD and 4K presets.

## 0.2.12

- Use the real Lovelace view URL for UI dashboard previews so viewport-dependent CSS, `vw` units and media queries behave like the official dashboard.
- Keep the previous card renderer as fallback for raw YAML files and cases without a Lovelace preview URL.

## 0.2.11

- Allow small phone and tablet previews to upscale visually in the editor while keeping their selected logical viewport size.

## 0.2.10

- Fit large virtual display previews into the available editor area so the full dashboard stays visible.
- Add a Samsung Ultra 6.8" phone preset for Galaxy S22/S23/S24 Ultra style viewports.
- Remove the yellow nested-element outlines from the edit overlay.

## 0.2.9

- Restore the normal Home Assistant card preview instead of the iframe viewport experiment.
- Rename viewport presets to inch-based phone, tablet and screen sizes, focused on iPhone/Samsung-style sizes.

## 0.2.8

- Render the real card inside an internal viewport preview so width-based responsive CSS behaves closer to phone and tablet screens.
- Make the edit overlay transparent by default, leaving only hover/selected labels instead of visible frames.
- Add more phone, tablet and display viewport presets with a portrait/landscape orientation selector.
- Add an expanded modal editor for long advanced YAML fragments.

## 0.2.7

- Render the selected picture-elements card through Home Assistant's real card renderer, with a thin edit layer on top.
- Keep the left element list focused on positioned elements only.
- Add preview width presets for desktop, Full HD, tablet and mobile layout checks.

## 0.2.6

- Remove the duplicate element picker above the preview.
- Render preview elements as consistent editor chips instead of mixed card-like shapes.
- Prefer explicit titles and status content when naming elements, so the household status bar is not mislabeled as the vacuum.

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
