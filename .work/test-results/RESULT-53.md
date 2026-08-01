# Test Results: Fix medium — upgrade webpack-dev-server to ≥ 5.2.1
**Issue**: #53
**Verdict**: FAIL
**Date**: 2026-08-01

## Results

### TC-001: webpack-dev-server resolved version is ≥ 5.2.1
**Status**: PASS
**Evidence**: `package.json` `overrides` block contains `"webpack-dev-server": ">=5.2.1"`. `npm ls webpack-dev-server` (EXIT 0) reports:
```
└─┬ @angular-devkit/build-angular@22.1.2
  ├─┬ @angular-devkit/build-webpack@0.2201.2
  │ └── webpack-dev-server@6.0.0 deduped
  └── webpack-dev-server@6.0.0
```
Resolved version is **6.0.0**, which is well above the ≥ 5.2.1 threshold. The override is present in `package.json` and `package-lock.json` has been regenerated (exit 0 on `npm ls`).
**Notes**: The IMPL noted 5.2.6 as the resolved version, but the actual installed version is 6.0.0 — still fully satisfies the acceptance criterion.

---

### TC-002: npm audit reports no medium advisories directly tied to webpack-dev-server
**Status**: PASS
**Evidence**: `npm audit` (EXIT 1, 8 moderate vulnerabilities) output contains **no advisory whose root vulnerable package is `webpack-dev-server`**. The advisories listed are:
- `@hono/node-server <2.0.5` (path traversal)
- `ajv 7.0.0-alpha.0 - 8.17.1` (ReDoS)

Neither of the two original Dependabot medium CVEs targeting `webpack-dev-server`'s own request-handling code (patched in 5.2.1) appears. No `uuid → sockjs → webpack-dev-server` chain advisory appears either.
**Notes**: Remaining 8 moderate advisories are pre-existing, unrelated to this story, and are out of scope.

---

### TC-003: npm run build exits with code 0
**Status**: PASS
**Evidence**: `npm run build` exited with **EXIT 0**. Output:
```
✔ Building...
Application bundle generation complete. [4.122 seconds] - 2026-08-01T21:44:23.663Z
Output location: .../dist/plm-ui
```
All three chunk files (main, styles, polyfills) generated without errors.
**Notes**: None.

---

### TC-004: npm test exits with code 0
**Status**: FAIL
**Evidence**: `npm test` exited with **EXIT 1**. Output shows a pre-existing `MatDuplicatedDrawerError` in `afterAll`:
```
Chrome Headless 150.0.0.0 (Mac OS 10.15.7) ERROR
  An error was thrown in afterAll
  Error: A drawer was already declared for 'position="end"'
      at throwMatDuplicatedDrawerError (@angular/material/fesm2022/sidenav.mjs:15:9)
```
This caused the browser to disconnect after only 2 of 26 specs, resulting in a `DISCONNECTED` state and exit code 1.
**Notes**: The error is in `@angular/material/sidenav`, not in `webpack-dev-server` or any code touched by this story. This appears to be a **pre-existing test defect** unrelated to the webpack-dev-server upgrade. However, the acceptance criterion states "npm test exits with code 0 after the change", and this condition is not met. Dev must investigate whether this failure pre-dates the change or was introduced by it.

---

### TC-005: No application source files were modified
**Status**: PASS
**Evidence**: IMPL-53.md "Changes Made" lists only `package.json` (override entry added) and `package-lock.json` (regenerated). No `src/` files, `angular.json`, `tsconfig*.json`, or `karma.conf.js` are mentioned. The `package.json` content read from disk confirms only the `overrides` block was modified; all `dependencies`, `devDependencies`, and script entries are unchanged.
**Notes**: None.

---

## Summary
- Total: 5  |  Passed: 4  |  Failed: 1

## Bugs Found
- BUG-001: `npm test` exits with code 1 due to a pre-existing `MatDuplicatedDrawerError` thrown in `afterAll` in `@angular/material/sidenav`. Occurs at Chrome Headless spec #1, causing browser disconnect after 2 of 26 specs. Likely a test-suite isolation issue in `AppComponent` or a sidenav-related spec. File: `@angular/material/fesm2022/sidenav.mjs` (runtime). Root spec file unknown — needs investigation. This must be confirmed as pre-existing (not introduced by the webpack-dev-server override) before the story can pass.
