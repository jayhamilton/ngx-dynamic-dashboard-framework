# Test Plan: Fix medium: upgrade esbuild to ≥ 0.25.0
**Issue**: #55
**Date**: 2026-08-02

## Test Cases

### TC-001: package-lock.json contains no version of esbuild ≤ 0.24.2
**Type**: code-review
**Steps**:
1. Run `npm ls esbuild` to inspect all resolved esbuild versions in node_modules / package-lock.json.
2. Confirm every listed version is ≥ 0.25.0.
**Expected**: All esbuild entries resolve to a version ≥ 0.25.0; no entry ≤ 0.24.2 is present.
**Pass Criteria**: `npm ls esbuild` output shows only versions ≥ 0.25.0 with exit code 0.

### TC-002: package.json overrides block contains the esbuild constraint
**Type**: code-review
**Steps**:
1. Read `package.json` and locate the `"overrides"` block.
2. Confirm an `"esbuild": ">=0.25.0"` entry is present.
**Expected**: The overrides block explicitly constrains esbuild to ≥ 0.25.0.
**Pass Criteria**: `"esbuild": ">=0.25.0"` is present in the `overrides` object in `package.json`.

### TC-003: npm audit no longer reports a medium advisory for esbuild
**Type**: code-review
**Steps**:
1. Run `npm audit`.
2. Scan the output for any advisory line referencing `esbuild`.
**Expected**: No advisory for esbuild appears in the audit report.
**Pass Criteria**: The word "esbuild" does not appear in the `npm audit` advisory output.

### TC-004: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Check the exit code.
**Expected**: Build completes successfully, producing output in `dist/plm-ui`.
**Pass Criteria**: Exit code 0; build output directory `dist/plm-ui` is produced.

### TC-005: npm test exits with code 0 (no newly introduced failures)
**Type**: functional
**Steps**:
1. Run `npm test`.
2. Examine the exit code and any failing specs.
3. For any failures, determine whether the failure is pre-existing and unrelated to esbuild.
**Expected**: All tests pass, or any failures are pre-existing issues unrelated to the esbuild version change.
**Pass Criteria**: Exit code 0, OR all failing specs are caused by pre-existing issues (e.g., the `throwMatDuplicatedDrawerError` tracked in issue #61) that existed before this story's changes.
