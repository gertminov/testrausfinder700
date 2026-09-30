import { describe, expect, it } from "vitest";
import { allTags, dimensionNames } from "./dimensions";
import { criterionName, dimensionHint, dimensionName } from "./display-names";

describe("criterionName", () => {
  it("reads a Criterion in its Dimension's wording", () => {
    expect(
      criterionName({
        dimension: "varianceHomogeneity",
        value: "homogeneous",
      }),
    ).toBe("Equal");
  });
});

describe("dimensionName", () => {
  it("reads a Dimension as a student would", () => {
    expect(dimensionName("groupCount")).toBe("Number of groups");
  });
});

describe("dimensionHint", () => {
  it("explains what a Dimension asks", () => {
    expect(dimensionHint("normalApproximationValid")).toBe(
      "Normal approximation of the binomial holds when n·p·q > 9",
    );
  });
});

describe("Display names", () => {
  it("name and explain every Dimension, and name every Criterion", () => {
    for (const dimension of dimensionNames) {
      expect(dimensionName(dimension), dimension).toMatch(/\S/);
      expect(dimensionHint(dimension), dimension).toMatch(/\S/);
    }
    for (const tag of allTags)
      expect(criterionName(tag), `${tag.dimension}=${tag.value}`).toMatch(/\S/);
  });
});
