# 02: Exclude tests by sample size

**What to build:** A student who enters a sample size sees tests whose sample-size requirement it violates drop out of `possibleTests`. When `sampleSize` is provided, a test is Excluded if it falls outside `[minN, maxN]`; a missing bound means unbounded on that side. When `sampleSize` is not provided, `minN`/`maxN` never Exclude anything.

If 03 has already landed, add a test showing a Dimension disappearing from (or staying out of) `possibleCriteria` because `sampleSize` removed the tests that made it discriminating: relevance is computed over the Eligible set, which includes the sample-size filter.

See the spec: `.scratch/statistical-test-finder/spec.md` (Eligibility rule, Testing Decisions).

**Blocked by:** 01 (Match tests against a Selection)

**Status:** resolved

- [x] `sampleSize` equal to `minN` or `maxN` keeps the test Eligible (bounds are inclusive)
- [x] `sampleSize` one below `minN` or one above `maxN` Excludes the test
- [x] A test with only `minN` is unbounded above; one with only `maxN` is unbounded below
- [x] An unset `sampleSize` never Excludes a test that has bounds
- [x] Sample-size and Dimension exclusion combine: a test must pass both to be Eligible
- [x] n/a: 03 had not landed; the interaction test lives with 03
