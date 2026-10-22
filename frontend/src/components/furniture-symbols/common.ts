// Shared SVG primitives for built-in top-view furniture symbols.

import { svg, type SVGTemplateResult } from "lit";
import type { FurnitureSymbol, FurnitureSymbolRenderer } from "./types.ts";

export type SymbolPart = SVGTemplateResult;
export const rect = (x0: number, z0: number, x1: number, z1: number, cls = "") => svg`<rect class=${cls} x=${Math.min(x0, x1)} y=${Math.min(z0, z1)} width=${Math.abs(x1 - x0)} height=${Math.abs(z1 - z0)} />`;
export const line = (x0: number, z0: number, x1: number, z1: number, cls = "") => svg`<line class=${cls} x1=${x0} y1=${z0} x2=${x1} y2=${z1} />`;
export const circle = (x: number, z: number, r: number, cls = "") => svg`<circle class=${cls} cx=${x} cy=${z} r=${r} />`;
export const ellipse = (x: number, z: number, rx: number, rz: number, cls = "") => svg`<ellipse class=${cls} cx=${x} cy=${z} rx=${rx} ry=${rz} />`;

export function fronts(w: number, d: number, n: number): FurnitureSymbol {
  const out: FurnitureSymbol = [];
  for (let i = 1; i < n; i++) {
    const x = -w / 2 + (w / n) * i;
    out.push(line(x, d / 2, x, d / 2 - Math.min(0.12, d * 0.3)));
  }
  return out;
}

export function seating(w: number, d: number, seats: number, arms: boolean): FurnitureSymbol {
  const back = Math.min(0.24, d * 0.28);
  const arm = arms ? Math.min(0.2, w * 0.12) : 0;
  const out: FurnitureSymbol = [rect(-w / 2, -d / 2, w / 2, -d / 2 + back, "fp3d-sym-fill")];
  if (arms) out.push(rect(-w / 2, -d / 2, -w / 2 + arm, d / 2, "fp3d-sym-fill"), rect(w / 2 - arm, -d / 2, w / 2, d / 2, "fp3d-sym-fill"));
  const inner = w - 2 * arm;
  for (let i = 1; i < seats; i++) {
    const x = -w / 2 + arm + (inner / seats) * i;
    out.push(line(x, -d / 2 + back, x, d / 2 - 0.02));
  }
  return out;
}

export function createSymbolRegistry(types: readonly string[], render: (type: string, w: number, d: number) => FurnitureSymbol): Readonly<Record<string, FurnitureSymbolRenderer>> {
  return Object.fromEntries(types.map((type) => [type, (w: number, d: number) => render(type, w, d)]));
}
