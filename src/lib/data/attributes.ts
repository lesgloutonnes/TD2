import type { CoreType, ItemKind, Slot, StatBonus, StatKey } from "../types";

export const SLOTS: Slot[] = [
  "mask",
  "backpack",
  "chest",
  "gloves",
  "holster",
  "kneepads",
];

export const SLOT_LABELS: Record<Slot, string> = {
  mask: "Mask",
  backpack: "Backpack",
  chest: "Chest",
  gloves: "Gloves",
  holster: "Holster",
  kneepads: "Kneepads",
};

export const CORE_LABELS: Record<CoreType, string> = {
  red: "Weapon Damage",
  blue: "Armor",
  yellow: "Skill Tier",
};

export const CORE_SHORT_LABELS: Record<CoreType, string> = {
  red: "Red",
  blue: "Blue",
  yellow: "Yellow",
};

export const CORE_OPTION_LABELS: Record<CoreType, string> = {
  red: "Red — Weapon Damage",
  blue: "Blue — Armor",
  yellow: "Yellow — Skill Tier",
};

export const CORE_VALUES: Record<CoreType, StatBonus> = {
  red: { stat: "weaponDamage", value: 15 },
  blue: { stat: "armor", value: 170000 },
  yellow: { stat: "skillTier", value: 1 },
};

export const CORE_COLORS: Record<CoreType, string> = {
  red: "#e23d3d",
  blue: "#3d8fe2",
  yellow: "#e2c03d",
};

export const EMPTY_SLOT_COLOR = "#3a414c";

/** TD2 ID colors: high-end gold, gear set emerald, exotic red. */
export const KIND_COLORS: Record<ItemKind, string> = {
  brand: "#d4af37",
  named: "#d4af37",
  "gear-set": "#2ecc71",
  exotic: "#c41e3a",
};

export function itemKindColor(kind: ItemKind): string {
  return KIND_COLORS[kind];
}

export const KIND_LABELS: Record<ItemKind, string> = {
  brand: "Brands",
  "gear-set": "Gear Sets",
  named: "Named",
  exotic: "Exotics",
};

export const STAT_LABELS: Record<StatKey, string> = {
  weaponDamage: "Weapon Damage",
  chc: "Critical Hit Chance",
  chd: "Critical Hit Damage",
  hsd: "Headshot Damage",
  weaponHandling: "Weapon Handling",
  armor: "Armor",
  health: "Health",
  armorRegen: "Armor Regeneration",
  armorOnKill: "Armor on Kill",
  hazardProtection: "Hazard Protection",
  explosiveResistance: "Explosive Resistance",
  incomingRepairs: "Incoming Repairs",
  skillDamage: "Skill Damage",
  skillHaste: "Skill Haste",
  skillDuration: "Skill Duration",
  skillRepair: "Skill Repair",
  skillEfficiency: "Skill Efficiency",
  skillHealth: "Skill Health",
  statusEffects: "Status Effects",
  skillTier: "Skill Tier",
  arDamage: "Assault Rifle Damage",
  lmgDamage: "LMG Damage",
  smgDamage: "SMG Damage",
  shotgunDamage: "Shotgun Damage",
  mmrDamage: "Marksman Rifle Damage",
  rifleDamage: "Rifle Damage",
  pistolDamage: "Pistol Damage",
  reloadSpeed: "Reload Speed",
  magazineSize: "Magazine Size",
  ammoCapacity: "Ammo Capacity",
  rateOfFire: "Rate of Fire",
  stability: "Stability",
  accuracy: "Accuracy",
  damageToArmor: "Damage to Armor",
  damageToHealth: "Damage to Health",
  explosiveDamage: "Explosive Damage",
  pulseResistance: "Pulse Resistance",
  swapSpeed: "Swap Speed",
  optimalRange: "Optimal Range",
  threat: "Threat",
  protectionFromElites: "Protection from Elites",
};

export const STAT_MAX: Partial<Record<StatKey, number>> = {
  chc: 6,
  chd: 12,
  hsd: 10,
  weaponHandling: 8,
  damageToArmor: 6,
  damageToHealth: 6,
  skillDamage: 10,
  skillHaste: 12,
  skillRepair: 20,
  skillDuration: 8,
  statusEffects: 10,
  armorRegen: 0.5,
  armorOnKill: 10,
  hazardProtection: 10,
  health: 10,
  explosiveResistance: 10,
  incomingRepairs: 20,
  skillHealth: 10,
  skillEfficiency: 10,
  protectionFromElites: 10,
};

export const ATTRIBUTE_GROUPS: { label: string; stats: StatKey[] }[] = [
  {
    label: "Offensive",
    stats: ["chc", "chd", "hsd", "weaponHandling", "damageToArmor", "damageToHealth"],
  },
  {
    label: "Defensive",
    stats: [
      "armorRegen",
      "armorOnKill",
      "hazardProtection",
      "health",
      "explosiveResistance",
      "incomingRepairs",
    ],
  },
  {
    label: "Skill",
    stats: [
      "skillDamage",
      "skillHaste",
      "skillDuration",
      "skillRepair",
      "statusEffects",
      "skillHealth",
      "skillEfficiency",
    ],
  },
];

export const ATTRIBUTE_OPTIONS: StatKey[] = ATTRIBUTE_GROUPS.flatMap((group) => group.stats);

export const MOD_GROUPS: { label: string; stats: StatKey[] }[] = [
  { label: "Offensive", stats: ["chc", "chd", "hsd"] },
  {
    label: "Defensive",
    stats: [
      "armorOnKill",
      "incomingRepairs",
      "protectionFromElites",
      "hazardProtection",
      "health",
      "armorRegen",
    ],
  },
  {
    label: "Skill",
    stats: ["skillHaste", "skillDamage", "skillDuration", "skillRepair", "statusEffects"],
  },
];

export const MOD_OPTIONS: StatKey[] = MOD_GROUPS.flatMap((group) => group.stats);

export const GEAR_MOD_SLOTS: Slot[] = ["mask", "backpack", "chest"];

export function hasGearMod(slot: Slot): boolean {
  return GEAR_MOD_SLOTS.includes(slot);
}

export function parseStatInput(raw: string): number {
  const normalized = raw.trim().replace(",", ".");
  return Number(normalized);
}

export function clampStat(stat: StatKey, value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  const max = STAT_MAX[stat];
  const capped = max == null ? value : Math.min(value, max);
  return Math.round(capped * 10) / 10;
}

export function statStep(stat: StatKey): number {
  return stat === "armorRegen" ? 0.1 : 0.1;
}

export const PERCENT_STATS = new Set<StatKey>([
  "weaponDamage",
  "chc",
  "chd",
  "hsd",
  "weaponHandling",
  "health",
  "armorRegen",
  "armorOnKill",
  "hazardProtection",
  "explosiveResistance",
  "incomingRepairs",
  "skillDamage",
  "skillHaste",
  "skillDuration",
  "skillRepair",
  "skillEfficiency",
  "skillHealth",
  "statusEffects",
  "arDamage",
  "lmgDamage",
  "smgDamage",
  "shotgunDamage",
  "mmrDamage",
  "rifleDamage",
  "pistolDamage",
  "reloadSpeed",
  "magazineSize",
  "ammoCapacity",
  "rateOfFire",
  "stability",
  "accuracy",
  "damageToArmor",
  "damageToHealth",
  "explosiveDamage",
  "pulseResistance",
  "swapSpeed",
  "optimalRange",
  "threat",
  "protectionFromElites",
]);

export const SHD_WATCH: StatBonus[] = [
  { stat: "weaponDamage", value: 10 },
  { stat: "hsd", value: 20 },
  { stat: "chc", value: 10 },
  { stat: "chd", value: 20 },
  { stat: "armor", value: 10 },
  { stat: "health", value: 10 },
  { stat: "hazardProtection", value: 10 },
  { stat: "explosiveResistance", value: 10 },
  { stat: "skillHaste", value: 10 },
  { stat: "skillDamage", value: 10 },
  { stat: "statusEffects", value: 10 },
  { stat: "skillRepair", value: 20 },
];

export const CHC_CAP = 60;
export const SKILL_TIER_CAP = 6;
export const EXPERTISE_MAX = 30;
/** Approximate gear-piece armor used to apply per-piece expertise (+1% armor per level). */
export const GEAR_BASE_ARMOR = 170_000;

/** Weapon types allowed in primary / secondary slots (no pistols). */
export const PRIMARY_WEAPON_TYPES = [
  "ar",
  "lmg",
  "smg",
  "shotgun",
  "mmr",
  "rifle",
] as const;

export function formatStat(stat: StatKey, value: number): string {
  if (stat === "armor") {
    return Math.round(value).toLocaleString("en-US");
  }
  if (stat === "skillTier") {
    return `+${value}`;
  }
  const pretty = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `+${pretty}%`;
}

export function defaultAttributes(core: CoreType): StatBonus[] {
  if (core === "yellow") {
    return [
      { stat: "skillDamage", value: STAT_MAX.skillDamage ?? 10 },
      { stat: "skillHaste", value: STAT_MAX.skillHaste ?? 12 },
    ];
  }
  if (core === "blue") {
    return [
      { stat: "armorRegen", value: STAT_MAX.armorRegen ?? 0.5 },
      { stat: "hazardProtection", value: STAT_MAX.hazardProtection ?? 10 },
    ];
  }
  return [
    { stat: "chc", value: STAT_MAX.chc ?? 6 },
    { stat: "chd", value: STAT_MAX.chd ?? 12 },
  ];
}

export function defaultMod(core: CoreType): StatBonus {
  if (core === "yellow") return { stat: "skillHaste", value: 12 };
  if (core === "blue") return { stat: "hazardProtection", value: 10 };
  return { stat: "chc", value: 6 };
}

export function gearSetAttribute(core: CoreType): StatBonus {
  if (core === "yellow") return { stat: "skillDamage", value: STAT_MAX.skillDamage ?? 10 };
  if (core === "blue") return { stat: "armorRegen", value: STAT_MAX.armorRegen ?? 0.5 };
  return { stat: "chd", value: STAT_MAX.chd ?? 12 };
}
