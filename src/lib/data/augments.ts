import type { StatKey } from "../types";

export const AUGMENT_LEVEL_MIN = 1;
export const AUGMENT_LEVEL_MAX = 10;

export type AugmentDef = {
  id: string;
  name: string;
  /** Short in-game style description. */
  description: string;
  /** What the stacked % represents in the analyzer. */
  effectLabel: string;
  /**
   * Value at a given level (1–10).
   * Quantum / Amalgam / Anomaly / Synesthesia: Ubisoft Y8S1.3 published values.
   * Echo: unchanged in Y8S1.3 (community L1/L10).
   * Others: community approximations marked below.
   */
  valueAtLevel: (level: number) => number;
  /** Soft mapping into build stats when a numeric proxy helps. */
  statHint?: StatKey;
  /** Provenance for the numeric curve. */
  valueSource: "ubisoft-y8s1.3" | "community";
};

function linear(level1: number, perLevel: number, level: number): number {
  const clamped = Math.max(AUGMENT_LEVEL_MIN, Math.min(AUGMENT_LEVEL_MAX, Math.round(level)));
  return Math.round((level1 + perLevel * (clamped - 1)) * 10) / 10;
}

/**
 * Prototype Augments (Y8).
 * Published L1 → L10 (Ubisoft Y8S1.3 notes via community tables):
 *   Quantum 1% +0.4 → 4.6% | Amalgam 1.6% +0.3 → 4.3%
 *   Anomaly 4% +0.5 → 8.5% | Synesthesia 5% +1 → 14%
 * Echo was explicitly left unchanged in that patch (still ~1% +0.2 → 2.8%).
 * Y8S3 Red Horizon (TU 2.34) did not publish new Prototype Augment curves.
 */
export const AUGMENTS: AugmentDef[] = [
  {
    id: "quantum",
    name: "Quantum",
    description:
      "Chance to become temporarily immune to damage for 2 seconds when triggered.",
    effectLabel: "immunity chance",
    // Ubisoft Y8S1.3: 1% +0.4%/level → 4.6% (not Amalgam’s 1.6→4.3).
    valueAtLevel: (level) => linear(1, 0.4, level),
    valueSource: "ubisoft-y8s1.3",
  },
  {
    id: "echo",
    name: "Echo",
    description: "Each bullet fired has a chance to deal its damage a second time.",
    effectLabel: "double-hit chance",
    // Unchanged in Y8S1.3 when Quantum/etc. were buffed.
    valueAtLevel: (level) => linear(1, 0.2, level),
    valueSource: "community",
  },
  {
    id: "atomize",
    name: "Atomize",
    description: "Increases grenade radius and damage.",
    effectLabel: "grenade power",
    valueAtLevel: (level) => linear(5, 0.5, level),
    statHint: "explosiveDamage",
    valueSource: "community",
  },
  {
    id: "amalgam",
    name: "Amalgam",
    description: "Bullet hits have a chance to apply a random status effect.",
    effectLabel: "status proc chance",
    valueAtLevel: (level) => linear(1.6, 0.3, level),
    statHint: "statusEffects",
    valueSource: "ubisoft-y8s1.3",
  },
  {
    id: "trapper",
    name: "Trapper",
    description: "Increases the duration of status effects you apply.",
    effectLabel: "status duration",
    // Same ballpark as Amalgam's published curve (status-focused).
    valueAtLevel: (level) => linear(1.6, 0.3, level),
    valueSource: "community",
  },
  {
    id: "entropy",
    name: "Entropy",
    description: "Increases your Health based on a percentage of your total Armor.",
    effectLabel: "armor → health",
    valueAtLevel: (level) => linear(2, 0.3, level),
    statHint: "health",
    valueSource: "community",
  },
  {
    id: "anomaly",
    name: "Anomaly",
    description: "Skills restore a portion of the damage they deal as healing.",
    effectLabel: "skill damage → heal",
    valueAtLevel: (level) => linear(4, 0.5, level),
    valueSource: "ubisoft-y8s1.3",
  },
  {
    id: "paradox",
    name: "Paradox",
    description: "Chance to refill part of the magazine while firing.",
    effectLabel: "mag refill chance",
    // Same pre-buff style curve as Echo (unchanged family).
    valueAtLevel: (level) => linear(1, 0.2, level),
    statHint: "magazineSize",
    valueSource: "community",
  },
  {
    id: "synesthesia",
    name: "Synesthesia",
    description: "Bullet hits have a chance to slightly reduce skill cooldowns.",
    effectLabel: "cooldown reduction proc",
    valueAtLevel: (level) => linear(5, 1, level),
    statHint: "skillHaste",
    valueSource: "ubisoft-y8s1.3",
  },
];

export function augmentById(id: string | undefined | null): AugmentDef | undefined {
  if (!id) return undefined;
  return AUGMENTS.find((item) => item.id === id);
}

export function clampAugmentLevel(level: number | undefined): number {
  if (!Number.isFinite(level)) return AUGMENT_LEVEL_MIN;
  return Math.max(AUGMENT_LEVEL_MIN, Math.min(AUGMENT_LEVEL_MAX, Math.round(level!)));
}

export function defaultAugmentId(): string {
  return "echo";
}
