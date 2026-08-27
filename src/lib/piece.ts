import type { CatalogItem, CoreType, GearPiece, Loadout, Slot } from "./types";
import { ALL_TALENTS } from "./data/talents";
import { catalogById } from "./data/catalog";
import {
  defaultAttributes,
  defaultMod,
  gearSetAttribute,
  hasGearMod,
  SLOTS,
} from "./data/attributes";
import { GEAR_SETS, gearSetCore } from "./data/gear-sets";

export function createPiece(slot: Slot, sourceId: string, core?: CoreType): GearPiece {
  const source = catalogById(sourceId);
  const resolvedCore = resolveCore(slot, source, core);
  const isGearSet = source?.kind === "gear-set";
  const attributes = isGearSet
    ? [gearSetAttribute(resolvedCore)]
    : defaultAttributes(resolvedCore);
  const uniqueTalent = source?.uniqueTalent;
  const talentId = uniqueTalent
    ? ALL_TALENTS.find((talent) => talent.name === uniqueTalent.name)?.id
    : defaultTalent(slot, source);

  const extraCores = extraCoresFor(slot, source);

  return {
    slot,
    sourceId,
    core: resolvedCore,
    extraCores: extraCores.length ? extraCores : undefined,
    attributes,
    talentId,
    uniqueTalent,
    mods: hasGearMod(slot) ? [defaultMod(resolvedCore)] : [],
  };
}

function resolveCore(slot: Slot, source: CatalogItem | undefined, core?: CoreType): CoreType {
  if (source?.gearSetId) {
    const set = GEAR_SETS.find((item) => item.id === source.gearSetId);
    if (set) return gearSetCore(set, slot);
  }
  if (source?.lockedCore) return source.lockedCore;
  if (source?.brandId === "brazos" && slot === "holster" && source.id === "picaros-holster") {
    return "yellow";
  }
  return core ?? "red";
}

function extraCoresFor(slot: Slot, source: CatalogItem | undefined): CoreType[] {
  if (source?.extraCores) return [...source.extraCores];
  if (source?.gearSetId === "core-strength" && slot === "backpack") {
    return ["blue", "yellow"];
  }
  return [];
}

function defaultTalent(slot: Slot, source: CatalogItem | undefined): string | undefined {
  if (slot !== "chest" && slot !== "backpack") return undefined;
  if (source?.kind === "gear-set" || source?.kind === "exotic") return undefined;
  if (source?.uniqueTalent) return undefined;
  return slot === "chest" ? "obliterate" : "vigilance";
}

export function pieceLabel(piece: GearPiece): string {
  const source = catalogById(piece.sourceId);
  return source?.name ?? "Unknown piece";
}

/** Equip all 6 slots with the set, each with that slot's in-game core. */
export function applyGearSet(loadout: Loadout, sourceId: string): Loadout {
  const source = catalogById(sourceId);
  if (source?.kind !== "gear-set") return loadout;
  return {
    ...loadout,
    gear: Object.fromEntries(SLOTS.map((slot) => [slot, createPiece(slot, sourceId)])) as Loadout["gear"],
  };
}
