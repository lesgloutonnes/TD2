import type { CoreType, GearSetDef, Slot, StatBonus } from "../types";

/**
 * Gear sets, PvE live Y8S3 (TU 2.34, Red Horizon).
 * Red-core rebalance + Ortiz: Exuro + True Patriot from Ubisoft
 * “Red Horizon Gear Updates” (https://ubi.li/4Yvr2 → canopy PDF, 24 Aug 2026).
 * Ember Engine 4pc/chest/backpack from the 26 Aug live article (PTS was 20%/40%).
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
    four: "Striker's Gamble — every hit increases total weapon damage by 0.65% (100 stacks). Stacks decay out of combat.",
    twoStats: [{ stat: "weaponHandling", value: 15 }],
    threeStats: [{ stat: "rateOfFire", value: 15 }],
    fourStats: [{ stat: "weaponDamage", value: 65 }],
    fourAssumedNote: "Max 100 stacks × 0.65% = +65% Weapon Damage. Chest 200 stacks. Backpack 1%/stack.",
    backpackTalent: {
      name: "Risk Management",
      description: "Damage per Striker's Gamble stack: 0.65% → 1%.",
    },
    chestTalent: {
      name: "Press the Advantage",
      description: "Max Striker's Gamble stacks: 100 → 200.",
    },
  },
  {
    id: "heartbreaker",
    name: "Heartbreaker",
    color: "#c23a5a",
    core: "blue",
    two: "+15% Assault Rifle Damage and LMG Damage",
    three: "+15% Weapon Handling",
    four: "Heartstopper — headshots pulse the enemy. Hits on pulsed targets grant 1% bonus armor and 1% weapon damage (50 stacks).",
    twoStats: [
      { stat: "arDamage", value: 15 },
      { stat: "lmgDamage", value: 15 },
    ],
    threeStats: [{ stat: "weaponHandling", value: 15 }],
    fourStats: [{ stat: "weaponDamage", value: 50 }],
    fourAssumedNote: "Max 50 Heartstopper stacks (+50% Weapon Damage). Chest Max BPM: 100 stacks.",
    backpackTalent: {
      name: "Cold",
      description: "Bonus armor per stack: 1% → 2%.",
    },
    chestTalent: {
      name: "Max BPM",
      description: "Max Heartstopper stacks: 50 → 100.",
    },
  },
  {
    id: "umbra",
    name: "Umbra Initiative",
    color: "#2d6a4f",
    core: "red",
    two: "+15% Critical Hit Chance",
    three: "+30% Reload Speed",
    four: "From the Shadows / Into the Light — gain stacks while in cover (Critical Hit Damage + Rate of Fire) and out of cover (Armor Regeneration).",
    twoStats: [{ stat: "chc", value: 15 }],
    threeStats: [{ stat: "reloadSpeed", value: 30 }],
    fourStats: [{ stat: "chd", value: 50 }, { stat: "rateOfFire", value: 15 }],
    fourAssumedNote: "Max From the Shadows (in cover): 50 stacks modeled as +50% CHD / +15% RoF. Chest doubles the cap.",
    backpackTalent: {
      name: "Into the Light",
      description: "Max Into the Light stacks: 50 → 100, gain and consumption doubled.",
    },
    chestTalent: {
      name: "From the Shadows",
      description: "Max From the Shadows stacks: 50 → 100, gain doubled.",
    },
  },
  {
    id: "hunters-fury",
    name: "Hunter's Fury",
    color: "#8b5a2b",
    core: "red",
    two: "+15% Shotgun Damage and SMG Damage",
    three: "+20% Armor on Kill and +50% Health on Kill",
    four: "Apex Predator — +20% weapon damage against enemies within 15m. On kill: disorient enemies and gain +5% damage (5 stacks, 10s).",
    twoStats: [
      { stat: "shotgunDamage", value: 15 },
      { stat: "smgDamage", value: 15 },
    ],
    threeStats: [{ stat: "armorOnKill", value: 20 }],
    fourStats: [{ stat: "weaponDamage", value: 45 }],
    fourAssumedNote: "Max Apex Predator: +20% Weapon Damage in CQC plus 5 stacks × 5%.",
    backpackTalent: {
      name: "Overwhelming Force",
      description: "Disorient radius: 5m → 10m.",
    },
    chestTalent: {
      name: "Endless Hunger",
      description: "Apex Predator stack duration: 10s → 30s.",
    },
  },
  {
    id: "negotiator",
    name: "Negotiator's Dilemma",
    color: "#3d8fe2",
    core: "red",
    two: "+15% Critical Hit Chance",
    three: "+20% Critical Hit Damage",
    four: "Crowd Control — critical hits mark enemies (max 3, 20s). Crits deal 60% of that damage to other marked targets. When a marked enemy dies: +10% Critical Hit Damage (10 stacks, until combat ends).",
    twoStats: [{ stat: "chc", value: 15 }],
    threeStats: [{ stat: "chd", value: 20 }],
    fourStats: [{ stat: "chd", value: 100 }],
    fourAssumedNote: "Max Crowd Control kill stacks: 10 × +10% Critical Hit Damage.",
    backpackTalent: {
      name: "Critical Measures",
      description: "Damage dealt to other marked targets: 60% → 100%.",
    },
    chestTalent: {
      name: "Target Rich Environment",
      description: "Max marks: 3 → 5.",
    },
  },
  {
    id: "hotshot",
    name: "Hotshot",
    color: "#c9a44a",
    core: "red",
    two: "+30% Marksman Rifle Damage",
    three: "+30% Headshot Damage and +30% Weapon Handling",
    four: "Headache — first Marksman Rifle headshot: +80% to the next headshot. Second consecutive: +10% armor (bonus armor up to 50% if already full). Third: mag refill. From the fourth consecutive headshot kill, all three bonuses apply. A missed headshot resets the cycle.",
    twoStats: [{ stat: "mmrDamage", value: 30 }],
    threeStats: [
      { stat: "hsd", value: 30 },
      { stat: "weaponHandling", value: 30 },
    ],
    fourStats: [{ stat: "weaponDamage", value: 80 }],
    fourAssumedNote: "Max Headache amplified Marksman shot: +80% Weapon Damage.",
    backpackTalent: {
      name: "Blessed",
      description: "A missed headshot no longer resets the cycle.",
    },
    chestTalent: {
      name: "Daring",
      description: "Bonus armor: 50% → 100%.",
    },
  },
  {
    id: "rigger",
    name: "Rigger",
    color: "#4a90a4",
    core: "yellow",
    two: "+15% Skill Haste",
    three: "+15% Skill Duration",
    four: "Tend and Befriend — interacting with a deployed skill grants it +25% damage for 10s.",
    twoStats: [{ stat: "skillHaste", value: 15 }],
    threeStats: [{ stat: "skillDuration", value: 15 }],
    fourStats: [{ stat: "skillDamage", value: 25 }],
    fourAssumedNote: "Max Tend and Befriend: +25% Skill Damage. Chest Best Buds: +50%.",
    backpackTalent: {
      name: "Complete Uptime",
      description: "Canceling a skill resets its cooldown.",
    },
    chestTalent: {
      name: "Best Buds",
      description: "Damage bonus: 25% → 50%.",
    },
  },
  {
    id: "eclipse",
    name: "Eclipse Protocol",
    color: "#6b4c9a",
    core: "yellow",
    two: "+15% Status Effects",
    three: "+15% Skill Haste and +30% Hazard Protection",
    four: "Indirect Transmission — status effects spread to enemies within 10m on death and refresh 50% of their duration.",
    twoStats: [{ stat: "statusEffects", value: 15 }],
    threeStats: [
      { stat: "skillHaste", value: 15 },
      { stat: "hazardProtection", value: 30 },
    ],
    fourStats: [{ stat: "statusEffects", value: 10 }],
    fourAssumedNote: "Indirect Transmission extra status uptime: +10% Status Effects.",
    backpackTalent: {
      name: "Symptom Aggravator",
      description: "Amplifies all damage against targets affected by a status effect by 30%.",
    },
    chestTalent: {
      name: "Proliferation",
      description: "Range: 10m → 15m, refresh: 50% → 75%.",
    },
  },
  {
    id: "future-initiative",
    name: "Future Initiative",
    color: "#3ecf8e",
    core: "yellow",
    two: "+30% Repair Skills",
    three: "+15% Skill Haste and +30% Skill Duration",
    four: "Ground Control — +15% weapon and skill damage while at full armor. Repairing an ally also repairs the group.",
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
      description: "Proximity repair: 60% → 120%.",
    },
    chestTalent: {
      name: "Tactical Superiority",
      description: "Ground Control damage bonus: 15% → 25%.",
    },
  },
  {
    id: "foundry",
    name: "Foundry Bulwark",
    color: "#7a8a9a",
    core: "blue",
    two: "+10% Total Armor",
    three: "+1% Armor Regeneration and +50% Shield Health",
    four: "Makeshift Repairs — 25% of damage taken (by you or your shield) is repaired over 10s.",
    twoStats: [{ stat: "armorPercent", value: 10 }],
    threeStats: [
      { stat: "armorRegenPercent", value: 1 },
      { stat: "shieldHealth", value: 50 },
    ],
    fourStats: [{ stat: "armorPercent", value: 5 }],
    fourAssumedNote: "Max Makeshift Repairs modeled as +5% Total Armor equivalent.",
    backpackTalent: {
      name: "Process Refinery",
      description: "Repair duration: 10s → 5s.",
    },
    chestTalent: {
      name: "Improved Materials",
      description: "Makeshift Repairs: 25% → 35%.",
    },
  },
  {
    id: "hard-wired",
    name: "Hard Wired",
    color: "#3ec8ff",
    core: "yellow",
    two: "+15% Skill Haste",
    three: "+15% Skill Damage and +30% Repair Skills",
    four: "Feedback Loop — using or canceling a skill reduces the other skill's cooldown by 30s and grants +10% skill damage/repair for 20s.",
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
      description: "Feedback Loop cooldown: 20s → 10s.",
    },
    chestTalent: {
      name: "Positive Reinforcement",
      description: "Damage/repair bonus: 10% → 25%.",
    },
  },
  {
    id: "ongoing-directive",
    name: "Ongoing Directive",
    color: "#c45c2a",
    core: "red",
    two: "+15% Status Effects",
    three: "+30% Reload Speed",
    four: "Rules of Engagement — shooting a status-affected enemy marks them (10s). Killing a marked enemy grants a full clip of Hollow-Point ammo (+40% amplified weapon damage, bleed on hit) and half a clip to allies.",
    twoStats: [{ stat: "statusEffects", value: 15 }],
    threeStats: [{ stat: "reloadSpeed", value: 30 }],
    fourStats: [{ stat: "weaponDamage", value: 40 }],
    fourAssumedNote: "Max Hollow-Point rounds: +40% Weapon Damage. Chest Parabellum: +60%.",
    backpackTalent: {
      name: "Trauma Specialist",
      description: "+50% bleed duration, +100% bleed damage.",
    },
    chestTalent: {
      name: "Parabellum Rounds",
      description: "Hollow-Point amplification: 40% → 60% (not shared with the group).",
    },
  },
  {
    id: "true-patriot",
    name: "True Patriot",
    color: "#3d5a9a",
    core: "blue",
    two: "+15% Weapon Handling",
    three: "+30% Magazine Size",
    four: "Red, White and Blue — every 2s, enemies you shoot receive a stacking debuff: Red +15% damage taken, White 2% armor repair/s, Blue −10% damage dealt. Full Flag: death explosion.",
    twoStats: [{ stat: "weaponHandling", value: 15 }],
    threeStats: [{ stat: "magazineSize", value: 30 }],
    fourStats: [{ stat: "armorRegenPercent", value: 2 }],
    fourAssumedNote: "Max white-stripe self-repair: +2% Armor Regeneration (sheet proxy). Backpack Patriotic Boost: White 2% → 5%. Red/Blue amps are enemy debuffs, not self WD.",
    backpackTalent: {
      name: "Patriotic Boost",
      description: "Debuffs: Red 15% → 30%, White 2% → 5%, Blue 10% → 20%.",
    },
    chestTalent: {
      name: "Waving the Flag",
      description: "Increases Red, White and Blue rotation speed to 1s (base 4pc is every 2s).",
    },
  },
  {
    id: "aces",
    name: "Aces and Eights",
    color: "#2a2a2a",
    core: "red",
    two: "+30% Marksman Rifle Damage and +30% Rifle Damage",
    three: "+30% Headshot Damage and +30% Weapon Handling",
    four: "Dead Man's Hand — flip a card on Rifle or Marksman Rifle hits. After 5 cards, the next shot is amplified by 75%. Better hands grant more amplified shots.",
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
      description: "One additional amplified shot.",
    },
    chestTalent: {
      name: "No Limit",
      description: "Dead Man's Hand bonus: 75% → 100%.",
    },
  },
  {
    id: "tip-of-the-spear",
    name: "Tip of the Spear",
    color: "#6a3a2a",
    core: "red",
    two: "+20% Signature Weapon Damage",
    three: "+10% Weapon Damage",
    four: "Aggressive Recon — a signature weapon kill grants +15% signature weapon damage for 10s and +25% reload speed. Regenerates signature weapon ammo every 60s.",
    twoStats: [{ stat: "signatureWeaponDamage", value: 20 }],
    threeStats: [{ stat: "weaponDamage", value: 10 }],
    fourStats: [{ stat: "weaponDamage", value: 15 }],
    fourAssumedNote: "Max Aggressive Recon: +15% Weapon Damage after a signature kill. Chest: +30%. Backpack: +50% after emptying the signature weapon.",
    backpackTalent: {
      name: "Signature Moves",
      description: "+50% weapon damage for 15s after emptying your signature weapon. Signature weapon ammo capacity doubled.",
    },
    chestTalent: {
      name: "Specialized Destruction",
      description: "Signature weapon bonus: 15% → 30%. Every 3rd kill generates signature weapon ammo.",
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
    four: "Hackstep Protocol — replaces your skills with an infinite-use ability (20s): grants 20% armor, 50% bonus armor, and hides your nameplate for 5s.",
    twoStats: [{ stat: "armorOnKill", value: 15 }],
    threeStats: [
      { stat: "pulseResistance", value: 40 },
      { stat: "disruptResistance", value: 40 },
    ],
    fourStats: [{ stat: "armorPercent", value: 20 }],
    fourAssumedNote: "Max Hackstep Protocol window: +20% Total Armor.",
    backpackTalent: {
      name: "Multithreaded Execution",
      description: "Hackstep bonus armor: 50% → 100%.",
    },
    chestTalent: {
      name: "Compiler Optimization",
      description: "Hackstep cooldown: 20s → 15s.",
    },
  },
  {
    id: "cavalier",
    name: "Cavalier",
    color: "#8a7a5a",
    core: "blue",
    two: "+30% Hazard Protection",
    three: "+40% Repair Skills",
    four: "Charging — while out of cover, reduce incoming skill damage by 5%/s (up to 50%). Once fully Charged, share the protection with allies.",
    twoStats: [{ stat: "hazardProtection", value: 30 }],
    threeStats: [{ stat: "skillRepair", value: 40 }],
    fourStats: [{ stat: "hazardProtection", value: 50 }],
    fourAssumedNote: "Max Charging protection: +50% (modeled as Hazard Protection). Chest Overcharging: +70%.",
    backpackTalent: {
      name: "Safe Charging",
      description: "Charging grants 10% protection per second.",
    },
    chestTalent: {
      name: "Overcharging",
      description: "Max protection: 50% → 70%.",
    },
  },
  {
    id: "exuro",
    name: "Ortiz: Exuro",
    color: "#e25d2a",
    core: "yellow",
    two: "+20% Burn Duration and +15% Skill Health",
    three: "+40% Burn Damage",
    four: "Incinerator Turret Prototype — a 360° turret, immune to your own fire, explodes when destroyed.",
    twoStats: [{ stat: "skillHealth", value: 15 }],
    threeStats: [{ stat: "statusEffects", value: 15 }],
    fourStats: [{ stat: "skillDamage", value: 10 }],
    fourAssumedNote:
      "Incinerator Prototype has no standing sheet WD. +10% Skill Damage is a soft proxy only. Heatstroke is +40% amplified damage vs turret-burned targets, not Increased Weapon Damage.",
    backpackTalent: {
      name: "Heatstroke",
      description:
        "+40% amplified damage against enemies set on fire by the turret. +25% range. In-game text wrongly says Increased Weapon Damage — the bonus is an amplifier.",
    },
    chestTalent: {
      name: "Chain Combustion",
      description: "Enemies set on fire by the turret ignite other enemies within 10m.",
    },
  },
  {
    id: "aegis",
    name: "Aegis",
    color: "#4a6a8a",
    core: "blue",
    two: "+70% Health",
    three: "+15% Total Armor",
    four: "Stoic — gain +3% damage resistance for each enemy targeting you (multiplied by group size).",
    twoStats: [{ stat: "healthPercent", value: 70 }],
    threeStats: [{ stat: "armorPercent", value: 15 }],
    fourStats: [{ stat: "armorPercent", value: 8 }],
    fourAssumedNote: "Max Stoic resist modeled as +8% Total Armor equivalent.",
    backpackTalent: {
      name: "Polyethylene Plating",
      description: "Stoic bonus: 3% → 4%.",
    },
    chestTalent: {
      name: "Deceit",
      description: "Enemies targeting your decoy count towards Stoic.",
    },
  },
  {
    id: "breaking-point",
    name: "Breaking Point",
    color: "#8a4a2a",
    core: "red",
    two: "+30% Rifle Damage and Marksman Rifle Damage",
    three: "+30% Headshot Damage and +30% Weapon Handling",
    four: "On Point — Rifle/MMR hits grant stacks. Reloading grants +2% Weapon Handling and +4% weapon damage per stack for 20s. Timer expiry or a weapon swap while the buff is active refills the magazine.",
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
      description: "On Point damage bonus: 4% → 9%.",
    },
    chestTalent: {
      name: "Point of No Return",
      description: "On Point duration: 20s → 40s.",
    },
  },
  {
    id: "virtuoso",
    name: "Virtuoso",
    color: "#9a6a8a",
    core: "red",
    two: "+15% Weapon Handling and +15% Magazine Size",
    three: "+15% Weapon Damage",
    four: "Symphony — kills at long range and close range grant different weapon bonuses. At 4 stacks, all bonuses are multiplied by 1.5.",
    twoStats: [
      { stat: "weaponHandling", value: 15 },
      { stat: "magazineSize", value: 15 },
    ],
    threeStats: [{ stat: "weaponDamage", value: 15 }],
    fourStats: [{ stat: "weaponDamage", value: 24 }],
    fourAssumedNote: "Max Symphony at 4 stacks × 1.5. Chest Fortissimo doubles weapon-damage bonuses.",
    backpackTalent: {
      name: "Accelerando",
      description: "Symphony stacks: 4 → 3.",
    },
    chestTalent: {
      name: "Fortissimo",
      description: "Doubles Symphony's weapon damage bonuses.",
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
    four: "Return to Sender — you are repaired for 10% of skill damage dealt, allies for 20%.",
    twoStats: [{ stat: "statusEffects", value: 15 }],
    threeStats: [{ stat: "skillDamage", value: 25 }],
    fourStats: [
      { stat: "skillRepair", value: 10 },
      { stat: "incomingRepairs", value: 5 },
    ],
    fourAssumedNote: "Return to Sender conversion: +10% Repair Skills, +5% Incoming Repairs.",
    backpackTalent: {
      name: "Over-engineered",
      description: "At full armor, repair effects are converted into bonus armor (up to 80%).",
    },
    chestTalent: {
      name: "Increased Interest",
      description: "Repair amounts: 10/20% → 25/35%.",
    },
  },
  {
    id: "measured-assembly",
    name: "Measured Assembly",
    color: "#4a8a4a",
    core: "yellow",
    two: "+15% Skill Haste",
    three: "+60% Repair Skills and +40% Explosive Resistance",
    four: "Huddle — gain +1 tier for each ally near your hive. Tier 6: Overcharge. Destroys enemy mortars and skills.",
    twoStats: [{ stat: "skillHaste", value: 15 }],
    threeStats: [
      { stat: "skillRepair", value: 60 },
      { stat: "explosiveResistance", value: 40 },
    ],
    fourStats: [{ stat: "skillTier", value: 3 }],
    fourAssumedNote: "Max Huddle: +1 Skill Tier per nearby ally (3 allies).",
    backpackTalent: {
      name: "Smart Cooperation",
      description: "Mortar destruction cooldown: 10s → 1s.",
    },
    chestTalent: {
      name: "Hivemind",
      description: "Overcharge cooldown: 40s → 25s.",
    },
  },
  {
    id: "tipping-scales",
    name: "Tipping Scales",
    color: "#c4a02a",
    core: "red",
    two: "+30% Magazine Size",
    three: "+30% LMG Damage",
    four: "Throttle Control — firing builds stacks (max 50): +0.5% Weapon Handling and +5% Critical Hit Damage per stack.",
    twoStats: [{ stat: "magazineSize", value: 30 }],
    threeStats: [{ stat: "lmgDamage", value: 30 }],
    fourStats: [
      { stat: "weaponHandling", value: 25 },
      { stat: "chd", value: 250 },
    ],
    fourAssumedNote: "Max Throttle Control: 50 stacks × 0.5% Handling and 5% CHD. Chest 75 stacks. Backpack 8% CHD/stack.",
    backpackTalent: {
      name: "Snowball",
      description: "Critical Hit Damage per stack: 5% → 8%.",
    },
    chestTalent: {
      name: "Sustainability",
      description: "Max stacks: 50 → 75.",
    },
  },
  {
    id: "concentrated-company",
    name: "Concentrated Company",
    color: "#5a7aaa",
    core: "red",
    two: "+10% Weapon Damage",
    three: "+30% Weapon Handling",
    four: "Camaraderie — shooting marks an enemy for 10s. When a marked enemy dies, gain 3% Weapon Damage and 3% Critical Hit Damage per contributing ally or skill (including you). Max 35 stacks; 4 marks.",
    twoStats: [{ stat: "weaponDamage", value: 10 }],
    threeStats: [{ stat: "weaponHandling", value: 30 }],
    fourStats: [
      { stat: "weaponDamage", value: 105 },
      { stat: "chd", value: 105 },
    ],
    fourAssumedNote: "Max Camaraderie: 35 stacks × 3% Weapon Damage and CHD. Chest All for One raises marks (4→8), not the stack cap. Backpack 6% WD/stack.",
    backpackTalent: {
      name: "One for All",
      description: "Weapon damage per stack: 3% → 6%.",
    },
    chestTalent: {
      name: "All for One",
      description: "Max marks: 4 → 8.",
    },
  },
  {
    id: "core-strength",
    name: "Core Strength",
    color: "#e2c03d",
    core: "red",
    two: "+10% Weapon Handling",
    three: "+5% Weapon Damage, Armor, and Skill Efficiency",
    four: "Core Exercise — each core grants 40% of the other two cores' bonuses. Tiers grant 15% efficiency.",
    twoStats: [{ stat: "weaponHandling", value: 10 }],
    threeStats: [
      { stat: "weaponDamage", value: 5 },
      { stat: "armorPercent", value: 5 },
      { stat: "skillEfficiency", value: 5 },
    ],
    backpackTalent: {
      name: "Outer Core",
      description: "This backpack has three attribute cores.",
    },
    chestTalent: {
      name: "Inner Core",
      description: "Conversion from other cores: 40% → 75%.",
    },
  },
  {
    id: "reficere",
    name: "Ortiz: Reficere",
    color: "#6ad4a8",
    core: "yellow",
    two: "+8% Skill Efficiency",
    three: "+60% Repair Skills",
    four: "Rapid Application Nanite — heal duration/range reduced by 90%, efficiency increased by 150%. Healing an ally grants +30% Hazard Protection.",
    twoStats: [{ stat: "skillEfficiency", value: 8 }],
    threeStats: [{ stat: "skillRepair", value: 60 }],
    fourStats: [
      { stat: "skillRepair", value: 20 },
      { stat: "hazardProtection", value: 15 },
    ],
    fourAssumedNote: "Nanite efficiency + ally-heal hazard: +20% Repair Skills, +15% Hazard Protection.",
    backpackTalent: {
      name: "Improved Dampeners",
      description: "Duration/range reduction: 90% → 25%.",
    },
    chestTalent: {
      name: "Overcharged Nanites",
      description: "Healing efficiency: 150% → 225%.",
    },
  },
  {
    id: "ember-engine",
    name: "Ember Engine",
    color: "#e25822",
    core: "yellow",
    two: "+8% Skill Efficiency",
    three: "+30% Status Effects",
    four: "Spontaneous Combustion — every status effect has a 40% chance to also apply Burn. If Burn was already applied: +25% burn damage.",
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
      description: "Spontaneous Combustion Burn chance: 40% → 60%.",
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

