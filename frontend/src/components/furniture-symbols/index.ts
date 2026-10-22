import { ARCHITECTURE_OUTDOOR_FURNITURE_SYMBOLS } from "./architecture-outdoor.ts";
import { ARCHITECTURE_FURNITURE_SYMBOLS } from "./architecture.ts";
import { BEDROOM_FURNITURE_SYMBOLS } from "./bedroom.ts";
import { BATHROOM_FURNITURE_SYMBOLS } from "./bathroom.ts";
import { CLIMATE_FURNITURE_SYMBOLS } from "./climate.ts";
import { CINEMA_FURNITURE_SYMBOLS } from "./cinema.ts";
import { EVERYDAY_FURNITURE_SYMBOLS } from "./everyday.ts";
import { FITNESS_FURNITURE_SYMBOLS } from "./fitness.ts";
import { GARDEN_FURNITURE_SYMBOLS } from "./garden.ts";
import { GARAGE_FURNITURE_SYMBOLS } from "./garage.ts";
import { KITCHEN_BATH_FURNITURE_SYMBOLS } from "./kitchen-bath.ts";
import { KIDS_FURNITURE_SYMBOLS } from "./kids.ts";
import { LIGHTING_FURNITURE_SYMBOLS } from "./lighting.ts";
import { OFFICE_FURNITURE_SYMBOLS } from "./office.ts";
import { PET_FURNITURE_SYMBOLS } from "./pets.ts";
import { LIVING_FURNITURE_SYMBOLS } from "./living.ts";
import { SMART_HOME_FURNITURE_SYMBOLS } from "./smart-home.ts";
import { STAIR_FURNITURE_SYMBOLS } from "./stairs.ts";
import { UTILITY_FURNITURE_SYMBOLS } from "./utility.ts";
import { VEHICLE_FURNITURE_SYMBOLS } from "./vehicles.ts";
import type { FurnitureSymbol, FurnitureSymbolRenderer } from "./types.ts";

const BUILTIN_FURNITURE_SYMBOLS: Readonly<Record<string, FurnitureSymbolRenderer>> = {
  ...EVERYDAY_FURNITURE_SYMBOLS,
  ...FITNESS_FURNITURE_SYMBOLS,
  ...BEDROOM_FURNITURE_SYMBOLS,
  ...LIVING_FURNITURE_SYMBOLS,
  ...KITCHEN_BATH_FURNITURE_SYMBOLS,
  ...KIDS_FURNITURE_SYMBOLS,
  ...BATHROOM_FURNITURE_SYMBOLS,
  ...ARCHITECTURE_OUTDOOR_FURNITURE_SYMBOLS,
  ...ARCHITECTURE_FURNITURE_SYMBOLS,
  ...GARDEN_FURNITURE_SYMBOLS,
  ...GARAGE_FURNITURE_SYMBOLS,
  ...CLIMATE_FURNITURE_SYMBOLS,
  ...CINEMA_FURNITURE_SYMBOLS,
  ...SMART_HOME_FURNITURE_SYMBOLS,
  ...STAIR_FURNITURE_SYMBOLS,
  ...LIGHTING_FURNITURE_SYMBOLS,
  ...OFFICE_FURNITURE_SYMBOLS,
  ...PET_FURNITURE_SYMBOLS,
  ...UTILITY_FURNITURE_SYMBOLS,
  ...VEHICLE_FURNITURE_SYMBOLS,
};

export function registeredFurnitureSymbol(type: string, w: number, d: number): FurnitureSymbol | null {
  const renderer = BUILTIN_FURNITURE_SYMBOLS[type];
  return renderer ? renderer(w, d) : null;
}

export { BUILTIN_FURNITURE_SYMBOLS };
export type { FurnitureSymbol, FurnitureSymbolRenderer } from "./types.ts";
