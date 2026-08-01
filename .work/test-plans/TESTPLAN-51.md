# Test Plan: Fix critical: loader-utils and socket.io-parser upgrades
**Issue**: #51
**Date**: 2026-08-01

## Test Cases

### TC-001: loader-utils 2.x resolved version is ≥ 2.0.3 in package-lock.json
**Type**: code-review / npm-ls
**Steps**:
1. Run `npm ls loader-utils` to inspect all resolved copies in node_modules.
2. Identify the 2.x copy and confirm its version is ≥ 2.0.3 (i.e., no version like 2.0.0, 2.0.1, 2.0.2 is present).
**Expected**: The 2.x copy resolves to 2.0.3 or higher; no 2.0.0–2.0.2 version exists.
**Pass Criteria**: `npm ls loader-utils` output shows the 2.x line at version ≥ 2.0.3.

### TC-002: socket.io-parser resolved version is ≥ 4.0.5 in package-lock.json
**Type**: code-review / npm-ls
**Steps**:
1. Run `npm ls socket.io-parser` to inspect all resolved copies.
2. Confirm no copy in the `4.0.x` range below `4.0.5` is present.
**Expected**: socket.io-parser resolves to a version ≥ 4.0.5 (expected 4.2.7 from sibling override).
**Pass Criteria**: `npm ls socket.io-parser` output shows no version < 4.0.5 in the 4.0.x range.

### TC-003: npm audit reports no critical advisories for loader-utils or socket.io-parser
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Inspect the output for any critical severity advisory mentioning `loader-utils` or `socket.io-parser`.
**Expected**: Zero critical advisories for either package.
**Pass Criteria**: `npm audit` output contains no critical advisory for `loader-utils` or `socket.io-parser`.

### TC-004: package.json overrides block contains loader-utils ≥ 2.0.3 entry
**Type**: code-review
**Steps**:
1. Read `package.json` and locate the `"overrides"` section.
2. Confirm the key `"loader-utils"` exists with value `">=2.0.3"`.
**Expected**: The override entry is present to enforce the patched minimum.
**Pass Criteria**: `"loader-utils": ">=2.0.3"` present in the `"overrides"` block of `package.json`.

### TC-005: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Observe exit code and output.
**Expected**: Build completes successfully with exit code 0 and all output artifacts are produced.
**Pass Criteria**: `npm run build` exits 0 with no error output.

### TC-006: npm test exits with code 0
**Type**: functional
**Steps**:
1. Run `npm test` (headless Karma/Jasmine).
2. Observe exit code and test results.
**Expected**: All unit tests pass with exit code 0 and no regressions.
**Pass Criteria**: `npm test` exits 0 with all test specs passing.
