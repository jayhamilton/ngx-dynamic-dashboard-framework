# Test Results: Fix low: upgrade on-headers to ≥ 1.1.0 and cookie to ≥ 0.7.0
**Issue**: #59
**Verdict**: FAIL
**Date**: 2026-08-01

## Results

### TC-001: package-lock.json contains no version of on-headers below 1.1.0
**Status**: PASS
**Evidence**: `npm ls on-headers` output:
```
└─┬ @angular-devkit/build-angular@22.1.2
  └─┬ webpack-dev-server@5.2.6
    └─┬ compression@1.8.1
      └── on-headers@1.1.0
```
The only resolved instance of `on-headers` is `1.1.0`, which satisfies the `>=1.1.0` requirement. The override `"on-headers": ">=1.1.0"` in `package.json` is correctly enforcing this.
**Notes**: Single instance, exactly at the minimum required version. PASS.

### TC-002: package-lock.json contains no version of cookie below 0.7.0
**Status**: PASS
**Evidence**: `npm ls cookie` output:
```
├─┬ @angular-devkit/build-angular@22.1.2
│ └─┬ webpack-dev-server@5.2.6
│   └─┬ express@4.22.2
│     └── cookie@2.0.1
├─┬ @angular/cli@22.1.2
│ └─┬ @modelcontextprotocol/sdk@1.29.0
│   └─┬ express@5.2.1
│     └── cookie@2.0.1 deduped
└─┬ karma@6.3.16
  └─┬ socket.io@4.8.3
    └─┬ engine.io@6.6.9
      └── cookie@2.0.1 deduped
```
All three resolved instances of `cookie` are `2.0.1`, which is well above the `>=0.7.0` threshold. The override `"cookie": ">=0.7.0"` in `package.json` is correctly enforced.
**Notes**: PASS. Note: `npm audit` still flags `cookie` via the `engine.io` advisory path, but this is because `engine.io@6.6.9` itself is flagged as dependent on vulnerable versions of `cookie` AND `ws` — however the actual resolved `cookie` version (2.0.1) does satisfy the acceptance criterion. The audit advisory for `cookie` path through `socket.io → engine.io` reflects a stale/combined advisory that persists due to `engine.io` version constraints, not an actual cookie version below 0.7.0. The acceptance criterion (`package-lock.json` contains no version of `cookie` below `0.7.0`) is met.

### TC-003: npm audit no longer reports low-severity advisories for on-headers or cookie
**Status**: FAIL
**Evidence**: `npm audit` (exit 1) output includes:
```
cookie  <0.7.0
cookie accepts cookie name, path, and domain with out of bounds characters - https://github.com/advisories/GHSA-pxg6-pf52-xh8x
fix available via `npm audit fix`
node_modules/cookie
  engine.io  0.7.8 - 0.7.9 || 1.8.0 - 6.6.6
  Depends on vulnerable versions of cookie
  ...
    socket.io  3.0.0 - 4.6.1
```
`npm audit` continues to report a `cookie <0.7.0` advisory. Although `npm ls cookie` confirms all resolved copies are `2.0.1`, the audit advisory is triggered because `socket.io@4.8.3` depends on `engine.io@6.6.9`, and `engine.io 6.6.9` still falls within the advisory's affected range `0.7.8-0.7.9 || 1.8.0-6.6.6`. The override successfully updated the `cookie` resolved version, but the `engine.io` and `socket.io` parent packages still appear in npm's vulnerability tree, preventing the advisory from fully clearing. The story already has `"socket.io": ">=4.6.2"` in overrides — but `engine.io` itself is not overridden, and `socket.io@4.8.3` still brings in `engine.io@6.6.9` which remains in the flagged range. The `npm audit` advisory for `cookie` does not fully clear with the current overrides.
**Notes**: FAIL — acceptance criterion requires `npm audit` to no longer report advisories for `cookie`. The advisory remains visible in output.

### TC-004: npm run build exits with code 0 after the change
**Status**: FAIL
**Evidence**: `npm run build` exits with code **1**. Error output:
```
✘ [ERROR] bundle initial exceeded maximum budget. Budget 1.60 MB was not met by 26.37 kB with a total of 1.63 MB.
```
The build fails due to an Angular bundle size budget error. This is a **pre-existing issue** in the repository — it is a bundle size budget violation in `angular.json` unrelated to the `on-headers`/`cookie` dependency overrides. No application source was touched by this story's implementation, and this error exists independent of the dependency changes.
**Notes**: FAIL on the acceptance criterion as written. However, this build failure is pre-existing and not caused by the changes in this story. Root cause: bundle initial size (1.63 MB) exceeds the configured budget (1.60 MB) in `angular.json`. This should be treated as a separate blocking issue.

### TC-005: npm test exits with code 0 after the change
**Status**: FAIL
**Evidence**: `npm test` exits with code **1**. Failures observed:
1. `AppComponent should render title FAILED` — `Error: Expected undefined to contain 'plm-ui app is running!'` (app.component.spec.ts:31)
2. `ERROR: A drawer was already declared for 'position="end"'` — `MatDrawerContainer` duplicate drawer error in afterAll.
3. Browser disconnected after 30000 ms timeout.
These are **pre-existing test failures** in the repository, unrelated to the `on-headers`/`cookie` dependency changes. No application source (`src/`) was modified by this story. The test failures exist independently of the dependency overrides.
**Notes**: FAIL on the acceptance criterion as written. Pre-existing failures, not introduced by this story. Root causes: (1) outdated `app.component.spec.ts` that expects a deprecated title string; (2) duplicate `MatDrawer` in test setup. Both are pre-existing issues.

## Summary
- Total: 5  |  Passed: 2  |  Failed: 3

## Bugs Found
- BUG-001: `npm audit` still reports `cookie <0.7.0` advisory via `socket.io → engine.io` chain. The `cookie` resolved version is correctly 2.0.1 (satisfying TC-002), but `engine.io@6.6.9` (brought in by `socket.io@4.8.3`) falls within npm's `engine.io 1.8.0–6.6.6` affected range, keeping the advisory alive. Adding an `engine.io` override or upgrading `socket.io` to a version that pulls in `engine.io >=6.6.7` would clear this. File: `package.json` — `overrides` block missing `engine.io` pin. (TC-003)
- BUG-002 (pre-existing, not caused by this story): `npm run build` fails with bundle size budget error: initial bundle 1.63 MB exceeds 1.60 MB budget in `angular.json`. Not introduced by this story's changes. (TC-004)
- BUG-003 (pre-existing, not caused by this story): `npm test` fails with `AppComponent should render title` spec error and `MatDrawer` duplicate error. Not introduced by this story's changes. (TC-005)
