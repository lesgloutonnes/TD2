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
  backpackTalent: { name: string; description: string };
  chestTalent: { name: string; description: string };
};

export type GearTalent = {
  id: string;
  name: string;
  slot: "chest" | "backpack";
  description: string;
  perfect?: boolean;
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
};

export type SkillDef = {
  id: string;
  name: string;
  category: string;
  description: string;
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
};

export type EquippedWeapon = {
  weaponId: string;
};

export type Loadout = {
  name: string;
  gear: Record<Slot, GearPiece | null>;
  weapons: Record<WeaponSlot, EquippedWeapon | null>;
  skills: [string | null, string | null];
  specialization: string | null;
  shdWatch: boolean;
  expertise: number;
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
