# 01: Match tests against a Selection (engine + Vitest)

**What to build:** A pure, stateless matching engine that a UI, API route or script can call with the Catalog and the Criteria a student has selected, and get back which tests are still possible. It takes the Catalog (a list of `TestWithId`), a `Selection`, and an optional numeric `sampleSize`, and returns `{ selectedCriteria, possibleTests, possibleCriteria }`:

- `selectedCriteria` is the input `Selection`, echoed back unchanged.
- `possibleTests` holds the Eligible tests, in Catalog order. A test is Excluded if, for some Dimension with a selected value, the test has at least one value in `accepts` for that Dimension and none of them matches the selected value. A test with no entry for a Dimension is never Excluded on it; a test with several values in a Dimension stays Eligible if any of them matches.
- `possibleCriteria` is an empty list for now (filled in by 03).
- `sampleSize` is accepted but not yet used (wired up by 02).

The engine has no I/O and no Next.js/React dependency, so it runs outside the app. It also sets up Vitest as the project's test runner, with a `test` script in `package.json`.

See the spec: `.scratch/statistical-test-finder/spec.md` (Matching engine, Eligibility rule, Testing Decisions).

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Vitest is installed and configured; `pnpm test` runs the engine tests
- [x] The engine is a single exported pure function taking the Catalog, a `Selection` and an optional `sampleSize`
- [x] The engine imports nothing from Next.js, React, or any I/O module
- [x] With an empty `Selection`, every fixture test is in `possibleTests`
- [x] Selecting a value that a test's tags in that Dimension don't include Excludes that test
- [x] A test with no tag in the selected Dimension stays Eligible
- [x] A test with several tags in one Dimension stays Eligible when any of them matches
- [x] When no test is Eligible, `possibleTests` is empty (no "closest" fallback)
- [x] `selectedCriteria` equals the input `Selection`
- [x] Tests exercise only the public function, against small hand-built fixture Catalogs, not the real Catalog
