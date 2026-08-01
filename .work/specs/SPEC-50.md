# Spec: Move the configuration to the side panel
**Issue**: #50
**Date**: 2025-08-01

## Approach

Currently, when a user clicks "Configure" in a gadget's header menu, the gadget card flips into config mode (`inConfig = true`) and the `<app-dynamic-form>` is rendered **inline inside the gadget card** — replacing the gadget's chart/content.

The story asks to move that configuration UI to a **side panel** (a `mat-drawer` on the right side), so the gadget keeps its content visible and the form slides in from the side.

### Implementation strategy

1. **Add a new event pair** to `EventService` — `emitOpenConfigPanelEvent` / `listenForOpenConfigPanelEvent` — that carries the gadget's `propertyPages`, `instanceId`, `tags`, and a callback for `updatePropertiesEvent`.

2. **Create a new `ConfigPanelComponent`** (`src/app/config-panel/`) that:
   - Hosts an `<app-dynamic-form>` for the selected gadget.
   - Listens for the open-config event and populates itself with the incoming data.
   - Listens for a close-config event and clears itself.

3. **Modify `SidenavComponent`** to add a third `mat-drawer` (`position="end"`) that contains `<app-config-panel>`, and opens/closes it in response to the open/close events from `EventService`.

4. **Modify `GadgetHeaderComponent`** so that when the user clicks "Configure", instead of calling `toggleConfigModeEvent.emit()` (which switches `inConfig` in the gadget), it emits the new `openConfigPanel` event through `EventService`, carrying the gadget data needed to populate the side panel.

5. **Modify each gadget component** (line-chart, area-chart, bar-chart, pie-chart, bubble-chart, number-card) so that:
   - They still listen to `toggleConfigModeEvent` for backward-compat toggle, but the primary path opens the side panel.
   - The `@if (inConfig)` block for the inline `<app-dynamic-form>` is **removed** from each gadget template (config is now exclusively in the side panel).
   - The gadgets expose a method for receiving property updates that the panel can call via the event.

### Simplified approach (minimal-risk)

Given the scope, we will use the existing `EventService` pattern:

- Add `emitOpenConfigPanelEvent(event)` and `listenForOpenConfigPanelEvent()` to `EventService`.
- Add `emitCloseConfigPanelEvent()` and `listenForCloseConfigPanelEvent()` to `EventService`.
- Create a new standalone `ConfigPanelComponent` that hosts the dynamic form.
- Add it as a third `mat-drawer` (position=end) inside `SidenavComponent`.
- In `GadgetHeaderComponent.toggleConfigMode()`, emit `openConfigPanel` instead of (or in addition to) the existing emit — carrying the gadget's context via a new `@Input` on the header.
- Each gadget passes its own data to the header so the header can relay it to the panel event.
- The inline `@if (inConfig)` config blocks inside gadget templates are removed.

## Files to Change

- `src/app/eventservice/event.service.ts`: Add `openConfigPanel` and `closeConfigPanel` Subject/emit/listen pairs.
- `src/app/config-panel/config-panel.component.ts` (**new**): Standalone component that listens for the open-config event and renders `<app-dynamic-form>`.
- `src/app/config-panel/config-panel.component.html` (**new**): Template with a header, the dynamic form, and a close button.
- `src/app/config-panel/config-panel.component.scss` (**new**): Panel styling.
- `src/app/sidenav/sidenav.component.ts`: Import `ConfigPanelComponent`; add a third `mat-drawer` reference; subscribe to open/close panel events.
- `src/app/sidenav/sidenav.component.html`: Add a third `mat-drawer` (position=end) containing `<app-config-panel>`.
- `src/app/gadgets/common/gadget-common/gadget-header/gadget-header.component.ts`: Accept `@Input() gadgetData` (propertyPages, instanceId, tags, a `propertyChangeCallback`); emit `openConfigPanel` event via `EventService` rather than only emitting `toggleConfigModeEvent`.
- `src/app/gadgets/common/gadget-common/gadget-header/gadget-header.component.html`: No structural changes needed (button stays the same).
- `src/app/gadgets/line-chart/line-chart.component.html`: Remove the `@if (inConfig)` dynamic-form block.
- `src/app/gadgets/line-chart/line-chart.component.ts`: Pass gadget data to header; wire `propertyChangeEvent` through the panel.
- `src/app/gadgets/area-chart/area-chart.component.html`: Remove the `@if (inConfig)` dynamic-form block.
- `src/app/gadgets/area-chart/area-chart.component.ts`: Pass gadget data to header.
- `src/app/gadgets/bar-chart/bar-chart.component.html`: Remove `@if (inConfig)` block.
- `src/app/gadgets/bar-chart/bar-chart.component.ts`: Pass gadget data to header.
- `src/app/gadgets/pie-chart/pie-chart.component.html`: Remove `@if (inConfig)` block.
- `src/app/gadgets/pie-chart/pie-chart.component.ts`: Pass gadget data to header.
- `src/app/gadgets/bubble-chart/bubble-chart.component.html`: Remove `@if (inConfig)` block.
- `src/app/gadgets/bubble-chart/bubble-chart.component.ts`: Pass gadget data to header.
- `src/app/gadgets/number-card/number-card.component.html`: Remove `@if (inConfig)` block.
- `src/app/gadgets/number-card/number-card.component.ts`: Pass gadget data to header.

## Files NOT to Change

- `src/app/dynamic-form/dynamic-form.component.ts` / `.html`: The form itself is reused as-is inside the new panel; no changes needed.
- `src/app/gadgets/common/gadget-common/gadget-base/gadget.base.ts`: The `inConfig` flag is kept for backward compatibility (`isMissingPropertyValue` auto-open), but the inline display of the form is removed from templates.
- `src/assets/api/library.json`: Gadget definitions unchanged.
- `src/app/board/`: Board management unchanged.

## Risks / Assumptions

- **`inConfig` flag**: Still used by `GadgetBase.initializeConfiguration()` to auto-open config when required properties are missing. The panel will still be opened by the gadget emitting the open event when `inConfig` is true on load.
- **Property update routing**: The side panel receives `propertyChangeCallback` from the event payload; this callback is the gadget's own `propertyChangeEvent` method. This keeps the existing save logic inside each gadget.
- **Panel not multiplex**: Only one gadget can be configured at a time. Opening config for a second gadget replaces the first.
- **Closing**: The panel's close button emits `closeConfigPanel`. The sidenav listens and closes the drawer. The individual gadget's `inConfig` is also reset via a close event.
- QA should verify that all 6 gadget types open the panel correctly, that saving properties persists, and that the panel closes cleanly.
