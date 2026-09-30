# Statistical Test Finder

Helps statistics students identify which statistical test(s) apply to a research scenario, by narrowing a fixed catalog of tests down using facts the student already knows.

## Language

**Criterion**:
A single known fact about the student's scenario (e.g. "exactly 2 groups," "data is paired," "outcome is continuous") that the student can select to narrow the results. Represented one-to-one by a Tag.
_Avoid_: constraint, filter, option

**Dimension**:
A category of mutually-exclusive Criteria (e.g. "Number of groups," "Pairing," "Distribution"). A student can hold at most one known value per Dimension at a time; selecting a second value in the same Dimension is a contradiction.
_Avoid_: category, group, facet

**Tag**:
A Dimension paired with one of that Dimension's values, declaring one Criterion (e.g. `{ dimension: "sampleDependency", value: "dependent" }`). In the Catalog a test's Tags are grouped by Dimension: the test lists, per Dimension, the values it accepts. A test can carry more than one Tag within the same Dimension (meaning it accepts any of those values); a test with no Tag in a Dimension accepts any value in that Dimension.
_Avoid_: label, flag

**Display name**:
The wording a student reads for a Dimension or a Criterion (e.g. "Number of groups" for the Dimension, "Two" for one of its Criteria). Distinct from the key, which is the stable identifier and what deep links carry; rewording a Display name never breaks a link. A Criterion's Display name belongs to its Dimension — the same key in two Dimensions can read differently. Every Dimension also carries a short hint explaining what it asks.
_Avoid_: label (overloaded with Tag), title

**Catalog**:
The static, declarative list of statistical tests and the Tags each one accepts. Single source of truth for eligibility, exclusion, and which Criteria are still worth showing — there is no separately authored decision tree; relevance is always derived from the Tags on the currently-eligible tests.
_Avoid_: rules, config, test list, decision tree

**Eligible test**:
A test in the Catalog that has not been excluded by any criterion selected so far — i.e. still a live possibility given what's known.
_Avoid_: matching test, recommended test, valid test

**Excluded**:
A test removed from the eligible set because a selected criterion makes it definitively inapplicable — not merely less likely. Exclusion is strict/binary; this tool never ranks or scores tests.
_Avoid_: filtered out, invalid, unlikely

**Matching engine**:
The pure function that takes the Catalog, the selected Criteria and an optional sample size, and returns the Eligible tests (as `possibleTests`) and the Criteria still worth offering (as `possibleCriteria`). "Match" names this process — the engine matches the Catalog against what's known — not a property of a test: a test is Eligible, never "matching."
_Avoid_: filter, recommender, solver
