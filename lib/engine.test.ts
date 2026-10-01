import { describe, expect, it } from "vitest";
import { findTests } from "./engine";
import { Test } from "@/lib/tests";

/**
 * A small hand-built Catalog. Ids are fixture-local; the engine only cares
 * about `accepts` and the sample-size bounds.
 */
const pairedT = {
  id: "paired-t",
  accepts: { sampleDependency: ["dependent"], measurementScale: ["interval"] },
  order: 1,
} as const;
const twoSampleT = {
  id: "two-sample-t",
  accepts: {
    sampleDependency: ["independent"],
    measurementScale: ["interval"],
  },
  order: 2,
} as const;
const anyDependencyRank = {
  id: "any-dependency-rank",
  accepts: {
    sampleDependency: ["dependent", "independent"],
    measurementScale: ["ordinal"],
  },
  order: 3,
} as const;
const scaleAgnostic = {
  name: "Scale-Agnostic",
  info: "",
  id: "scale-agnostic",
  accepts: { sampleDependency: ["independent"] },
  order: 4
} as const;

const catalog = [
  pairedT,
  twoSampleT,
  anyDependencyRank,
  scaleAgnostic,
] as (Test & { id: string })[];

const ids = (tests: readonly { id: string }[]) => tests.map((t) => t.id);

describe("findTests", () => {
  it("offers every test when nothing is selected", () => {
    const result = findTests(catalog, {});
    expect(ids(result.possibleTests)).toEqual([
      "paired-t",
      "two-sample-t",
      "any-dependency-rank",
      "scale-agnostic",
    ]);
  });

  it("echoes the selection back unchanged", () => {
    const selection = { sampleDependency: "dependent" } as const;
    expect(findTests(catalog, selection).selectedCriteria).toEqual(selection);
  });

  describe("Dimension eligibility", () => {
    it("excludes a test whose tags in a selected Dimension don't include the value", () => {
      const result = findTests(catalog, { sampleDependency: "dependent" });
      expect(ids(result.possibleTests)).not.toContain("two-sample-t");
      expect(ids(result.possibleTests)).not.toContain("scale-agnostic");
    });

    it("keeps a test that carries no tag in the selected Dimension", () => {
      const result = findTests(catalog, { measurementScale: "nominal" });
      expect(ids(result.possibleTests)).toEqual(["scale-agnostic"]);
    });

    it("keeps a test with several tags in a Dimension when any of them matches", () => {
      const dependent = findTests(catalog, { sampleDependency: "dependent" });
      const independent = findTests(catalog, {
        sampleDependency: "independent",
      });
      expect(ids(dependent.possibleTests)).toEqual([
        "paired-t",
        "any-dependency-rank",
      ]);
      expect(ids(independent.possibleTests)).toEqual([
        "two-sample-t",
        "any-dependency-rank",
        "scale-agnostic",
      ]);
    });

    it("requires every selected Criterion to hold", () => {
      const result = findTests(catalog, {
        sampleDependency: "independent",
        measurementScale: "interval",
      });
      expect(ids(result.possibleTests)).toEqual([
        "two-sample-t",
        "scale-agnostic",
      ]);
    });

    it("returns no tests rather than a closest match when nothing fits", () => {
      const result = findTests(catalog, {
        sampleDependency: "dependent",
        measurementScale: "nominal",
      });
      expect(result.possibleTests).toEqual([]);
    });
  });

  describe("sample size", () => {
    const bounded = { id: "bounded", accepts: {}, minN: 10, maxN: 29 } as const;
    const atLeast = { id: "at-least", accepts: {}, minN: 30 } as const;
    const atMost = { id: "at-most", accepts: {}, maxN: 9 } as const;
    const unbounded = { id: "unbounded", accepts: {} } as const;
    const sized = [bounded, atLeast, atMost, unbounded] as Test[];

    const possibleAt = (sampleSize: number) =>
      ids(findTests(sized, {}, sampleSize).possibleTests);

    it("keeps a test when the sample size sits exactly on a bound", () => {
      expect(possibleAt(10)).toContain("bounded");
      expect(possibleAt(29)).toContain("bounded");
    });

    it("excludes a test when the sample size falls just outside a bound", () => {
      expect(possibleAt(9)).not.toContain("bounded");
      expect(possibleAt(30)).not.toContain("bounded");
    });

    it("treats a missing bound as unbounded on that side", () => {
      expect(possibleAt(1_000_000)).toEqual(["at-least", "unbounded"]);
      expect(possibleAt(1)).toEqual(["at-most", "unbounded"]);
    });

    it("never excludes a bounded test when no sample size is given", () => {
      expect(ids(findTests(sized, {}).possibleTests)).toEqual([
        "bounded",
        "at-least",
        "at-most",
        "unbounded",
      ]);
    });

    it("requires a test to pass both the Criteria and the sample size", () => {
      const smallPaired = { ...pairedT, id: "small-paired", maxN: 29 } as const;
      const result = findTests(
        [smallPaired, pairedT, twoSampleT] as unknown as Test[],
        { sampleDependency: "dependent" },
        50,
      );
      expect(ids(result.possibleTests)).toEqual(["paired-t"]);
    });
  });

  describe("possible criteria", () => {
    it("offers each discriminating Dimension with the values tagged on Eligible tests, in schema order", () => {
      expect(findTests(catalog, {}).possibleCriteria).toEqual([
        { dimension: "measurementScale", values: ["interval", "ordinal"] },
        { id: "sampleDependency", value: ["dependent" , "independent"]},
      ]);
    });

    it("never re-offers a Dimension that already has a selected value", () => {
      // any-dependency-rank still carries `independent`, so only the
      // selection itself keeps sampleDependency out.
      const result = findTests(catalog, { sampleDependency: "dependent" });
      expect(result.possibleCriteria).toEqual([
        { dimension: "measurementScale", values: ["interval"] },
        { id: "measurementScale", value: "ordinal" },
      ]);
    });

    it("drops a Dimension once every Eligible test agrees on it", () => {
      const twoGroupParametric = {
        id: "two-group-parametric",
        accepts: { groupCount: ["two"], testFamily: ["parametric"] },
      } as const;
      const twoGroupNonparametric = {
        id: "two-group-nonparametric",
        accepts: { groupCount: ["two"], testFamily: ["nonparametric"] },
      } as const;
      const manyGroupNonparametric = {
        id: "many-group-nonparametric",
        accepts: { groupCount: ["moreThanTwo"], testFamily: ["nonparametric"] },
      } as const;
      const groups = [
        twoGroupParametric,
        twoGroupNonparametric,
        manyGroupNonparametric,
      ] as unknown as Test[];

      // Only two-group-parametric is left, so groupCount can't narrow further.
      expect(
        findTests(groups, { testFamily: "parametric" }).possibleCriteria,
      ).toEqual([]);
      // Two tests left that differ on groupCount: it still narrows.
      expect(
        findTests(groups, { testFamily: "nonparametric" }).possibleCriteria,
      ).toEqual([
        { dimension: "groupCount", value: "two" },
        { id: "groupCount", value: "moreThanTwo" },
      ]);
    });

    it("keeps a Dimension while any of its values narrows, offering all of them", () => {
      // Selecting `two` Excludes nothing, but `moreThanTwo` Excludes
      // only-two, so groupCount still narrows and both values are offered.
      const tests = [
        { id: "two-or-more", accepts: { groupCount: ["two", "moreThanTwo"] } },
        { id: "only-two", accepts: { groupCount: ["two"] } },
      ] as unknown as Test[];
      expect(findTests(tests, {}).possibleCriteria).toEqual([
        { dimension: "groupCount", value: "two" },
        { id: "groupCount", value: "moreThanTwo" },
      ]);
    });

    it("doesn't offer a value tagged only on Excluded tests", () => {
      const tests = [
        {
          id: "x",
          accepts: { testFamily: ["parametric"], groupCount: ["two"] },
        },
        {
          id: "y",
          accepts: { testFamily: ["parametric"], groupCount: ["moreThanTwo"] },
        },
        {
          id: "z",
          accepts: { testFamily: ["nonparametric"], groupCount: ["one"] },
        },
      ] as unknown as Test[];
      expect(
        findTests(tests, { testFamily: "parametric" }).possibleCriteria,
      ).toEqual([
        { dimension: "groupCount", value: "two" },
        { id: "groupCount", value: "moreThanTwo" },
      ]);
    });

    it("treats a test with no tag in a Dimension as accepting any value there", () => {
      // Selecting `two` would keep `untagged`, so groupCount narrows nothing.
      const tests = [
        {
          id: "tagged",
          accepts: { testFamily: ["parametric"], groupCount: ["two"] },
        },
        { id: "untagged", accepts: { testFamily: ["parametric"] } },
        {
          id: "other",
          accepts: {
            testFamily: ["nonparametric"],
            groupCount: ["moreThanTwo"],
          },
        },
      ] as unknown as Test[];
      expect(
        findTests(tests, { testFamily: "parametric" }).possibleCriteria,
      ).toEqual([]);
    });

    it("computes relevance over the tests the sample size leaves Eligible", () => {
      const tests = [
        { id: "small", accepts: { testFamily: ["parametric"] }, maxN: 29 },
        { id: "large", accepts: { testFamily: ["nonparametric"] }, minN: 30 },
      ] as unknown as Test[];
      expect(findTests(tests, {}).possibleCriteria).toEqual([
        { dimension: "testFamily", value: "parametric" },
        { id: "testFamily", value: "nonparametric" },
      ]);
      expect(findTests(tests, {}, 50).possibleCriteria).toEqual([]);
    });
  });
});
