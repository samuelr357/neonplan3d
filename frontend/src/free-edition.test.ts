import assert from "node:assert/strict";
import { test } from "node:test";
import { ELECTRIC_FURNITURE, FURNITURE_GROUPS, FURNITURE_SIZE, FURNITURE_TYPES } from "./model.ts";
import { basicTypes } from "./library-index.ts";
import { FEATURES, hasFeature } from "./features.ts";

const newItems = [
  "modem_router",
  "nas_server",
  "network_cabinet",
  "printer_3d_open",
  "printer_3d_enclosed",
  "filament_shelf_wall",
] as const;

test("new original low-poly items are complete and visible to the editor", () => {
  const visible = new Set(basicTypes());
  const grouped = new Set(Object.values(FURNITURE_GROUPS).flat());
  for (const id of newItems) {
    assert.ok(FURNITURE_TYPES.includes(id), `type missing: ${id}`);
    assert.ok(visible.has(id), `library index missing: ${id}`);
    assert.ok(grouped.has(id), `library group missing: ${id}`);
    assert.equal(FURNITURE_SIZE[id].length, 3);
    assert.ok(FURNITURE_SIZE[id].every((v) => v > 0));
  }
  for (const id of newItems.filter((v) => v !== "filament_shelf_wall")) {
    assert.ok(ELECTRIC_FURNITURE.has(id));
  }
});

test("MIT-bundled capabilities are enabled but separate proprietary content is not forged", () => {
  for (const feature of FEATURES) assert.ok(hasFeature(feature, []));
  assert.equal(hasFeature("fridge_smart", []), false);
  assert.equal(hasFeature("fun_pets", []), false);
  assert.equal(hasFeature("fun_halloween", []), false);
});
