# 03: Offer only the Criteria that still narrow the results (`possibleCriteria`)

**What to build:** A student sees only the further Criteria that would actually narrow the list of possible tests. `possibleCriteria` is a list of `Tag`s computed purely from the Eligible tests' `accepts`:

- Only Dimensions without a selected value are considered; a Dimension with a selected value is never offered again.
- Within such a Dimension, the candidate Tags are the values tagged on at least one Eligible test.
- The whole Dimension is omitted if selecting any of its candidate values would Exclude zero Eligible tests (e.g. every Eligible test either accepts the same value or carries no tag in that Dimension).

The order is deterministic (e.g. schema Dimension order, then schema value order) so equal inputs give equal outputs.

If 02 has already landed, add a test showing `sampleSize` affecting `possibleCriteria`: relevance is computed over the Eligible set, which includes the sample-size filter.

See the spec: `.scratch/statistical-test-finder/spec.md` (Relevance rule for `possibleCriteria`, Testing Decisions).

**Blocked by:** 01 (Match tests against a Selection)

**Status:** resolved

- [x] With nothing selected, a Dimension on which fixture tests differ is offered with exactly the values tagged on Eligible tests
- [x] A value tagged only on Excluded tests is not offered
- [x] A Dimension disappears from `possibleCriteria` once selecting any of its values would Exclude nothing
- [x] An Eligible test with no tag in a Dimension counts as accepting every value there (it can make the Dimension non-discriminating)
- [x] A Dimension with a selected value never appears in `possibleCriteria`
- [x] Output order is deterministic
- [x] If 02 has landed: a test covering `sampleSize` affecting `possibleCriteria`
