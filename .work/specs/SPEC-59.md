# Spec: Fix low: upgrade on-headers to ≥ 1.1.0 and cookie to ≥ 0.7.0
**Issue**: #59
**Date**: 2026-08-01

## Approach
Add an `overrides` block to `package.json` that pins the transitive dependencies `on-headers` to `>=1.1.0` and `cookie` to `>=0.7.0`. These are both dev-toolchain transitive dependencies (not app runtime deps):
- `on-headers` is pulled in transitively by `compression` middleware used by `webpack-dev-server`.
- `cookie` is pulled in transitively by `express` / `webpack-dev-server` session handling.

The npm `overrides` field forces npm to resolve the specified version range for any matching transitive package anywhere in the dependency tree, regardless of what parent packages request. After adding the overrides block, npm must be run to regenerate `package-lock.json` to reflect the pinned versions.

Since we cannot invoke shell commands directly, the approach is to add the `overrides` block to `package.json`. The `package-lock.json` regeneration must be done by running `npm install` after this change is committed, OR the lock file must be updated manually to reflect compliant versions. Because the lock file is a generated artifact tracked in git, we add the overrides to `package.json` — the lock file will be regenerated on next `npm install`.

**Important**: The overrides field is placed as a top-level key in `package.json` alongside `dependencies` and `devDependencies`. npm v8+ (bundled with Node 16+) supports this natively.

## Files to Change
- `package.json`: Add a top-level `"overrides"` block with `"on-headers": ">=1.1.0"` and `"cookie": ">=0.7.0"`. This is the canonical fix mechanism per npm docs. Both `package.json` and `package-lock.json` must be committed per the story's technical notes.

## Files NOT to Change
- `src/` (any file): Out of scope per story. No app source code changes.
- `angular.json`: No build configuration changes needed.
- `tsconfig*.json`: Not relevant to dependency pinning.
- `karma.conf.js`: Not relevant.

## Risks / Assumptions
- The `overrides` block requires npm v7+. Angular 22 projects running on modern Node/npm satisfy this.
- `cookie` is a very widely used package — the `>=0.7.0` constraint should not cause peer conflicts because it is backwards-compatible.
- `on-headers` `>=1.1.0` is a stable, minimal middleware; no known breaking changes from 1.0.x to 1.1.x.
- QA should verify by running `npm install` then `npm ls on-headers cookie` and `npm audit` to confirm the advisories are cleared.
- QA should also confirm `npm run build` and `npm test` pass after `npm install` with the new overrides applied.
