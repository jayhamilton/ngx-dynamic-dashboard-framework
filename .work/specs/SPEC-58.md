# Spec: Fix medium: upgrade follow-redirects to ≥ 1.15.6
**Issue**: #58
**Date**: 2026-08-01

## Approach
`follow-redirects` is a transitive dependency (pulled in by toolchain packages such as `axios`, `webpack-dev-server`, or similar HTTP clients). It is not a direct dependency of the application. Two overlapping medium-severity Dependabot alerts exist:
- Alert 1: `follow-redirects` < 1.15.4
- Alert 2: `follow-redirects` ≤ 1.15.5

Both are satisfied by pinning to ≥ 1.15.6 in one step.

The `package.json` already contains an `overrides` block (added by sibling story #59 for `on-headers` and `cookie`). The fix is to add `"follow-redirects": ">=1.15.6"` to that existing `overrides` object. npm will then honour this floor version for every transitive resolution of `follow-redirects` when `npm install` is run, regenerating `package-lock.json` with a compliant version.

No application source files are touched.

## Files to Change
- `package.json`: Add `"follow-redirects": ">=1.15.6"` to the existing `overrides` section so npm pins the transitive dependency to a non-vulnerable version.

## Files NOT to Change
- `package-lock.json`: Regenerated automatically by npm at install time; not edited directly.
- `src/**`: Out of scope — no application source changes.
- `angular.json`, `tsconfig.*`, any other config: No changes needed.

## Risks / Assumptions
- The `overrides` mechanism requires npm ≥ 8 (already guaranteed by the Angular 22 toolchain in use).
- `follow-redirects` ≥ 1.15.6 must be API-compatible with whichever toolchain package consumes it (axios, webpack-dev-server, etc.). The 1.x line has been stable; no breaking changes are expected between 1.15.5 and 1.15.6+.
- QA should verify `npm audit` no longer reports advisories for `follow-redirects` after `npm install`.
- QA should confirm `npm run build` and `npm test` both exit 0.
- The `package-lock.json` will be regenerated on `npm install`; QA should run `npm ls follow-redirects` to confirm no version below 1.15.6 appears.
