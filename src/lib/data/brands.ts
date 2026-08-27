import type { Brand } from "../types";

export const BRANDS: Brand[] = [
  {
    id: "providence",
    name: "Providence Defense",
    color: "#c9a44a",
    bonuses: [
      [{ stat: "hsd", value: 13 }],
      [{ stat: "chc", value: 8 }],
      [{ stat: "chd", value: 13 }],
    ],
  },
  {
    id: "ceska",
    name: "Česká Výroba",
    color: "#7ec8e8",
    bonuses: [
      [{ stat: "chc", value: 8 }],
      [{ stat: "shotgunDamage", value: 24 }],
      [{ stat: "hazardProtection", value: 30 }],
    ],
  },
  {
    id: "grupo",
    name: "Grupo Sombra",
    color: "#d4a017",
    bonuses: [
      [{ stat: "chd", value: 13 }],
      [{ stat: "explosiveDamage", value: 20 }],
      [{ stat: "hsd", value: 39 }],
    ],
  },
  {
    id: "walker",
    name: "Walker, Harris & Co",
    color: "#b87333",
    bonuses: [
      [{ stat: "weaponDamage", value: 6 }],
      [{ stat: "damageToArmor", value: 5 }],
      [{ stat: "damageToHealth", value: 10 }],
    ],
  },
  {
    id: "fenris",
    name: "Fenris Group",
    color: "#8b1e1e",
    bonuses: [
      [{ stat: "arDamage", value: 12 }],
      [{ stat: "magazineSize", value: 32 }],
      [{ stat: "stability", value: 50 }],
    ],
  },
  {
    id: "petrov",
    name: "Petrov Defense Group",
    color: "#4a6b3a",
    bonuses: [
      [{ stat: "lmgDamage", value: 12 }],
      [{ stat: "weaponHandling", value: 15 }],
      [{ stat: "ammoCapacity", value: 50 }],
    ],
  },
  {
    id: "overlord",
    name: "Overlord Armaments",
    color: "#5c4a32",
    bonuses: [
      [{ stat: "rifleDamage", value: 12 }],
      [{ stat: "accuracy", value: 30 }],
      [{ stat: "weaponHandling", value: 30 }],
    ],
  },
  {
    id: "sokolov",
    name: "Sokolov Concern",
    color: "#6b4c7a",
    bonuses: [
      [{ stat: "smgDamage", value: 12 }],
      [{ stat: "chd", value: 13 }],
      [{ stat: "chc", value: 8 }],
    ],
  },
  {
    id: "airaldi",
    name: "Airaldi Holdings",
    color: "#3d5a4c",
    bonuses: [
      [{ stat: "mmrDamage", value: 12 }],
      [{ stat: "hsd", value: 26 }],
      [{ stat: "damageToArmor", value: 5 }],
    ],
  },
  {
    id: "badger",
    name: "Badger Tuff",
    color: "#8a6a2a",
    bonuses: [
      [{ stat: "shotgunDamage", value: 12 }],
      [{ stat: "armorOnKill", value: 10 }],
      [{ stat: "armor", value: 15 }],
    ],
  },
  {
    id: "douglas",
    name: "Douglas & Harding",
    color: "#4a5560",
    bonuses: [
      [{ stat: "pistolDamage", value: 24 }],
      [{ stat: "skillHealth", value: 20 }],
      [{ stat: "accuracy", value: 50 }],
    ],
  },
  {
    id: "gila",
    name: "Gila Guard",
    color: "#2f6b4f",
    bonuses: [
      [{ stat: "armor", value: 5 }],
      [{ stat: "hazardProtection", value: 20 }],
      [{ stat: "armorRegen", value: 2 }],
    ],
  },
  {
    id: "belstone",
    name: "Belstone Armory",
    color: "#6e7a4a",
    bonuses: [
      [{ stat: "armorRegen", value: 1 }],
      [{ stat: "threat", value: 100 }],
      [{ stat: "protectionFromElites", value: 36 }],
    ],
  },
  {
    id: "uzina",
    name: "Uzina Getica",
    color: "#5a6e5a",
    bonuses: [
      [{ stat: "armor", value: 5 }],
      [{ stat: "armorOnKill", value: 10 }],
      [{ stat: "hazardProtection", value: 30 }],
    ],
  },
  {
    id: "palisade",
    name: "Palisade Steelworks",
    color: "#7a8a9a",
    bonuses: [
      [{ stat: "armorOnKill", value: 10 }],
      [{ stat: "protectionFromElites", value: 24 }],
      [{ stat: "skillTier", value: 1 }],
    ],
  },
  {
    id: "yaahl",
    name: "Yaahl Gear",
    color: "#2a2a2a",
    bonuses: [
      [{ stat: "hazardProtection", value: 10 }],
      [{ stat: "weaponDamage", value: 10 }],
      [{ stat: "pulseResistance", value: 40 }],
    ],
  },
  {
    id: "511",
    name: "5.11 Tactical",
    color: "#3a3f36",
    bonuses: [
      [{ stat: "protectionFromElites", value: 12 }],
      [{ stat: "threat", value: 100 }],
      [{ stat: "hazardProtection", value: 30 }],
    ],
  },
  {
    id: "golan",
    name: "Golan Gear",
    color: "#4a6741",
    bonuses: [
      [{ stat: "explosiveResistance", value: 20 }],
      [{ stat: "armorRegen", value: 1.5 }],
      [{ stat: "threat", value: 150 }],
    ],
  },
  {
    id: "empress",
    name: "Empress International",
    color: "#c45c8a",
    bonuses: [
      [{ stat: "skillHealth", value: 10 }],
      [{ stat: "skillDamage", value: 13 }],
      [{ stat: "skillEfficiency", value: 8 }],
    ],
  },
  {
    id: "wyvern",
    name: "Wyvern Wear",
    color: "#6a4c9a",
    bonuses: [
      [{ stat: "skillDamage", value: 8 }],
      [{ stat: "statusEffects", value: 20 }],
      [{ stat: "skillDuration", value: 45 }],
    ],
  },
  {
    id: "alps",
    name: "Alps Summit Armament",
    color: "#8ecae6",
    bonuses: [
      [{ stat: "skillRepair", value: 18 }],
      [{ stat: "skillDuration", value: 30 }],
      [{ stat: "skillHaste", value: 30 }],
    ],
  },
  {
    id: "china-light",
    name: "China Light Industries",
    color: "#d94f2a",
    bonuses: [
      [{ stat: "explosiveDamage", value: 15 }],
      [{ stat: "statusEffects", value: 20 }],
      [{ stat: "skillHaste", value: 30 }],
    ],
  },
  {
    id: "brazos",
    name: "Brazos de Arcabuz",
    color: "#c4a35a",
    bonuses: [
      [{ stat: "skillHaste", value: 10 }],
      [{ stat: "skillTier", value: 1 }],
      [{ stat: "magazineSize", value: 50 }],
    ],
  },
  {
    id: "hana-u",
    name: "Hana-U Corporation",
    color: "#2a6b8a",
    bonuses: [
      [{ stat: "skillHaste", value: 10 }],
      [{ stat: "skillDamage", value: 13 }],
      [{ stat: "weaponDamage", value: 18 }],
    ],
  },
  {
    id: "murakami",
    name: "Murakami Industries",
    color: "#8a2a4a",
    bonuses: [
      [{ stat: "skillDuration", value: 15 }],
      [{ stat: "skillRepair", value: 35 }],
      [{ stat: "skillDamage", value: 18 }],
    ],
  },
  {
    id: "richter",
    name: "Richter & Kaiser",
    color: "#9aa0a8",
    bonuses: [
      [{ stat: "skillHaste", value: 10 }],
      [{ stat: "explosiveResistance", value: 40 }],
      [{ stat: "skillRepair", value: 52 }],
    ],
  },
  {
    id: "electrique",
    name: "Electrique",
    color: "#3ec8ff",
    bonuses: [
      [{ stat: "statusEffects", value: 10 }],
      [{ stat: "hazardProtection", value: 20 }],
      [{ stat: "skillEfficiency", value: 8 }],
    ],
  },
  {
    id: "habsburg",
    name: "Habsburg Guard",
    color: "#c9b037",
    bonuses: [
      [{ stat: "hsd", value: 13 }],
      [{ stat: "mmrDamage", value: 24 }],
      [{ stat: "statusEffects", value: 25 }],
    ],
  },
  {
    id: "lengmo",
    name: "Lengmo",
    color: "#5a3a2a",
    bonuses: [
      [{ stat: "reloadSpeed", value: 15 }],
      [{ stat: "lmgDamage", value: 24 }],
      [{ stat: "weaponHandling", value: 30 }],
    ],
  },
  {
    id: "zwiadowka",
    name: "Zwiadowka",
    color: "#3a4a3a",
    bonuses: [
      [{ stat: "magazineSize", value: 15 }],
      [{ stat: "rifleDamage", value: 24 }],
      [{ stat: "weaponHandling", value: 30 }],
    ],
  },
  {
    id: "legatus",
    name: "Legatus",
    color: "#6a5a3a",
    bonuses: [
      [{ stat: "magazineSize", value: 15 }],
      [{ stat: "smgDamage", value: 24 }],
      [{ stat: "optimalRange", value: 105 }],
    ],
  },
  {
    id: "shiny-monkey",
    name: "Shiny Monkey Gear",
    color: "#e8c84a",
    bonuses: [
      [{ stat: "skillDuration", value: 15 }],
      [{ stat: "skillEfficiency", value: 5 }],
      [{ stat: "skillRepair", value: 52 }],
    ],
  },
  {
    id: "imminence",
    name: "Imminence Armaments",
    color: "#8a3a3a",
    bonuses: [
      [{ stat: "weaponDamage", value: 6 }],
      [{ stat: "pistolDamage", value: 48 }],
      [{ stat: "skillHealth", value: 30 }],
    ],
  },
  {
    id: "urban-lookout",
    name: "Urban Lookout",
    color: "#4a5a6a",
    bonuses: [
      [{ stat: "weaponHandling", value: 5 }],
      [{ stat: "mmrDamage", value: 24 }],
      [{ stat: "skillDuration", value: 45 }],
    ],
  },
  {
    id: "unit-alloys",
    name: "Unit Alloys",
    color: "#7a9aaa",
    bonuses: [
      [{ stat: "rateOfFire", value: 5 }],
      [{ stat: "arDamage", value: 24 }],
      [{ stat: "magazineSize", value: 50 }],
    ],
  },
  {
    id: "royal-works",
    name: "Royal Works",
    color: "#8a6a8a",
    bonuses: [
      [{ stat: "weaponHandling", value: 5 }],
      [{ stat: "lmgDamage", value: 24 }],
      [{ stat: "accuracy", value: 50 }],
    ],
  },
  {
    id: "edelweiss",
    name: "Edelweiss GPz",
    color: "#dfe6e9",
    bonuses: [
      [{ stat: "skillRepair", value: 18 }],
      [{ stat: "skillHaste", value: 20 }],
      [{ stat: "skillEfficiency", value: 8 }],
    ],
  },
];
