import type { StatBonus, WeaponType } from "../types";
import { WEAPONS, WEAPON_TYPE_LABELS } from "./weapons";
import { SKILLS } from "./skills";

const TYPE_ORDER: WeaponType[] = ["ar", "lmg", "smg", "shotgun", "mmr", "rifle", "pistol"];

/** Weapons sorted by type family, then name — for dropdowns. */
export function weaponsSorted(types?: readonly WeaponType[]) {
  const list = types ? WEAPONS.filter((weapon) => types.includes(weapon.type)) : [...WEAPONS];
  return list.sort((a, b) => {
    const typeDelta = TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
    if (typeDelta !== 0) return typeDelta;
    return a.name.localeCompare(b.name, "en");
  });
}

/** Group sorted weapons for <optgroup> rendering. */
export function weaponsByType(types?: readonly WeaponType[]) {
  const sorted = weaponsSorted(types);
  const groups: { type: WeaponType; label: string; weapons: typeof WEAPONS }[] = [];
  for (const type of TYPE_ORDER) {
    const weapons = sorted.filter((weapon) => weapon.type === type);
    if (!weapons.length) continue;
    groups.push({ type, label: WEAPON_TYPE_LABELS[type], weapons });
  }
  return groups;
}

/**
 * Live Gear 2.0 skill attachments (level 40 max rolls).
 * Named slots per platform, pools per variant — not shared family leftovers.
 * Bonuses apply to this skill only (they do not raise gear Skill Damage / Haste).
 * Ammo and charges from mods are small; Skill Tier is the main scaler.
 */
export type SkillModOption = {
  id: string;
  name: string;
  /** Max-roll effect line, this skill only. */
  effect: string;
  /** Variants that can roll this. Omit = every variant of the platform. */
  skills?: readonly string[];
  /** Specialization unique mod; only listed when that spec is selected. */
  spec?: string;
};

export type SkillModSlotDef = {
  id: string;
  /** In-game slot name (Firing Mechanism, Pneumatics, Hull…). */
  label: string;
  options: SkillModOption[];
};

const EMPTY: SkillModOption = {
  id: "none",
  name: "Empty",
  effect: "No attachment in this slot.",
};

function opt(
  id: string,
  name: string,
  effect: string,
  skills?: readonly string[],
  spec?: string,
): SkillModOption {
  return { id, name, effect, skills, spec };
}

function slots(defs: Array<[string, string, SkillModOption[]]>): SkillModSlotDef[] {
  return defs.map(([id, label, options]) => ({ id, label, options }));
}

/**
 * Platform → named slots. Option `skills` / `spec` further restrict the pool.
 * Max rolls: Namu wiki Gear 2.0 / level 40 tables (live Y8S3 PvE).
 * Official Y8S3 skill PDF (ubi.li/DpMjQ, 24 Aug 2026) lists PvE white + PvP red.
 * PvP / Conflict / DZ Global PvP Balance rows are not applied here.
 * PvE base/tier lines fill variant-gated attachment holes Namu skipped
 * (Jammer Radius, Hive Extra Charges for Reviver/Artificer, Trap unique lines, Airburst Burn)
 * with family-typical Gear 2.0 caps when Namu does not publish a max %.
 * Achilles Pulse coil unique is unpublished (Namu coil is Radius / Cone Size only; PDF has no Achilles radius) — Housing still rolls.
 * Smart Cover slot names from Namu; max rolls unpublished there, so family-typical Gear 2.0 caps.
 */
const PLATFORM_SLOTS: Record<string, SkillModSlotDef[]> = {
  Pulse: slots([
    [
      "coil",
      "Coil",
      [
        opt("coil-radius", "Radius", "+10% radius", ["scanner-pulse", "remote-pulse", "jammer-pulse"]),
        opt("coil-cone", "Cone Size", "+7.5% cone size", ["banshee-pulse"]),
        opt(
          "gunner-directional-transmitter",
          "Directional Transmitter",
          "+15% radius (Gunner unique)",
          ["scanner-pulse", "remote-pulse", "jammer-pulse", "banshee-pulse"],
          "gunner",
        ),
      ],
    ],
    [
      "housing",
      "Housing",
      [
        opt("housing-haste", "Skill Haste", "+6% Skill Haste"),
        opt("housing-duration", "Effect Duration", "+10% duration"),
        opt("housing-health", "Skill Health", "+20% Skill Health"),
        opt(
          "gunner-microwave-amplifier",
          "Microwave Amplifier",
          "+15% duration (Gunner unique)",
          undefined,
          "gunner",
        ),
      ],
    ],
  ]),
  Turret: slots([
    [
      "firing",
      "Firing Mechanism",
      [
        opt("firing-damage", "Damage", "+5% Damage", [
          "assault-turret",
          "sniper-turret",
          "artillery-turret",
        ]),
        opt("firing-burn", "Burn Damage", "+5% Burn Damage", ["incinerator-turret"]),
        opt(
          "demo-shd-cpu",
          "SHD CPU V.2",
          "+10% Damage (Demolitionist unique)",
          ["assault-turret", "sniper-turret", "artillery-turret"],
          "demolitionist",
        ),
      ],
    ],
    [
      "housing",
      "Housing",
      [
        opt("housing-duration", "Duration", "+7.5% Duration"),
        opt("housing-health", "Skill Health", "+10% Skill Health"),
        opt("housing-sniper-ammo", "Extra Sniper Ammo", "+1 sniper round", ["sniper-turret"]),
        opt("housing-mortar-ammo", "Extra Mortar Ammo", "+1 mortar round", ["artillery-turret"]),
        opt(
          "demo-cyclone-magazine",
          "Cyclone Magazine",
          "+1 mortar round (Demolitionist unique)",
          ["artillery-turret"],
          "demolitionist",
        ),
      ],
    ],
    [
      "targeting",
      "Targeting",
      [
        opt("targeting-haste", "Skill Haste", "+7.5% Skill Haste"),
        opt("targeting-duration", "Duration", "+7.5% Duration"),
      ],
    ],
  ]),
  Hive: slots([
    [
      "drones",
      "Drones",
      [
        opt("drones-damage", "Damage", "+5% Damage", ["stinger-hive"]),
        opt("drones-repair", "Repair", "+5% Repair", ["restorer-hive"]),
        opt("drones-skill-repair", "Skill Repair", "+5% Skill Repair", ["artificer-hive"]),
        opt("drones-revive-armor", "Revive Armor Restore", "+10% armor on revive", [
          "reviver-hive",
        ]),
        opt("drones-stim", "Stim Efficiency", "+10% stim efficiency", ["booster-hive"]),
      ],
    ],
    [
      "launcher",
      "Launcher",
      [
        opt("launcher-range", "Range", "+5% range"),
        opt("launcher-stinger-charges", "Extra Stinger Charges", "+1 charge", ["stinger-hive"]),
        opt("launcher-repair-charges", "Extra Repair Charges", "+1 charge", ["restorer-hive"]),
        opt("launcher-stim-charges", "Extra Stim Charges", "+1 charge", ["booster-hive"]),
        opt("launcher-reviver-charges", "Extra Charges", "+1 charge", ["reviver-hive"]),
        opt("launcher-artificer-charges", "Extra Charges", "+1 charge", ["artificer-hive"]),
        opt(
          "tech-sensor-package",
          "Upgrade Sensor Package",
          "+10% range (Technician unique)",
          undefined,
          "technician",
        ),
      ],
    ],
    [
      "system",
      "System",
      [
        opt("system-duration", "Duration", "+5% Duration"),
        opt("system-health", "Skill Health", "+10% Skill Health"),
        opt(
          "tech-liquid-cooling",
          "Liquid Cooling",
          "+10% Duration (Technician unique)",
          undefined,
          "technician",
        ),
      ],
    ],
  ]),
  "Chem Launcher": slots([
    [
      "agitator",
      "Agitator",
      [
        opt("agitator-damage", "Damage", "+5% Damage", ["oxidizer"]),
        opt("agitator-repair", "Repair", "+7.5% Repair", ["repair-chem"]),
        opt("agitator-burn", "Burn Strength", "+7.5% Burn Strength", ["firestarter"]),
        opt("agitator-foam-health", "Ensnare Foam Health", "+17.5% foam health", ["riot-foam"]),
        opt("agitator-foam-duration", "Ensnare Duration", "+10% ensnare duration", ["riot-foam"]),
      ],
    ],
    [
      "pneumatics",
      "Pneumatics",
      [
        opt("pneumatics-haste", "Skill Haste", "+7.5% Skill Haste"),
        opt("pneumatics-ammo", "Extra Ammo", "+1 ammo"),
        opt("pneumatics-radius", "Radius", "+7.5% radius"),
        opt("pneumatics-duration", "Duration", "+5% Duration"),
      ],
    ],
  ]),
  Firefly: slots([
    [
      "propulsion",
      "Propulsion",
      [
        opt("propulsion-haste", "Skill Haste", "+7.5% Skill Haste"),
        opt("propulsion-speed", "Speed", "+10% speed"),
      ],
    ],
    [
      "payload",
      "Payload",
      [
        opt("payload-damage", "Damage", "+7.5% Damage", ["burster-firefly", "demolisher-firefly"]),
        opt("payload-blind", "Blind Duration", "+7.5% blind duration", ["blinder-firefly"]),
      ],
    ],
    [
      "targeting",
      "Targeting",
      [opt("targeting-extra-target", "Extra Target", "+1 max target")],
    ],
  ]),
  "Seeker Mine": slots([
    [
      "drive",
      "Drive",
      [
        opt("drive-haste", "Skill Haste", "+6% Skill Haste"),
        opt("drive-radius", "Radius", "+5% radius"),
        opt("drive-damage", "Damage", "+5% Damage", [
          "cluster-seeker",
          "explosive-seeker",
          "airburst-seeker",
        ]),
      ],
    ],
    [
      "targeting",
      "Targeting",
      [
        opt("targeting-health", "Skill Health", "+7.5% Skill Health"),
        opt("targeting-cluster", "Extra Cluster Mines", "+1 submunition", ["cluster-seeker"]),
        opt(
          "survivalist-magnetic-disc",
          "Magnetic Disc",
          "+15% Skill Health (Survivalist unique)",
          undefined,
          "survivalist",
        ),
      ],
    ],
    [
      "payload",
      "Payload",
      [
        opt("payload-haste", "Skill Haste", "+6% Skill Haste"),
        opt("payload-damage", "Damage", "+5% Damage", [
          "cluster-seeker",
          "explosive-seeker",
          "airburst-seeker",
        ]),
        opt("payload-burn", "Burn Duration", "+5% burn duration", ["airburst-seeker"]),
        opt("payload-repair", "Repair", "+7.5% Repair", ["mender-seeker"]),
        opt(
          "survivalist-larrea",
          "Larrea Infusion",
          "+15% Repair (Survivalist unique)",
          ["mender-seeker"],
          "survivalist",
        ),
      ],
    ],
  ]),
  Drone: slots([
    [
      "battery",
      "Battery",
      [
        opt("battery-duration", "Duration", "+7.5% Duration", [
          "striker-drone",
          "bombardier-drone",
          "tactician-drone",
          "fixer-drone",
        ]),
        opt("battery-defender-duration", "Defender Duration", "+7.5% duration", ["defender-drone"]),
        opt(
          "sharpshooter-graphene",
          "Graphene Battery",
          "+15% Duration (Sharpshooter unique)",
          undefined,
          "sharpshooter",
        ),
      ],
    ],
    [
      "hull",
      "Hull",
      [
        opt("hull-health", "Skill Health", "+10% Skill Health"),
        opt("hull-bombs", "Extra Bombs", "+2 bombs", ["bombardier-drone"]),
        opt("hull-scan", "Scan Range", "+10% scan range", ["tactician-drone"]),
        opt(
          "sharpshooter-carbon",
          "Carbon Fiber Frame",
          "+20% scan range (Sharpshooter unique)",
          ["tactician-drone"],
          "sharpshooter",
        ),
      ],
    ],
    [
      "feed",
      "Feed",
      [
        opt("feed-damage", "Damage", "+5% Damage", ["striker-drone"]),
        opt("feed-reduction", "Damage Reduction", "+6% damage reduction", ["defender-drone"]),
        opt("feed-repair", "Armor Repair", "+7.5% Repair", ["fixer-drone"]),
      ],
    ],
  ]),
  Shield: slots([
    [
      "circuit",
      "Circuit Board",
      [
        opt("circuit-health", "Shield Health", "+5% Shield Health"),
        opt("circuit-holstered", "Holstered Regen", "+5% holstered regeneration"),
        opt("circuit-deflect", "Deflect Damage", "+5% deflected damage", ["deflector-shield"]),
        opt("circuit-damage-bonus", "Damage Bonus", "+1% damage bonus", ["striker-shield"]),
        opt(
          "firewall-impact",
          "Impact Hardening Armature",
          "+8% Shield Health (Firewall unique)",
          undefined,
          "firewall",
        ),
      ],
    ],
    [
      "coating",
      "Hard Coating",
      [
        opt("coating-health", "Shield Health", "+5% Shield Health"),
        opt("coating-active", "Active Regen", "+5% active regeneration"),
        opt("coating-deflect", "Deflect Damage", "+5% deflected damage", ["deflector-shield"]),
        opt(
          "firewall-polymer",
          "Polymer Exterior",
          "+8% active regeneration (Firewall unique)",
          undefined,
          "firewall",
        ),
      ],
    ],
    [
      "gyro",
      "Gyro",
      [
        opt("gyro-holstered", "Holstered Regen", "+5% holstered regeneration"),
        opt("gyro-deflect", "Deflect Damage", "+5% deflected damage", ["deflector-shield"]),
        opt("gyro-damage-bonus", "Damage Bonus", "+5% damage bonus", ["striker-shield"]),
      ],
    ],
  ]),
  "Sticky Bomb": slots([
    [
      "launcher",
      "Launcher",
      [
        opt("launcher-haste", "Skill Haste", "+5% Skill Haste"),
        opt("launcher-duration", "Duration", "+7.5% Duration"),
        opt("launcher-radius", "Explosion Radius", "+6% explosion radius"),
      ],
    ],
    [
      "payload",
      "Payload",
      [
        opt("payload-damage", "Damage", "+7.5% Damage", ["sticky-burn", "sticky-explosive"]),
        opt("payload-radius", "Explosion Radius", "+6% explosion radius"),
        opt("payload-burn", "Burn Duration", "+5% burn duration", ["sticky-burn"]),
        opt("payload-emp-radius", "EMP Blast Radius", "+6% EMP blast radius", ["sticky-emp"]),
      ],
    ],
  ]),
  Trap: slots([
    [
      "charge",
      "Charge",
      [
        opt("charge-duration", "Duration", "+5% Duration"),
        opt("charge-extra", "Extra Traps", "+1 trap"),
      ],
    ],
    [
      "electronic",
      "Electronic",
      [
        opt("electronic-duration", "Duration", "+7.5% Duration"),
        opt("electronic-radius", "Effect Radius", "+7.5% radius"),
        opt("electronic-damage", "Damage", "+5% Damage", ["shrapnel-trap"]),
        opt("electronic-repair", "Repair", "+7.5% Repair", ["repair-trap"]),
        opt("electronic-shock", "Shock Duration", "+7.5% shock duration", ["shock-trap"]),
      ],
    ],
  ]),
  Decoy: slots([
    ["housing", "Housing", [opt("housing-health", "Skill Health", "+7.5% Skill Health")]],
    ["projector", "Projector", [opt("projector-duration", "Duration", "+7.5% Duration")]],
  ]),
  /**
   * Battle for Brooklyn Smart Cover. Namu lists two slots and which lines roll,
   * but not max percentages. Caps below match other Gear 2.0 platforms
   * (7.5% duration / haste / radius, 5% unique stat lines).
   */
  "Smart Cover": slots([
    [
      "smart-launcher",
      "Smart Launcher",
      [
        opt("smart-launcher-radius", "Radius", "+7.5% radius"),
        opt("smart-launcher-haste", "Skill Haste", "+7.5% Skill Haste"),
        opt("smart-launcher-duration", "Duration", "+7.5% Duration"),
      ],
    ],
    [
      "smart-projectile",
      "Smart Projectile",
      [
        opt("smart-projectile-handling", "Weapon Handling", "+5% weapon handling", [
          "precision-smart-cover",
        ]),
        opt(
          "smart-projectile-out-of-cover",
          "Damage to Targets Out of Cover",
          "+5% damage to targets out of cover",
          ["precision-smart-cover"],
        ),
        opt("smart-projectile-bonus-armor", "Bonus Armor", "+5% bonus armor", [
          "fortified-smart-cover",
        ]),
        opt("smart-projectile-explosive", "Explosive Resistance", "+5% explosive resistance", [
          "fortified-smart-cover",
        ]),
        opt("smart-projectile-pulse-res", "Pulse Resistance", "+5% pulse resistance", [
          "fortified-smart-cover",
        ]),
      ],
    ],
  ]),
};

const SUPPORT_SKILL_IDS = new Set([
  "fixer-drone",
  "mender-seeker",
  "restorer-hive",
  "reviver-hive",
  "booster-hive",
  "artificer-hive",
  "repair-chem",
  "repair-trap",
  "fortified-smart-cover",
]);

function optionVisible(
  option: SkillModOption,
  skillId: string,
  spec: string | null | undefined,
): boolean {
  if (option.spec && option.spec !== spec) return false;
  if (option.skills && !option.skills.includes(skillId)) return false;
  return true;
}

function withEmpty(options: SkillModOption[]): SkillModOption[] {
  return [EMPTY, ...options];
}

/** Slots and the options this variant (and spec) can actually equip. */
export function skillModSlotsFor(
  skillId: string,
  spec?: string | null,
): SkillModSlotDef[] {
  const skill = SKILLS.find((item) => item.id === skillId);
  if (!skill) return [];
  const platform = PLATFORM_SLOTS[skill.category];
  if (!platform) return [];
  return platform.map((slot) => ({
    ...slot,
    options: withEmpty(
      slot.options.filter((option) => optionVisible(option, skillId, spec)),
    ),
  }));
}

export function skillModOptionById(
  skillId: string,
  modId: string | undefined | null,
  spec?: string | null,
): SkillModOption | undefined {
  if (!modId) return undefined;
  for (const slot of skillModSlotsFor(skillId, spec)) {
    const found = slot.options.find((option) => option.id === modId);
    if (found) return found;
  }
  return undefined;
}

export function skillModOptionLabel(option: SkillModOption): string {
  if (option.id === "none") return "Empty";
  return `${option.name}  ${option.effect}`;
}

function preferredDefault(skillId: string, slot: SkillModSlotDef): string {
  const usable = slot.options.filter((option) => option.id !== "none" && !option.spec);
  const prefer = SUPPORT_SKILL_IDS.has(skillId)
    ? [
        "repair",
        "revive-armor",
        "repair-charges",
        "stim",
        "ammo",
        "health",
        "shield-health",
        "duration",
        "haste",
        "range",
        "radius",
      ]
    : [
        "extra-ammo",
        "sniper-ammo",
        "mortar-ammo",
        "ammo",
        "cluster",
        "stinger-charges",
        "bombs",
        "extra-target",
        "extra",
        "damage",
        "burn",
        "health",
        "duration",
        "haste",
        "radius",
      ];
  for (const key of prefer) {
    const hit = usable.find((option) => option.id === key || option.id.endsWith(`-${key}`));
    if (hit) return hit.id;
  }
  return usable[0]?.id ?? "none";
}

/** Default attachment picks for planning (max-roll, no spec uniques). */
export function defaultSkillMods(skillId: string, spec?: string | null): string[] {
  return skillModSlotsFor(skillId, spec).map((slot) => preferredDefault(skillId, slot));
}

function isLegacyStatMods(mods: unknown): boolean {
  return (
    Array.isArray(mods) &&
    mods.length > 0 &&
    typeof mods[0] === "object" &&
    mods[0] != null &&
    "stat" in (mods[0] as object)
  );
}

const LEGACY_ID_MAP: Record<string, string> = {
  damage: "firing-damage",
  "skill-health": "hull-health",
  duration: "battery-duration",
  haste: "targeting-haste",
  repair: "feed-repair",
  "extra-ammo": "housing-sniper-ammo",
  "extra-payload": "pneumatics-ammo",
  radius: "pneumatics-radius",
  status: "agitator-burn",
};

/** Sanitize selected mod ids; migrates legacy StatBonus[] and old generic ids. */
export function sanitizeSkillMods(
  skillId: string,
  mods: unknown,
  spec?: string | null,
): string[] {
  const defined = skillModSlotsFor(skillId, spec);
  if (!defined.length) return [];
  if (isLegacyStatMods(mods)) return defaultSkillMods(skillId, spec);
  const selected = Array.isArray(mods)
    ? mods.filter((entry): entry is string => typeof entry === "string")
    : [];
  return defined.map((slot, index) => {
    const raw = selected[index];
    const candidate = raw && LEGACY_ID_MAP[raw] ? LEGACY_ID_MAP[raw] : raw;
    if (candidate && slot.options.some((option) => option.id === candidate)) {
      return candidate;
    }
    if (candidate) {
      const match = slot.options.find((option) => option.id === candidate);
      if (match) return match.id;
    }
    return preferredDefault(skillId, slot);
  });
}

/**
 * Skill attachments never raise character-wide Skill Damage / Haste / Health.
 * They are collected as this-skill-only bonuses for Analysis.
 */
export function skillModLocalBreakdown(
  skillId: string,
  mods: string[] | undefined,
  spec?: string | null,
): { bonuses: StatBonus[]; extras: string[] } {
  const defined = skillModSlotsFor(skillId, spec);
  const selected = sanitizeSkillMods(skillId, mods, spec);
  const bonuses: StatBonus[] = [];
  const extras: string[] = [];
  for (const [index, slot] of defined.entries()) {
    const option = slot.options.find((item) => item.id === selected[index]);
    if (!option || option.id === "none") continue;
    const parsed = parseSkillModEffect(option.effect);
    if (parsed.bonus) bonuses.push(parsed.bonus);
    if (parsed.extra) extras.push(`${slot.label}: ${option.name} ${parsed.extra}`);
  }
  return { bonuses, extras };
}

function parseSkillModEffect(effect: string): { bonus?: StatBonus; extra?: string } {
  const pct = effect.match(/\+([\d.]+)%\s+(.+)/i);
  if (pct) {
    const value = Number(pct[1]);
    const rest = pct[2];
    const stat = skillEffectStat(rest);
    if (stat) return { bonus: { stat, value } };
    return { extra: effect };
  }
  return { extra: effect };
}

function skillEffectStat(rest: string): StatBonus["stat"] | null {
  const text = rest.toLowerCase();
  if (text.includes("skill haste")) return "skillHaste";
  if (text.includes("skill health")) return "skillHealth";
  if (text.includes("stim efficiency") || text.includes("efficiency")) return "skillEfficiency";
  if (text.includes("repair")) return "skillRepair";
  if (text.includes("duration")) return "skillDuration";
  if (text.includes("weapon handling")) return "weaponHandling";
  if (text.includes("explosive resistance")) return "explosiveResistance";
  if (text.includes("pulse resistance")) return "pulseResistance";
  if (text.includes("out of cover") || text.includes("bonus armor")) return null;
  if (text.includes("deflect")) return null;
  if (text.includes("damage bonus")) return "weaponDamage";
  if (text.includes("burn") || text.startsWith("damage") || text.includes("damage (")) {
    return "skillDamage";
  }
  return null;
}

/** Kept so older call sites compile. Character-wide contribution is always empty. */
export function skillModAssumedBonuses(
  _skillId: string,
  _mods: string[] | undefined,
): StatBonus[] {
  return [];
}

export function formatSkillModSummary(
  skillId: string,
  mods: string[] | undefined,
  spec?: string | null,
): string {
  const defined = skillModSlotsFor(skillId, spec);
  const selected = sanitizeSkillMods(skillId, mods, spec);
  return defined
    .map((slot, index) => {
      const option = slot.options.find((item) => item.id === selected[index]);
      if (!option || option.id === "none") return null;
      return `${slot.label}: ${option.name} ${option.effect}`;
    })
    .filter(Boolean)
    .join(" · ");
}
