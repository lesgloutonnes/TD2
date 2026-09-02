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

/**
 * Pickable high-end weapon talents (PvE live Y8S3).
 * Numbers from the Red Horizon Global PvP Balance talent table PvE column
 * (Ubisoft: PvE remains as currently in-game) plus the Into the Dark /
 * Red Horizon named-talent tables. Perfect-only talents stay off this picker.
 */
export const WEAPON_TALENTS: WeaponTalentDef[] = [
  {
    id: "back-and-forth",
    name: "Back and Forth",
    description:
      "Swapping to this weapon grants +10% Rate of Fire and +9% Weapon Damage for 10s. Swapping from this weapon grants +5% Rate of Fire and +4.5% Weapon Damage for 10s. Receiving one of the bonuses will remove the previous one if it's still active. Two instances of this Talent will not function at the same time.",
    assumed: [
      { stat: "rateOfFire", value: 10 },
      { stat: "weaponDamage", value: 9 },
    ],
    assumedNote: "Max Back and Forth: swap-to buff (+10% RoF / +9% Weapon Damage).",
    types: ["ar", "lmg", "smg", "shotgun", "mmr", "rifle"],
  },
  {
    id: "behind-you",
    name: "Behind You",
    description: "Amplifies weapon damage by 20% to enemies that are not targeting you.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Max Behind You vs enemies not targeting you.",
    types: ["rifle"],
  },
  {
    id: "boiling-point",
    name: "Boiling Point",
    description:
      "The first 53% of your magazine will have -100% Critical Hit Chance. The rest will have 100%.",
    assumed: [{ stat: "chc", value: 100 }],
    assumedNote:
      "Max Boiling Point: remaining magazine at 100% Critical Hit Chance (first 53% is -100% CHC).",
    types: ["ar", "smg", "lmg"],
  },
  {
    id: "boomerang",
    name: "Boomerang",
    description:
      "Critical hits have a 50% chance to return the bullet to the magazine. If a bullet is returned to the magazine the next shot gains 40% increased damage.",
    assumed: [{ stat: "weaponDamage", value: 40 }],
    assumedNote: "Max Boomerang: returned-bullet next shot (+40% Weapon Damage).",
    types: ["rifle"],
  },
  {
    id: "brazen",
    name: "Brazen",
    description:
      "Receive +3.5% Amplified Damage on the next shot with the weapon for each pellet that hits the target, if at least 6 pellets hit.",
    assumedNote:
      "Brazen amp scales with pellet count (3.5% per pellet, minimum 6). Not averaged as a flat Weapon Damage.",
    types: ["shotgun"],
  },
  {
    id: "breadbasket",
    name: "Breadbasket",
    description:
      "Landing body shots adds a stack of bonus +55% headshot damage to the next headshot for 10s. Max stack is 3.",
    assumed: [{ stat: "hsd", value: 165 }],
    assumedNote: "Max Breadbasket: 3 stacks × 55% Headshot Damage on the next headshot.",
  },
  {
    id: "close-personal",
    name: "Close & Personal",
    description: "Killing a target within 7m grants +30% weapon damage for 10s.",
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
    id: "eyeless",
    name: "Eyeless",
    description:
      "Amplifies Weapon Damage by 30% to blinded enemies. After 4 kills, applies blind to the next enemy you hit.",
    assumed: [{ stat: "weaponDamage", value: 30 }],
    assumedNote: "Max Eyeless vs blinded targets.",
  },
  {
    id: "fast-hands",
    name: "Fast Hands",
    description: "Critical hits add a stack of 3% reload speed bonus. Max stack is 40.",
    assumed: [{ stat: "reloadSpeed", value: 120 }],
    assumedNote: "Max Fast Hands: 40 stacks × 3% Reload Speed.",
  },
  {
    id: "finisher",
    name: "Finisher",
    description:
      "Swapping from this weapon within 10s of killing an enemy grants 30% critical hit chance and 30% critical hit damage for 15s.",
    assumed: [
      { stat: "chc", value: 30 },
      { stat: "chd", value: 30 },
    ],
    assumedNote: "Max Finisher after a kill-swap.",
    types: ["pistol"],
  },
  {
    id: "first-blood",
    name: "First Blood",
    description:
      "If scoped, your first shot fired from out of combat or after fully reloading from empty deals headshot damage to any part of the body hit. Requires a Scope with 8x magnification or higher.",
    assumedNote:
      "First Blood converts the opening scoped shot to a headshot (8×+). Not a sheet Headshot Damage bonus.",
    types: ["mmr"],
  },
  {
    id: "flatline",
    name: "Flatline",
    description:
      "Amplifies weapon damage by 15% to pulsed enemies. After 4 kills, applies pulse to the next enemy you hit.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Max Flatline vs pulsed targets.",
  },
  {
    id: "frenzy",
    name: "Frenzy",
    description:
      "For every 10 bullets in the magazine capacity, gain +3% rate of fire and +3% weapon damage for 9s when reloading from empty.",
    assumed: [
      { stat: "rateOfFire", value: 30 },
      { stat: "weaponDamage", value: 30 },
    ],
    assumedNote: "Planning max at a 100-round mag: 10 × 3% Rate of Fire and Weapon Damage for 9s after an empty reload.",
    types: ["lmg"],
  },
  {
    id: "future-perfect",
    name: "Future Perfect",
    description:
      "Weapon kills grant +1 skill tier for 15s. Stacks up to 3 times. Weapon kills at skill tier 6 grant overcharge for 15s. Overcharge Cooldown: 90s.",
    assumed: [{ stat: "skillTier", value: 3 }],
    assumedNote: "Max Future Perfect: 3 skill-tier stacks. Overcharge at tier 6 is not a sheet stat.",
  },
  {
    id: "head-scratcher",
    name: "Head Scratcher",
    description:
      "Deal 30% Amplified Damage to confused enemies. After 4 kills, applies Confuse to the enemy you hit.",
    assumedNote:
      "Amp vs confused enemies is not a sheet Weapon Damage average. Perfect Head Scratcher (35% / 3 kills) is named-only.",
  },
  {
    id: "ignited",
    name: "Ignited",
    description:
      "Amplifies Weapon Damage by 25% to burning enemies. After 4 kills, applies burn to the next enemy you hit.",
    assumed: [{ stat: "weaponDamage", value: 25 }],
    assumedNote: "Max Ignited vs burning targets.",
  },
  {
    id: "immobilize",
    name: "Immobilize",
    description:
      "Amplifies weapon damage by 20% to ensnared enemies. After 4 kills applies Ensnare to the next enemy you hit.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Max Immobilize vs ensnared targets.",
  },
  {
    id: "in-sync",
    name: "In Sync",
    description:
      "Hitting an enemy grants +15% skill damage for 5s. Using a skill or damaging an enemy with a skill grants +15% weapon damage for 5s. Damage increases are doubled while both buffs are active at the same time.",
    assumed: [
      { stat: "weaponDamage", value: 30 },
      { stat: "skillDamage", value: 30 },
    ],
    assumedNote: "Max In Sync: both buffs up (doubled to +30% Weapon Damage and +30% Skill Damage).",
  },
  {
    id: "killer",
    name: "Killer",
    description: "Killing an enemy with a critical hit grants +70% critical hit damage for 10s.",
    assumed: [{ stat: "chd", value: 70 }],
    assumedNote: "Max Killer after a critical-hit kill.",
  },
  {
    id: "lucky-shot",
    name: "Lucky Shot",
    description:
      "Magazine capacity is increased by 20%. Missed shots from cover have a 100% chance to return to the magazine.",
    assumed: [{ stat: "magazineSize", value: 20 }],
    assumedNote: "Lucky Shot magazine bonus is a permanent passive.",
    passive: true,
    types: ["mmr", "rifle", "pistol"],
  },
  {
    id: "measured",
    name: "Measured",
    description:
      "The top half of the magazine has 25% rate of fire and -25% weapon damage. The bottom half of the magazine has -18% rate of fire and +30% total weapon damage.",
    assumed: [{ stat: "weaponDamage", value: 30 }],
    assumedNote: "Max Measured: bottom half of the magazine (+30% Weapon Damage).",
    types: ["ar", "lmg", "smg"],
  },
  {
    id: "naked",
    name: "Naked",
    description: "Hitting an enemy with no armor grants +50% headshot damage for 5s.",
    assumed: [{ stat: "hsd", value: 50 }],
    assumedNote: "Max Naked vs an unarmored target.",
    types: ["mmr"],
  },
  {
    id: "near-sighted",
    name: "Near Sighted",
    description: "Receive +80% stability at the cost of -35% optimal range.",
    assumed: [
      { stat: "stability", value: 80 },
      { stat: "optimalRange", value: -35 },
    ],
    assumedNote: "Near Sighted is a permanent trade-off.",
    passive: true,
    types: ["ar"],
  },
  {
    id: "on-empty",
    name: "On Empty",
    description: "Reloading from empty grants +60% weapon handling for 10s.",
    assumed: [{ stat: "weaponHandling", value: 60 }],
    assumedNote: "Max On Empty after an empty reload.",
    types: ["ar"],
  },
  {
    id: "optimist",
    name: "Optimist",
    description: "Weapon damage is increased by +3.5% for every 10% ammo missing from the magazine.",
    assumed: [{ stat: "weaponDamage", value: 35 }],
    assumedNote: "Max Optimist: empty magazine (+3.5% per 10% missing).",
  },
  {
    id: "optimized",
    name: "Optimized",
    description: "Weapon mods are 30% more effective.",
    assumedNote: "Optimized already scales weapon mods ×1.3 in Analysis. Lexington named talent.",
  },
  {
    id: "outsider",
    name: "Outsider",
    description: "After killing an enemy, gain 100% optimal range and +100% accuracy for 10s.",
    assumed: [
      { stat: "optimalRange", value: 100 },
      { stat: "accuracy", value: 100 },
    ],
    assumedNote: "Max Outsider after a kill.",
    types: ["smg"],
  },
  {
    id: "overflowing",
    name: "Overflowing",
    description: "Every 3 reloads from empty increases your base magazine capacity by 100%.",
    assumed: [{ stat: "magazineSize", value: 100 }],
    assumedNote: "Max Overflowing: +100% magazine after 3 empty reloads.",
    types: ["ar"],
  },
  {
    id: "overwhelm",
    name: "Overwhelm",
    description:
      "Suppressing an enemy, that is not currently suppressed, grants +10% weapon damage for 12s. Max stack is 4.",
    assumed: [{ stat: "weaponDamage", value: 40 }],
    assumedNote: "Max Overwhelm: 4 stacks × 10% Weapon Damage.",
    types: ["lmg"],
  },
  {
    id: "perpetuation",
    name: "Perpetuation",
    description:
      "Headshots grant +75% status effect damage and duration to the next status effect you apply. Cooldown: 20s.",
    assumedNote: "Perpetuation buffs the next status apply. Not a sheet Weapon Damage average.",
  },
  {
    id: "precision-strike",
    name: "Precision Strike",
    description:
      "Killing enemies farther than 20m builds up stacks. Max stack is 3. Hitting an enemy within 20m will use all stacks to provide +20% Amplified Damage to enemies within 20m for 5s.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Max Precision Strike consume vs targets within 20m.",
    types: ["ar", "rifle", "mmr", "lmg"],
  },
  {
    id: "preservation",
    name: "Preservation",
    description:
      "Killing an enemy repairs 10% armor over 5s. Headshot kills improve the repair by an additional 10%.",
    assumed: [{ stat: "armorOnKill", value: 10 }],
    assumedNote: "Preservation body-kill repair as Armor on Kill equivalent (headshot kills repair 20%).",
  },
  {
    id: "pressure-point",
    name: "Pressure Point",
    description: "Amplifies Weapon Damage by 15% to enemies under Status Effects.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Max Pressure Point vs status-affected targets.",
  },
  {
    id: "pummel",
    name: "Pummel",
    description: "3 consecutive kills refills the magazine and grants +40% weapon damage for 10s.",
    assumed: [{ stat: "weaponDamage", value: 40 }],
    assumedNote: "Max Pummel after 3 consecutive kills.",
    types: ["shotgun"],
  },
  {
    id: "pumped-up",
    name: "Pumped Up",
    description: "Reloading grants +1.2% weapon damage for 10s. Stacks up to 25 times.",
    assumed: [{ stat: "weaponDamage", value: 30 }],
    assumedNote: "Max Pumped Up: 25 stacks × 1.2% Weapon Damage.",
    types: ["shotgun"],
  },
  {
    id: "ranger",
    name: "Ranger",
    description: "Amplifies weapon damage by 2% for every 4m you are away from your target.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Ranger at 40m (2% per 4m). No published cap — planning value.",
  },
  {
    id: "reformation",
    name: "Reformation",
    description: "Headshots grant +60% skill repair for 15s.",
    assumed: [{ stat: "skillRepair", value: 60 }],
    assumedNote: "Max Reformation after a headshot.",
  },
  {
    id: "rifleman",
    name: "Rifleman",
    description:
      "Landing headshots adds a stack of bonus +10% weapon damage for 5s. Max stack is 5. Additional headshots refresh the duration.",
    assumed: [{ stat: "weaponDamage", value: 50 }],
    assumedNote: "Max Rifleman: 5 stacks × 10% Weapon Damage.",
    types: ["rifle"],
  },
  {
    id: "sadist",
    name: "Sadist",
    description:
      "Amplifies Weapon Damage by 30% to bleeding enemies. After 4 kills, applies bleed to the next enemy you hit.",
    assumed: [{ stat: "weaponDamage", value: 30 }],
    assumedNote: "Max Sadist vs bleeding targets.",
  },
  {
    id: "salvage",
    name: "Salvage",
    description: "Killing a target has a +70% chance to refill the magazine.",
    assumedNote: "Salvage magazine refill is not a sheet Reload Speed average.",
    types: ["pistol"],
  },
  {
    id: "sledgehammer",
    name: "Sledgehammer",
    description:
      "Dealing damage with a grenade applies a mark on target. Targets with marks will take 15% more damage to armor and have a -20% movement speed. Mark disappears after 10 seconds. Marked targets take the Amplified Damage from all sources including other agents.",
    assumed: [{ stat: "damageToArmor", value: 15 }],
    assumedNote: "Max Sledgehammer on a grenade-marked target.",
  },
  {
    id: "soft-spot",
    name: "Soft Spot",
    description: "Destroying a Weakpoint grants +27% Weapon Damage for 10s.",
    assumed: [{ stat: "weaponDamage", value: 27 }],
    assumedNote: "Max Soft Spot after a weakpoint break.",
  },
  {
    id: "spike",
    name: "Spike",
    description: "Headshots grant +20% skill damage for 15s.",
    assumed: [{ stat: "skillDamage", value: 20 }],
    assumedNote: "Max Spike after a headshot.",
  },
  {
    id: "stabilize",
    name: "Stabilize",
    description:
      "Firing your weapon increases Weapon Accuracy by 1% and Weapon Stability by +1% per shot, up to +60%. If you stop firing, the bonuses reset after 4s.",
    assumed: [
      { stat: "accuracy", value: 60 },
      { stat: "stability", value: 60 },
    ],
    assumedNote: "Max Stabilize: 60 shots fired without pausing 4s.",
  },
  {
    id: "steady-hands",
    name: "Steady Handed",
    description:
      "Hits grant a stack of +1% Accuracy and Stability. At 100 stacks, consumes stacks to refill the magazine.",
    assumed: [
      { stat: "accuracy", value: 100 },
      { stat: "stability", value: 100 },
    ],
    assumedNote: "Max Steady Handed: 100 stacks just before the mag refill consume.",
  },
  {
    id: "strained",
    name: "Strained",
    description: "Gain 10% critical hit damage for every 0.5s you are firing. Stacks up to 5 times.",
    assumed: [{ stat: "chd", value: 50 }],
    assumedNote: "Max Strained: 5 stacks × 10% Critical Hit Damage.",
  },
  {
    id: "streamline",
    name: "Streamline",
    description: "Increase Weapon Damage by 42% when no Skills are Deployed or on Cooldown.",
    assumed: [{ stat: "weaponDamage", value: 42 }],
    assumedNote: "Max Streamline with no skills deployed or on cooldown.",
  },
  {
    id: "thunder-strike",
    name: "Thunder Strike",
    description:
      "Amplifies Weapon Damage by 30% to shocked enemies. After 4 kills, applies shock to the next enemy you hit.",
    assumed: [{ stat: "weaponDamage", value: 30 }],
    assumedNote: "Max Thunder Strike vs shocked targets.",
  },
  {
    id: "unhinged",
    name: "Unhinged",
    description: "Grants +18% weapon damage at the cost of -25% Stability and -25% Accuracy.",
    assumed: [
      { stat: "weaponDamage", value: 18 },
      { stat: "stability", value: -25 },
      { stat: "accuracy", value: -25 },
    ],
    assumedNote: "Unhinged is a permanent trade-off.",
    passive: true,
    types: ["lmg"],
  },
  {
    id: "unwavering",
    name: "Unwavering",
    description:
      "Swapping to this weapon grants +300% weapon handling for 5s. Kills refresh this buff. Swapping away disables this buff from all weapons for 5s.",
    assumed: [{ stat: "weaponHandling", value: 300 }],
    assumedNote: "Max Unwavering after swapping to this SMG.",
    types: ["smg"],
  },
  {
    id: "vindictive",
    name: "Vindictive",
    description:
      "Killing an enemy with a status effect applied grants 16% critical hit chance and 16% critical hit damage for you and all allies within 15m for 20s.",
    assumed: [
      { stat: "chc", value: 16 },
      { stat: "chd", value: 16 },
    ],
    assumedNote: "Max Vindictive after a status-effect kill (self and allies in 15m).",
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
