import type { Loadout } from "./types";
import { emptyLoadout } from "./calc";
import { createPiece } from "./piece";

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
    const parsed = JSON.parse(json) as Loadout;
    if (!parsed?.gear || !parsed?.weapons) return null;
    return { ...emptyLoadout(parsed.name), ...parsed };
  } catch {
    return null;
  }
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
  const all = JSON.parse(raw) as Record<string, Loadout>;
  return all[id] ?? null;
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

export const PRESETS: { id: string; name: string; blurb: string; build: () => Loadout }[] = [
  {
    id: "striker",
    name: "Striker DPS",
    blurb: "4 Striker + Česká + Grupo. Meta AR / LMG.",
    build: () => {
      const loadout = emptyLoadout("Striker DPS");
      loadout.gear.mask = createPiece("mask", "set:striker");
      loadout.gear.backpack = createPiece("backpack", "set:striker");
      loadout.gear.chest = createPiece("chest", "set:striker");
      loadout.gear.gloves = createPiece("gloves", "set:striker");
      loadout.gear.holster = createPiece("holster", "brand:ceska");
      loadout.gear.kneepads = createPiece("kneepads", "brand:grupo");
      if (loadout.gear.kneepads) {
        loadout.gear.kneepads.mods = [{ stat: "chd", value: 12 }];
      }
      loadout.weapons.primary = { weaponId: "st-elmo" };
      loadout.weapons.secondary = { weaponId: "lexington" };
      loadout.weapons.sidearm = { weaponId: "liberty" };
      loadout.skills = ["reviver-hive", "crusader-shield"];
      loadout.specialization = "gunner";
      return loadout;
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
      loadout.weapons.primary = { weaponId: "lexington" };
      loadout.weapons.secondary = { weaponId: "famas" };
      loadout.weapons.sidearm = { weaponId: "d50" };
      loadout.skills = ["reviver-hive", "striker-drone"];
      loadout.specialization = "gunner";
      return loadout;
    },
  },
  {
    id: "heartbreaker",
    name: "Heartbreaker AR",
    blurb: "4 Heartbreaker bleu, bouclier croisé, St. Elmo.",
    build: () => {
      const loadout = emptyLoadout("Heartbreaker AR");
      loadout.gear.mask = createPiece("mask", "set:heartbreaker");
      loadout.gear.backpack = createPiece("backpack", "set:heartbreaker");
      loadout.gear.chest = createPiece("chest", "set:heartbreaker");
      loadout.gear.gloves = createPiece("gloves", "set:heartbreaker");
      loadout.gear.holster = createPiece("holster", "brand:ceska", "red");
      loadout.gear.kneepads = createPiece("kneepads", "foxs-prayer");
      loadout.weapons.primary = { weaponId: "st-elmo" };
      loadout.weapons.secondary = { weaponId: "carbine-7" };
      loadout.weapons.sidearm = { weaponId: "liberty" };
      loadout.skills = ["crusader-shield", "reviver-hive"];
      loadout.specialization = "gunner";
      return loadout;
    },
  },
  {
    id: "skill",
    name: "Skill DPS",
    blurb: "Empress / Wyvern / Hana-U + Capacitor. Technicien.",
    build: () => {
      const loadout = emptyLoadout("Skill DPS");
      loadout.gear.mask = createPiece("mask", "brand:empress", "yellow");
      loadout.gear.backpack = createPiece("backpack", "brand:wyvern", "yellow");
      loadout.gear.chest = createPiece("chest", "brand:hana-u", "yellow");
      loadout.gear.gloves = createPiece("gloves", "brand:empress", "yellow");
      loadout.gear.holster = createPiece("holster", "waveform");
      loadout.gear.kneepads = createPiece("kneepads", "brand:wyvern", "yellow");
      if (loadout.gear.backpack) loadout.gear.backpack.talentId = "tech-support";
      if (loadout.gear.chest) loadout.gear.chest.talentId = "kinetic-momentum";
      loadout.weapons.primary = { weaponId: "capacitor" };
      loadout.weapons.secondary = { weaponId: "lexington" };
      loadout.weapons.sidearm = { weaponId: "d50" };
      loadout.skills = ["artillery-turret", "striker-drone"];
      loadout.specialization = "technician";
      return loadout;
    },
  },
  {
    id: "foundry",
    name: "Tank Foundry",
    blurb: "4 Foundry Bulwark, bouclier rempart, Firewall.",
    build: () => {
      const loadout = emptyLoadout("Tank Foundry");
      loadout.gear.mask = createPiece("mask", "set:foundry");
      loadout.gear.backpack = createPiece("backpack", "set:foundry");
      loadout.gear.chest = createPiece("chest", "set:foundry");
      loadout.gear.gloves = createPiece("gloves", "set:foundry");
      loadout.gear.holster = createPiece("holster", "brand:gila", "blue");
      loadout.gear.kneepads = createPiece("kneepads", "brand:belstone", "blue");
      loadout.weapons.primary = { weaponId: "acs-12" };
      loadout.weapons.secondary = { weaponId: "scorpio" };
      loadout.weapons.sidearm = { weaponId: "liberty" };
      loadout.skills = ["bulwark-shield", "decoy"];
      loadout.specialization = "firewall";
      return loadout;
    },
  },
  {
    id: "hunters",
    name: "Hunter's Fury",
    blurb: "CQC SMG / pompe. Dark Winter + Chatterbox.",
    build: () => {
      const loadout = emptyLoadout("Hunter's Fury");
      loadout.gear.mask = createPiece("mask", "set:hunters-fury");
      loadout.gear.backpack = createPiece("backpack", "set:hunters-fury");
      loadout.gear.chest = createPiece("chest", "set:hunters-fury");
      loadout.gear.gloves = createPiece("gloves", "set:hunters-fury");
      loadout.gear.holster = createPiece("holster", "brand:sokolov");
      loadout.gear.kneepads = createPiece("kneepads", "brand:ceska");
      loadout.weapons.primary = { weaponId: "dark-winter" };
      loadout.weapons.secondary = { weaponId: "chatterbox" };
      loadout.weapons.sidearm = { weaponId: "d50" };
      loadout.skills = ["reviver-hive", "blinder-firefly"];
      loadout.specialization = "firewall";
      return loadout;
    },
  },
];
