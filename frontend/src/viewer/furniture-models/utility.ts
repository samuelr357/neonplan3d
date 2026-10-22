// Laundry and compact energy equipment. New procedural models in this family belong here and are
// registered once below; the central renderer no longer needs another switch branch.

import { C, EDGE_FAINT, EDGE_FURN, EDGE_GLOW, type FurnitureBuilder } from "../furniture-builder.ts";
import type { FurnitureModelRenderer, FurnitureScreenRenderer } from "./types.ts";

function ring(b: FurnitureBuilder, cx: number, cy: number, r: number, z: number, n = 20): void {
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    b.seg(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r, z, cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, z, EDGE_GLOW);
  }
}

function dishwasher(b: FurnitureBuilder, w: number, d: number, h: number): void {
  b.box(-w / 2, w / 2, 0.02, h - 0.04, -d / 2, d / 2 - 0.02, C.body, C.bodyTop, EDGE_FURN);
  b.box(-w / 2 + 0.02, w / 2 - 0.02, 0, 0.08, -d / 2 + 0.02, d / 2 - 0.06, C.dark);
  b.seg(-w / 2 + 0.08, h - 0.12, d / 2 - 0.008, w / 2 - 0.08, h - 0.12, d / 2 - 0.008, EDGE_GLOW);
  b.box(-w / 2, w / 2, h - 0.04, h, -d / 2, d / 2, C.whiteTop, C.whiteTop, EDGE_FURN);
}

function laundry(b: FurnitureBuilder, w: number, d: number, h: number, dryer: boolean): void {
  b.box(-w / 2, w / 2, 0, h, -d / 2, d / 2 - 0.02, C.white, C.whiteTop, EDGE_FURN);
  const z = d / 2 - 0.012;
  b.seg(-w / 2, h - 0.14, z, w / 2, h - 0.14, z, EDGE_FAINT);
  b.seg(w / 2 - 0.16, h - 0.07, z, w / 2 - 0.08, h - 0.07, z, EDGE_GLOW);
  const cy = (h - 0.14) / 2 + 0.04;
  const r = Math.min(w * 0.36, (h - 0.2) * 0.42);
  ring(b, 0, cy, r, z);
  if (!dryer) ring(b, 0, cy, r * 0.72, z);
}

function laundryTower(b: FurnitureBuilder, w: number, d: number, h: number): void {
  const gap = Math.min(0.035, h * 0.025);
  const unit = (h - gap) / 2;
  const z = d / 2 - 0.012;
  for (let k = 0; k < 2; k++) {
    const y0 = k * (unit + gap);
    b.box(-w / 2, w / 2, y0, y0 + unit, -d / 2, d / 2 - 0.02, C.white, C.whiteTop, EDGE_FURN);
    b.seg(-w / 2, y0 + unit - 0.14, z, w / 2, y0 + unit - 0.14, z, EDGE_FAINT);
    b.seg(w / 2 - 0.16, y0 + unit - 0.07, z, w / 2 - 0.08, y0 + unit - 0.07, z, EDGE_GLOW);
    const cy = y0 + (unit - 0.14) / 2 + 0.04;
    const r = Math.min(w * 0.34, (unit - 0.2) * 0.42);
    ring(b, 0, cy, r, z);
    if (k === 0) ring(b, 0, cy, r * 0.72, z + 0.002);
  }
  b.box(-w * 0.46, w * 0.46, unit, unit + gap, -d * 0.46, d * 0.46, C.dark, C.metal, EDGE_FAINT);
}

function balconySolar(b: FurnitureBuilder, w: number, d: number, h: number): void {
  const post = Math.min(0.045, w * 0.035);
  for (const x of [-w * 0.4, w * 0.4]) {
    b.box(x - post, x + post, 0, h * 0.88, -d * 0.32, -d * 0.23, C.metal, C.metal, EDGE_FURN);
    b.box(x - post, x + post, 0, h * 0.62, d * 0.23, d * 0.32, C.metal, C.metal, EDGE_FURN);
  }
  b.loft([-w / 2, w / 2, -d * 0.43, d * 0.43], [-w / 2, w / 2, -d * 0.38, d * 0.48], h * 0.88, h * 0.98, C.dark, C.glass, EDGE_GLOW);
  const y = h * 0.985;
  for (let i = 1; i < 6; i++) b.seg(-w / 2 + (w * i) / 6, y, -d * 0.37, -w / 2 + (w * i) / 6, y, d * 0.47, EDGE_FAINT);
  for (let i = 1; i < 3; i++) b.seg(-w / 2, y, -d * 0.37 + (d * 0.84 * i) / 3, w / 2, y, -d * 0.37 + (d * 0.84 * i) / 3, EDGE_FAINT);
  b.box(-w * 0.16, w * 0.16, h * 0.34, h * 0.48, d * 0.2, d * 0.34, C.body, C.bodyTop, EDGE_FURN);
  b.seg(-w * 0.1, h * 0.43, d * 0.345, w * 0.1, h * 0.43, d * 0.345, EDGE_GLOW);
}

export const UTILITY_FURNITURE_MODELS: Readonly<Record<string, FurnitureModelRenderer>> = {
  dishwasher: ({ b, w, d, h }) => (dishwasher(b, w, d, h), 0.5),
  washer: ({ b, w, d, h }) => (laundry(b, w, d, h, false), 0.5),
  dryer: ({ b, w, d, h }) => (laundry(b, w, d, h, true), 0.5),
  washer_dryer_tower: ({ b, w, d, h }) => (laundryTower(b, w, d, h), 0.5),
  balcony_solar: ({ b, w, d, h }) => (balconySolar(b, w, d, h), 0.5),
};

const laundryScreen: FurnitureScreenRenderer = (w, d, h) => {
  const cy = (h - 0.14) / 2 + 0.04;
  const r = Math.min(w * 0.36, (h - 0.2) * 0.42) * 0.8;
  return { x0: -r, x1: r, y0: cy - r, y1: cy + r, z: d / 2 - 0.004 };
};

export const UTILITY_FURNITURE_SCREENS: Readonly<Record<string, FurnitureScreenRenderer>> = {
  dishwasher: (w, d, h) => ({ x0: -w / 2 + 0.06, x1: w / 2 - 0.06, y0: h - 0.16, y1: h - 0.08, z: d / 2 - 0.004 }),
  washer: laundryScreen,
  dryer: laundryScreen,
  washer_dryer_tower: (w, d, h) => ({ x0: w * 0.22, x1: w * 0.39, y0: h * 0.91, y1: h * 0.96, z: d / 2 - 0.004 }),
  balcony_solar: (w, d, h) => ({ x0: -w * 0.1, x1: w * 0.1, y0: h * 0.4, y1: h * 0.46, z: d * 0.35 }),
};
