import type {
  ActiveBonus,
  Loadout,
  SeasonActiveId,
  SeasonModifier,
  SeasonPassiveId,
  StatBonus,
  StatKey,
} from "../types";
import { pushBonus } from "../builder-model";

export const SEASON_NAME = "Y8S3 Red Horizon";
export const SEASON_MODIFIER_NAME = "Under Pressure";
export const SEASON_PASSIVE_SLOTS = 3;
export const SEASON_PRESSURE_DEFAULT = 90;
export const SEASON_COLOR = "#e25822";

export type SeasonActiveDef = {
  id: SeasonActiveId;
  name: string;
  secondary: string;
  description: string;
  /** Sheet stats while the active is assumed on (maxed bonuses). */
  assumed: StatBonus[];
  assumedNote: string;
};

export type SeasonPassiveCategory = "pressure" | "fire" | "formula";

export type SeasonPassiveDef = {
  id: SeasonPassiveId;
  name: string;
  category: SeasonPassiveCategory;
  description: string;
  formula?: "beta" | "gamma";
  delayedVenting?: boolean;
  allOrNothing?: boolean;
  kickstart?: boolean;
};

const DEFAULT_ACTIVE: SeasonActiveId = "fiery-aura";

/** Status Effects / Beta / Gamma payouts at the four gauge tiers (live Y8S3 tables). */
const GAUGE_STATUS = [15, 25, 40, 65] as const;
const GAUGE_BETA = [10, 20, 30, 50] as const;
const GAUGE_GAMMA = [5, 15, 25, 40] as const;

export const SEASON_ACTIVES: SeasonActiveDef[] = [
  {
    id: "fiery-aura",
    name: "Fiery Aura",
    secondary: "Armor Regen",
    description:
      "Damage Resistance and Armor Regen while active. Nearby enemies burn the first time they enter range. Level 5: Bonus Armor per unique enemy burned.",
    assumed: [{ stat: "armorRegenPercent", value: 1.5 }],
    assumedNote:
      "Assumes Level 5 active up: 1.5%/s Armor Regen. Combat-only: +65% Damage Resistance (100% while sprinting), 10 m Burn. Not a DPS sim.",
  },
  {
    id: "vicarious-combustion",
    name: "Vicarious Combustion",
    secondary: "Headshot Damage",
    description:
      "Headshots on burning enemies spread Burn. Level 5: headshots apply Burn directly.",
    assumed: [{ stat: "hsd", value: 50 }],
    assumedNote:
      "Assumes Level 5 active up: +50% Headshot Damage. Combat-only: 20 m Burn spread. Burn damage is reduced while it runs.",
  },
  {
    id: "signed-shield-delivered",
    name: "Signed, Shield, Delivered",
    secondary: "Skill Efficiency",
    description:
      "Signature Weapon and Shield bonuses. Kills with a Signature Weapon, or while a shield is up, refill the magazine.",
    assumed: [
      { stat: "skillEfficiency", value: 25 },
      { stat: "shieldHealth", value: 500 },
      { stat: "signatureWeaponDamage", value: 50 },
    ],
    assumedNote:
      "Assumes Level 5 active up: +25% Skill Efficiency, +500% Shield Health, +50% Signature Weapon Damage. Combat-only: mag refill, +25% Signature range, duration extend on kills.",
  },
];

export const SEASON_PASSIVES: SeasonPassiveDef[] = [
  {
    id: "flow-regulator",
    name: "Flow Regulator",
    category: "pressure",
    description: "Earn +10% Pressure Gauge per action.",
  },
  {
    id: "throttle-valve",
    name: "Throttle Valve",
    category: "pressure",
    description: "Earn +25% Pressure Gauge per action, but the gauge decays 50% faster.",
  },
  {
    id: "flux-stabilizer",
    name: "Flux Stabilizer",
    category: "pressure",
    description: "Pressure Gauge decay is 25% slower.",
  },
  {
    id: "pressure-control",
    name: "Pressure Control",
    category: "pressure",
    description: "Pressure Gauge decay is 50% slower, but gain is reduced by 20% per action.",
  },
  {
    id: "quality-seals",
    name: "Quality Seals",
    category: "pressure",
    description: "Pressure Gauge decay begins after a longer delay.",
  },
  {
    id: "delayed-venting",
    name: "Delayed Venting",
    category: "pressure",
    description:
      "Bonuses apply at 0%, 20%, 50%, and 80%. Active Modifiers unlock at a 10% lower threshold.",
    delayedVenting: true,
  },
  {
    id: "leaky-valve",
    name: "Leaky Valve",
    category: "pressure",
    description:
      "Cover no longer stops decay. Gains +50% from all actions. Actives require 95% Pressure. Decay pauses out of combat.",
  },
  {
    id: "vacuum-seal",
    name: "Vacuum Seal",
    category: "pressure",
    description: "The Pressure Gauge no longer decays, but gains are reduced by 50%.",
  },
  {
    id: "reserve-tank",
    name: "Reserve Tank",
    category: "pressure",
    description: "After an Active Modifier, the Pressure Gauge resets to 20% instead of 0%.",
  },
  {
    id: "all-or-nothing",
    name: "All or Nothing",
    category: "pressure",
    description:
      "Gauge bonuses below 80% are 0. Bonuses at 80%+ increase by 25%. Disabled if paired with Kickstart.",
    allOrNothing: true,
  },
  {
    id: "kickstart",
    name: "Kickstart",
    category: "pressure",
    description:
      "Gauge bonuses above 80% are 0. Bonuses below 80% increase by 50%. Disabled if paired with All or Nothing.",
    kickstart: true,
  },
  {
    id: "microwave-coils",
    name: "Microwave Coils",
    category: "fire",
    description:
      "Up to four Pulsed enemies have a 30% chance to Burn. Gain 3% Pressure per affected enemy.",
  },
  {
    id: "new-model",
    name: "New Model",
    category: "fire",
    description:
      "K8 Jetstream: +30% Damage to Named, −15% total Damage, −50% Spread, +100% Range, +25% Equip Speed. Specialization ammo pickups doubled.",
  },
  {
    id: "afterburner",
    name: "Afterburner",
    category: "fire",
    description: "Killing a burning enemy grants +20% Movement Speed for 30 seconds.",
  },
  {
    id: "flint-and-steel",
    name: "Flint and Steel",
    category: "fire",
    description:
      "Shooting an enemy while a skill is also damaging them sets them on fire. Cooldown: 15 seconds.",
  },
  {
    id: "fire-with-fire",
    name: "Fire with Fire",
    category: "fire",
    description:
      "While in combat, being affected by Burn increases your Burn Damage by 50% for 30 seconds.",
  },
  {
    id: "firestarter",
    name: "Firestarter",
    category: "fire",
    description:
      "Concussion, Flashbang, and Cluster grenades gain +100% range and apply a short Burn.",
  },
  {
    id: "new-formula-beta",
    name: "New Formula: Beta",
    category: "formula",
    description:
      "Primary gauge bonus becomes Signature Weapon Damage (10 / 20 / 30 / 50%). Disabled if paired with Gamma.",
    formula: "beta",
  },
  {
    id: "new-formula-gamma",
    name: "New Formula: Gamma",
    category: "formula",
    description:
      "Primary gauge bonus becomes Hazard Protection (5 / 15 / 25 / 40%). Disabled if paired with Beta.",
    formula: "gamma",
  },
  {
    id: "modular-plates",
    name: "Modular Plates",
    category: "formula",
    description:
      "Armor Kits: +100% Bonus Armor and restore 100% shield health. Insta Kits: +25% Bonus Armor and 50% shield health.",
  },
];

export const SEASON_PASSIVE_GROUPS: { id: SeasonPassiveCategory; label: string }[] = [
  { id: "pressure", label: "Pressure Gauge" },
  { id: "fire", label: "Fire & Status" },
  { id: "formula", label: "Bonus swap" },
];

const ACTIVE_BY_ID = new Map(SEASON_ACTIVES.map((item) => [item.id, item]));
const PASSIVE_BY_ID = new Map(SEASON_PASSIVES.map((item) => [item.id, item]));

export function seasonActiveById(id: string | null | undefined): SeasonActiveDef | undefined {
  if (!id) return undefined;
  return ACTIVE_BY_ID.get(id as SeasonActiveId);
}

export function seasonPassiveById(id: string | null | undefined): SeasonPassiveDef | undefined {
  if (!id) return undefined;
  return PASSIVE_BY_ID.get(id as SeasonPassiveId);
}

export function defaultSeason(): SeasonModifier {
  return {
    enabled: false,
    activeId: DEFAULT_ACTIVE,
    passives: [null, null, null],
    pressure: SEASON_PRESSURE_DEFAULT,
  };
}

export function clampSeasonPressure(value: number | undefined): number {
  if (!Number.isFinite(value)) return SEASON_PRESSURE_DEFAULT;
  return Math.max(0, Math.min(100, Math.round(value!)));
}

function uniquePassives(
  raw: Array<SeasonPassiveId | null | undefined> | undefined,
): SeasonModifier["passives"] {
  const seen = new Set<SeasonPassiveId>();
  const slots: SeasonModifier["passives"] = [null, null, null];
  if (!Array.isArray(raw)) return slots;
  for (let i = 0; i < SEASON_PASSIVE_SLOTS; i += 1) {
    const id = raw[i];
    const def = seasonPassiveById(id);
    if (!def || seen.has(def.id)) continue;
    seen.add(def.id);
    slots[i] = def.id;
  }
  return slots;
}

export function sanitizeSeason(raw: Partial<SeasonModifier> | null | undefined): SeasonModifier {
  const base = defaultSeason();
  if (!raw || typeof raw !== "object") return base;
  return {
    enabled: Boolean(raw.enabled),
    activeId: seasonActiveById(raw.activeId)?.id ?? DEFAULT_ACTIVE,
    passives: uniquePassives(raw.passives),
    pressure: clampSeasonPressure(raw.pressure),
  };
}

export function seasonFromLoadout(loadout: Loadout): SeasonModifier {
  return sanitizeSeason(loadout.season);
}

export type SeasonGaugePreview = {
  stat: StatKey;
  value: number;
  tier: number;
  formulaCancelled: boolean;
  bracketCancelled: boolean;
  label: string;
};

/** −1 = no payout, 0–3 = the four live tiers. */
export function seasonGaugeTier(pressure: number, delayedVenting: boolean): number {
  const p = clampSeasonPressure(pressure);
  if (delayedVenting) {
    if (p >= 80) return 3;
    if (p >= 50) return 2;
    if (p >= 20) return 1;
    return 0;
  }
  if (p >= 90) return 3;
  if (p >= 65) return 2;
  if (p >= 35) return 1;
  if (p >= 10) return 0;
  return -1;
}

export function equippedSeasonPassives(season: SeasonModifier): SeasonPassiveDef[] {
  return season.passives
    .map((id) => seasonPassiveById(id))
    .filter((item): item is SeasonPassiveDef => Boolean(item));
}

export function seasonGaugePreview(season: SeasonModifier): SeasonGaugePreview {
  const passives = equippedSeasonPassives(season);
  const hasBeta = passives.some((item) => item.formula === "beta");
  const hasGamma = passives.some((item) => item.formula === "gamma");
  const formulaCancelled = hasBeta && hasGamma;
  const hasAoN = passives.some((item) => item.allOrNothing);
  const hasKick = passives.some((item) => item.kickstart);
  const bracketCancelled = hasAoN && hasKick;
  const delayed = passives.some((item) => item.delayedVenting);
  const tier = seasonGaugeTier(season.pressure, delayed);

  let stat: StatKey = "statusEffects";
  let table: readonly number[] = GAUGE_STATUS;
  if (!formulaCancelled && hasBeta) {
    stat = "signatureWeaponDamage";
    table = GAUGE_BETA;
  } else if (!formulaCancelled && hasGamma) {
    stat = "hazardProtection";
    table = GAUGE_GAMMA;
  }

  let value = tier < 0 ? 0 : table[tier];
  if (!bracketCancelled && hasAoN) {
    value = season.pressure >= 80 ? Math.round(value * 1.25 * 10) / 10 : 0;
  } else if (!bracketCancelled && hasKick) {
    value = season.pressure > 80 ? 0 : Math.round(value * 1.5 * 10) / 10;
  }

  const label =
    value === 0
      ? `No gauge payout at ${season.pressure}%`
      : `+${value}% ${statLabel(stat)} at ${season.pressure}%`;

  return {
    stat,
    value,
    tier,
    formulaCancelled,
    bracketCancelled,
    label,
  };
}

function statLabel(stat: StatKey): string {
  if (stat === "statusEffects") return "Status Effects";
  if (stat === "signatureWeaponDamage") return "Signature Weapon Damage";
  if (stat === "hazardProtection") return "Hazard Protection";
  return stat;
}

export function applySeasonModifiers(
  loadout: Loadout,
  values: Record<StatKey, number>,
  bonuses: ActiveBonus[],
  notes: string[],
  includeAssumed: boolean,
): void {
  const season = seasonFromLoadout(loadout);
  if (!season.enabled) return;

  const active = seasonActiveById(season.activeId) ?? SEASON_ACTIVES[0];
  const passives = equippedSeasonPassives(season);
  const gauge = seasonGaugePreview(season);

  notes.push(
    `${SEASON_MODIFIER_NAME} on (${SEASON_NAME}). Assumed Pressure ${season.pressure}%. Not a combat sim.`,
  );

  if (gauge.formulaCancelled) {
    notes.push("New Formula Beta + Gamma cancel each other — gauge stays Status Effects.");
  }
  if (gauge.bracketCancelled) {
    notes.push("All or Nothing + Kickstart cancel each other — default gauge brackets apply.");
  }

  if (gauge.value > 0) {
    const bonus: StatBonus[] = [{ stat: gauge.stat, value: gauge.value }];
    addToValues(values, bonus);
    pushBonus(bonuses, {
      source: `${SEASON_MODIFIER_NAME} · Gauge`,
      label: formatSeasonBonuses(bonus),
      detail: `${gauge.label}. Default payout is Status Effects; Beta / Gamma can swap it.`,
      pieces: 1,
      required: 1,
      active: true,
      color: SEASON_COLOR,
    });
  } else {
    notes.push(gauge.label + ".");
  }

  for (const passive of passives) {
    notes.push(`${passive.name}: ${passive.description}`);
  }

  if (includeAssumed) {
    addToValues(values, active.assumed);
    pushBonus(bonuses, {
      source: `${SEASON_MODIFIER_NAME} · ${active.name}`,
      label: formatSeasonBonuses(active.assumed),
      detail: active.assumedNote,
      pieces: 1,
      required: 1,
      active: true,
      color: SEASON_COLOR,
    });
    notes.push(`${active.name} (maxed bonuses): ${active.assumedNote}`);
  } else {
    notes.push(
      `${active.name} selected — burst stats are off while maxed bonuses are off.`,
    );
  }
}

function addToValues(values: Record<StatKey, number>, bonuses: StatBonus[]) {
  for (const bonus of bonuses) {
    values[bonus.stat] += bonus.value;
  }
}

function formatSeasonBonuses(bonuses: StatBonus[]): string {
  return bonuses
    .map((bonus) => {
      const pretty = Number.isInteger(bonus.value) ? String(bonus.value) : bonus.value.toFixed(1);
      if (bonus.stat === "armorRegenPercent") return `+${pretty}% Armor Regeneration`;
      return `+${pretty}% ${statLabel(bonus.stat)}`;
    })
    .join(", ");
}
