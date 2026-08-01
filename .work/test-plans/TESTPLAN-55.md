# Test Plan: Fix medium: upgrade esbuild to ≥ 0.25.0
**Issue**: #55
**Date**: 2026-08-01

## Test Cases

### TC-001: No esbuild version ≤ 0.24.2 in package-lock.json
**Type**: code-review
**Steps**:
1. Read `package.json` and verify an `overrides` entry for `"esbuild": ">=0.25.0"` exists.
2. Run `npm ls esbuild` to confirm all resolved instances are ≥ 0.25.0.
**Expected**: Every resolved esbuild entry in node_modules / package-lock.json is ≥ 0.25.0.
**Pass Criteria**: `npm ls esbuild` output contains ONLY version strings ≥ 0.25.0; no entry shows ≤ 0.24.2.

---

### TC-002: npm audit no longer reports a medium advisory for esbuild
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Inspect the output for any advisory line referencing `esbuild`.
**Expected**: Zero audit advisories mentioning `esbuild`.
**Pass Criteria**: The string "esbuild" does not appear in the `npm audit` advisory report.

---

### TC-003: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Check the exit code and console output.
**Expected**: Build completes successfully, producing output in `dist/plm-ui`. Exit code = 0.
**Pass Criteria**: Process exits 0 and "Application bundle generation complete" is present in stdout.

---

### TC-004: npm test exits with code 0
**Type**: functional
**Steps**:
1. Run `npm test` (headless Chrome).
2. Check the exit code and full console output for failures.
**Expected**: All 26 specs pass. Exit code = 0.
**Pass Criteria**: Process exits 0 with no ERROR or FAILED lines in Karma output.
