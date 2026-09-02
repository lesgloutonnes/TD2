import type { EquippedSkill, Loadout, WeaponSlot } from "./types";
import { emptyLoadout } from "./calc";
import { clampExpertise, resolveActiveWeaponSlot } from "./builder-model";
import { createPiece } from "./piece";
import { canBePrototype, canWeaponBePrototype, sanitizeShdWatchParts, SLOTS, storedCoreValue } from "./data/attributes";
import { BRANDS } from "./data/brands";
import { GEAR_SETS } from "./data/gear-sets";
import { WEAPONS } from "./data/weapons";
import { sanitizeWeaponMods } from "./data/weapon-mods";
import { defaultSkillMods, sanitizeSkillMods } from "./data/skill-mods";
import {
  defaultWeaponTalentId,
  weaponTalentById,
  weaponTalentByName,
} from "./data/weapon-talents";
import { SKILLS, sanitizeSpecPerks } from "./data/skills";
import { catalogById } from "./data/catalog";
import { augmentById, clampAugmentLevel, defaultAugmentId } from "./data/augments";
import { sanitizeSeason } from "./data/season-modifiers";

function withSkill(skillId: string, spec?: string | null, expertise = 0): EquippedSkill {
  return { skillId, mods: defaultSkillMods(skillId, spec), expertise };
}

/** Accept legacy string skill ids and current EquippedSkill objects. */
function normalizeSkills(
  raw: Loadout["skills"] | Array<string | EquippedSkill | null> | undefined | null,
  spec?: string | null,
): [EquippedSkill | null, EquippedSkill | null] {
  const slots: [EquippedSkill | null, EquippedSkill | null] = [null, null];
  if (!Array.isArray(raw)) return slots;
  for (let i = 0; i < 2; i += 1) {
    const entry = raw[i];
    if (!entry) continue;
    if (typeof entry === "string") {
      if (!SKILLS.some((skill) => skill.id === entry)) continue;
      slots[i] = withSkill(entry, spec);
      continue;
    }
    if (typeof entry === "object" && "skillId" in entry && entry.skillId) {
      if (!SKILLS.some((skill) => skill.id === entry.skillId)) continue;
      slots[i] = {
        skillId: entry.skillId,
        mods: sanitizeSkillMods(entry.skillId, entry.mods, spec),
        expertise: clampExpertise(entry.expertise),
      };
    }
  }
  return slots;
}

export function encodeLoadout(loadout: Loadout): string {
  const json = JSON.stringify(loadout);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeLoadout(payload: string): Loadout | null {
  if (!payload) return null;
  try {
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const binary = atob(padded + pad);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as Loadout & { expertise?: number };
    if (!parsed?.gear || !parsed?.weapons) return null;
    return normalizeLoadout(parsed);
  } catch {
    return null;
  }
}

/** Migrate legacy global expertise and sanitize weapon slots. */
export function normalizeLoadout(parsed: Loadout & { expertise?: number }): Loadout {
  const legacyExpertise =
    typeof parsed.expertise === "number"
      ? clampExpertise(parsed.expertise)
      : undefined;

  const base = emptyLoadout(parsed.name || "New build");
  const gear = { ...base.gear };
  for (const slot of SLOTS) {
    const piece = parsed.gear?.[slot] ?? null;
    if (!piece) {
      gear[slot] = null;
      continue;
    }
    const created = createPiece(slot, piece.sourceId, piece.core);
    const source = catalogById(piece.sourceId);
    const prototype =
      Boolean(piece.prototype) && canBePrototype(source?.kind);
    const core = created.core;
    const augmentId =
      prototype && augmentById(piece.augmentId) ? piece.augmentId : prototype ? defaultAugmentId() : undefined;
    gear[slot] = {
      ...created,
      ...piece,
      expertise: clampExpertise(
        typeof piece.expertise === "number" ? piece.expertise : (legacyExpertise ?? 0),
      ),
      prototype,
      augmentId,
      augmentLevel: prototype ? clampAugmentLevel(piece.augmentLevel) : undefined,
      coreValue: storedCoreValue(
        piece.core ?? core,
        typeof piece.coreValue === "number" ? piece.coreValue : undefined,
        prototype,
      ),
    };
  }

  const weapons = { ...base.weapons };
  for (const slot of ["primary", "secondary", "sidearm"] as WeaponSlot[]) {
    const equipped = parsed.weapons?.[slot] ?? null;
    if (!equipped?.weaponId) {
      weapons[slot] = null;
      continue;
    }
    const def = WEAPONS.find((weapon) => weapon.id === equipped.weaponId);
    if (!def) {
      weapons[slot] = null;
      continue;
    }
    // Pistols only belong in sidearm.
    if (slot !== "sidearm" && def.type === "pistol") {
      weapons[slot] = null;
      continue;
    }
    if (slot === "sidearm" && def.type !== "pistol") {
      weapons[slot] = null;
      continue;
    }
    const prototype =
      Boolean(equipped.prototype) && canWeaponBePrototype(def.quality);
    const augmentId =
      prototype && augmentById(equipped.augmentId)
        ? equipped.augmentId
        : prototype
          ? defaultAugmentId()
          : undefined;
    const talentId =
      def.quality === "high-end"
        ? (weaponTalentById(equipped.talentId)?.id ??
          weaponTalentByName(def.talent)?.id ??
          defaultWeaponTalentId(def.type))
        : undefined;
    weapons[slot] = {
      weaponId: equipped.weaponId,
      expertise: clampExpertise(
        typeof equipped.expertise === "number" ? equipped.expertise : (legacyExpertise ?? 0),
      ),
      mods: sanitizeWeaponMods(def.type, equipped.mods),
      prototype,
      augmentId,
      augmentLevel: prototype ? clampAugmentLevel(equipped.augmentLevel) : undefined,
      talentId,
    };
  }

  const shdWatchParts = sanitizeShdWatchParts(parsed.shdWatchParts);

  return {
    name: parsed.name || base.name,
    gear,
    weapons,
    skills: normalizeSkills(parsed.skills, parsed.specialization ?? null),
    specialization: parsed.specialization ?? null,
    specPerks: sanitizeSpecPerks(parsed.specPerks),
    shdWatch: parsed.shdWatch ?? true,
    shdWatchParts,
    includeAssumed: parsed.includeAssumed === true,
    activeWeapon: resolveActiveWeaponSlot(parsed.activeWeapon),
    season: sanitizeSeason(parsed.season),
  };
}

const STORAGE_KEY = "td2-builds";
const SAVED_EVENT = "td2-saved";

export type SavedBuildListItem = {
  id: string;
  name: string;
  savedAt: number;
  blurb: string;
};

let savedCacheRaw = "";
let savedCache: SavedBuildListItem[] = [];

/** Short kit line for library cards (sets, brands, named/exotics — no Ninja +1). */
export function loadoutBlurb(loadout: Loadout): string {
  const setCounts = new Map<string, number>();
  const brandCounts = new Map<string, number>();
  const named: string[] = [];

  for (const slot of SLOTS) {
    const piece = loadout.gear[slot];
    if (!piece) continue;
    const source = catalogById(piece.sourceId);
    if (!source) continue;
    if (source.gearSetId) {
      setCounts.set(source.gearSetId, (setCounts.get(source.gearSetId) ?? 0) + 1);
      continue;
    }
    if (source.kind === "named" || source.kind === "exotic") {
      named.push(source.name);
      continue;
    }
    if (source.brandId) {
      brandCounts.set(source.brandId, (brandCounts.get(source.brandId) ?? 0) + 1);
    }
  }

  const parts: string[] = [];
  for (const [id, count] of [...setCounts.entries()].sort((a, b) => b[1] - a[1])) {
    const name = GEAR_SETS.find((item) => item.id === id)?.name ?? id;
    parts.push(count > 1 ? `${count} ${name}` : name);
  }
  for (const [id, count] of [...brandCounts.entries()].sort((a, b) => b[1] - a[1])) {
    const name = BRANDS.find((item) => item.id === id)?.name ?? id;
    parts.push(count > 1 ? `${count} ${name}` : name);
  }
  parts.push(...named);
  return parts.length ? parts.slice(0, 4).join(" · ") : "Empty loadout";
}

function notifySaved() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SAVED_EVENT));
}

export function subscribeSaved(onChange: () => void) {
  window.addEventListener(SAVED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SAVED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function listSavedBuilds(): SavedBuildListItem[] {
  if (typeof window === "undefined") return savedCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? "";
    if (raw === savedCacheRaw) return savedCache;
    savedCacheRaw = raw;
    if (!raw) {
      savedCache = [];
      return savedCache;
    }
    const parsed = JSON.parse(raw) as Record<string, Loadout & { savedAt?: number }>;
    savedCache = Object.entries(parsed)
      .map(([id, value]) => {
        const loadout = normalizeLoadout(value);
        return {
          id,
          name: value.name || loadout.name,
          savedAt: value.savedAt ?? 0,
          blurb: loadoutBlurb(loadout),
        };
      })
      .sort((a, b) => b.savedAt - a.savedAt);
    return savedCache;
  } catch {
    savedCache = [];
    return savedCache;
  }
}

export function saveBuild(loadout: Loadout, id?: string): string {
  const key = id || crypto.randomUUID();
  const raw = localStorage.getItem(STORAGE_KEY);
  const all = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  all[key] = { ...loadout, savedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  savedCacheRaw = "";
  notifySaved();
  return key;
}

export function renameBuild(id: string, name: string): boolean {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  const all = JSON.parse(raw) as Record<string, Loadout & { savedAt?: number }>;
  const item = all[id];
  if (!item) return false;
  all[id] = { ...item, name: name.trim() || item.name, savedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  savedCacheRaw = "";
  notifySaved();
  return true;
}

export function loadBuild(id: string): Loadout | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const all = JSON.parse(raw) as Record<string, Loadout & { expertise?: number }>;
  const item = all[id];
  return item ? normalizeLoadout(item) : null;
}

export function deleteBuild(id: string) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const all = JSON.parse(raw) as Record<string, unknown>;
  delete all[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  savedCacheRaw = "";
  notifySaved();
}
