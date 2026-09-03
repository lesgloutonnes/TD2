import type { CoreType, GearSetDef, Slot, StatBonus } from "../types";

/**
 * Gear sets, PvE live Y8S3 (TU 2.34, Red Horizon).
 * Red-core rebalance + Ortiz: Exuro + True Patriot from Ubisoft
 * “Red Horizon Gear Updates” (https://ubi.li/4Yvr2 → canopy PDF, 24 Aug 2026).
 * Ember Engine 4pc/chest/backpack from the 26 Aug live article (PTS was 20%/40%).
 * 4pc / chest / backpack talent wording is official PvE text (Ubisoft talent tables),
 * with live Y8S3 numbers overlaid where Red Horizon changed them.
 * Blue/yellow-core sets were not in this pass unless listed.
 */

export const GEAR_SETS: GearSetDef[] = [
  {
    id: "striker",
    name: "Striker's Battlegear",
    color: "#e23d3d",
    core: "red",
    two: "+15% Weapon Handling",
    three: "+15% Rate of Fire",
    four: "Striker's Gamble — Weapon hits increase total weapon damage by 0.65%, stacking up to 100 times. 1 stack lost per second between 0 and 50 stacks; 2 stacks lost per second between 51 and 100 stacks.",
    twoStats: [{ stat: "weaponHandling", value: 15 }],
    threeStats: [{ stat: "rateOfFire", value: 15 }],
    fourStats: [{ stat: "weaponDamage", value: 65 }],
    fourAssumedNote: "Max 100 stacks × 0.65% = +65% Weapon Damage. Chest 200 stacks. Backpack 1%/stack.",
    backpackTalent: {
      name: "Risk Management",
      description: "Increases total weapon damage gained per stack of Striker's Gamble from 0.65% to 1%.",
    },
    chestTalent: {
      name: "Press the Advantage",
      description: "Increases max stacks for Striker's Gamble from 100 to 200. 3 stacks lost per second between 101 and 200 stacks.",
    },
  },
  {
    id: "heartbreaker",
    name: "Heartbreaker",
    color: "#c23a5a",
    core: "blue",
    two: "+15% Assault Rifle Damage and LMG Damage",
    three: "+15% Weapon Handling",
    four: "Heartstopper — Headshots apply pulse for 5s. Weapon hits on pulsed enemies add and refresh a stack of +1% bonus armor and +1% weapon damage to pulsed enemies for 5s. Max stack is 50. Two stacks are lost per second.",
    twoStats: [
      { stat: "arDamage", value: 15 },
      { stat: "lmgDamage", value: 15 },
    ],
    threeStats: [{ stat: "weaponHandling", value: 15 }],
    fourStats: [{ stat: "weaponDamage", value: 50 }],
    fourAssumedNote: "Max 50 Heartstopper stacks (+50% Weapon Damage). Chest Max BPM: 100 stacks.",
    backpackTalent: {
      name: "Cold",
      description: "Increases total bonus armor gained per stack of Heartstopper from 1% to 2%.",
    },
    chestTalent: {
      name: "Max BPM",
      description: "Increases max stacks for Heartstopper from 50 to 100.",
    },
  },
  {
    id: "umbra",
    name: "Umbra Initiative",
    color: "#2d6a4f",
    core: "red",
    two: "+15% Critical Hit Chance",
    three: "+30% Reload Speed",
    four: "From the Shadows / Into the Light — While in cover, gain 10 stacks per second up to 50. Each stack grants 1.2% Critical Hit Damage and 0.4% Rate of Fire. Buff does not apply while shooting from cover. While out of cover and in combat, gain 10 stacks per second up to 50. Each stack grants 0.8% Armor Regeneration when consumed. Stacks consume 10 per second, only in cover. While out of cover, lose 2 stacks per second, or 1 stack per second if sprinting.",
    twoStats: [{ stat: "chc", value: 15 }],
    threeStats: [{ stat: "reloadSpeed", value: 30 }],
    fourStats: [{ stat: "chd", value: 50 }, { stat: "rateOfFire", value: 15 }],
    fourAssumedNote: "Max From the Shadows (in cover): 50 stacks modeled as +50% CHD / +15% RoF. Chest doubles the cap.",
    backpackTalent: {
      name: "Into the Light",
      description: "Increases max stacks for Into the Light from 50 to 100, stack gain from 10 to 20 and stack consumption from 10 to 20.",
    },
    chestTalent: {
      name: "From the Shadows",
      description: "Increases max stacks for From the Shadows from 50 to 100 and stack gain from 10 to 20.",
    },
  },
  {
    id: "hunters-fury",
    name: "Hunter's Fury",
    color: "#8b5a2b",
    core: "red",
    two: "+15% Shotgun Damage and SMG Damage",
    three: "+20% Armor on Kill and +50% Health on Kill",
    four: "Apex Predator — Enemies within 15m receive a debuff, amplifying your weapon damage against them by +20%. Killing a debuffed enemy with your weapon disorients other enemies within 5m, and amplifies weapon damage by 5% for 10s, stacking up to 5 times.",
    twoStats: [
      { stat: "shotgunDamage", value: 15 },
      { stat: "smgDamage", value: 15 },
    ],
    threeStats: [{ stat: "armorOnKill", value: 20 }],
    fourStats: [{ stat: "weaponDamage", value: 45 }],
    fourAssumedNote: "Max Apex Predator: +20% Weapon Damage in CQC plus 5 stacks × 5%.",
    backpackTalent: {
      name: "Overwhelming Force",
      description: "Increases the radius of disorient on Apex Predator kills from 5m to 10m.",
    },
    chestTalent: {
      name: "Endless Hunger",
      description: "Increases the duration of Apex Predator stacks from 10s to 30s.",
    },
  },
  {
    id: "negotiator",
    name: "Negotiator's Dilemma",
    color: "#3d8fe2",
    core: "red",
    two: "+15% Critical Hit Chance",
    three: "+20% Critical Hit Damage",
    four: "Crowd Control — Critical hits mark enemies for 20s, up to 3 marks total. When you critically hit a marked enemy, all other marked enemies take 60% of the damage dealt. Whenever a marked enemy dies, gain +10% Critical Hit Damage, stacking up to 10 times, or until combat ends.",
    twoStats: [{ stat: "chc", value: 15 }],
    threeStats: [{ stat: "chd", value: 20 }],
    fourStats: [{ stat: "chd", value: 100 }],
    fourAssumedNote: "Max Crowd Control kill stacks: 10 × +10% Critical Hit Damage.",
    backpackTalent: {
      name: "Critical Measures",
      description: "Increases Crowd Control damage to additional marked enemies from 60% to 100%.",
    },
    chestTalent: {
      name: "Target Rich Environment",
      description: "Increases Crowd Control mark count from 3 to 5.",
    },
  },
  {
    id: "hotshot",
    name: "Hotshot",
    color: "#c9a44a",
    core: "red",
    two: "+30% Marksman Rifle Damage",
    three: "+30% Headshot Damage and +30% Weapon Handling",
    four: "Headache — First headshot with a Marksman Rifle will increase next headshot by 80%. Second consecutive headshot with a Marksman Rifle will give +10% armor (if at full armor it will give bonus armor, max +50% of current armor value). Third consecutive headshot will refill magazine. From the fourth headshot forward, agents will get all 3 bonuses for each consecutive headshot kill. Missing a headshot will reset the cycle.",
    twoStats: [{ stat: "mmrDamage", value: 30 }],
    threeStats: [
      { stat: "hsd", value: 30 },
      { stat: "weaponHandling", value: 30 },
    ],
    fourStats: [{ stat: "weaponDamage", value: 80 }],
    fourAssumedNote: "Max Headache amplified Marksman shot: +80% Weapon Damage.",
    backpackTalent: {
      name: "Blessed",
      description: "Agents can miss a headshot before resetting the cycle.",
    },
    chestTalent: {
      name: "Daring",
      description: "Increase bonus armor from 50% to 100%.",
    },
  },
  {
    id: "rigger",
    name: "Rigger",
    color: "#4a90a4",
    core: "yellow",
    two: "+15% Skill Haste",
    three: "+15% Skill Duration",
    four: "Tend and Befriend — Interacting with your deployed skills grants the skill 25% skill damage for 10s. This buff cannot be refreshed. Interactions include: using / deploying the skill, changing the skill's target, healing the skill.",
    twoStats: [{ stat: "skillHaste", value: 15 }],
    threeStats: [{ stat: "skillDuration", value: 15 }],
    fourStats: [{ stat: "skillDamage", value: 25 }],
    fourAssumedNote: "Max Tend and Befriend: +25% Skill Damage. Chest Best Buds: +50%.",
    backpackTalent: {
      name: "Complete Uptime",
      description: "Cancelling your skills will reset their cooldown.",
    },
    chestTalent: {
      name: "Best Buds",
      description: "Increase the damage buff from 25% to 50%.",
    },
  },
  {
    id: "eclipse",
    name: "Eclipse Protocol",
    color: "#6b4c9a",
    core: "yellow",
    two: "+15% Status Effects",
    three: "+15% Skill Haste and +30% Hazard Protection",
    four: "Indirect Transmission — Your status effects now spread on kill to all enemies within 10m and refresh 50% of the duration.",
    twoStats: [{ stat: "statusEffects", value: 15 }],
    threeStats: [
      { stat: "skillHaste", value: 15 },
      { stat: "hazardProtection", value: 30 },
    ],
    fourStats: [{ stat: "statusEffects", value: 10 }],
    fourAssumedNote: "Indirect Transmission extra status uptime: +10% Status Effects.",
    backpackTalent: {
      name: "Symptom Aggravator",
      description: "Amplifies all damage you deal to status affected targets by 30%.",
    },
    chestTalent: {
      name: "Proliferation",
      description: "Increases Indirect Transmission range from 10m to 15m. Increases refresh percentage from 50% to 75%.",
    },
  },
  {
    id: "future-initiative",
    name: "Future Initiative",
    color: "#3ecf8e",
    core: "yellow",
    two: "+30% Repair Skills",
    three: "+15% Skill Haste and +30% Skill Duration",
    four: "Ground Control — Increases you and your allies' total weapon and skill damage by 15% when at full armor. When you repair an ally, you and all allies within 5m of you are also repaired for 60% of that amount.",
    twoStats: [{ stat: "skillRepair", value: 30 }],
    threeStats: [
      { stat: "skillHaste", value: 15 },
      { stat: "skillDuration", value: 30 },
    ],
    fourStats: [
      { stat: "weaponDamage", value: 15 },
      { stat: "skillDamage", value: 15 },
    ],
    fourAssumedNote: "Max Ground Control at full armor: +15% weapon and skill damage. Chest: +25%.",
    backpackTalent: {
      name: "Strategic Combat Support",
      description: "Increases Ground Control proximity repair from 60% to 120%.",
    },
    chestTalent: {
      name: "Tactical Superiority",
      description: "Increases Ground Control damage bonus from 15% to 25%.",
    },
  },
  {
    id: "foundry",
    name: "Foundry Bulwark",
    color: "#7a8a9a",
    core: "blue",
    two: "+10% Total Armor",
    three: "+1% Armor Regeneration and +50% Shield Health",
    four: "Makeshift Repairs — Whenever you or your shield take damage, 25% of that amount is repaired to both over 10s.",
    twoStats: [{ stat: "armorPercent", value: 10 }],
    threeStats: [
      { stat: "armorRegenPercent", value: 1 },
      { stat: "shieldHealth", value: 50 },
    ],
    fourStats: [{ stat: "armorPercent", value: 5 }],
    fourAssumedNote: "Max Makeshift Repairs modeled as +5% Total Armor equivalent.",
    backpackTalent: {
      name: "Process Refinery",
      description: "Decreases time taken for Makeshift Repairs from 10s to 5s.",
    },
    chestTalent: {
      name: "Improved Materials",
      description: "Increases Makeshift Repairs from 25% to 35%.",
    },
  },
  {
    id: "hard-wired",
    name: "Hard Wired",
    color: "#3ec8ff",
    core: "yellow",
    two: "+15% Skill Haste",
    three: "+15% Skill Damage and +30% Repair Skills",
    four: "Feedback Loop — Whenever you use or cancel a skill, your other skill's cooldown is automatically reduced by 30s while increasing total skill damage and repair by 10% for 20s. Feedback Loop can occur once every 20s.",
    twoStats: [{ stat: "skillHaste", value: 15 }],
    threeStats: [
      { stat: "skillDamage", value: 15 },
      { stat: "skillRepair", value: 30 },
    ],
    fourStats: [
      { stat: "skillDamage", value: 10 },
      { stat: "skillRepair", value: 10 },
    ],
    fourAssumedNote: "Max Feedback Loop buff: +10% Skill Damage and Repair Skills. Chest: +25%.",
    backpackTalent: {
      name: "Short Circuit",
      description: "Decreases Feedback Loop cooldown from 20s to 10s.",
    },
    chestTalent: {
      name: "Positive Reinforcement",
      description: "Increases Feedback Loop skill damage and repair bonus from +10% to +25%.",
    },
  },
  {
    id: "ongoing-directive",
    name: "Ongoing Directive",
    color: "#c45c2a",
    core: "red",
    two: "+15% Status Effects",
    three: "+30% Reload Speed",
    four: "Rules of Engagement — Shooting a status affected enemy will apply a mark. Killing a marked enemy grants a full clip of Hollow-Point Ammo for your active weapon, and half a clip of the agent's active weapon to the rest of the party. Mark lasts for 10 seconds. Hollow-Point Ammo amplifies weapon damage by 40% and applies bleed on hit.",
    twoStats: [{ stat: "statusEffects", value: 15 }],
    threeStats: [{ stat: "reloadSpeed", value: 30 }],
    fourStats: [{ stat: "weaponDamage", value: 40 }],
    fourAssumedNote: "Max Hollow-Point rounds: +40% Weapon Damage. Chest Parabellum: +60%.",
    backpackTalent: {
      name: "Trauma Specialist",
      description: "Increases duration of bleed status effects by 50%. Increases all bleed damage done by 100%.",
    },
    chestTalent: {
      name: "Parabellum Rounds",
      description: "Increases Hollow-Point Ammo damage amplification from 40% to 60%. Does not affect party ammo.",
    },
  },
  {
    id: "true-patriot",
    name: "True Patriot",
    color: "#3d5a9a",
    core: "blue",
    two: "+15% Weapon Handling",
    three: "+30% Magazine Size",
    four: "Red, White and Blue — Enemies you shoot receive stacking debuffs of Red/White/Blue. Changes every 2s. Red: Amplifies the enemy's damage taken by 15%. White: Hitting the enemy restores you and your allies' armor by 2% once every second. Blue: Decreases enemy damage dealt by 10%. Full Flag: Enemies that die while under the effect of all three debuffs create a 5m explosion, dealing damage equal to their total health and armor. Explosion strength is reduced on Named enemy deaths.",
    twoStats: [{ stat: "weaponHandling", value: 15 }],
    threeStats: [{ stat: "magazineSize", value: 30 }],
    fourStats: [{ stat: "armorRegenPercent", value: 2 }],
    fourAssumedNote: "Max white-stripe self-repair: +2% Armor Regeneration (sheet proxy). Backpack Patriotic Boost: White 2% → 5%. Red/Blue amps are enemy debuffs, not self WD.",
    backpackTalent: {
      name: "Patriotic Boost",
      description: "Increases Red, White and Blue debuff strength. Red: from 15% to 30%. White: from 2% to 5%. Blue: from 10% to 20%.",
    },
    chestTalent: {
      name: "Waving the Flag",
      description: "Increases Red, White and Blue rotation speed to 1s.",
    },
  },
  {
    id: "aces",
    name: "Aces and Eights",
    color: "#2a2a2a",
    core: "red",
    two: "+30% Marksman Rifle Damage and +30% Rifle Damage",
    three: "+30% Headshot Damage and +30% Weapon Handling",
    four: "Dead Man's Hand — Flip a card when landing shots with a Rifle or Marksman Rifle. After 5 cards are flipped, the damage of your next shot is amplified by 75%. More shots are enhanced the better the hand revealed. Four of a Kind: 4 shots. Full House: 3 shots. Aces and Eights: 2 shots. Flip an additional card on headshots.",
    twoStats: [
      { stat: "mmrDamage", value: 30 },
      { stat: "rifleDamage", value: 30 },
    ],
    threeStats: [
      { stat: "hsd", value: 30 },
      { stat: "weaponHandling", value: 30 },
    ],
    fourStats: [{ stat: "weaponDamage", value: 75 }],
    fourAssumedNote: "Max Dead Man's Hand amplified shot: +75% Weapon Damage. Chest No Limit: +100%.",
    backpackTalent: {
      name: "Ace in the Sleeve",
      description: "Amplifies 1 extra shot when revealing your hand.",
    },
    chestTalent: {
      name: "No Limit",
      description: "Increases Dead Man's Hand damage bonus from 75% to 100%.",
    },
  },
  {
    id: "tip-of-the-spear",
    name: "Tip of the Spear",
    color: "#6a3a2a",
    core: "red",
    two: "+20% Signature Weapon Damage",
    three: "+10% Weapon Damage",
    four: "Aggressive Recon — Getting a Signature Weapon kill gives +15% Signature Weapon Damage for 10s and +25% Reload Speed for the next reload of the weapon (the bonuses do not stack). Automatically regenerate Signature Weapon Ammo every 60s.",
    twoStats: [{ stat: "signatureWeaponDamage", value: 20 }],
    threeStats: [{ stat: "weaponDamage", value: 10 }],
    fourStats: [{ stat: "weaponDamage", value: 15 }],
    fourAssumedNote: "Max Aggressive Recon: +15% Weapon Damage after a signature kill. Chest: +30%. Backpack: +50% after emptying the signature weapon.",
    backpackTalent: {
      name: "Signature Moves",
      description: "+50% Weapon Damage for 15s after fully depleting the Signature Weapon of ammo. Doubles the amount of ammo generated by Aggressive Recon.",
    },
    chestTalent: {
      name: "Specialized Destruction",
      description: "Increase Aggressive Recon Signature Weapon Damage bonus from 15% to 30%. Every 3rd Signature Weapon kill generates Signature Weapon ammo.",
    },
  },
  {
    id: "system-corruption",
    name: "System Corruption",
    color: "#1a8a4a",
    core: "red",
    slotCores: {
      mask: "red",
      gloves: "red",
      holster: "red",
      backpack: "blue",
      chest: "blue",
      kneepads: "blue",
    },
    two: "+15% Armor on Kill",
    three: "+40% Disrupt Resistance and Pulse Resistance",
    four: "Hackstep Protocol — Replaces armor kits with an instant, infinite-use ability on a 20s cooldown, that repairs 20% armor, grants 50% bonus armor and hides your nameplate for 5s. Increases total weapon damage by 2% per 5% bonus armor gained, up to 20%.",
    twoStats: [{ stat: "armorOnKill", value: 15 }],
    threeStats: [
      { stat: "pulseResistance", value: 40 },
      { stat: "disruptResistance", value: 40 },
    ],
    fourStats: [{ stat: "armorPercent", value: 20 }],
    fourAssumedNote: "Max Hackstep Protocol window: +20% Total Armor.",
    backpackTalent: {
      name: "Multithreaded Execution",
      description: "Increases Hackstep Protocol bonus armor from 50% to 100%.",
    },
    chestTalent: {
      name: "Compiler Optimization",
      description: "Decreases Hackstep Protocol cooldown from 20s to 15s.",
    },
  },
  {
    id: "cavalier",
    name: "Cavalier",
    color: "#8a7a5a",
    core: "blue",
    two: "+30% Hazard Protection",
    three: "+40% Repair Skills",
    four: "Charging / Charged — Charging: For each second spent out of cover during combat, Agents will get 5% reduced incoming skill damage. Max 50%. Charged: While fully charged, gain immunity to any movement speed debuff and share this with all of the agent's hazard protection and the incoming skill damage reduction with all allies for 10 seconds. After Charged is consumed, Charging buff will resume if still in combat and out of cover.",
    twoStats: [{ stat: "hazardProtection", value: 30 }],
    threeStats: [{ stat: "skillRepair", value: 40 }],
    fourStats: [{ stat: "hazardProtection", value: 50 }],
    fourAssumedNote: "Max Charging protection: +50% (modeled as Hazard Protection). Chest Overcharging: +70%.",
    backpackTalent: {
      name: "Safe Charging",
      description: "Charging gives 10% protection per second.",
    },
    chestTalent: {
      name: "Overcharging",
      description: "Increases Charging max incoming damage protection to 70%.",
    },
  },
  {
    id: "exuro",
    name: "Ortiz: Exuro",
    color: "#e25d2a",
    core: "yellow",
    two: "+20% Burn Duration and +15% Skill Health",
    three: "+40% Burn Damage",
    four: "Ortiz Incinerator Turret Prototype — The Incinerator Turret spins 360°. You are immune to your own Incinerator Turret's fire. The Incinerator Turret explodes when disabled.",
    twoStats: [{ stat: "skillHealth", value: 15 }],
    threeStats: [{ stat: "statusEffects", value: 15 }],
    fourStats: [{ stat: "skillDamage", value: 10 }],
    fourAssumedNote:
      "Incinerator Prototype has no standing sheet WD. +10% Skill Damage is a soft proxy only. Heatstroke is +40% amplified damage vs turret-burned targets, not Increased Weapon Damage.",
    backpackTalent: {
      name: "Heatstroke",
      description:
        "+40% amplified damage against enemies set on fire by the Ortiz Incinerator Turret Prototype. +25% Ortiz Incinerator Turret Prototype Range.",
    },
    chestTalent: {
      name: "Chain Combustion",
      description: "Enemies set ablaze by the Ortiz Incinerator Turret Prototype ignite other enemies within 10m.",
    },
  },
  {
    id: "aegis",
    name: "Aegis",
    color: "#4a6a8a",
    core: "blue",
    two: "+70% Health",
    three: "+15% Total Armor",
    four: "Stoic — Get +3% Damage Resistance for every enemy that is targeting you. The bonus is multiplied by 1.X, where X is the number of agents in your group.",
    twoStats: [{ stat: "healthPercent", value: 70 }],
    threeStats: [{ stat: "armorPercent", value: 15 }],
    fourStats: [{ stat: "armorPercent", value: 8 }],
    fourAssumedNote: "Max Stoic resist modeled as +8% Total Armor equivalent.",
    backpackTalent: {
      name: "Polyethylene Plating",
      description: "Increase Stoic Damage Resistance bonus from 3% to 4%.",
    },
    chestTalent: {
      name: "Deceit",
      description: "Enemies targeting your Decoy also count towards the Stoic Damage Resistance bonus.",
    },
  },
  {
    id: "breaking-point",
    name: "Breaking Point",
    color: "#8a4a2a",
    core: "red",
    two: "+30% Rifle Damage and Marksman Rifle Damage",
    three: "+30% Headshot Damage and +30% Weapon Handling",
    four: "On Point — Hitting a shot with a Rifle or MMR grants a stack. Reloading will grant +2% Weapon Handling and +4% Weapon Damage per stack, for 20s. No stacks are acquired while the bonuses are active. The timer running out will refill your magazine. Switching weapons while the bonuses are active will stop the effect and refill your magazine. Switching weapons while the bonuses are not active will remove all stacks and refill your magazine.",
    twoStats: [
      { stat: "rifleDamage", value: 30 },
      { stat: "mmrDamage", value: 30 },
    ],
    threeStats: [
      { stat: "hsd", value: 30 },
      { stat: "weaponHandling", value: 30 },
    ],
    fourStats: [
      { stat: "weaponDamage", value: 40 },
      { stat: "weaponHandling", value: 20 },
    ],
    fourAssumedNote: "Max On Point modeled at 10 stacks: +40% Weapon Damage, +20% Handling. Backpack 9%/stack.",
    backpackTalent: {
      name: "Point of Honor",
      description: "Increases On Point Weapon Damage bonus from 4% to 9%.",
    },
    chestTalent: {
      name: "Point of No Return",
      description: "Increases On Point timer from 20s to 40s.",
    },
  },
  {
    id: "virtuoso",
    name: "Virtuoso",
    color: "#9a6a8a",
    core: "red",
    two: "+15% Weapon Handling and +15% Magazine Size",
    three: "+15% Weapon Damage",
    four: "Symphony — Killing an enemy further than 25m will provide +40% Weapon Damage to Shotguns, SMGs and Pistols, +20% Weapon Damage to ARs and LMGs and 25% Bonus Armor for 15s. Killing an enemy within 25m will provide +40% Weapon Damage to MMRs and Rifles, +20% Weapon Damage to ARs and LMGs and +30% Headshot Damage for 15s. Intermittently killing enemies from both ranges will build up stacks. At 4 stacks, all bonuses are multiplied by 1.5 and triggered at the same time for 15s. No stacks are acquired while talent bonuses are active.",
    twoStats: [
      { stat: "weaponHandling", value: 15 },
      { stat: "magazineSize", value: 15 },
    ],
    threeStats: [{ stat: "weaponDamage", value: 15 }],
    fourStats: [{ stat: "weaponDamage", value: 24 }],
    fourAssumedNote: "Max Symphony at 4 stacks × 1.5. Chest Fortissimo doubles weapon-damage bonuses.",
    backpackTalent: {
      name: "Accelerando",
      description: "Decrease the number of stacks needed to proc the Symphony double buffs from 4 to 3.",
    },
    chestTalent: {
      name: "Fortissimo",
      description: "Double the Weapon Damage of Symphony.",
    },
  },
  {
    id: "refactor",
    name: "Refactor",
    color: "#2a8a6a",
    core: "yellow",
    slotCores: {
      mask: "yellow",
      chest: "yellow",
      holster: "yellow",
      backpack: "blue",
      gloves: "blue",
      kneepads: "blue",
    },
    two: "+15% Status Effects",
    three: "+25% Skill Damage",
    four: "Return to Sender — Receive repairs of 10% of the damage dealt by your Skills. Your allies receive repairs of 20% of the damage dealt by your Skills. (Range 45m)",
    twoStats: [{ stat: "statusEffects", value: 15 }],
    threeStats: [{ stat: "skillDamage", value: 25 }],
    fourStats: [
      { stat: "skillRepair", value: 10 },
      { stat: "incomingRepairs", value: 5 },
    ],
    fourAssumedNote: "Return to Sender conversion: +10% Repair Skills, +5% Incoming Repairs.",
    backpackTalent: {
      name: "Over-engineered",
      description: "While at full Armor, repairs received from Return to Sender will provide Bonus Armor, up to 80% of your Total Armor. Does not apply to allies.",
    },
    chestTalent: {
      name: "Increased Interest",
      description: "Increase the repairs received from Return to Sender from 10% to 25% and from 20% to 35%.",
    },
  },
  {
    id: "measured-assembly",
    name: "Measured Assembly",
    color: "#4a8a4a",
    core: "yellow",
    two: "+15% Skill Haste",
    three: "+60% Repair Skills and +40% Explosive Resistance",
    four: "Huddle — Receive +1 Skill Tier for each ally Agent that is within the range of your Hive or Smart Cover. While at Skill Tier 6, having at least one ally Agent in the range of your Hive or Smart Cover for 4s will grant Overcharge for 15s. Cooldown: 40s. Mortars and enemy Skills that enter the range of your Hive or Smart Cover will be destroyed. Cooldown 10s. The cooldown is 20% faster for each ally Agent within the range of your Hive or Smart Cover.",
    twoStats: [{ stat: "skillHaste", value: 15 }],
    threeStats: [
      { stat: "skillRepair", value: 60 },
      { stat: "explosiveResistance", value: 40 },
    ],
    fourStats: [{ stat: "skillTier", value: 3 }],
    fourAssumedNote: "Max Huddle: +1 Skill Tier per nearby ally (3 allies).",
    backpackTalent: {
      name: "Smart Cooperation",
      description: "Decrease the cooldown for destroying Mortars and enemy Skills from 10s to 1s.",
    },
    chestTalent: {
      name: "Hivemind",
      description: "Decrease the Overcharge cooldown from 40s to 25s.",
    },
  },
  {
    id: "tipping-scales",
    name: "Tipping Scales",
    color: "#c4a02a",
    core: "red",
    two: "+30% Magazine Size",
    three: "+30% LMG Damage",
    four: "Throttle Control — Shooting builds stacks to a max of 50. Each stack provides +0.5% Weapon Handling and +5% Critical Hit Damage. Lose 6 stacks per second while not shooting. No stacks are lost if an enemy is Suppressed.",
    twoStats: [{ stat: "magazineSize", value: 30 }],
    threeStats: [{ stat: "lmgDamage", value: 30 }],
    fourStats: [
      { stat: "weaponHandling", value: 25 },
      { stat: "chd", value: 250 },
    ],
    fourAssumedNote: "Max Throttle Control: 50 stacks × 0.5% Handling and 5% CHD. Chest 75 stacks. Backpack 8% CHD/stack.",
    backpackTalent: {
      name: "Snowball",
      description: "Increase the Critical Hit Damage received per stack from 5% to 8%.",
    },
    chestTalent: {
      name: "Sustainability",
      description: "Increase the maximum number of stacks from 50 to 75.",
    },
  },
  {
    id: "concentrated-company",
    name: "Concentrated Company",
    color: "#5a7aaa",
    core: "red",
    two: "+10% Weapon Damage",
    three: "+30% Weapon Handling",
    four: "Camaraderie — Shooting an enemy marks them for 10s. When a marked enemy dies, receive one stack of 3% Weapon Damage and 3% Critical Hit Damage for each Ally or Skill that has contributed to killing that enemy, including yourself. Max stack is 35. Stacks decay every 10s. Maximum amount of marks that can be placed is 4.",
    twoStats: [{ stat: "weaponDamage", value: 10 }],
    threeStats: [{ stat: "weaponHandling", value: 30 }],
    fourStats: [
      { stat: "weaponDamage", value: 105 },
      { stat: "chd", value: 105 },
    ],
    fourAssumedNote: "Max Camaraderie: 35 stacks × 3% Weapon Damage and CHD. Chest All for One raises marks (4→8), not the stack cap. Backpack 6% WD/stack.",
    backpackTalent: {
      name: "One for All",
      description: "Increase the Weapon Damage bonus per stack from 3% to 6%.",
    },
    chestTalent: {
      name: "All for One",
      description: "Increase the amount of marks that can be placed from 4 to 8.",
    },
  },
  {
    id: "core-strength",
    name: "Core Strength",
    color: "#e2c03d",
    core: "red",
    two: "+10% Weapon Handling",
    three: "+5% Weapon Damage, Armor, and Skill Efficiency",
    four: "Core Exercise — For each Core attribute, receive 40% of the other two Core Attributes' bonuses. Skill Tiers count as 15% Skill Efficiency when these attributes are applied. All pieces from this Gear Set, apart from the Backpack, will feature random Core Attributes.",
    twoStats: [{ stat: "weaponHandling", value: 10 }],
    threeStats: [
      { stat: "weaponDamage", value: 5 },
      { stat: "armorPercent", value: 5 },
      { stat: "skillEfficiency", value: 5 },
    ],
    backpackTalent: {
      name: "Outer Core",
      description: "This Talent does not provide a direct change to the Core Exercise Talent. This Backpack features three Core Attributes.",
    },
    chestTalent: {
      name: "Inner Core",
      description: "Increase the percentage of the bonuses you receive from the other Cores from 40% to 75%.",
    },
  },
  {
    id: "reficere",
    name: "Ortiz: Reficere",
    color: "#6ad4a8",
    core: "yellow",
    two: "+8% Skill Efficiency",
    three: "+60% Repair Skills",
    four: "Ortiz Rapid Application Nanite Prototype — Healing Skills' Duration and Range are decreased by 90%, but their Healing Efficiency is increased by 150%. Healing an Ally with a Skill will provide them 30% Hazard Protection for 10s. Cooldown per ally: 10s.",
    twoStats: [{ stat: "skillEfficiency", value: 8 }],
    threeStats: [{ stat: "skillRepair", value: 60 }],
    fourStats: [
      { stat: "skillRepair", value: 20 },
      { stat: "hazardProtection", value: 15 },
    ],
    fourAssumedNote: "Nanite efficiency + ally-heal hazard: +20% Repair Skills, +15% Hazard Protection.",
    backpackTalent: {
      name: "Improved Dampeners",
      description: "Decrease the Range and Duration reduction from 90% to 25%.",
    },
    chestTalent: {
      name: "Overcharged Nanites",
      description: "Increase the Healing Efficiency bonus from 150% to 225%.",
    },
  },
  {
    id: "ember-engine",
    name: "Ember Engine",
    color: "#e25822",
    core: "yellow",
    two: "+8% Skill Efficiency",
    three: "+30% Status Effects",
    four: "Spontaneous Combustion — Every status effect has a 40% chance to also apply Burn. If Burn was already applied: +25% burn damage.",
    twoStats: [{ stat: "skillEfficiency", value: 8 }],
    threeStats: [{ stat: "statusEffects", value: 30 }],
    fourStats: [{ stat: "statusEffects", value: 10 }],
    fourAssumedNote:
      "Spontaneous Combustion is a 40% Burn proc (60% with Flashpoint) and +25% burn damage if already burning — not a standing Status bonus. +10% Status Effects is a sheet proxy only; not burn DPS.",
    backpackTalent: {
      name: "White Hot",
      description: "Burn damage debuff duration: +50%.",
    },
    chestTalent: {
      name: "Flashpoint",
      description: "Increases Spontaneous Combustion Burn chance from 40% to 60%.",
    },
  },
];

export function gearSetCore(set: GearSetDef, slot: Slot): CoreType {
  return set.slotCores?.[slot] ?? set.core;
}

export function gearSetCores(set: GearSetDef): Record<Slot, CoreType> {
  return {
    mask: gearSetCore(set, "mask"),
    backpack: gearSetCore(set, "backpack"),
    chest: gearSetCore(set, "chest"),
    gloves: gearSetCore(set, "gloves"),
    holster: gearSetCore(set, "holster"),
    kneepads: gearSetCore(set, "kneepads"),
  };
}

function wd(value: number): StatBonus[] {
  return [{ stat: "weaponDamage", value }];
}

/**
 * 4pc talent at maximum stacks / procs, including chest and backpack talent caps.
 * Core Strength is handled separately (core conversion).
 */
export function resolveFourPieceMax(
  set: GearSetDef,
  chestIsSet: boolean,
  backpackIsSet: boolean,
): { stats: StatBonus[]; note: string } | null {
  if (set.id === "core-strength") return null;

  switch (set.id) {
    case "striker": {
      const perStack = backpackIsSet ? 1 : 0.65;
      const stacks = chestIsSet ? 200 : 100;
      const value = Math.round(perStack * stacks * 10) / 10;
      return {
        stats: wd(value),
        note: `Max ${stacks} stacks × ${perStack}% = +${value}% Weapon Damage.`,
      };
    }
    case "heartbreaker": {
      const stacks = chestIsSet ? 100 : 50;
      const stats: StatBonus[] = [{ stat: "weaponDamage", value: stacks }];
      if (backpackIsSet) stats.push({ stat: "armorPercent", value: stacks * 2 });
      return {
        stats,
        note: backpackIsSet
          ? `Max ${stacks} Heartstopper stacks: +${stacks}% Weapon Damage and +${stacks * 2}% bonus armor (Cold).`
          : `Max ${stacks} Heartstopper stacks: +${stacks}% Weapon Damage.`,
      };
    }
    case "umbra": {
      const stacks = chestIsSet ? 100 : 50;
      return {
        stats: [
          { stat: "chd", value: stacks },
          { stat: "rateOfFire", value: Math.round(stacks * 0.3 * 10) / 10 },
        ],
        note: `Max From the Shadows (${stacks} stacks in cover): +${stacks}% CHD / +${Math.round(stacks * 0.3 * 10) / 10}% RoF.`,
      };
    }
    case "rigger": {
      const value = chestIsSet ? 50 : 25;
      return {
        stats: [{ stat: "skillDamage", value }],
        note: `Max Tend and Befriend: +${value}% Skill Damage.`,
      };
    }
    case "future-initiative": {
      const value = chestIsSet ? 25 : 15;
      return {
        stats: [
          { stat: "weaponDamage", value },
          { stat: "skillDamage", value },
        ],
        note: `Max Ground Control at full armor: +${value}% weapon and skill damage.`,
      };
    }
    case "hard-wired": {
      const value = chestIsSet ? 25 : 10;
      return {
        stats: [
          { stat: "skillDamage", value },
          { stat: "skillRepair", value },
        ],
        note: `Max Feedback Loop: +${value}% Skill Damage and Repair Skills.`,
      };
    }
    case "ongoing-directive": {
      const value = chestIsSet ? 60 : 40;
      return {
        stats: wd(value),
        note: `Max Hollow-Point rounds: +${value}% Weapon Damage.`,
      };
    }
    case "true-patriot": {
      const value = backpackIsSet ? 5 : 2;
      return {
        stats: [{ stat: "armorRegenPercent", value }],
        note: `Max white-stripe repair: +${value}% Armor Regeneration.`,
      };
    }
    case "aces": {
      const value = chestIsSet ? 100 : 75;
      return {
        stats: wd(value),
        note: `Max Dead Man's Hand amplified shot: +${value}% Weapon Damage.`,
      };
    }
    case "tip-of-the-spear": {
      const value = backpackIsSet ? 50 : chestIsSet ? 30 : 15;
      return {
        stats: wd(value),
        note: backpackIsSet
          ? "Max Signature Moves after emptying the signature weapon: +50% Weapon Damage."
          : `Max Aggressive Recon: +${value}% Weapon Damage.`,
      };
    }
    case "cavalier": {
      const value = chestIsSet ? 70 : 50;
      return {
        stats: [{ stat: "hazardProtection", value }],
        note: `Max Charging protection: +${value}% (modeled as Hazard Protection).`,
      };
    }
    case "breaking-point": {
      const perStack = backpackIsSet ? 9 : 4;
      const stacks = 10;
      return {
        stats: [
          { stat: "weaponDamage", value: perStack * stacks },
          { stat: "weaponHandling", value: 2 * stacks },
        ],
        note: `Max On Point modeled at ${stacks} stacks: +${perStack * stacks}% Weapon Damage, +${2 * stacks}% Handling.`,
      };
    }
    case "virtuoso": {
      const value = chestIsSet ? 48 : 24;
      return {
        stats: wd(value),
        note: chestIsSet
          ? "Max Symphony with Fortissimo: weapon-damage bonuses doubled."
          : "Max Symphony at 4 stacks × 1.5.",
      };
    }
    case "tipping-scales": {
      const stacks = chestIsSet ? 75 : 50;
      const chdEach = backpackIsSet ? 8 : 5;
      const handling = Math.round(stacks * 0.5 * 10) / 10;
      const chd = stacks * chdEach;
      return {
        stats: [
          { stat: "weaponHandling", value: handling },
          { stat: "chd", value: chd },
        ],
        note: `Max Throttle Control: ${stacks} stacks × 0.5% Handling and ${chdEach}% CHD.`,
      };
    }
    case "concentrated-company": {
      const stacks = 35;
      const wdEach = backpackIsSet ? 6 : 3;
      return {
        stats: [
          { stat: "weaponDamage", value: wdEach * stacks },
          { stat: "chd", value: 3 * stacks },
        ],
        note: `Max Camaraderie: ${stacks} stacks × ${wdEach}% Weapon Damage and 3% CHD. All for One raises marks (4→8), not the stack cap.`,
      };
    }
    default: {
      if (!set.fourStats?.length) return null;
      return {
        stats: set.fourStats,
        note: set.fourAssumedNote ?? `Max ${set.name} 4pc talent.`,
      };
    }
  }
}

/** Inner Core chest talent: 40% → 75% conversion from the other cores. */
export function coreStrengthRate(chestIsSet: boolean): number {
  return chestIsSet ? 0.75 : 0.4;
}

