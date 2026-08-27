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
  | "armorRegen"
  | "armorOnKill"
  | "hazardProtection"
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
  | "protectionFromElites";

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
  /** Assumed average 4pc talent contribution for the analyzer. */
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
  /** Assumed uptime bonuses for the analyzer (combat procs averaged). */
  assumed?: StatBonus[];
  assumedNote?: string;
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
  lockedCore?: CoreType;
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
  /** Soft analyzer bonuses when this weapon is the primary. */
  assumed?: StatBonus[];
  assumedNote?: string;
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

export type SpecializationDef = {
  id: string;
  name: string;
  signature: string;
  bonuses: StatBonus[];
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

export type EquippedWeapon = {
  weaponId: string;
  /** Per-weapon expertise 0–30 (Weapon Damage on that weapon). */
  expertise: number;
};

export type Loadout = {
  name: string;
  gear: Record<Slot, GearPiece | null>;
  weapons: Record<WeaponSlot, EquippedWeapon | null>;
  skills: [string | null, string | null];
  specialization: string | null;
  shdWatch: boolean;
};

export type ActiveBonus = {
  source: string;
  label: string;
  detail: string;
  pieces: number;
  required: number;
  active: boolean;
  color: string;
};

export type ComputedStats = {
  cores: { red: number; blue: number; yellow: number };
  values: Record<StatKey, number>;
  chcCapped: number;
  chcOvercap: number;
  skillTierCapped: number;
  bonuses: ActiveBonus[];
  offensiveIndex: number;
  notes: string[];
};
