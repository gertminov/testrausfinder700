import { describe, expect, it } from "vitest";
import { dimensionColorStyle, dimensionHue } from "./dimension-colors";
import { dimensionNames } from "./dimensions";

/** The shortest distance between two hues around the color wheel. */
const hueDistance = (a: number, b: number): number => {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
};

describe("dimensionHue", () => {
  it("gives every Dimension a hue on the color wheel", () => {
    for (const dimension of dimensionNames) {
      const hue = dimensionHue(dimension);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    }
  });

  it("gives every Dimension its own hue", () => {
    const hues = dimensionNames.map(dimensionHue);
    expect(new Set(hues).size).toBe(dimensionNames.length);
  });

  it("spreads the hues evenly around the wheel", () => {
    const hues = dimensionNames.map(dimensionHue);
    for (const [i, a] of hues.entries()) {
      for (const b of hues.slice(i + 1)) {
        expect(hueDistance(a, b)).toBeGreaterThanOrEqual(
          Math.floor(360 / dimensionNames.length),
        );
      }
    }
  });

  it("keeps Dimensions shown next to each other far apart on the wheel", () => {
    for (let i = 1; i < dimensionNames.length; i++) {
      expect(
        hueDistance(
          dimensionHue(dimensionNames[i - 1]),
          dimensionHue(dimensionNames[i]),
        ),
      ).toBeGreaterThanOrEqual(90);
    }
  });
});

describe("dimensionColorStyle", () => {
  it("hands the Dimension's hue to CSS", () => {
    expect(dimensionColorStyle("groupCount")).toEqual({
      "--dimension-hue": dimensionHue("groupCount"),
    });
  });
});
