import type { StatBonus, StatKey, WeaponMod, WeaponModKind, WeaponType } from "../types";

export const WEAPON_MOD_KIND_LABELS: Record<WeaponModKind, string> = {
  optic: "Optic",
  magazine: "Magazine",
  muzzle: "Muzzle",
  underbarrel: "Underbarrel",
};

/** Soft ceilings for weapon-mod rolls (higher than gear attribute caps). */
export const WEAPON_MOD_MAX: Partial<Record<StatKey, number>> = {
  chc: 10,
  chd: 20,
  hsd: 20,
  weaponHandling: 15,
  reloadSpeed: 25,
  magazineSize: 30,
  rateOfFire: 15,
  stability: 25,
  accuracy: 25,
  optimalRange: 30,
  swapSpeed: 20,
  damageToArmor: 8,
  damageToHealth: 8,
  weaponDamage: 10,
};

export const WEAPON_MOD_GROUPS: Record<
  WeaponModKind,
  { label: string; stats: StatKey[] }[]
> = {
  optic: [
    {
      label: "Optic",
      stats: ["chc", "chd", "hsd", "accuracy", "stability", "weaponHandling", "reloadSpeed"],
    },
  ],
  magazine: [
    {
      label: "Magazine",
      stats: [
        "magazineSize",
        "reloadSpeed",
        "rateOfFire",
        "chd",
        "hsd",
        "stability",
        "optimalRange",
        "weaponDamage",
      ],
    },
  ],
  muzzle: [
    {
      label: "Muzzle",
      stats: ["chd", "chc", "hsd", "accuracy", "stability", "optimalRange"],
    },
  ],
  underbarrel: [
    {
      label: "Underbarrel",
      stats: ["chc", "hsd", "accuracy", "stability", "reloadSpeed", "weaponHandling"],
    },
  ],
};

const DEFAULT_BY_KIND: Record<WeaponModKind, StatBonus> = {
  optic: { stat: "chc", value: 8 },
  magazine: { stat: "magazineSize", value: 20 },
  muzzle: { stat: "chd", value: 15 },
  underbarrel: { stat: "weaponHandling", value: 10 },
};

/** Live-ish socket layout by weapon family. */
export function weaponModLayout(type: WeaponType): WeaponModKind[] {
  if (type === "pistol") return ["optic", "muzzle"];
  return ["optic", "magazine", "muzzle", "underbarrel"];
}

export function defaultWeaponMods(type: WeaponType): WeaponMod[] {
  return weaponModLayout(type).map((kind) => ({
    kind,
    ...DEFAULT_BY_KIND[kind],
  }));
}

export function clampWeaponMod(stat: StatKey, value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  const max = WEAPON_MOD_MAX[stat];
  const capped = max == null ? value : Math.min(value, max);
  return Math.round(capped * 10) / 10;
}

export function sanitizeWeaponMods(
  type: WeaponType,
  mods: WeaponMod[] | undefined,
): WeaponMod[] {
  const layout = weaponModLayout(type);
  const byKind = new Map((mods ?? []).map((mod) => [mod.kind, mod]));
  return layout.map((kind) => {
    const existing = byKind.get(kind);
    if (!existing) return { kind, ...DEFAULT_BY_KIND[kind] };
    const allowed = new Set(WEAPON_MOD_GROUPS[kind].flatMap((group) => group.stats));
    const stat = allowed.has(existing.stat) ? existing.stat : DEFAULT_BY_KIND[kind].stat;
    return {
      kind,
      stat,
      value: clampWeaponMod(stat, existing.value),
    };
  });
}

/** Optimized talent: weapon mods are 30% more effective. */
export function weaponModMultiplier(talentName: string | undefined): number {
  return talentName === "Optimized" ? 1.3 : 1;
}
