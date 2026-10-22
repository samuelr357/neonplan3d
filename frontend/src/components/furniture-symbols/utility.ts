import type { FurnitureSymbol, FurnitureSymbolRenderer } from "./types.ts";
import { circle, line, rect } from "./common.ts";

const laundry = (w: number, d: number): FurnitureSymbol => [circle(0, 0.05, Math.min(w, d) * 0.3), line(-w / 2, -d / 2 + 0.1, w / 2, -d / 2 + 0.1)];

const balconySolar = (w: number, d: number): FurnitureSymbol => {
  const out: FurnitureSymbol = [rect(-w / 2, -d * 0.34, w / 2, d * 0.34, "fp3d-sym-fill")];
  for (let i = 1; i < 6; i++) out.push(line(-w / 2 + (w * i) / 6, -d * 0.34, -w / 2 + (w * i) / 6, d * 0.34));
  for (let i = 1; i < 3; i++) out.push(line(-w / 2, -d * 0.34 + (d * 0.68 * i) / 3, w / 2, -d * 0.34 + (d * 0.68 * i) / 3));
  return out;
};

export const UTILITY_FURNITURE_SYMBOLS: Readonly<Record<string, FurnitureSymbolRenderer>> = {
  dishwasher: (w, d) => [line(-w / 2 + 0.08, d / 2 - 0.05, w / 2 - 0.08, d / 2 - 0.05, "fp3d-sym-strong")],
  washer: laundry,
  dryer: laundry,
  washer_dryer_tower: (w, d) => [rect(-w / 2, -d / 2, w / 2, d / 2, "fp3d-sym-fill"), circle(0, d * 0.08, Math.min(w, d) * 0.27), line(-w / 2, -d * 0.27, w / 2, -d * 0.27, "fp3d-sym-strong")],
  balcony_solar: balconySolar,
};
