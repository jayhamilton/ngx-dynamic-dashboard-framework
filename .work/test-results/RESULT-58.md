# Test Results: Fix medium — upgrade follow-redirects to ≥ 1.15.6
**Issue**: #58
**Verdict**: FAIL
**Date**: 2026-08-01

## Results

### TC-001: package-lock.json contains no version of follow-redirects below 1.15.6
**Status**: PASS
**Evidence**: `npm ls follow-redirects` exited 0 and showed exactly one resolved copy:
```
plm-ui@0.5.0-alpha
└─┬ karma@6.3.16
  └─┬ http-proxy@1.18.1
    └── follow-redirects@1.16.0
```
`1.16.0` is well above both the original ≥ 1.15.6 threshold and the tightened ≥ 1.15.12 threshold. No copy below 1.15.12 exists in the tree.
**Notes**: Single resolved copy; override is working correctly.

---

### TC-002: npm audit no longer reports any advisories for follow-redirects
**Status**: PASS
**Evidence**: `npm audit` output (exit 1, due to 8 unrelated moderate advisories involving `@hono/node-server`, `ajv`, `schematics-scss-migrate`, etc.) contains **zero mentions** of `follow-redirects`. The package does not appear anywhere in the audit report.
**Notes**: The 8 remaining advisories are out of scope for this story (sibling stories in the same milestone handle them). `follow-redirects` is fully clear.

---

### TC-003: npm run build exits with code 0
**Status**: PASS
**Evidence**: `npm run build` exited 0. Output:
```
Initial chunk files   | Names  | Raw size | Estimated transfer size
main-CLKESG5W.js      | main   | 1.49 MB  | 293.12 kB
styles-QZRLSNW7.css   | styles | 103.90 kB|   7.71 kB
polyfills-D5OGI5N6.js | polyfills | 34.55 kB | 11.32 kB
                      | Initial total | 1.63 MB | 312.15 kB
Application bundle generation complete.
```
The `angular.json` budget increase to `2mb` (`maximumError`) prevents the pre-existing 1.63 MB bundle from triggering a build error.
**Notes**: No budget-exceeded error appeared. Exit code confirmed 0.

---

### TC-004: npm test exits with code 0
**Status**: FAIL
**Evidence**: `npm test` exited **1**. After executing 2 of 26 specs, the Karma runner threw a fatal `afterAll` error and then disconnected (30 s timeout):
```
Chrome Headless 150.0.0.0 ERROR
  An error was thrown in afterAll
  Error: A drawer was already declared for 'position="end"'
      at throwMatDuplicatedDrawerError (@angular/material/fesm2022/sidenav.mjs:15:9)
      ...
Chrome Headless 150.0.0.0: Executed 2 of 26 DISCONNECTED (30.1 secs / 0.095 secs)
```
Only 2 of 26 specs ran; the suite did not complete. Exit code was 1.
**Notes**: The error (`MatDuplicatedDrawerError`) is a pre-existing Angular Material test-fixture issue unrelated to the `follow-redirects` upgrade. It is also called out in IMPL-58.md under "QA Notes" as not yet verified. However, the acceptance criterion requires exit code 0 with no exceptions — it is a FAIL regardless of root cause.

---

### TC-005: package.json override is correctly set to >=1.15.12
**Status**: PASS
**Evidence**: `package.json` `overrides` block contains:
```json
"follow-redirects": ">=1.15.12"
```
This correctly tightens the constraint from the previous `>=1.15.6` to address CVEs GHSA-cxjh-pqwp-8mfp, GHSA-jchw-25xp-jwwc, GHSA-r4q5-vmmm-2653 (which cover ≤ 1.15.11).
**Notes**: None.

---

### TC-006: angular.json production bundle maximumError budget is ≥ 2mb
**Status**: PASS
**Evidence**: `angular.json` at `projects.plm-ui.architect.build.configurations.production.budgets` (initial type) shows:
```json
{
  "type": "initial",
  "maximumWarning": "500kb",
  "maximumError": "2mb"
}
```
Correctly increased from the pre-existing `1.6mb` to `2mb`.
**Notes**: `maximumWarning` was left unchanged at `500kb` per the spec.

---

### TC-007: No source files under src/ were modified
**Status**: PASS
**Evidence**: IMPL-58.md "Changes Made" lists only `package.json`, `package-lock.json`, and `angular.json`. No `src/` path is mentioned. The implementation explicitly states "Any file under `src/` — this is a pure dependency remediation story."
**Notes**: Out-of-scope constraint satisfied.

---

## Summary
- **Total**: 7  |  **Passed**: 6  |  **Failed**: 1

## Bugs Found
- **BUG-001**: `npm test` exits with code 1 — Karma runner throws `MatDuplicatedDrawerError: A drawer was already declared for 'position="end"'` in an `afterAll` hook after executing 2 of 26 specs, causing the browser to disconnect after a 30-second timeout. File: test suite fixture (Angular Material `MatDrawerContainer`). This is a pre-existing test infrastructure failure that was not fixed before marking the story ready-for-QA, and it directly fails acceptance criterion AC-4 (`npm test` exits with code 0).
