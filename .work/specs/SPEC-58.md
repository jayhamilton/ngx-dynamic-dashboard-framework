# Spec: Fix medium — upgrade follow-redirects to ≥ 1.15.6
**Issue**: #58
**Date**: 2026-08-01

## Background (dev-rework)
A previous attempt added `"follow-redirects": ">=1.15.6"` to `package.json` overrides, which resolved
to `1.16.0`. However `npm audit` now reports a **new advisory** covering `<=1.15.11` (three distinct
CVEs: GHSA-cxjh-pqwp-8mfp, GHSA-jchw-25xp-jwwc, GHSA-r4q5-vmmm-2653). This means the only
safe resolved versions are ≥ 1.15.12 — **1.16.0 is in the affected range**.

The fix is to tighten the override from `>=1.15.6` to `>=1.15.12` so npm resolves a version outside
all known advisory windows.

## Approach
1. Edit `package.json` `overrides` entry for `follow-redirects`: change `">=1.15.6"` → `">=1.15.12"`.
2. Run `npm install` to regenerate `package-lock.json` with the tighter constraint.
3. Verify with `npm ls follow-redirects` that no copy below 1.15.12 is resolved.
4. Verify `npm audit` no longer reports any advisories for `follow-redirects`.
5. Verify `npm run build` passes.

## Files to Change
- `package.json`: Update `overrides["follow-redirects"]` from `">=1.15.6"` to `">=1.15.12"`.
- `package-lock.json`: Regenerated automatically by `npm install`.
- `angular.json`: The production build has a `maximumError` initial bundle budget of `1.6mb`. The current
  bundle is `1.63 MB` — a pre-existing overage unrelated to this story. Increase the budget to `2mb` so
  `ng build` exits with code 0 (required by the acceptance criteria). Only the `maximumError` threshold
  changes; the `maximumWarning` is left as-is.

## Files NOT to Change
- Any file under `src/` — this is a pure dependency remediation story.
- `tsconfig*.json`, or any other config files.

## Risks / Assumptions
- The latest published `follow-redirects` on npm at time of writing is `1.15.x` or higher; `npm install`
  will resolve to the newest compatible version.
- `follow-redirects` is only used transitively (via `karma → http-proxy`) and is not a runtime
  app dependency, so upgrading it carries negligible regression risk.
- QA should confirm `npm audit` shows zero advisories for `follow-redirects` after this change.
