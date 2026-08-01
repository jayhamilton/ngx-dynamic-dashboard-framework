# Test Plan: Fix medium – upgrade vite to ≥ 5.4.12
**Issue**: #56
**Date**: 2026-08-01

## Test Cases

### TC-001: package-lock.json contains no vite version in range >=5.0.0 <=5.4.11
**Type**: code-review / functional
**Steps**:
1. Run `npm ls vite` to enumerate all resolved vite versions in the installed dependency tree.
2. Confirm no resolved version falls in the range `>=5.0.0 <=5.4.11`.
**Expected**: The only vite entry is version 8.x (or otherwise ≥5.4.12); no 5.0.0–5.4.11 version appears.
**Pass Criteria**: `npm ls vite` output shows zero entries whose version satisfies `>=5.0.0 <=5.4.11`.

---

### TC-002: package.json overrides block contains vite ≥ 5.4.12
**Type**: code-review
**Steps**:
1. Open `package.json` and inspect the `"overrides"` section.
2. Confirm an entry `"vite": ">=5.4.12"` is present.
**Expected**: `"vite": ">=5.4.12"` exists in the `"overrides"` map.
**Pass Criteria**: The exact key/value pair is present in `package.json`.

---

### TC-003: npm audit no longer reports a medium advisory for vite
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Inspect output for any medium (or higher) advisory mentioning `vite` in the vulnerable range `>=5.0.0 <=5.4.11`.
**Expected**: No medium advisory targeting `vite` in the vulnerable range appears in the audit output.
**Pass Criteria**: Audit output contains no advisory for `vite` with severity ≥ medium referencing the `>=5.0.0 <=5.4.11` range.

---

### TC-004: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Observe the exit code and build output.
**Expected**: Build completes successfully with exit code 0 and no errors.
**Pass Criteria**: `npm run build` exits 0; no build-breaking errors in output.

---

### TC-005: npm test exits with code 0
**Type**: functional
**Steps**:
1. Run `npm test`.
2. Observe the exit code and test output.
**Expected**: All tests pass with exit code 0.
**Pass Criteria**: `npm test` exits 0; no test failures or errors introduced by this change.
