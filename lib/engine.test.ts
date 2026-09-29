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
});
