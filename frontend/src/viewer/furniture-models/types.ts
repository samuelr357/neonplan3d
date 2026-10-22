import type { FurnitureBuilder } from "../furniture-builder.ts";

export interface FurnitureModelContext {
  b: FurnitureBuilder;
  w: number;
  d: number;
  h: number;
  base: number;
  variant: string | null;
}

/** False means no floor shadow; a number is the requested shadow strength. */
export type FurnitureModelRenderer = (context: FurnitureModelContext) => number | false;

export interface FurnitureScreenRect {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  z: number;
}

export type FurnitureScreenRenderer = (w: number, d: number, h: number) => FurnitureScreenRect | null;
