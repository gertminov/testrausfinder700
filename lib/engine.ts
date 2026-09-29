import {
  type Accepts,
  type Selection,
  selectionToTags,
  type Tag,
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
 * knows, and which further Criteria would narrow them. Pure — no I/O, no
 * framework — so it runs the same in a component, an API route or a script.
 */
export const findTests = <T extends Matchable>(
  catalog: readonly T[],
  selection: Selection,
  sampleSize?: number,
): MatchResult<T> => {
  const selected = selectionToTags(selection);
  return {
    selectedCriteria: selection,
    possibleTests: catalog.filter(
      (test) =>
        selected.every((tag) => accepts(test, tag)) &&
        fitsSampleSize(test, sampleSize),
    ),
    possibleCriteria: [],
  };
};

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
const accepts = (test: Matchable, { dimension, value }: Tag): boolean => {
  // Indexing by the whole `Dimension` union widens the list's element type to
  // every Dimension's values, so `includes` needs the wider type spelled out.
  const values: readonly string[] | undefined = test.accepts[dimension];
  return values === undefined || values.includes(value);
};
