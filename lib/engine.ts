import {
  allTags,
  type Dimension,
  dimensionNames,
  dimensions,
  type Selection,
  selectionToTags,
  type Tag,
  type TagOf,
} from "./dimensions";
import { catalog, Test } from "@/lib/tests";
import { read } from "node:fs";

export interface MatchResult {
  selectedCriteria: Selection;
  /** The sample size the tests were checked against, if any. */
  sampleSize?: number;
  possibleTests: Test[];
  /** The Tags still worth offering*/
  possibleCriteria: { dimension: Dimension; values: string[] }[];
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
  tests: readonly Test[],
  selection: Selection,
): { dimension: Dimension; values: string[] }[] => {
  const selectableCriteria: Partial<Record<Dimension, Set<string>>> = {};
  for (const t of tests) {
    const accepted = toEntries(t.accepts);
    for (const [dimension, values] of accepted) {
      if (
        selection[dimension] !== undefined || //already selected
        !wouldExclude(dimension, values, tests) // would not exclude any tests
      )
        continue;

      if (selectableCriteria[dimension] === undefined) {
        selectableCriteria[dimension] = new Set(values);
      } else {
        values.forEach((v) => selectableCriteria[dimension]?.add(v));
      }
    }
  }
  return toEntries(selectableCriteria).map(([dimension, values]) => ({
    dimension,
    values: Array.from(values),
  }));
};

function toEntries<K extends string, V>(obj: Partial<Record<K, V>>) {
  return Object.entries(obj) as [K, V][];
}

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
const wouldExclude = (
  dimension: Dimension,
  values: readonly string[],
  tests: readonly Test[],
): boolean => {
  for (let value of values) {
    if (tests.some((test) => !accepts(test, { dimension, value }))) return true;
  }
  return false;
};

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
