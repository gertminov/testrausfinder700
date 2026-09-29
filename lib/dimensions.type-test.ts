/**
 * Compile-time tests for the Dimension schema and the types derived from it.
 *
 * These are not run by a test runner — they pass exactly when `tsc` reports no
 * error for this file. Each guarantee is pinned from both sides: a positive
 * assertion that the legal form is accepted, and a `@ts-expect-error` that the
 * illegal form is rejected. A `@ts-expect-error` whose line stops erroring
 * becomes `TS2578: Unused '@ts-expect-error' directive`, so a guarantee cannot
 * silently regress into a passing build.
 */

import {
  type Accepts,
  type Dimension,
  type DimensionSchema,
  type Selection,
  selectionToTags,
  type Tag,
  type TagOf,
  type ValueOf,
} from "./dimensions";

type Expect<T extends true> = T;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

// --- The schema itself -----------------------------------------------------

// A Dimension must declare at least one value. Without this, a Dimension could
// be declared empty, and `ValueOf` for it would be `never` — a Criterion that
// can never be selected and a branch that can never be taken.
// The directive sits on the property, not above the `const`: the error is
// reported at the offending entry, and the formatter is free to reflow the
// object without moving the error away from the directive.
const _emptyDimensionIsRejected = {
  // @ts-expect-error - a Dimension declared with no values is not a legal schema
  broken: [],
} as const satisfies DimensionSchema;
void _emptyDimensionIsRejected;

// `ValueOf<D>` is that one Dimension's values, not the union of all of them.
type _ValuesAreScopedToTheirDimension = Expect<
  Equal<ValueOf<"measurementScale">, "interval" | "ordinal" | "nominal">
>;
type _SingleValuedDimension = Expect<Equal<ValueOf<"dataSeriesCount">, "two">>;

// @ts-expect-error - "notADimension" is not a declared Dimension
type _UndeclaredDimension = ValueOf<"notADimension">;

// --- Tag: the two fields are correlated ------------------------------------

// Every Dimension/value pair the schema declares is a Tag, and each Dimension
// admits exactly its own values — nothing declared is missing, nothing extra is
// admitted. Checked across every Dimension at once: if any one of them carried
// the wrong value type, the union below would not be `true`.
type _EveryDeclaredPairExactly = Expect<
  { [D in Dimension]: Equal<TagOf<D>["value"], ValueOf<D>> }[Dimension]
>;

const _legalTags: Tag[] = [
  { dimension: "measurementScale", value: "interval" },
  { dimension: "groupCount", value: "oneVsPopulationValue" },
  { dimension: "dataSeriesCount", value: "two" },
];
void _legalTags;

// The cross-Dimension pair — the error the flat `"dimension:value"` string form
// could never catch, and the reason this type exists.
// Reported against the whole object rather than the `value` property: both
// literals are legal somewhere in the union, so it is their pairing that fails.
// @ts-expect-error - "interval" is a measurementScale value, not a groupCount value
const _crossDimensionPair: Tag = {
  dimension: "groupCount",
  value: "interval",
};
void _crossDimensionPair;

const _undeclaredValue: Tag = {
  dimension: "measurementScale",
  // @ts-expect-error - "continuous" is not a declared measurementScale value
  value: "continuous",
};
void _undeclaredValue;

const _undeclaredDimensionInTag: Tag = {
  // @ts-expect-error - "notADimension" is not a declared Dimension
  dimension: "notADimension",
  value: "interval",
};
void _undeclaredDimensionInTag;

// The correlation is the point: the uncorrelated cross-product of every
// Dimension with every Dimension's values is strictly wider than `Tag`. If `Tag`
// were ever written as `{ dimension: Dimension; value: ValueOf<Dimension> }`,
// this assignment would start succeeding and the directive would go unused.
type UncorrelatedPair = {
  readonly dimension: Dimension;
  readonly value: ValueOf<Dimension>;
};
// @ts-expect-error - an arbitrary Dimension paired with an arbitrary value is not a Tag
const _uncorrelatedIsNotATag: Tag = {} as UncorrelatedPair;
void _uncorrelatedIsNotATag;

// --- Narrowing on `dimension` narrows `value` ------------------------------

// The `never` in the default branch is the real assertion: it only type-checks
// if narrowing on `dimension` narrowed `value` to exactly groupCount's four
// values. This is what makes a per-Dimension branch exhaustiveness-checkable.
const _narrowingIsExhaustive = (tag: Tag): string => {
  if (tag.dimension !== "groupCount") return "some other Dimension";
  // Bound before the switch: exhausting the cases narrows `tag` itself to
  // `never`, which would make `tag.value` in the default branch an error about
  // `tag` rather than the assertion about `value` this is trying to make.
  const value = tag.value;
  switch (value) {
    case "one":
    case "two":
    case "moreThanTwo":
    case "oneVsPopulationValue":
      return value;
    default: {
      const unreachable: never = value;
      return unreachable;
    }
  }
};
void _narrowingIsExhaustive;

const _narrowingExcludesForeignValues = (tag: Tag): boolean => {
  if (tag.dimension !== "groupCount") return false;
  // @ts-expect-error - after narrowing to groupCount, "interval" is not a possible value
  return tag.value === "interval";
};
void _narrowingExcludesForeignValues;

// --- TagOf -----------------------------------------------------------------

type _TagOfIsOneDimension = Expect<
  Equal<
    TagOf<"rankTies">,
    { readonly dimension: "rankTies"; readonly value: "present" | "absent" }
  >
>;

const _allTagsOfOneDimension: TagOf<"rankTies">[] = [
  { dimension: "rankTies", value: "present" },
  { dimension: "rankTies", value: "absent" },
];
void _allTagsOfOneDimension;

// `value` is left as a legal rankTies value so the only thing wrong is the
// Dimension, keeping the rejection attributable to one property.
const _tagOfExcludesOtherDimensions: TagOf<"rankTies"> = {
  // @ts-expect-error - a measurementScale Tag is not a rankTies Tag
  dimension: "measurementScale",
  value: "present",
};
void _tagOfExcludesOtherDimensions;

// --- Accepts: the Catalog's authoring form ---------------------------------

const _legalAccepts: Accepts = {
  measurementScale: ["interval", "ordinal"],
  groupCount: ["oneVsPopulationValue"],
  normalApproximationValid: ["no"],
};
void _legalAccepts;

// Not caring about any Dimension is legal: every key is optional.
const _acceptsNothingInParticular: Accepts = {};
void _acceptsNothingInParticular;

// The guarantee 04 exists for: a value filed under another Dimension's key.
const _valueUnderWrongDimension: Accepts = {
  // @ts-expect-error - "interval" is a measurementScale value, not a groupCount value
  groupCount: ["interval"],
};
void _valueUnderWrongDimension;

const _undeclaredDimensionInAccepts: Accepts = {
  // @ts-expect-error - "notADimension" is not a declared Dimension
  notADimension: ["interval"],
};
void _undeclaredDimensionInAccepts;

// --- Selection: at most one value per Dimension ---------------------------

const _legalSelection: Selection = {
  measurementScale: "interval",
  groupCount: "oneVsPopulationValue",
};
void _legalSelection;

// Nothing selected yet is legal: every key is optional.
const _emptySelection: Selection = {};
void _emptySelection;

const _selectionValueFromWrongDimension: Selection = {
  // @ts-expect-error - "interval" is a measurementScale value, not a groupCount value
  groupCount: "interval",
};
void _selectionValueFromWrongDimension;

// User story 6, structurally: a Dimension holds one value, so there is no way
// to write two. The list form `Accepts` uses is rejected outright.
const _twoValuesInOneDimension: Selection = {
  // @ts-expect-error - a Selection holds one value per Dimension, not a list
  sampleDependency: ["dependent", "independent"],
};
void _twoValuesInOneDimension;

const _undeclaredDimensionInSelection: Selection = {
  // @ts-expect-error - "notADimension" is not a declared Dimension
  notADimension: "interval",
};
void _undeclaredDimensionInSelection;

// The list form is plain Tags, so it narrows like any other Tag.
const _selectionAsTags: Tag[] = selectionToTags({
  measurementScale: "ordinal",
});
void _selectionAsTags;

export type {
  _ValuesAreScopedToTheirDimension,
  _SingleValuedDimension,
  _UndeclaredDimension,
  _EveryDeclaredPairExactly,
  _TagOfIsOneDimension,
};
