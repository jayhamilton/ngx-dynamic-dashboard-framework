# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 19 dynamic dashboard framework (ngx-dd-ui) that enables JSON-driven creation of customizable dashboards with drag/drop functionality. The project is based on the open source NGX Dynamic Dashboard Framework and focuses on production line management interfaces.

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
- `GadgetGridCellHostComponent` (`src/app/gadgets/gadget-grid-cell-host/gadget-grid-cell-host.component.ts:49-82`) - Factory component that dynamically creates gadget instances via switch statement
- `GadgetBase` (`src/app/gadgets/common/gadget-common/gadget-base/gadget.base.ts`) - Abstract base class all gadgets extend
- Gadget library defined in `src/assets/api/library.json` - JSON configuration for all available gadgets

**Available Gadgets**:
- BarChartComponent, AreaChartComponent (NGX Charts integration)
- ProductComponent, ScoreCardComponent, PckLineComponent
- ImageComponent, DateComponent, NotificationComponent
- UsergroupComponent, EventsComponent

**Dynamic Forms**:
- `DynamicFormComponent` - Renders property configuration forms
- Form controls: textbox, dropdown, dropdown-ms, number, date, textarea, upload, hidden
- Property definitions in gadget JSON include validation rules

**Layout & Navigation**:
- Multi-board support with dynamic navigation
- Drag/drop layout management
- Board persistence and configuration

### Key Files

- `src/app/gadgets/gadget-grid-cell-host/gadget-grid-cell-host.component.ts` - Gadget factory (add new gadgets here)
- `src/assets/api/library.json` - Gadget definitions and property schemas
- `src/app/dynamic-form/` - Dynamic form generation system
- `src/app/board/` - Dashboard board management
- `src/app/layout/` - Layout and grid system

### Adding New Gadgets

1. Create component in `src/app/gadgets/[gadget-name]/`
2. Add component import and case to `GadgetGridCellHostComponent` switch statement
3. Add gadget definition to `src/assets/api/library.json`
4. Create icon image in `src/assets/images/`

### Dependencies

- Angular 19 with Angular Material
- NGX Charts (@swimlane/ngx-charts) for data visualization
- RxJS for reactive programming
- TypeScript 5.6.3