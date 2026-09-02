import type { StatBonus, WeaponType } from "../types";

export type WeaponTalentDef = {
  id: string;
  name: string;
  description: string;
  assumed?: StatBonus[];
  assumedNote?: string;
  /** Always-on while this talent is selected. */
  passive?: boolean;
  /** Omit = every weapon type. */
  types?: readonly WeaponType[];
};

export const WEAPON_TALENTS: WeaponTalentDef[] = [
  {
    id: "accurate",
    name: "Accurate",
    description: "Accuracy is increased by 30%.",
    assumed: [{ stat: "accuracy", value: 30 }],
    assumedNote: "Accurate is a permanent passive.",
    passive: true,
  },
  {
    id: "boiling-point",
    name: "Boiling Point",
    description:
      "The first 53% of your magazine will have -100% Critical Hit Chance. The rest will have 100%.",
    assumed: [{ stat: "chc", value: 100 }],
    assumedNote:
      "Max Boiling Point: remaining magazine at 100% Critical Hit Chance (first 53% is -100% CHC).",
  },
  {
    id: "boomerang",
    name: "Boomerang",
    description:
      "Critical hits have a 50% chance to return a bullet to the magazine. Non-critical hits have a 25% chance.",
    assumed: [{ stat: "magazineSize", value: 8 }],
    assumedNote: "Boomerang modeled as a modest magazine-size equivalent.",
  },
  {
    id: "breadbasket",
    name: "Breadbasket",
    description:
      "Landing body shots adds a stack of +8% Headshot Damage, up to 3 stacks. Headshot consumes the stacks.",
    assumed: [{ stat: "hsd", value: 24 }],
    assumedNote: "Max Breadbasket: 3 stacks × 8% Headshot Damage.",
  },
  {
    id: "close-personal",
    name: "Close & Personal",
    description: "Killing an enemy within 7m grants +30% weapon damage for 10s.",
    assumed: [{ stat: "weaponDamage", value: 30 }],
    assumedNote: "Max Close & Personal after a CQC kill.",
  },
  {
    id: "determined",
    name: "Determined",
    description:
      "Killing an enemy with a headshot guarantees that the next shot will be a critical headshot. A kill from that converted shot does not trigger another guaranteed headshot. Exclusive to pistols, rifles, and marksman rifles.",
    assumedNote:
      "Y8S3 Determined matches Perfect Determined: one guaranteed crit headshot after a true headshot kill (no chain). Not a sheet stat. Body-to-headshot chaining lives on Iron Will (exotic chest, Resolved), not this talent.",
    types: ["mmr", "rifle", "pistol"],
  },
  {
    id: "esagerato",
    name: "Esagerato",
    description: "Weapon handling is increased by 25%.",
    assumed: [{ stat: "weaponHandling", value: 25 }],
    assumedNote: "Esagerato is a permanent passive.",
    passive: true,
  },
  {
    id: "eyeless",
    name: "Eyeless",
    description: "+20% weapon damage to pulsed enemies. After 3 kills, the next shot pulses the target.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Max Eyeless vs pulsed targets.",
  },
  {
    id: "fast-hands",
    name: "Fast Hands",
    description: "Critical hits reduce reload time.",
    assumed: [{ stat: "reloadSpeed", value: 20 }],
    assumedNote: "Fast Hands crit-reload uptime.",
  },
  {
    id: "first-blood",
    name: "First Blood",
    description:
      "The first shot fired from a full magazine deals +15% headshot damage. Requires a Marksman Rifle.",
    assumed: [{ stat: "hsd", value: 15 }],
    assumedNote: "First Blood on the opening shot of each mag.",
    types: ["mmr"],
  },
  {
    id: "flatline",
    name: "Flatline",
    description: "Pulsed enemies take +15% weapon damage from this weapon.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Max Flatline vs pulsed targets.",
  },
  {
    id: "frenzy",
    name: "Frenzy",
    description: "For every 10 rounds fired, rate of fire is increased by 4% for 5s. Stacks up to 10 times.",
    assumed: [{ stat: "rateOfFire", value: 40 }],
    assumedNote: "Max Frenzy: 10 stacks × 4% Rate of Fire.",
    types: ["lmg", "ar"],
  },
  {
    id: "ignited",
    name: "Ignited",
    description: "+15% weapon damage against burning enemies.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Max Ignited vs burning targets.",
  },
  {
    id: "in-sync",
    name: "In Sync",
    description:
      "Hitting an enemy with this weapon grants +15% skill damage for 5s. Hitting with a skill grants +15% weapon damage for 5s.",
    assumed: [
      { stat: "weaponDamage", value: 15 },
      { stat: "skillDamage", value: 15 },
    ],
    assumedNote: "Max In Sync: both weapon and skill ping-pong buffs up.",
  },
  {
    id: "killer",
    name: "Killer",
    description: "Killing an enemy with a critical hit grants +30% Critical Hit Damage for 10s.",
    assumed: [{ stat: "chd", value: 30 }],
    assumedNote: "Max Killer after a critical-hit kill.",
  },
  {
    id: "lucky-shot",
    name: "Lucky Shot",
    description: "Magazine capacity is increased by 20%. Missed shots have a chance to return to the magazine.",
    assumed: [{ stat: "magazineSize", value: 20 }],
    assumedNote: "Lucky Shot magazine bonus is a permanent passive.",
    passive: true,
  },
  {
    id: "measured",
    name: "Measured",
    description:
      "The top half of the magazine deals +15% weapon damage. The bottom half grants +20% Optimal Range and +20% Rate of Fire.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Max Measured: top half of the magazine (+15% Weapon Damage).",
  },
  {
    id: "naked",
    name: "Naked",
    description: "When this weapon has no attachments, it deals +40% weapon damage.",
    assumed: [{ stat: "weaponDamage", value: 40 }],
    assumedNote: "Max Naked: +40% Weapon Damage with no attachments.",
  },
  {
    id: "optimist",
    name: "Optimist",
    description: "Weapon damage is increased by 3% for every 10% magazine missing.",
    assumed: [{ stat: "weaponDamage", value: 30 }],
    assumedNote: "Max Optimist: empty magazine (+3% per 10% missing).",
  },
  {
    id: "optimized",
    name: "Optimized",
    description: "Weapon mods are 30% more effective.",
    assumedNote: "Optimized already scales weapon mods ×1.3 in Analysis.",
  },
  {
    id: "overflowing",
    name: "Overflowing",
    description: "Every 3 reloads fills the magazine to 130% capacity.",
    assumed: [{ stat: "magazineSize", value: 10 }],
    assumedNote: "Overflowing averaged across reload cycles.",
  },
  {
    id: "preservation",
    name: "Preservation",
    description: "Killing an enemy repairs 5% armor over 5s. Headshot kills repair 10%.",
    assumed: [{ stat: "armorOnKill", value: 5 }],
    assumedNote: "Preservation as Armor on Kill equivalent.",
  },
  {
    id: "ranger",
    name: "Ranger",
    description: "Weapon damage increases with distance to the target.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Ranger at long range (no published cap — planning max).",
  },
  {
    id: "reformation",
    name: "Reformation",
    description: "Headshots repair 2% of your armor. 4s cooldown.",
    assumed: [{ stat: "armorRegenPercent", value: 1 }],
    assumedNote: "Reformation as a small ongoing repair.",
  },
  {
    id: "rifleman",
    name: "Rifleman",
    description:
      "Landing 3 consecutive shots grants +20% weapon damage for 4s. Missing resets the count.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Max Rifleman after 3 consecutive shots.",
    types: ["rifle", "mmr"],
  },
  {
    id: "sadist",
    name: "Sadist",
    description: "+15% weapon damage to bleeding enemies. After 3 kills, the next shot bleeds.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Max Sadist vs bleeding targets.",
  },
  {
    id: "salvage",
    name: "Salvage",
    description: "Killing an enemy with this weapon has a 50% chance to refill the magazine.",
    assumed: [{ stat: "reloadSpeed", value: 12 }],
    assumedNote: "Salvage modeled as extra reload uptime.",
  },
  {
    id: "spike",
    name: "Spike",
    description: "Headshots grant +20% skill damage for 10s.",
    assumed: [{ stat: "skillDamage", value: 20 }],
    assumedNote: "Max Spike after a headshot.",
  },
  {
    id: "steady-handed",
    name: "Steady Hands",
    description: "Kills grant a stack of 8% weapon handling, up to 5 stacks. Missing a shot removes a stack.",
    assumed: [{ stat: "weaponHandling", value: 40 }],
    assumedNote: "Max Steady Hands: 5 stacks × 8% Weapon Handling.",
  },
  {
    id: "strained",
    name: "Strained",
    description: "Gain 8% Critical Hit Damage for every 10% magazine missing.",
    assumed: [{ stat: "chd", value: 80 }],
    assumedNote: "Max Strained: empty magazine (+8% CHD per 10% missing).",
  },
  {
    id: "swift",
    name: "Swift",
    description: "Reloading from empty grants +20% weapon handling for 10s.",
    assumed: [{ stat: "weaponHandling", value: 20 }],
    assumedNote: "Max Swift after an empty reload.",
  },
  {
    id: "unhinged",
    name: "Unhinged",
    description: "+18% weapon damage, −20% weapon handling.",
    assumed: [
      { stat: "weaponDamage", value: 18 },
      { stat: "weaponHandling", value: -20 },
    ],
    assumedNote: "Unhinged is a permanent trade-off.",
    passive: true,
  },
  {
    id: "vindictive",
    name: "Vindictive",
    description: "Killing an enemy with a status effect applied grants +15% Critical Hit Chance for 10s.",
    assumed: [{ stat: "chc", value: 15 }],
    assumedNote: "Max Vindictive after a status-effect kill.",
  },
];

export function weaponTalentById(id: string | undefined | null): WeaponTalentDef | undefined {
  if (!id) return undefined;
  return WEAPON_TALENTS.find((talent) => talent.id === id);
}

export function weaponTalentByName(name: string | undefined | null): WeaponTalentDef | undefined {
  if (!name) return undefined;
  const raw = name.trim().toLowerCase();
  const exact = WEAPON_TALENTS.find((talent) => talent.name.toLowerCase() === raw);
  if (exact) return exact;
  const stripped = raw.replace(/^perfectly\s+/, "").replace(/^perfect\s+/, "");
  return WEAPON_TALENTS.find((talent) => talent.name.toLowerCase() === stripped);
}

export function weaponTalentsForType(type: WeaponType): WeaponTalentDef[] {
  return WEAPON_TALENTS.filter((talent) => !talent.types || talent.types.includes(type));
}

export function defaultWeaponTalentId(type: WeaponType): string {
  switch (type) {
    case "ar":
      return "optimist";
    case "lmg":
      return "fast-hands";
    case "smg":
      return "strained";
    case "shotgun":
      return "close-personal";
    case "mmr":
      return "first-blood";
    case "rifle":
      return "rifleman";
    case "pistol":
      return "killer";
    default:
      return "optimist";
  }
}
