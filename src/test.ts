// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// The app runs zoneless in production (polyfills.ts no longer loads zone.js),
// but the karma/TestBed harness still uses zone.js/testing for fakeAsync/tick()
// support — 'zone.js/testing' extends the base Zone global rather than
// including it, so it must be imported here explicitly.
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
