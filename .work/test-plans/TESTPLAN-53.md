# Test Plan: Fix medium — upgrade webpack-dev-server to ≥ 5.2.1
**Issue**: #53
**Date**: 2026-08-01

## Test Cases

### TC-001: webpack-dev-server resolved version is ≥ 5.2.1
**Type**: code-review + functional
**Steps**:
1. Read `package.json` and confirm the `overrides` block contains `"webpack-dev-server": ">=5.2.1"`.
2. Run `npm ls webpack-dev-server` and inspect the resolved version in `node_modules`/`package-lock.json`.
**Expected**: `package.json` overrides contains the entry, and the resolved version reported by `npm ls` is ≥ 5.2.1.
**Pass Criteria**: `npm ls webpack-dev-server` output shows a version string that is ≥ 5.2.1 for all resolved instances.

---

### TC-002: npm audit reports no medium advisories directly tied to webpack-dev-server
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Inspect output for any advisory whose **vulnerable package** is `webpack-dev-server` itself (not a transitive chain through sockjs/uuid, which is out of scope).
**Expected**: Zero advisories with `webpack-dev-server` as the root vulnerable package.
**Pass Criteria**: The audit output does not list `webpack-dev-server` as a directly-vulnerable package. Any remaining mention is through an unrelated transitive chain with "No fix available".

---

### TC-003: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Observe the exit code and build output.
**Expected**: Angular production build completes without errors.
**Pass Criteria**: Exit code is 0; output contains "Application bundle generation complete."

---

### TC-004: npm test exits with code 0
**Type**: functional
**Steps**:
1. Run `npm test` (headless).
2. Observe the exit code and test output.
**Expected**: All Karma/Jasmine test suites pass without errors.
**Pass Criteria**: Exit code is 0; all 26 specs pass with no ERRORs or DISCONNECTs.

---

### TC-005: No application source files were modified
**Type**: code-review
**Steps**:
1. Inspect the "Changes Made" section of IMPL-53.md.
2. Confirm only `package.json` and `package-lock.json` appear in the change set.
**Expected**: Zero changes in `src/`, `angular.json`, `tsconfig*.json`, or `karma.conf.js`.
**Pass Criteria**: IMPL-53.md and `package.json` confirm only dependency files were modified.
