# Test Plan: Fix medium — upgrade http-proxy-middleware to safe versions
**Issue**: #54
**Date**: 2026-08-01

## Test Cases

### TC-001: No http-proxy-middleware version in range >=1.3.0 <2.0.8 in package-lock.json
**Type**: code-review
**Steps**:
1. Run `npm ls http-proxy-middleware` to inspect all resolved copies in the dependency tree.
2. Confirm no resolved version falls in the range `>=1.3.0 <2.0.8`.
**Expected**: Every resolved copy of `http-proxy-middleware` is ≥ 2.0.8 or ≥ 3.0.x/4.x.
**Pass Criteria**: `npm ls` output shows no version between 1.3.0 (inclusive) and 2.0.8 (exclusive).

---

### TC-002: No http-proxy-middleware version in range >=3.0.0 <3.0.4 in package-lock.json
**Type**: code-review
**Steps**:
1. Run `npm ls http-proxy-middleware` to inspect all resolved copies.
2. Confirm no resolved version falls in the range `>=3.0.0 <3.0.4`.
**Expected**: Every resolved 3.x copy of `http-proxy-middleware` is ≥ 3.0.4 (or belongs to the 4.x line, which also satisfies ≥ 3.0.4 semantically).
**Pass Criteria**: `npm ls` output shows no version between 3.0.0 (inclusive) and 3.0.4 (exclusive).

---

### TC-003: The overrides entry is present in package.json
**Type**: code-review
**Steps**:
1. Open `package.json` and locate the `overrides` section.
2. Confirm `"http-proxy-middleware": ">=2.0.8 <3.0.0 || >=3.0.4"` (or equivalent safe range) is present.
**Expected**: The override key `http-proxy-middleware` exists in `overrides` and its value covers both the 2.x safe floor and the 3.x safe floor.
**Pass Criteria**: `package.json` `overrides` block contains `"http-proxy-middleware"` key with a range that excludes `<2.0.8` and `>=3.0.0 <3.0.4`.

---

### TC-004: npm audit no longer reports http-proxy-middleware advisories
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Search the output for any advisory referencing `http-proxy-middleware`.
**Expected**: Zero advisories mentioning `http-proxy-middleware`.
**Pass Criteria**: `npm audit` output contains no lines or advisories with the text `http-proxy-middleware`.

---

### TC-005: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Check the exit code.
**Expected**: Angular production build completes successfully and produces output bundle in `dist/plm-ui`.
**Pass Criteria**: Process exits 0 and the build output reports "Application bundle generation complete."

---

### TC-006: npm test exits with code 0 (no regressions introduced by this change)
**Type**: functional
**Steps**:
1. Run `npm test` (headless).
2. Examine any failures: confirm they are pre-existing and unrelated to the `http-proxy-middleware` override.
**Expected**: No new test failures attributable to the `http-proxy-middleware` version override.
**Pass Criteria**: Any failures are traceable to known pre-existing issues (e.g. `throwMatDuplicatedDrawerError` tracked in #61, or `AppComponent should render title` assertion unrelated to proxy middleware).
