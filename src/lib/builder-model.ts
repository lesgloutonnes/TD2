import type {
  ActiveBonus,
  CoreType,
  EquippedSkill,
  EquippedWeapon,
  SkillLocalStats,
  StatBonus,
  WeaponDef,
  WeaponSlot,
} from "./types";
import { CORE_VALUES, EXPERTISE_MAX } from "./data/attributes";
import {
  defaultWeaponTalentId,
  weaponTalentById,
  weaponTalentByName,
} from "./data/weapon-talents";
import {
  formatSkillModSummary,
  skillModLocalBreakdown,
} from "./data/skill-mods";
import { SKILLS } from "./data/skills";

export function pushBonus(
  bonuses: ActiveBonus[],
  bonus: Omit<ActiveBonus, "id"> & { id?: string },
): void {
  bonuses.push({
    ...bonus,
    id: bonus.id ?? `${bonus.source}::${bonus.label}::${bonuses.length}`,
  });
}

export function clampExpertise(value: number | undefined): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(EXPERTISE_MAX, Math.round(value!)));
}

export function resolveActiveWeaponSlot(slot: WeaponSlot | undefined): WeaponSlot {
  if (slot === "secondary" || slot === "sidearm" || slot === "primary") return slot;
  return "primary";
}

export type ResolvedWeaponTalent = {
  name: string;
  description: string;
  locked: boolean;
  assumed?: StatBonus[];
  assumedNote?: string;
  passive?: boolean;
};

export function resolveWeaponTalent(
  def: WeaponDef,
  equipped?: EquippedWeapon | null,
): ResolvedWeaponTalent {
  if (def.quality !== "high-end") {
    const lib = weaponTalentByName(def.talent);
    return {
      name: def.talent,
      description: def.talentDesc,
      locked: true,
      assumed: def.assumed ?? lib?.assumed,
      assumedNote: def.assumedNote ?? lib?.assumedNote,
      passive: def.assumedPassive ?? lib?.passive,
    };
  }
  const override = weaponTalentById(equipped?.talentId);
  const fallback =
    override ??
    weaponTalentByName(def.talent) ??
    weaponTalentById(defaultWeaponTalentId(def.type));
  return {
    name: fallback?.name ?? def.talent,
    description: fallback?.description ?? def.talentDesc,
    locked: false,
    assumed: fallback?.assumed ?? def.assumed,
    assumedNote: fallback?.assumedNote ?? def.assumedNote,
    passive: fallback?.passive ?? def.assumedPassive,
  };
}

export function skillLocalStats(
  equipped: EquippedSkill,
  spec: string | null | undefined,
): SkillLocalStats | null {
  const skill = SKILLS.find((item) => item.id === equipped.skillId);
  if (!skill) return null;
  const expertise = clampExpertise(equipped.expertise);
  const { bonuses, extras } = skillModLocalBreakdown(
    skill.id,
    equipped.mods,
    spec,
  );
  if (expertise > 0) {
    bonuses.push({ stat: "skillDamage", value: expertise });
    bonuses.push({ stat: "skillRepair", value: expertise });
    bonuses.push({ stat: "skillHealth", value: expertise });
  }
  const summary = formatSkillModSummary(skill.id, equipped.mods, spec);
  return {
    skillId: skill.id,
    name: skill.name,
    expertise,
    bonuses,
    extras,
    summary,
  };
}

/**
 * Core Strength 4pc: each core grants a fraction of the other two cores' bonuses.
 * Rate is 40%, or 75% with the Inner Core chest talent.
 * Applied when Include maxed bonuses is on.
 */
export function coreStrengthConversion(
  cores: Record<CoreType, number>,
  rate = 0.4,
): StatBonus[] {
  const red = cores.red;
  const blue = cores.blue;
  const yellow = cores.yellow;
  const wdFromOthers = (blue + yellow) * CORE_VALUES.red.value * rate;
  const armorFromOthers = (red + yellow) * CORE_VALUES.blue.value * rate;
  const tierFromOthers = (red + blue) * CORE_VALUES.yellow.value * rate;
  const bonuses: StatBonus[] = [];
  if (wdFromOthers) bonuses.push({ stat: "weaponDamage", value: Math.round(wdFromOthers * 10) / 10 });
  if (armorFromOthers) bonuses.push({ stat: "armor", value: Math.round(armorFromOthers) });
  if (tierFromOthers) bonuses.push({ stat: "skillTier", value: Math.round(tierFromOthers * 10) / 10 });
  return bonuses;
}
