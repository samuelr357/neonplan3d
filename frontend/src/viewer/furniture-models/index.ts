import { ARCHITECTURE_OUTDOOR_FURNITURE_MODELS } from "./architecture-outdoor.ts";
import { ARCHITECTURE_FURNITURE_MODELS, ARCHITECTURE_FURNITURE_SCREENS } from "./architecture.ts";
import { BEDROOM_FURNITURE_MODELS, BEDROOM_FURNITURE_SCREENS } from "./bedroom.ts";
import { BATHROOM_FURNITURE_MODELS, BATHROOM_FURNITURE_SCREENS } from "./bathroom.ts";
import { CLIMATE_FURNITURE_MODELS } from "./climate.ts";
import { CINEMA_FURNITURE_MODELS, CINEMA_FURNITURE_SCREENS } from "./cinema.ts";
import { ENERGY_FURNITURE_MODELS } from "./energy.ts";
import { EVERYDAY_FURNITURE_MODELS, EVERYDAY_FURNITURE_SCREENS } from "./everyday.ts";
import { FITNESS_FURNITURE_MODELS, FITNESS_FURNITURE_SCREENS } from "./fitness.ts";
import { GARDEN_FURNITURE_MODELS } from "./garden.ts";
import { GARAGE_FURNITURE_MODELS } from "./garage.ts";
import { KITCHEN_BATH_FURNITURE_MODELS } from "./kitchen-bath.ts";
import { KIDS_FURNITURE_MODELS, KIDS_FURNITURE_SCREENS } from "./kids.ts";
import { LIVING_FURNITURE_MODELS, LIVING_FURNITURE_SCREENS } from "./living.ts";
import { MISC_FURNITURE_MODELS } from "./misc.ts";
import { OFFICE_FURNITURE_MODELS, OFFICE_FURNITURE_SCREENS } from "./office.ts";
import { PET_FURNITURE_MODELS } from "./pets.ts";
import { SMART_HOME_FURNITURE_MODELS } from "./smart-home.ts";
import { STAIR_FURNITURE_MODELS } from "./stairs.ts";
import { UTILITY_FURNITURE_MODELS, UTILITY_FURNITURE_SCREENS } from "./utility.ts";
import { VEHICLE_FURNITURE_MODELS } from "./vehicles.ts";
import type { FurnitureModelContext, FurnitureModelRenderer, FurnitureScreenRect, FurnitureScreenRenderer } from "./types.ts";

/** Built-in renderers split by functional family. Add new families to this one composition point. */
const BUILTIN_FURNITURE_MODELS: Readonly<Record<string, FurnitureModelRenderer>> = {
  ...EVERYDAY_FURNITURE_MODELS,
  ...FITNESS_FURNITURE_MODELS,
  ...BEDROOM_FURNITURE_MODELS,
  ...LIVING_FURNITURE_MODELS,
  ...KITCHEN_BATH_FURNITURE_MODELS,
  ...KIDS_FURNITURE_MODELS,
  ...BATHROOM_FURNITURE_MODELS,
  ...ARCHITECTURE_OUTDOOR_FURNITURE_MODELS,
  ...ARCHITECTURE_FURNITURE_MODELS,
  ...GARDEN_FURNITURE_MODELS,
  ...GARAGE_FURNITURE_MODELS,
  ...CLIMATE_FURNITURE_MODELS,
  ...CINEMA_FURNITURE_MODELS,
  ...SMART_HOME_FURNITURE_MODELS,
  ...STAIR_FURNITURE_MODELS,
  ...ENERGY_FURNITURE_MODELS,
  ...MISC_FURNITURE_MODELS,
  ...OFFICE_FURNITURE_MODELS,
  ...PET_FURNITURE_MODELS,
  ...UTILITY_FURNITURE_MODELS,
  ...VEHICLE_FURNITURE_MODELS,
};

const BUILTIN_FURNITURE_SCREENS: Readonly<Record<string, FurnitureScreenRenderer>> = {
  ...ARCHITECTURE_FURNITURE_SCREENS,
  ...BATHROOM_FURNITURE_SCREENS,
  ...BEDROOM_FURNITURE_SCREENS,
  ...EVERYDAY_FURNITURE_SCREENS,
  ...FITNESS_FURNITURE_SCREENS,
  ...CINEMA_FURNITURE_SCREENS,
  ...KIDS_FURNITURE_SCREENS,
  ...LIVING_FURNITURE_SCREENS,
  ...OFFICE_FURNITURE_SCREENS,
  ...UTILITY_FURNITURE_SCREENS,
};

/** Null means the legacy renderer owns this type; otherwise the result says whether to add a shadow. */
export function renderRegisteredFurniture(type: string, context: FurnitureModelContext): number | false | null {
  const renderer = BUILTIN_FURNITURE_MODELS[type];
  return renderer ? renderer(context) : null;
}

/** Undefined means the legacy screen registry owns the type; null means this model has no screen. */
export function registeredFurnitureScreen(type: string, w: number, d: number, h: number): FurnitureScreenRect | null | undefined {
  const renderer = BUILTIN_FURNITURE_SCREENS[type];
  return renderer ? renderer(w, d, h) : undefined;
}

export { BUILTIN_FURNITURE_MODELS, BUILTIN_FURNITURE_SCREENS };
export type { FurnitureModelContext, FurnitureModelRenderer, FurnitureScreenRect, FurnitureScreenRenderer } from "./types.ts";
