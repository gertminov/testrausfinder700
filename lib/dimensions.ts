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
  // The two frequency flags are mutually exclusive, hence one Dimension, not
  // two flags.
  expectedCellFrequency: ["atMost10", "above10"],
  // np·pq > 9. `no` is carried by the exact binomial test; without it the
  // Dimension could never discriminate.
  normalApproximationValid: ["yes", "no"],
} satisfies DimensionSchema;

/** The name of a Dimension — a category of mutually-exclusive Criteria. */
export type Dimension = keyof typeof dimensions;

/** Every Dimension, in the schema's declaration order. */
export const dimensionNames = Object.keys(dimensions) as Dimension[];

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

/**
 * The Criteria one test accepts, grouped by Dimension — the Catalog's authoring
 * form. A missing key means the test doesn't care about that Dimension; several
 * values under one key mean it accepts any of them. Keying by Dimension is what
 * makes a value under the wrong Dimension a compile error, and it means the
 * matching engine never has to parse or group tags itself.
 */
export type Accepts = {
  readonly [D in Dimension]?: readonly ValueOf<D>[];
};

/**
 * The Criteria a student has selected: at most one value per Dimension, keyed by
 * Dimension. Holding a single value rather than an array is what makes two
 * contradictory values in one Dimension unrepresentable, instead of something
 * the engine has to detect and reject.
 */
export type Selection = {
  [D in Dimension]?: ValueOf<D>;
};

export const allTags: readonly Tag[] = Object.entries(dimensions).flatMap(
  ([dimension, values]) =>
    // The pairing holds because `values` was read from `dimension`'s own key.
    values.map((value) => ({ dimension, value }) as Tag),
);

/**
 * A Selection as a list of Tags, for callers that want the list form. Ordered
 * by the schema's Dimension order, so equal Selections give equal lists.
 */
export const selectionToTags = (selection: Selection): Tag[] =>
  dimensionNames.flatMap((dimension) => {
    const value = selection[dimension];
    // `selection[dimension]` is indexed by the whole `Dimension` union, so TS
    // loses the pairing between the two; it holds because `value` was read
    // from `dimension`'s own key.
    return value === undefined ? [] : [{ dimension, value } as Tag];
  });

/** `selection` with `tag` selected, replacing any value already selected in its Dimension. */
export const withTag = (selection: Selection, tag: Tag): Selection => ({
  ...selection,
  [tag.dimension]: tag.value,
});

/** `selection` with nothing selected in `dimension`. */
export const without = (
  selection: Selection,
  dimension: Dimension,
): Selection => {
  const { [dimension]: _, ...rest } = selection;
  return rest;
};

const isDimension = (key: string): key is Dimension =>
  Object.hasOwn(dimensions, key);

/**
 * Reads a Selection out of URL search params. Keys that aren't Dimensions and
 * values that Dimension doesn't admit are dropped, so a hand-edited or stale
 * URL can't produce an invalid Selection. A repeated key keeps its first value.
 */
export const selectionFromSearchParams = (
  params: Record<string, string>,
): Selection => {
  const selection: Selection = {};
  for (const key in params) {
    const value = params[key];
    if (isDimension(key) && dimensions[key].includes(value)) {
      selection[key] = value;
    }
  }
  return selection;
};

/** The inverse of `selectionFromSearchParams`, in the schema's Dimension order. */
export const selectionToSearchParams = (
  selection: Selection,
): URLSearchParams =>
  new URLSearchParams(
    selectionToTags(selection).map(({ dimension, value }) => [
      dimension,
      value,
    ]),
  );

/** The search param that carries the sample size alongside the Selection. */
export const SAMPLE_SIZE_PARAM = "sampleSize";

/**
 * Reads the sample size out of URL search params. Anything that isn't a
 * positive whole number is dropped, so a bad URL means "no sample size".
 */
export const sampleSizeFromSearchParams = (
  params: Record<string, string>,
): number | undefined => {
  const raw = params[SAMPLE_SIZE_PARAM];
  if (raw === undefined || !/^\d+$/.test(raw)) return undefined;
  const sampleSize = Number(raw);
  return sampleSize > 0 ? sampleSize : undefined;
};
