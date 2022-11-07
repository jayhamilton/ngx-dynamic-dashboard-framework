# NGX Dynamic Dashboard Framework

This project is based on the open source project https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework I created a few years ago. 

The keys design aspects:

* JSON Driven
* [Angular Dynamic Components](https://angular.io/guide/dynamic-component-loader)
* [Angular Dynamic Forms](https://angular.io/guide/dynamic-form)
* [NGX Charts](https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical)
## Blog Post
[Medium Blog Post](https://jaystevenhamilton.medium.com/design-of-a-dashboard-framework-c26367cfea64)

## Examples
#### New Board

![New Board Creation](https://github.com/jayhamilton/plm-ui/blob/main/documentation/new-board.gif)

#### Add Gadget

![Add Gadget](https://github.com/jayhamilton/plm-ui/blob/main/documentation/add-gadget.gif)

#### Drag/Drop and Layout

![Multi-board Configuration](https://github.com/jayhamilton/plm-ui/blob/main/documentation/layout.gif)

#### Multiple Boards

![Dynamic Navigation](https://github.com/jayhamilton/plm-ui/blob/main/documentation/multiboard.gif)


## Developers Guide To Framework Extension - Creating A Gadget
### Define the Gadget Component, Service and View

* Bar Chart Component  [bar-chart.component.ts](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/src/app/gadgets/bar-chart/bar-chart.component.ts)
* Bar Chart View [bar-chart.component.html](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/src/app/gadgets/bar-chart/bar-chart.component.html)
* Bar Chart Service - you would create a service to call a REST endpoint to get data for the component

### Define the gadget's model

* The model is used to dynamically create and render the gadget and its property page forms. This model is an entry into a model array used for all gadgets. You will simply add an entry to the model's array. See the BarChartComponent entry.
* Add an entry for the gadget in the library model array [library.json](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/src/assets/api/library.json)

### Add the gadget entry to the gadget factory class

* Add an entry for your gadget in the gadget grid cell host class that serves as a gadget factory [gadget-grid-cell-host.component.ts](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/src/app/gadgets/gadget-grid-cell-host/gadget-grid-cell-host.component.ts)
### Gadget Icon

* Define an image/icon for your gadget [bar-chart.png](https://github.com/jayhamilton/ngx-dynamic-dashboard-framework/blob/main/src/assets/images/bar-chart.png)
## JSON Definition
```
 [
  {...},
  {
    "componentType": "AreaChartComponent",
    "title": "Area Chart Component Component Tool",
    "subtitle": "Area chart tool subtitle",
    "description": "Select this gadget .....",
    "icon": "../../assets/images/trend.png",
    "instanceId": -1,
    "tags": [],
    "propertyPages": [
      {
        "displayName": "Configuration",
        ...
        "properties": [
          {
            "controlType": "textbox",
            "key": "title",
            "label": "Title",
            "value": "Property Components",
            "required": true,
            "order": 1
          },
          {
            "controlType": "textbox",
            "key": "subtitle",
            "label": "Subtitle",
            "value": "Product component subtitle",
            "required": false,
            "order": 2
          }
        ]
      }
    ],
    "actions": [
      {
        "name": "add"
      }
    ]
  }
]
```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
