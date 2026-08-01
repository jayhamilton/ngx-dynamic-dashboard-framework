## Implementation Summary
**Spec**: .work/specs/SPEC-50.md

### Changes Made
- `src/app/eventservice/event.service.ts`: Added `emitOpenConfigPanelEvent` / `listenForOpenConfigPanelEvent` and `emitCloseConfigPanelEvent` / `listenForCloseConfigPanelEvent` Subject pairs to support the side panel communication.
- `src/app/config-panel/config-panel.component.ts` (**new**): Standalone component that subscribes to open/close config panel events, holds the current gadget's `propertyPages`, `tags`, `instanceId`, and a `propertyChangeCallback`. Renders `<app-dynamic-form>` in the side panel.
- `src/app/config-panel/config-panel.component.html` (**new**): Template with a styled header (gadget title + close button) and the dynamic form body.
- `src/app/config-panel/config-panel.component.scss` (**new**): Panel styling — 380px wide, primary-color header, scrollable body.
- `src/app/sidenav/sidenav.component.ts`: Imported `ConfigPanelComponent`; added `@ViewChild('configPanel')` reference; subscribed to open/close panel events to call `configPanel.open()` / `configPanel.close()`.
- `src/app/sidenav/sidenav.component.html`: Added a third `mat-drawer` (`#configPanel`, `mode="over"`, `position="end"`) containing `<app-config-panel>`.
- `src/app/gadgets/common/gadget-common/gadget-header/gadget-header.component.ts`: Added `@Input()` properties `gadgetInstanceId`, `gadgetPropertyPages`, `gadgetTags`, and `propertyChangeCallback`. In `toggleConfigMode()`, the header now also emits `openConfigPanelEvent` via `EventService` carrying all gadget context.
- `src/app/gadgets/line-chart/line-chart.component.html` + `.ts`: Removed inline `@if (inConfig)` dynamic-form block; added the four new header inputs; removed `DynamicFormComponent` from imports.
- `src/app/gadgets/area-chart/area-chart.component.html` + `.ts`: Same changes as line-chart.
- `src/app/gadgets/bar-chart/bar-chart.component.html` + `.ts`: Same changes as line-chart.
- `src/app/gadgets/pie-chart/pie-chart.component.html` + `.ts`: Same changes as line-chart.
- `src/app/gadgets/bubble-chart/bubble-chart.component.html` + `.ts`: Same changes as line-chart.
- `src/app/gadgets/number-card/number-card.component.html` + `.ts`: Same changes as line-chart.

### Acceptance Criteria Coverage
- [ ] Configuration UI moves to side panel: Clicking "Configure" in any gadget header now opens an `mat-drawer` overlay panel on the right side of the screen, containing the full dynamic form for that gadget.
- [ ] Gadget content remains visible: The `@if (inConfig)` blocks have been removed from all six gadget templates — the chart is always rendered; the config panel slides over from the right without replacing the chart.
- [ ] Panel closes cleanly: The panel has a close button (×) in its header that calls `EventService.emitCloseConfigPanelEvent()`, which the sidenav listens to and closes the drawer.
- [ ] Property changes persist: The `propertyChangeCallback` passed through the event carries the gadget's own `propertyChangeEvent` method, so saving still calls `boardService.savePropertyPageConfigurationToDestination()` exactly as before.
- [ ] All six gadget types supported: line-chart, area-chart, bar-chart, pie-chart, bubble-chart, number-card.

### QA Notes
- Open each of the six gadget types and click the ⋮ menu → "Configure". The right-side panel should slide in with the gadget's title in the header and its property form below.
- Edit a property (e.g. chart title) and click "Save" in the form. Verify the gadget title updates immediately and the change persists after page refresh.
- Click the × button in the panel header to close the panel. Verify the drawer closes and the gadget is still rendering its chart.
- Opening config on a second gadget while the panel is already open should replace the panel contents with the new gadget's form.
- The layout panel (board layout picker) still works via its own separate drawer.
- Drag-and-drop on gadget cards should remain functional (the `[cdkDragDisabled]="inConfig"` binding has been removed since gadgets no longer go into a "frozen" config mode — QA should verify drag still works as expected).
