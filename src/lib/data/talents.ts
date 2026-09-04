import type { GearTalent } from "../types";

/**
 * High-end chest / backpack talents, PvE live text.
 * Perfect (℗) values from Ubisoft’s current PvE talent sheet
 * (Global PvP Balance notes: PvE unchanged; ℗ = Perfect named variant).
 */

export const CHEST_TALENTS: GearTalent[] = [
  {
    id: "braced",
    name: "Braced",
    slot: "chest",
    description: "While in cover, weapon handling is increased by 45%.",
    assumed: [{ stat: "weaponHandling", value: 45 }],
    assumedNote: "Assumes Braced in cover.",
  },
  {
    id: "perfect-braced",
    name: "Perfect Braced",
    slot: "chest",
    description: "While in cover, weapon handling is increased by 50%.",
    perfect: true,
    assumed: [{ stat: "weaponHandling", value: 50 }],
    assumedNote: "Assumes Perfect Braced in cover.",
  },
  {
    id: "efficient",
    name: "Efficient",
    slot: "chest",
    description:
      "Using an armor kit has a 50% chance to not consume the kit. Specialization armor kit bonuses are increased by 100%. Requires 10s to arm.",
    assumed: [{ stat: "incomingRepairs", value: 10 }],
    assumedNote: "Efficient kit bonuses modeled as +10% Incoming Repairs.",
  },
  {
    id: "perfect-efficient",
    name: "Perfect Efficient",
    slot: "chest",
    description:
      "Using an armor kit has a 75% chance to not consume the kit. Specialization armor kit bonuses are increased by 100%. Requires 10s to arm.",
    perfect: true,
    assumed: [{ stat: "incomingRepairs", value: 12 }],
    assumedNote: "Perfect Efficient kit bonuses modeled as +12% Incoming Repairs.",
  },
  {
    id: "empathic-resolve",
    name: "Empathic Resolve",
    slot: "chest",
    description:
      "Repairing an ally increases their total weapon and skill damage by 3–15% for 20s (1–7% if self). Effectiveness scales with Skill Tier.",
    assumed: [
      { stat: "weaponDamage", value: 15 },
      { stat: "skillDamage", value: 15 },
    ],
    assumedNote: "Max Empathic Resolve ally buff at Skill Tier 6.",
  },
  {
    id: "perfect-empathic-resolve",
    name: "Perfect Empathic Resolve",
    slot: "chest",
    description:
      "Repairing an ally increases their total weapon and skill damage by 3–20% for 20s (1–15% if self). Effectiveness scales with Skill Tier.",
    perfect: true,
    assumed: [
      { stat: "weaponDamage", value: 20 },
      { stat: "skillDamage", value: 20 },
    ],
    assumedNote: "Max Perfect Empathic Resolve ally buff at Skill Tier 6.",
  },
  {
    id: "entrench",
    name: "Entrench",
    slot: "chest",
    description:
      "If you are below 30% armor, headshots from cover repair 20% of your armor. Cooldown: 2s.",
    assumed: [{ stat: "armorRegenPercent", value: 2 }],
    assumedNote: "Entrench headshot repair modeled as +2% Armor Regeneration.",
  },
  {
    id: "perfect-entrench",
    name: "Perfect Entrench",
    slot: "chest",
    description:
      "If you are below 30% armor, headshots from cover repair 30% of your armor. Cooldown: 1s.",
    perfect: true,
    assumed: [{ stat: "armorRegenPercent", value: 3 }],
    assumedNote: "Perfect Entrench headshot repair modeled as +3% Armor Regeneration.",
  },
  {
    id: "explosive-delivery",
    name: "Explosive Delivery",
    slot: "chest",
    description:
      "Throwing a skill creates an explosion 1.5s after landing (5m). Damage scales with Skill Tier (25–100% of a concussion grenade). Once per skill. Applies to Remote Pulse, turrets, hives, Explosive / Cluster / Mender Seekers, and traps.",
    assumed: [{ stat: "explosiveDamage", value: 10 }],
    assumedNote: "Explosive Delivery extra burst modeled as +10% Explosive Damage.",
  },
  {
    id: "perfect-explosive-delivery",
    name: "Perfectly Explosive Delivery",
    slot: "chest",
    description:
      "Throwing a skill creates an explosion 1.5s after landing (5m), then every 5s. Damage scales with Skill Tier (25–100% of a concussion grenade). Once per skill. Also applies to Decoy.",
    perfect: true,
    assumed: [{ stat: "explosiveDamage", value: 15 }],
    assumedNote: "Perfect Explosive Delivery extra burst modeled as +15% Explosive Damage.",
  },
  {
    id: "focus",
    name: "Focus",
    slot: "chest",
    description:
      "Increases total weapon damage by 5% every second you are aiming while scoped 8× or higher, up to 50%.",
    assumed: [{ stat: "weaponDamage", value: 50 }],
    assumedNote: "Max Focus stacks while aiming an 8×+ scope (+50% Weapon Damage).",
  },
  {
    id: "perfect-focus",
    name: "Perfect Focus",
    slot: "chest",
    description:
      "Increases total weapon damage by 6% every second you are aiming while scoped 8× or higher, up to 60%.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 60 }],
    assumedNote: "Max Perfect Focus stacks while aiming an 8×+ scope (+60% Weapon Damage).",
  },
  {
    id: "glass-cannon",
    name: "Glass Cannon",
    slot: "chest",
    description: "All damage you deal is amplified by 25%. All damage you take is amplified by 50%.",
    assumed: [{ stat: "weaponDamage", value: 25 }, { stat: "skillDamage", value: 25 }],
    assumedNote: "Glass Cannon is always on (+25% all damage dealt).",
    passive: true,
  },
  {
    id: "perfect-glass-cannon",
    name: "Perfect Glass Cannon",
    slot: "chest",
    description: "All damage you deal is amplified by 30%. All damage you take is amplified by 60%.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 30 }, { stat: "skillDamage", value: 30 }],
    assumedNote: "Perfect Glass Cannon is always on.",
    passive: true,
  },
  {
    id: "gunslinger",
    name: "Gunslinger",
    slot: "chest",
    description:
      "Weapon swapping increases total weapon damage by 20% for 5s. This buff is lost for 5s if you weapon swap while it is active.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Assumes Gunslinger after a weapon swap.",
  },
  {
    id: "perfect-gunslinger",
    name: "Perfect Gunslinger",
    slot: "chest",
    description:
      "Weapon swapping increases total weapon damage by 28% for 5s. This buff is lost for 5s if you weapon swap while it is active.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 28 }],
    assumedNote: "Assumes Perfect Gunslinger after a weapon swap.",
  },
  {
    id: "headhunter",
    name: "Headhunter",
    slot: "chest",
    description:
      "After killing an enemy with a headshot, your next weapon hit within 30s deals an additional 125% of that killing blow's damage. Damage is capped to 800% of your weapon damage (1250% if your Headshot Damage is greater than 150%).",
  },
  {
    id: "perfect-headhunter",
    name: "Perfect Headhunter",
    slot: "chest",
    description:
      "After killing an enemy with a headshot, your next weapon hit within 30s deals an additional 150% of that killing blow's damage. Damage is capped to 800% of your weapon damage (1250% if your Headshot Damage is greater than 150%).",
    perfect: true,
  },
  {
    id: "intimidate",
    name: "Intimidate",
    slot: "chest",
    description:
      "While you have bonus armor, gain 1 stack each second up to a max of 7. Each stack increases total weapon damage by 5% to enemies within 10m. All stacks are lost when you have no bonus armor.",
    assumed: [{ stat: "weaponDamage", value: 35 }],
    assumedNote: "Max Intimidate: 7 stacks × 5% (bonus armor, targets within 10m).",
  },
  {
    id: "perfect-intimidate",
    name: "Perfect Intimidate",
    slot: "chest",
    description:
      "While you have bonus armor, gain 1 stack each second up to a max of 8. Each stack increases total weapon damage by 5% to enemies within 10m. All stacks are lost when you have no bonus armor.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 40 }],
    assumedNote: "Max Perfect Intimidate: 8 stacks × 5% (bonus armor, targets within 10m).",
  },
  {
    id: "kinetic-momentum",
    name: "Kinetic Momentum",
    slot: "chest",
    description:
      "While in combat, each skill generates stacks while it is active or not on cooldown. Each stack increases total skill damage by 1.5% and total skill repair by 2%, up to 15 stacks per skill. Stacks are lost when that skill goes on cooldown.",
    assumed: [{ stat: "skillDamage", value: 45 }, { stat: "skillRepair", value: 60 }],
    assumedNote: "Max Kinetic Momentum: 15 stacks on both skills.",
  },
  {
    id: "perfect-kinetic-momentum",
    name: "Perfect Kinetic Momentum",
    slot: "chest",
    description:
      "While in combat, each skill generates stacks while it is active or not on cooldown. Each stack increases total skill damage by 1.5% and total skill repair by 2%, up to 18 stacks per skill. Stacks are lost when that skill goes on cooldown.",
    perfect: true,
    assumed: [{ stat: "skillDamage", value: 54 }, { stat: "skillRepair", value: 72 }],
    assumedNote: "Max Perfect Kinetic Momentum: 18 stacks on both skills.",
  },
  {
    id: "mad-bomber",
    name: "Mad Bomber",
    slot: "chest",
    description:
      "Grenade radius is increased by 50%. Grenades that kill an enemy are refunded. Grenades can be cooked. Gain 15% bonus armor while aiming grenades.",
    assumed: [{ stat: "explosiveDamage", value: 15 }],
    assumedNote: "Mad Bomber radius/refund modeled as +15% Explosive Damage.",
  },
  {
    id: "perfect-mad-bomber",
    name: "Perfectly Mad Bomber",
    slot: "chest",
    description:
      "Grenade radius is increased by 75%. Grenades that kill an enemy are refunded. Grenades can be cooked. Gain 15% bonus armor while aiming grenades.",
    perfect: true,
    assumed: [{ stat: "explosiveDamage", value: 20 }],
    assumedNote: "Perfect Mad Bomber modeled as +20% Explosive Damage.",
  },
  {
    id: "obliterate",
    name: "Obliterate",
    slot: "chest",
    description: "Critical hits increase total weapon damage by 1% for 10s. Stacks up to 20 times.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Max Obliterate: 20 stacks.",
  },
  {
    id: "perfect-obliterate",
    name: "Perfect Obliterate",
    slot: "chest",
    description: "Critical hits increase total weapon damage by 1% for 10s. Stacks up to 24 times.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 24 }],
    assumedNote: "Max Perfect Obliterate: 24 stacks.",
  },
  {
    id: "overwatch",
    name: "Overwatch",
    slot: "chest",
    description:
      "After staying in cover for 10s, increase your and all allies' total weapon and skill damage by 12% as long as you remain in cover or in a cover-to-cover move.",
    assumed: [{ stat: "weaponDamage", value: 12 }, { stat: "skillDamage", value: 12 }],
    assumedNote: "Assumes Overwatch while remaining in cover.",
  },
  {
    id: "perfect-overwatch",
    name: "Perfect Overwatch",
    slot: "chest",
    description:
      "After staying in cover for 8s, increase your and all allies' total weapon and skill damage by 14% as long as you remain in cover or in a cover-to-cover move.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 14 }, { stat: "skillDamage", value: 14 }],
    assumedNote: "Assumes Perfect Overwatch while remaining in cover.",
  },
  {
    id: "protected-reload",
    name: "Protected Reload",
    slot: "chest",
    description:
      "Grants +20% bonus armor while reloading. Grants 0–18% of your armor as bonus armor to all other allies when they are reloading, based on your Armor (blue) cores.",
    assumed: [{ stat: "armorPercent", value: 5 }],
    assumedNote: "Protected Reload bonus armor averaged as +5% Total Armor.",
  },
  {
    id: "perfect-protected-reload",
    name: "Perfect Protected Reload",
    slot: "chest",
    description:
      "Grants +40% bonus armor while reloading. Grants 0–30% of your armor as bonus armor to all other allies when they are reloading, based on your Armor (blue) cores.",
    perfect: true,
    assumed: [{ stat: "armorPercent", value: 8 }],
    assumedNote: "Perfect Protected Reload bonus armor averaged as +8% Total Armor.",
  },
  {
    id: "reassigned",
    name: "Reassigned",
    slot: "chest",
    description: "Killing an enemy adds 1 round of a random special ammo into your sidearm. Cooldown: 15s.",
    assumed: [{ stat: "pistolDamage", value: 8 }],
    assumedNote: "Reassigned special ammo modeled as +8% Pistol Damage.",
  },
  {
    id: "perfect-reassigned",
    name: "Perfect Reassigned",
    slot: "chest",
    description: "Killing an enemy adds 1 round of a random special ammo into your sidearm. Cooldown: 8s.",
    perfect: true,
    assumed: [{ stat: "pistolDamage", value: 10 }],
    assumedNote: "Perfect Reassigned special ammo modeled as +10% Pistol Damage.",
  },
  {
    id: "skilled",
    name: "Skilled",
    slot: "chest",
    description: "Skill kills have a 25% chance to reset skill cooldowns.",
    assumed: [{ stat: "skillHaste", value: 10 }],
    assumedNote: "Skilled cooldown resets modeled as +10% Skill Haste.",
  },
  {
    id: "perfect-skilled",
    name: "Perfect Skilled",
    slot: "chest",
    description: "Skill kills have a 30% chance to reset skill cooldowns.",
    perfect: true,
    assumed: [{ stat: "skillHaste", value: 12 }],
    assumedNote: "Perfect Skilled cooldown resets modeled as +12% Skill Haste.",
  },
  {
    id: "spark",
    name: "Spark",
    slot: "chest",
    description: "Damaging an enemy with a skill increases total weapon damage by 15% for 15s.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Assumes Spark after dealing skill damage.",
  },
  {
    id: "perfect-spark",
    name: "Perfect Spark",
    slot: "chest",
    description: "Damaging an enemy with a skill increases total weapon damage by 18% for 20s.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 18 }],
    assumedNote: "Assumes Perfect Spark after dealing skill damage.",
  },
  {
    id: "spotter",
    name: "Spotter",
    slot: "chest",
    description: "Amplifies total weapon and skill damage by 15% to pulsed enemies.",
    assumed: [{ stat: "weaponDamage", value: 15 }, { stat: "skillDamage", value: 15 }],
    assumedNote: "Assumes targets are pulsed.",
  },
  {
    id: "perfect-spotter",
    name: "Perfect Spotter",
    slot: "chest",
    description: "Amplifies total weapon and skill damage by 20% to pulsed enemies.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 20 }, { stat: "skillDamage", value: 20 }],
    assumedNote: "Assumes Perfect Spotter vs pulsed targets.",
  },
  {
    id: "tag-team",
    name: "Tag Team",
    slot: "chest",
    description:
      "The last enemy you damaged with a skill is marked. Dealing weapon damage to that enemy consumes the mark to reduce active skill cooldowns by 6s. Cooldown: 4s.",
    assumed: [{ stat: "skillHaste", value: 12 }],
    assumedNote: "Tag Team cooldown shave modeled as +12% Skill Haste.",
  },
  {
    id: "trauma",
    name: "Trauma",
    slot: "chest",
    description:
      "Applies Blind to an enemy hit in the head. Cooldown: 30s. Applies Bleed to an enemy hit in the chest. Cooldown: 30s.",
    assumed: [{ stat: "statusEffects", value: 10 }],
    assumedNote: "Trauma Blind/Bleed procs modeled as +10% Status Effects.",
  },
  {
    id: "perfect-trauma",
    name: "Perfect Trauma",
    slot: "chest",
    description:
      "Applies Blind to an enemy hit in the head. Cooldown: 20s. Applies Bleed to an enemy hit in the chest. Cooldown: 20s.",
    perfect: true,
    assumed: [{ stat: "statusEffects", value: 12 }],
    assumedNote: "Perfect Trauma Blind/Bleed procs modeled as +12% Status Effects.",
  },
  {
    id: "unbreakable",
    name: "Unbreakable",
    slot: "chest",
    description: "When your armor is depleted, repair 95% of your armor. Cooldown: 60s.",
    assumed: [{ stat: "armorOnKill", value: 8 }],
    assumedNote: "Unbreakable emergency repair modeled as +8% Armor on Kill.",
  },
  {
    id: "perfect-unbreakable",
    name: "Perfect Unbreakable",
    slot: "chest",
    description: "When your armor is depleted, repair 100% of your armor. Cooldown: 55s.",
    perfect: true,
    assumed: [{ stat: "armorOnKill", value: 10 }],
    assumedNote: "Perfect Unbreakable emergency repair modeled as +10% Armor on Kill.",
  },
  {
    id: "vanguard",
    name: "Vanguard",
    slot: "chest",
    description:
      "Deploying a shield makes it invulnerable for 5s and grants 45% of your armor as bonus armor to all other allies for 20s. Cooldown: 25s.",
    assumed: [{ stat: "armorPercent", value: 10 }],
    assumedNote: "Vanguard group bonus armor averaged as +10% Total Armor.",
  },
  {
    id: "perfect-vanguard",
    name: "Perfect Vanguard",
    slot: "chest",
    description:
      "Deploying a shield makes it invulnerable for 5s and grants 50% of your armor as bonus armor to all other allies for 20s. Cooldown: 25s.",
    perfect: true,
    assumed: [{ stat: "armorPercent", value: 12 }],
    assumedNote: "Perfect Vanguard group bonus armor averaged as +12% Total Armor.",
  },
  {
    id: "berserk",
    name: "Berserk",
    slot: "chest",
    description: "Gain 2% total weapon damage for every 10% of missing armor, up to 20%.",
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Max Berserk: +20% Weapon Damage at 100% missing armor.",
  },
];

export const BACKPACK_TALENTS: GearTalent[] = [
  {
    id: "adrenaline-rush",
    name: "Adrenaline Rush",
    slot: "backpack",
    description:
      "When you are within 10m of an enemy, gain 20% bonus armor for 5s. Stacks up to 3 times. Cooldown: 5s.",
    assumed: [{ stat: "armorPercent", value: 60 }],
    assumedNote: "Max Adrenaline Rush: 3 stacks × 20% bonus armor.",
  },
  {
    id: "perfect-adrenaline-rush",
    name: "Perfect Adrenaline Rush",
    slot: "backpack",
    description:
      "When you are within 10m of an enemy, gain 23% bonus armor for 5s. Stacks up to 3 times. Cooldown: 5s.",
    perfect: true,
    assumed: [{ stat: "armorPercent", value: 69 }],
    assumedNote: "Max Perfect Adrenaline Rush: 3 stacks × 23% bonus armor.",
  },
  {
    id: "bloodsucker",
    name: "Bloodsucker",
    slot: "backpack",
    description:
      "Killing an enemy adds and refreshes a stack of +10% bonus armor for 10s. Max stack is 10.",
    assumed: [{ stat: "armorPercent", value: 100 }],
    assumedNote: "Max Bloodsucker: 10 stacks × 10% bonus armor.",
  },
  {
    id: "perfect-bloodsucker",
    name: "Perfect Bloodsucker",
    slot: "backpack",
    description:
      "Killing an enemy adds and refreshes a stack of +12% bonus armor for 10s. Max stack is 10.",
    perfect: true,
    assumed: [{ stat: "armorPercent", value: 120 }],
    assumedNote: "Max Perfect Bloodsucker: 10 stacks × 12% bonus armor.",
  },
  {
    id: "calculated",
    name: "Calculated",
    slot: "backpack",
    description: "Kills from cover reduce skill cooldowns by 10%.",
    assumed: [{ stat: "skillHaste", value: 10 }],
    assumedNote: "Calculated cover kills modeled as +10% Skill Haste.",
  },
  {
    id: "perfect-calculated",
    name: "Perfect Calculated",
    slot: "backpack",
    description: "Kills from cover reduce skill cooldowns by 15%.",
    perfect: true,
    assumed: [{ stat: "skillHaste", value: 15 }],
    assumedNote: "Perfect Calculated cover kills modeled as +15% Skill Haste.",
  },
  {
    id: "clutch",
    name: "Clutch",
    slot: "backpack",
    description:
      "When you are below 15% armor, critical hits repair 2.5% of missing armor. Kills allow you to repair up to 100% armor for 4–10s, based on your number of Weapon (red) cores.",
    assumed: [{ stat: "armorOnKill", value: 10 }],
    assumedNote: "Clutch crit-repair window modeled as +10% Armor on Kill.",
  },
  {
    id: "perfect-clutch",
    name: "Perfect Clutch",
    slot: "backpack",
    description:
      "When you are below 20% armor, critical hits repair 2.5% of missing armor. Kills allow you to repair up to 100% armor for 4–10s, based on your number of Weapon (red) cores.",
    perfect: true,
    assumed: [{ stat: "armorOnKill", value: 12 }],
    assumedNote: "Perfect Clutch crit-repair window modeled as +12% Armor on Kill.",
  },
  {
    id: "combined-arms",
    name: "Combined Arms",
    slot: "backpack",
    description: "Shooting an enemy increases total skill damage by 25% for 3s.",
    assumed: [{ stat: "skillDamage", value: 25 }],
    assumedNote: "Assumes Combined Arms after shooting an enemy.",
  },
  {
    id: "perfect-combined-arms",
    name: "Perfect Combined Arms",
    slot: "backpack",
    description: "Shooting an enemy increases total skill damage by 30% for 3s.",
    perfect: true,
    assumed: [{ stat: "skillDamage", value: 30 }],
    assumedNote: "Assumes Perfect Combined Arms after shooting an enemy.",
  },
  {
    id: "companion",
    name: "Companion",
    slot: "backpack",
    description: "While you are within 5m of an ally or skill, total weapon damage is increased by 15%.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Assumes ally or skill within 5m.",
  },
  {
    id: "perfect-companion",
    name: "Perfect Companion",
    slot: "backpack",
    description: "While you are within 10m of an ally or skill, total weapon damage is increased by 20%.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Assumes Perfect Companion (ally or skill within 10m).",
  },
  {
    id: "composure",
    name: "Composure",
    slot: "backpack",
    description: "While in cover, increases total weapon damage by 15%.",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Assumes Composure in cover.",
  },
  {
    id: "perfect-composure",
    name: "Perfect Composure",
    slot: "backpack",
    description: "While in cover, increases total weapon damage by 20%.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Assumes Perfect Composure in cover.",
  },
  {
    id: "concussion",
    name: "Concussion",
    slot: "backpack",
    description:
      "Headshots increase total weapon damage by 10% for 1.5s (5s with a Marksman Rifle). Headshot kills increase total weapon damage by 15% for 10s. Both buffs can be active at once (25% total weapon damage).",
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Concussion both buffs averaged as +15% Weapon Damage.",
  },
  {
    id: "perfect-concussion",
    name: "Perfect Concussion",
    slot: "backpack",
    description:
      "Headshots increase total weapon damage by 20% for 1.5s (5s with a Marksman Rifle). Headshot kills increase total weapon damage by 15% for 10s. Both buffs can be active at once.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 20 }],
    assumedNote: "Perfect Concussion both buffs averaged as +20% Weapon Damage.",
  },
  {
    id: "creeping-death",
    name: "Creeping Death",
    slot: "backpack",
    description:
      "When you apply a status effect, it is also applied to all enemies within 8m of your target. Cooldown: 15s.",
    assumed: [{ stat: "statusEffects", value: 10 }],
    assumedNote: "Creeping Death spread modeled as +10% Status Effects.",
  },
  {
    id: "perfect-creeping-death",
    name: "Perfect Creeping Death",
    slot: "backpack",
    description:
      "When you apply a status effect, it is also applied to all enemies within 10m of your target. Cooldown: 10s.",
    perfect: true,
    assumed: [{ stat: "statusEffects", value: 12 }],
    assumedNote: "Perfect Creeping Death spread modeled as +12% Status Effects.",
  },
  {
    id: "energize",
    name: "Energize",
    slot: "backpack",
    description:
      "Using an armor kit grants +1 Skill Tier for 15s. If already at Skill Tier 6, grants Overcharge. Cooldown: 60s.",
    assumed: [{ stat: "skillTier", value: 1 }],
    assumedNote: "Energize kit window: +1 Skill Tier.",
  },
  {
    id: "perfect-energize",
    name: "Perfect Energize",
    slot: "backpack",
    description:
      "Using an armor kit grants +1 Skill Tier for 15s. If already at Skill Tier 6, grants Overcharge. Cooldown: 30s.",
    perfect: true,
    assumed: [{ stat: "skillTier", value: 1 }],
    assumedNote: "Perfect Energize kit window: +1 Skill Tier.",
  },
  {
    id: "galvanize",
    name: "Galvanize",
    slot: "backpack",
    description:
      "Applying Blind, Ensnare, Confuse, or Shock to an enemy grants 40% of your armor as bonus armor to you and all allies within 20m of that enemy for 10s.",
    assumed: [{ stat: "armorPercent", value: 8 }],
    assumedNote: "Galvanize group bonus armor averaged as +8% Total Armor.",
  },
  {
    id: "perfect-galvanize",
    name: "Perfect Galvanize",
    slot: "backpack",
    description:
      "Applying Blind, Ensnare, Confuse, or Shock to an enemy grants 50% of your armor as bonus armor to you and all allies within 30m of that enemy for 10s.",
    perfect: true,
    assumed: [{ stat: "armorPercent", value: 10 }],
    assumedNote: "Perfect Galvanize group bonus armor averaged as +10% Total Armor.",
  },
  {
    id: "leadership",
    name: "Leadership",
    slot: "backpack",
    description:
      "Performing a cover-to-cover grants 15% of your armor as bonus armor to you and all allies for 10s. This is doubled if you end within 10m of an enemy. Cooldown: 10s.",
    assumed: [{ stat: "armorPercent", value: 8 }],
    assumedNote: "Leadership cover-to-cover bonus armor averaged as +8% Total Armor.",
  },
  {
    id: "perfect-leadership",
    name: "Perfect Leadership",
    slot: "backpack",
    description:
      "Performing a cover-to-cover grants 20% of your armor as bonus armor to you and all allies for 10s. This is tripled if you end within 10m of an enemy. Cooldown: 10s.",
    perfect: true,
    assumed: [{ stat: "armorPercent", value: 12 }],
    assumedNote: "Perfect Leadership cover-to-cover bonus armor averaged as +12% Total Armor.",
  },
  {
    id: "opportunistic",
    name: "Opportunistic",
    slot: "backpack",
    description:
      "Enemies you hit with a Shotgun or Marksman Rifle take 10% amplified damage from all sources for 5s.",
    assumed: [{ stat: "weaponDamage", value: 10 }],
    assumedNote: "Opportunistic debuff modeled as +10% Weapon Damage.",
  },
  {
    id: "perfect-opportunistic",
    name: "Perfectly Opportunistic",
    slot: "backpack",
    description:
      "Enemies you hit with a Shotgun or Marksman Rifle take 15% amplified damage from all sources for 5s.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Perfect Opportunistic debuff modeled as +15% Weapon Damage.",
  },
  {
    id: "overclock",
    name: "Overclock",
    slot: "backpack",
    description:
      "You and allies within 7m of your deployed skills gain +25% reload speed and reduce active skill cooldowns by 0.2s each second.",
    assumed: [
      { stat: "reloadSpeed", value: 25 },
      { stat: "skillHaste", value: 8 },
    ],
    assumedNote: "Overclock near a deployed skill.",
  },
  {
    id: "perfect-overclock",
    name: "Perfect Overclock",
    slot: "backpack",
    description:
      "You and allies within 15m of your deployed skills gain +30% reload speed and reduce active skill cooldowns by 0.6s each second.",
    perfect: true,
    assumed: [
      { stat: "reloadSpeed", value: 30 },
      { stat: "skillHaste", value: 12 },
    ],
    assumedNote: "Perfect Overclock near a deployed skill.",
  },
  {
    id: "protector",
    name: "Protector",
    slot: "backpack",
    description:
      "When your shield is damaged, you gain +5% and all other allies gain +15% of your armor as bonus armor for 3s. Cooldown: 3s.",
    assumed: [{ stat: "armorPercent", value: 8 }],
    assumedNote: "Protector shield-damage bonus armor averaged as +8% Total Armor.",
  },
  {
    id: "perfect-protector",
    name: "Perfect Protector",
    slot: "backpack",
    description:
      "When your shield is damaged, you gain +25% bonus armor and all other allies gain +35% of your armor as bonus armor for 3s. Cooldown: 3s.",
    perfect: true,
    assumed: [{ stat: "armorPercent", value: 12 }],
    assumedNote: "Perfect Protector shield-damage bonus armor averaged as +12% Total Armor.",
  },
  {
    id: "safeguard",
    name: "Safeguard",
    slot: "backpack",
    description: "While at full armor, increases total skill repair by 130%.",
    assumed: [{ stat: "skillRepair", value: 130 }],
    assumedNote: "Assumes Safeguard while at full armor.",
  },
  {
    id: "perfect-safeguard",
    name: "Perfect Safeguard",
    slot: "backpack",
    description: "While at full armor, increases total skill repair by 160%.",
    perfect: true,
    assumed: [{ stat: "skillRepair", value: 160 }],
    assumedNote: "Assumes Perfect Safeguard while at full armor.",
  },
  {
    id: "tamper-proof",
    name: "Tamper Proof",
    slot: "backpack",
    description:
      "Enemies that walk within 3m of your Hive, Turret, or Remote Pulse are shocked. Arm time: 2s. Cooldown per skill: 10s.",
    assumed: [{ stat: "statusEffects", value: 8 }],
    assumedNote: "Tamper Proof proximity shock modeled as +8% Status Effects.",
  },
  {
    id: "perfect-tamper-proof",
    name: "Perfectly Tamper Proof",
    slot: "backpack",
    description:
      "Enemies that walk within 3m of your Hive, Turret, Remote Pulse, or Decoy are shocked. Arm time: 2s. Cooldown per skill: 8s.",
    perfect: true,
    assumed: [{ stat: "statusEffects", value: 10 }],
    assumedNote: "Perfect Tamper Proof proximity shock modeled as +10% Status Effects.",
  },
  {
    id: "shock-and-awe",
    name: "Shock and Awe",
    slot: "backpack",
    description:
      "Applying a status effect to an enemy increases total skill damage and skill repair by 20% for 20s.",
    assumed: [{ stat: "skillDamage", value: 20 }, { stat: "skillRepair", value: 20 }],
    assumedNote: "Assumes Shock and Awe after applying a status effect.",
  },
  {
    id: "perfect-shock-and-awe",
    name: "Perfect Shock and Awe",
    slot: "backpack",
    description:
      "Applying a status effect to an enemy increases total skill damage and skill repair by 20% for 27s.",
    perfect: true,
    assumed: [{ stat: "skillDamage", value: 20 }, { stat: "skillRepair", value: 20 }],
    assumedNote: "Assumes Perfect Shock and Awe after applying a status effect.",
  },
  {
    id: "tech-support",
    name: "Tech Support",
    slot: "backpack",
    description: "Skill kills increase total skill damage by 25% for 20s.",
    assumed: [{ stat: "skillDamage", value: 25 }],
    assumedNote: "Assumes Tech Support after a skill kill.",
  },
  {
    id: "perfect-tech-support",
    name: "Perfect Tech Support",
    slot: "backpack",
    description: "Skill kills increase total skill damage by 25% for 27s.",
    perfect: true,
    assumed: [{ stat: "skillDamage", value: 25 }],
    assumedNote: "Assumes Perfect Tech Support after a skill kill.",
  },
  {
    id: "unstoppable-force",
    name: "Unstoppable Force",
    slot: "backpack",
    description: "Killing an enemy increases total weapon damage by 5% for 15s. Stacks up to 5 times.",
    assumed: [{ stat: "weaponDamage", value: 25 }],
    assumedNote: "Max Unstoppable Force: 5 stacks × 5%.",
  },
  {
    id: "perfect-unstoppable-force",
    name: "Perfectly Unstoppable Force",
    slot: "backpack",
    description:
      "Killing an enemy increases total weapon damage by 7% for 15s. Stacks up to 5 times. Grenade kills add 2 stacks.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 35 }],
    assumedNote: "Max Perfectly Unstoppable Force: 5 stacks × 7%.",
  },
  {
    id: "versatile",
    name: "Versatile",
    slot: "backpack",
    description:
      "Amplifies total weapon damage for 10s when swapping between primary and secondary weapons of different types. 35% within 15m (Shotgun/SMG), 35% beyond 25m (Rifle/Marksman Rifle), 10% between 15–25m (LMG/Assault Rifle). At most once per 5s per weapon type.",
    assumed: [{ stat: "weaponDamage", value: 35 }],
    assumedNote: "Max Versatile CQC bracket after a weapon swap (+35% within 15m).",
  },
  {
    id: "perfect-versatile",
    name: "Perfect Versatile",
    slot: "backpack",
    description:
      "Amplifies total weapon damage for 10s when swapping between primary and secondary weapons of different types. 45% within 15m (Shotgun/SMG), 40% beyond 25m (Rifle/Marksman Rifle), 20% between 15–25m (LMG/Assault Rifle). At most once per 5s per weapon type.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 45 }],
    assumedNote: "Max Perfect Versatile CQC bracket after a weapon swap (+45% within 15m).",
  },
  {
    id: "vigilance",
    name: "Vigilance",
    slot: "backpack",
    description: "Increases total weapon damage by 25%. Taking damage disables this buff for 4s.",
    assumed: [{ stat: "weaponDamage", value: 25 }],
    assumedNote: "Assumes Vigilance (not damaged recently).",
  },
  {
    id: "perfect-vigilance",
    name: "Perfect Vigilance",
    slot: "backpack",
    description: "Increases total weapon damage by 25%. Taking damage disables this buff for 3s.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 25 }],
    assumedNote: "Assumes Perfect Vigilance (not damaged recently).",
  },
  {
    id: "wicked",
    name: "Wicked",
    slot: "backpack",
    description: "Applying a status effect increases total weapon damage by 18% for 20s.",
    assumed: [{ stat: "weaponDamage", value: 18 }],
    assumedNote: "Assumes Wicked after applying a status effect.",
  },
  {
    id: "perfect-wicked",
    name: "Perfect Wicked",
    slot: "backpack",
    description: "Applying a status effect increases total weapon damage by 18% for 27s.",
    perfect: true,
    assumed: [{ stat: "weaponDamage", value: 18 }],
    assumedNote: "Assumes Perfect Wicked after applying a status effect.",
  },
];

export const ALL_TALENTS: GearTalent[] = [...CHEST_TALENTS, ...BACKPACK_TALENTS];

export function talentsForSlot(slot: "chest" | "backpack"): GearTalent[] {
  return ALL_TALENTS.filter((talent) => talent.slot === slot);
}

export function talentByName(name: string): { name: string; description: string } {
  const talent = ALL_TALENTS.find((item) => item.name === name);
  if (!talent) {
    throw new Error(`Unknown gear talent: ${name}`);
  }
  return { name: talent.name, description: talent.description };
}
