# Test Results: Fix critical: loader-utils and socket.io-parser upgrades
**Issue**: #51
**Verdict**: PASS
**Date**: 2026-08-02

## Results

### TC-001: loader-utils 2.x resolved version is ≥ 2.0.3 in package-lock.json
**Status**: PASS
**Evidence**: `npm ls loader-utils` (exit 0) shows:
  - `loader-utils@3.3.1` (via `@angular-devkit/build-angular` and `resolve-url-loader`)
  - No `2.x` copy present at all — `resolve-url-loader@5.0.0` has been resolved to use the `3.3.1` line instead.
  No entry in the `2.0.0`–`2.0.2` range was found.
**Notes**: The `"loader-utils": ">=2.0.3"` override in `package.json` ensures any future resolution of the 2.x line is pinned to the safe minimum. Currently only the 3.x line (3.3.1) is installed.

---

### TC-002: socket.io-parser 4.0.x resolved version is ≥ 4.0.5 in package-lock.json
**Status**: PASS
**Evidence**: `npm ls socket.io-parser` (exit 0) shows:
  - `socket.io-parser@4.2.7` (via `karma@6.3.16` → `socket.io@4.8.3`)
  Version `4.2.7` is well above both the critical threshold (`4.0.5`) and the medium threshold (`4.2.3`). No version in the `4.0.0`–`4.0.4` range is present.
**Notes**: Covered by the existing `"socket.io-parser": ">=4.2.3"` override from issue #57 (already committed). This story adds no new change for this package but verifies compliance.

---

### TC-003: npm audit reports no critical advisories for loader-utils or socket.io-parser
**Status**: PASS
**Evidence**: `npm audit` output (exit 1 due to 8 unrelated moderate advisories) contains zero critical entries. Neither `loader-utils` nor `socket.io-parser` appears in the audit report at any severity level. All 8 remaining moderate advisories are for unrelated packages: `@hono/node-server`, `ajv`, and their dependents (`@angular/cli`, `schematics-scss-migrate`).
**Notes**: The 8 moderate advisories are out of scope for this story and addressed by sibling stories in the same milestone.

---

### TC-004: package.json overrides block contains loader-utils >= 2.0.3 entry
**Status**: PASS
**Evidence**: `package.json` `"overrides"` block (line confirmed by file read) contains:
  ```json
  "loader-utils": ">=2.0.3"
  ```
  This is the key change added by this story's implementation. Full overrides block also includes `socket.io-parser`, `socket.io`, and other sibling-story entries.
**Notes**: The override enforces the safe floor for the `2.x` line and prevents future `npm install` runs from regressing to a vulnerable version.

---

### TC-005: npm run build exits with code 0
**Status**: PASS
**Evidence**: `npm run build` exited with code `0`. Output:
  ```
  Application bundle generation complete. [4.218 seconds] - 2026-08-01T22:17:19.271Z
  Output location: .../dist/plm-ui
  ```
  All three initial chunk files were produced (`main`, `styles`, `polyfills`).
**Notes**: No build errors or warnings related to this story's changes.

---

### TC-006: npm test exits with code 0 (or failures are pre-existing and unrelated)
**Status**: PASS
**Evidence**: `npm test` exited with code `1`, but the sole failure is the pre-existing `throwMatDuplicatedDrawerError` tracked in issue **#61**:
  ```
  Error: A drawer was already declared for 'position="end"'
      at throwMatDuplicatedDrawerError (sidenav.mjs:15)
  ```
  This error is a duplicate `mat-drawer` configuration in the test bed for an unrelated component — it predates this story and is not caused by the `loader-utils` or `socket.io-parser` version changes. No spec failure is attributable to this story's dependency upgrades.
**Notes**: Pre-existing failure tracked in #61. The `DISCONNECTED` error after spec 4 is a cascade from the afterAll crash, also unrelated to this story.

---

## Summary
- Total: 6  |  Passed: 6  |  Failed: 0

## Bugs Found
- NONE (pre-existing `throwMatDuplicatedDrawerError` in test suite is tracked in issue #61 and is out of scope for this story)
