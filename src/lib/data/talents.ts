import type { GearTalent } from "../types";

export const CHEST_TALENTS: GearTalent[] = [
  {
    id: "glass-cannon",
    name: "Glass Cannon",
    slot: "chest",
    description: "All damage dealt is amplified by 25%. All incoming damage is amplified by 50%.",
    assumed: [{ stat: "weaponDamage", value: 25 }, { stat: "skillDamage", value: 25 }],
    assumedNote: "Assumes Glass Cannon active (+25% all damage dealt).",
  },
  {
    id: "obliterate",
    name: "Obliterate",
    slot: "chest",
    description: "Critical hits increase total weapon damage by 1% for 5s. Stacks up to 25 times.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Assumes ~15 Obliterate stacks.",
  },
  {
    id: "unbreakable",
    name: "Unbreakable",
    slot: "chest",
    description: "When your armor is depleted, repair 95% of your armor. 60s cooldown.",
  },
  {
    id: "intimidate",
    name: "Intimidate",
    slot: "chest",
    description: "While within 8m of an enemy, total weapon damage is increased by 35% if you have bonus armor.",
    assumed: [{ stat: "weaponDamage", value: 35 }],
    assumedNote: "Assumes Intimidate active (bonus armor + CQC).",
  },
  {
    id: "spotter",
    name: "Spotter",
    slot: "chest",
    description: "Increases total weapon and skill damage against pulsed targets by 15%.",
    assumed: [{ stat: "weaponDamage", value: 15 }, { stat: "skillDamage", value: 15 }],
    assumedNote: "Assumes targets are pulsed.",
  },
  {
    id: "headhunter",
    name: "Headhunter",
    slot: "chest",
    description:
      "After landing a headshot, your next headshot within 5s is amplified, up to 125% of the first headshot's damage.",
  },
  {
    id: "kinetic-momentum",
    name: "Kinetic Momentum",
    slot: "chest",
    description:
      "Killing an enemy with a weapon grants 25% skill damage for 10s. Killing an enemy with a skill grants 25% weapon damage for 10s.",
    assumed: [
      { stat: "weaponDamage", value: 15 },
      { stat: "skillDamage", value: 15 },
    ],
    assumedNote: "Assumes alternating weapon/skill kills.",
  },
  {
    id: "spark",
    name: "Spark",
    slot: "chest",
    description: "Destroying an enemy skill grants 25% total weapon and skill damage for 20s.",
    assumed: [{ stat: "weaponDamage", value: 15 }, { stat: "skillDamage", value: 15 }],
    assumedNote: "Assumes ~60% Spark uptime.",
  },
  {
    id: "vanguard",
    name: "Vanguard",
    slot: "chest",
    description:
      "Deploying your shield grants invulnerability for 5s and shares 45% of your armor as bonus armor to allies for 20s. 60s cooldown.",
  },
  {
    id: "focus",
    name: "Focus",
    slot: "chest",
    description: "While standing still, gain 1% total weapon damage per second, up to 10%. Moving resets the bonus.",
    assumed: [{ stat: "weaponDamage", value: 10 }],
    assumedNote: "Assumes Focus at full stacks (standing still).",
  },
  {
    id: "efficient",
    name: "Efficient",
    slot: "chest",
    description:
      "Using an armor kit outside of combat does not consume it. While in combat, armor kits repair 20% more armor.",
  },
  {
    id: "braced",
    name: "Braced",
    slot: "chest",
    description: "While in cover, gain 40% weapon handling.",
    assumed: [{ stat: "weaponHandling", value: 40 }],
    assumedNote: "Assumes Braced in cover.",
  },
  {
    id: "mad-bomber",
    name: "Mad Bomber",
    slot: "chest",
    description: "Grants frag grenades. Killing an enemy with a grenade refunds a grenade.",
  },
  {
    id: "trauma",
    name: "Trauma",
    slot: "chest",
    description: "Landing a headshot applies Bleed to enemies within 8m. 15s cooldown.",
  },
  {
    id: "wicked",
    name: "Wicked",
    slot: "chest",
    description: "Applying a Status Effect grants 18% total weapon damage for 20s.",
    assumed: [{ stat: "weaponDamage", value: 18 }],
    assumedNote: "Assumes Wicked uptime after status application.",
  },
  {
    id: "protector",
    name: "Protector",
    slot: "chest",
    description: "When an ally within 5m takes damage, gain 40% bonus armor for 5s. 10s cooldown.",
  },
  {
    id: "berserk",
    name: "Berserk",
    slot: "chest",
    description: "Gain 2% total weapon damage for every 10% of missing armor, up to 20%.",
    assumed: [{ stat: "weaponDamage", value: 12 }],
    assumedNote: "Assumes ~60% missing armor (mid Berserk).",
  },
  {
    id: "perfect-glass-cannon",
    name: "Perfect Glass Cannon",
    slot: "chest",
    description: "All damage dealt is amplified by 30%. All incoming damage is amplified by 60%.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 30 }, { stat: "skillDamage", value: 30 }],
    assumedNote: "Assumes Perfect Glass Cannon active.",
  },
  {
    id: "reassigned",
    name: "Reassigned",
    slot: "chest",
    description: "Killing an enemy loads 1 random specialized ammo into your sidearm.",
  },
  {
    id: "perfect-reassigned",
    name: "Perfect Reassigned",
    slot: "chest",
    description: "Killing an enemy loads 1 random specialized ammo into your sidearm. 8s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-unbreakable",
    name: "Perfect Unbreakable",
    slot: "chest",
    description:
      "When your armor is depleted, repair 100% of your armor. 60s cooldown. Using an armor kit within 7s is free.",
    perfect: true,
  },
  {
    id: "perfect-vanguard",
    name: "Perfect Vanguard",
    slot: "chest",
    description:
      "Deploying your shield grants invulnerability for 7s and shares 60% of your armor as bonus armor to allies for 20s. 60s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-headhunter",
    name: "Perfect Headhunter",
    slot: "chest",
    description:
      "After landing a headshot, your next headshot within 5s is amplified, up to 150% of the first headshot's damage.",
    perfect: true,
  },
  {
    id: "perfect-spark",
    name: "Perfect Spark",
    slot: "chest",
    description: "Destroying an enemy skill grants 30% total weapon and skill damage for 20s.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 18 }, { stat: "skillDamage", value: 18 }],
    assumedNote: "Assumes ~60% Perfect Spark uptime.",
  },
  {
    id: "perfect-focus",
    name: "Perfect Focus",
    slot: "chest",
    description:
      "While standing still, gain 1.2% total weapon damage per second, up to 12%. Moving resets the bonus.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 12 }],
    assumedNote: "Assumes Perfect Focus at full stacks.",
  },
  {
    id: "perfect-efficient",
    name: "Perfect Efficient",
    slot: "chest",
    description:
      "Using an armor kit outside of combat does not consume it. While in combat, armor kits repair 30% more armor.",
    perfect: true,
  },
  {
    id: "perfect-braced",
    name: "Perfect Braced",
    slot: "chest",
    description: "While in cover, gain 50% weapon handling.",
    perfect: true,
    assumed: [{ stat: "weaponHandling", value: 50 }],
    assumedNote: "Assumes Perfect Braced in cover.",
  },
  {
    id: "perfect-intimidate",
    name: "Perfect Intimidate",
    slot: "chest",
    description: "While within 8m of an enemy, total weapon damage is increased by 40% if you have bonus armor.",
    perfect: true,
  },
  {
    id: "perfect-trauma",
    name: "Perfect Trauma",
    slot: "chest",
    description: "Landing a headshot applies Bleed to enemies within 10m. 12s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-skilled",
    name: "Perfect Skilled",
    slot: "chest",
    description: "Killing an enemy with a skill grants 25% skill damage for 15s. Stacks up to 3 times.",
    perfect: true,
  },
  {
    id: "perfect-companion",
    name: "Perfect Companion",
    slot: "chest",
    description: "While within 5m of an ally or skill, gain 20% total weapon damage.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Assumes Perfect Companion active.",
  },
  {
    id: "perfect-obliterate",
    name: "Perfect Obliterate",
    slot: "chest",
    description: "Critical hits increase total weapon damage by 1% for 5s. Stacks up to 30 times.",
    perfect: true,
  },
  {
    id: "perfect-gunslinger",
    name: "Perfect Gunslinger",
    slot: "chest",
    description: "Swapping weapons grants 25% total weapon damage for 8s. 8s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-empathic-resolve",
    name: "Perfect Empathic Resolve",
    slot: "chest",
    description:
      "Repairing an ally grants them 3% to 20% total weapon and skill damage for 10s, based on Skill Tier.",
    perfect: true,
  },
  {
    id: "perfect-overwatch",
    name: "Perfect Overwatch",
    slot: "chest",
    description:
      "Staying in cover for 5s grants you and nearby allies 15% total weapon and skill damage for 15s.",
    perfect: true,
  },
  {
    id: "perfect-protected-reload",
    name: "Perfect Protected Reload",
    slot: "chest",
    description:
      "While reloading, gain 40% bonus armor. Allies who reload share 0-30% of your armor as bonus armor, based on blue cores.",
    perfect: true,
  },
  {
    id: "perfect-entrench",
    name: "Perfect Entrench",
    slot: "chest",
    description: "Below 30% armor, landing a headshot while in cover repairs 30% armor. 2s cooldown.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 15 }, { stat: "skillDamage", value: 15 }],
    assumedNote: "Assumes Perfect Overwatch.",
  },
  {
    id: "perfect-mad-bomber",
    name: "Perfectly Mad Bomber",
    slot: "chest",
    description:
      "Increases grenade radius by 75%. Killing an enemy with a grenade refunds it. Grenades can be cooked. Aiming while holding a grenade grants 15% bonus armor.",
    perfect: true,
  },
  {
    id: "perfect-spotter",
    name: "Perfect Spotter",
    slot: "chest",
    description: "Increases total weapon and skill damage against pulsed targets by 20%.",
    perfect: true,
  },
  {
    id: "perfect-explosive-delivery",
    name: "Perfectly Explosive Delivery",
    slot: "chest",
    description:
      "Throwing a skill causes it to explode 1.5s after landing, then every 5s. Damage scales with Skill Tier.",
    perfect: true,
  },
  {
    id: "perfect-kinetic-momentum",
    name: "Perfect Kinetic Momentum",
    slot: "chest",
    description:
      "While in combat, each active skill generates stacks, granting 1.5% skill damage and 2% skill repair per stack, up to 18 stacks per skill.",
    perfect: true,
    assumed: [{ stat: "skillDamage", value: 20 }, { stat: "skillRepair", value: 20 }],
    assumedNote: "Assumes mid Kinetic Momentum stacks on both skills.",
  },
];

export const BACKPACK_TALENTS: GearTalent[] = [
  {
    id: "vigilance",
    name: "Vigilance",
    slot: "backpack",
    description: "Increases total weapon damage by 25%. Taking damage disables the buff for 4s.",
    assumed: [{ stat: "weaponDamage", value: 25 }],
    assumedNote: "Assumes Vigilance (not damaged recently).",
  },
  {
    id: "adrenaline-rush",
    name: "Adrenaline Rush",
    slot: "backpack",
    description: "Killing an enemy within 8m grants 20% bonus armor, up to 40%. Lasts 10s.",
  },
  {
    id: "bloodsucker",
    name: "Bloodsucker",
    slot: "backpack",
    description:
      "Killing an enemy adds and refreshes a stack of +10% bonus armor for 10s. Max stack is 10.",
  },
  {
    id: "companion",
    name: "Companion",
    slot: "backpack",
    description: "While within 5m of an ally or skill, gain 15% total weapon damage.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Assumes ally or skill within 5m.",
  },
  {
    id: "combined-arms",
    name: "Combined Arms",
    slot: "backpack",
    description: "Using a skill grants 25% total weapon damage for 8s.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Assumes Combined Arms after skill use.",
  },
  {
    id: "opportunistic",
    name: "Opportunistic",
    slot: "backpack",
    description: "Hitting an enemy causes them to take 10% increased damage from all sources for 5s.",
  },
  {
    id: "overwatch",
    name: "Overwatch",
    slot: "backpack",
    description:
      "Staying in cover for 5s grants you and nearby allies 12% total weapon and skill damage for 15s.",
  },
  {
    id: "safeguard",
    name: "Safeguard",
    slot: "backpack",
    description: "Repairing an ally grants them 25% increased healing received for 4s.",
    assumed: [{ stat: "weaponDamage", value: 12 }, { stat: "skillDamage", value: 12 }],
    assumedNote: "Assumes Overwatch cover pulse uptime.",
  },
  {
    id: "tech-support",
    name: "Tech Support",
    slot: "backpack",
    description: "Killing an enemy with a skill grants 25% skill damage and skill repair for 15s.",
    assumed: [{ stat: "skillDamage", value: 25 }, { stat: "skillRepair", value: 25 }],
    assumedNote: "Assumes Tech Support after skill kill.",
  },
  {
    id: "unstoppable-force",
    name: "Unstoppable Force",
    slot: "backpack",
    description: "Killing an enemy grants 4% total weapon damage for 15s. Stacks up to 5 times.",
  },
  {
    id: "versatile",
    name: "Versatile",
    slot: "backpack",
    description:
      "Weapon 1 deals 35% increased total weapon damage at 15m or beyond. Weapon 2 deals 35% increased total weapon damage within 15m.",
  },
  {
    id: "galvanize",
    name: "Galvanize",
    slot: "backpack",
    description: "Applying a Status Effect grants allies within 20m 40% bonus armor for 10s.",
    assumed: [{ stat: "weaponDamage", value: 10 }],
    assumedNote: "Assumes Versatile weapon-swap uptime.",
  },
  {
    id: "clutch",
    name: "Clutch",
    slot: "backpack",
    description:
      "When your armor is depleted, critical hits repair 3% armor and all hits repair 0.5% health for 4s. 15s cooldown.",
  },
  {
    id: "creeping-death",
    name: "Creeping Death",
    slot: "backpack",
    description: "Applying a Status Effect causes it to spread to enemies within 8m. 15s cooldown.",
  },
  {
    id: "tag-team",
    name: "Tag Team",
    slot: "backpack",
    description: "Hitting an enemy with a skill reduces all skill cooldowns by 5%.",
  },
  {
    id: "perfect-vigilance",
    name: "Perfect Vigilance",
    slot: "backpack",
    description: "Increases total weapon damage by 25%. Taking damage disables the buff for 3s.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 30 }],
    assumedNote: "Assumes Perfect Vigilance.",
  },
  {
    id: "concussion",
    name: "Concussion",
    slot: "backpack",
    description:
      "Landing a headshot grants 15% total weapon damage for 1.5s (3s with a Marksman Rifle). Killing an enemy with a headshot grants 10% total weapon damage for 10s.",
  },
  {
    id: "perfect-concussion",
    name: "Perfect Concussion",
    slot: "backpack",
    description:
      "Landing a headshot grants 20% total weapon damage for 1.5s (5s with a Marksman Rifle). Killing an enemy with a headshot grants 15% total weapon damage for 10s.",
    perfect: true,
  },
  {
    id: "perfect-protector",
    name: "Perfect Protector",
    slot: "backpack",
    description:
      "When your shield takes damage, gain 25% bonus armor and share 35% of your armor as bonus armor with allies for 3s. 3s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-clutch",
    name: "Perfect Clutch",
    slot: "backpack",
    description:
      "When your armor is depleted, critical hits repair 3.5% armor and all hits repair 0.6% health for 5s. 15s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-adrenaline-rush",
    name: "Perfect Adrenaline Rush",
    slot: "backpack",
    description: "Killing an enemy within 8m grants 25% bonus armor, up to 50%. Lasts 10s.",
    perfect: true,
  },
  {
    id: "perfect-bloodsucker",
    name: "Perfect Bloodsucker",
    slot: "backpack",
    description:
      "Killing an enemy adds and refreshes a stack of +12% bonus armor for 10s. Max stack is 10.",
    perfect: true,
  },
  {
    id: "perfect-combined-arms",
    name: "Perfect Combined Arms",
    slot: "backpack",
    description: "Using a skill grants 30% total weapon damage for 10s.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 30 }],
    assumedNote: "Assumes Perfect Combined Arms.",
  },
  {
    id: "perfect-tech-support",
    name: "Perfect Tech Support",
    slot: "backpack",
    description: "Killing an enemy with a skill grants 30% skill damage and skill repair for 15s.",
    perfect: true,
    assumed: [{ stat: "skillDamage", value: 30 }, { stat: "skillRepair", value: 30 }],
    assumedNote: "Assumes Perfect Tech Support.",
  },
  {
    id: "perfect-calculated",
    name: "Perfect Calculated",
    slot: "backpack",
    description: "Killing an enemy with a skill reduces all active skill cooldowns by 20%.",
    perfect: true,
  },
  {
    id: "perfect-shock-and-awe",
    name: "Perfect Shock and Awe",
    slot: "backpack",
    description: "Killing an enemy with a skill pulses enemies within 20m for 8s. 10s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-wicked",
    name: "Perfect Wicked",
    slot: "backpack",
    description: "Applying a Status Effect grants 21% total weapon damage for 20s.",
    perfect: true,
  },
  {
    id: "perfect-creeping-death",
    name: "Perfect Creeping Death",
    slot: "backpack",
    description: "Applying a Status Effect causes it to spread to enemies within 12m. 12s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-galvanize",
    name: "Perfect Galvanize",
    slot: "backpack",
    description: "Applying a Status Effect grants allies within 20m 50% bonus armor for 10s.",
    perfect: true,
  },
  {
    id: "perfect-safeguard",
    name: "Perfect Safeguard",
    slot: "backpack",
    description: "Repairing an ally grants them 30% increased healing received for 5s.",
    perfect: true,
  },
  {
    id: "perfect-overclock",
    name: "Perfect Overclock",
    slot: "backpack",
    description:
      "Allies within 15m of a deployed skill gain 30% increased reload speed and reduce active skill cooldowns by 0.6s per second.",
    perfect: true,
  },
  {
    id: "perfect-leadership",
    name: "Perfect Leadership",
    slot: "backpack",
    description:
      "Moving from cover to cover grants you and nearby allies 20% of your armor as bonus armor for 10s. Tripled while within 10m of an enemy. 10s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-versatile",
    name: "Perfect Versatile",
    slot: "backpack",
    description:
      "Swapping to a different weapon type grants 45% total weapon damage within 15m (Shotgun/SMG), 45% beyond 25m (Rifle/Marksman Rifle), or 20% between 15m and 25m (LMG/Assault Rifle).",
    perfect: true,
  },
  {
    id: "perfect-unstoppable-force",
    name: "Perfectly Unstoppable Force",
    slot: "backpack",
    description:
      "Killing an enemy grants 7% total weapon damage for 15s. Stacks up to 5 times. Killing an enemy with a grenade grants 2 stacks.",
    perfect: true,
  },
  {
    id: "perfect-opportunistic",
    name: "Perfectly Opportunistic",
    slot: "backpack",
    description:
      "Hitting an enemy with a Shotgun or Marksman Rifle causes them to take 15% increased damage from all sources for 5s.",
    perfect: true,
  },
  {
    id: "perfect-tamper-proof",
    name: "Perfectly Tamper Proof",
    slot: "backpack",
    description:
      "Enemies within 3m of a Hive, Turret, Remote Pulse, or Decoy are shocked. 2s arming time. 8s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-energize",
    name: "Perfect Energize",
    slot: "backpack",
    description:
      "Using an armor kit grants +1 Skill Tier for 15s. Reaching Skill Tier 6 grants Overcharge. 30s cooldown.",
    perfect: true,
  },
  {
    id: "perfect-composure",
    name: "Perfect Composure",
    slot: "backpack",
    description: "While in cover, gain 20% total weapon damage.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Assumes Perfect Versatile.",
  },
];

export const ALL_TALENTS: GearTalent[] = [...CHEST_TALENTS, ...BACKPACK_TALENTS];

export function talentsForSlot(slot: "chest" | "backpack"): GearTalent[] {
  return slot === "chest" ? CHEST_TALENTS : BACKPACK_TALENTS;
}
