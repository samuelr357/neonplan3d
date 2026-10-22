// Distinct top-view symbols for feature pieces from the living-room catalog.

import { circle, createSymbolRegistry, line, rect, type SymbolPart as Part } from "./common.ts";
import type { FurnitureSymbol } from "./types.ts";

const TYPES = ["media_wall_tv", "piano_upright", "vase_pampas", "plant_monstera", "rug_round", "fireplace_wall_electric"] as const;

function renderSymbol(type: string, w: number, d: number): FurnitureSymbol {
  switch (type) {
    case "media_wall_tv":
      return [rect(-w / 2, -d / 2, w / 2, d / 2), rect(-w * 0.28, -d * 0.12, w * 0.28, d * 0.12, "fp3d-sym-fill"), line(-w * 0.36, d * 0.28, w * 0.36, d * 0.28)];
    case "piano_upright": {
      const out: Part[] = [rect(-w / 2, -d / 2, w / 2, d * 0.06, "fp3d-sym-fill"), rect(-w * 0.32, d * 0.16, w * 0.32, d / 2)];
      for (let i = 1; i < 8; i++) out.push(line(-w * 0.4 + (w * 0.8 * i) / 8, d * 0.02, -w * 0.4 + (w * 0.8 * i) / 8, d * 0.14));
      return out;
    }
    case "vase_pampas":
      return [circle(0, 0, Math.min(w, d) * 0.28, "fp3d-sym-fill"), ...Array.from({ length: 6 }, (_, i) => line(0, 0, Math.cos((i * Math.PI) / 3) * w * 0.42, Math.sin((i * Math.PI) / 3) * d * 0.42))];
    case "plant_monstera":
      return [circle(0, 0, Math.min(w, d) * 0.2, "fp3d-sym-fill"), ...Array.from({ length: 8 }, (_, i) => circle(Math.cos((i * Math.PI) / 4) * w * 0.28, Math.sin((i * Math.PI) / 4) * d * 0.28, Math.min(w, d) * 0.16))];
    case "rug_round":
      return [circle(0, 0, Math.min(w, d) * 0.48), circle(0, 0, Math.min(w, d) * 0.4, "fp3d-sym-fill")];
    case "fireplace_wall_electric":
      return [rect(-w / 2, -d / 2, w / 2, d / 2, "fp3d-sym-fill"), line(-w * 0.36, 0, w * 0.36, 0, "fp3d-sym-strong")];
    default:
      return [];
  }
}

export const LIVING_FURNITURE_SYMBOLS = createSymbolRegistry(TYPES, renderSymbol);
