import {
  allTags,
  type Dimension,
  type Selection,
  selectionToTags,
  type Tag,
  type TagOf,
} from "./dimensions";
import { Test } from "@/lib/tests";

export interface MatchResult {
  selectedCriteria: Selection;
  /** The sample size the tests were checked against, if any. */
  sampleSize?: number;
  possibleTests: Test[];
  /** The Tags still worth offering*/
  possibleCriteria: Tag[];
}

/**
 * The matching engine: which tests are still Eligible given what the student
 * knows, and which further Criteria would narrow them.
 */
export const findTests = (
  catalog: readonly Test[],
  selection: Selection,
  sampleSize?: number,
): MatchResult => {
  const possibleTests = eligibleTests(catalog, selection, sampleSize);
  const possibleCriteria = narrowingCriteria(possibleTests, selection);
  return {
    selectedCriteria: selection,
    sampleSize,
    possibleTests,
    possibleCriteria,
  };
};

/** The tests in the Catalog that no selected Criterion or sample size Excludes. */
const eligibleTests = (
  catalog: readonly Test[],
  selection: Selection,
  sampleSize: number | undefined,
): Test[] => {
  const selectedTags = selectionToTags(selection);
  return catalog.filter((test) => isEligible(test, selectedTags, sampleSize));
};

/**
 * The Tags still worth offering: offerable Tags in an unanswered Dimension
 * where at least one value would Exclude some Eligible test. Otherwise every
 * answer in that Dimension changes nothing, so none of its Tags are offered.
 */
const narrowingCriteria = (
  eligible: readonly Test[],
  selection: Selection,
): Tag[] => {
  const offerable = allTags.filter(
    (tag) =>
      isUnanswered(selection, tag.dimension) && isOfferable(tag, eligible),
  );
  const narrowingDimensions = new Set(
    offerable
      .filter((tag) => wouldExclude(tag, eligible))
      .map((tag) => tag.dimension),
  );
  return offerable.filter((tag) => narrowingDimensions.has(tag.dimension));
};

const isEligible = (
  test: Test,
  selectedTags: readonly Tag[],
  sampleSize: number | undefined,
): boolean =>
  selectedTags.every((tag) => accepts(test, tag)) &&
  fitsSampleSize(test, sampleSize);

const isUnanswered = (selection: Selection, dimension: Dimension): boolean =>
  selection[dimension] === undefined;

/** Whether some Eligible test explicitly carries the Tag. */
const isOfferable = (tag: Tag, eligible: readonly Test[]): boolean =>
  eligible.some((test) => isTaggedWith(test, tag));

/** Whether selecting the Tag would Exclude at least one Eligible test. */
const wouldExclude = (tag: Tag, eligible: readonly Test[]): boolean =>
  eligible.some((test) => !accepts(test, tag));

/**
 * Whether a sample size lies within a test's inclusive `[minN, maxN]`. A
 * missing bound is unbounded on that side, and an unknown sample size Excludes
 * nothing.
 */
const fitsSampleSize = (
  { minN = -Infinity, maxN = Infinity }: Test,
  sampleSize: number | undefined,
): boolean =>
  sampleSize === undefined || (minN <= sampleSize && sampleSize <= maxN);

/**
 * Whether a test survives one selected Criterion. A test with no tag in the
 * Tag's Dimension doesn't care about it, so is never Excluded on it.
 */
const accepts = (test: Test, tag: Tag): boolean =>
  test.accepts[tag.dimension] === undefined || isTaggedWith(test, tag);

/**
 * Whether a test explicitly carries a Tag
 *
 * Generic over the Dimension so `accepts[tag.dimension]` is that one
 * Dimension's list: indexed by a plain `Tag`, it would be the union of every
 * Dimension's list, and `includes` on that union takes `never`.
 */
const isTaggedWith = <D extends Dimension>(
  test: Test,
  tag: TagOf<D>,
): boolean => test.accepts[tag.dimension]?.includes(tag.value) ?? false;
