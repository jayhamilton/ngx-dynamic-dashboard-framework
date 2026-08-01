# Test Plan: Fix low: upgrade on-headers to ≥ 1.1.0 and cookie to ≥ 0.7.0
**Issue**: #59
**Date**: 2026-08-01

## Test Cases

### TC-001: on-headers override present in package.json
**Type**: code-review
**Steps**:
1. Open `package.json` and locate the top-level `"overrides"` block.
2. Verify that `"on-headers": ">=1.1.0"` is present as a key-value pair.
**Expected**: The `overrides` block exists at the top level and contains `"on-headers": ">=1.1.0"`.
**Pass Criteria**: `package.json` contains `"on-headers": ">=1.1.0"` inside the `"overrides"` object.

---

### TC-002: cookie override present in package.json
**Type**: code-review
**Steps**:
1. Open `package.json` and locate the top-level `"overrides"` block.
2. Verify that `"cookie": ">=0.7.0"` is present as a key-value pair.
**Expected**: The `overrides` block exists at the top level and contains `"cookie": ">=0.7.0"`.
**Pass Criteria**: `package.json` contains `"cookie": ">=0.7.0"` inside the `"overrides"` object.

---

### TC-003: package-lock.json is present and committed
**Type**: code-review
**Steps**:
1. Verify `package-lock.json` exists in the repository root.
2. Confirm it is tracked (not gitignored), as required by the story's technical notes ("Commit both package.json and package-lock.json").
**Expected**: `package-lock.json` exists and is a lockfileVersion 2 file reflecting the current dependency tree.
**Pass Criteria**: File is present, is valid JSON, and has `"lockfileVersion": 2`.

---

### TC-004: on-headers resolved version in package-lock.json ≥ 1.1.0
**Type**: code-review
**Steps**:
1. Open `package-lock.json`.
2. Search for all entries with key `"on-headers"` or `node_modules/on-headers`.
3. Confirm no resolved version is below `1.1.0`.
**Expected**: Every occurrence of `on-headers` in the lock file has a version ≥ 1.1.0.
**Pass Criteria**: No entry `"version": "1.0.x"` or earlier appears under any `on-headers` key.
**Notes**: This is a functional verification that requires running `npm install` + `npm ls on-headers`. The overrides block in `package.json` guarantees this once `npm install` is run; QA must verify after installation.

---

### TC-005: cookie resolved version in package-lock.json ≥ 0.7.0
**Type**: code-review
**Steps**:
1. Open `package-lock.json`.
2. Search for all entries with key `"cookie"` or `node_modules/cookie`.
3. Confirm no resolved version is below `0.7.0`.
**Expected**: Every occurrence of `cookie` in the lock file has a version ≥ 0.7.0.
**Pass Criteria**: No entry `"version": "0.6.x"` or earlier appears under any `cookie` key.
**Notes**: Same caveat as TC-004 — requires running `npm install` to regenerate lock file with overrides applied.

---

### TC-006: No changes in src/ directory
**Type**: code-review
**Steps**:
1. List the contents of the `src/` directory.
2. Confirm only standard Angular app files are present (no files added, modified, or deleted relative to baseline).
**Expected**: `src/` contains only standard app files: `app/`, `assets/`, `environments/`, `favicon.ico`, `index.html`, `main.ts`, `polyfills.ts`, `styles.scss`, `test.ts`.
**Pass Criteria**: No unexpected additions or modifications in `src/`.

---

### TC-007: npm audit clean for on-headers and cookie (functional)
**Type**: functional
**Steps**:
1. Run `npm install` to regenerate `package-lock.json` with overrides applied.
2. Run `npm audit`.
3. Confirm no advisories are reported for `on-headers` or `cookie`.
**Expected**: `npm audit` reports 0 vulnerabilities for `on-headers` and `cookie`.
**Pass Criteria**: Output of `npm audit` contains no advisory lines referencing `on-headers` or `cookie`.
**Notes**: Cannot be verified by static code review alone; requires runtime execution.

---

### TC-008: npm run build exits with code 0 (functional)
**Type**: functional
**Steps**:
1. Run `npm install` to regenerate `package-lock.json`.
2. Run `npm run build`.
3. Confirm the command exits with code 0.
**Expected**: Build succeeds without errors.
**Pass Criteria**: Exit code is 0; no build errors in output.
**Notes**: Cannot be verified by static code review alone.

---

### TC-009: npm test exits with code 0 (functional)
**Type**: functional
**Steps**:
1. Run `npm install` to regenerate `package-lock.json`.
2. Run `npm test`.
3. Confirm the command exits with code 0.
**Expected**: Test suite passes without errors.
**Pass Criteria**: Exit code is 0; all tests pass.
**Notes**: Cannot be verified by static code review alone.
