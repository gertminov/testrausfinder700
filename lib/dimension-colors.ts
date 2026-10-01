import type { CSSProperties } from "react";
import { type Dimension, dimensionNames } from "./dimensions";

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
 * The hue that marks each Dimension's Tags wherever they appear. Only the hue
 * is per Dimension; lightness and chroma — how muted the palette is — are set
 * once in `globals.css`.
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

/** The hue of a Dimension's color, in degrees. */
export const dimensionHue = (dimension: Dimension): number => hues[dimension];

/**
 * Inline style that sets `--dimension-hue`, which the `dimension-*` utilities
 * in `globals.css` read.
 */
export const dimensionColorStyle = (dimension: Dimension): CSSProperties =>
  // `CSSProperties` has no slot for custom properties, hence the cast.
  ({ "--dimension-hue": dimensionHue(dimension) }) as CSSProperties;
