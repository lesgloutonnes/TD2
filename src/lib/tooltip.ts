import type { CoreType, EquippedWeapon, ItemKind, Loadout, Slot, WeaponSlot } from "./types";
import { BRANDS } from "./data/brands";
import { GEAR_SETS } from "./data/gear-sets";
import { catalogById } from "./data/catalog";
import { ALL_TALENTS } from "./data/talents";
import {
  CORE_COLORS,
  CORE_OPTION_LABELS,
  CORE_VALUES,
  KIND_LABELS,
  SLOT_LABELS,
  STAT_LABELS,
  WEAPON_QUALITY_LABELS,
  WEAPON_SLOT_LABELS,
  formatStat,
  itemDisplayColor,
  prototypeCoreMult,
  weaponDisplayColor,
} from "./data/attributes";
import { WEAPON_TYPE_LABELS, weaponById } from "./data/weapons";
import { WEAPON_MOD_KIND_LABELS } from "./data/weapon-mods";
import { formatBonusList, gearCounts } from "./calc";
import { augmentById, clampAugmentLevel } from "./data/augments";

export type TooltipTier = {
  key: string;
  label: string;
  detail: string;
  active: boolean;
};

export type InspectStat = {
  label: string;
  value: string;
};

export type PieceInspect =
  | {
      empty: true;
      slot: Slot;
      slotLabel: string;
    }
  | {
      empty: false;
      slot: Slot;
      slotLabel: string;
      name: string;
      kind: ItemKind;
      kindLabel: string;
      kindColor: string;
      prototype: boolean;
      augment: { name: string; level: number; value: number; effectLabel: string; description: string } | null;
      core: CoreType;
      coreLabel: string;
      coreColor: string;
      coreValue: string;
      extraCores: { core: CoreType; label: string; color: string }[];
      stats: InspectStat[];
      talent: { name: string; description: string; locked: boolean } | null;
      affiliation: {
        name: string;
        color: string;
        pieces: number;
        required: number;
        ninjaBoost: boolean;
        tiers: TooltipTier[];
      } | null;
    };

export function pieceInspect(slot: Slot, loadout: Loadout): PieceInspect {
  const slotLabel = SLOT_LABELS[slot];
  const piece = loadout.gear[slot];
  if (!piece) return { empty: true, slot, slotLabel };

  const source = catalogById(piece.sourceId);
  if (!source) return { empty: true, slot, slotLabel };

  const { brandCounts, setCounts, ninja } = gearCounts(loadout);

  const extraCores = (piece.extraCores ?? source.extraCores ?? []).map((core) => ({
    core,
    label: CORE_OPTION_LABELS[core],
    color: CORE_COLORS[core],
  }));

  const stats: InspectStat[] = [];
  for (const attr of piece.attributes) {
    stats.push({
      label: STAT_LABELS[attr.stat],
      value: formatStat(attr.stat, attr.value),
    });
  }
  if (source.extraStats) {
    for (const extra of source.extraStats) {
      stats.push({
        label: STAT_LABELS[extra.stat],
        value: formatStat(extra.stat, extra.value),
      });
    }
  }
  if (piece.mods.length > 0) {
    for (const mod of piece.mods) {
      stats.push({
        label: `Mod · ${STAT_LABELS[mod.stat]}`,
        value: formatStat(mod.stat, mod.value),
      });
    }
  }

  let talent: { name: string; description: string; locked: boolean } | null = null;
  if (source.uniqueTalent) {
    talent = { ...source.uniqueTalent, locked: false };
  } else if (piece.talentId) {
    const found = ALL_TALENTS.find((item) => item.id === piece.talentId);
    if (found) {
      talent = { name: found.name, description: found.description, locked: false };
    }
  }

  let affiliation: Extract<PieceInspect, { empty: false }>["affiliation"] = null;

  if (source.brandId) {
    const brand = BRANDS.find((item) => item.id === source.brandId);
    if (brand) {
      const pieces = brandCounts.get(brand.id) ?? 0;
      affiliation = {
        name: brand.name,
        color: brand.color,
        pieces,
        required: 3,
        ninjaBoost: ninja && pieces > 0,
        tiers: brand.bonuses.map((bonus, index) => {
          const n = index + 1;
          return {
            key: `${n}pc`,
            label: `${n} piece${n > 1 ? "s" : ""}`,
            detail: formatBonusList(bonus),
            active: pieces >= n,
          };
        }),
      };
    }
  } else if (source.gearSetId) {
    const set = GEAR_SETS.find((item) => item.id === source.gearSetId);
    if (set) {
      const pieces = setCounts.get(set.id) ?? 0;
      const chest = loadout.gear.chest;
      const backpack = loadout.gear.backpack;
      const chestIsSet = Boolean(chest && catalogById(chest.sourceId)?.gearSetId === set.id);
      const backpackIsSet = Boolean(
        backpack && catalogById(backpack.sourceId)?.gearSetId === set.id,
      );
      const fourPiece = pieces >= 4;
      affiliation = {
        name: set.name,
        color: set.color,
        pieces,
        required: 4,
        ninjaBoost: ninja && pieces > 0,
        tiers: [
          {
            key: "2pc",
            label: "2 pieces",
            detail: set.two,
            active: pieces >= 2,
          },
          {
            key: "3pc",
            label: "3 pieces",
            detail: set.three,
            active: pieces >= 3,
          },
          {
            key: "4pc",
            label: "4 pieces",
            detail: set.four,
            active: fourPiece,
          },
          {
            key: "backpack-talent",
            label: "Backpack talent",
            detail: `${set.backpackTalent.name} — ${set.backpackTalent.description}`,
            active: fourPiece && backpackIsSet,
          },
          {
            key: "chest-talent",
            label: "Chest talent",
            detail: `${set.chestTalent.name} — ${set.chestTalent.description}`,
            active: fourPiece && chestIsSet,
          },
        ],
      };

      if (!talent && (slot === "chest" || slot === "backpack")) {
        const setTalent = slot === "chest" ? set.chestTalent : set.backpackTalent;
        talent = {
          name: setTalent.name,
          description: setTalent.description,
          locked: !fourPiece,
        };
      }
    }
  }

  const isPrototype = Boolean(piece.prototype) && source.kind !== "exotic";
  const augmentDef = isPrototype ? augmentById(piece.augmentId) : undefined;
  const augmentLevel = clampAugmentLevel(piece.augmentLevel);
  const augment = augmentDef
    ? {
        name: augmentDef.name,
        level: augmentLevel,
        value: augmentDef.valueAtLevel(augmentLevel),
        effectLabel: augmentDef.effectLabel,
        description: augmentDef.description,
      }
    : null;

  return {
    empty: false,
    slot,
    slotLabel,
    name: source.name,
    kind: source.kind,
    kindLabel: KIND_LABELS[source.kind],
    kindColor: itemDisplayColor(source.kind, isPrototype),
    prototype: isPrototype,
    augment,
    core: piece.core,
    coreLabel: CORE_OPTION_LABELS[piece.core],
    coreColor: CORE_COLORS[piece.core],
    coreValue: formatStat(
      CORE_VALUES[piece.core].stat,
      CORE_VALUES[piece.core].value * (isPrototype ? prototypeCoreMult(piece.core) : 1),
    ),
    extraCores,
    stats,
    talent,
    affiliation,
  };
}

export type WeaponInspect =
  | {
      empty: true;
      slot: WeaponSlot;
      slotLabel: string;
    }
  | {
      empty: false;
      slot: WeaponSlot;
      slotLabel: string;
      name: string;
      quality: "high-end" | "named" | "exotic";
      qualityLabel: string;
      qualityColor: string;
      typeLabel: string;
      rpm: number;
      mag: number;
      prototype: boolean;
      expertise: number;
      augment: { name: string; level: number; value: number; effectLabel: string; description: string } | null;
      extraStats: InspectStat[];
      mods: InspectStat[];
      talent: { name: string; description: string };
      assumedNote?: string;
    };

export function weaponInspect(slot: WeaponSlot, equipped: EquippedWeapon | null): WeaponInspect {
  const slotLabel = WEAPON_SLOT_LABELS[slot];
  if (!equipped) return { empty: true, slot, slotLabel };

  const def = weaponById(equipped.weaponId);
  if (!def) return { empty: true, slot, slotLabel };

  const isPrototype = Boolean(equipped.prototype) && def.quality !== "exotic";
  const extraStats: InspectStat[] = (def.extraStats ?? []).map((stat) => ({
    label: STAT_LABELS[stat.stat],
    value: formatStat(stat.stat, stat.value),
  }));
  const mods: InspectStat[] = (equipped.mods ?? []).map((mod) => ({
    label: `${WEAPON_MOD_KIND_LABELS[mod.kind]} · ${STAT_LABELS[mod.stat]}`,
    value: formatStat(mod.stat, mod.value),
  }));

  const augmentDef = isPrototype ? augmentById(equipped.augmentId) : undefined;
  const augmentLevel = clampAugmentLevel(equipped.augmentLevel);
  const augment = augmentDef
    ? {
        name: augmentDef.name,
        level: augmentLevel,
        value: augmentDef.valueAtLevel(augmentLevel),
        effectLabel: augmentDef.effectLabel,
        description: augmentDef.description,
      }
    : null;

  return {
    empty: false,
    slot,
    slotLabel,
    name: def.name,
    quality: def.quality,
    qualityLabel: WEAPON_QUALITY_LABELS[def.quality],
    qualityColor: weaponDisplayColor(def.quality, isPrototype),
    typeLabel: WEAPON_TYPE_LABELS[def.type],
    rpm: def.rpm,
    mag: def.mag,
    prototype: isPrototype,
    expertise: equipped.expertise,
    augment,
    extraStats,
    mods,
    talent: { name: def.talent, description: def.talentDesc },
    assumedNote: def.assumedNote,
  };
}
