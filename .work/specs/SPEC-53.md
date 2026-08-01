# Spec: Fix medium — upgrade webpack-dev-server to ≥ 5.2.1
**Issue**: #53
**Date**: 2026-08-01

## Approach
`webpack-dev-server` is a transitive dependency of `@angular-devkit/build-angular` /
`@angular-devkit/build-webpack`. The currently installed version is already **5.2.6**
(confirmed via `npm ls webpack-dev-server`) which already satisfies ≥ 5.2.1.

To ensure the constraint is explicitly pinned and cannot silently regress to a
vulnerable version if the Angular CLI devDependency range ever resolves to an
older copy, we add:

```json
"overrides": {
  "webpack-dev-server": ">=5.2.1"
}
```

to `package.json` alongside the other overrides already present for sibling stories,
then run `npm install` to regenerate `package-lock.json`.

### Audit note
After the upgrade the `npm audit` output shows `webpack-dev-server 2.0.0-beta - 5.2.6`
as flagged, but examination shows this is a **transitive** advisory flowing through
`sockjs → uuid`, where `uuid` has "No fix available". That is a **separate** issue
from the two original medium Dependabot alerts targeting `webpack-dev-server` itself
(CVEs around the dev-server's own request-handling code, patched in 5.2.1). The
`uuid`/`sockjs` chain is out of scope for this story.

## Files to Change
- `package.json`: Add `"webpack-dev-server": ">=5.2.1"` to the existing `overrides`
  block to explicitly enforce the minimum safe version.
- `package-lock.json`: Regenerated automatically by `npm install` after the
  `package.json` change.

## Files NOT to Change
- All `src/` files: Out of scope — this is a dependency-only fix.
- `angular.json`, `tsconfig*.json`, `karma.conf.js`: No build configuration changes
  needed.
- Any other `package.json` fields: Only the `overrides` block is touched.

## Risks / Assumptions
- The installed version 5.2.6 already satisfies the requirement; the override is a
  defensive pin rather than an actual upgrade step.
- Remaining `npm audit` advisories (uuid/sockjs, @hono/node-server, ajv) are
  unrelated to this story and have no available fix; they will remain after this change.
- QA should verify `npm ls webpack-dev-server` shows ≥ 5.2.1 and that neither of the
  two original Dependabot `webpack-dev-server` CVE advisories appear in the audit
  output (distinct from the `sockjs`-chain advisory).
