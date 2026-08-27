import type { CatalogItem, CoreType, GearPiece, Loadout, Slot } from "./types";
import { ALL_TALENTS } from "./data/talents";
import { catalogById } from "./data/catalog";
import {
  canBePrototype,
  defaultAttributes,
  defaultMods,
  EXPERTISE_MAX,
  gearModCount,
  gearSetAttribute,
  scaleAttributesForPrototype,
  SLOTS,
} from "./data/attributes";
import { BRANDS } from "./data/brands";
import { GEAR_SETS, gearSetCore } from "./data/gear-sets";
import { clampAugmentLevel, defaultAugmentId } from "./data/augments";

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
    mods: defaultMods(gearModCount(slot, source), resolvedCore),
    expertise: 0,
    prototype: false,
  };
}

/** Toggle Prototype quality. Exotics are never allowed. */
export function setPiecePrototype(piece: GearPiece, enabled: boolean): GearPiece {
  const source = catalogById(piece.sourceId);
  if (!canBePrototype(source?.kind)) {
    const { augmentId: _a, augmentLevel: _l, ...rest } = piece;
    return { ...rest, prototype: false };
  }
  if (!enabled) {
    const { augmentId: _a, augmentLevel: _l, ...rest } = piece;
    return {
      ...rest,
      prototype: false,
      attributes: scaleAttributesForPrototype(piece.attributes, false),
    };
  }
  return {
    ...piece,
    prototype: true,
    expertise: EXPERTISE_MAX,
    attributes: scaleAttributesForPrototype(piece.attributes, true),
    augmentId: piece.augmentId ?? defaultAugmentId(),
    augmentLevel: clampAugmentLevel(piece.augmentLevel ?? 1),
  };
}

/** In-game locked core — only gear sets, exotics, and rare named locks (e.g. Claws Out). */
export function lockedCoreFor(slot: Slot, source: CatalogItem | undefined): CoreType | undefined {
  if (!source) return undefined;
  if (source.kind === "gear-set" || source.gearSetId) {
    const set = GEAR_SETS.find((item) => item.id === source.gearSetId);
    if (set) return gearSetCore(set, slot);
  }
  if (source.kind === "exotic") return source.lockedCore;
  // Rare named pieces with an explicit locked core in catalog data.
  if (source.kind === "named" && source.lockedCore) return source.lockedCore;
  // Brand high-end / normal named: cores are recalibratable in live TD2.
  return undefined;
}

export function isCoreLocked(slot: Slot, source: CatalogItem | undefined): boolean {
  return lockedCoreFor(slot, source) !== undefined;
}

/** Default / native core when the piece is first equipped (not a lock). */
export function nativeCoreFor(slot: Slot, source: CatalogItem | undefined): CoreType {
  const locked = lockedCoreFor(slot, source);
  if (locked) return locked;
  if (source?.lockedCore) return source.lockedCore;
  if (source?.brandId) {
    const brand = BRANDS.find((item) => item.id === source.brandId);
    if (brand) return brand.core;
  }
  return "red";
}

function resolveCore(slot: Slot, source: CatalogItem | undefined, core?: CoreType): CoreType {
  return lockedCoreFor(slot, source) ?? core ?? nativeCoreFor(slot, source);
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
