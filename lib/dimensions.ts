/**
 * The shape a Dimension declaration must satisfy. The non-empty tuple is what
 * rejects a Dimension declared with no values; it is exported so the type tests
 * pin that guarantee against this constraint rather than a copy of it.
 */
export type DimensionSchema = Record<string, readonly [string, ...string[]]>;

/**
 * Every Dimension in the Catalog, and the Criteria values each one admits,
 * declared once. Adding a Dimension or a value is a one-line edit here.
 *
 * `as const satisfies` rather than a type annotation: an annotation would widen
 * the values to `string[]`, losing the literal types that `Tag`, `Selection` and
 * `TagKey` are derived from, while `satisfies` keeps them and still rejects a
 * Dimension declared with no values.
 */
export const dimensions = {
  measurementScale: ["interval", "ordinal", "nominal"],
  independentVariableScale: ["interval", "ordinal", "nominal"],
  researchQuestion: ["difference", "relationship", "equivalence"],
  populationVariance: ["known", "unknown"],
  sampleDependency: ["dependent", "independent"],
  groupCount: ["one", "two", "moreThanTwo", "oneVsPopulationValue"],
  testFamily: ["parametric", "nonparametric"],
  rankTies: ["present", "absent"],
  varianceHomogeneity: ["homogeneous", "heterogeneous"],
  differenceRegarding: ["mean", "variance", "distribution"],
  categoryCount: ["dichotomous", "polytomous"],
  marginalProbability: ["known", "unknown"],
  equivalenceEstablished: ["yes", "no"],
  correlationHypothesis: ["zero", "nonzero"],
  factorCount: ["one", "two"],
  dataSeriesCount: ["two"],
} as const satisfies DimensionSchema;

/** The name of a Dimension — a category of mutually-exclusive Criteria. */
export type Dimension = keyof typeof dimensions;

/** The Criteria values one Dimension admits. */
export type ValueOf<D extends Dimension> = (typeof dimensions)[D][number];

/**
 * One Criterion: a Dimension paired with one of the values *that* Dimension
 * admits. The two fields are correlated by the type system, so a Tag naming one
 * Dimension with another Dimension's value cannot be constructed — and narrowing
 * a Tag on `dimension` narrows `value` to that Dimension's Criteria, which is
 * what lets a per-Dimension branch be checked for exhaustiveness.
 *
 * Distributing over `Dimension` rather than writing
 * `{ dimension: Dimension; value: ValueOf<Dimension> }` is the whole point: the
 * latter is the uncorrelated cross-product and admits mismatched pairs.
 */
export type Tag = {
  [D in Dimension]: { readonly dimension: D; readonly value: ValueOf<D> };
}[Dimension];

/** The Tags of a single Dimension. */
export type TagOf<D extends Dimension> = Extract<Tag, { dimension: D }>;
