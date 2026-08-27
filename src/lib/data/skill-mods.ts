import type { StatBonus, StatKey, WeaponType } from "../types";
import { WEAPONS, WEAPON_TYPE_LABELS } from "./weapons";

const TYPE_ORDER: WeaponType[] = ["ar", "lmg", "smg", "shotgun", "mmr", "rifle", "pistol"];

/** Weapons sorted by type family, then name — for dropdowns. */
export function weaponsSorted(types?: readonly WeaponType[]) {
  const list = types ? WEAPONS.filter((weapon) => types.includes(weapon.type)) : [...WEAPONS];
  return list.sort((a, b) => {
    const typeDelta = TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
    if (typeDelta !== 0) return typeDelta;
    return a.name.localeCompare(b.name, "en");
  });
}

/** Group sorted weapons for <optgroup> rendering. */
export function weaponsByType(types?: readonly WeaponType[]) {
  const sorted = weaponsSorted(types);
  const groups: { type: WeaponType; label: string; weapons: typeof WEAPONS }[] = [];
  for (const type of TYPE_ORDER) {
    const weapons = sorted.filter((weapon) => weapon.type === type);
    if (!weapons.length) continue;
    groups.push({ type, label: WEAPON_TYPE_LABELS[type], weapons });
  }
  return groups;
}

export type SkillModDef = {
  slots: number;
  defaults: StatBonus[];
};

/** Soft skill-mod pool (damage / haste / duration / repair / status / health). */
export const SKILL_MOD_OPTIONS: StatKey[] = [
  "skillDamage",
  "skillHaste",
  "skillDuration",
  "skillRepair",
  "skillHealth",
  "statusEffects",
  "skillEfficiency",
];

export const SKILL_MOD_MAX: Partial<Record<StatKey, number>> = {
  skillDamage: 10,
  skillHaste: 12,
  skillDuration: 10,
  skillRepair: 20,
  skillHealth: 15,
  statusEffects: 10,
  skillEfficiency: 10,
};

export const SKILL_MOD_GROUPS: { label: string; stats: StatKey[] }[] = [
  { label: "Skill mods", stats: SKILL_MOD_OPTIONS },
];

/** Most skills take 3 mods in the builder (simplified live kit). */
export const DEFAULT_SKILL_MOD_SLOTS = 3;

export function defaultSkillMods(): StatBonus[] {
  return [
    { stat: "skillDamage", value: 10 },
    { stat: "skillHaste", value: 12 },
    { stat: "skillDuration", value: 8 },
  ];
}

export function clampSkillMod(stat: StatKey, value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  const max = SKILL_MOD_MAX[stat];
  const capped = max == null ? value : Math.min(value, max);
  return Math.round(capped * 10) / 10;
}

export function sanitizeSkillMods(mods: StatBonus[] | undefined): StatBonus[] {
  const base = mods?.length ? mods.slice(0, DEFAULT_SKILL_MOD_SLOTS) : defaultSkillMods();
  while (base.length < DEFAULT_SKILL_MOD_SLOTS) {
    base.push(defaultSkillMods()[base.length]!);
  }
  return base.map((mod) => {
    const stat = SKILL_MOD_OPTIONS.includes(mod.stat) ? mod.stat : "skillDamage";
    return { stat, value: clampSkillMod(stat, mod.value) };
  });
}
