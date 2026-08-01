# Test Plan: Fix medium — upgrade http-proxy-middleware to safe versions
**Issue**: #54
**Date**: 2026-08-01

## Test Cases

### TC-001: No resolved copy of http-proxy-middleware in range >=1.3.0 <2.0.8
**Type**: code-review
**Steps**:
1. Run `npm ls http-proxy-middleware` to list all resolved copies.
2. Confirm no resolved version is in range `>=1.3.0` and `<2.0.8`.
**Expected**: Every resolved copy is at version ≥ 2.0.8 (for the 2.x line) or ≥ 3.0.4 (for the 3.x+ line).
**Pass Criteria**: `npm ls http-proxy-middleware` output shows no version string matching `1.x`, `2.0.0` – `2.0.7` exactly.

---

### TC-002: No resolved copy of http-proxy-middleware in range >=3.0.0 <3.0.4
**Type**: code-review
**Steps**:
1. Run `npm ls http-proxy-middleware` to list all resolved copies.
2. Confirm no resolved version falls within `>=3.0.0 <3.0.4`.
**Expected**: No copy at `3.0.0`, `3.0.1`, `3.0.2`, or `3.0.3`.
**Pass Criteria**: `npm ls http-proxy-middleware` output shows no version string `3.0.0` – `3.0.3`.

---

### TC-003: package.json overrides block contains the http-proxy-middleware entry
**Type**: code-review
**Steps**:
1. Read `package.json`.
2. Inspect the `overrides` section.
**Expected**: `"http-proxy-middleware": ">=2.0.8 <3.0.0 || >=3.0.4"` (or equivalent safe range) is present.
**Pass Criteria**: The exact key `http-proxy-middleware` exists in `overrides` with a value satisfying the two safe-version floors.

---

### TC-004: npm audit reports no advisory for http-proxy-middleware
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Search output for the text `http-proxy-middleware`.
**Expected**: Zero advisories reference `http-proxy-middleware`.
**Pass Criteria**: The string `http-proxy-middleware` does not appear in the advisory list of `npm audit` output.

---

### TC-005: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Check exit code.
**Expected**: Angular production build completes successfully, producing output in `dist/plm-ui`.
**Pass Criteria**: Exit code = 0 and output bundle files are present.

---

### TC-006: npm test exits with code 0
**Type**: functional
**Steps**:
1. Run `npm test` (headless Karma/Jasmine).
2. Check exit code and test summary.
**Expected**: All unit tests pass; no test failures or errors introduced by the dependency change.
**Pass Criteria**: Exit code = 0, all 26 specs pass.
