# Statistical Test Finder — Matching Engine & Catalog

Status: ready-for-agent

## Problem Statement

Statistics students often know some facts about their research scenario (number of groups, paired or independent samples, measurement scale, known population variance, sample size, …) but not which statistical test those facts point to. With only some facts known, they can't easily see which tests are still candidates and which are ruled out.

## Solution

The student enters the facts (**Criteria**) they know and sees which tests from a fixed **Catalog** are still possible (**possible tests**), and which further Criteria would still narrow the list (**possible criteria**). Tests are never ranked; a test is removed only when a known Criterion makes it inapplicable. The core is a pure, stateless **matching engine**; the UI is built separately and is not part of this spec.

## User Stories

1. As a student, I want to select criteria I know about my scenario (e.g. "2 groups," "paired data," "outcome is continuous"), so that I can narrow down which statistical test applies.
2. As a student, I want to leave criteria I don't know unanswered.
3. As a student, I want the list of possible tests to only shrink when a criterion I've entered truly rules a test out.
4. As a student, I want to see which further criteria would actually narrow the results.
5. As a student, I want criteria that can no longer change anything (every remaining test agrees on that fact) to stop being shown.
6. As a student, I want to be prevented from selecting two contradictory values for the same fact (e.g. "paired" and "independent").
7. As a student, I want to enter my sample size as a number, so that tests with a minimum or maximum sample-size requirement are correctly included or excluded.
8. As a student, I want tests to stay in the list if I haven't entered a sample size.
9. As a student, I want to see each candidate test's name, alternate name (if any), and a short description.
10. As a student, I want the matching to work without an account or a network round-trip.
11. As a student encountering a scenario where no test matches, I want to see an empty result rather than a guessed "closest" test.
12. As a developer building the UI, I want a single pure function I can call with the currently-known criteria.
13. As a developer building the UI, I want the engine's response to echo back what was selected alongside what's now possible.
14. As a developer, I want the matching engine to be usable outside this Next.js app (e.g. behind an API route, or from a script).
15. As a developer, I want the engine to take the Catalog as an explicit input, so that it can be unit-tested against small fixture catalogs.
16. As a maintainer, I want each test's applicability rules expressed as declarative tags, so that changing a test doesn't require touching matching logic.
17. As a maintainer, I want tags typed as `dimension:value` pairs, so that the engine can detect contradictory tags within the same Dimension.
18. As a maintainer, I want a test that doesn't care about a Dimension to simply carry no tag in it.
19. As a maintainer, I want a test that accepts several values in a Dimension to list several tags in it.

## Implementation Decisions

**Domain model** (see `CONTEXT.md`): **Criterion**, **Dimension**, **Tag** (`dimension:value`), **Catalog**, **Eligible/Excluded**. Matching is strict and binary — a test is either eligible or excluded.

**Catalog** (already implemented at `lib/tests.ts`): a record keyed by test id (`catalog`), each entry `{ name, info, accepts, minN?, maxN?, aka? }`. `TestId` is the literal union of every id. The same data is exported as a list, `tests`, of `TestWithId` objects (`{ id, ...entry }`) in authoring order; this is what the engine takes. `name`/`info`/`aka` are in German; `id`, Dimension names and values are in English. `accepts` is a record keyed by Dimension holding the values the test accepts (e.g. `{ measurementScale: ["interval"], sampleDependency: ["independent", "dependent"] }`), typed against the Dimension schema in `lib/dimensions.ts`. Every Criterion belongs to a declared Dimension.

**Matching engine** (new module): a pure function with no I/O and no framework dependency.
- Input: the Catalog, the selected Criteria as a `Selection` (`lib/dimensions.ts`: a record keyed by Dimension holding at most one value each, e.g. `{ measurementScale: "interval", sampleDependency: "dependent" }`), and an optional numeric `sampleSize`. `selectionToTags` converts a `Selection` to a list of Tags.
- Output: `{ selectedCriteria, possibleTests, possibleCriteria }` — `selectedCriteria` is the input `Selection` echoed back unchanged, `possibleTests` the still-eligible `TestWithId` objects, `possibleCriteria` the Tags still worth offering.

**Tag representation**: in the engine's public API a Tag is `{ dimension, value }` (the `Tag` type in `lib/dimensions.ts`). The engine reads `accepts` directly.

**Eligibility rule**: a test is excluded if, for some Dimension with a selected value, the test has at least one tag in that Dimension and none match the selected value. A test with no tag in a Dimension is never excluded on it. A test is also excluded if `sampleSize` is provided and falls outside `[minN, maxN]` (a missing bound means unbounded on that side).

**Relevance rule for `possibleCriteria`**: only Dimensions without a selected value are considered. Within such a Dimension, candidate Tags are the values tagged on at least one eligible test. A Dimension is omitted entirely if none of its candidate values would exclude an eligible test (every eligible test either accepts the same values or carries no tag there). While at least one candidate value would narrow, the Dimension is offered with all of its candidate values. A Dimension that already has a selected value is never offered again.

Both eligibility and relevance are computed purely from the Catalog's tags at request time.

## Testing Decisions

- Test the engine only through its public function, asserting on `possibleTests` / `possibleCriteria` / `selectedCriteria` — never on internal helpers.
- Use small, hand-built fixture Catalogs (a handful of `TestWithId` objects covering: a plain dimension match/mismatch, a test with no tag in a dimension, a test with multiple tags in one dimension, and a `minN`/`maxN` boundary), not the real Catalog.
- Cover at minimum: all tests possible when nothing is selected; exclusion once a contradicting Criterion is selected; a Dimension disappearing from `possibleCriteria` once it stops discriminating; a Dimension never being re-offered once selected; `sampleSize` inclusion/exclusion at and around the `minN`/`maxN` boundaries; an unset `sampleSize` never excluding a test that has bounds.
- Set up Vitest as the test runner (none is configured yet); this is part of this ticket.

## Out of Scope

- The UI (criteria selector, result display).
- URL state sync / shareable links.
- Any backend, persistence, accounts, or API route.
- Running a statistical test on real data.
- Verifying the statistical correctness of the Catalog's content.
- Adding further dimensions beyond what's already in `lib/tests.ts`.
