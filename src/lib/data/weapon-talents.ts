import type { StatBonus, WeaponType } from "../types";

export type WeaponTalentDef = {
  id: string;
  name: string;
  description: string;
  assumed?: StatBonus[];
  assumedNote?: string;
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
    assumed: [{ stat: "hsd", value: 16 }],
    assumedNote: "Breadbasket at ~2 stacks.",
  },
  {
    id: "close-personal",
    name: "Close & Personal",
    description: "Killing an enemy within 7m grants +30% weapon damage for 10s.",
    assumed: [{ stat: "weaponDamage", value: 18 }],
    assumedNote: "Close & Personal mid-uptime in CQC.",
  },
  {
    id: "determined",
    name: "Determined",
    description: "Killing an enemy refreshes the current magazine.",
    assumed: [{ stat: "reloadSpeed", value: 15 }],
    assumedNote: "Determined modeled as extra reload uptime.",
  },
  {
    id: "esagerato",
    name: "Esagerato",
    description: "Weapon handling is increased by 25%.",
    assumed: [{ stat: "weaponHandling", value: 25 }],
    assumedNote: "Esagerato is a permanent passive.",
  },
  {
    id: "eyeless",
    name: "Eyeless",
    description: "+20% weapon damage to pulsed enemies. After 3 kills, the next shot pulses the target.",
    assumed: [{ stat: "weaponDamage", value: 12 }],
    assumedNote: "Eyeless vs pulsed targets, mid uptime.",
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
    assumed: [{ stat: "weaponDamage", value: 10 }],
    assumedNote: "Flatline vs pulsed targets.",
  },
  {
    id: "frenzy",
    name: "Frenzy",
    description: "For every 10 rounds fired, rate of fire is increased by 4% for 5s. Stacks up to 10 times.",
    assumed: [{ stat: "rateOfFire", value: 20 }],
    assumedNote: "Frenzy at ~5 stacks.",
    types: ["lmg", "ar"],
  },
  {
    id: "ignited",
    name: "Ignited",
    description: "+15% weapon damage against burning enemies.",
    assumed: [{ stat: "weaponDamage", value: 10 }],
    assumedNote: "Ignited vs burning targets, mid uptime.",
  },
  {
    id: "in-sync",
    name: "In Sync",
    description:
      "Hitting an enemy with this weapon grants +15% skill damage for 5s. Hitting with a skill grants +15% weapon damage for 5s.",
    assumed: [
      { stat: "weaponDamage", value: 10 },
      { stat: "skillDamage", value: 10 },
    ],
    assumedNote: "In Sync mid weapon/skill ping-pong.",
  },
  {
    id: "killer",
    name: "Killer",
    description: "Killing an enemy with a critical hit grants +30% Critical Hit Damage for 10s.",
    assumed: [{ stat: "chd", value: 18 }],
    assumedNote: "Killer mid uptime after crit kills.",
  },
  {
    id: "lucky-shot",
    name: "Lucky Shot",
    description: "Magazine capacity is increased by 20%. Missed shots have a chance to return to the magazine.",
    assumed: [{ stat: "magazineSize", value: 20 }],
    assumedNote: "Lucky Shot magazine bonus (permanent) plus return chance.",
  },
  {
    id: "measured",
    name: "Measured",
    description:
      "The top half of the magazine deals +15% weapon damage. The bottom half grants +20% Optimal Range and +20% Rate of Fire.",
    assumed: [
      { stat: "weaponDamage", value: 8 },
      { stat: "rateOfFire", value: 10 },
    ],
    assumedNote: "Measured averaged across a full magazine.",
  },
  {
    id: "naked",
    name: "Naked",
    description: "When this weapon has no attachments, it deals +40% weapon damage.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Naked at half value — builder still allows mods.",
  },
  {
    id: "optimist",
    name: "Optimist",
    description: "Weapon damage is increased by 3% for every 10% magazine missing.",
    assumed: [{ stat: "weaponDamage", value: 12 }],
    assumedNote: "Optimist at ~40% magazine remaining.",
  },
  {
    id: "optimized",
    name: "Optimized",
    description: "Weapon mods are 30% more effective.",
    assumed: [{ stat: "weaponHandling", value: 5 }],
    assumedNote: "Optimized mods already scale ×1.3 in Analysis; handling is a small extra.",
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
    assumed: [{ stat: "weaponDamage", value: 12 }],
    assumedNote: "Ranger at mid-long range.",
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
    assumed: [{ stat: "weaponDamage", value: 12 }],
    assumedNote: "Rifleman mid consecutive-shot uptime.",
    types: ["rifle", "mmr"],
  },
  {
    id: "sadist",
    name: "Sadist",
    description: "+15% weapon damage to bleeding enemies. After 3 kills, the next shot bleeds.",
    assumed: [{ stat: "weaponDamage", value: 10 }],
    assumedNote: "Sadist vs bleeding targets, mid uptime.",
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
    assumed: [{ stat: "skillDamage", value: 15 }],
    assumedNote: "Spike after a headshot, mid uptime.",
  },
  {
    id: "steady-handed",
    name: "Steady Hands",
    description: "Kills grant a stack of 8% weapon handling, up to 5 stacks. Missing a shot removes a stack.",
    assumed: [{ stat: "weaponHandling", value: 24 }],
    assumedNote: "Steady Hands at ~3 stacks.",
  },
  {
    id: "strained",
    name: "Strained",
    description: "Gain 8% Critical Hit Damage for every 10% magazine missing.",
    assumed: [{ stat: "chd", value: 24 }],
    assumedNote: "Strained at ~30% magazine remaining.",
  },
  {
    id: "swift",
    name: "Swift",
    description: "Reloading from empty grants +20% weapon handling for 10s.",
    assumed: [{ stat: "weaponHandling", value: 12 }],
    assumedNote: "Swift after empty reloads, mid uptime.",
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
  },
  {
    id: "vindictive",
    name: "Vindictive",
    description: "Killing an enemy with a status effect applied grants +15% Critical Hit Chance for 10s.",
    assumed: [{ stat: "chc", value: 10 }],
    assumedNote: "Vindictive after status kills, mid uptime.",
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
