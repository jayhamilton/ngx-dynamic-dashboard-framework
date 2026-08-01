# Test Plan: Fix high: upgrade ws to ≥ 8.17.1
**Issue**: #52
**Date**: 2026-08-01

## Test Cases

### TC-001: package-lock.json contains no ws in 8.x below 8.17.1
**Type**: code-review / functional
**Steps**:
1. Run `npm ls ws` to inspect all resolved copies of `ws` across all dependency paths.
2. Confirm every reported version is ≥ 8.17.1.
**Expected**: All resolved `ws` versions are ≥ 8.17.1 (no entry shows a version < 8.17.1).
**Pass Criteria**: `npm ls ws` output shows only versions ≥ 8.17.1 for every tree path.

### TC-002: package.json overrides block contains the ws floor pin
**Type**: code-review
**Steps**:
1. Read `package.json`.
2. Confirm the `overrides` block contains `"ws": ">=8.17.1"`.
**Expected**: The override is formally declared to prevent regression.
**Pass Criteria**: `"ws": ">=8.17.1"` is present in the `overrides` object in `package.json`.

### TC-003: npm audit reports no high-severity advisory for ws
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Inspect output for any advisory mentioning `ws` at severity "high" or "critical".
**Expected**: No high-severity `ws` advisory appears; only unrelated moderate advisories (if any) remain.
**Pass Criteria**: The string "ws" does not appear as a vulnerable package at high/critical severity in the audit output.

### TC-004: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Observe exit code and output.
**Expected**: Build completes successfully with exit code 0, producing output bundles.
**Pass Criteria**: Command reports `EXIT 0` and "Application bundle generation complete."

### TC-005: npm test exits with code 0
**Type**: functional
**Steps**:
1. Run `npm test` (headless).
2. Observe exit code and all test results.
**Expected**: All tests pass with exit code 0 — no failures or disconnects.
**Pass Criteria**: Command reports `EXIT 0` with all specs executed successfully.
