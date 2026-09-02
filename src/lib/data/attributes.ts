import type { CoreType, ItemKind, Slot, StatBonus, StatKey, WeaponSlot, ShdWatchPartId } from "../types";

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

export const WEAPON_SLOT_LABELS: Record<WeaponSlot, string> = {
  primary: "Primary weapon",
  secondary: "Secondary weapon",
  sidearm: "Sidearm",
};

export const WEAPON_QUALITY_LABELS: Record<"high-end" | "named" | "exotic", string> = {
  "high-end": "High-End",
  named: "Named",
  exotic: "Exotic",
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

/**
 * In-game Prototype quality tint (purple / magenta), overrides brand gold / set emerald.
 * Exotics stay red and cannot be Prototype.
 */
export const PROTOTYPE_COLOR = "#9b3dff";

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

/** Swatch color for a gear piece — Prototype purple, else kind gold/green/red. */
export function itemDisplayColor(kind: ItemKind, prototype = false): string {
  if (prototype && kind !== "exotic") return PROTOTYPE_COLOR;
  return itemKindColor(kind);
}

/** Swatch color for a weapon — Prototype purple, else gold HE/named or exotic red. */
export function weaponDisplayColor(
  quality: "high-end" | "named" | "exotic",
  prototype = false,
): string {
  if (prototype && quality !== "exotic") return PROTOTYPE_COLOR;
  if (quality === "exotic") return KIND_COLORS.exotic;
  return KIND_COLORS.named;
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
  armorPercent: "Total Armor",
  health: "Health",
  healthPercent: "Bonus Health",
  armorRegen: "Armor Regeneration",
  armorRegenPercent: "Armor Regeneration %",
  armorOnKill: "Armor on Kill",
  hazardProtection: "Hazard Protection",
  bleedResistance: "Bleed Resistance",
  burnResistance: "Burn Resistance",
  shockResistance: "Shock Resistance",
  disruptResistance: "Disrupt Resistance",
  blindResistance: "Blind/Deaf Resistance",
  ensnareResistance: "Ensnare Resistance",
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
  scannerPulseHaste: "Scanner Pulse Haste",
  meleeDamage: "Melee Damage",
  shieldHealth: "Shield Health",
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
  /** Flat HP/s on gear attributes / mods (live UI). */
  armorRegen: 4925,
  armorOnKill: 10,
  hazardProtection: 10,
  bleedResistance: 10,
  burnResistance: 10,
  shockResistance: 10,
  disruptResistance: 10,
  blindResistance: 10,
  ensnareResistance: 10,
  /** Flat health on gear attributes / mods. */
  health: 18935,
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
      "hazardProtection",
      "health",
      "explosiveResistance",
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
      "bleedResistance",
      "burnResistance",
      "shockResistance",
      "disruptResistance",
      "blindResistance",
      "ensnareResistance",
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

/** Number of gear mod sockets for this slot / catalog piece (Chill Out = 2). */
export function gearModCount(
  slot: Slot,
  source?: { modSlots?: number } | null,
): number {
  if (source?.modSlots != null) return Math.max(0, source.modSlots);
  return hasGearMod(slot) ? 1 : 0;
}

/** Secondary attribute rolls (Chill Out = 1; gear sets = 1). */
export function gearAttributeCount(source?: {
  attributeSlots?: number;
  kind?: ItemKind;
} | null): number {
  if (source?.attributeSlots != null) return Math.max(0, source.attributeSlots);
  if (source?.kind === "gear-set") return 1;
  return 2;
}

/** Default secondary attributes for a newly equipped / re-cored piece. */
export function defaultPieceAttributes(
  core: CoreType,
  source?: { attributeSlots?: number; kind?: ItemKind } | null,
): StatBonus[] {
  if (source?.kind === "gear-set") return [gearSetAttribute(core)];
  return defaultAttributes(core).slice(0, gearAttributeCount(source));
}

export function defaultMods(count: number, core: CoreType): StatBonus[] {
  return Array.from({ length: count }, () => defaultMod(core));
}

export function parseStatInput(raw: string): number {
  const normalized = raw.trim().replace(",", ".");
  return Number(normalized);
}

export function clampStat(stat: StatKey, value: number, prototype = false): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  const max = statMax(stat, prototype);
  const capped = max == null ? value : Math.min(value, max);
  if (stat === "armorRegen" || stat === "health" || stat === "armor") {
    return Math.round(capped);
  }
  return Math.round(capped * 10) / 10;
}

export function statStep(stat: StatKey): number {
  if (stat === "armorRegen") return 25;
  if (stat === "health") return 100;
  return 0.1;
}

/** Prototype attribute ceiling multiplier (old HE max → new floor; new max ≈ 1.5×). */
export const PROTOTYPE_ATTR_MULT = 1.5;

export function canBePrototype(kind: ItemKind | undefined): boolean {
  return Boolean(kind && kind !== "exotic");
}

export function canWeaponBePrototype(
  quality: "high-end" | "named" | "exotic" | undefined,
): boolean {
  return Boolean(quality && quality !== "exotic");
}

export function statMax(stat: StatKey, prototype = false): number | undefined {
  const base = STAT_MAX[stat];
  if (base == null) return undefined;
  if (!prototype) return base;
  return Math.round(base * PROTOTYPE_ATTR_MULT * 10) / 10;
}

/** Scale attribute rolls to Prototype max (optimized conversion). */
export function scaleAttributesForPrototype(
  bonuses: StatBonus[],
  prototype: boolean,
): StatBonus[] {
  return bonuses.map((bonus) => ({
    ...bonus,
    value: clampStat(bonus.stat, statMax(bonus.stat, prototype) ?? bonus.value, prototype),
  }));
}

/** Core value multiplier for Prototype (Skill Tier cores stay 1× in live game). */
export function prototypeCoreMult(core: CoreType): number {
  return core === "yellow" ? 1 : PROTOTYPE_ATTR_MULT;
}

export const PERCENT_STATS = new Set<StatKey>([
  "weaponDamage",
  "chc",
  "chd",
  "hsd",
  "weaponHandling",
  "healthPercent",
  "armorPercent",
  "armorRegenPercent",
  "armorOnKill",
  "hazardProtection",
  "bleedResistance",
  "burnResistance",
  "shockResistance",
  "disruptResistance",
  "blindResistance",
  "ensnareResistance",
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

export type ShdWatchPart = {
  id: ShdWatchPartId;
  label: string;
  bonus: StatBonus;
};

/** SHD Watch 1000 bonuses, split so the planner can toggle each line. */
export const SHD_WATCH_PARTS: ShdWatchPart[] = [
  { id: "weaponDamage", label: "Weapon Damage", bonus: { stat: "weaponDamage", value: 10 } },
  { id: "hsd", label: "Headshot Damage", bonus: { stat: "hsd", value: 20 } },
  { id: "chc", label: "Critical Hit Chance", bonus: { stat: "chc", value: 10 } },
  { id: "chd", label: "Critical Hit Damage", bonus: { stat: "chd", value: 20 } },
  { id: "armorPercent", label: "Total Armor", bonus: { stat: "armorPercent", value: 10 } },
  { id: "healthPercent", label: "Bonus Health", bonus: { stat: "healthPercent", value: 10 } },
  { id: "hazardProtection", label: "Hazard Protection", bonus: { stat: "hazardProtection", value: 10 } },
  { id: "explosiveResistance", label: "Explosive Resistance", bonus: { stat: "explosiveResistance", value: 10 } },
  { id: "skillHaste", label: "Skill Haste", bonus: { stat: "skillHaste", value: 10 } },
  { id: "skillDamage", label: "Skill Damage", bonus: { stat: "skillDamage", value: 10 } },
  { id: "statusEffects", label: "Status Effects", bonus: { stat: "statusEffects", value: 10 } },
  { id: "skillRepair", label: "Repair Skills", bonus: { stat: "skillRepair", value: 20 } },
];

export const SHD_WATCH: StatBonus[] = SHD_WATCH_PARTS.map((part) => part.bonus);

export function resolveShdWatchBonuses(
  shdWatch: boolean,
  parts?: Partial<Record<ShdWatchPartId, boolean>>,
): StatBonus[] {
  if (!shdWatch) return [];
  return SHD_WATCH_PARTS.filter((part) => parts?.[part.id] !== false).map((part) => part.bonus);
}

export const CHC_CAP = 60;
export const SKILL_TIER_CAP = 6;
export const EXPERTISE_MAX = 30;
/** Approximate gear-piece armor used to apply per-piece expertise (+1% armor per level). */
export const GEAR_BASE_ARMOR = 170_000;
/** Approximate level-40 agent base health (Health % applies on top). */
export const AGENT_BASE_HEALTH = 167_000;

/** Attribute color buckets (used by Investor and similar). */
export const OFFENSIVE_ATTRS = new Set<StatKey>([
  "chc",
  "chd",
  "hsd",
  "weaponHandling",
  "damageToArmor",
  "damageToHealth",
]);
export const DEFENSIVE_ATTRS = new Set<StatKey>([
  "armorRegen",
  "hazardProtection",
  "health",
  "explosiveResistance",
]);
export const SKILL_ATTRS = new Set<StatKey>([
  "skillDamage",
  "skillHaste",
  "skillDuration",
  "skillRepair",
  "statusEffects",
  "skillHealth",
  "skillEfficiency",
]);

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
  if (stat === "armor" || stat === "health") {
    return Math.round(value).toLocaleString("en-US");
  }
  if (stat === "armorRegen") {
    return `${Math.round(value).toLocaleString("en-US")}/s`;
  }
  if (stat === "armorPercent" || stat === "healthPercent" || stat === "armorRegenPercent") {
    const pretty = Number.isInteger(value) ? String(value) : value.toFixed(1);
    return `+${pretty}%`;
  }
  if (stat === "skillTier") {
    return `+${value}`;
  }
  const pretty = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `+${pretty}%`;
}

/** Format a flat armor/health amount for analysis panels. */
export function formatFlatAmount(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

/**
 * Total armor regen /s = flat attribute rolls + brand/set % of total armor.
 * Gear attributes show as HP/s in-game; Belstone / Foundry / etc. remain %.
 */
export function totalArmorRegenPerSec(
  flatRegen: number,
  totalArmor: number,
  armorRegenPercent: number,
): number {
  return flatRegen + (totalArmor * armorRegenPercent) / 100;
}

export function armorOnKillFlat(totalArmor: number, armorOnKillPercent: number): number {
  return (totalArmor * armorOnKillPercent) / 100;
}

export function resolveHealthFlat(flatHealth: number, healthPercent: number): number {
  return (AGENT_BASE_HEALTH + flatHealth) * (1 + healthPercent / 100);
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
      { stat: "armorRegen", value: STAT_MAX.armorRegen ?? 4925 },
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
  if (core === "blue") return { stat: "armorRegen", value: STAT_MAX.armorRegen ?? 4925 };
  return { stat: "chd", value: STAT_MAX.chd ?? 12 };
}
