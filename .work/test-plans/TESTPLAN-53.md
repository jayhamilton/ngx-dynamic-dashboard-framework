# Test Plan: Fix medium — upgrade webpack-dev-server to ≥ 5.2.1
**Issue**: #53
**Date**: 2026-08-01

## Test Cases

### TC-001: package-lock.json shows webpack-dev-server ≥ 5.2.1
**Type**: code-review / functional
**Steps**:
1. Run `npm ls webpack-dev-server` to check the resolved version in node_modules/package-lock.json.
2. Confirm the version reported is 5.2.1 or higher.
**Expected**: `webpack-dev-server` resolves to ≥ 5.2.1 in the dependency tree.
**Pass Criteria**: `npm ls webpack-dev-server` output shows a version ≥ 5.2.1 with exit code 0.

### TC-002: package.json overrides block contains the webpack-dev-server pin
**Type**: code-review
**Steps**:
1. Read `package.json` and inspect the `overrides` block.
2. Confirm `"webpack-dev-server": ">=5.2.1"` is present.
**Expected**: The override entry exists to defensively prevent regression to a vulnerable version.
**Pass Criteria**: `package.json` `overrides` contains `"webpack-dev-server": ">=5.2.1"`.

### TC-003: npm audit no longer reports the two original webpack-dev-server medium advisories
**Type**: functional
**Steps**:
1. Run `npm audit`.
2. Inspect output for advisories that directly name `webpack-dev-server` as the vulnerable package (the two Dependabot CVEs patched in 5.2.1).
3. Note: a transitive `uuid → sockjs → webpack-dev-server` advisory with "No fix available" is expected to remain and is out of scope.
**Expected**: No advisory listing `webpack-dev-server` as the root vulnerable package.
**Pass Criteria**: `npm audit` output contains no direct `webpack-dev-server` CVE advisory from the two original Dependabot alerts.

### TC-004: npm run build exits with code 0
**Type**: functional
**Steps**:
1. Run `npm run build`.
2. Check exit code.
**Expected**: Angular production build completes successfully with exit code 0.
**Pass Criteria**: Exit code 0 and Angular bundle output is present.

### TC-005: npm test exits with code 0
**Type**: functional
**Steps**:
1. Run `npm test` (headless).
2. Inspect exit code and individual spec failures.
3. Determine if any failures are caused by this story's dependency change (webpack-dev-server upgrade).
**Expected**: All test specs pass; exit code 0.
**Pass Criteria**: Exit code 0, OR all failing specs are pre-existing failures unrelated to this story's changes.

### TC-006: No application source files (src/) were modified
**Type**: code-review
**Steps**:
1. Review IMPL-53.md "Changes Made" section.
2. Confirm only `package.json` and `package-lock.json` were touched.
**Expected**: Zero changes to `src/`, `angular.json`, `tsconfig*.json`, or `karma.conf.js`.
**Pass Criteria**: Implementation notes and package.json inspection confirm only dependency files changed.
