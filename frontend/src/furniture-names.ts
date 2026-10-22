import { FURNITURE_TYPES as PAT_IDS } from "./furniture/metadata.ts";
// Display names of furniture types, built-in or from packs (kept out of packs.ts, which the 3D
// bundle uses without the UI strings).

import { translate } from "./i18n.ts";
import { isPackType, packItem, packItemName } from "./packs.ts";
import type { HomeAssistant } from "./types.ts";

/** Display name of any furniture type; furniture of a removed pack says so. */
export function furnitureName(hass: HomeAssistant | undefined, type: string): string {
  if (!isPackType(type)) {
    const key = "furn_" + type;
    const label = translate(hass, key as Parameters<typeof translate>[1]);
    if (label === key && (PAT_IDS as readonly string[]).includes(type)) {
      return type.replaceAll("_", " ").replace(/\b\w/g, (s) => s.toUpperCase());
    }
    return label;
  }
  const item = packItem(type);
  return item ? packItemName(item, hass?.language ?? navigator.language) : translate(hass, "pack_missing_item");
}
