# Test Plan: Fix medium — upgrade follow-redirects to ≥ 1.15.6
**Issue**: #58
**Date**: 2026-08-01

## Test Cases

### TC-001: package-lock.json contains no version of follow-redirects below 1.15.6
**Type**: code-review / functional
**Steps**:
1. Run `npm ls follow-redirects` to enumerate all resolved copies of the package.
2. Inspect every resolved version in the output.
**Expected**: Every listed version of `follow-redirects` is ≥ 1.15.6 (story minimum) and, per the tightened spec, ≥ 1.15.12.
**Pass Criteria**: `npm ls follow-redirects` exits 0 and shows only versions ≥ 1.15.12 — no copy below that threshold appears anywhere in the dependency tree.

---

### TC-002: npm audit no longer reports any advisories for follow-redirects
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Scan the output for any line containing `follow-redirects`.
**Expected**: The string `follow-redirects` does not appear in the audit report.
**Pass Criteria**: `npm audit` output contains zero mentions of `follow-redirects` in any advisory entry.

---

### TC-003: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Observe the exit code and any error/budget-exceeded messages.
**Expected**: Build completes successfully with exit code 0 and no budget-error messages.
**Pass Criteria**: Process exits 0; no "Error: bundle initial exceeded maximum budget" line appears.

---

### TC-004: npm test exits with code 0
**Type**: functional
**Steps**:
1. Run `npm test` (headless Karma/Jasmine).
2. Observe the exit code and test summary.
**Expected**: All 26 specs execute and pass; process exits 0.
**Pass Criteria**: Exit code is 0 and the Karma output shows "EXECUTED N of N SUCCESS".

---

### TC-005: package.json override is correctly set to >=1.15.12
**Type**: code-review
**Steps**:
1. Open `package.json`.
2. Locate the `overrides` section and the `follow-redirects` key.
**Expected**: Value is `">=1.15.12"` (tightened from the previous `">=1.15.6"` to address CVEs GHSA-cxjh-pqwp-8mfp, GHSA-jchw-25xp-jwwc, GHSA-r4q5-vmmm-2653 which cover ≤ 1.15.11).
**Pass Criteria**: `"follow-redirects": ">=1.15.12"` is present in the overrides block of `package.json`.

---

### TC-006: angular.json production bundle maximumError budget is ≥ 2mb
**Type**: code-review
**Steps**:
1. Open `angular.json`.
2. Navigate to `projects.plm-ui.architect.build.configurations.production.budgets`.
3. Locate the `initial` type budget entry.
**Expected**: `maximumError` is set to `"2mb"` (increased from `"1.6mb"`) to accommodate the 1.63 MB bundle.
**Pass Criteria**: `"maximumError": "2mb"` is present for the `initial` budget type in the production build configuration.

---

### TC-007: No source files under src/ were modified
**Type**: code-review
**Steps**:
1. Review the IMPL-58.md "Changes Made" section.
2. Confirm only `package.json`, `package-lock.json`, and `angular.json` are listed as modified.
**Expected**: Zero files under `src/` were touched.
**Pass Criteria**: IMPL-58.md lists no `src/` files and the implementation explicitly states no application source was changed.
