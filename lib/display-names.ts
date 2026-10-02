import type { Dimension, Tag, ValueOf } from "./dimensions";

/**
 * What a student reads for one Dimension: its Display name, a short hint
 * explaining what it asks, and the Display name of each Criterion.
 * `values` is keyed by the Dimension's own Criteria, so a missing or stray
 * value is a compile error.
 */
type DimensionDisplay<D extends Dimension> = {
  readonly name: string;
  readonly short?: string;
  readonly hint: string;
  readonly values: { readonly [V in ValueOf<D>]: string };
};

/**
 * The Display name of every Dimension and Criterion. Keys stay the stable
 * identifiers deep links carry; only the wording here is free to change.
 */
const displayNames: { readonly [D in Dimension]: DimensionDisplay<D> } = {
  measurementScale: {
    name: "Scale",
    hint: "Scale level of the dependent variable",
    values: { interval: "Interval", ordinal: "Ordinal", nominal: "Nominal" },
  },
  independentVariableScale: {
    name: "Independent variable scale",
    short: "IV scale",
    hint: "Scale level of the independent variable",
    values: { interval: "Interval", ordinal: "Ordinal", nominal: "Nominal" },
  },
  researchQuestion: {
    name: "Research question",
    short: "Question",
    hint: "What the hypothesis is about",
    values: {
      difference: "Difference",
      relationship: "Relationship",
      equivalence: "Equivalence",
    },
  },
  populationVariance: {
    name: "Population variance",
    short: "Pop. var.",
    hint: "Is the population variance given, rather than estimated from the sample?",
    values: { known: "Known", unknown: "Unknown" },
  },
  sampleDependency: {
    name: "Samples",
    hint: "Paired means the same subjects measured twice, or matched pairs",
    values: { dependent: "Dependent (paired)", independent: "Independent" },
  },
  groupCount: {
    name: "Groups",
    hint: "How many samples are compared",
    values: {
      one: "One",
      two: "Two",
      moreThanTwo: "More than two",
      oneVsPopulationValue: "One vs. population value",
    },
  },
  testFamily: {
    name: "Test type",
    short: "Test",
    hint: "Parametric tests assume a distribution, e.g. normality",
    values: { parametric: "Parametric", nonparametric: "Non-parametric" },
  },
  rankTies: {
    name: "Tied ranks",
    hint: "Do several observations share the same rank?",
    values: { present: "Present", absent: "Absent" },
  },
  varianceHomogeneity: {
    name: "Variances",
    hint: "Are the variances equal across the groups' populations?",
    values: { homogeneous: "Equal", heterogeneous: "Unequal" },
  },
  differenceRegarding: {
    name: "Difference in",
    short: "Difference",
    hint: "Which property of the samples is compared",
    values: {
      mean: "Mean",
      variance: "Variance",
      distribution: "Distribution",
    },
  },
  categoryCount: {
    name: "Categories",
    short: "Cats",
    hint: "How many categories the nominal variable has",
    values: {
      dichotomous: "Dichotomous (2)",
      polytomous: "Polytomous (> 2)",
    },
  },
  marginalProbability: {
    name: "Marginal probabilities",
    short: "Marginal",
    hint: "Are the expected category probabilities given in advance?",
    values: { known: "Known", unknown: "Unknown" },
  },
  equivalenceEstablished: {
    name: "Equivalence established",
    short: "Equiv.",
    hint: "Has an expert set an equivalence range ±Δ?",
    values: { yes: "Yes", no: "No" },
  },
  correlationHypothesis: {
    name: "Hypothesised correlation",
    short: "Correlation",
    hint: "The population correlation ρ the null hypothesis assumes",
    values: { zero: "ρ = 0", nonzero: "ρ ≠ 0" },
  },
  factorCount: {
    name: "Number of factors",
    short: "Factors",
    hint: "How many independent variables group the data",
    values: { one: "One", two: "Two" },
  },
  dataSeriesCount: {
    name: "Data series",
    hint: "How many measured variables go into the test",
    values: { two: "Two", moreThanTwo: "More than two" },
  },
  expectedCellFrequency: {
    name: "Expected cell frequencies",
    short: "Expected",
    hint: "Expected frequency e = n·π in each category",
    values: { atMost10: "≤ 10", above10: "> 10" },
  },
  normalApproximationValid: {
    name: "Normal approximation valid",
    short: "Normal approx.",
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

export const dimensionShortName = (dimension: Dimension): string =>
    displayNames[dimension].short ?? displayNames[dimension].name;

/** A short explanation of what a Dimension asks. */
export const dimensionHint = (dimension: Dimension): string =>
  displayNames[dimension].hint;
