import type { StatBonus, WeaponType } from "../types";
import { WEAPONS, WEAPON_TYPE_LABELS } from "./weapons";
import { SKILLS } from "./skills";

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

/**
 * In-game skill attachments (not gear attribute rolls).
 * Examples: Extra Payload on Chem Launcher, Skill Health on drones, Extra Ammo on Sniper Turret.
 */
export type SkillModOption = {
  id: string;
  name: string;
  /** Short in-game style effect line. */
  effect: string;
  /** Soft analyzer contribution when this attachment is selected. */
  assumed?: StatBonus[];
};

export type SkillModSlotDef = {
  id: string;
  /** Slot name as in live TD2 (Housing / Battery / Payload…). */
  label: string;
  options: SkillModOption[];
};

function opt(
  id: string,
  name: string,
  effect: string,
  assumed?: StatBonus[],
): SkillModOption {
  return { id, name, effect, assumed };
}

const OPT = {
  damage: opt("damage", "Damage", "+Skill Damage on this skill", [
    { stat: "skillDamage", value: 6 },
  ]),
  skillHealth: opt("skill-health", "Skill Health", "+Skill Health", [
    { stat: "skillHealth", value: 12 },
  ]),
  duration: opt("duration", "Duration", "+Skill Duration", [
    { stat: "skillDuration", value: 10 },
  ]),
  radius: opt("radius", "Radius", "+Effect / blast radius", [
    { stat: "skillEfficiency", value: 6 },
  ]),
  haste: opt("haste", "Skill Haste", "+Skill Haste for this skill", [
    { stat: "skillHaste", value: 10 },
  ]),
  repair: opt("repair", "Repair Amount", "+Skill Repair", [
    { stat: "skillRepair", value: 12 },
  ]),
  status: opt("status", "Status Effects", "+Status Effects", [
    { stat: "statusEffects", value: 8 },
  ]),
  extraAmmo: opt("extra-ammo", "Extra Ammo", "+Skill ammo / magazine charges"),
  extraPayload: opt("extra-payload", "Extra Payload", "+Chem Launcher ammo charges"),
  extraCharges: opt("extra-charges", "Extra Charges", "+1 skill charge before cooldown"),
  range: opt("range", "Range", "+Optimal / engagement range", [
    { stat: "skillEfficiency", value: 4 },
  ]),
  explodeRadius: opt(
    "explosion-radius",
    "Explosion Radius",
    "+Explosion radius",
    [{ stat: "explosiveDamage", value: 4 }],
  ),
  shieldHealth: opt("shield-health", "Shield Health", "+Shield Health", [
    { stat: "skillHealth", value: 15 },
  ]),
  damageRegen: opt("damage-regen", "Damage to Skill Health", "Hits regenerate skill health", [
    { stat: "skillHealth", value: 6 },
  ]),
};

function slots(
  defs: Array<[string, string, SkillModOption[]]>,
): SkillModSlotDef[] {
  return defs.map(([id, label, options]) => ({ id, label, options }));
}

/** Category → attachment slots (live-style skill modding). */
export const SKILL_MODS_BY_CATEGORY: Record<string, SkillModSlotDef[]> = {
  Turret: slots([
    ["feed", "Feed", [OPT.extraAmmo, OPT.damage, OPT.haste]],
    ["housing", "Housing", [OPT.skillHealth, OPT.damageRegen, OPT.duration]],
    ["targeting", "Targeting", [OPT.damage, OPT.range, OPT.status]],
  ]),
  Drone: slots([
    ["housing", "Housing", [OPT.skillHealth, OPT.damageRegen, OPT.duration]],
    ["battery", "Battery", [OPT.duration, OPT.haste, OPT.extraCharges]],
    [
      "systems",
      "Systems",
      [OPT.damage, OPT.repair, OPT.range, OPT.status],
    ],
  ]),
  "Seeker Mine": slots([
    ["payload", "Payload", [OPT.damage, OPT.explodeRadius, OPT.repair, OPT.status]],
    ["drive", "Drive", [OPT.range, OPT.haste, OPT.duration]],
    ["casing", "Casing", [OPT.skillHealth, OPT.extraCharges]],
  ]),
  Hive: slots([
    ["swarm", "Swarm", [OPT.damage, OPT.repair, OPT.status, OPT.haste]],
    ["housing", "Housing", [OPT.skillHealth, OPT.radius, OPT.duration]],
    ["stim", "Stim", [OPT.extraCharges, OPT.haste, OPT.radius]],
  ]),
  "Chem Launcher": slots([
    ["payload", "Payload", [OPT.extraPayload, OPT.extraAmmo, OPT.damage, OPT.repair]],
    ["mixture", "Mixture", [OPT.damage, OPT.status, OPT.repair, OPT.duration]],
    ["dispersion", "Dispersion", [OPT.radius, OPT.range, OPT.haste]],
  ]),
  Shield: slots([
    ["plate", "Plate", [OPT.shieldHealth, OPT.skillHealth, OPT.damageRegen]],
    ["capacitor", "Capacitor", [OPT.haste, OPT.duration, OPT.extraCharges]],
    ["projector", "Projector", [OPT.range, OPT.status, OPT.damage]],
  ]),
  Pulse: slots([
    ["scanner", "Scanner", [OPT.radius, OPT.range, OPT.haste]],
    ["battery", "Battery", [OPT.duration, OPT.extraCharges, OPT.haste]],
    ["firmware", "Firmware", [OPT.status, OPT.damage, OPT.skillHealth]],
  ]),
  Firefly: slots([
    ["payload", "Payload", [OPT.damage, OPT.status, OPT.explodeRadius]],
    ["thruster", "Thruster", [OPT.range, OPT.haste, OPT.duration]],
    ["hull", "Hull", [OPT.skillHealth, OPT.extraCharges]],
  ]),
  Decoy: slots([
    ["holo", "Holo", [OPT.skillHealth, OPT.duration, OPT.radius]],
    ["battery", "Battery", [OPT.duration, OPT.haste, OPT.extraCharges]],
    ["emitter", "Emitter", [OPT.range, OPT.status]],
  ]),
  Trap: slots([
    ["charge", "Charge", [OPT.damage, OPT.status, OPT.repair]],
    ["sensor", "Sensor", [OPT.radius, OPT.range, OPT.haste]],
    ["casing", "Casing", [OPT.skillHealth, OPT.duration, OPT.extraCharges]],
  ]),
  "Sticky Bomb": slots([
    ["payload", "Payload", [OPT.damage, OPT.explodeRadius, OPT.status]],
    ["fuse", "Fuse", [OPT.duration, OPT.haste, OPT.radius]],
    ["shell", "Shell", [OPT.skillHealth, OPT.extraCharges, OPT.range]],
  ]),
};

/** Prefer heal-oriented defaults on repair / support variants. */
const SUPPORT_SKILL_IDS = new Set([
  "fixer-drone",
  "mender-seeker",
  "restorer-hive",
  "reviver-hive",
  "booster-hive",
  "artificer-hive",
  "repair-chem",
  "repair-trap",
]);

export function skillModSlotsFor(skillId: string): SkillModSlotDef[] {
  const skill = SKILLS.find((item) => item.id === skillId);
  if (!skill) return [];
  return SKILL_MODS_BY_CATEGORY[skill.category] ?? [];
}

export function skillModOptionById(
  skillId: string,
  modId: string | undefined | null,
): SkillModOption | undefined {
  if (!modId) return undefined;
  for (const slot of skillModSlotsFor(skillId)) {
    const found = slot.options.find((option) => option.id === modId);
    if (found) return found;
  }
  return undefined;
}

function preferredDefault(skillId: string, slot: SkillModSlotDef): string {
  const support = SUPPORT_SKILL_IDS.has(skillId);
  const prefer = support
    ? ["repair", "skill-health", "shield-health", "extra-charges", "haste", "radius"]
    : ["extra-ammo", "extra-payload", "damage", "skill-health", "duration", "haste"];
  for (const id of prefer) {
    if (slot.options.some((option) => option.id === id)) return id;
  }
  return slot.options[0]!.id;
}

/** Default attachment picks for a skill (one mod id per slot). */
export function defaultSkillMods(skillId: string): string[] {
  return skillModSlotsFor(skillId).map((slot) => preferredDefault(skillId, slot));
}

function isLegacyStatMods(mods: unknown): boolean {
  return (
    Array.isArray(mods) &&
    mods.length > 0 &&
    typeof mods[0] === "object" &&
    mods[0] != null &&
    "stat" in (mods[0] as object)
  );
}

/** Sanitize selected mod ids for a skill; migrates legacy StatBonus[] kits. */
export function sanitizeSkillMods(skillId: string, mods: unknown): string[] {
  const slots = skillModSlotsFor(skillId);
  if (!slots.length) return [];
  if (isLegacyStatMods(mods)) return defaultSkillMods(skillId);
  const selected = Array.isArray(mods)
    ? mods.filter((entry): entry is string => typeof entry === "string")
    : [];
  return slots.map((slot, index) => {
    const candidate = selected[index];
    if (candidate && slot.options.some((option) => option.id === candidate)) {
      return candidate;
    }
    // Also accept a valid mod id placed in the wrong slot index.
    if (candidate) {
      const match = slot.options.find((option) => option.id === candidate);
      if (match) return match.id;
    }
    return preferredDefault(skillId, slot);
  });
}

/** Soft analyzer bonuses from selected skill attachments. */
export function skillModAssumedBonuses(skillId: string, mods: string[] | undefined): StatBonus[] {
  const selected = sanitizeSkillMods(skillId, mods);
  const bonuses: StatBonus[] = [];
  for (const modId of selected) {
    const option = skillModOptionById(skillId, modId);
    if (option?.assumed?.length) bonuses.push(...option.assumed);
  }
  return bonuses;
}

export function formatSkillModSummary(skillId: string, mods: string[] | undefined): string {
  const slots = skillModSlotsFor(skillId);
  const selected = sanitizeSkillMods(skillId, mods);
  return slots
    .map((slot, index) => {
      const option = skillModOptionById(skillId, selected[index]);
      return option ? `${slot.label}: ${option.name} (${option.effect})` : null;
    })
    .filter(Boolean)
    .join(" · ");
}
