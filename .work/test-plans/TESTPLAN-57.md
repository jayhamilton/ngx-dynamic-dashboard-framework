# Test Plan: Fix medium — upgrade socket.io to ≥ 4.6.2 and socket.io-parser to ≥ 4.2.3
**Issue**: #57
**Date**: 2026-08-01

## Test Cases

### TC-001: package-lock.json contains no socket.io version in range >=3.0.0 <4.6.2
**Type**: code-review
**Steps**:
1. Open `package-lock.json`
2. Search for all entries with key `"socket.io"` (excluding `socket.io-parser`, `socket.io-adapter`)
3. For each resolved `"version"` value, confirm it is ≥ 4.6.2
**Expected**: All resolved `socket.io` entries have version ≥ 4.6.2
**Pass Criteria**: No `socket.io` version string in the lock file falls in the range `>=3.0.0 <4.6.2`

---

### TC-002: package-lock.json contains no socket.io-parser version in range >=4.0.4 <4.2.3
**Type**: code-review
**Steps**:
1. Open `package-lock.json`
2. Search for all entries with key `"socket.io-parser"`
3. For each resolved `"version"` value, confirm it is ≥ 4.2.3
**Expected**: All resolved `socket.io-parser` entries have version ≥ 4.2.3
**Pass Criteria**: No `socket.io-parser` version string in the lock file falls in the range `>=4.0.4 <4.2.3`

---

### TC-003: npm audit no longer reports medium advisories for socket.io or socket.io-parser
**Type**: functional
**Steps**:
1. Run `npm install` (to ensure lock file is fully applied)
2. Run `npm audit --audit-level=moderate`
3. Inspect output for any advisories mentioning `socket.io` or `socket.io-parser`
**Expected**: No medium or higher advisories for `socket.io` or `socket.io-parser`
**Pass Criteria**: `npm audit` output contains no advisory entries for `socket.io` or `socket.io-parser` in the medium range (`>=4.0.4`)

---

### TC-004: package.json overrides block contains the required entries
**Type**: code-review
**Steps**:
1. Open `package.json`
2. Locate the `"overrides"` key
3. Confirm `"socket.io": ">=4.6.2"` is present
4. Confirm `"socket.io-parser": ">=4.2.3"` is present
**Expected**: Both overrides exist in `package.json`
**Pass Criteria**: Both override entries are present with the correct version constraints

---

### TC-005: npm run build exits with code 0 after the change
**Type**: functional
**Steps**:
1. Run `npm install`
2. Run `npm run build`
3. Observe exit code
**Expected**: Build succeeds without errors
**Pass Criteria**: `npm run build` exits with code 0; no build-time errors introduced by the override

---

### TC-006: npm test exits with code 0 after the change
**Type**: functional
**Steps**:
1. Run `npm install`
2. Run `npm test`
3. Observe exit code
**Expected**: All tests pass without errors
**Pass Criteria**: `npm test` exits with code 0; no test failures introduced by the override

---

### TC-007: No application source files (src/) were modified
**Type**: code-review
**Steps**:
1. List all changed files in the implementation commit
2. Confirm no files under `src/` were touched
**Expected**: Only `package.json` (and ideally `package-lock.json`) were modified
**Pass Criteria**: Zero modifications to any file under `src/`
