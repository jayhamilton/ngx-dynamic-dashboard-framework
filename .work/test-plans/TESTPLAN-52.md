# Test Plan: Fix high: upgrade ws to ≥ 8.17.1
**Issue**: #52
**Date**: 2026-08-01

## Test Cases

### TC-001: package-lock.json contains no ws 8.x version below 8.17.1
**Type**: code-review
**Steps**:
1. Run `npm ls ws` to inspect all resolved copies of `ws` in node_modules / package-lock.json.
2. Confirm every listed version is ≥ 8.17.1.
**Expected**: All resolved `ws` instances show a version number ≥ 8.17.1; no entry is in the 8.0.0–8.17.0 range.
**Pass Criteria**: `npm ls ws` output contains only version strings matching 8.17.1 or higher across every dependency path.

---

### TC-002: npm audit no longer reports a high-severity advisory for ws
**Type**: code-review
**Steps**:
1. Run `npm audit`.
2. Scan the output for any advisory whose package name is `ws` at high or critical severity.
**Expected**: No `ws`-related high- or critical-severity advisory appears. Any remaining advisories are for unrelated packages at moderate or lower severity.
**Pass Criteria**: The word "ws" does not appear as a vulnerable package in the audit report, and no advisory is labelled "high" or "critical".

---

### TC-003: package.json overrides block contains "ws": ">=8.17.1"
**Type**: code-review
**Steps**:
1. Read `package.json`.
2. Locate the `overrides` key.
3. Confirm `"ws": ">=8.17.1"` is present in that block.
**Expected**: The override is explicitly declared, formally pinning the floor version and preventing a future regression if upstream transitive resolutions change.
**Pass Criteria**: `package.json` `overrides` block contains the exact key-value pair `"ws": ">=8.17.1"`.

---

### TC-004: npm run build exits with code 0 after the change
**Type**: functional
**Steps**:
1. Run `npm run build` (Angular production build).
2. Observe the exit code and build output.
**Expected**: Build completes successfully, application bundle files are emitted, and the process exits 0.
**Pass Criteria**: Exit code is 0 and "Application bundle generation complete" appears in the output.

---

### TC-005: npm test exits with code 0 after the change
**Type**: functional
**Steps**:
1. Run `npm test` (Karma/Jasmine headless suite).
2. Observe the exit code and any test failures.
3. If failures exist, determine whether each failing spec is caused by this story's changes (ws version bump) or is a pre-existing, unrelated defect.
**Expected**: Test suite passes, or any failures are pre-existing issues (e.g., `throwMatDuplicatedDrawerError` tracked in issue #61) wholly unrelated to the `ws` upgrade.
**Pass Criteria**: Exit code 0, OR every failing spec's error is demonstrably pre-existing and unrelated to the `ws` dependency change (no source files were modified).
