import type { CatalogItem, CoreType, GearPiece, Slot, StatBonus } from "./types";
import { ALL_TALENTS } from "./data/talents";
import { catalogById } from "./data/catalog";
import { defaultAttributes, defaultMod, STAT_MAX } from "./data/attributes";
import { GEAR_SETS } from "./data/gear-sets";

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
    mods: [defaultMod(resolvedCore)],
  };
}

function resolveCore(slot: Slot, source: CatalogItem | undefined, core?: CoreType): CoreType {
  if (source?.lockedCore) return source.lockedCore;
  if (source?.gearSetId) {
    const set = GEAR_SETS.find((item) => item.id === source.gearSetId);
    if (set) return set.core;
  }
  if (source?.brandId === "brazos" && slot === "holster" && source.id === "picaros-holster") {
    return "yellow";
  }
  return core ?? "red";
}

function gearSetAttribute(core: CoreType): StatBonus {
  if (core === "yellow") return { stat: "skillDamage", value: STAT_MAX.skillDamage ?? 10 };
  if (core === "blue") return { stat: "armorRegen", value: STAT_MAX.armorRegen ?? 0.5 };
  return { stat: "chd", value: STAT_MAX.chd ?? 12 };
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
  return source?.name ?? "Pièce inconnue";
}
