import { describe, expect, it } from "vitest";
import { findTests } from "./engine";

/**
 * A small hand-built Catalog. Ids are fixture-local; the engine only cares
 * about `accepts` and the sample-size bounds.
 */
const pairedT = {
  id: "paired-t",
  accepts: { sampleDependency: ["dependent"], measurementScale: ["interval"] },
} as const;
const twoSampleT = {
  id: "two-sample-t",
  accepts: {
    sampleDependency: ["independent"],
    measurementScale: ["interval"],
  },
} as const;
const anyDependencyRank = {
  id: "any-dependency-rank",
  accepts: {
    sampleDependency: ["dependent", "independent"],
    measurementScale: ["ordinal"],
  },
} as const;
const scaleAgnostic = {
  id: "scale-agnostic",
  accepts: { sampleDependency: ["independent"] },
} as const;

const catalog = [pairedT, twoSampleT, anyDependencyRank, scaleAgnostic];

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
    const sized = [bounded, atLeast, atMost, unbounded];

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
        [smallPaired, pairedT, twoSampleT],
        { sampleDependency: "dependent" },
        50,
      );
      expect(ids(result.possibleTests)).toEqual(["paired-t"]);
    });
  });
});
