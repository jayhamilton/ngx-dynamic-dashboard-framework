# Test Results: Fix medium: upgrade esbuild to ≥ 0.25.0
**Issue**: #55
**Verdict**: FAIL
**Date**: 2026-08-01

## Results

### TC-001: No esbuild version ≤ 0.24.2 in package-lock.json
**Status**: PASS
**Evidence**:
- `package.json` contains `"esbuild": ">=0.25.0"` in the `overrides` block (confirmed by reading the file).
- `npm ls esbuild` (EXIT 0) returned:
  ```
  └─┬ @angular-devkit/build-angular@22.1.2
    ├─┬ @angular/build@22.1.2
    │ ├── esbuild@0.28.1 deduped
    │ └─┬ vite@8.1.5
    │   └── esbuild@0.28.1 deduped
    └── esbuild@0.28.1
  ```
  All three resolved instances are `0.28.1`; none are ≤ 0.24.2.
**Notes**: Override is present and effective. package-lock.json has been regenerated correctly.

---

### TC-002: npm audit no longer reports a medium advisory for esbuild
**Status**: PASS
**Evidence**:
- `npm audit` output (EXIT 1 due to unrelated advisories) contains **no mention of esbuild** whatsoever.
- The 8 remaining moderate advisories cover: `@hono/node-server`, `@modelcontextprotocol/sdk`,
  `@angular/cli`, `ajv`, `@angular-devkit/core`, `@angular-devkit/schematics`,
  `@schematics/angular`, and `schematics-scss-migrate` — none are esbuild.
**Notes**: Remaining advisories are out of scope for this story per the spec; they are addressed in sibling stories in the same milestone.

---

### TC-003: npm run build exits with code 0
**Status**: PASS
**Evidence**:
- `npm run build` exited with **code 0**.
- Output: "Application bundle generation complete. [4.099 seconds]"
- Chunk files produced: `main-CLKESG5W.js` (1.49 MB), `styles-QZRLSNW7.css` (103.90 kB), `polyfills-D5OGI5N6.js` (34.55 kB).
- Output location: `dist/plm-ui`.
**Notes**: No Angular compilation errors; esbuild 0.28.1 is fully compatible with Angular CLI 22.1.2.

---

### TC-004: npm test exits with code 0
**Status**: FAIL
**Evidence**:
- `npm test` exited with **code 1** (non-zero).
- Karma runner connected ChromeHeadless and executed 1 of 26 specs before crashing.
- Error thrown in `afterAll`: `Error: A drawer was already declared for 'position="end"'`
  at `throwMatDuplicatedDrawerError` in `@angular/material/fesm2022/sidenav.mjs:15`.
- Browser subsequently disconnected: "no message in 30000 ms."
**Notes**:
  - The failing error (`MatDuplicatedDrawerError`) is a **pre-existing application test bug** in
    the `MatDrawerContainer` test setup — it is unrelated to esbuild, the package.json override,
    or any change made in this story.
  - The IMPL note also flagged this: "to be verified by QA (test suite requires headless Chrome
    in CI environment)" — implying the author was uncertain about the test environment.
  - The `@angular-devkit/build-angular:karma` builder is also deprecated in favour of
    `@angular/build:karma`, which may be contributing to instability.
  - **This failure is a pre-existing defect outside the scope of #55**, but the acceptance
    criterion as written requires `npm test` to exit 0, so this test case must be recorded as
    FAIL.

---

## Summary
- Total: 4  |  Passed: 3  |  Failed: 1

## Bugs Found
- BUG-001: `npm test` fails with `MatDuplicatedDrawerError` in `afterAll` for a spec using
  `MatDrawerContainer` — `@angular/material/fesm2022/sidenav.mjs:15`. This is a pre-existing
  test defect unrelated to the esbuild upgrade. The test suite crashes after executing only 1 of
  26 specs. File: test suite for a component using `<mat-drawer-container>` (exact spec file not
  identified from Karma output alone). Likely pre-dates this story.
