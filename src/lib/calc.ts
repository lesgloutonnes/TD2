import type {
  ActiveBonus,
  ComputedStats,
  CoreType,
  Loadout,
  Slot,
  StatBonus,
  StatKey,
} from "./types";
import { BRANDS } from "./data/brands";
import { GEAR_SETS } from "./data/gear-sets";
import { catalogById } from "./data/catalog";
import { SPECIALIZATIONS } from "./data/skills";
import { WEAPONS } from "./data/weapons";
import {
  CHC_CAP,
  CORE_COLORS,
  CORE_VALUES,
  EMPTY_SLOT_COLOR,
  hasGearMod,
  SHD_WATCH,
  SKILL_TIER_CAP,
  SLOTS,
  STAT_LABELS,
} from "./data/attributes";

const STAT_KEYS: StatKey[] = [
  "weaponDamage",
  "chc",
  "chd",
  "hsd",
  "weaponHandling",
  "armor",
  "health",
  "armorRegen",
  "armorOnKill",
  "hazardProtection",
  "explosiveResistance",
  "incomingRepairs",
  "skillDamage",
  "skillHaste",
  "skillDuration",
  "skillRepair",
  "skillEfficiency",
  "skillHealth",
  "statusEffects",
  "skillTier",
  "arDamage",
  "lmgDamage",
  "smgDamage",
  "shotgunDamage",
  "mmrDamage",
  "rifleDamage",
  "pistolDamage",
  "reloadSpeed",
  "magazineSize",
  "ammoCapacity",
  "rateOfFire",
  "stability",
  "accuracy",
  "damageToArmor",
  "damageToHealth",
  "explosiveDamage",
  "pulseResistance",
  "swapSpeed",
  "optimalRange",
  "threat",
  "protectionFromElites",
];

function emptyValues(): Record<StatKey, number> {
  return Object.fromEntries(STAT_KEYS.map((key) => [key, 0])) as Record<
    StatKey,
    number
  >;
}

function addBonuses(values: Record<StatKey, number>, bonuses: StatBonus[]) {
  for (const bonus of bonuses) {
    values[bonus.stat] += bonus.value;
  }
}

function addCore(values: Record<StatKey, number>, cores: Record<CoreType, number>, core: CoreType) {
  cores[core] += 1;
  addBonuses(values, [CORE_VALUES[core]]);
}

export function emptyLoadout(name = "Nouveau build"): Loadout {
  return {
    name,
    gear: {
      mask: null,
      backpack: null,
      chest: null,
      gloves: null,
      holster: null,
      kneepads: null,
    },
    weapons: {
      primary: null,
      secondary: null,
      sidearm: null,
    },
    skills: [null, null],
    specialization: null,
    shdWatch: true,
    expertise: 12,
  };
}

export function computeStats(loadout: Loadout): ComputedStats {
  const values = emptyValues();
  const cores: Record<CoreType, number> = { red: 0, blue: 0, yellow: 0 };
  const notes: string[] = [];
  const bonuses: ActiveBonus[] = [];

  const brandCounts = new Map<string, number>();
  const setCounts = new Map<string, number>();
  let ninja = false;
  let equippedSlots = 0;

  for (const slot of SLOTS) {
    const piece = loadout.gear[slot];
    if (!piece) continue;
    equippedSlots += 1;
    const source = catalogById(piece.sourceId);
    if (!source) continue;

    if (source.ninja) ninja = true;
    if (source.brandId) {
      brandCounts.set(source.brandId, (brandCounts.get(source.brandId) ?? 0) + 1);
    }
    if (source.gearSetId) {
      setCounts.set(source.gearSetId, (setCounts.get(source.gearSetId) ?? 0) + 1);
    }

    addCore(values, cores, piece.core);
    for (const extra of piece.extraCores ?? source.extraCores ?? []) {
      addCore(values, cores, extra);
    }

    addBonuses(values, piece.attributes);
    if (hasGearMod(slot)) addBonuses(values, piece.mods);
    if (source.extraStats) addBonuses(values, source.extraStats);
    if (source.uniqueTalent) {
      notes.push(`${source.name} : ${source.uniqueTalent.name}. ${source.uniqueTalent.description}`);
    }
  }

  if (ninja) {
    for (const [id, count] of brandCounts) {
      if (count > 0) brandCounts.set(id, count + 1);
    }
    for (const [id, count] of setCounts) {
      if (count > 0) setCounts.set(id, count + 1);
    }
    notes.push("NinjaBike : +1 pièce pour chaque marque et set déjà équipés.");
  }

  for (const brand of BRANDS) {
    const pieces = brandCounts.get(brand.id) ?? 0;
    if (pieces === 0) continue;
    const tiers = Math.min(3, pieces);
    for (let i = 0; i < tiers; i += 1) {
      addBonuses(values, brand.bonuses[i]);
    }
    bonuses.push({
      source: brand.name,
      label: `${tiers} pièce${tiers > 1 ? "s" : ""}`,
      detail: brand.bonuses
        .slice(0, tiers)
        .map((tier, index) => `${index + 1}pc: ${formatBonusList(tier)}`)
        .join(" · "),
      pieces,
      required: 3,
      active: true,
      color: brand.color,
    });
  }

  for (const set of GEAR_SETS) {
    const pieces = setCounts.get(set.id) ?? 0;
    if (pieces === 0) continue;
    const chest = loadout.gear.chest;
    const backpack = loadout.gear.backpack;
    const chestIsSet = chest && catalogById(chest.sourceId)?.gearSetId === set.id;
    const backpackIsSet =
      backpack && catalogById(backpack.sourceId)?.gearSetId === set.id;
    const fourPiece = pieces >= 4;

    if (pieces >= 2) addBonuses(values, set.twoStats);
    if (pieces >= 3) addBonuses(values, set.threeStats);

    bonuses.push({
      source: set.name,
      label: `${Math.min(pieces, 4)} pièce${pieces > 1 ? "s" : ""}`,
      detail: [
        pieces >= 2 ? `2pc: ${set.two}` : `2pc verrouillé (${pieces}/2)`,
        pieces >= 3 ? `3pc: ${set.three}` : `3pc verrouillé (${pieces}/3)`,
        fourPiece ? `4pc: ${set.four}` : `4pc verrouillé (${pieces}/4)`,
        fourPiece && backpackIsSet ? `Sac: ${set.backpackTalent.name}` : null,
        fourPiece && chestIsSet ? `Gilet: ${set.chestTalent.name}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      pieces,
      required: 4,
      active: pieces >= 2,
      color: set.color,
    });

    if (fourPiece && chestIsSet) {
      notes.push(`${set.name} — talent gilet : ${set.chestTalent.name}. ${set.chestTalent.description}`);
    }
    if (fourPiece && backpackIsSet) {
      notes.push(`${set.name} — talent sac : ${set.backpackTalent.name}. ${set.backpackTalent.description}`);
    }
    if (fourPiece && !chestIsSet) {
      notes.push(`${set.name} 4pc actif, mais le gilet n'est pas du set (talent chest inactif).`);
    }
    if (fourPiece && !backpackIsSet) {
      notes.push(`${set.name} 4pc actif, mais le sac n'est pas du set (talent backpack inactif).`);
    }
  }

  if (loadout.shdWatch) {
    addBonuses(values, SHD_WATCH);
    notes.push("Montre SHD 1000 active (bonus offensifs, défensifs et utilitaires).");
  }

  if (loadout.expertise > 0) {
    values.weaponDamage += loadout.expertise;
    notes.push(`Expertise ${loadout.expertise} : +${loadout.expertise}% dégâts d'arme.`);
  }

  if (loadout.specialization) {
    const spec = SPECIALIZATIONS.find((item) => item.id === loadout.specialization);
    if (spec) {
      addBonuses(values, spec.bonuses);
      bonuses.push({
        source: spec.name,
        label: spec.signature,
        detail: spec.description,
        pieces: 1,
        required: 1,
        active: true,
        color: "#ff6b1a",
      });
    }
  }

  const chcCapped = Math.min(values.chc, CHC_CAP);
  const chcOvercap = Math.max(0, values.chc - CHC_CAP);
  const skillTierCapped = Math.min(values.skillTier, SKILL_TIER_CAP);

  if (chcOvercap > 0) {
    notes.push(`CHC au-dessus du cap : ${values.chc.toFixed(1)}% → 60%. ${chcOvercap.toFixed(1)}% gaspillés.`);
  }

  const primary = loadout.weapons.primary
    ? WEAPONS.find((weapon) => weapon.id === loadout.weapons.primary?.weaponId)
    : undefined;
  const typeDamage = primary ? weaponTypeStat(primary.type, values) : 0;

  const critFactor = 1 + (chcCapped / 100) * (values.chd / 100);
  const hsFactor = 1 + 0.45 * (values.hsd / 100);
  const wdFactor = 1 + values.weaponDamage / 100;
  const typeFactor = 1 + typeDamage / 100;
  const dtaFactor = 1 + values.damageToArmor / 200;
  const dthFactor = 1 + values.damageToHealth / 200;
  const offensiveIndex = Math.round(
    100 * wdFactor * typeFactor * critFactor * hsFactor * dtaFactor * dthFactor,
  );

  if (equippedSlots === 0) {
    notes.push("Équipez des pièces pour voir les bonus de marque, de set et les stats.");
  }

  return {
    cores,
    values,
    chcCapped,
    chcOvercap,
    skillTierCapped,
    bonuses,
    offensiveIndex,
    notes,
  };
}

function weaponTypeStat(
  type: (typeof WEAPONS)[number]["type"],
  values: Record<StatKey, number>,
): number {
  switch (type) {
    case "ar":
      return values.arDamage;
    case "lmg":
      return values.lmgDamage;
    case "smg":
      return values.smgDamage;
    case "shotgun":
      return values.shotgunDamage;
    case "mmr":
      return values.mmrDamage;
    case "rifle":
      return values.rifleDamage;
    case "pistol":
      return values.pistolDamage;
    default:
      return 0;
  }
}

function formatBonusList(bonuses: StatBonus[]): string {
  return bonuses
    .map((bonus) => {
      if (bonus.stat === "skillTier") return `+${bonus.value} palier`;
      if (bonus.stat === "armor" && bonus.value <= 20) {
        return `+${bonus.value}% ${STAT_LABELS[bonus.stat]}`;
      }
      return `+${bonus.value}% ${STAT_LABELS[bonus.stat]}`;
    })
    .join(", ");
}

export function slotColor(slot: Slot, loadout: Loadout): string {
  const piece = loadout.gear[slot];
  if (!piece) return EMPTY_SLOT_COLOR;
  return CORE_COLORS[piece.core];
}
