export type Slot =
  | "mask"
  | "backpack"
  | "chest"
  | "gloves"
  | "holster"
  | "kneepads";

export type WeaponSlot = "primary" | "secondary" | "sidearm";

export type CoreType = "red" | "blue" | "yellow";

export type WeaponType =
  | "ar"
  | "lmg"
  | "smg"
  | "shotgun"
  | "mmr"
  | "rifle"
  | "pistol";

export type ItemKind = "brand" | "gear-set" | "named" | "exotic";

export type StatKey =
  | "weaponDamage"
  | "chc"
  | "chd"
  | "hsd"
  | "weaponHandling"
  | "armor"
  | "armorPercent"
  | "health"
  | "healthPercent"
  | "armorRegen"
  | "armorRegenPercent"
  | "armorOnKill"
  | "hazardProtection"
  | "bleedResistance"
  | "burnResistance"
  | "shockResistance"
  | "disruptResistance"
  | "blindResistance"
  | "ensnareResistance"
  | "explosiveResistance"
  | "incomingRepairs"
  | "skillDamage"
  | "skillHaste"
  | "skillDuration"
  | "skillRepair"
  | "skillEfficiency"
  | "skillHealth"
  | "statusEffects"
  | "skillTier"
  | "arDamage"
  | "lmgDamage"
  | "smgDamage"
  | "shotgunDamage"
  | "mmrDamage"
  | "rifleDamage"
  | "pistolDamage"
  | "reloadSpeed"
  | "magazineSize"
  | "ammoCapacity"
  | "rateOfFire"
  | "stability"
  | "accuracy"
  | "damageToArmor"
  | "damageToHealth"
  | "explosiveDamage"
  | "pulseResistance"
  | "swapSpeed"
  | "optimalRange"
  | "threat"
  | "protectionFromElites"
  | "scannerPulseHaste"
  | "meleeDamage"
  | "shieldHealth"
  | "signatureWeaponDamage";

export type StatBonus = {
  stat: StatKey;
  value: number;
};

export type Brand = {
  id: string;
  name: string;
  color: string;
  /** Fixed high-end core for this brand (Weapon Damage / Armor / Skill Tier). */
  core: CoreType;
  bonuses: [StatBonus[], StatBonus[], StatBonus[]];
};

export type GearSetDef = {
  id: string;
  name: string;
  color: string;
  core: CoreType;
  /** Slot-locked core when the set is not mono-core (Refactor, System Corruption…). */
  slotCores?: Partial<Record<Slot, CoreType>>;
  two: string;
  three: string;
  four: string;
  twoStats: StatBonus[];
  threeStats: StatBonus[];
  /** Max 4pc talent contribution (stacks / procs / conditionals at cap). */
  fourStats?: StatBonus[];
  fourAssumedNote?: string;
  backpackTalent: { name: string; description: string };
  chestTalent: { name: string; description: string };
};

export type GearTalent = {
  id: string;
  name: string;
  slot: "chest" | "backpack";
  description: string;
  perfect?: boolean;
  /** Max bonuses for stacks / procs / conditionals. Always-on passives use `passive`. */
  assumed?: StatBonus[];
  assumedNote?: string;
  /** Always-on while the talent is equipped (not gated by Include maxed bonuses). */
  passive?: boolean;
};

export type CatalogItem = {
  id: string;
  name: string;
  kind: ItemKind;
  brandId?: string;
  gearSetId?: string;
  slots: Slot[] | "all";
  uniqueTalent?: { name: string; description: string };
  talentSlot?: Slot;
  extraCores?: CoreType[];
  extraStats?: StatBonus[];
  /** Soft analyzer bonuses while this piece is equipped (exotics with uptime). */
  assumed?: StatBonus[];
  assumedNote?: string;
  /** Override gear mod socket count (default: 1 on mask/chest/backpack, else 0). */
  modSlots?: number;
  /**
   * Override secondary attribute count (default: 2, gear-set: 1).
   * Chill Out: 1 random unlocked attribute + 2 mod slots.
   */
  attributeSlots?: number;
  /**
   * Native / most common core for this item.
   * On exotics, also used as the locked core unless `coreLocked` is false (e.g. Investor).
   */
  lockedCore?: CoreType;
  /**
   * Explicit core lock override.
   * - `false`: core can vary / be recalibrated even on an exotic (Investor).
   * - `true`: force lock (rare multi-core packages).
   * Default: exotic with lockedCore → locked; brand / named / gear-set → unlocked.
   */
  coreLocked?: boolean;
  ninja?: boolean;
  note?: string;
};

export type WeaponDef = {
  id: string;
  name: string;
  type: WeaponType;
  quality: "high-end" | "named" | "exotic";
  rpm: number;
  mag: number;
  talent: string;
  talentDesc: string;
  /** Locked named / exotic attributes shown on the tooltip. */
  extraStats?: StatBonus[];
  /** Max stack / proc / conditional bonuses when Include maxed bonuses is on. */
  assumed?: StatBonus[];
  assumedNote?: string;
  /** Always-on while this weapon is active (not gated by Include maxed bonuses). */
  assumedPassive?: boolean;
};

export type SkillDef = {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Soft analyzer bonuses while this skill is equipped. */
  assumed?: StatBonus[];
  assumedNote?: string;
};

export type SpecPerkGroup = "sheet" | "weapon-type";

export type SpecPerkDef = {
  id: string;
  name: string;
  bonuses: StatBonus[];
  group: SpecPerkGroup;
  /** Omitted loadout flags use this. Sheet perks default on; weapon-type nodes default off. */
  defaultOn: boolean;
};

export type SpecializationDef = {
  id: string;
  name: string;
  signature: string;
  perks: SpecPerkDef[];
  description: string;
};

export type GearPiece = {
  slot: Slot;
  sourceId: string;
  core: CoreType;
  extraCores?: CoreType[];
  attributes: StatBonus[];
  talentId?: string;
  uniqueTalent?: { name: string; description: string };
  mods: StatBonus[];
  /** Per-piece expertise 0–30 (boosts that piece's armor). */
  expertise: number;
  /**
   * Prototype quality (Y8). Brand / named / gear-set only — never exotics.
   * Raises attribute caps (~1.5×) and red/blue core values; Skill Tier unchanged.
   */
  prototype?: boolean;
  /** Prototype Augment id (only when prototype). */
  augmentId?: string;
  /** Augment level 1–10 (only when prototype). */
  augmentLevel?: number;
};

export type WeaponModKind = "optic" | "magazine" | "muzzle" | "underbarrel";

export type WeaponMod = {
  kind: WeaponModKind;
  stat: StatKey;
  value: number;
};

export type EquippedWeapon = {
  weaponId: string;
  /** Per-weapon expertise 0–30 (Weapon Damage on that weapon). */
  expertise: number;
  /** Optic / magazine / muzzle / underbarrel (pistols: optic + muzzle). */
  mods?: WeaponMod[];
  /**
   * Prototype quality (Y8). High-end / named only — never exotics.
   * Active weapon Augment stacks with gear Prototypes (7 max).
   */
  prototype?: boolean;
  /** Prototype Augment id (only when prototype). */
  augmentId?: string;
  /** Augment level 1–10 (only when prototype). */
  augmentLevel?: number;
  /**
   * High-end weapon talent override. Named / exotic talents stay locked
   * to the catalog entry.
   */
  talentId?: string;
};

export type EquippedSkill = {
  skillId: string;
  /**
   * Skill attachment mod ids (one per live Gear 2.0 slot).
   * Per-variant pools with max rolls; they only affect that skill.
   */
  mods?: string[];
  /** Per-skill expertise 0–30 (this skill only). */
  expertise?: number;
};

export type ShdWatchPartId =
  | "weaponDamage"
  | "hsd"
  | "chc"
  | "chd"
  | "armorPercent"
  | "healthPercent"
  | "hazardProtection"
  | "explosiveResistance"
  | "skillHaste"
  | "skillDamage"
  | "statusEffects"
  | "skillRepair";

export type Loadout = {
  name: string;
  gear: Record<Slot, GearPiece | null>;
  weapons: Record<WeaponSlot, EquippedWeapon | null>;
  skills: [EquippedSkill | null, EquippedSkill | null];
  specialization: string | null;
  /**
   * Per-perk flags for the selected specialization. Omitted keys use each perk's
   * `defaultOn`. Sheet perks default on (same as the old bundled spec bonuses);
   * optional weapon-type nodes default off.
   */
  specPerks?: Partial<Record<string, boolean>>;
  /** Master SHD Watch toggle. When true, `shdWatchParts` can disable individual bonuses. */
  shdWatch: boolean;
  /**
   * Per-bonus SHD Watch value (0 to that line's SHD 1000 max).
   * Omitted keys default to max when `shdWatch` is true.
   * Legacy boolean `false` still means 0.
   */
  shdWatchParts?: Partial<Record<ShdWatchPartId, number | boolean>>;
  /**
   * When true, add max stacks / procs / conditional bonuses to Analysis.
   * Hard rolls (cores, attributes, mods, brand 1–3pc, set 2–3pc) always apply.
   */
  includeAssumed: boolean;
  /** Weapon whose expertise, mods, talent, and Prototype Augment feed Analysis. */
  activeWeapon: WeaponSlot;
  /**
   * Y8S3 Red Horizon Under Pressure. Omitted / `enabled: false` = play without the
   * seasonal modifier. One active + up to three passives, plus assumed pressure.
   */
  season?: SeasonModifier;
};

export type SeasonActiveId =
  | "fiery-aura"
  | "vicarious-combustion"
  | "signed-shield-delivered";

export type SeasonPassiveId =
  | "flow-regulator"
  | "throttle-valve"
  | "flux-stabilizer"
  | "pressure-control"
  | "quality-seals"
  | "delayed-venting"
  | "leaky-valve"
  | "vacuum-seal"
  | "reserve-tank"
  | "all-or-nothing"
  | "kickstart"
  | "microwave-coils"
  | "new-model"
  | "afterburner"
  | "flint-and-steel"
  | "fire-with-fire"
  | "firestarter"
  | "new-formula-beta"
  | "new-formula-gamma"
  | "modular-plates";

export type SeasonModifier = {
  enabled: boolean;
  activeId: SeasonActiveId;
  passives: [SeasonPassiveId | null, SeasonPassiveId | null, SeasonPassiveId | null];
  /** Assumed Pressure Gauge 0–100 for planning. */
  pressure: number;
};

export type ActiveBonus = {
  id: string;
  source: string;
  label: string;
  detail: string;
  pieces: number;
  required: number;
  active: boolean;
  color: string;
};

export type SkillLocalStats = {
  skillId: string;
  name: string;
  expertise: number;
  bonuses: StatBonus[];
  extras: string[];
  summary: string;
};

export type ComputedStats = {
  cores: { red: number; blue: number; yellow: number };
  values: Record<StatKey, number>;
  /** Flat amounts derived from gear + % bonuses. */
  derived: {
    /** Total armor regenerated per second (flat attrs + % of total armor). */
    armorRegenPerSec: number;
    /** Armor restored on kill (armor × armorOnKill% / 100). */
    armorOnKillFlat: number;
    /** Effective health pool (base + flat attrs, then Health %). */
    healthFlat: number;
  };
  chcCapped: number;
  chcOvercap: number;
  skillTierCapped: number;
  bonuses: ActiveBonus[];
  skillLocal: SkillLocalStats[];
  includeAssumed: boolean;
  activeWeapon: WeaponSlot;
  offensiveIndex: number;
  notes: string[];
};
