# Test Results: Fix high: upgrade ws to ≥ 8.17.1
**Issue**: #52
**Verdict**: FAIL
**Date**: 2026-08-01

## Results

### TC-001: package-lock.json contains no ws in 8.x below 8.17.1
**Status**: PASS
**Evidence**: `npm ls ws` (EXIT 0) confirmed all three resolved copies of `ws` are at `8.21.1`:
- `@angular-devkit/build-angular@22.1.2` → `webpack-dev-server@6.0.0` → `ws@8.21.1`
- `karma@6.3.16` → `socket.io@4.8.3` → `engine.io@6.6.9` → `ws@8.21.1` (deduped)
- `karma@6.3.16` → `socket.io@4.8.3` → `socket.io-adapter@2.5.8` → `ws@8.21.1` (deduped)

No version of `ws` below `8.17.1` exists in the resolved tree.
**Notes**: 8.21.1 satisfies the ≥ 8.17.1 requirement with margin.

---

### TC-002: package.json overrides block contains the ws floor pin
**Status**: PASS
**Evidence**: `package.json` `overrides` block (line in overrides object) contains:
```json
"ws": ">=8.17.1"
```
The entry is present alongside other overrides (`webpack-dev-server`, `socket.io`, etc.).
**Notes**: This formally declares the floor and prevents regression if transitive resolution changes.

---

### TC-003: npm audit reports no high-severity advisory for ws
**Status**: PASS
**Evidence**: `npm audit` output lists **8 moderate severity vulnerabilities** only. None of the advisories reference `ws`. The vulnerabilities present are:
- `@hono/node-server <2.0.5` (moderate) — via `@angular/cli`
- `ajv 7.0.0-alpha.0 – 8.17.1` (moderate) — via `schematics-scss-migrate`

No high or critical severity advisories appear. No advisory mentions `ws` at any severity.
**Notes**: The remaining moderate advisories are out of scope for this story (sibling stories handle other alerts).

---

### TC-004: npm run build exits with code 0
**Status**: PASS
**Evidence**: `npm run build` exited with `EXIT 0`. Output:
```
✔ Building...
Application bundle generation complete. [4.104 seconds]
Output location: .../dist/plm-ui
```
Bundles produced: `main-CLKESG5W.js` (1.49 MB), `styles-QZRLSNW7.css` (103.90 kB), `polyfills-D5OGI5N6.js` (34.55 kB).
**Notes**: No source files were modified; build clean is expected.

---

### TC-005: npm test exits with code 0
**Status**: FAIL
**Evidence**: `npm test` exited with `EXIT 1`. The test run executed 5 of 26 specs then disconnected:
```
Chrome Headless 150.0.0.0 (Mac OS 10.15.7) ERROR
  An error was thrown in afterAll
  Error: A drawer was already declared for 'position="end"'
      at throwMatDuplicatedDrawerError (sidenav.mjs:15:9)
      ...
Chrome Headless 150.0.0.0: Executed 5 of 26 DISCONNECTED (30.142 secs)
  Disconnected, because no message in 30000 ms.
```
The root cause is a `MatDrawerContainer` duplicate drawer registration error thrown in `afterAll`, causing the browser to disconnect after 30 seconds.
**Notes**: 
- This failure is in Angular Material's `MatDrawerContainer` test teardown (`sidenav.mjs`), **not** related to the `ws` WebSocket upgrade.
- The error is a pre-existing test infrastructure issue (duplicate `position="end"` drawer in a test fixture), entirely unrelated to the `ws` transitive dependency change.
- The IMPL-52 notes acknowledged `npm test` was "not explicitly run" during implementation.
- This is a **pre-existing bug** in the test suite that must be fixed separately — it is outside the scope of story #52.

---

## Summary
- Total: 5  |  Passed: 4  |  Failed: 1

## Bugs Found
- BUG-001: `npm test` exits 1 due to `MatDrawerContainer` duplicate drawer error in `afterAll` test teardown (`node_modules/@angular/material/fesm2022/sidenav.mjs:15`). The error causes ChromeHeadless to disconnect after a 30-second timeout. This is a pre-existing test suite issue unrelated to the `ws` upgrade — no `ws`/WebSocket code is involved in the failure stack trace. The IMPL developer did not run `npm test` to verify, as noted in the IMPL summary. **This must be fixed before the story can be marked done.**
