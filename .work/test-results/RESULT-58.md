# Test Results: Fix medium: upgrade follow-redirects to ≥ 1.15.6
**Issue**: #58
**Verdict**: FAIL
**Date**: 2026-08-01

## Results

### TC-001: `package.json` overrides block contains follow-redirects ≥ 1.15.6
**Status**: PASS
**Evidence**: In `package.json`, the `"overrides"` section contains:
```json
"overrides": {
  "follow-redirects": ">=1.15.6",
  "on-headers": ">=1.1.0",
  "cookie": ">=0.7.0",
  "socket.io": ">=4.6.2",
  "socket.io-parser": ">=4.2.3",
  "vite": ">=5.4.12"
}
```
The `"follow-redirects": ">=1.15.6"` entry is present and correct.
**Notes**: The override directive itself is correctly authored and satisfies both alert ranges (`<1.15.4` and `<=1.15.5`).

---

### TC-002: `package-lock.json` contains no follow-redirects version below 1.15.6
**Status**: FAIL
**Evidence**: In `package-lock.json` at `node_modules/follow-redirects`:
```json
"node_modules/follow-redirects": {
  "version": "1.14.8",
  "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.14.8.tgz",
  ...
}
```
Also in the `"dependencies"` flat map:
```json
"follow-redirects": {
  "version": "1.14.8",
  ...
}
```
**Version `1.14.8` is below `1.15.6`** — this violates the acceptance criterion. The `package-lock.json` was NOT regenerated after the `"follow-redirects": ">=1.15.6"` override was added to `package.json`. The npm override is declared but not applied. `npm install` must be run to regenerate `package-lock.json` with a compliant resolved version.
**Notes**: This is a blocking bug. Until `npm install` is executed and `package-lock.json` is committed with `follow-redirects` ≥ 1.15.6, the Dependabot alerts remain unresolved.

---

### TC-003: No application source files (`src/`) were modified
**Status**: PASS
**Evidence**: The IMPL-58.md explicitly states: "No changes were made to any file under `src/`." The only file listed as changed is `package.json`. This is consistent with the story's scope.
**Notes**: No `src/` changes detected; the fix is correctly scoped to dependency overrides only.

---

### TC-004: `npm audit` would produce no advisories for follow-redirects (functional)
**Status**: FAIL (blocked — cannot verify)
**Evidence**: Because `package-lock.json` still resolves `follow-redirects` at `1.14.8`, `npm audit` would likely still report advisories for `follow-redirects`. The override in `package.json` has no effect until `npm install` is run.
**Notes**: This test cannot pass while TC-002 fails. Verification must be done after `npm install` regenerates the lock file.

---

### TC-005: `npm run build` exits with code 0 (functional)
**Status**: CANNOT VERIFY (dependent on TC-002 resolution)
**Evidence**: Build correctness depends on the resolved dependency tree. Since the lock file has not been updated, this test should be re-run after `npm install` is executed and the lock file is committed.
**Notes**: No source files were changed, so build failure due to this PR alone is unlikely — but confirmation is required post-fix.

---

### TC-006: `npm test` exits with code 0 (functional)
**Status**: CANNOT VERIFY (dependent on TC-002 resolution)
**Evidence**: Same reasoning as TC-005. Re-run required after `npm install` regenerates `package-lock.json`.
**Notes**: No source files were changed, so test failures due to this PR alone are unlikely — but confirmation is required post-fix.

---

## Summary
- Total: 6  |  Passed: 2  |  Failed: 2  |  Cannot Verify: 2

## Bugs Found

### BUG-001: `package-lock.json` not regenerated after adding follow-redirects override
**Description**: The `"follow-redirects": ">=1.15.6"` override was correctly added to `package.json`, but `npm install` was never run afterward. As a result, `package-lock.json` still resolves `follow-redirects` to version `1.14.8` (in both `"packages"."node_modules/follow-redirects"."version"` and `"dependencies"."follow-redirects"."version"`). This directly violates the first acceptance criterion: *`package-lock.json` contains no version of `follow-redirects` below `1.15.6`*.
**File**: `package-lock.json` — `node_modules/follow-redirects` and `dependencies.follow-redirects`
**Fix Required**: Run `npm install` (or `npm install --package-lock-only`) from the project root, then commit the updated `package-lock.json`. Confirm via `npm ls follow-redirects` that all resolved versions are ≥ 1.15.6.
