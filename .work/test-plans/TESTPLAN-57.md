# Test Plan: Fix medium — upgrade socket.io to ≥ 4.6.2 and socket.io-parser to ≥ 4.2.3
**Issue**: #57
**Date**: 2026-08-01

## Test Cases

### TC-001: package-lock.json contains no socket.io version in range >=3.0.0 <4.6.2
**Type**: code-review (npm ls)
**Steps**:
1. Run `npm ls socket.io` to inspect the resolved version in package-lock.json / node_modules.
**Expected**: Only versions ≥ 4.6.2 of `socket.io` are resolved; no version in `>=3.0.0 <4.6.2` exists.
**Pass Criteria**: `npm ls socket.io` output shows `socket.io@4.6.2` or higher with no older duplicate entries.

---

### TC-002: package-lock.json contains no socket.io-parser version in range >=4.0.4 <4.2.3
**Type**: code-review (npm ls)
**Steps**:
1. Run `npm ls socket.io-parser` to inspect the resolved version in package-lock.json / node_modules.
**Expected**: Only versions ≥ 4.2.3 of `socket.io-parser` are resolved; no version in `>=4.0.4 <4.2.3` exists.
**Pass Criteria**: `npm ls socket.io-parser` output shows `socket.io-parser@4.2.3` or higher with no older duplicate entries.

---

### TC-003: npm audit reports no medium advisories for socket.io or socket.io-parser
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Inspect the output for any advisory mentioning `socket.io` or `socket.io-parser`.
**Expected**: Neither `socket.io` nor `socket.io-parser` appears as a vulnerable package in the audit report.
**Pass Criteria**: The string "socket.io" (as a package name in an advisory) does not appear in `npm audit` output; any remaining advisories belong to out-of-scope packages.

---

### TC-004: package.json overrides contain the correct socket.io and socket.io-parser constraints
**Type**: code-review
**Steps**:
1. Read `package.json` and inspect the `overrides` block.
**Expected**: `"socket.io": ">=4.6.2"` and `"socket.io-parser": ">=4.2.3"` are present.
**Pass Criteria**: Both keys exist with the correct version constraints and no src/ files were modified.

---

### TC-005: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
**Expected**: Angular production build completes with exit code 0.
**Pass Criteria**: Exit code is 0 and the output contains "Application bundle generation complete."

---

### TC-006: npm test exits with code 0 (pre-existing failures exempted)
**Type**: functional
**Steps**:
1. Run `npm test`.
2. For each failing spec, determine whether the failure is caused by this story's changes (socket.io/socket.io-parser version bump) or is a pre-existing issue unrelated to dependency versions.
**Expected**: All spec failures are pre-existing and unrelated to socket.io version changes.
**Pass Criteria**: No new test failures attributable to the socket.io or socket.io-parser version upgrade. Pre-existing failures are noted with tracking issues.
