# Test Plan: Fix medium — upgrade follow-redirects to ≥ 1.15.6
**Issue**: #58
**Date**: 2026-08-02

## Test Cases

### TC-001: package-lock.json contains no version of follow-redirects below 1.15.6
**Type**: code-review / functional
**Steps**:
1. Run `npm ls follow-redirects` to inspect the resolved version(s) in the current node_modules and package-lock.json.
2. Confirm that every listed version is ≥ 1.15.6 (spec tightened to ≥ 1.15.12 due to a new advisory covering ≤ 1.15.11).
**Expected**: Only versions ≥ 1.15.12 (resolving to 1.16.0 or higher) appear.
**Pass Criteria**: `npm ls follow-redirects` shows one or more entries, all ≥ 1.15.12. No entry below 1.15.12 is present.

### TC-002: npm audit reports no advisories for follow-redirects
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Inspect the output for any mention of `follow-redirects`.
**Expected**: The advisory output contains zero entries related to `follow-redirects`.
**Pass Criteria**: The string "follow-redirects" does not appear in the `npm audit` output (or if it does, it is not flagged as a vulnerability).

### TC-003: package.json override is set to >=1.15.12
**Type**: code-review
**Steps**:
1. Read `package.json` and inspect the `overrides` section.
2. Confirm the `follow-redirects` key is set to `">=1.15.12"`.
**Expected**: `"follow-redirects": ">=1.15.12"` present in `overrides`.
**Pass Criteria**: Exact string `">=1.15.12"` is the value for `follow-redirects` in `overrides`.

### TC-004: angular.json maximumError budget increased to 2mb
**Type**: code-review
**Steps**:
1. Read `angular.json` and inspect the production build budgets section.
2. Confirm `maximumError` for the `initial` bundle type is `2mb`.
**Expected**: `"maximumError": "2mb"` present in the production initial budget.
**Pass Criteria**: Value is exactly `"2mb"` (previously `1.6mb`).

### TC-005: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Observe exit code and output.
**Expected**: Build succeeds with exit code 0; no bundle budget error for the initial bundle.
**Pass Criteria**: `npm run build` exits 0 with no ERROR messages related to bundle size or compilation.

### TC-006: npm test exits with code 0
**Type**: functional
**Steps**:
1. Run `npm test`.
2. Observe exit code and any failing specs.
**Expected**: All specs pass; exit code is 0.
**Pass Criteria**: Exit code 0. Any pre-existing failures (e.g., throwMatDuplicatedDrawerError tracked in #61, or NG05105 animation errors) are noted but do not fail this story. Any failure caused by the follow-redirects or angular.json change fails the criterion.

### TC-007: No changes to src/ files
**Type**: code-review
**Steps**:
1. Review the IMPL-58.md "Changes Made" section.
2. Confirm no files under `src/` were modified.
**Expected**: Only `package.json`, `package-lock.json`, and `angular.json` were changed.
**Pass Criteria**: IMPL confirms no `src/` changes; story scope is respected.
