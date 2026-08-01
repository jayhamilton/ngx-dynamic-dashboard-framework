# Test Plan: Fix medium: upgrade follow-redirects to ≥ 1.15.6
**Issue**: #58
**Date**: 2026-08-01

## Test Cases

### TC-001: `package.json` overrides block contains follow-redirects ≥ 1.15.6
**Type**: code-review
**Steps**:
1. Open `package.json`
2. Locate the `"overrides"` section
3. Check that `"follow-redirects"` key is present with a value that pins it to ≥ 1.15.6
**Expected**: The `"overrides"` object contains `"follow-redirects": ">=1.15.6"`
**Pass Criteria**: `package.json` contains `"follow-redirects": ">=1.15.6"` inside `"overrides"`, and is colocated alongside other overrides (e.g., `on-headers`, `cookie`, `socket.io`, etc.)

---

### TC-002: `package-lock.json` contains no follow-redirects version below 1.15.6
**Type**: code-review
**Steps**:
1. Open `package-lock.json`
2. Search all occurrences of `"follow-redirects"` package entries (both under `"packages"` and `"dependencies"`)
3. Verify the resolved version of every `follow-redirects` entry is ≥ 1.15.6
**Expected**: Every `"follow-redirects"` block in `package-lock.json` resolves to version ≥ 1.15.6
**Pass Criteria**: No entry with `"version": "1.15.5"` or any earlier version exists for `follow-redirects`

---

### TC-003: No application source files (`src/`) were modified
**Type**: code-review
**Steps**:
1. Review the IMPL-58.md to confirm the scope
2. Confirm the only change is in `package.json` (and the lock file regeneration)
3. Verify no files under `src/` were touched
**Expected**: Implementation touches only `package.json` (overrides entry) and `package-lock.json` (regenerated automatically)
**Pass Criteria**: IMPL explicitly states no `src/` changes; spec and implementation confirm scope is limited to dependency resolution only

---

### TC-004: `npm audit` would produce no advisories for follow-redirects (functional - human tester)
**Type**: functional
**Steps**:
1. Run `npm install` to apply the overrides
2. Run `npm audit --json | grep -A5 follow-redirects`
3. Confirm zero advisories for `follow-redirects`
**Expected**: `npm audit` output shows no vulnerabilities referencing `follow-redirects`
**Pass Criteria**: Zero audit findings for `follow-redirects` after install

---

### TC-005: `npm run build` exits with code 0 (functional - human tester)
**Type**: functional
**Steps**:
1. Ensure `npm install` has been run with the updated `package.json`
2. Run `npm run build`
3. Check exit code
**Expected**: Build completes successfully with exit code 0
**Pass Criteria**: Build does not fail due to the dependency override

---

### TC-006: `npm test` exits with code 0 (functional - human tester)
**Type**: functional
**Steps**:
1. Ensure `npm install` has been run with the updated `package.json`
2. Run `npm test`
3. Check exit code
**Expected**: Test suite passes with exit code 0
**Pass Criteria**: No test failures introduced by the dependency override
