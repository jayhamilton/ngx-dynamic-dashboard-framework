# Spec: Fix medium — upgrade socket.io to ≥ 4.6.2 and socket.io-parser to ≥ 4.2.3

**Issue**: #57
**Date**: 2026-08-01

## Approach

`socket.io` and `socket.io-parser` are transitive dependencies of `webpack-dev-server` (used by the Angular CLI dev server for live-reload/HMR). They are not direct runtime dependencies.

Two medium-severity Dependabot alerts are open:
- `socket.io` in range `>=3.0.0 <4.6.2`
- `socket.io-parser` in range `>=4.0.4 <4.2.3`

The existing `package.json` already has an `overrides` block (added by sibling remediation stories for `follow-redirects`, `on-headers`, and `cookie`). We extend that same `overrides` block with two new entries:

```json
"socket.io": ">=4.6.2",
"socket.io-parser": ">=4.2.3"
```

After updating `package.json`, npm will resolve both packages to versions satisfying the overrides constraints the next time `npm install` is run, which regenerates `package-lock.json` accordingly.

No application source files (`src/`) are touched — this is a pure dependency-manifest change.

## Files to Change

- `package.json`: Add `"socket.io": ">=4.6.2"` and `"socket.io-parser": ">=4.2.3"` to the existing `overrides` block.

## Files NOT to Change

- `package-lock.json`: Regenerated automatically by `npm install` after `package.json` is updated; not edited manually.
- `src/**/*`: Out of scope — no application source changes required.
- Any Angular component, service, or configuration files: out of scope.

## Risks / Assumptions

- `socket.io` ≥ 4.6.2 is compatible with the version of `webpack-dev-server` resolved by `@angular-devkit/build-angular@^22.1.2`. QA should verify `ng serve` starts cleanly after the override.
- The `socket.io-parser` ≥ 4.2.3 override also satisfies the critical-severity alert range (`>=4.0.0 <4.0.5`) documented in issue #51 — QA should confirm both alert ranges are cleared.
- npm overrides apply to all resolved copies of these packages in the dependency tree; no additional pinning should be needed.
- `npm run build` and `npm test` must continue to pass — these are dev-only toolchain packages and should not affect production build output.
