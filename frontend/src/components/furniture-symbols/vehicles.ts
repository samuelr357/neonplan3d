import { createSymbolRegistry, ellipse, line, rect } from "./common.ts";
import type { FurnitureSymbol } from "./types.ts";
const TYPES=["bicycle_city","bicycle_cargo","scooter","motorcycle_touring","car_sedan","car_hatchback","car_suv","car_pickup","car_van","car_wagon","car_compact","car_electric","car_minibus"] as const;
function symbol(type:string,w:number,d:number):FurnitureSymbol {
  if(type.startsWith("bicycle_")||type==="scooter"||type==="motorcycle_touring") return [ellipse(0,-d*.34,w*.28,d*.12),ellipse(0,d*.34,w*.28,d*.12),line(0,-d*.28,0,d*.28,"fp3d-sym-strong"),rect(-w*.3,-d*.12,w*.3,d*.12,"fp3d-sym-fill")];
  return [rect(-w/2,-d/2,w/2,d/2,"fp3d-sym-fill"),ellipse(-w*.43,-d*.3,w*.09,d*.12),ellipse(w*.43,-d*.3,w*.09,d*.12),ellipse(-w*.43,d*.3,w*.09,d*.12),ellipse(w*.43,d*.3,w*.09,d*.12),line(-w*.35,d*.18,w*.35,d*.18,"fp3d-sym-strong")];
}
export const VEHICLE_FURNITURE_SYMBOLS=createSymbolRegistry(TYPES,symbol);
