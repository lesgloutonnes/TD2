import type { SkillDef, SpecializationDef, SpecPerkDef, StatBonus, StatKey } from "../types";

export const SKILLS: SkillDef[] = [
  {
    id: "assault-turret",
    name: "Assault Turret",
    category: "Turret",
    description:
      "Automatic turret with sustained fire. PvE T0: 180s duration, 25s cooldown. Damage and health scale with Skill Tier.",
  },
  {
    id: "artillery-turret",
    name: "Artillery Turret",
    category: "Turret",
    description:
      "Guided mortar (Demolitionist). Explosion plus Bleed. PvE T0: 3 mortar rounds, 4.5m blast, 7s Bleed. Ammo and damage scale with Skill Tier.",
    assumed: [{ stat: "skillDamage", value: 5 }],
    assumedNote: "Deployed offensive skill soft contribution.",
  },
  {
    id: "incinerator-turret",
    name: "Incinerator Turret",
    category: "Turret",
    description:
      "Frontal flame cone; toggle on/off after deploy. PvE T0: 15s duration, 15m range, 45° cone, 4s Burn. Cone, Burn, and duration scale with Skill Tier.",
  },
  {
    id: "sniper-turret",
    name: "Sniper Turret",
    category: "Turret",
    description:
      "Heavy long-range shots. PvE T0: 3 sniper rounds, 300s duration, 20s cooldown. Extra ammo scales with Skill Tier.",
  },
  {
    id: "striker-drone",
    name: "Striker Drone",
    category: "Drone",
    description:
      "Offensive drone that engages enemies. PvE T0: 180s duration, 25s cooldown. Damage and health scale with Skill Tier.",
    assumed: [{ stat: "skillDamage", value: 5 }],
    assumedNote: "Deployed offensive skill soft contribution.",
  },
  {
    id: "defender-drone",
    name: "Defender Drone",
    category: "Drone",
    description:
      "Intercepts projectiles around the agent. PvE T0: 20% damage reduction, 20s duration (DR scales with Skill Tier). Skill-local — not character-wide armor.",
  },
  {
    id: "bombardier-drone",
    name: "Bombardier Drone",
    category: "Drone",
    description:
      "Drops an explosive salvo on a marked area. PvE T0: 3 bombs, 4.5m blast. Bomb count scales with Skill Tier.",
  },
  {
    id: "tactician-drone",
    name: "Tactician Drone",
    category: "Drone",
    description:
      "Pulses and marks enemies (Sharpshooter). PvE T0: 50m scan range, 300s duration. Overcharge Weakness Exploit: +15% amplified damage to pulsed targets (not a sheet Weapon Damage).",
  },
  {
    id: "fixer-drone",
    name: "Fixer Drone",
    category: "Drone",
    description:
      "Follows an ally and repairs their armor. PvE T0: 180s duration, 25s cooldown. Repair scales with Skill Tier.",
  },
  {
    id: "cluster-seeker",
    name: "Cluster Seeker Mine",
    category: "Seeker Mine",
    description:
      "Splits into submunitions. PvE T0: 3 cluster mines, 2m blast, 50s cooldown. Extra mines scale with Skill Tier.",
    assumed: [{ stat: "skillDamage", value: 5 }],
    assumedNote: "Deployed offensive skill soft contribution.",
  },
  {
    id: "explosive-seeker",
    name: "Explosive Seeker Mine",
    category: "Seeker Mine",
    description:
      "Single large explosion plus Bleed. PvE T0: 4m blast, 7s Bleed, 35s cooldown.",
  },
  {
    id: "airburst-seeker",
    name: "Airburst Seeker Mine",
    category: "Seeker Mine",
    description:
      "Detonates above targets: explosion plus Burn. PvE T0: 6m radius, 4s Burn, 30s cooldown. Burn duration scales with Skill Tier.",
  },
  {
    id: "mender-seeker",
    name: "Mender Seeker Mine",
    category: "Seeker Mine",
    description:
      "Repair cloud for allies (Survivalist). PvE T0: 3m radius, 8s cloud, 180s duration. Repair scales with Skill Tier.",
  },
  {
    id: "stinger-hive",
    name: "Stinger Hive",
    category: "Hive",
    description:
      "Swarm of offensive micro-drones plus Bleed. PvE T0: 8 charges, 8m range, 7s Bleed, 180s duration. Charges scale with Skill Tier.",
  },
  {
    id: "restorer-hive",
    name: "Restorer Hive",
    category: "Hive",
    description:
      "Repairs ally armor and deployed skills in range. PvE T0: 8 charges, 8m range, 180s duration. Charges and repair scale with Skill Tier.",
    assumed: [{ stat: "skillRepair", value: 5 }],
    assumedNote: "Healing skill soft contribution.",
  },
  {
    id: "reviver-hive",
    name: "Reviver Hive",
    category: "Hive",
    description:
      "Automatic revive, including self-revive when charged. PvE T0: 1 charge, 25% armor restore on revive, 8m range, 180s refill. Charges and restore scale with Skill Tier.",
    assumed: [{ stat: "incomingRepairs", value: 5 }],
    assumedNote: "Support hive soft contribution.",
  },
  {
    id: "booster-hive",
    name: "Booster Hive",
    category: "Hive",
    description:
      "Ally stim: weapon handling, hazard protection, and melee damage (not weapon damage). PvE T0: 20% stim efficiency, 5s buff, 8 stim charges, 12m range. Stim efficiency scales with Skill Tier.",
  },
  {
    id: "artificer-hive",
    name: "Artificer Hive",
    category: "Hive",
    description:
      "Overcharges allied skills (Technician). PvE T0: +10% buff amount and +10% Skill Repair (do not scale with Skill Tier), 3s skill refresh (scales), 8 charges, 8m range, 10s buff duration.",
  },
  {
    id: "oxidizer",
    name: "Oxidizer Chem Launcher",
    category: "Chem Launcher",
    description:
      "Acid cloud DoT. PvE T0: 1 ammo, 3.5m / 5s cloud, 25s ammo cooldown. Cloud damage, duration, and radius scale with Skill Tier.",
  },
  {
    id: "firestarter",
    name: "Firestarter Chem Launcher",
    category: "Chem Launcher",
    description:
      "Flammable cloud, then Burn. PvE T0: 1 ammo, 3m / 20s cloud, 4s Burn. Burn scales with Skill Tier.",
  },
  {
    id: "riot-foam",
    name: "Riot Foam Chem Launcher",
    category: "Chem Launcher",
    description:
      "Ensnare foam that immobilizes enemies. PvE T0: 1 ammo, 3m cloud, 6s ensnare. Ensnare duration and foam health scale with Skill Tier.",
  },
  {
    id: "repair-chem",
    name: "Reinforcer Chem Launcher",
    category: "Chem Launcher",
    description:
      "Armor repair cloud. PvE T0: 2 ammo, 3m / 5s cloud, 30s ammo cooldown. Healing efficiency scales with Skill Tier.",
  },
  {
    id: "bulwark-shield",
    name: "Bulwark Shield",
    category: "Shield",
    description:
      "Full frontal cover, pistol only. Shield Wall: the shield is invulnerable. PvE T0: 20s cooldown. Health and regen scale with Skill Tier.",
    assumed: [{ stat: "armorPercent", value: 5 }],
    assumedNote: "Bulwark coverage approximated as +5% Total Armor.",
  },
  {
    id: "crusader-shield",
    name: "Crusader Shield",
    category: "Shield",
    description:
      "Shield plus primary weapon. Shield Wall: the shield is invulnerable. PvE T0: 20s cooldown. Health and regen scale with Skill Tier.",
    assumed: [{ stat: "weaponDamage", value: 5 }],
    assumedNote: "Shield enables Intimidate/HB playstyles; soft +5% WD.",
  },
  {
    id: "striker-shield",
    name: "Striker Shield",
    category: "Shield",
    description:
      "Small shield, pistol (Firewall). Damage bonus per enemy in a 45° / 10m cone. PvE T0: +5% damage bonus per enemy (scales with Skill Tier). Shield Wall: the shield is invulnerable.",
    assumed: [{ stat: "weaponDamage", value: 5 }],
    assumedNote:
      "PvE T0 +5% damage bonus for one enemy in the cone (skill-local; not extra character Weapon Damage beyond this hint).",
  },
  {
    id: "deflector-shield",
    name: "Deflector Shield",
    category: "Shield",
    description:
      "Reflects a portion of incoming projectiles. Shield Wall: the shield is invulnerable. PvE T0: 20s cooldown. Deflected damage scales with Skill Tier.",
  },
  {
    id: "scanner-pulse",
    name: "Scanner Pulse",
    category: "Pulse",
    description:
      "Reveals enemies in a wide radius. PvE T0: 100m effect radius, 8s duration, 20s cooldown. Overcharge Weakness Exploit: +15% amplified damage to pulsed targets (not sheet Weapon Damage). Spotter synergy.",
  },
  {
    id: "remote-pulse",
    name: "Remote Pulse",
    category: "Pulse",
    description:
      "Deployable pulse. PvE T0: 15m effect radius, 45s duration, 20s cooldown. Radius and duration scale with Skill Tier. Overcharge Weakness Exploit: +15% amplified damage to pulsed targets (not sheet Weapon Damage).",
  },
  {
    id: "jammer-pulse",
    name: "Jammer Pulse",
    category: "Pulse",
    description:
      "Omnidirectional EMP that disables enemy skills (Spark). PvE T0: 20m radius, 3s EMP, 2s charge, 30s cooldown. Hold to charge a larger pulse. Radius and EMP duration scale with Skill Tier.",
  },
  {
    id: "banshee-pulse",
    name: "Banshee Pulse",
    category: "Pulse",
    description:
      "Forward arc that disorients through cover (Gunner). Charge for range. PvE T0: 30m radius, 20 cone size, 4s Disorient, 10s duration, 30s cooldown. Cone and Disorient scale with Skill Tier. Overcharge Weakness Exploit: +15% amplified damage to pulsed targets (not sheet Weapon Damage).",
  },
  {
    id: "achilles-pulse",
    name: "Achilles Pulse",
    category: "Pulse",
    description:
      "Marks weak-point zones on a target; those spots take headshot damage. PvE T0: 1 zone, 10s zone duration, 40s cooldown. Zone count scales with Skill Tier (3 at T6).",
  },
  {
    id: "blinder-firefly",
    name: "Blinder Firefly",
    category: "Firefly",
    description:
      "Blinds enemies in a chain. PvE T0: 3 max targets, 5s Blind, 50s cooldown. Extra targets and Blind duration scale with Skill Tier.",
  },
  {
    id: "burster-firefly",
    name: "Burster Firefly",
    category: "Firefly",
    description:
      "Detonates weak points and skills. PvE T0: 3 max targets, 30s cooldown. Extra targets and damage scale with Skill Tier.",
  },
  {
    id: "demolisher-firefly",
    name: "Demolisher Firefly",
    category: "Firefly",
    description:
      "Destroys cover and armor weak points. PvE T0: 3 max targets, 50s cooldown. Extra targets and damage scale with Skill Tier.",
  },
  {
    id: "decoy",
    name: "Decoy",
    category: "Decoy",
    description:
      "Holographic distraction that draws aggro. PvE T0: 15s duration, 100% Threat, 25s cooldown. Duration, health, and Threat scale with Skill Tier.",
  },
  {
    id: "shock-trap",
    name: "Shock Trap",
    category: "Trap",
    description:
      "Shock zone that immobilizes enemies. PvE T0: 6 traps, 2.5m shock radius, 3s Shock, 60s duration. Trap count, radius, and Shock duration scale with Skill Tier.",
  },
  {
    id: "repair-trap",
    name: "Repair Trap",
    category: "Trap",
    description:
      "Armor repair zone. Immunizing Serum: traps also grant status-effect immunity for 10s. PvE T0: 2 traps, 0.75m repair radius, 60s duration, 40s cooldown. Trap count and repair scale with Skill Tier.",
  },
  {
    id: "shrapnel-trap",
    name: "Shrapnel Trap",
    category: "Trap",
    description:
      "Proximity mines that explode and apply Bleed. PvE T0: 9 traps, 2m explosion radius, 60s duration. Trap count and damage scale with Skill Tier.",
  },
  {
    id: "precision-smart-cover",
    name: "Precision Smart Cover",
    category: "Smart Cover",
    description:
      "Reinforces cover: weapon handling, damage to targets out of cover, auto-reload on swap. PvE T0 while in cover: 6m radius, 20s duration, 45s cooldown, +15% Weapon Handling / +10% damage to targets out of cover (scales with Skill Tier).",
  },
  {
    id: "fortified-smart-cover",
    name: "Fortified Smart Cover",
    category: "Smart Cover",
    description:
      "Reinforces cover: bonus armor, explosive resistance, pulse resistance, stagger immunity. PvE T0 while in cover: 6m radius, 30s duration, 45s cooldown, +50% Bonus Armor / +5% Explosive Resistance / +5% Pulse Resistance (armor and resists scale with Skill Tier).",
  },
  {
    id: "sticky-burn",
    name: "Burn Sticky Bomb",
    category: "Sticky Bomb",
    description:
      "Explosion plus Burn. PvE T0: 10s flare, 4.5s Burn. Burn damage and duration scale with Skill Tier.",
  },
  {
    id: "sticky-emp",
    name: "EMP Sticky Bomb",
    category: "Sticky Bomb",
    description:
      "Disables skills and robots. PvE T0: 4m EMP blast radius, 8s flare, 30s cooldown. Blast radius scales with Skill Tier.",
  },
  {
    id: "sticky-explosive",
    name: "Explosive Sticky Bomb",
    category: "Sticky Bomb",
    description:
      "Large explosive burst. PvE T0: 3m blast, 10s duration, 60s cooldown. Damage and blast radius scale with Skill Tier.",
  },
];

function applySkillModel(
  id: string,
  assumed: SkillDef["assumed"],
  assumedNote: string,
) {
  const skill = SKILLS.find((item) => item.id === id);
  if (!skill || skill.assumed?.length) return;
  skill.assumed = assumed;
  skill.assumedNote = assumedNote;
}

applySkillModel("assault-turret", [{ stat: "skillDamage", value: 5 }], "Deployed offensive skill soft contribution.");
applySkillModel("incinerator-turret", [{ stat: "statusEffects", value: 5 }, { stat: "skillDamage", value: 5 }], "Flame cone averaged as Status + Skill Damage.");
applySkillModel("sniper-turret", [{ stat: "skillDamage", value: 5 }], "Deployed offensive skill soft contribution.");
applySkillModel("defender-drone", [{ stat: "armorPercent", value: 4 }], "Projectile intercept approximated as mild Total Armor.");
applySkillModel("bombardier-drone", [{ stat: "skillDamage", value: 5 }, { stat: "explosiveDamage", value: 5 }], "Bombardier salvo averaged.");
applySkillModel("tactician-drone", [{ stat: "chc", value: 5 }], "Pulse/mark synergy averaged as Critical Hit Chance.");
applySkillModel("fixer-drone", [{ stat: "skillRepair", value: 5 }], "Healing skill soft contribution.");
applySkillModel("explosive-seeker", [{ stat: "skillDamage", value: 5 }, { stat: "explosiveDamage", value: 5 }], "Deployed offensive skill soft contribution.");
applySkillModel("airburst-seeker", [{ stat: "skillDamage", value: 5 }, { stat: "statusEffects", value: 5 }], "Airburst explosion + Burn averaged.");
applySkillModel("mender-seeker", [{ stat: "skillRepair", value: 5 }], "Healing skill soft contribution.");
applySkillModel("stinger-hive", [{ stat: "skillDamage", value: 5 }], "Deployed offensive skill soft contribution.");
applySkillModel("booster-hive", [{ stat: "weaponHandling", value: 5 }, { stat: "hazardProtection", value: 5 }, { stat: "meleeDamage", value: 5 }], "Booster Hive group buff (handling / hazard / melee — no weapon damage).");
applySkillModel("artificer-hive", [{ stat: "skillDamage", value: 10 }, { stat: "skillRepair", value: 10 }], "Artificer PvE base buff amount + Skill Repair (does not scale with Skill Tier).");
applySkillModel("oxidizer", [{ stat: "skillDamage", value: 5 }, { stat: "statusEffects", value: 5 }], "Acid DoT averaged.");
applySkillModel("firestarter", [{ stat: "statusEffects", value: 8 }], "Burn cloud averaged as Status Effects.");
applySkillModel("riot-foam", [{ stat: "statusEffects", value: 8 }], "Crowd-control foam averaged as Status Effects.");
applySkillModel("repair-chem", [{ stat: "skillRepair", value: 5 }], "Healing skill soft contribution.");
applySkillModel("deflector-shield", [{ stat: "armorPercent", value: 4 }], "Deflector coverage approximated as mild Total Armor.");
applySkillModel("scanner-pulse", [{ stat: "chc", value: 5 }], "Pulse/Spotter synergy averaged as Critical Hit Chance.");
applySkillModel("remote-pulse", [{ stat: "chc", value: 5 }], "Pulse/Spotter synergy averaged as Critical Hit Chance.");
applySkillModel("jammer-pulse", [{ stat: "statusEffects", value: 5 }], "Disrupt window averaged as Status Effects.");
applySkillModel("banshee-pulse", [{ stat: "statusEffects", value: 8 }], "Disorient arc averaged as Status Effects.");
applySkillModel("achilles-pulse", [{ stat: "hsd", value: 5 }], "Weak-point mark averaged as Headshot Damage.");
applySkillModel("blinder-firefly", [{ stat: "statusEffects", value: 8 }], "Blind chain averaged as Status Effects.");
applySkillModel("burster-firefly", [{ stat: "skillDamage", value: 5 }], "Weak-point burst averaged.");
applySkillModel("demolisher-firefly", [{ stat: "damageToArmor", value: 6 }], "Cover/armor break averaged as Damage to Armor.");
applySkillModel("decoy", [{ stat: "threat", value: 15 }], "Decoy aggro modeled as Threat.");
applySkillModel("shock-trap", [{ stat: "statusEffects", value: 8 }], "Shock CC averaged as Status Effects.");
applySkillModel("repair-trap", [{ stat: "skillRepair", value: 5 }], "Healing skill soft contribution.");
applySkillModel("shrapnel-trap", [{ stat: "skillDamage", value: 5 }, { stat: "statusEffects", value: 5 }], "Bleed mines averaged.");
applySkillModel("precision-smart-cover", [{ stat: "weaponHandling", value: 5 }], "Precision cover buff averaged as Weapon Handling.");
applySkillModel("fortified-smart-cover", [{ stat: "armorPercent", value: 4 }, { stat: "explosiveResistance", value: 5 }], "Fortified cover averaged as mild armor + explosive resist.");
applySkillModel("sticky-burn", [{ stat: "statusEffects", value: 8 }, { stat: "explosiveDamage", value: 5 }], "Burn sticky averaged.");
applySkillModel("sticky-emp", [{ stat: "statusEffects", value: 6 }], "EMP disrupt averaged as Status Effects.");
applySkillModel("sticky-explosive", [{ stat: "explosiveDamage", value: 10 }, { stat: "skillDamage", value: 5 }], "Explosive sticky averaged.");

const WEAPON_TYPE_NODES: { suffix: string; name: string; stat: StatKey }[] = [
  { suffix: "ar", name: "Assault Rifle", stat: "arDamage" },
  { suffix: "lmg", name: "LMG", stat: "lmgDamage" },
  { suffix: "smg", name: "SMG", stat: "smgDamage" },
  { suffix: "shotgun", name: "Shotgun", stat: "shotgunDamage" },
  { suffix: "mmr", name: "Marksman Rifle", stat: "mmrDamage" },
  { suffix: "rifle", name: "Rifle", stat: "rifleDamage" },
  { suffix: "pistol", name: "Pistol", stat: "pistolDamage" },
];

function sheetPerk(
  specId: string,
  suffix: string,
  name: string,
  bonuses: StatBonus[],
): SpecPerkDef {
  return {
    id: `${specId}-${suffix}`,
    name,
    bonuses,
    group: "sheet",
    defaultOn: true,
  };
}

/** Mutually exclusive tree fork. Both sides start off so the player picks one (or neither). */
function choicePerk(
  specId: string,
  suffix: string,
  name: string,
  bonuses: StatBonus[],
  exclusiveGroup: string,
): SpecPerkDef {
  return {
    id: `${specId}-${suffix}`,
    name,
    bonuses,
    group: "sheet",
    defaultOn: false,
    exclusiveGroup,
  };
}

function weaponTypePerks(specId: string): SpecPerkDef[] {
  return WEAPON_TYPE_NODES.map((node) => ({
    id: `${specId}-${node.suffix}`,
    name: `${node.name} damage`,
    bonuses: [{ stat: node.stat, value: 5 }],
    group: "weapon-type" as const,
    defaultOn: false,
  }));
}

/** Max of the 4-rank Signature Weapon Damage node (10/20/30/40%). Default on like other identity sheet perks. */
function signatureWeaponPerk(specId: string): SpecPerkDef {
  return sheetPerk(specId, "sig-wd", "Signature Weapon Damage", [
    { stat: "signatureWeaponDamage", value: 40 },
  ]);
}

/** TU6 retuned Vital Protection from Conflict crit-reduction to Pulse Resistance on every spec tree. */
function vitalProtectionPerk(specId: string): SpecPerkDef {
  return sheetPerk(specId, "pulse", "Vital Protection", [{ stat: "pulseResistance", value: 50 }]);
}

/**
 * Live Y8S3 PvE (TU 2.34) specialization sheet perks.
 * Red Horizon notes + live gear PDF (ubi.li/4Yvr2) do not retune spec trees.
 * The 2021 Intelligence Annex revamp never shipped — trees stay the Gear 2.0 layout.
 * In-game English node names: Amped, Overclocked CPU, Enhanced Diagnostics,
 * Vital Protection (Pulse Resistance, all six specs since TU6), Breath Control,
 * Incombustible, Elite Defense, Triage Specialist
 * (Division Dispatch 1 Aug 2026; Namu trees last modified 2025-04-08;
 * TU6 Pentagon notes: Vital Protection → Pulse resistance).
 * Exclusive sheet fork is Technician only. Combat procs, signature ammo, skill
 * unlocks, armor-kit extras, and 3-rank weapon-type stacks beyond the +5% toggle
 * stay unmodeled.
 */
export const SPECIALIZATIONS: SpecializationDef[] = [
  {
    id: "gunner",
    name: "Gunner",
    signature: "M134 Minigun",
    description:
      "M134 Minigun, Banshee Pulse, Riot Foam Chem Launcher, P320 XCompact. Combat-only: Supply Line ammo regen, Barrage RoF on kill, Coupler every 3rd reload, Emplacement handling while stationary, Hardened Armor Kits.",
    perks: [
      sheetPerk("gunner", "aok", "Armor on Kill", [{ stat: "armorOnKill", value: 10 }]),
      sheetPerk("gunner", "ammo", "Ammo Capacity", [{ stat: "ammoCapacity", value: 25 }]),
      vitalProtectionPerk("gunner"),
      signatureWeaponPerk("gunner"),
      ...weaponTypePerks("gunner"),
    ],
  },
  {
    id: "technician",
    name: "Technician",
    signature: "P-017 Missile Launcher",
    description:
      "P-017 Missile Launcher, Artificer Hive, EMP grenades, Maxim-9, Linked Laser Pointer. Combat-only: Faraday Field, Technomancy bonus armor while aiming a skill, Emergency Patch, Dismantling vs drones/robots.",
    perks: [
      sheetPerk("technician", "tier", "Amped", [{ stat: "skillTier", value: 1 }]),
      vitalProtectionPerk("technician"),
      choicePerk(
        "technician",
        "overclock",
        "Overclocked CPU",
        [{ stat: "skillDamage", value: 10 }],
        "technician-skill-focus",
      ),
      choicePerk(
        "technician",
        "diagnostics",
        "Enhanced Diagnostics",
        [{ stat: "skillRepair", value: 10 }],
        "technician-skill-focus",
      ),
      signatureWeaponPerk("technician"),
      ...weaponTypePerks("technician"),
    ],
  },
  {
    id: "sharpshooter",
    name: "Sharpshooter",
    signature: "TAC-50",
    description:
      "TAC-50, Tactician Drone, Flashbang grenades, Sharpshooter 93R. Combat-only: My Home Is My Castle (armor in cover), armor-kit cleanse, signature ammo on headshot kills.",
    perks: [
      sheetPerk("sharpshooter", "hsd", "Headshot Damage", [{ stat: "hsd", value: 15 }]),
      sheetPerk("sharpshooter", "mmr", "Marksman Rifle damage", [{ stat: "mmrDamage", value: 10 }]),
      sheetPerk("sharpshooter", "breath", "Breath Control", [{ stat: "stability", value: 15 }]),
      vitalProtectionPerk("sharpshooter"),
      signatureWeaponPerk("sharpshooter"),
      ...weaponTypePerks("sharpshooter").filter((perk) => perk.id !== "sharpshooter-mmr"),
    ],
  },
  {
    id: "survivalist",
    name: "Survivalist",
    signature: "Explosive Crossbow",
    description:
      "Explosive Crossbow, Mender Seeker Mine, Incendiary grenades, Survivalist D50. Combat-only: Repair Distribution armor kits, Crunch Time haste in cover, Scavenger ammo while moving cover-to-cover.",
    perks: [
      sheetPerk("survivalist", "repairs", "Incoming Repairs", [{ stat: "incomingRepairs", value: 10 }]),
      sheetPerk("survivalist", "status", "Status Effects", [{ stat: "statusEffects", value: 10 }]),
      sheetPerk("survivalist", "triage", "Triage Specialist", [{ stat: "skillRepair", value: 15 }]),
      sheetPerk("survivalist", "elite", "Elite Defense", [{ stat: "protectionFromElites", value: 10 }]),
      vitalProtectionPerk("survivalist"),
      signatureWeaponPerk("survivalist"),
      ...weaponTypePerks("survivalist"),
    ],
  },
  {
    id: "demolitionist",
    name: "Demolitionist",
    signature: "M32A1 Grenade Launcher",
    description:
      "M32A1 Grenade Launcher, Artillery Turret, Fragmentation grenades, Diceros Special. Combat-only: armor-kit handling buff, Braced for Impact, Crisis Response mag refill.",
    perks: [
      sheetPerk("demolitionist", "explosive", "Explosive Damage", [{ stat: "explosiveDamage", value: 15 }]),
      sheetPerk("demolitionist", "lmg", "LMG damage", [{ stat: "lmgDamage", value: 10 }]),
      sheetPerk("demolitionist", "incombustible", "Incombustible", [{ stat: "burnResistance", value: 20 }]),
      vitalProtectionPerk("demolitionist"),
      signatureWeaponPerk("demolitionist"),
      ...weaponTypePerks("demolitionist").filter((perk) => perk.id !== "demolitionist-lmg"),
    ],
  },
  {
    id: "firewall",
    name: "Firewall",
    signature: "K8-JetStream Flamethrower",
    description:
      "K8-JetStream Flamethrower, Striker Shield, Cluster grenades, Firestarter sawed-off. Combat-only: burn duration ranks, Frontline Recovery health on kill, ignition on armor break, Forced Breakthrough bonus armor while moving cover-to-cover.",
    perks: [
      sheetPerk("firewall", "armor", "Total Armor", [{ stat: "armorPercent", value: 10 }]),
      sheetPerk("firewall", "status", "Status Effects", [{ stat: "statusEffects", value: 10 }]),
      vitalProtectionPerk("firewall"),
      signatureWeaponPerk("firewall"),
      ...weaponTypePerks("firewall"),
    ],
  },
];

export function specializationById(id: string | null | undefined): SpecializationDef | undefined {
  if (!id) return undefined;
  return SPECIALIZATIONS.find((item) => item.id === id);
}

const SPEC_PERK_IDS = new Set(SPECIALIZATIONS.flatMap((spec) => spec.perks.map((perk) => perk.id)));

export function specPerkEnabled(
  perk: SpecPerkDef,
  flags?: Partial<Record<string, boolean>>,
): boolean {
  if (flags && Object.prototype.hasOwnProperty.call(flags, perk.id)) {
    return flags[perk.id] === true;
  }
  return perk.defaultOn;
}

export function exclusivePerkGroups(spec: SpecializationDef): SpecPerkDef[][] {
  const groups = new Map<string, SpecPerkDef[]>();
  for (const perk of spec.perks) {
    if (!perk.exclusiveGroup) continue;
    const list = groups.get(perk.exclusiveGroup) ?? [];
    list.push(perk);
    groups.set(perk.exclusiveGroup, list);
  }
  return [...groups.values()];
}

/** Enabled perks, with exclusive forks reduced to the first on node in tree order. */
export function activeSpecPerks(
  spec: SpecializationDef,
  flags?: Partial<Record<string, boolean>>,
): SpecPerkDef[] {
  const seenGroups = new Set<string>();
  const active: SpecPerkDef[] = [];
  for (const perk of spec.perks) {
    if (!specPerkEnabled(perk, flags)) continue;
    if (perk.exclusiveGroup) {
      if (seenGroups.has(perk.exclusiveGroup)) continue;
      seenGroups.add(perk.exclusiveGroup);
    }
    active.push(perk);
  }
  return active;
}

function exclusivePerkLists(): SpecPerkDef[][] {
  return SPECIALIZATIONS.flatMap((spec) => exclusivePerkGroups(spec));
}

export function sanitizeSpecPerks(
  raw: Partial<Record<string, boolean>> | undefined | null,
): Partial<Record<string, boolean>> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const next: Partial<Record<string, boolean>> = {};
  for (const [id, value] of Object.entries(raw)) {
    if (!SPEC_PERK_IDS.has(id)) continue;
    next[id] = value === true;
  }
  for (const group of exclusivePerkLists()) {
    const onIds = group.filter((perk) => next[perk.id] === true).map((perk) => perk.id);
    if (onIds.length <= 1) continue;
    const keep = onIds[0];
    for (const perk of group) {
      if (perk.id !== keep && next[perk.id] === true) next[perk.id] = false;
    }
  }
  return Object.keys(next).length ? next : undefined;
}

export function setSpecPerkFlags(
  current: Partial<Record<string, boolean>> | undefined,
  spec: SpecializationDef,
  updater: (perk: SpecPerkDef) => boolean | undefined,
): Partial<Record<string, boolean>> | undefined {
  const next: Partial<Record<string, boolean>> = { ...(current ?? {}) };
  for (const perk of spec.perks) {
    const value = updater(perk);
    if (value === undefined) {
      delete next[perk.id];
    } else {
      next[perk.id] = value;
    }
  }
  return sanitizeSpecPerks(next);
}
