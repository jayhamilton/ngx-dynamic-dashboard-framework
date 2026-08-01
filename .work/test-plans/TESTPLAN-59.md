# Test Plan: Fix low: upgrade on-headers to ≥ 1.1.0 and cookie to ≥ 0.7.0
**Issue**: #59
**Date**: 2026-08-01

## Test Cases

### TC-001: package-lock.json contains no version of on-headers below 1.1.0
**Type**: code-review (resolved version verification)
**Steps**:
1. Run `npm ls on-headers` to inspect the resolved version actually installed in node_modules / recorded in package-lock.json.
2. Confirm every entry shows a version ≥ 1.1.0.
**Expected**: All resolved instances of `on-headers` are at version 1.1.0 or higher.
**Pass Criteria**: `npm ls on-headers` output contains only `on-headers@1.1.0` (or higher) and no entry below 1.1.0.

---

### TC-002: package-lock.json contains no version of cookie below 0.7.0
**Type**: code-review (resolved version verification)
**Steps**:
1. Run `npm ls cookie` to inspect the resolved version actually installed in node_modules / recorded in package-lock.json.
2. Confirm every entry shows a version ≥ 0.7.0.
**Expected**: All resolved instances of `cookie` are at version 0.7.0 or higher.
**Pass Criteria**: `npm ls cookie` output contains only `cookie@0.7.0` (or higher) and no entry below 0.7.0.

---

### TC-003: npm audit no longer reports low-severity advisories for on-headers or cookie
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Inspect the output for any advisory mentioning `on-headers` or `cookie`.
**Expected**: Neither `on-headers` nor `cookie` appears in the audit report.
**Pass Criteria**: The strings "on-headers" and "cookie" are absent from `npm audit` output (remaining advisories, if any, are for other packages and are out of scope for this story).

---

### TC-004: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Observe exit code and build output.
**Expected**: Angular production build completes successfully with exit code 0.
**Pass Criteria**: Command exits 0 and "Application bundle generation complete" appears in output.

---

### TC-005: npm test exits with code 0 (pre-existing failures excluded)
**Type**: functional
**Steps**:
1. Run `npm test` (headless Karma/Jasmine).
2. Read the failure output carefully to determine if any failure is caused by this story's dependency changes.
**Expected**: No test failures attributable to the `on-headers` or `cookie` version upgrades.
**Pass Criteria**: Any failing specs are demonstrably pre-existing (e.g. `throwMatDuplicatedDrawerError` tracked in #61) and unrelated to this story's changes. No new failures introduced by upgrading `on-headers` or `cookie`.

---

### TC-006: package.json overrides are correctly declared
**Type**: code-review
**Steps**:
1. Read `package.json`.
2. Verify the `overrides` block contains entries for both `on-headers` (≥ 1.1.0) and `cookie` (≥ 0.7.0).
**Expected**: Overrides block declares `"on-headers": ">=1.1.0"` and `"cookie": ">=0.7.0"`.
**Pass Criteria**: Both entries are present with the correct semver range constraints in the `overrides` field of `package.json`.

---

### TC-007: No application source files (src/) were modified
**Type**: code-review
**Steps**:
1. Inspect the "Changes Made" section of IMPL-59.md.
2. Confirm no files under `src/` are listed.
**Expected**: Implementation is limited to `package-lock.json` regeneration; `package.json` overrides were pre-existing; `src/` is untouched.
**Pass Criteria**: IMPL-59.md lists only `package-lock.json` (and notes `package.json` needed no changes). No `src/` files appear in the change set.
