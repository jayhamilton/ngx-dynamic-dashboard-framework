# Test Results: Fix medium — upgrade http-proxy-middleware to safe versions
**Issue**: #54
**Verdict**: FAIL
**Date**: 2026-08-01

## Results

### TC-001: No resolved copy of http-proxy-middleware in range >=1.3.0 <2.0.8
**Status**: PASS
**Evidence**: `npm ls http-proxy-middleware` output shows:
```
└─┬ @angular-devkit/build-angular@22.1.2
  ├── http-proxy-middleware@4.2.0
  └─┬ webpack-dev-server@6.0.0
    └── http-proxy-middleware@4.2.0 deduped
```
Both resolved copies are `4.2.0`, which is well above 2.0.8. No copy exists in the `>=1.3.0 <2.0.8` range.
**Notes**: The 2.x line previously resolved via `webpack-dev-server@5.2.6` has since been superseded by `webpack-dev-server@6.0.0` which also pulls `4.2.0`. The override is still correct and enforces the floor.

---

### TC-002: No resolved copy of http-proxy-middleware in range >=3.0.0 <3.0.4
**Status**: PASS
**Evidence**: Same `npm ls` output as TC-001. Both copies are `4.2.0`, which satisfies `>=3.0.4`. No copy in range `3.0.0`–`3.0.3`.
**Notes**: None.

---

### TC-003: package.json overrides block contains the http-proxy-middleware entry
**Status**: PASS
**Evidence**: In `package.json`, the `overrides` section contains:
```json
"http-proxy-middleware": ">=2.0.8 <3.0.0 || >=3.0.4"
```
This is present alongside the other overrides (`esbuild`, `follow-redirects`, etc.), exactly matching the spec requirement.
**Notes**: None.

---

### TC-004: npm audit reports no advisory for http-proxy-middleware
**Status**: PASS
**Evidence**: `npm audit` output (exit 1 due to 8 unrelated moderate advisories) contains zero references to `http-proxy-middleware`. All 8 advisories relate to `@hono/node-server`, `ajv`, and `schematics-scss-migrate` — explicitly noted as out-of-scope sibling-story items in the IMPL notes.
**Notes**: `npm audit` exits 1 because of those 8 unrelated advisories, but none are for `http-proxy-middleware`.

---

### TC-005: npm run build exits with code 0
**Status**: PASS
**Evidence**: `npm run build` exited with code 0. Full Angular production build completed:
```
✔ Building...
main-CLKESG5W.js      | 1.49 MB  | 293.12 kB
styles-QZRLSNW7.css   | 103.90 kB | 7.71 kB
polyfills-D5OGI5N6.js | 34.55 kB  | 11.32 kB
Application bundle generation complete. [4.126 seconds]
Output location: dist/plm-ui
```
**Notes**: None.

---

### TC-006: npm test exits with code 0
**Status**: FAIL
**Evidence**: `npm test` exited with code 1. The Karma runner executed 7 of 26 specs before disconnecting. Two errors were observed:
1. **`MatDuplicatedDrawerError`** thrown in `afterAll`: `"A drawer was already declared for 'position="end"'"` — originating from `@angular/material/fesm2022/sidenav.mjs`. This is an application-level Angular Material test setup bug, entirely unrelated to `http-proxy-middleware`.
2. **Karma disconnect**: `"Disconnected, because no message in 30000 ms."` — the browser timed out after the `MatDuplicatedDrawerError` caused the test run to stall.
3. A deprecation warning also appeared: `"The '@angular-devkit/build-angular:karma' builder is deprecated — use '@angular/build:karma' instead."` This is a pre-existing warning unrelated to this story.

**Root cause assessment**: The `MatDuplicatedDrawerError` is a pre-existing defect in the test suite's Angular Material component setup — a `MatDrawerContainer` is receiving two drawers with the same `position="end"` attribute during the `afterAll` teardown lifecycle. This error is **not caused by** the `http-proxy-middleware` override change, as the override only affects how a transitive build/dev-server dependency is resolved at install time and has no effect on Angular Material component test behavior.

**Notes**: This failure pre-exists this change and is out-of-scope for this story (which only touches `package.json` overrides and `package-lock.json`). However, per QA rules, a failing `npm test` acceptance criterion must be marked FAIL regardless of cause. This should be tracked as a separate bug.

---

## Summary
- Total: 6  |  Passed: 5  |  Failed: 1

## Bugs Found
- **BUG-001**: `npm test` exits with code 1 due to a pre-existing `MatDuplicatedDrawerError` in `afterAll` for a test involving `MatDrawerContainer` (`@angular/material/fesm2022/sidenav.mjs:15`). A `MatDrawerContainer` is receiving duplicate drawers with `position="end"` during test teardown, causing the Karma browser to disconnect after 30 seconds. This is **not introduced by this story** — the `http-proxy-middleware` override has no effect on Angular Material component behavior. Affects: Karma test suite; file location: application component test (exact spec file TBD by dev). Should be fixed in a separate story.
