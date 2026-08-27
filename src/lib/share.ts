import type { EquippedSkill, EquippedWeapon, Loadout, WeaponSlot } from "./types";
import { emptyLoadout } from "./calc";
import { createPiece } from "./piece";
import { EXPERTISE_MAX, canBePrototype, canWeaponBePrototype, SLOTS } from "./data/attributes";
import { WEAPONS } from "./data/weapons";
import { defaultWeaponMods, sanitizeWeaponMods } from "./data/weapon-mods";
import { defaultSkillMods, sanitizeSkillMods } from "./data/skill-mods";
import { SKILLS } from "./data/skills";
import { catalogById } from "./data/catalog";
import { augmentById, clampAugmentLevel, defaultAugmentId } from "./data/augments";

function withWeapon(weaponId: string, expertise: number): EquippedWeapon {
  const def = WEAPONS.find((weapon) => weapon.id === weaponId);
  return {
    weaponId,
    expertise,
    mods: def ? defaultWeaponMods(def.type) : [],
  };
}

function withSkill(skillId: string): EquippedSkill {
  return { skillId, mods: defaultSkillMods() };
}

/** Accept legacy string skill ids and current EquippedSkill objects. */
function normalizeSkills(
  raw: Loadout["skills"] | Array<string | EquippedSkill | null> | undefined | null,
): [EquippedSkill | null, EquippedSkill | null] {
  const slots: [EquippedSkill | null, EquippedSkill | null] = [null, null];
  if (!Array.isArray(raw)) return slots;
  for (let i = 0; i < 2; i += 1) {
    const entry = raw[i];
    if (!entry) continue;
    if (typeof entry === "string") {
      if (!SKILLS.some((skill) => skill.id === entry)) continue;
      slots[i] = withSkill(entry);
      continue;
    }
    if (typeof entry === "object" && "skillId" in entry && entry.skillId) {
      if (!SKILLS.some((skill) => skill.id === entry.skillId)) continue;
      slots[i] = {
        skillId: entry.skillId,
        mods: sanitizeSkillMods(entry.mods),
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
    weapons[slot] = {
      weaponId: equipped.weaponId,
      expertise: clampExpertise(
        typeof equipped.expertise === "number" ? equipped.expertise : (legacyExpertise ?? 0),
      ),
      mods: sanitizeWeaponMods(def.type, equipped.mods),
      prototype,
      augmentId,
      augmentLevel: prototype ? clampAugmentLevel(equipped.augmentLevel) : undefined,
    };
  }

  return {
    name: parsed.name || base.name,
    gear,
    weapons,
    skills: normalizeSkills(parsed.skills),
    specialization: parsed.specialization ?? null,
    shdWatch: parsed.shdWatch ?? true,
  };
}

function clampExpertise(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(EXPERTISE_MAX, Math.round(value)));
}

const STORAGE_KEY = "td2-builds";
const SAVED_EVENT = "td2-saved";

let savedCacheRaw = "";
let savedCache: { id: string; name: string; savedAt: number }[] = [];

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

export function listSavedBuilds(): { id: string; name: string; savedAt: number }[] {
  if (typeof window === "undefined") return savedCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? "";
    if (raw === savedCacheRaw) return savedCache;
    savedCacheRaw = raw;
    if (!raw) {
      savedCache = [];
      return savedCache;
    }
    const parsed = JSON.parse(raw) as Record<string, { name: string; savedAt: number }>;
    savedCache = Object.entries(parsed)
      .map(([id, value]) => ({ id, name: value.name, savedAt: value.savedAt }))
      .sort((a, b) => b.savedAt - a.savedAt);
    return savedCache;
  } catch {
    savedCache = [];
    return savedCache;
  }
}

export function saveBuild(loadout: Loadout): string {
  const id = crypto.randomUUID();
  const raw = localStorage.getItem(STORAGE_KEY);
  const all = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  all[id] = { ...loadout, savedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  savedCacheRaw = "";
  notifySaved();
  return id;
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


function applyLibraryExpertise(loadout: Loadout, level = 12): Loadout {
  const expertise = clampExpertise(level);
  for (const slot of SLOTS) {
    const piece = loadout.gear[slot];
    if (piece) piece.expertise = expertise;
  }
  for (const slot of ["primary", "secondary", "sidearm"] as WeaponSlot[]) {
    const weapon = loadout.weapons[slot];
    if (weapon) weapon.expertise = expertise;
  }
  return loadout;
}

export const PRESETS: { id: string; name: string; blurb: string; build: () => Loadout }[] = [
  {
    id: "striker",
    name: "Striker",
    blurb: "4 Striker + Česká + Grupo. Meta AR / LMG.",
    build: () => {
      const loadout = emptyLoadout("Striker");
      loadout.gear.mask = createPiece("mask", "set:striker");
      loadout.gear.backpack = createPiece("backpack", "set:striker");
      loadout.gear.chest = createPiece("chest", "set:striker");
      loadout.gear.gloves = createPiece("gloves", "set:striker");
      loadout.gear.holster = createPiece("holster", "brand:ceska");
      loadout.gear.kneepads = createPiece("kneepads", "brand:grupo");
      loadout.weapons.primary = withWeapon("st-elmo", 12);
      loadout.weapons.secondary = withWeapon("lexington", 12);
      loadout.weapons.sidearm = withWeapon("liberty", 12);
      loadout.skills = [withSkill("reviver-hive"), withSkill("crusader-shield")];
      loadout.specialization = "gunner";
      return applyLibraryExpertise(loadout);
    },
  },
  {
    id: "all-red",
    name: "All Red Glass Cannon",
    blurb: "The Gift + The Sacrifice + Coyote + Fox + Contractor.",
    build: () => {
      const loadout = emptyLoadout("All Red Glass Cannon");
      loadout.gear.mask = createPiece("mask", "coyotes-mask");
      loadout.gear.backpack = createPiece("backpack", "the-gift");
      loadout.gear.chest = createPiece("chest", "the-sacrifice");
      loadout.gear.gloves = createPiece("gloves", "contractors-gloves");
      loadout.gear.holster = createPiece("holster", "brand:grupo");
      loadout.gear.kneepads = createPiece("kneepads", "foxs-prayer");
      loadout.weapons.primary = withWeapon("lexington", 12);
      loadout.weapons.secondary = withWeapon("famas", 12);
      loadout.weapons.sidearm = withWeapon("d50", 12);
      loadout.skills = [withSkill("reviver-hive"), withSkill("striker-drone")];
      loadout.specialization = "gunner";
      return applyLibraryExpertise(loadout);
    },
  },
  {
    id: "heartbreaker",
    name: "Heartbreaker AR",
    blurb: "4 Heartbreaker Blue, Crusader Shield, St. Elmo.",
    build: () => {
      const loadout = emptyLoadout("Heartbreaker AR");
      loadout.gear.mask = createPiece("mask", "set:heartbreaker");
      loadout.gear.backpack = createPiece("backpack", "set:heartbreaker");
      loadout.gear.chest = createPiece("chest", "set:heartbreaker");
      loadout.gear.gloves = createPiece("gloves", "set:heartbreaker");
      loadout.gear.holster = createPiece("holster", "brand:ceska", "red");
      loadout.gear.kneepads = createPiece("kneepads", "foxs-prayer");
      loadout.weapons.primary = withWeapon("st-elmo", 12);
      loadout.weapons.secondary = withWeapon("carbine-7", 12);
      loadout.weapons.sidearm = withWeapon("liberty", 12);
      loadout.skills = [withSkill("crusader-shield"), withSkill("reviver-hive")];
      loadout.specialization = "gunner";
      return applyLibraryExpertise(loadout);
    },
  },
  {
    id: "skill",
    name: "Skill build",
    blurb: "Empress / Wyvern / Hana-U + Capacitor. Technician.",
    build: () => {
      const loadout = emptyLoadout("Skill build");
      loadout.gear.mask = createPiece("mask", "brand:empress", "yellow");
      loadout.gear.backpack = createPiece("backpack", "brand:wyvern", "yellow");
      loadout.gear.chest = createPiece("chest", "brand:hana-u", "yellow");
      loadout.gear.gloves = createPiece("gloves", "brand:empress", "yellow");
      loadout.gear.holster = createPiece("holster", "waveform");
      loadout.gear.kneepads = createPiece("kneepads", "brand:wyvern", "yellow");
      if (loadout.gear.backpack) loadout.gear.backpack.talentId = "tech-support";
      if (loadout.gear.chest) loadout.gear.chest.talentId = "kinetic-momentum";
      loadout.weapons.primary = withWeapon("capacitor", 12);
      loadout.weapons.secondary = withWeapon("lexington", 12);
      loadout.weapons.sidearm = withWeapon("d50", 12);
      loadout.skills = [withSkill("artillery-turret"), withSkill("striker-drone")];
      loadout.specialization = "technician";
      return applyLibraryExpertise(loadout);
    },
  },
  {
    id: "foundry",
    name: "Tank Foundry",
    blurb: "4 Foundry Bulwark, Bulwark Shield, Firewall.",
    build: () => {
      const loadout = emptyLoadout("Tank Foundry");
      loadout.gear.mask = createPiece("mask", "set:foundry");
      loadout.gear.backpack = createPiece("backpack", "set:foundry");
      loadout.gear.chest = createPiece("chest", "set:foundry");
      loadout.gear.gloves = createPiece("gloves", "set:foundry");
      loadout.gear.holster = createPiece("holster", "brand:gila", "blue");
      loadout.gear.kneepads = createPiece("kneepads", "brand:belstone", "blue");
      loadout.weapons.primary = withWeapon("acs-12", 12);
      loadout.weapons.secondary = withWeapon("scorpio", 12);
      loadout.weapons.sidearm = withWeapon("liberty", 12);
      loadout.skills = [withSkill("bulwark-shield"), withSkill("decoy")];
      loadout.specialization = "firewall";
      return applyLibraryExpertise(loadout);
    },
  },
  {
    id: "hunters",
    name: "Hunter's Fury",
    blurb: "CQC SMG / shotgun. Dark Winter + Chatterbox.",
    build: () => {
      const loadout = emptyLoadout("Hunter's Fury");
      loadout.gear.mask = createPiece("mask", "set:hunters-fury");
      loadout.gear.backpack = createPiece("backpack", "set:hunters-fury");
      loadout.gear.chest = createPiece("chest", "set:hunters-fury");
      loadout.gear.gloves = createPiece("gloves", "set:hunters-fury");
      loadout.gear.holster = createPiece("holster", "brand:sokolov");
      loadout.gear.kneepads = createPiece("kneepads", "brand:ceska");
      loadout.weapons.primary = withWeapon("dark-winter", 12);
      loadout.weapons.secondary = withWeapon("chatterbox", 12);
      loadout.weapons.sidearm = withWeapon("d50", 12);
      loadout.skills = [withSkill("reviver-hive"), withSkill("blinder-firefly")];
      loadout.specialization = "firewall";
      return applyLibraryExpertise(loadout);
    },
  },
];
