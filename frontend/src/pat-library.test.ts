import assert from "node:assert/strict";
import { test } from "node:test";
import { FURNITURE_TYPES as PAT_IDS } from "./furniture/metadata.ts";
import { FURNITURE_TYPES, FURNITURE_SIZE } from "./model.ts";
import { basicTypes } from "./library-index.ts";
import { BUILTIN_FURNITURE_MODELS } from "./viewer/furniture-models/index.ts";
test("MIT furniture library registered", () => {
  assert.ok(PAT_IDS.length >= 450);
  const enabled = new Set(basicTypes());
  for (const type of PAT_IDS) {
    assert.ok(FURNITURE_TYPES.includes(type));
    assert.ok(FURNITURE_SIZE[type]);
    if (Object.values(BUILTIN_FURNITURE_MODELS).length && enabled.has(type))
      assert.ok(FURNITURE_SIZE[type].every((v) => v > 0));
  }
  for (const type of ["dog_bed", "fitness_treadmill","laser_printer"])
    assert.ok(BUILTIN_FURNITURE_MODELS[type]);
});
