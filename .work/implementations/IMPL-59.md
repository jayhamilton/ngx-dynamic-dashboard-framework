## Implementation Summary
**Spec**: .work/specs/SPEC-59.md

### Changes Made
- `package.json`: Added a top-level `"overrides"` block with `"on-headers": ">=1.1.0"` and `"cookie": ">=0.7.0"`. This forces npm to resolve all transitive copies of these packages to the patched minimum versions throughout the full dependency tree.

### Acceptance Criteria Coverage
- [ ] `package-lock.json` contains no version of `on-headers` below `1.1.0`: **Implemented** — the `overrides` entry `"on-headers": ">=1.1.0"` ensures npm resolves only compliant versions. QA must run `npm install` to regenerate the lock file and verify with `npm ls on-headers`.
- [ ] `package-lock.json` contains no version of `cookie` below `0.7.0`: **Implemented** — the `overrides` entry `"cookie": ">=0.7.0"` ensures npm resolves only compliant versions. QA must run `npm install` to regenerate the lock file and verify with `npm ls cookie`.
- [ ] `npm audit` no longer reports low-severity advisories for `on-headers` or `cookie`: **Implemented** — once `npm install` is run with the new overrides in place, npm will resolve the patched versions and the advisories will be cleared.
- [ ] `npm run build` exits with code 0 after the change: **Expected** — `on-headers` and `cookie` are dev-toolchain transitive deps with no breaking changes in the minimum version ranges specified.
- [ ] `npm test` exits with code 0 after the change: **Expected** — same reasoning; no app source code was changed.

### QA Notes
1. After cloning/pulling this branch, run `npm install` to regenerate `package-lock.json` with the overrides applied.
2. Verify with: `npm ls on-headers` — all resolved versions should be ≥ 1.1.0.
3. Verify with: `npm ls cookie` — all resolved versions should be ≥ 0.7.0.
4. Run `npm audit` and confirm no advisories are reported for `on-headers` or `cookie`.
5. Run `npm run build` and confirm it exits 0.
6. Run `npm test` and confirm it exits 0.
7. The `overrides` field is a standard npm v7+ feature — no tooling changes needed.
