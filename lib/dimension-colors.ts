import type { CSSProperties } from "react";
import { type Dimension, dimensionNames } from "./dimensions";

/** Which set of colors marks the Dimensions. */
export enum DimensionPalette {
  /** Muted hues spread evenly around the color wheel, derived per Dimension. */
  Hue = "hue",
  /** Hand-picked colors, one per musical key. */
  Key = "key",
}

/** Shifts the whole palette; the first Dimension starts here. */
const START_HUE = 165;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/**
 * The wheel is cut into one evenly spaced slot per Dimension, so no two hues
 * sit closer than 360/n. Successive Dimensions then skip ahead by roughly the
 * golden ratio's share of the slots — neighbours in the schema's order, and so
 * in the sidebar, land far apart. The skip must share no factor with the slot
 * count, or the walk would revisit slots before filling them all.
 */
const slotCount = dimensionNames.length;
let slotStep = Math.round(slotCount * 0.382);
while (gcd(slotStep, slotCount) !== 1) slotStep++;

/**
 * The Hue palette: the hue that marks each Dimension's Tags wherever they
 * appear. Only the hue is per Dimension; lightness and chroma are fixed in
 * `dimensionColor`, and how far tints are muted is set in `globals.css`.
 */
// The cast restores the key type `Object.fromEntries` loses; every Dimension
// is present because the entries were read from `dimensionNames`.
const hues = Object.fromEntries(
  dimensionNames.map((dimension, i) => [
    dimension,
    Math.round(START_HUE + (((i * slotStep) % slotCount) * 360) / slotCount) %
      360,
  ]),
) as Record<Dimension, number>;

/**
 * The Key palette: each Dimension carries the color of one musical key,
 * picked so neighbours in the schema's order land in different color
 * families. C major (near-white) and the near-black keys — C♯ minor, D♭ major,
 * E♭ minor, A♭ minor, B♭ minor — are left out: muted, they all read as grey.
 */
const keyColors: Record<Dimension, string> = {
  measurementScale: "#3a4a6b", // C minor
  independentVariableScale: "#c8860a", // B♭ major
  researchQuestion: "#8db87a", // E minor
  populationVariance: "#7a1428", // B major
  sampleDependency: "#7b6fa8", // A minor
  groupCount: "#5aabdb", // A major
  testFamily: "#e85d04", // F♯ major
  rankTies: "#6b7140", // G minor
  varianceHomogeneity: "#5c2d82", // E♭ major
  differenceRegarding: "#e8b800", // E major
  categoryCount: "#4a6a80", // B minor
  marginalProbability: "#cc2b2b", // D major
  equivalenceEstablished: "#5a9e6f", // F major
  correlationHypothesis: "#3d2b1f", // F minor
  factorCount: "#8890a6", // D minor
  dataSeriesCount: "#4a7c3f", // G major
  expectedCellFrequency: "#3c3448", // F♯ minor
  normalApproximationValid: "#a8acb4", // A♭ major
};

/** The hue of a Dimension's color, in degrees. */
export const dimensionHue = (dimension: Dimension): number => hues[dimension];

/** A Dimension's base color in the given palette, as a CSS color. */
const dimensionColor = (
  dimension: Dimension,
  palette: DimensionPalette,
): string => {
  switch (palette) {
    case DimensionPalette.Hue:
      return `oklch(0.68 0.1 ${dimensionHue(dimension)})`;
    case DimensionPalette.Key:
      return keyColors[dimension];
  }
};

const defaultPalette: DimensionPalette = DimensionPalette.Key;

/**
 * Inline style that sets `--dimension-color`, the base color the
 * `dimension-*` utilities in `globals.css` derive their tints from.
 */
export const dimensionColorStyle = (
  dimension: Dimension,
  palette: DimensionPalette = defaultPalette,
): CSSProperties =>
  // `CSSProperties` has no slot for custom properties, hence the cast.
  ({
    "--dimension-color": dimensionColor(dimension, palette),
  }) as CSSProperties;
