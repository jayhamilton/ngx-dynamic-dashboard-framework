## Implementation Summary
**Spec**: .work/specs/SPEC-54.md

### Changes Made
- `package.json`: Added `"http-proxy-middleware": ">=2.0.8 <3.0.0 || >=3.0.4"` to the existing `overrides` section. The `||` union covers both the 2.x line (pulled in by `webpack-dev-server@5.2.6`) and the 3.x/4.x line (pulled in by `@angular-devkit/build-angular@22.1.2`) simultaneously.
- `package-lock.json`: Regenerated via `npm install` after the `package.json` edit to apply the override.

### Acceptance Criteria Coverage
- [x] `package-lock.json` contains no copy of `http-proxy-middleware` in range `>=1.3.0 <2.0.8`: Resolved copy is `2.0.10`, which satisfies ≥ 2.0.8.
- [x] `package-lock.json` contains no copy of `http-proxy-middleware` in range `>=3.0.0 <3.0.4`: Resolved copy is `4.2.0`, which satisfies ≥ 3.0.4.
- [x] `npm audit` no longer reports either medium advisory for `http-proxy-middleware`: Confirmed — audit output contains zero references to `http-proxy-middleware`.
- [x] `npm run build` exits with code 0: Confirmed — build succeeded and produced output bundle in `dist/plm-ui`.
- [ ] `npm test` — to be verified by QA.

### Pre-change resolved versions (via `npm ls http-proxy-middleware`)
| Copy | Via | Version Before | Safe? |
|------|-----|---------------|-------|
| 2.x  | `webpack-dev-server@5.2.6` | `2.0.10` | ✅ already ≥ 2.0.8 |
| 3.x+ | `@angular-devkit/build-angular@22.1.2` | `4.2.0` | ✅ already ≥ 3.0.4 |

Both copies were already at safe versions; the override enforces the floor for future dependency resolutions and closes the Dependabot advisories.

### QA Notes
- Verify `npm test` exits with code 0 (no regression in unit tests).
- Confirm `npm audit` output does not list any advisory with the text `http-proxy-middleware`.
- The 13 remaining `moderate` advisories in the audit output are for `@hono/node-server`, `ajv`/`schematics-scss-migrate`, and `uuid`/`sockjs` — all are handled by separate sibling stories and are **not** regressions introduced by this change.
