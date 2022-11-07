# NGX Dynamic Dashboard Framework

This project is based on the open source project https://github.com/catalogicsoftware/ngx-dynamic-dashboard-framework I created a few years ago.

This project is a purpose built rewrite of that project, leveraging the latest version of Angular. This project also removes the dependency on Semantic UI in favor of Angular Material Design.

My goal is to get this purpose built version in good enough shape to then fork out to produce a next gen version of NGX-Dynamic-Dashboard-Framework, incorporating all of its gadgets. At least that is my goal :-). The goal of this effort is to produce a simple dashboard framework that can be used for a very specific purpose regarding manufacturing packaging lines.


The keys to this design is that it is purely JSON driven. This is also taking advantage of Angular's [dynamic component](https://angular.io/guide/dynamic-component-loader) functionality that enables the creation of component instances at runtime.

## Blog Post
[Medium Blog Post](https://jaystevenhamilton.medium.com/design-of-a-dashboard-framework-c26367cfea64)

### Examples
#### Creating a new Dashboard

![New Board Creation](https://github.com/jayhamilton/plm-ui/blob/main/documentation/new-board.gif)

#### Dynamic navigation

![Dynamic Navigation](https://github.com/jayhamilton/plm-ui/blob/main/documentation/multiboard.gif)

#### Dynamically add gadget instances to the board

![Add Gadget](https://github.com/jayhamilton/plm-ui/blob/main/documentation/add-gadget.gif)

#### Drag/Drop and Layout

![Multi-board Configuration](https://github.com/jayhamilton/plm-ui/blob/main/documentation/layout.gif)

### Developers Guide To Framework Extension - Creating Components

TODO

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
