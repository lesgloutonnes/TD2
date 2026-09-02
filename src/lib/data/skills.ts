import type { SkillDef, SpecializationDef, SpecPerkDef, StatBonus, StatKey } from "../types";

export const SKILLS: SkillDef[] = [
  {
    id: "assault-turret",
    name: "Assault Turret",
    category: "Turret",
    description: "Automatic turret with sustained damage.",
  },
  {
    id: "artillery-turret",
    name: "Artillery Turret",
    category: "Turret",
    description: "Guided mortar. Strong skill DPS.",
    assumed: [{ stat: "skillDamage", value: 5 }],
    assumedNote: "Deployed offensive skill soft contribution.",
  },
  {
    id: "incinerator-turret",
    name: "Incinerator Turret",
    category: "Turret",
    description: "Flame cone, area control.",
  },
  {
    id: "sniper-turret",
    name: "Sniper Turret",
    category: "Turret",
    description: "Heavy long-range shots.",
  },
  {
    id: "striker-drone",
    name: "Striker Drone",
    category: "Drone",
    description: "Offensive drone that engages enemies.",
    assumed: [{ stat: "skillDamage", value: 5 }],
    assumedNote: "Deployed offensive skill soft contribution.",
  },
  {
    id: "defender-drone",
    name: "Defender Drone",
    category: "Drone",
    description: "Intercepts projectiles around the agent.",
  },
  {
    id: "bombardier-drone",
    name: "Bombardier Drone",
    category: "Drone",
    description: "Drops an explosive salvo on an area.",
  },
  {
    id: "tactician-drone",
    name: "Tactician Drone",
    category: "Drone",
    description: "Pulses and marks enemies (Sharpshooter).",
  },
  {
    id: "fixer-drone",
    name: "Fixer Drone",
    category: "Drone",
    description: "Follows an ally and repairs their armor.",
  },
  {
    id: "cluster-seeker",
    name: "Cluster Seeker Mine",
    category: "Seeker Mine",
    description: "Splits into submunitions. Classic skill DPS.",
    assumed: [{ stat: "skillDamage", value: 5 }],
    assumedNote: "Deployed offensive skill soft contribution.",
  },
  {
    id: "explosive-seeker",
    name: "Explosive Seeker Mine",
    category: "Seeker Mine",
    description: "Single large explosion.",
  },
  {
    id: "airburst-seeker",
    name: "Airburst Seeker Mine",
    category: "Seeker Mine",
    description: "Detonates above targets for area damage.",
  },
  {
    id: "mender-seeker",
    name: "Mender Seeker Mine",
    category: "Seeker Mine",
    description: "Repairs allies (Survivalist).",
  },
  {
    id: "stinger-hive",
    name: "Stinger Hive",
    category: "Hive",
    description: "Swarm of offensive micro-drones.",
  },
  {
    id: "restorer-hive",
    name: "Restorer Hive",
    category: "Hive",
    description: "Repairs ally armor in the area.",
    assumed: [{ stat: "skillRepair", value: 5 }],
    assumedNote: "Healing skill soft contribution.",
  },
  {
    id: "reviver-hive",
    name: "Reviver Hive",
    category: "Hive",
    description: "Automatic revive. Solo meta.",
    assumed: [{ stat: "incomingRepairs", value: 5 }],
    assumedNote: "Support hive soft contribution.",
  },
  {
    id: "booster-hive",
    name: "Booster Hive",
    category: "Hive",
    description: "Weapon handling, hazard protection, and melee damage buff for allies.",
  },
  {
    id: "artificer-hive",
    name: "Artificer Hive",
    category: "Hive",
    description: "Overcharges allied skills (Technician).",
  },
  {
    id: "oxidizer",
    name: "Oxidizer Chem Launcher",
    category: "Chem Launcher",
    description: "Acid DoT. Skill DPS / Eclipse.",
  },
  {
    id: "firestarter",
    name: "Firestarter Chem Launcher",
    category: "Chem Launcher",
    description: "Flammable cloud, then burn.",
  },
  {
    id: "riot-foam",
    name: "Riot Foam Chem Launcher",
    category: "Chem Launcher",
    description: "Immobilizes enemies.",
  },
  {
    id: "repair-chem",
    name: "Reinforcer Chem Launcher",
    category: "Chem Launcher",
    description: "Armor repair cloud.",
  },
  {
    id: "bulwark-shield",
    name: "Bulwark Shield",
    category: "Shield",
    description: "Full frontal cover, pistol only.",
    assumed: [{ stat: "armorPercent", value: 5 }],
    assumedNote: "Bulwark coverage approximated as +5% Total Armor.",
  },
  {
    id: "crusader-shield",
    name: "Crusader Shield",
    category: "Shield",
    description: "Shield + primary weapon. Heartbreaker / tank meta.",
    assumed: [{ stat: "weaponDamage", value: 5 }],
    assumedNote: "Shield enables Intimidate/HB playstyles; soft +5% WD.",
  },
  {
    id: "striker-shield",
    name: "Striker Shield",
    category: "Shield",
    description: "Small shield, pistol. Firewall.",
    assumed: [{ stat: "weaponDamage", value: 5 }],
    assumedNote: "Striker Shield CQC soft bonus.",
  },
  {
    id: "deflector-shield",
    name: "Deflector Shield",
    category: "Shield",
    description: "Reflects a portion of incoming projectiles.",
  },
  {
    id: "scanner-pulse",
    name: "Scanner Pulse",
    category: "Pulse",
    description: "Reveals enemies. Spotter synergy.",
  },
  {
    id: "remote-pulse",
    name: "Remote Pulse",
    category: "Pulse",
    description: "Deployable pulse, shorter cooldown.",
  },
  {
    id: "jammer-pulse",
    name: "Jammer Pulse",
    category: "Pulse",
    description: "Disables enemy skills. Spark.",
  },
  {
    id: "banshee-pulse",
    name: "Banshee Pulse",
    category: "Pulse",
    description: "Forward arc that disorients targets through cover (Gunner).",
  },
  {
    id: "achilles-pulse",
    name: "Achilles Pulse",
    category: "Pulse",
    description: "Marks weak points on a target; those spots take headshot damage.",
  },
  {
    id: "blinder-firefly",
    name: "Blinder Firefly",
    category: "Firefly",
    description: "Blinds enemies in a chain.",
  },
  {
    id: "burster-firefly",
    name: "Burster Firefly",
    category: "Firefly",
    description: "Detonates weak points and skills.",
  },
  {
    id: "demolisher-firefly",
    name: "Demolisher Firefly",
    category: "Firefly",
    description: "Destroys cover and armor weak points.",
  },
  {
    id: "decoy",
    name: "Decoy",
    category: "Decoy",
    description: "Draws aggro. Aegis / tank.",
  },
  {
    id: "shock-trap",
    name: "Shock Trap",
    category: "Trap",
    description: "Immobilizes enemies in the area.",
  },
  {
    id: "repair-trap",
    name: "Repair Trap",
    category: "Trap",
    description: "Armor repair zone.",
  },
  {
    id: "shrapnel-trap",
    name: "Shrapnel Trap",
    category: "Trap",
    description: "Proximity mines that explode and apply Bleed.",
  },
  {
    id: "precision-smart-cover",
    name: "Precision Smart Cover",
    category: "Smart Cover",
    description: "Reinforces cover: weapon handling, damage to targets out of cover, auto-reload on swap.",
  },
  {
    id: "fortified-smart-cover",
    name: "Fortified Smart Cover",
    category: "Smart Cover",
    description: "Reinforces cover: bonus armor, explosive resistance, stagger immunity.",
  },
  {
    id: "sticky-burn",
    name: "Burn Sticky Bomb",
    category: "Sticky Bomb",
    description: "Explosion + burn.",
  },
  {
    id: "sticky-emp",
    name: "EMP Sticky Bomb",
    category: "Sticky Bomb",
    description: "Disables skills and robots.",
  },
  {
    id: "sticky-explosive",
    name: "Explosive Sticky Bomb",
    category: "Sticky Bomb",
    description: "Large explosive burst.",
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
applySkillModel("airburst-seeker", [{ stat: "skillDamage", value: 5 }], "Deployed offensive skill soft contribution.");
applySkillModel("mender-seeker", [{ stat: "skillRepair", value: 5 }], "Healing skill soft contribution.");
applySkillModel("stinger-hive", [{ stat: "skillDamage", value: 5 }], "Deployed offensive skill soft contribution.");
applySkillModel("booster-hive", [{ stat: "weaponHandling", value: 5 }, { stat: "weaponDamage", value: 4 }], "Booster Hive group buff averaged.");
applySkillModel("artificer-hive", [{ stat: "skillDamage", value: 8 }, { stat: "skillRepair", value: 8 }], "Artificer overcharge averaged.");
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

/**
 * Live Y8S3 PvE (TU 2.34) specialization sheet perks.
 * Red Horizon notes + live gear PDF (ubi.li/4Yvr2) do not retune spec trees.
 * In-game English node names: Amped, Overclocked CPU, Enhanced Diagnostics
 * (Division Dispatch 1 Aug 2026; gem-con / Namu trees). Exclusive sheet fork is
 * Technician only. Combat procs, signature ammo, skill unlocks, armor-kit
 * extras, and 3-rank weapon-type stacks beyond the +5% toggle stay unmodeled.
 */
export const SPECIALIZATIONS: SpecializationDef[] = [
  {
    id: "gunner",
    name: "Gunner",
    signature: "M134 Minigun",
    description: "Minigun, Banshee Pulse, Riot Foam. Red DPS meta.",
    perks: [
      sheetPerk("gunner", "aok", "Armor on Kill", [{ stat: "armorOnKill", value: 10 }]),
      sheetPerk("gunner", "ammo", "Ammo Capacity", [{ stat: "ammoCapacity", value: 25 }]),
      ...weaponTypePerks("gunner"),
    ],
  },
  {
    id: "technician",
    name: "Technician",
    signature: "P-017 Missile Launcher",
    description: "Artificer Hive, EMP grenades. Skill meta.",
    perks: [
      sheetPerk("technician", "tier", "Amped", [{ stat: "skillTier", value: 1 }]),
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
      ...weaponTypePerks("technician"),
    ],
  },
  {
    id: "sharpshooter",
    name: "Sharpshooter",
    signature: "TAC-50",
    description: "Armor-piercing TAC-50, Tactician Drone.",
    perks: [
      sheetPerk("sharpshooter", "hsd", "Headshot Damage", [{ stat: "hsd", value: 15 }]),
      sheetPerk("sharpshooter", "mmr", "Marksman Rifle damage", [{ stat: "mmrDamage", value: 10 }]),
      ...weaponTypePerks("sharpshooter").filter((perk) => perk.id !== "sharpshooter-mmr"),
    ],
  },
  {
    id: "survivalist",
    name: "Survivalist",
    signature: "Explosive Crossbow",
    description: "Support, group heals, status effects, incendiary grenades.",
    perks: [
      sheetPerk("survivalist", "repairs", "Incoming Repairs", [{ stat: "incomingRepairs", value: 10 }]),
      sheetPerk("survivalist", "status", "Status Effects", [{ stat: "statusEffects", value: 10 }]),
      ...weaponTypePerks("survivalist"),
    ],
  },
  {
    id: "demolitionist",
    name: "Demolitionist",
    signature: "M32A1 Grenade Launcher",
    description: "Explosives, improved armor kits, LMGs.",
    perks: [
      sheetPerk("demolitionist", "explosive", "Explosive Damage", [{ stat: "explosiveDamage", value: 15 }]),
      sheetPerk("demolitionist", "lmg", "LMG damage", [{ stat: "lmgDamage", value: 10 }]),
      ...weaponTypePerks("demolitionist").filter((perk) => perk.id !== "demolitionist-lmg"),
    ],
  },
  {
    id: "firewall",
    name: "Firewall",
    signature: "K8-JetStream Flamethrower",
    description: "CQC, burns, Striker Shield, flamethrower.",
    perks: [
      sheetPerk("firewall", "armor", "Total Armor", [{ stat: "armorPercent", value: 10 }]),
      sheetPerk("firewall", "status", "Status Effects", [{ stat: "statusEffects", value: 10 }]),
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
