# Test Results: Fix critical: loader-utils and socket.io-parser upgrades
**Issue**: #51
**Verdict**: FAIL
**Date**: 2026-08-01

## Results

### TC-001: loader-utils 2.x resolved version is ≥ 2.0.3 in package-lock.json
**Status**: PASS
**Evidence**: `npm ls loader-utils` (EXIT 0) shows only `loader-utils@3.3.1` in the entire dependency tree (via `@angular-devkit/build-angular@22.1.2` → `resolve-url-loader@5.0.0`). There is no 2.x copy installed at all — the `"loader-utils": ">=2.0.3"` override in `package.json` has caused npm to resolve to the 3.x line exclusively. No version in the 2.x range below 2.0.3 is present.
**Notes**: The 2.x line is entirely absent; only 3.3.1 exists. The acceptance criterion — no 2.x version below 2.0.3 — is satisfied by the complete absence of any 2.x version.

### TC-002: socket.io-parser resolved version is ≥ 4.0.5 in package-lock.json
**Status**: PASS
**Evidence**: `npm ls socket.io-parser` (EXIT 0) shows `socket.io-parser@4.2.7` via `karma@6.3.16` → `socket.io@4.8.3`. Version 4.2.7 is well above 4.0.5. No version in the `4.0.x` range below `4.0.5` is present.
**Notes**: The `"socket.io-parser": ">=4.2.3"` override from the sibling story (included in the current `package.json`) covers both the critical and medium ranges.

### TC-003: npm audit reports no critical advisories for loader-utils or socket.io-parser
**Status**: PASS
**Evidence**: `npm audit` output lists 8 moderate severity vulnerabilities only — `@hono/node-server`, `ajv`, and their dependents. Neither `loader-utils` nor `socket.io-parser` appears anywhere in the audit report. Zero critical advisories for either target package.
**Notes**: Remaining 8 moderate advisories are unrelated to this story and are in scope for sibling stories in this milestone.

### TC-004: package.json overrides block contains loader-utils ≥ 2.0.3 entry
**Status**: PASS
**Evidence**: `package.json` `"overrides"` section contains `"loader-utils": ">=2.0.3"` as required. The full overrides block is present and also includes `"socket.io-parser": ">=4.2.3"` from the sibling story.
**Notes**: Override is correctly placed in the top-level `"overrides"` key (npm 8+ format).

### TC-005: npm run build exits with code 0
**Status**: PASS
**Evidence**: `npm run build` EXIT 0. Angular production build completed in 4.171 seconds. Output: `main-CLKESG5W.js` (1.49 MB), `styles-QZRLSNW7.css` (103.90 kB), `polyfills-D5OGI5N6.js` (34.55 kB). Bundle output written to `dist/plm-ui`.
**Notes**: No errors or warnings related to the dependency change.

### TC-006: npm test exits with code 0
**Status**: FAIL
**Evidence**: `npm test` EXIT 1. Karma ran 17 of 26 specs before disconnecting. Failures observed:
  1. **AreaChartComponent should create FAILED** — `Error: NG05105: Unexpected synthetic property @animationState found`. This is an Angular animation provider configuration error in the test setup (missing `provideAnimations()` in the test bed), not related to loader-utils or socket.io-parser.
  2. **afterAll ERROR** — `Error: A drawer was already declared for 'position="end"'` — a `MatDrawerContainer` validation error in test teardown, also unrelated to the dependency changes in this story.
  3. Browser disconnected after 30s timeout after spec 17/26.
**Notes**: The test failures are pre-existing Angular application-level test configuration issues (animation providers not set up in test beds, duplicate Material drawer declarations). They are **not caused by the loader-utils or socket.io-parser dependency changes** — these are toolchain/metadata-only changes. However, the acceptance criterion states "npm test exits with code 0" unconditionally, so this must be marked FAIL regardless of root cause.

## Summary
- Total: 6  |  Passed: 5  |  Failed: 1

## Bugs Found
- BUG-001: `npm test` exits with code 1. `AreaChartComponent should create` fails with `NG05105: Unexpected synthetic property @animationState` — missing `provideAnimations()` / `BrowserAnimationsModule` in the test bed provider setup. File: likely a spec file under `src/` configuring the `AreaChartComponent` test. This is a pre-existing test infrastructure issue unrelated to the dependency security fixes in this story, but it causes the AC to fail. (`src/` files are out of scope for this story per the Technical Notes — a separate fix is needed.) 
- BUG-002: `npm test` also throws `Error: A drawer was already declared for 'position="end"'` in an `afterAll` hook — duplicate `MatSidenav` drawer in test setup. Likely a pre-existing issue in a dashboard/shell component spec.
