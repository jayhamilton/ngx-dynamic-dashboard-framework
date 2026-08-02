# NGX Dynamic Dashboard Framework

A JSON-driven dashboard framework built with Angular and Angular Material. Gadgets, their configuration forms, and board layouts are all described as data and rendered at runtime — adding a new gadget means adding a component and a JSON entry, not rewriting the dashboard.

This project is based on the open source project https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework I created a few years ago.

![Dashboard overview](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/documentation/dashboard-overview.jpg)

## Quick Start

A fresh install has no boards yet. The empty state walks through both steps needed to get a dashboard on screen — open the settings menu to create a board, then open the gadget library to populate it.

![Quick start walkthrough](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/documentation/quick-start.gif)

## Design Principles

### The framework makes no assumptions about gadgets

Boards are defined and configured at **runtime**, from JSON, rather than being laid out at build time. Because of that, the framework does not assume which gadgets a board will contain — or even which gadgets will eventually exist. A gadget nobody has envisioned yet can be introduced by adding its component and a library entry; the board, layout, drag-and-drop, and configuration machinery need no changes to accommodate it.

The practical consequence is that the person *using* the dashboard decides what it presents, not the person who built it. Which gadgets appear, how many, on which boards, arranged in which layout, showing what data — all of it is a runtime decision.

### Gadgets are templates; boards hold instances

A gadget in the library is a template. What lands on a board is an **instance**. You can place many instances of the same gadget across one board or several, and each instance carries its own configuration and its own data — two Bar Charts side by side can show entirely unrelated series.

Each instance is identified by a generated `instanceId` and stores its own copy of the gadget's property pages, which is why configuring one never affects another. It also means an instance is a snapshot: a gadget already on a board keeps the property definitions it was created with, so changes to `library.json` apply to newly added instances rather than retroactively to existing ones.

### Data is configured, not wired

The framework this project is based on had a notion of data sources backed by REST API endpoints. **That is not exposed in this version.** Data is instead defined as JSON and entered directly into each gadget instance's data control, using the embedded editor in its configuration panel. This keeps the runtime self-contained and makes it possible to build and share a complete board without standing up a backend.

> **Planned:** support for REST API endpoints as a data source. It will be *supplementary to* — not a replacement for — manually configured JSON, so existing boards continue to work and either approach can be chosen per gadget instance.

## Built With

* JSON driven — gadgets and their property pages come from a library definition
* [Angular Dynamic Components](https://angular.io/guide/dynamic-component-loader) — gadgets are instantiated at runtime
* [Angular Dynamic Forms](https://angular.io/guide/dynamic-form) — configuration forms are generated from each gadget's JSON
* [NGX Charts](https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical) — charting gadgets
* Angular Material 3 theming with light and dark modes

## Blog Post

[Medium Blog Post](https://jaystevenhamilton.medium.com/design-of-a-dashboard-framework-c26367cfea64)

---

## Features

### Boards

Multiple dashboards, each with its own title, description, and Material icon. The current board's identity is shown in a banner beneath the toolbar, and boards are switched from the navigation rail on the left. The rail collapses to icons only when you want the space back.

![Board navigation](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/documentation/board-navigation.jpg)

Boards are created and edited from the configuration dialog, which also carries the description and icon shown in the banner and navigation.

![Board configuration](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/documentation/board-configuration.jpg)

Icons are chosen with a searchable picker drawn from the Material Icons set — no image assets involved.

![Icon picker](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/documentation/icon-picker.jpg)

### Rows and Layouts

A board is made of rows, and **each row has its own column layout** — so a three-across KPI strip can sit above a two-column detail row. Rows can be added, removed, and dragged into a different order, and the layout thumbnails apply to whichever row is selected.

Removing a row relocates its gadgets into the first remaining row rather than discarding them.

![Board layouts panel](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/documentation/board-layouts-panel.jpg)

Available layouts: one column, two equal, two narrow/wide, two wide/narrow, and three equal. Gadgets can be dragged between columns and between rows.

### Gadget Library

Gadgets are added from a side panel driven entirely by the library JSON.

![Gadget library](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/documentation/gadget-library.jpg)

| Gadget | Purpose |
|---|---|
| Bar Chart | Vertical bar chart for categorical data |
| Area Chart | Multi-series area chart for trends over time |
| Line Chart | Multi-series line chart |
| Pie Chart | Proportional data |
| Bubble Chart | Three-dimensional (x / y / size) data |
| Number Card | KPI metric tiles |
| Table | Rows of tabular data with striping, density, row numbers, and column selection |
| Statistic | A single metric with an icon, color theme, and trend indicator |

### Gadget Configuration

Selecting **Configure** on a gadget opens a side panel whose form is generated from that gadget's property definitions. The gadget shows a configuration-mode indicator while the panel is open, and edits are applied live.

![Gadget configuration](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/documentation/gadget-configuration.jpg)

Supported form controls: `textbox`, `number`, `checkbox`, `dropdown`, `dropdown-ms`, `date`, `textarea`, `upload`, `hidden`, `section`, `icon-picker`, `ace-editor`, and `json-forms`. Gadget data is edited as JSON in an embedded Ace editor.

### Application Configuration

The application title shown in the toolbar is configurable and persisted locally, with a reset back to the built-in default.

![Application configuration](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/documentation/application-configuration.jpg)

### Light and Dark Themes

A toolbar toggle switches the entire app — Material components, chart text, side panels, and gadgets — between light and dark. The choice is persisted across sessions.

![Light theme](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/documentation/light-theme.jpg)

### Persistence

Boards, layouts, gadget instances, and their configured property values are stored in `localStorage`, so a board survives a reload without any backend. See [Gadgets are templates; boards hold instances](#gadgets-are-templates-boards-hold-instances) for how instance data is captured.

---

## Developers Guide — Creating A Gadget

### 1. Define the component, service, and view

* Bar Chart Component [bar-chart.component.ts](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/src/app/gadgets/bar-chart/bar-chart.component.ts)
* Bar Chart View [bar-chart.component.html](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/src/app/gadgets/bar-chart/bar-chart.component.html)
* Optionally add a service to call a REST endpoint for the gadget's data

Gadgets extend `GadgetBase`, which supplies the title, subtitle, icon, instance id, property pages, and configuration-mode state.

### 2. Define the gadget's model

Add an entry to the library array in [library.json](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/src/assets/api/library.json). This entry drives both the library panel card and the generated configuration form.

Production builds read `library-prod.json`, so add the entry to both files.

### 3. Register it with the gadget factory

Add a case for the new component to [gadget-grid-cell-host.component.ts](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/src/app/gadgets/gadget-grid-cell-host/gadget-grid-cell-host.component.ts), which instantiates gadgets by `componentType`.

### 4. Gadget icons

Set `icon` to a [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons) ligature name (e.g. `"bar_chart"`) — no image file needed. It renders as a `<mat-icon>` in both the gadget header and the library panel, so it themes correctly in light and dark mode.

Boards use the same convention. The icon picker's list lives in [icon-options.ts](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/src/app/shared/icon-picker/icon-options.ts) — add entries there to extend it. `IconPickerComponent` is a standard `ControlValueAccessor`, so it can be used in any reactive form.

### JSON Definition

```json
[
  {
    "componentType": "StatisticComponent",
    "title": "Statistic",
    "subtitle": "Single metric",
    "description": "Add a single statistic with an icon and color theme.",
    "icon": "speed",
    "instanceId": -1,
    "tags": [],
    "propertyPages": [
      {
        "displayName": "Configuration",
        "groupId": "config",
        "position": 10,
        "properties": [
          {
            "controlType": "textbox",
            "key": "title",
            "label": "Title",
            "value": "Statistic",
            "required": true,
            "order": 1
          },
          {
            "controlType": "icon-picker",
            "key": "statIcon",
            "label": "Icon",
            "value": "speed",
            "required": false,
            "order": 21
          },
          {
            "controlType": "dropdown",
            "key": "statTheme",
            "label": "Theme",
            "value": "brand",
            "required": false,
            "order": 22,
            "options": [
              { "key": "brand", "value": "Brand" },
              { "key": "success", "value": "Success (green)" }
            ]
          }
        ]
      }
    ],
    "actions": [{ "name": "add" }]
  }
]
```

---

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

### Development server

Run `ng serve` for a dev server, then navigate to `http://localhost:4200/`. The app reloads automatically when source files change.

Log in with username `admin` and password `admin`.

### Build

Run `ng build` to build the project. Artifacts are written to `dist/`.

### Unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Further help

Run `ng help` or see the [Angular CLI Overview and Command Reference](https://angular.io/cli).
