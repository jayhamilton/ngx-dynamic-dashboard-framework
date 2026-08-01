# Test Plan: Fix medium — upgrade socket.io to ≥ 4.6.2 and socket.io-parser to ≥ 4.2.3
**Issue**: #57
**Date**: 2026-08-01

## Test Cases

### TC-001: package-lock.json contains no socket.io version in range >=3.0.0 <4.6.2
**Type**: code-review / functional
**Steps**:
1. Run `npm ls socket.io` to see the resolved version in node_modules / package-lock.json.
**Expected**: Only socket.io ≥ 4.6.2 is present.
**Pass Criteria**: `npm ls socket.io` output shows `socket.io@4.6.2` or higher with no other socket.io entries below 4.6.2.

---

### TC-002: package-lock.json contains no socket.io-parser version in range >=4.0.4 <4.2.3
**Type**: code-review / functional
**Steps**:
1. Run `npm ls socket.io-parser` to see the resolved version in node_modules / package-lock.json.
**Expected**: Only socket.io-parser ≥ 4.2.3 is present.
**Pass Criteria**: `npm ls socket.io-parser` output shows `socket.io-parser@4.2.3` or higher with no other entries below 4.2.3.

---

### TC-003: package.json overrides entries are present and correct
**Type**: code-review
**Steps**:
1. Read `package.json` and inspect the `"overrides"` block.
**Expected**: `"socket.io": ">=4.6.2"` and `"socket.io-parser": ">=4.2.3"` are present.
**Pass Criteria**: Both override entries exist with the correct minimum version constraints.

---

### TC-004: npm audit no longer reports medium advisories for socket.io or socket.io-parser
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Inspect the report for any advisory mentioning `socket.io` or `socket.io-parser`.
**Expected**: Neither package appears in the audit output as a vulnerable package.
**Pass Criteria**: The text `socket.io` and `socket.io-parser` do not appear as vulnerable packages in the advisory list.

---

### TC-005: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
**Expected**: Angular production build completes with exit code 0.
**Pass Criteria**: Exit code is 0 and "Application bundle generation complete" is present in output.

---

### TC-006: npm test exits with code 0
**Type**: functional
**Steps**:
1. Run `npm test` (headless).
**Expected**: All Karma/Jasmine tests pass, exit code 0.
**Pass Criteria**: Exit code 0 and no FAILED or ERROR messages for tests.

---

### TC-007: No application source files (src/) were modified
**Type**: code-review
**Steps**:
1. Inspect the IMPL file for any changes to src/.
2. Review the "Files to Change" section in SPEC-57.md.
**Expected**: Only `package-lock.json` (and optionally `package.json`) were changed; no src/ files.
**Pass Criteria**: IMPL-57.md "Changes Made" section lists no src/ files.
