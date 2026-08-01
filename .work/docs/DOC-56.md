# Fix medium: upgrade vite to ≥ 5.4.12
**Issue**: #56
**Date**: 2026-08-01

## Overview
A medium-severity Dependabot alert flagged transitive `vite` versions in the range `>=5.0.0 <=5.4.11` as vulnerable. Investigation revealed the alert is a **false positive** for this project — the only `vite` instance resolved in the dependency tree is `8.1.5`, pulled in by `@angular/build@22.1.2`, which is well above the vulnerable range. A `"vite": ">=5.4.12"` entry was added to `package.json`'s `"overrides"` block as a belt-and-suspenders safeguard to prevent any future dependency resolution from introducing a vulnerable 5.x version.

## What Changed
| File | Change |
|------|--------|
| `package.json` | Added `"vite": ">=5.4.12"` to the existing `"overrides"` block |

## How It Works

### Dependency tree diagnosis
`npm ls vite` confirmed the only resolved copy of `vite` in the entire tree is `8.1.5`, nested three levels deep under the Angular build toolchain:

```
└─┬ @angular-devkit/build-angular@22.1.2
  └─┬ @angular/build@22.1.2
    ├─┬ @vitejs/plugin-basic-ssl@2.3.0
    │ └── vite@8.1.5 deduped
    └── vite@8.1.5
```

Because `8.1.5` is not in the range `>=5.0.0 <=5.4.11`, no actual vulnerable version is installed and no lockfile changes were necessary.

### The override guard
The `"overrides"` block in `package.json` now contains:

```json
"overrides": {
  "http-proxy-middleware": ">=2.0.8 <3.0.0 || >=3.0.4",
  "esbuild": ">=0.25.0",
  "follow-redirects": ">=1.15.12",
  "loader-utils": ">=2.0.3",
  "on-headers": ">=1.1.0",
  "cookie": ">=0.7.0",
  "socket.io": ">=4.6.2",
  "socket.io-parser": ">=4.2.3",
  "vite": ">=5.4.12",
  "webpack-dev-server": ">=5.2.1",
  "ws": ">=8.17.1"
}
```

npm `"overrides"` apply to the entire resolved dependency graph. Should any future package ever introduce a `vite` `5.x` version below `5.4.12`, npm will refuse to resolve it and will instead require at least `5.4.12`, keeping the project clean against this CVE class without any manual intervention.

### Impact on existing installed packages
Because the currently installed `vite@8.1.5` already satisfies `>=5.4.12`, adding the override does **not** trigger a re-install of any package. The `package-lock.json` is unchanged.

## Usage
This is a dependency-management change with no developer-facing API. Maintainers should be aware of two things:

1. **Verifying the fix is active** — run `npm ls vite` and confirm no entry in the `>=5.0.0 <=5.4.11` range appears:
   ```bash
   npm ls vite
   # Expected: all listed vite versions ≥ 5.4.12 (currently 8.1.5)
   ```

2. **Verifying the audit advisory is gone** — run `npm audit` and confirm no medium advisory referencing the `>=5.0.0 <=5.4.11` vite range appears:
   ```bash
   npm audit
   # No advisory for vite >=5.0.0 <=5.4.11 should be listed
   ```

3. **Future Angular upgrades** — if `@angular/build` is ever downgraded to a version that resolves `vite` to a `5.x` release, the override will enforce `>=5.4.12` automatically. No additional action is needed.

## Known Limitations
- `npm test` exits with code 1 due to **two pre-existing, unrelated test failures** that were present before this change:
  - `AreaChartComponent should create` — fails with `NG05105: Unexpected synthetic property @animationState` due to a missing `provideAnimations()` in the component's test module.
  - `MatDrawerContainer` afterAll error — "A drawer was already declared for 'position=\"end\"'" due to a duplicate drawer registration in the test suite.
  
  These failures have zero causal relationship to the `vite` override change and should be tracked as separate defects.

- The Dependabot alert itself is a false positive (the vulnerable version was never installed). The alert may need to be manually dismissed in the GitHub Security tab if Dependabot does not auto-resolve it after detecting the override.

## Related Files
- `package.json` — contains the `"overrides"` block that pins `vite` to `>=5.4.12`
- `package-lock.json` — unchanged; already resolves `vite` at `8.1.5` (no vulnerable version present)
- `.work/specs/SPEC-56.md` — documents the false-positive finding and rationale for the belt-and-suspenders override approach
- `.work/implementations/IMPL-56.md` — implementation summary and acceptance criteria coverage
- `.work/test-results/RESULT-56.md` — full QA test results (4 pass / 1 fail on pre-existing test issue)
