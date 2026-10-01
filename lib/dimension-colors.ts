import type { CSSProperties } from "react";
import { type Dimension, dimensionNames } from "./dimensions";

/**
 * Successive Dimensions step around the wheel by the golden angle rather than
 * by 360/n: neighbours in the schema's order — and so in the sidebar — land far
 * apart, however many Dimensions there are.
 */
const GOLDEN_ANGLE = 137.508;

/** Shifts the whole palette; the first Dimension starts here. */
const START_HUE = 165;

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
    Math.round((START_HUE + i * GOLDEN_ANGLE) % 360),
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
