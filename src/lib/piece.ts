import type {
  CatalogItem,
  CoreType,
  EquippedWeapon,
  GearPiece,
  Loadout,
  Slot,
  WeaponDef,
} from "./types";
import { ALL_TALENTS } from "./data/talents";
import { catalogById } from "./data/catalog";
import {
  canBePrototype,
  canWeaponBePrototype,
  defaultMods,
  defaultPieceAttributes,
  EXPERTISE_MAX,
  gearModCount,
  scaleAttributesForPrototype,
  SLOTS,
} from "./data/attributes";
import { clampAugmentLevel, defaultAugmentId } from "./data/augments";
import { resolveCore, packageExtraCores } from "./data/core-lock";
import { BRANDS } from "./data/brands";

export {
  isCoreLocked,
  lockedCoreFor,
  nativeCoreFor,
  coreLockHint,
  packageExtraCores,
} from "./data/core-lock";

export function createPiece(slot: Slot, sourceId: string, core?: CoreType): GearPiece {
  const source = catalogById(sourceId);
  const resolvedCore = resolveCore(slot, source, core);
  const attributes = defaultPieceAttributes(resolvedCore, source);
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

/** Toggle Prototype on a non-exotic weapon (Augment + Expertise 30). */
export function setWeaponPrototype(
  equipped: EquippedWeapon,
  quality: WeaponDef["quality"],
  enabled: boolean,
): EquippedWeapon {
  if (!canWeaponBePrototype(quality) || !enabled) {
    const { augmentId: _a, augmentLevel: _l, ...rest } = equipped;
    return { ...rest, prototype: false };
  }
  return {
    ...equipped,
    prototype: true,
    expertise: EXPERTISE_MAX,
    augmentId: equipped.augmentId ?? defaultAugmentId(),
    augmentLevel: clampAugmentLevel(equipped.augmentLevel ?? 1),
  };
}

function extraCoresFor(
  slot: Slot,
  source: CatalogItem | undefined,
  _primary: CoreType,
): CoreType[] {
  // Keep extras even if they match the primary (Picaro's can be double red).
  return packageExtraCores(slot, source);
}

function defaultTalent(slot: Slot, source: CatalogItem | undefined): string | undefined {
  if (slot !== "chest" && slot !== "backpack") return undefined;
  if (source?.kind === "gear-set" || source?.kind === "exotic") return undefined;
  if (source?.uniqueTalent) return undefined;
  return slot === "chest" ? "obliterate" : "vigilance";
}

export function pieceLabel(piece: GearPiece): string {
  const source = catalogById(piece.sourceId);
  if (!source) return "Unknown piece";
  return catalogItemLabel(source);
}

/** Named pieces show "Name — Brand" so the affiliation is obvious in lists. */
export function catalogItemLabel(source: CatalogItem): string {
  if (source.kind === "named" && source.brandId) {
    const brand = BRANDS.find((item) => item.id === source.brandId);
    if (brand) return `${source.name} — ${brand.name}`;
  }
  return source.name;
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
