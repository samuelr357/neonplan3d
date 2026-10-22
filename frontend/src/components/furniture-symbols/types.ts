import type { SVGTemplateResult } from "lit";

export type FurnitureSymbol = SVGTemplateResult[];
export type FurnitureSymbolRenderer = (w: number, d: number) => FurnitureSymbol;

