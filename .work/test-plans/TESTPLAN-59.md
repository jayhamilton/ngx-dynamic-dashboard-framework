# Test Plan: Fix low: upgrade on-headers to ≥ 1.1.0 and cookie to ≥ 0.7.0
**Issue**: #59
**Date**: 2026-08-01

## Test Cases

### TC-001: package-lock.json contains no version of on-headers below 1.1.0
**Type**: code-review / functional
**Steps**:
1. Run `npm ls on-headers` to inspect all resolved versions of on-headers in the dependency tree.
2. Confirm every listed version is ≥ 1.1.0.
**Expected**: All resolved instances of `on-headers` are at version 1.1.0 or higher.
**Pass Criteria**: `npm ls on-headers` output shows no version string below `1.1.0` for any node in the tree.

### TC-002: package-lock.json contains no version of cookie below 0.7.0
**Type**: code-review / functional
**Steps**:
1. Run `npm ls cookie` to inspect all resolved versions of cookie in the dependency tree.
2. Confirm every listed version is ≥ 0.7.0.
**Expected**: All resolved instances of `cookie` are at version 0.7.0 or higher.
**Pass Criteria**: `npm ls cookie` output shows no version string below `0.7.0` for any node in the tree.

### TC-003: npm audit no longer reports low-severity advisories for on-headers or cookie
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Search the output for any advisory mentioning `on-headers`.
3. Search the output for any advisory mentioning `cookie` with a low-severity classification.
**Expected**: No advisory lines reference `on-headers` or `cookie` as directly vulnerable packages.
**Pass Criteria**: `npm audit` output contains zero mentions of `on-headers` as a vulnerable package, and zero mentions of `cookie <0.7.0` as an unresolved advisory.

### TC-004: npm run build exits with code 0 after the change
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Observe exit code.
**Expected**: Build completes successfully with exit code 0.
**Pass Criteria**: Exit code is 0; no build errors in output.

### TC-005: npm test exits with code 0 after the change
**Type**: functional
**Steps**:
1. Run `npm test` (headless).
2. Observe exit code and test results.
**Expected**: All tests pass with exit code 0.
**Pass Criteria**: Exit code is 0; no test failures reported.
