# Test Plan: Fix critical: loader-utils and socket.io-parser upgrades
**Issue**: #51
**Date**: 2026-08-02

## Test Cases

### TC-001: loader-utils 2.x resolved version is ≥ 2.0.3 in package-lock.json
**Type**: code-review
**Steps**:
1. Run `npm ls loader-utils` to inspect the resolved version tree.
2. Confirm no installed copy of `loader-utils` is in the `2.x` range below `2.0.3`.
**Expected**: Every `2.x` copy of `loader-utils` resolves to `2.0.3` or higher.
**Pass Criteria**: `npm ls loader-utils` output shows only `3.3.1` and/or `2.0.3`+ entries; no `2.0.0`, `2.0.1`, or `2.0.2` entry is present.

---

### TC-002: socket.io-parser 4.0.x resolved version is ≥ 4.0.5 in package-lock.json
**Type**: code-review
**Steps**:
1. Run `npm ls socket.io-parser` to inspect the resolved version tree.
2. Confirm no installed copy of `socket.io-parser` is in the `4.0.x` range below `4.0.5`.
**Expected**: `socket.io-parser` resolves to `4.0.5` or higher (or a newer minor/major).
**Pass Criteria**: `npm ls socket.io-parser` output shows only versions ≥ `4.0.5`; no entry of `4.0.0` through `4.0.4` is present.

---

### TC-003: npm audit reports no critical advisories for loader-utils or socket.io-parser
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Search output for "critical" severity entries referencing `loader-utils` or `socket.io-parser`.
**Expected**: Zero critical-severity advisories for either package.
**Pass Criteria**: `npm audit` output contains no critical advisory block naming `loader-utils` or `socket.io-parser`.

---

### TC-004: package.json overrides block contains loader-utils >= 2.0.3 entry
**Type**: code-review
**Steps**:
1. Read `package.json`.
2. Locate the `"overrides"` section.
3. Verify a `"loader-utils": ">=2.0.3"` key is present.
**Expected**: The override is explicitly declared to lock in the patched minimum and prevent future regressions.
**Pass Criteria**: `package.json` `"overrides"` block contains exactly `"loader-utils": ">=2.0.3"`.

---

### TC-005: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Record the exit code and output.
**Expected**: Angular production build completes without errors.
**Pass Criteria**: Exit code is `0`; output contains "Application bundle generation complete."

---

### TC-006: npm test exits with code 0 (or failures are pre-existing and unrelated to this story)
**Type**: functional
**Steps**:
1. Run `npm test`.
2. Record exit code and inspect any failing specs.
3. For each failing spec, determine whether the error is caused by this story's dependency changes (loader-utils / socket.io-parser version bump) or by a pre-existing, unrelated issue.
**Expected**: Either all specs pass, or only pre-existing failures (e.g., the `throwMatDuplicatedDrawerError` tracked in #61) are present — none attributable to this story's changes.
**Pass Criteria**: No spec failure is plausibly caused by upgrading `loader-utils` or `socket.io-parser`.
