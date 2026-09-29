import {
  type Accepts,
  type Dimension,
  dimensions,
  type Selection,
  selectionToTags,
  type Tag,
  type TagOf,
} from "./dimensions";

/**
 * What the engine needs from a Catalog entry. Structural rather than
 * `TestWithId`, so fixture Catalogs in tests need not use real `TestId`s; the
 * entries come back out with their full type intact.
 */
export interface Matchable {
  readonly accepts: Accepts;
  readonly minN?: number;
  readonly maxN?: number;
}

export interface MatchResult<T extends Matchable> {
  /** The input Selection, echoed back unchanged. */
  selectedCriteria: Selection;
  /** The Eligible tests, in Catalog order. */
  possibleTests: T[];
  /** The Tags still worth offering: each one would narrow `possibleTests`. */
  possibleCriteria: Tag[];
}

/**
 * The matching engine: which tests are still Eligible given what the student
 * knows, and which further Criteria would narrow them.
 */
export const findTests = <T extends Matchable>(
  catalog: readonly T[],
  selection: Selection,
  sampleSize?: number,
): MatchResult<T> => {
  const selected = selectionToTags(selection);
  const possibleTests = catalog.filter(
    (test) =>
      selected.every((tag) => accepts(test, tag)) &&
      fitsSampleSize(test, sampleSize),
  );
  const candidates = allTags.filter(
    (tag) =>
      selection[tag.dimension] === undefined &&
      possibleTests.some((test) => isTaggedWith(test, tag)),
  );
  // A Dimension is worth offering only if at least one of its candidate values
  // would Exclude some Eligible test; otherwise every answer changes nothing.
  const discriminating = new Set(
    candidates
      .filter((tag) => possibleTests.some((test) => !accepts(test, tag)))
      .map((tag) => tag.dimension),
  );
  return {
    selectedCriteria: selection,
    possibleTests,
    possibleCriteria: candidates.filter((tag) =>
      discriminating.has(tag.dimension),
    ),
  };
};

/** Every Tag the schema declares, in Dimension order, then value order. */
const allTags: readonly Tag[] = (
  Object.entries(dimensions) as [Dimension, readonly string[]][]
).flatMap(([dimension, values]) =>
  // The pairing holds because `values` was read from `dimension`'s own key.
  values.map((value) => ({ dimension, value }) as Tag),
);

/**
 * Whether a sample size lies within a test's inclusive `[minN, maxN]`. A
 * missing bound is unbounded on that side, and an unknown sample size Excludes
 * nothing.
 */
const fitsSampleSize = (
  { minN = -Infinity, maxN = Infinity }: Matchable,
  sampleSize: number | undefined,
): boolean =>
  sampleSize === undefined || (minN <= sampleSize && sampleSize <= maxN);

/**
 * Whether a test survives one selected Criterion. A test with no tag in the
 * Tag's Dimension doesn't care about it, so is never Excluded on it.
 */
const accepts = (test: Matchable, tag: Tag): boolean =>
  test.accepts[tag.dimension] === undefined || isTaggedWith(test, tag);

/**
 * Whether a test explicitly carries a Tag, as opposed to not caring.
 *
 * Generic over the Dimension so `accepts[tag.dimension]` is that one
 * Dimension's list: indexed by a plain `Tag`, it would be the union of every
 * Dimension's list, and `includes` on that union takes `never`.
 */
const isTaggedWith = <D extends Dimension>(
  test: Matchable,
  tag: TagOf<D>,
): boolean => test.accepts[tag.dimension]?.includes(tag.value) ?? false;
