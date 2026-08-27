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
import { augmentById, clampAugmentLevel } from "./data/augments";
import {
  CHC_CAP,
  CORE_COLORS,
  CORE_VALUES,
  EMPTY_SLOT_COLOR,
  GEAR_BASE_ARMOR,
  hasGearMod,
  PROTOTYPE_ATTR_MULT,
  prototypeCoreMult,
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

function addCore(
  values: Record<StatKey, number>,
  cores: Record<CoreType, number>,
  core: CoreType,
  prototype = false,
) {
  cores[core] += 1;
  const base = CORE_VALUES[core];
  const mult = prototype ? prototypeCoreMult(core) : 1;
  addBonuses(values, [{ stat: base.stat, value: base.value * mult }]);
}

export function emptyLoadout(name = "New build"): Loadout {
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
  };
}

export type GearCounts = {
  brandCounts: Map<string, number>;
  setCounts: Map<string, number>;
  ninja: boolean;
};

/** Count brand / set pieces, including NinjaBike (+1 for each brand and set already present). */
export function gearCounts(loadout: Loadout): GearCounts {
  const brandCounts = new Map<string, number>();
  const setCounts = new Map<string, number>();
  let ninja = false;

  for (const slot of SLOTS) {
    const piece = loadout.gear[slot];
    if (!piece) continue;
    const source = catalogById(piece.sourceId);
    if (!source) continue;

    if (source.ninja) ninja = true;
    if (source.brandId) {
      brandCounts.set(source.brandId, (brandCounts.get(source.brandId) ?? 0) + 1);
    }
    if (source.gearSetId) {
      setCounts.set(source.gearSetId, (setCounts.get(source.gearSetId) ?? 0) + 1);
    }
  }

  if (ninja) {
    for (const [id, count] of brandCounts) {
      if (count > 0) brandCounts.set(id, count + 1);
    }
    for (const [id, count] of setCounts) {
      if (count > 0) setCounts.set(id, count + 1);
    }
  }

  return { brandCounts, setCounts, ninja };
}

export function computeStats(loadout: Loadout): ComputedStats {
  const values = emptyValues();
  const cores: Record<CoreType, number> = { red: 0, blue: 0, yellow: 0 };
  const notes: string[] = [];
  const bonuses: ActiveBonus[] = [];

  const { brandCounts, setCounts, ninja } = gearCounts(loadout);
  let equippedSlots = 0;
  const augmentStacks = new Map<string, { count: number; total: number; levels: number[] }>();

  for (const slot of SLOTS) {
    const piece = loadout.gear[slot];
    if (!piece) continue;
    equippedSlots += 1;
    const source = catalogById(piece.sourceId);
    if (!source) continue;

    const isPrototype = Boolean(piece.prototype) && source.kind !== "exotic";
    addCore(values, cores, piece.core, isPrototype);
    for (const extra of piece.extraCores ?? source.extraCores ?? []) {
      addCore(values, cores, extra, isPrototype);
    }

    addBonuses(values, piece.attributes);
    if (hasGearMod(slot)) addBonuses(values, piece.mods);
    if (source.extraStats) {
      if (isPrototype) {
        addBonuses(
          values,
          source.extraStats.map((bonus) => ({
            ...bonus,
            value: Math.round(bonus.value * PROTOTYPE_ATTR_MULT * 10) / 10,
          })),
        );
      } else {
        addBonuses(values, source.extraStats);
      }
    }
    if (source.uniqueTalent) {
      notes.push(`${source.name} : ${source.uniqueTalent.name}. ${source.uniqueTalent.description}`);
    }
    if (isPrototype) {
      notes.push(
        `${source.name}: Prototype — attribute caps ×${PROTOTYPE_ATTR_MULT}, red/blue cores ×${PROTOTYPE_ATTR_MULT} (Skill Tier unchanged).`,
      );
      const augment = augmentById(piece.augmentId);
      if (augment) {
        const level = clampAugmentLevel(piece.augmentLevel);
        const value = augment.valueAtLevel(level);
        const stack = augmentStacks.get(augment.id) ?? { count: 0, total: 0, levels: [] };
        stack.count += 1;
        stack.total = Math.round((stack.total + value) * 10) / 10;
        stack.levels.push(level);
        augmentStacks.set(augment.id, stack);
      }
    }
  }

  for (const [augmentId, stack] of augmentStacks) {
    const augment = augmentById(augmentId);
    if (!augment) continue;
    bonuses.push({
      source: `Augment · ${augment.name}`,
      label: `${stack.count}× · ${stack.total}% ${augment.effectLabel}`,
      detail: `${augment.description} Levels: ${stack.levels.join(", ")}.`,
      pieces: stack.count,
      required: 1,
      active: true,
      color: "#5ec8c0",
    });
    notes.push(
      `Augment ${augment.name}: ${stack.count} piece${stack.count > 1 ? "s" : ""} → ${stack.total}% ${augment.effectLabel}.`,
    );
    if (augment.statHint === "explosiveDamage") {
      values.explosiveDamage += stack.total;
    } else if (augment.statHint === "statusEffects") {
      values.statusEffects += stack.total;
    } else if (augment.statHint === "skillHaste") {
      // Synesthesia is a CDR proc, not flat haste — count half as a soft proxy.
      values.skillHaste += Math.round(stack.total * 0.25 * 10) / 10;
    } else if (augment.statHint === "magazineSize") {
      values.magazineSize += Math.round(stack.total * 0.5 * 10) / 10;
    } else if (augment.statHint === "health") {
      // Entropy conversion rate stacks; shown as Health % proxy in the analyzer.
      values.health += stack.total;
    }
  }

  if (ninja) {
    notes.push("NinjaBike: +1 piece for each brand and gear set already equipped.");
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
      label: `${tiers} piece${tiers > 1 ? "s" : ""}`,
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
      label: `${Math.min(pieces, 4)} piece${pieces > 1 ? "s" : ""}`,
      detail: [
        pieces >= 2 ? `2pc: ${set.two}` : `2pc locked (${pieces}/2)`,
        pieces >= 3 ? `3pc: ${set.three}` : `3pc locked (${pieces}/3)`,
        fourPiece ? `4pc: ${set.four}` : `4pc locked (${pieces}/4)`,
        fourPiece && backpackIsSet ? `Backpack: ${set.backpackTalent.name}` : null,
        fourPiece && chestIsSet ? `Chest: ${set.chestTalent.name}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      pieces,
      required: 4,
      active: pieces >= 2,
      color: set.color,
    });

    if (fourPiece && chestIsSet) {
      notes.push(`${set.name} — chest talent: ${set.chestTalent.name}. ${set.chestTalent.description}`);
    }
    if (fourPiece && backpackIsSet) {
      notes.push(`${set.name} — backpack talent: ${set.backpackTalent.name}. ${set.backpackTalent.description}`);
    }
    if (fourPiece && !chestIsSet) {
      notes.push(`${set.name} 4pc is active, but the chest is not from the set (chest talent inactive).`);
    }
    if (fourPiece && !backpackIsSet) {
      notes.push(`${set.name} 4pc is active, but the backpack is not from the set (backpack talent inactive).`);
    }
  }

  if (loadout.shdWatch) {
    addBonuses(values, SHD_WATCH);
    notes.push("SHD Watch 1000 active (offensive, defensive, and utility bonuses).");
  }

  // Per-piece gear expertise: +1% of that piece's armor per level (approx. base armor).
  let gearExpertiseArmor = 0;
  let gearExpertisePieces = 0;
  for (const slot of SLOTS) {
    const piece = loadout.gear[slot];
    if (!piece || !piece.expertise) continue;
    const baseArmor = piece.prototype ? GEAR_BASE_ARMOR * PROTOTYPE_ATTR_MULT : GEAR_BASE_ARMOR;
    gearExpertiseArmor += (baseArmor * piece.expertise) / 100;
    gearExpertisePieces += 1;
  }
  if (gearExpertisePieces > 0) {
    values.armor += gearExpertiseArmor;
    notes.push(
      `Gear expertise on ${gearExpertisePieces} piece${gearExpertisePieces > 1 ? "s" : ""}: +${Math.round(gearExpertiseArmor).toLocaleString("en-US")} Armor.`,
    );
  }

  // Per-weapon expertise: primary feeds the offensive index (active weapon).
  const primaryExpertise = loadout.weapons.primary?.expertise ?? 0;
  if (primaryExpertise > 0) {
    values.weaponDamage += primaryExpertise;
    notes.push(`Primary weapon expertise ${primaryExpertise}: +${primaryExpertise}% Weapon Damage.`);
  }
  for (const slot of ["secondary", "sidearm"] as const) {
    const exp = loadout.weapons[slot]?.expertise ?? 0;
    if (exp > 0) {
      notes.push(
        `${slot === "secondary" ? "Secondary" : "Sidearm"} expertise ${exp} stored (applies when that weapon is used).`,
      );
    }
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
    notes.push(`CHC over cap: ${values.chc.toFixed(1)}% → 60%. ${chcOvercap.toFixed(1)}% wasted.`);
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
    notes.push("Equip gear to see brand bonuses, gear set bonuses, and stats.");
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

export function formatBonusList(bonuses: StatBonus[]): string {
  return bonuses
    .map((bonus) => {
      if (bonus.stat === "skillTier") return `+${bonus.value} Skill Tier`;
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
