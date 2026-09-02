import type {
  ActiveBonus,
  ComputedStats,
  CoreType,
  Loadout,
  SkillLocalStats,
  Slot,
  StatBonus,
  StatKey,
} from "./types";
import { BRANDS } from "./data/brands";
import { GEAR_SETS, coreStrengthRate, resolveFourPieceMax } from "./data/gear-sets";
import { catalogById } from "./data/catalog";
import { SKILLS, activeSpecPerks, specializationById } from "./data/skills";
import { WEAPONS } from "./data/weapons";
import {
  sanitizeWeaponMods,
  weaponModMultiplier,
} from "./data/weapon-mods";
import { ALL_TALENTS } from "./data/talents";
import { augmentById, clampAugmentLevel } from "./data/augments";
import {
  AGENT_BASE_HEALTH,
  CHC_CAP,
  CORE_COLORS,
  CORE_VALUES,
  DEFENSIVE_ATTRS,
  EMPTY_SLOT_COLOR,
  GEAR_BASE_ARMOR,
  hasGearMod,
  OFFENSIVE_ATTRS,
  PROTOTYPE_ATTR_MULT,
  resolveCoreValue,
  SKILL_ATTRS,
  SKILL_TIER_CAP,
  SLOTS,
  STAT_LABELS,
  armorOnKillFlat,
  totalArmorRegenPerSec,
  resolveHealthFlat,
  resolveShdWatchBonuses,
  shdWatchIsFull,
} from "./data/attributes";
import { applySeasonModifiers } from "./data/season-modifiers";
import {
  clampExpertise,
  coreStrengthConversion,
  pushBonus,
  resolveActiveWeaponSlot,
  resolveWeaponTalent,
  skillLocalStats,
} from "./builder-model";

const STAT_KEYS: StatKey[] = [
  "weaponDamage",
  "chc",
  "chd",
  "hsd",
  "weaponHandling",
  "armor",
  "armorPercent",
  "health",
  "healthPercent",
  "armorRegen",
  "armorRegenPercent",
  "armorOnKill",
  "hazardProtection",
  "bleedResistance",
  "burnResistance",
  "shockResistance",
  "disruptResistance",
  "blindResistance",
  "ensnareResistance",
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
  "movementSpeed",
  "optimalRange",
  "threat",
  "protectionFromElites",
  "scannerPulseHaste",
  "meleeDamage",
  "shieldHealth",
  "signatureWeaponDamage",
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
  storedValue?: number,
) {
  cores[core] += 1;
  // Flat armor from blue cores is applied in resolveFlatArmor (with piece base).
  if (core === "blue") return;
  addBonuses(values, [
    { stat: CORE_VALUES[core].stat, value: resolveCoreValue(core, storedValue, prototype) },
  ]);
}

/** Flat armor from equipped pieces: base + blue cores, expertise, then Total Armor %. */
function resolveFlatArmor(
  loadout: Loadout,
  armorPercent: number,
  notes: string[],
): number {
  let flat = 0;
  let piecesWithArmor = 0;
  for (const slot of SLOTS) {
    const piece = loadout.gear[slot];
    if (!piece) continue;
    const source = catalogById(piece.sourceId);
    if (!source) continue;
    piecesWithArmor += 1;
    const isPrototype = Boolean(piece.prototype) && source.kind !== "exotic";
    const protoMult = isPrototype ? PROTOTYPE_ATTR_MULT : 1;
    let pieceFlat = GEAR_BASE_ARMOR * protoMult;
    const extraBlue =
      (piece.extraCores ?? source.extraCores ?? []).filter((core) => core === "blue").length;
    if (piece.core === "blue") {
      pieceFlat += resolveCoreValue("blue", piece.coreValue, isPrototype);
    }
    if (extraBlue > 0) {
      pieceFlat += resolveCoreValue("blue", undefined, isPrototype) * extraBlue;
    }
    if (piece.expertise > 0) {
      pieceFlat *= 1 + piece.expertise / 100;
    }
    flat += pieceFlat;
  }
  if (piecesWithArmor === 0) return 0;
  const beforePercent = flat;
  flat *= 1 + armorPercent / 100;
  notes.push(
    `Armor: ${Math.round(beforePercent).toLocaleString("en-US")} flat` +
      (armorPercent > 0
        ? ` × (1 + ${armorPercent}% Total Armor) = ${Math.round(flat).toLocaleString("en-US")}`
        : "") +
      ".",
  );
  return flat;
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
    includeAssumed: false,
    activeWeapon: "primary",
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
  const includeAssumed = loadout.includeAssumed === true;
  const activeWeaponSlot = resolveActiveWeaponSlot(loadout.activeWeapon);

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
    addCore(values, cores, piece.core, isPrototype, piece.coreValue);
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
    if (includeAssumed && source.assumed?.length) {
      addBonuses(values, source.assumed);
      pushBonus(bonuses, {
        source: `${source.name}`,
        label: formatBonusList(source.assumed),
        detail: source.assumedNote ?? source.uniqueTalent?.description ?? source.name,
        pieces: 1,
        required: 1,
        active: true,
        color: "#c41e3a",
      });
      notes.push(
        `${source.name} maxed bonuses: ${formatBonusList(source.assumed)}${
          source.assumedNote ? ` — ${source.assumedNote}` : ""
        }.`,
      );
    }
    // Investor: bonus per non-core attribute color on this mask.
    if (source.id === "investor") {
      let red = 0;
      let blue = 0;
      let yellow = 0;
      for (const attr of piece.attributes) {
        if (OFFENSIVE_ATTRS.has(attr.stat)) red += 1;
        else if (DEFENSIVE_ATTRS.has(attr.stat)) blue += 1;
        else if (SKILL_ATTRS.has(attr.stat)) yellow += 1;
      }
      const investorBonuses: StatBonus[] = [];
      if (red > 0) investorBonuses.push({ stat: "chd", value: 10 * red });
      if (blue > 0) investorBonuses.push({ stat: "armorRegenPercent", value: 1 * blue });
      if (yellow > 0) investorBonuses.push({ stat: "skillEfficiency", value: 5 * yellow });
      if (investorBonuses.length) {
        addBonuses(values, investorBonuses);
        pushBonus(bonuses, {
          source: "Investor · Slotted",
          label: formatBonusList(investorBonuses),
          detail: `From attributes: ${red} red, ${blue} blue, ${yellow} yellow.`,
          pieces: 1,
          required: 1,
          active: true,
          color: "#c41e3a",
        });
        notes.push(
          `Investor Slotted: ${red}×red → CHD, ${blue}×blue → armor regen %, ${yellow}×yellow → skill efficiency.`,
        );
      }
    }
    if (isPrototype) {
      notes.push(
        `${source.name}: Prototype — attribute caps ×${PROTOTYPE_ATTR_MULT}, cores ×${PROTOTYPE_ATTR_MULT} (Skill Tier 1 → 1.5).`,
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

  // Active weapon Prototype Augment stacks with gear (in-game max 7 = 6 gear + weapon).
  {
    const equipped = loadout.weapons[activeWeaponSlot];
    const weapon = equipped
      ? WEAPONS.find((item) => item.id === equipped.weaponId)
      : undefined;
    if (equipped?.prototype && weapon && weapon.quality !== "exotic") {
      notes.push(
        `Active ${weapon.name}: Prototype — Augment stacks with gear Prototypes.`,
      );
      const augment = augmentById(equipped.augmentId);
      if (augment) {
        const level = clampAugmentLevel(equipped.augmentLevel);
        const value = augment.valueAtLevel(level);
        const stack = augmentStacks.get(augment.id) ?? { count: 0, total: 0, levels: [] };
        stack.count += 1;
        stack.total = Math.round((stack.total + value) * 10) / 10;
        stack.levels.push(level);
        augmentStacks.set(augment.id, stack);
      }
    }
    for (const slot of ["primary", "secondary", "sidearm"] as const) {
      if (slot === activeWeaponSlot) continue;
      const other = loadout.weapons[slot];
      const def = other ? WEAPONS.find((item) => item.id === other.weaponId) : undefined;
      if (other?.prototype && def && def.quality !== "exotic") {
        notes.push(
          `${slotLabel(slot)} ${def.name}: Prototype stored (Augment applies when that weapon is active).`,
        );
      }
    }
  }

  for (const [augmentId, stack] of augmentStacks) {
    const augment = augmentById(augmentId);
    if (!augment) continue;
    pushBonus(bonuses, {
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
    if (augment.id === "echo") {
      // Double-hit chance ≈ effective weapon damage contribution.
      values.weaponDamage += Math.round(stack.total * 0.5 * 10) / 10;
    } else if (augment.id === "anomaly") {
      values.skillRepair += Math.round(stack.total * 0.15 * 10) / 10;
      values.incomingRepairs += Math.round(stack.total * 0.1 * 10) / 10;
    } else if (augment.id === "quantum") {
      values.hazardProtection += Math.round(stack.total * 0.5 * 10) / 10;
    } else if (augment.id === "trapper") {
      values.statusEffects += Math.round(stack.total * 0.5 * 10) / 10;
    } else if (augment.statHint === "explosiveDamage") {
      values.explosiveDamage += stack.total;
    } else if (augment.statHint === "statusEffects") {
      values.statusEffects += stack.total;
    } else if (augment.statHint === "skillHaste") {
      values.skillHaste += Math.round(stack.total * 0.25 * 10) / 10;
    } else if (augment.statHint === "magazineSize") {
      values.magazineSize += Math.round(stack.total * 0.5 * 10) / 10;
    } else if (augment.statHint === "health") {
      values.healthPercent += stack.total;
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
    pushBonus(bonuses, {
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
    if (includeAssumed && fourPiece && set.id === "core-strength") {
      const rate = coreStrengthRate(Boolean(chestIsSet));
      const converted = coreStrengthConversion(cores, rate);
      if (converted.length) {
        addBonuses(values, converted);
        notes.push(
          `Core Strength 4pc conversion: ${formatBonusList(converted)} (${Math.round(rate * 100)}% of the other cores).`,
        );
      }
    } else if (includeAssumed && fourPiece) {
      const fourMax = resolveFourPieceMax(set, Boolean(chestIsSet), Boolean(backpackIsSet));
      if (fourMax?.stats.length) {
        addBonuses(values, fourMax.stats);
        notes.push(`${set.name} 4pc maxed bonuses: ${formatBonusList(fourMax.stats)} (${fourMax.note}).`);
      }
    }

    pushBonus(bonuses, {
      source: set.name,
      label: `${Math.min(pieces, 4)} piece${pieces > 1 ? "s" : ""}`,
      detail: [
        pieces >= 2 ? `2pc: ${set.two}` : `2pc locked (${pieces}/2)`,
        pieces >= 3 ? `3pc: ${set.three}` : `3pc locked (${pieces}/3)`,
        fourPiece ? `4pc: ${set.four}` : `4pc locked (${pieces}/4)`,
        fourPiece && includeAssumed && set.id === "core-strength"
          ? `Maxed: core conversion ${Math.round(coreStrengthRate(Boolean(chestIsSet)) * 100)}%`
          : fourPiece && includeAssumed
            ? `Maxed: ${resolveFourPieceMax(set, Boolean(chestIsSet), Boolean(backpackIsSet))?.note ?? set.fourAssumedNote ?? "4pc talent"}`
            : null,
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

  // Chest / backpack talent bonuses (always-on passives, plus maxed procs when toggled).
  for (const slot of ["chest", "backpack"] as const) {
    const piece = loadout.gear[slot];
    if (!piece?.talentId) continue;
    const talent = ALL_TALENTS.find((item) => item.id === piece.talentId);
    if (!talent?.assumed?.length) continue;
    if (!talent.passive && !includeAssumed) continue;
    addBonuses(values, talent.assumed);
    pushBonus(bonuses, {
      source: `Talent · ${talent.name}`,
      label: formatBonusList(talent.assumed),
      detail: talent.assumedNote ?? talent.description,
      pieces: 1,
      required: 1,
      active: true,
      color: "#c9a227",
    });
    notes.push(
      `Talent ${talent.name}${talent.passive ? "" : " (maxed bonuses)"}: ${formatBonusList(talent.assumed)}${
        talent.assumedNote ? ` — ${talent.assumedNote}` : ""
      }.`,
    );
  }

  const shdBonuses = resolveShdWatchBonuses(loadout.shdWatch, loadout.shdWatchParts);
  if (shdBonuses.length) {
    addBonuses(values, shdBonuses);
    const allOn = shdWatchIsFull(loadout.shdWatchParts);
    notes.push(
      allOn
        ? "SHD Watch 1000 active (all planner bonuses at max)."
        : `SHD Watch partial (${shdBonuses.length}/12 lines contributing).`,
    );
  }

  const activeEquipped = loadout.weapons[activeWeaponSlot];
  const activeWeapon = activeEquipped
    ? WEAPONS.find((weapon) => weapon.id === activeEquipped.weaponId)
    : undefined;
  const activeExpertise = clampExpertise(activeEquipped?.expertise);
  if (activeExpertise > 0) {
    values.weaponDamage += activeExpertise;
    notes.push(
      `Active weapon expertise ${activeExpertise}: +${activeExpertise}% Weapon Damage.`,
    );
  }
  for (const slot of ["primary", "secondary", "sidearm"] as const) {
    if (slot === activeWeaponSlot) continue;
    const exp = clampExpertise(loadout.weapons[slot]?.expertise);
    if (exp > 0) {
      notes.push(`${slotLabel(slot)} expertise ${exp} stored (applies when that weapon is active).`);
    }
  }

  if (activeWeapon?.extraStats?.length) {
    addBonuses(values, activeWeapon.extraStats);
    notes.push(
      `Active ${activeWeapon.name} innate: ${formatBonusList(activeWeapon.extraStats)}.`,
    );
  }
  const resolvedTalent = activeWeapon
    ? resolveWeaponTalent(activeWeapon, activeEquipped)
    : null;
  if (resolvedTalent?.assumed?.length && (resolvedTalent.passive || includeAssumed)) {
    addBonuses(values, resolvedTalent.assumed);
    pushBonus(bonuses, {
      source: `Weapon · ${activeWeapon!.name}`,
      label: formatBonusList(resolvedTalent.assumed),
      detail: resolvedTalent.assumedNote ?? `${resolvedTalent.name}: ${resolvedTalent.description}`,
      pieces: 1,
      required: 1,
      active: true,
      color: "#d4af37",
    });
    notes.push(
      `Active ${activeWeapon!.name} talent${resolvedTalent.passive ? "" : " (maxed)"}: ${formatBonusList(resolvedTalent.assumed)}.`,
    );
  }

  if (activeEquipped && activeWeapon && activeEquipped.mods?.length) {
    const mods = sanitizeWeaponMods(activeWeapon.type, activeEquipped.mods);
    const mult = weaponModMultiplier(resolvedTalent?.name ?? activeWeapon.talent);
    const scaled = mods.map((mod) => ({
      stat: mod.stat,
      value: Math.round(mod.value * mult * 10) / 10,
    }));
    addBonuses(values, scaled);
    pushBonus(bonuses, {
      source: `Weapon mods · ${activeWeapon.name}`,
      label: formatBonusList(scaled),
      detail:
        mult > 1
          ? `Optimized: weapon mods ×${mult}. ${mods.map((m) => m.kind).join(", ")}.`
          : `Sockets: ${mods.map((m) => m.kind).join(", ")}.`,
      pieces: mods.length,
      required: mods.length,
      active: true,
      color: "#8a7a4a",
    });
    notes.push(
      `Active weapon mods${mult > 1 ? ` (Optimized ×${mult})` : ""}: ${formatBonusList(scaled)}.`,
    );
  }
  for (const slot of ["primary", "secondary", "sidearm"] as const) {
    if (slot === activeWeaponSlot) continue;
    const equipped = loadout.weapons[slot];
    if (!equipped?.mods?.length) continue;
    notes.push(`${slotLabel(slot)} weapon mods stored (apply when that weapon is active).`);
  }

  const skillLocal: SkillLocalStats[] = [];
  for (const equipped of loadout.skills) {
    if (!equipped?.skillId) continue;
    const skill = SKILLS.find((item) => item.id === equipped.skillId);
    if (!skill) continue;
    const local = skillLocalStats(equipped, loadout.specialization);
    if (local) skillLocal.push(local);
    pushBonus(bonuses, {
      source: `Skill · ${skill.name}`,
      label: skill.category,
      detail: skill.assumedNote ?? skill.description,
      pieces: 1,
      required: 1,
      active: true,
      color: "#7ec8e8",
    });
    if (includeAssumed && skill.assumed?.length) {
      addBonuses(values, skill.assumed);
      notes.push(`Skill ${skill.name} maxed bonuses: ${formatBonusList(skill.assumed)}.`);
    } else {
      notes.push(`Skill equipped: ${skill.category} — ${skill.name}.`);
    }
    if (local && (local.bonuses.length || local.extras.length || local.expertise)) {
      const localLabel = [
        local.bonuses.length ? formatBonusList(local.bonuses) : null,
        local.extras.length ? local.extras.join(" · ") : null,
        local.expertise ? `Expertise ${local.expertise}` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      notes.push(`Skill-local on ${skill.name}: ${localLabel || local.summary}.`);
      pushBonus(bonuses, {
        source: `Skill mods · ${skill.name}`,
        label: skill.category,
        detail: localLabel || local.summary,
        pieces: 1,
        required: 1,
        active: true,
        color: "#5aa8c8",
      });
    }
  }

  applySeasonModifiers(loadout, values, bonuses, notes, includeAssumed);

  if (loadout.specialization) {
    const spec = specializationById(loadout.specialization);
    if (spec) {
      const activePerks = activeSpecPerks(spec, loadout.specPerks);
      for (const perk of activePerks) {
        addBonuses(values, perk.bonuses);
      }
      const perkLabels = activePerks.map((perk) => perk.name);
      pushBonus(bonuses, {
        source: spec.name,
        label: spec.signature,
        detail: perkLabels.length
          ? `${spec.description} · Perks: ${perkLabels.join(", ")}.`
          : `${spec.description} · No spec perks selected.`,
        pieces: 1,
        required: 1,
        active: true,
        color: "#ff6b1a",
      });
      if (perkLabels.length) {
        notes.push(
          `${spec.name} perks: ${activePerks
            .map((perk) => `${perk.name} (${formatBonusList(perk.bonuses)})`)
            .join("; ")}.`,
        );
      } else {
        notes.push(`${spec.name} selected — signature / unique skill only (no sheet perks).`);
      }
    }
  }

  // Flat armor after all armorPercent sources (brands, sets, SHD, talents, specs).
  values.armor = resolveFlatArmor(loadout, values.armorPercent, notes);

  const derived = {
    armorRegenPerSec: totalArmorRegenPerSec(
      values.armorRegen,
      values.armor,
      values.armorRegenPercent,
    ),
    armorOnKillFlat: armorOnKillFlat(values.armor, values.armorOnKill),
    healthFlat: resolveHealthFlat(values.health, values.healthPercent),
  };

  if (derived.armorRegenPerSec > 0) {
    const parts: string[] = [];
    if (values.armorRegen > 0) {
      parts.push(`${Math.round(values.armorRegen).toLocaleString("en-US")}/s from gear attributes`);
    }
    if (values.armorRegenPercent > 0) {
      parts.push(
        `${values.armorRegenPercent}% of armor (${Math.round((values.armor * values.armorRegenPercent) / 100).toLocaleString("en-US")}/s)`,
      );
    }
    notes.push(`Armor Regeneration total ${Math.round(derived.armorRegenPerSec).toLocaleString("en-US")}/s` +
      (parts.length ? ` = ${parts.join(" + ")}` : "") +
      ". Gear rolls are flat HP/s; brand/set bonuses are %.");
  }
  if (values.armorOnKill > 0 && values.armor > 0) {
    notes.push(
      `Armor on Kill ${values.armorOnKill}% → ${Math.round(derived.armorOnKillFlat).toLocaleString("en-US")} armor restored per kill.`,
    );
  }
  if (values.health > 0 || values.healthPercent > 0 || equippedSlots > 0) {
    notes.push(
      `Health: ${Math.round(derived.healthFlat).toLocaleString("en-US")}` +
        ` (base ${AGENT_BASE_HEALTH.toLocaleString("en-US")}` +
        (values.health > 0 ? ` + ${Math.round(values.health).toLocaleString("en-US")} flat` : "") +
        (values.healthPercent > 0 ? ` × (1 + ${values.healthPercent}%)` : "") +
        ").",
    );
  }

  const chcCapped = Math.min(values.chc, CHC_CAP);
  const chcOvercap = Math.max(0, values.chc - CHC_CAP);
  const skillTierCapped = Math.min(values.skillTier, SKILL_TIER_CAP);

  if (chcOvercap > 0) {
    notes.push(`CHC over cap: ${values.chc.toFixed(1)}% → 60%. ${chcOvercap.toFixed(1)}% wasted.`);
  }

  const typeDamage = activeWeapon ? weaponTypeStat(activeWeapon.type, values) : 0;

  const critFactor = 1 + (chcCapped / 100) * (values.chd / 100);
  const hsFactor = 1 + 0.45 * (values.hsd / 100);
  const wdFactor = 1 + values.weaponDamage / 100;
  const typeFactor = 1 + typeDamage / 100;
  const dtaFactor = 1 + values.damageToArmor / 200;
  const dthFactor = 1 + values.damageToHealth / 200;
  const offensiveIndex = Math.round(
    100 * wdFactor * typeFactor * critFactor * hsFactor * dtaFactor * dthFactor,
  );
  notes.push(
    "Build index is a relative stack compare for planning (not DPS): WD × weapon type × crit × headshot × DtA/DtH. Validate damage at the shooting range.",
  );

  if (equippedSlots === 0) {
    notes.push("Equip gear to see brand bonuses, gear set bonuses, and stats.");
  }

  return {
    cores,
    values,
    derived,
    chcCapped,
    chcOvercap,
    skillTierCapped,
    bonuses,
    skillLocal,
    includeAssumed,
    activeWeapon: activeWeaponSlot,
    offensiveIndex,
    notes,
  };
}

function slotLabel(slot: "primary" | "secondary" | "sidearm"): string {
  if (slot === "primary") return "Primary";
  if (slot === "secondary") return "Secondary";
  return "Sidearm";
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
      const sign = bonus.value > 0 ? "+" : "";
      if (bonus.stat === "skillTier") return `${sign}${bonus.value} Skill Tier`;
      if (bonus.stat === "armor") {
        return `${sign}${Math.round(bonus.value).toLocaleString("en-US")} ${STAT_LABELS[bonus.stat]}`;
      }
      return `${sign}${bonus.value}% ${STAT_LABELS[bonus.stat]}`;
    })
    .join(", ");
}

export function slotColor(slot: Slot, loadout: Loadout): string {
  const piece = loadout.gear[slot];
  if (!piece) return EMPTY_SLOT_COLOR;
  return CORE_COLORS[piece.core];
}
