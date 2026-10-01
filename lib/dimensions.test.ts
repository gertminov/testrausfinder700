import { describe, expect, it } from "vitest";
import {
  sampleSizeFromSearchParams,
  selectionFromSearchParams,
  selectionToSearchParams,
  Selection,
} from "./dimensions";

describe("selectionFromSearchParams", () => {
  it("keeps valid Criteria", () => {
    expect(
      selectionFromSearchParams({
        measurementScale: "interval",
        groupCount: "two",
      }),
    ).toEqual({ measurementScale: "interval", groupCount: "two" });
  });

  it("drops unknown Dimensions and values the Dimension doesn't admit", () => {
    expect(
      selectionFromSearchParams({
        nope: "interval",
        measurementScale: "huge",
        groupCount: "",
      }),
    ).toEqual({});
  });

  it("round-trips through selectionToSearchParams", () => {
    const selection = {
      sampleDependency: "dependent",
      measurementScale: "ordinal",
    };
    const params = Object.fromEntries(selectionToSearchParams(selection));
    expect(selectionFromSearchParams(params)).toEqual(selection);
  });
});

describe("sampleSizeFromSearchParams", () => {
  it("reads a positive whole number", () => {
    expect(sampleSizeFromSearchParams({ sampleSize: "30" })).toBe(30);
  });

  it("drops missing, zero, negative, fractional and non-numeric values", () => {
    for (const raw of ["0", "-5", "2.5", "abc", ""]) {
      expect(sampleSizeFromSearchParams({ sampleSize: raw })).toBeUndefined();
    }
    expect(sampleSizeFromSearchParams({})).toBeUndefined();
  });
});
