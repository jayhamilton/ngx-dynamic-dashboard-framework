# Spec: Fix medium — upgrade http-proxy-middleware to safe versions
**Issue**: #54
**Date**: 2026-08-01

## Approach
Add an `overrides` entry for `http-proxy-middleware` in `package.json` to pin all
resolved copies to safe versions:

- 2.x line: `>= 2.0.8` (Dependabot alert for `>=1.3.0 <2.0.8`)
- 3.x line: `>= 3.0.4` (Dependabot alert for `>=3.0.0 <3.0.4`)

Pre-check (`npm ls http-proxy-middleware`) shows two installed copies:
- `http-proxy-middleware@2.0.10` via `webpack-dev-server@5.2.6` → already satisfies ≥ 2.0.8 ✅
- `http-proxy-middleware@4.2.0` via `@angular-devkit/build-angular@22.1.2` → already satisfies ≥ 3.0.4 ✅

Despite both copies already being at safe versions, the npm audit advisory will only
close once an explicit override is present that tells npm to enforce the minimum-safe
range. Adding `"http-proxy-middleware": ">=2.0.8 <3.0.0 || >=3.0.4"` to the existing
`overrides` block achieves this. The override expression satisfies both the 2.x and 3.x/4.x
copies simultaneously without breaking peer dependency expectations.

After editing `package.json`, run `npm install` to regenerate `package-lock.json` with
the override applied, then verify with `npm ls` and `npm audit`.

## Files to Change
- `package.json`: Add `"http-proxy-middleware": ">=2.0.8 <3.0.0 || >=3.0.4"` to the
  existing `overrides` section (no other keys in `overrides` change).

## Files NOT to Change
- `src/` (any application source file): out of scope per story definition.
- `angular.json` / `proxy.conf.json`: proxy configuration is explicitly out of scope.
- Any other `devDependencies` or `dependencies` entries: only the override is needed.

## Risks / Assumptions
- The override expression `>=2.0.8 <3.0.0 || >=3.0.4` covers both the 2.x and 3.x/4.x
  ranges. npm overrides apply the first matching range, but the `||` union should resolve
  correctly for both installed copies.
- If a future consumer of `http-proxy-middleware` requires a version in a range not
  covered by the override, npm will warn but will still install the overridden version —
  QA should confirm `npm install` produces no peer-dependency fatal errors.
- Both installed versions were already safe before this change; the override is a
  preventative/audit-silencing measure.
