import type { CatalogItem } from "../types";
import { BRANDS } from "./brands";
import { GEAR_SETS } from "./gear-sets";

export const NAMED_AND_EXOTICS: CatalogItem[] = [
  {
    id: "the-gift",
    name: "The Gift",
    kind: "named",
    brandId: "providence",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Vigilance",
      description: "+25% dégâts totaux d'arme. Prendre des dégâts désactive le buff 3 s.",
    },
    talentSlot: "backpack",
  },
  {
    id: "the-sacrifice",
    name: "The Sacrifice",
    kind: "named",
    brandId: "providence",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Glass Cannon",
      description: "Dégâts infligés +30%. Dégâts reçus +60%.",
    },
    talentSlot: "chest",
  },
  {
    id: "contractors-gloves",
    name: "Contractor's Gloves",
    kind: "named",
    brandId: "petrov",
    slots: ["gloves"],
    extraStats: [{ stat: "damageToArmor", value: 8 }],
    note: "Gants nommés Petrov avec +8% dégâts à l'armure.",
  },
  {
    id: "foxs-prayer",
    name: "Fox's Prayer",
    kind: "named",
    brandId: "overlord",
    slots: ["kneepads"],
    extraStats: [{ stat: "damageToHealth", value: 8 }],
    note: "Genouillères nommées Overlord avec +8% dégâts à la santé.",
  },
  {
    id: "picaros-holster",
    name: "Picaro's Holster",
    kind: "named",
    brandId: "brazos",
    slots: ["holster"],
    extraCores: ["red"],
    note: "Holster Brazos : cœur jaune naturel + cœur rouge bonus.",
  },
  {
    id: "zero-fs",
    name: "Zero F's Given",
    kind: "named",
    brandId: "ceska",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Glass Cannon",
      description: "Variante Česká de Perfect Glass Cannon.",
    },
    talentSlot: "chest",
  },
  {
    id: "pointman",
    name: "Pointman",
    kind: "named",
    brandId: "walker",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Vanguard",
      description: "Bouclier invulnérable plus longtemps, armure bonus alliés renforcée.",
    },
    talentSlot: "chest",
  },
  {
    id: "sawyers-kneepads",
    name: "Sawyer's Kneepads",
    kind: "named",
    brandId: "gila",
    slots: ["kneepads"],
    extraStats: [{ stat: "armorRegen", value: 1 }],
    note: "Genouillères Gila axées régénération.",
  },
  {
    id: "nightwatcher",
    name: "Nightwatcher",
    kind: "named",
    brandId: "gila",
    slots: ["mask"],
    extraStats: [{ stat: "skillHaste", value: 10 }],
    note: "Masque Gila : Perfect Pulse. Compte pour Gila Guard.",
  },
  {
    id: "coyotes-mask",
    name: "Coyote's Mask",
    kind: "exotic",
    slots: ["mask"],
    uniqueTalent: {
      name: "Pack Instincts",
      description:
        "Selon la distance : CHD (proche), CHC (moyen) ou HSD (loin). Moyenne builder : +8% CHC et +8% CHD.",
    },
    extraStats: [
      { stat: "chc", value: 8 },
      { stat: "chd", value: 8 },
    ],
  },
  {
    id: "memento",
    name: "Memento",
    kind: "exotic",
    slots: ["backpack"],
    extraCores: ["blue", "yellow"],
    uniqueTalent: {
      name: "Kill Confirmed",
      description:
        "Ramasser un trophée : stacks de WD, armure et skill. 3 cœurs. Excellent hybride.",
    },
  },
  {
    id: "ninjabike",
    name: "NinjaBike Messenger Bag",
    kind: "exotic",
    slots: ["backpack"],
    ninja: true,
    uniqueTalent: {
      name: "Resourceful",
      description:
        "Compte +1 pièce pour chaque marque et set déjà équipé. Permet d'activer plusieurs bonus 2pc / 3pc / 4pc.",
    },
  },
  {
    id: "catharsis",
    name: "Catharsis",
    kind: "exotic",
    slots: ["mask"],
    uniqueTalent: {
      name: "Vicious Cycle",
      description: "Prendre des dégâts construit un buff. Armure basse : burst de réparation et statut aux ennemis proches.",
    },
  },
  {
    id: "ridgeways-pride",
    name: "Ridgeway's Pride",
    kind: "exotic",
    slots: ["chest"],
    uniqueTalent: {
      name: "Bleeding Heart",
      description: "Dégâts d'arme appliquent saignement. Soigne selon les cibles en saignement.",
    },
  },
  {
    id: "tardigrade",
    name: "Tardigrade Armor System",
    kind: "exotic",
    slots: ["chest"],
    uniqueTalent: {
      name: "Ablative Nanoplating",
      description: "Quand l'armure casse : hive d'armure pour vous et les alliés proches.",
    },
  },
  {
    id: "waveform",
    name: "Waveform",
    kind: "exotic",
    slots: ["holster"],
    uniqueTalent: {
      name: "Capacitance",
      description: "Dégâts de compétence construisent un bonus de dégâts d'arme, et inversement.",
    },
  },
  {
    id: "acosta-go-bag",
    name: "Acosta's Go-Bag",
    kind: "exotic",
    slots: ["backpack"],
    uniqueTalent: {
      name: "One Step Ahead",
      description: "Grenades et kits bonus. Utiliser une grenade : buff de dégâts / armure.",
    },
  },
  {
    id: "imperial-dynasty",
    name: "Imperial Dynasty",
    kind: "exotic",
    slots: ["holster"],
    uniqueTalent: {
      name: "Dragon's Negation",
      description: "Ennemis proches : brûlure. Contrôle de foule CQC.",
    },
  },
  {
    id: "dodge-city",
    name: "Dodge City Gunslinger's Holster",
    kind: "exotic",
    slots: ["holster"],
    uniqueTalent: {
      name: "Quick Draw",
      description: "Changer vers le pistolet : headshots pistolet massifs. Regulus / Liberty.",
    },
  },
];

export const CATALOG: CatalogItem[] = [
  ...BRANDS.map(
    (brand): CatalogItem => ({
      id: `brand:${brand.id}`,
      name: brand.name,
      kind: "brand",
      brandId: brand.id,
      slots: "all",
    }),
  ),
  ...GEAR_SETS.map(
    (set): CatalogItem => ({
      id: `set:${set.id}`,
      name: set.name,
      kind: "gear-set",
      gearSetId: set.id,
      slots: "all",
      lockedCore: set.core,
    }),
  ),
  ...NAMED_AND_EXOTICS,
];

export function catalogById(id: string): CatalogItem | undefined {
  return CATALOG.find((item) => item.id === id);
}

export function catalogForSlot(slot: import("../types").Slot): CatalogItem[] {
  return CATALOG.filter((item) => item.slots === "all" || item.slots.includes(slot));
}
