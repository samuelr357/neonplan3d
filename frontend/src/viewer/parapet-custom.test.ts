import assert from "node:assert/strict";
import { test } from "node:test";
import { emptyBuilding, newFloor, type RoofSection } from "../model.ts";
import { buildRoof } from "./roof.ts";

const section: RoofSection = {
  id: "facade", x0: 0, z0: 0, x1: 3, z1: 3,
  shape: "parapet", axis: "x", eave_a: 3, eave_b: 3,
  pitch_a: 5, pitch_b: 5, base: 3, overhang: 0.6, parapet_height: 1,
  points: [[0, 0], [3, 0], [3, 3], [0, 3]],
};

test("editable platibanda has 60cm projection and 1m vertical band", () => {
  const b = emptyBuilding();
  const floor = newFloor("ground", "Térreo", 0);
  floor.height = 3;
  floor.rooms.push({
    id: "house", name: "Casa", area_id: null, floor_material: "tiles",
    points: [[0, 0], [3, 0], [3, 3], [0, 3]],
  });
  b.floors = [floor];
  b.settings.roof = { type: "custom", pitch: 5, overhang: 0.6, sections: [section] };
  const p = buildRoof(b)[0].solid.p;
  const xs = p.filter((_, i) => i % 3 === 0);
  const zs = p.filter((_, i) => i % 3 === 2);
  const ys = p.filter((_, i) => i % 3 === 1);
  assert.ok(Math.min(...xs) < -0.59 && Math.max(...xs) > 3.59);
  assert.ok(Math.min(...zs) < -0.59 && Math.max(...zs) > 3.59);
  assert.ok(Math.abs(Math.max(...ys) - 4.25) < 0.01);
});

test("older parapets without custom band height retain previous 40cm behavior", () => {
  const b = emptyBuilding();
  const floor = newFloor("ground", "Térreo", 0);
  floor.height = 3;
  floor.rooms.push({
    id: "house", name: "Casa", area_id: null, floor_material: "tiles",
    points: [[0, 0], [3, 0], [3, 3], [0, 3]],
  });
  b.floors = [floor];
  const old = { ...section, parapet_height: null };
  b.settings.roof = { type: "custom", pitch: 5, overhang: 0.6, sections: [old] };
  const p = buildRoof(b)[0].solid.p;
  const xs = p.filter((_, i) => i % 3 === 0);
  const ys = p.filter((_, i) => i % 3 === 1);
  assert.ok(Math.min(...xs) >= -0.01 && Math.max(...xs) <= 3.01);
  assert.ok(Math.abs(Math.max(...ys) - 3.65) < 0.01);
});
