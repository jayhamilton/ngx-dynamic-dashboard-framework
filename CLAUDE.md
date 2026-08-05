# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 22 dynamic dashboard framework (ngx-dd-ui) that enables JSON-driven creation of customizable dashboards with drag/drop functionality. The project is based on the open source NGX Dynamic Dashboard Framework and focuses on production line management interfaces.

## Common Commands

- **Development server**: `npm start` or `ng serve` - serves on http://localhost:4200/
- **Build**: `npm run build` or `ng build` - creates production build in `dist/` directory
- **Test**: `npm test` or `ng test` - runs unit tests via Karma/Jasmine
- **Watch build**: `npm run watch` or `ng build --watch --configuration development` - builds with file watching

## Architecture

### Core Concepts

1. **JSON-Driven Configuration**: Dashboard layouts and gadget definitions are driven by JSON configuration files in `src/assets/api/`
2. **Dynamic Component Loading**: Uses Angular's dynamic component loader to create gadgets at runtime
3. **Dynamic Forms**: Property configuration forms are generated dynamically based on JSON schemas

### Key Components

**Gadget System**:
- `GadgetGridCellHostComponent` (`src/app/gadgets/gadget-grid-cell-host/gadget-grid-cell-host.component.ts`) - Factory component that dynamically creates gadget instances. Takes `gadgetData` as a signal `input.required<IGadget>()`; a constructor `effect()` reacts to it, looks up `gadgetData().componentType` in `GADGET_REGISTRY` (`src/app/gadgets/gadget-registry.ts`), dynamically `import()`s and creates that gadget component via `ViewContainerRef.createComponent()`. Each registry entry is a dynamic import (not a static one), so the bundler code-splits every gadget into its own chunk — a gadget type is only downloaded the first time a board actually renders one.
- `GadgetBase` (`src/app/gadgets/common/gadget-common/gadget-base/gadget.base.ts`) - Abstract base class all gadgets extend
- Gadget library defined in `src/assets/api/library.json` - JSON configuration for all available gadgets

**Available Gadgets** (wired into `GADGET_REGISTRY`, see below):
- BarChartComponent, AreaChartComponent, PieChartComponent, BubbleChartComponent (NGX Charts integration)
- NumberCardComponent (KPI tile), LineChartComponent, TableComponent, StatisticComponent, TextComponent (markdown)

**Dynamic Forms**:
- `DynamicFormComponent` - Renders property configuration forms
- Form controls: textbox, dropdown, dropdown-ms, number, date, textarea, upload, hidden, ace-editor, json-forms
- Property definitions in gadget JSON include validation rules

**Layout & Navigation**:
- Multi-board support with dynamic navigation
- Drag/drop layout management
- Board persistence and configuration
- Gadget configuration, board layout selection, the gadget library, and per-gadget help content each open as a side panel (`ConfigPanelComponent`, `SidelayoutComponent`, `LibraryComponent`, `HelpPanelComponent`), not a modal dialog. All four are owned/mutually-exclusive-managed by `SidenavComponent` (`src/app/sidenav/`), which nests a separate `mat-drawer-container` per panel (Material doesn't allow two `mat-drawer`s at the same `position` in one container) and closes whichever panel is open before opening another. Panel open/close is coordinated via `EventService` events (e.g. `emitCloseLibraryPanelEvent`/`listenForCloseLibraryPanelEvent`, `emitConfigPanelClosedEvent`/`listenForConfigPanelClosedEvent`, `emitOpenHelpPanelEvent`/`emitCloseHelpPanelEvent`), not direct method calls, so gadget config state stays in sync even when a panel is closed by a route other than its own button (e.g. opening a different panel).

**Theming**:
- Angular Material M3 theming (`mat.define-theme()`, `mat.core()`) in `src/styles.scss`, with a generated palette in `src/theme-colors.scss` (seed `#3f51b5`).
- `ThemeService` (`src/app/theme/theme.service.ts`) tracks light/dark as a `BehaviorSubject<boolean>`, persisted to `localStorage`, toggled from the toolbar.
- App-level design tokens are CSS custom properties defined for both light and dark (`--app-brand`, `--app-panel-header`, `--app-surface`, `--app-background`, `--app-text-secondary`, `--app-border`, `--app-brand-tint`/`--app-brand-tint-strong`, `--app-brand-contrast`) — prefer these over literal hex colors in component styles so they theme correctly.
- Material's `--mat-sidenav-container-width` / `--mat-sidenav-container-shape` CSS custom properties are the reliable way to override `mat-drawer` sizing/corner-radius; a plain `border-radius`/`width` override loses the specificity fight against Material's own `.mat-drawer.mat-drawer-end` rules.

### Key Files

- `src/app/gadgets/gadget-registry.ts` - Gadget factory registry (add new gadgets here); `src/app/gadgets/gadget-grid-cell-host/gadget-grid-cell-host.component.ts` is the signal-driven host component that consumes it
- `src/assets/api/library.json` - Gadget definitions and property schemas
- `src/app/dynamic-form/` - Dynamic form generation system
- `src/app/board/` - Dashboard board management
- `src/app/layout/` - Layout and grid system

### Adding New Gadgets

1. Create component in `src/app/gadgets/[gadget-name]/`
2. Add a `componentType: () => import(...).then(m => m.YourComponent)` entry to `GADGET_REGISTRY` in `src/app/gadgets/gadget-registry.ts`
4. Set `icon` to a [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons) ligature name (e.g. `"bar_chart"`) — rendered directly as `<mat-icon>`, no image file needed. Gadget instances already placed on a board persist their `icon` value in `localStorage` at add-time, so changing `library.json` later won't retroactively update instances already on a board.

### Dependencies

- Angular 22 with Angular Material
- NGX Charts (@swimlane/ngx-charts) for data visualization
- RxJS for reactive programming
- TypeScript ~6.0.3