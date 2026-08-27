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
import { BRANDS } from "./data/brands";
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

  const extras = extraCoresFor(slot, source, resolvedCore);

  return {
    slot,
    sourceId,
    core: resolvedCore,
    extraCores: extras.length ? extras : undefined,
    attributes,
    talentId,
    uniqueTalent,
    mods: hasGearMod(slot) ? [defaultMod(resolvedCore)] : [],
  };
}

/** In-game locked core for a catalog item in a given slot, if any. */
export function lockedCoreFor(slot: Slot, source: CatalogItem | undefined): CoreType | undefined {
  if (!source) return undefined;
  if (source.gearSetId) {
    const set = GEAR_SETS.find((item) => item.id === source.gearSetId);
    if (set) return gearSetCore(set, slot);
  }
  if (source.lockedCore) return source.lockedCore;
  if (source.brandId) {
    const brand = BRANDS.find((item) => item.id === source.brandId);
    if (brand) return brand.core;
  }
  return undefined;
}

export function isCoreLocked(slot: Slot, source: CatalogItem | undefined): boolean {
  return lockedCoreFor(slot, source) !== undefined;
}

function resolveCore(slot: Slot, source: CatalogItem | undefined, core?: CoreType): CoreType {
  return lockedCoreFor(slot, source) ?? core ?? "red";
}

function extraCoresFor(
  slot: Slot,
  source: CatalogItem | undefined,
  primary: CoreType,
): CoreType[] {
  let extras: CoreType[] = [];
  if (source?.extraCores) extras = [...source.extraCores];
  else if (source?.gearSetId === "core-strength" && slot === "backpack") {
    extras = ["blue", "yellow"];
  }
  // Bonus cores only — never duplicate the primary core.
  return extras.filter((core) => core !== primary);
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
