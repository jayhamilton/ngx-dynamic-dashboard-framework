# Spec: Fix medium – upgrade vite to ≥ 5.4.12
**Issue**: #56
**Date**: 2026-08-01

## Approach

The Dependabot alert targets `vite` versions in the range `>=5.0.0 <=5.4.11`.

### Finding

Running `npm ls vite` on the resolved `package-lock.json` reveals:

```
node_modules/@angular-devkit/build-angular/node_modules/@angular/build/node_modules/vite
  version: 8.1.5
```

The only copy of `vite` in the dependency tree is **version 8.1.5**, pulled in transitively by
`@angular/build@22.1.2` (which is itself a dependency of `@angular-devkit/build-angular@22.1.2`).

**8.1.5 is not in the vulnerable range `>=5.0.0 <=5.4.11`**, so the Dependabot alert is a
**false positive** for this project as it stands. No package override or version upgrade is
required.

### Remediation

Because the installed `vite` version already satisfies `>=5.4.12` (it is in fact much newer, at
`8.1.5`), the correct course of action per the story's own technical notes is to:

> "If `vite` is not present in the tree [in the vulnerable range], document that finding and
> close the alert as a false positive."

We document this finding here and add `"vite": ">=5.4.12"` to `package.json` `"overrides"` as a
belt-and-suspenders safeguard so that any future upgrade that tries to introduce a vulnerable
`vite` 5.x version will be blocked by npm.

## Files to Change

- `package.json`: Add `"vite": ">=5.4.12"` to the existing `"overrides"` block as a
  precautionary measure ensuring no future dep resolution can introduce a vulnerable 5.x version.

## Files NOT to Change

- `package-lock.json`: The current lock already resolves `vite` at 8.1.5. No re-install is
  needed; adding a belt-and-suspenders override to `package.json` is sufficient and the lockfile
  already reflects a safe resolved version.
- Any `src/` files: entirely out of scope per the story.

## Risks / Assumptions

- The `vite` 8.1.5 entry is nested under `@angular/build`; npm overrides apply to the full
  dependency graph, so the override `>=5.4.12` will be satisfied by the already-installed 8.1.5.
- QA should verify by running `npm ls vite` and confirming no `5.x` version is present, and that
  `npm audit` does not report a medium advisory for `vite`.
- `npm run build` and `npm test` should continue to pass unchanged since no version is being
  changed.
