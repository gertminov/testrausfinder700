import type { Dimension, Tag, ValueOf } from "./dimensions";

/**
 * What a student reads for one Dimension: its Display name, an optional hint
 * where the name alone isn't enough, and the Display name of each Criterion.
 * `values` is keyed by the Dimension's own Criteria, so a missing or stray
 * value is a compile error.
 */
type DimensionDisplay<D extends Dimension> = {
  readonly name: string;
  readonly hint?: string;
  readonly values: { readonly [V in ValueOf<D>]: string };
};

/**
 * The Display name of every Dimension and Criterion. Keys stay the stable
 * identifiers deep links carry; only the wording here is free to change.
 */
const displayNames: { readonly [D in Dimension]: DimensionDisplay<D> } = {
  measurementScale: {
    name: "Measurement scale",
    hint: "Scale level of the dependent variable",
    values: { interval: "Interval", ordinal: "Ordinal", nominal: "Nominal" },
  },
  independentVariableScale: {
    name: "Independent variable scale",
    values: { interval: "Interval", ordinal: "Ordinal", nominal: "Nominal" },
  },
  researchQuestion: {
    name: "Research question",
    values: {
      difference: "Difference",
      relationship: "Relationship",
      equivalence: "Equivalence",
    },
  },
  populationVariance: {
    name: "Population variance",
    values: { known: "Known", unknown: "Unknown" },
  },
  sampleDependency: {
    name: "Samples",
    values: { dependent: "Dependent (paired)", independent: "Independent" },
  },
  groupCount: {
    name: "Number of groups",
    values: {
      one: "One",
      two: "Two",
      moreThanTwo: "More than two",
      oneVsPopulationValue: "One vs. population value",
    },
  },
  testFamily: {
    name: "Test type",
    values: { parametric: "Parametric", nonparametric: "Non-parametric" },
  },
  rankTies: {
    name: "Tied ranks",
    values: { present: "Present", absent: "Absent" },
  },
  varianceHomogeneity: {
    name: "Variances",
    values: { homogeneous: "Equal", heterogeneous: "Unequal" },
  },
  differenceRegarding: {
    name: "Difference in",
    values: {
      mean: "Mean",
      variance: "Variance",
      distribution: "Distribution",
    },
  },
  categoryCount: {
    name: "Categories",
    values: {
      dichotomous: "Dichotomous (2)",
      polytomous: "Polytomous (> 2)",
    },
  },
  marginalProbability: {
    name: "Marginal probabilities",
    hint: "Are the expected category probabilities given in advance?",
    values: { known: "Known", unknown: "Unknown" },
  },
  equivalenceEstablished: {
    name: "Equivalence established",
    values: { yes: "Yes", no: "No" },
  },
  correlationHypothesis: {
    name: "Hypothesised correlation",
    values: { zero: "ρ = 0", nonzero: "ρ ≠ 0" },
  },
  factorCount: {
    name: "Number of factors",
    values: { one: "One", two: "Two" },
  },
  dataSeriesCount: {
    name: "Data series",
    values: { two: "Two" },
  },
  expectedCellFrequency: {
    name: "Expected cell frequencies",
    values: { atMost10: "≤ 10", above10: "> 10" },
  },
  normalApproximationValid: {
    name: "Normal approximation valid",
    hint: "Normal approximation of the binomial holds when n·p·q > 9",
    values: { yes: "Yes (n·p·q > 9)", no: "No" },
  },
};

/** The Display name of a Criterion, in its own Dimension's wording. */
export const criterionName = (tag: Tag): string =>
  // Indexing by the whole `Dimension` union loses the pairing with `value`; it
  // holds because `Tag` correlates the two.
  (displayNames[tag.dimension].values as Record<string, string>)[tag.value];

/** The Display name of a Dimension. */
export const dimensionName = (dimension: Dimension): string =>
  displayNames[dimension].name;

/** A short explanation of a Dimension, where its name alone isn't enough. */
export const dimensionHint = (dimension: Dimension): string | undefined =>
  displayNames[dimension].hint;
