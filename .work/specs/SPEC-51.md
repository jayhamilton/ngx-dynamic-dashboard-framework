# Spec: Fix critical: loader-utils and socket.io-parser upgrades
**Issue**: #51
**Date**: 2026-08-01

## Approach

Add an explicit `"overrides"` entry for `loader-utils` in `package.json` to enforce `>=2.0.3` across the entire dependency tree, then run `npm install` to regenerate `package-lock.json`.

### Pre-flight findings
Before writing any code, `npm ls loader-utils socket.io-parser` was run to check the current resolved state:

- **`socket.io-parser`**: Already resolved at `4.2.7` (covered by the existing `"socket.io-parser": ">=4.2.3"` override from issue #57). No change needed for this package.
- **`loader-utils`**: Two copies are installed:
  - `3.3.1` — safe (no vulnerable range)
  - `2.0.4` — already satisfies `>=2.0.3` **but** there is no override in `package.json` to enforce this floor. Without an override, a future `npm install` or dependency resolution could silently regress to a vulnerable `2.0.x` version below `2.0.3`.

**Conclusion**: Add `"loader-utils": ">=2.0.3"` to the `overrides` block to lock in the safe minimum for the 2.x line, regenerate `package-lock.json`, and verify.

`npm audit` confirms: **no critical advisories for either `loader-utils` or `socket.io-parser`** are currently reported.

## Files to Change
- `package.json`: Add `"loader-utils": ">=2.0.3"` to the existing `"overrides"` section to enforce the patched minimum for the 2.x transitive copy.
- `package-lock.json`: Regenerated automatically by `npm install` after `package.json` is updated.

## Files NOT to Change
- Any file under `src/` — this is a dependency metadata change only.
- `angular.json`, `tsconfig.json`, or any test configuration — out of scope.

## Risks / Assumptions
- `loader-utils@2.0.4` is already installed and satisfies `>=2.0.3`; the override simply makes this floor explicit and prevents future regressions.
- The `>=2.0.3` range stays within 2.x, which is what the Angular CLI / webpack toolchain requires for the `resolve-url-loader` path. Upgrading to 3.x is explicitly out of scope per the story.
- `socket.io-parser` is already addressed by the prior sibling override (`>=4.2.3`), which covers both the critical (`<4.0.5`) and medium (`<4.2.3`) ranges.
