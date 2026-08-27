import type { CatalogItem } from "../types";
import { BRANDS } from "./brands";
import { GEAR_SETS } from "./gear-sets";

/**
 * Nommés et exotiques d'équipement (live Y8S3).
 * Organisé marque par marque, puis exotiques par emplacement.
 * Base : sheet communautaire (à jour au 22 mars 2026) + pièces Y8S2/Y8S3 postérieures.
 * Saisonniers meme (Oh Carol, Sleigher, Bell Ringer, Festive Delivery…) volontairement omis.
 */
export const NAMED_AND_EXOTICS: CatalogItem[] = [
  // --- Providence Defense ---
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

  // --- Česká Výroba ---
  {
    id: "devils-due",
    name: "Devil's Due",
    kind: "named",
    brandId: "ceska",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Clutch",
      description:
        "Armure détruite : les critiques réparent 3,5% d'armure et les tirs 0,6% de santé pendant 5 s. CD 15 s.",
    },
    talentSlot: "backpack",
  },
  {
    id: "turmoil",
    name: "Turmoil",
    kind: "named",
    brandId: "ceska",
    slots: ["kneepads"],
    extraStats: [{ stat: "chd", value: 12 }],
    uniqueTalent: {
      name: "Bewildered",
      description:
        "50% des dégâts d'arme sont infligés à un autre ennemi dans les 30 m. S'il n'y en a pas, dégâts normaux. Ne s'applique pas aux plaques d'armure.",
    },
    note: "Genouillères Česká (événement 1er avril, loot pool ensuite). Talent Bewildered.",
  },

  // --- Grupo Sombra ---
  {
    id: "door-kickers-knock",
    name: "Door-Kicker's Knock",
    kind: "named",
    brandId: "grupo",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Spark",
      description:
        "Détruire une compétence ennemie : +30% dégâts totaux d'arme et de compétence pendant 20 s.",
    },
    talentSlot: "chest",
  },

  // --- Walker, Harris & Co ---
  {
    id: "chainkiller",
    name: "Chainkiller",
    kind: "named",
    brandId: "walker",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Headhunter",
      description:
        "Après un headshot, le prochain headshot dans les 5 s est amplifié (150% des dégâts du premier, plafonné).",
    },
    talentSlot: "chest",
  },
  {
    id: "matador",
    name: "Matador",
    kind: "named",
    brandId: "walker",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Adrenaline Rush",
      description:
        "Tuer à moins de 8 m : 25% armure bonus (max 50%). Dure 10 s.",
    },
    talentSlot: "backpack",
  },

  // --- Fenris Group ---
  {
    id: "ferocious-calm",
    name: "Ferocious Calm",
    kind: "named",
    brandId: "fenris",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Overwatch",
      description:
        "Rester en couverture 5 s : +15% dégâts totaux d'arme et de compétence pour vous et les alliés (15 s).",
    },
    talentSlot: "chest",
  },

  // --- Petrov Defense Group ---
  {
    id: "contractors-gloves",
    name: "Contractor's Gloves",
    kind: "named",
    brandId: "petrov",
    slots: ["gloves"],
    extraStats: [{ stat: "damageToArmor", value: 8 }],
    note: "Gants Petrov avec +8% dégâts à l'armure (au-dessus du plafond 6%).",
  },
  {
    id: "vedmedytsya",
    name: "Vedmedytsya Vest",
    kind: "named",
    brandId: "petrov",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Braced",
      description: "En couverture : +50% maniement d'arme.",
    },
    talentSlot: "chest",
    note: "Recherche de spécialisation Gunner.",
  },

  // --- Overlord Armaments ---
  {
    id: "foxs-prayer",
    name: "Fox's Prayer",
    kind: "named",
    brandId: "overlord",
    slots: ["kneepads"],
    extraStats: [{ stat: "damageToHealth", value: 8 }],
    note: "Genouillères Overlord avec +8% dégâts à la santé (au-dessus du plafond 6%).",
  },

  // --- Sokolov Concern ---
  {
    id: "firm-handshake",
    name: "Firm Handshake",
    kind: "named",
    brandId: "sokolov",
    slots: ["gloves"],
    extraStats: [{ stat: "statusEffects", value: 10 }],
    extraCores: ["blue"],
    note: "Gants Sokolov : +10% effets de statut extra + cœur bleu.",
  },

  // --- Airaldi Holdings ---
  {
    id: "pristine-example",
    name: "Pristine Example",
    kind: "named",
    brandId: "airaldi",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Focus",
      description:
        "Rester à l'arrêt : +1,2% dégâts totaux d'arme par seconde, jusqu'à 12%. Bouger réinitialise.",
    },
    talentSlot: "chest",
  },
  {
    id: "melon-baller",
    name: "Melon Baller",
    kind: "named",
    brandId: "airaldi",
    slots: ["backpack"],
    extraCores: ["blue"],
    uniqueTalent: {
      name: "Perfect Concussion",
      description:
        "Headshot : +20% dégâts totaux d'arme pendant 1,5 s (5 s au fusil de précision). Kill headshot : +15% pendant 10 s.",
    },
    talentSlot: "backpack",
  },

  // --- Badger Tuff ---
  {
    id: "zero-fs",
    name: "Zero F's Given",
    kind: "named",
    brandId: "badger",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Unbreakable",
      description:
        "Quand l'armure est détruite, répare 100% de l'armure. Recharge 60 s. Kit d'armure gratuit pendant 7 s.",
    },
    talentSlot: "chest",
  },
  {
    id: "ammo-dump",
    name: "Ammo Dump",
    kind: "named",
    brandId: "badger",
    slots: ["holster"],
    extraStats: [{ stat: "ammoCapacity", value: 10 }],
    note: "Holster Badger (recherche Firewall) : +10% capacité de munitions.",
  },

  // --- Douglas & Harding ---
  {
    id: "punch-drunk",
    name: "Punch Drunk",
    kind: "named",
    brandId: "douglas",
    slots: ["mask"],
    extraStats: [{ stat: "hsd", value: 20 }],
    extraCores: ["red"],
    note: "Masque Douglas : +20% dégâts headshot extra (jet unique) + cœur rouge.",
  },

  // --- Gila Guard ---
  {
    id: "pointman",
    name: "Pointman",
    kind: "named",
    brandId: "gila",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Vanguard",
      description:
        "Déployer un bouclier : invulnérable 7 s et 60% de votre armure en bonus aux alliés (20 s). CD 60 s.",
    },
    talentSlot: "chest",
  },
  {
    id: "nightwatcher",
    name: "Nightwatcher",
    kind: "named",
    brandId: "gila",
    slots: ["mask"],
    extraStats: [{ stat: "skillHaste", value: 10 }],
    extraCores: ["yellow"],
    note: "Masque Gila : Scanner Pulse Haste 100% (approximé haste) + cœur jaune.",
  },
  {
    id: "sawyers-kneepads",
    name: "Sawyer's Kneepads",
    kind: "named",
    brandId: "gila",
    slots: ["kneepads"],
    extraStats: [{ stat: "armorRegen", value: 1 }],
    extraCores: ["red"],
    note: "Genouillères Gila : régénération d'armure extra + cœur rouge.",
  },
  {
    id: "chill-out",
    name: "Chill Out",
    kind: "named",
    brandId: "gila",
    slots: ["mask"],
    extraStats: [{ stat: "skillHaste", value: 10 }],
    extraCores: ["yellow"],
    note: "Masque saisonnier Gila : 2 emplacements de mods (le builder n'en simule qu'un) + cœur jaune.",
  },

  // --- Belstone Armory ---
  {
    id: "everyday-carrier",
    name: "Everyday Carrier",
    kind: "named",
    brandId: "belstone",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Efficient",
      description:
        "Utiliser un kit d'armure hors combat n'en consomme pas. En combat, +30% réparation de kit.",
    },
    talentSlot: "chest",
  },
  {
    id: "liquid-engineer",
    name: "Liquid Engineer",
    kind: "named",
    brandId: "belstone",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Bloodsucker",
      description: "Tuer : 12% armure bonus par ennemi proche, jusqu'à 60%. Dure 10 s.",
    },
    talentSlot: "backpack",
  },

  // --- 5.11 Tactical ---
  {
    id: "deathgrips",
    name: "Deathgrips",
    kind: "named",
    brandId: "511",
    slots: ["gloves"],
    extraStats: [{ stat: "armorOnKill", value: 10 }],
    extraCores: ["red"],
    note: "Gants 5.11 : +10% armure au kill extra + cœur rouge.",
  },
  {
    id: "keeper",
    name: "Keeper",
    kind: "named",
    brandId: "511",
    slots: ["backpack"],
    extraCores: ["yellow"],
    uniqueTalent: {
      name: "Perfect Protector",
      description:
        "Quand le bouclier prend des dégâts : +25% armure bonus, et les alliés gagnent 35% de votre armure en bonus pendant 3 s. CD 3 s.",
    },
    talentSlot: "backpack",
  },

  // --- Golan Gear ---
  {
    id: "hunter-killer",
    name: "Hunter Killer",
    kind: "named",
    brandId: "golan",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Intimidate",
      description:
        "À moins de 8 m, +40% dégâts totaux d'arme si vous avez de l'armure bonus.",
    },
    talentSlot: "chest",
  },
  {
    id: "anarchists-cookbook",
    name: "Anarchist's Cookbook",
    kind: "named",
    brandId: "golan",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Wicked",
      description: "Appliquer un statut : +21% dégâts totaux d'arme pendant 20 s.",
    },
    talentSlot: "backpack",
  },

  // --- Empress International ---
  {
    id: "caesars-guard",
    name: "Caesar's Guard",
    kind: "named",
    brandId: "empress",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Skilled",
      description:
        "Tuer avec une compétence : +25% dégâts de compétence pendant 15 s. Stacks jusqu'à 3.",
    },
    talentSlot: "chest",
  },
  {
    id: "battery-pack",
    name: "Battery Pack",
    kind: "named",
    brandId: "empress",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Calculated",
      description:
        "Tuer avec une compétence : réduit toutes les recharges actives de 20%.",
    },
    talentSlot: "backpack",
  },

  // --- Wyvern Wear ---
  {
    id: "claws-out",
    name: "Claws Out",
    kind: "named",
    brandId: "wyvern",
    slots: ["holster"],
    extraStats: [{ stat: "pistolDamage", value: 10 }],
    extraCores: ["red"],
    note: "Holster Wyvern : dégâts de pistolet extra, dégâts de mêlée élevés, cœur rouge.",
  },
  {
    id: "impetus",
    name: "Impetus",
    kind: "named",
    brandId: "wyvern",
    slots: ["chest"],
    extraCores: ["yellow"],
    uniqueTalent: {
      name: "Perfect Kinetic Momentum",
      description:
        "En combat, chaque compétence active (ou hors CD) génère des stacks : +1,5% dégâts de compétence et +2% réparation par stack, 18 max par compétence.",
    },
    talentSlot: "chest",
  },

  // --- Alps Summit ---
  {
    id: "percussive-maintenance",
    name: "Percussive Maintenance",
    kind: "named",
    brandId: "alps",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Tech Support",
      description:
        "Tuer avec une compétence : +30% dégâts/réparation de compétence pendant 15 s.",
    },
    talentSlot: "backpack",
  },
  {
    id: "motherly-love",
    name: "Motherly Love",
    kind: "named",
    brandId: "alps",
    slots: ["gloves"],
    extraStats: [{ stat: "skillHealth", value: 20 }],
    extraCores: ["yellow"],
    note: "Gants Alps (recherche Technician) : +20% santé de compétence extra.",
  },

  // --- China Light Industries ---
  {
    id: "strategic-alignment",
    name: "Strategic Alignment",
    kind: "named",
    brandId: "china-light",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Shock and Awe",
      description:
        "Tuer avec une compétence : pulse les ennemis à 20 m pendant 8 s. CD 10 s.",
    },
    talentSlot: "backpack",
  },

  // --- Brazos de Arcabuz ---
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
    id: "hermano",
    name: "Hermano",
    kind: "named",
    brandId: "brazos",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Overclock",
      description:
        "Alliés à 15 m d'une compétence déployée : +30% vitesse de rechargement et −0,6 s de recharges actives par seconde.",
    },
    talentSlot: "backpack",
  },

  // --- Hana-U Corporation ---
  {
    id: "force-multiplier",
    name: "Force Multiplier",
    kind: "named",
    brandId: "hana-u",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Combined Arms",
      description: "Utiliser une compétence : +30% dégâts totaux d'arme pendant 10 s.",
    },
    talentSlot: "backpack",
  },

  // --- Murakami Industries ---
  {
    id: "emperors-guard",
    name: "Emperor's Guard",
    kind: "named",
    brandId: "murakami",
    slots: ["kneepads"],
    extraStats: [{ stat: "armorRegen", value: 1 }],
    extraCores: ["yellow"],
    note: "Genouillères Murakami : +1% régénération d'armure extra + cœur jaune.",
  },

  // --- Richter & Kaiser ---
  {
    id: "rushdown",
    name: "Rushdown",
    kind: "named",
    brandId: "richter",
    slots: ["chest"],
    extraCores: ["red"],
    uniqueTalent: {
      name: "Tag Team",
      description:
        "Le dernier ennemi blessé par une compétence est marqué. Dégâts d'arme sur cette cible : -12 s de recharges actives. CD 4 s.",
    },
    talentSlot: "chest",
  },
  {
    id: "forge",
    name: "Forge",
    kind: "named",
    brandId: "richter",
    slots: ["holster"],
    extraStats: [{ stat: "skillHealth", value: 20 }],
    extraCores: ["yellow"],
    note: "Holster Richter : +50% santé de bouclier (approximé par santé de compétence) + cœur jaune.",
  },

  // --- Electrique ---
  {
    id: "henri",
    name: "Henri",
    kind: "named",
    brandId: "electrique",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Companion",
      description:
        "Allié ou compétence à moins de 5 m : +20% dégâts totaux d'arme.",
    },
    talentSlot: "chest",
  },
  {
    id: "lavoisier",
    name: "Lavoisier",
    kind: "named",
    brandId: "electrique",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Galvanize",
      description:
        "Appliquer un statut : alliés à 20 m gagnent 50% armure bonus pendant 10 s.",
    },
    talentSlot: "backpack",
  },

  // --- Habsburg Guard ---
  {
    id: "cherished",
    name: "Cherished",
    kind: "named",
    brandId: "habsburg",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Trauma",
      description: "Headshot : applique saignement aux ennemis à 10 m. CD 12 s.",
    },
    talentSlot: "chest",
  },
  {
    id: "the-courier",
    name: "The Courier",
    kind: "named",
    brandId: "habsburg",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Creeping Death",
      description: "Appliquer un statut : se propage à 12 m. CD 12 s.",
    },
    talentSlot: "backpack",
  },

  // --- Lengmo ---
  {
    id: "backbone",
    name: "Backbone",
    kind: "named",
    brandId: "lengmo",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfectly Unstoppable Force",
      description:
        "Tuer : +7% dégâts totaux d'arme pendant 15 s, 5 stacks. Un kill grenade donne 2 stacks.",
    },
    talentSlot: "backpack",
  },
  {
    id: "carpenter",
    name: "Carpenter",
    kind: "named",
    brandId: "lengmo",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfectly Mad Bomber",
      description:
        "Rayon de grenade +75%. Kill grenade remboursée. Les grenades se cuisinent. +15% armure bonus en visant une grenade.",
    },
    talentSlot: "chest",
  },

  // --- Legatus ---
  {
    id: "vigil",
    name: "Vigil",
    kind: "named",
    brandId: "legatus",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Versatile",
      description:
        "Changer d'arme (types différents) : +45% dégâts totaux à moins de 15 m (pompe/SMG), +45% au-delà de 25 m (fusil/MMR), +20% entre 15 et 25 m (LMG/AR). 10 s, une fois / 5 s par type.",
    },
    talentSlot: "backpack",
  },
  {
    id: "visionario",
    name: "Visionario",
    kind: "named",
    brandId: "legatus",
    slots: ["mask"],
    extraStats: [{ stat: "optimalRange", value: 50 }],
    note: "Masque Legatus : +50% portée optimale extra.",
  },

  // --- Imminence Armaments ---
  {
    id: "trick-shot",
    name: "Trick Shot",
    kind: "named",
    brandId: "imminence",
    slots: ["chest"],
    extraCores: ["blue"],
    uniqueTalent: {
      name: "Perfect Reassigned",
      description: "Tuer un ennemi : 1 munition spéciale aléatoire dans le pistolet. CD 8 s.",
    },
    talentSlot: "chest",
  },
  {
    id: "capn",
    name: "Cap'n",
    kind: "named",
    brandId: "imminence",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Leadership",
      description:
        "Mouvement couverture à couverture : 20% de votre armure en bonus pour vous et les alliés (10 s). Triplé si vous finissez à moins de 10 m d'un ennemi. CD 10 s.",
    },
    talentSlot: "backpack",
  },
  {
    id: "cloak",
    name: "Cloak",
    kind: "named",
    brandId: "imminence",
    slots: ["kneepads"],
    extraStats: [{ stat: "threat", value: -50 }],
    note: "Genouillères Imminence : −50% menace extra.",
  },

  // --- Urban Lookout ---
  {
    id: "sleight",
    name: "Sleight",
    kind: "named",
    brandId: "urban-lookout",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Protected Reload",
      description:
        "Pendant un rechargement : +40% armure bonus. Les alliés rechargent : 0–30% de votre armure en bonus (selon cœurs bleus).",
    },
    talentSlot: "chest",
  },
  {
    id: "spot-on",
    name: "Spot-On",
    kind: "named",
    brandId: "urban-lookout",
    slots: ["holster"],
    extraStats: [{ stat: "accuracy", value: 38 }],
    note: "Holster Urban Lookout : +38% précision extra (jet unique).",
  },

  // --- Unit Alloys ---
  {
    id: "equalizer",
    name: "Equalizer",
    kind: "named",
    brandId: "unit-alloys",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Obliterate",
      description:
        "Les critiques augmentent les dégâts d'arme totaux de 1% pendant 5 s. 30 stacks max.",
    },
    talentSlot: "chest",
  },
  {
    id: "salvo",
    name: "Salvo",
    kind: "named",
    brandId: "unit-alloys",
    slots: ["holster"],
    extraStats: [{ stat: "rateOfFire", value: 5 }],
    extraCores: ["red"],
    note: "Holster Unit Alloys : +5% cadence extra + cœur rouge.",
  },

  // --- Royal Works ---
  {
    id: "robin",
    name: "Robin",
    kind: "named",
    brandId: "royal-works",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Gunslinger",
      description:
        "Changer d'arme : +25% dégâts totaux d'arme pendant 8 s. CD 8 s.",
    },
    talentSlot: "chest",
  },
  {
    id: "bulldog",
    name: "Bulldog",
    kind: "named",
    brandId: "royal-works",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Composure",
      description: "En couverture : +20% dégâts totaux d'arme.",
    },
    talentSlot: "backpack",
  },

  // --- Edelweiss GPz ---
  {
    id: "benefactor",
    name: "Benefactor",
    kind: "named",
    brandId: "edelweiss",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Empathic Resolve",
      description:
        "Réparer un allié : +3% à +20% dégâts totaux d'arme et de compétence pour lui pendant 10 s (selon palier de compétence).",
    },
    talentSlot: "chest",
  },
  {
    id: "momma-badger",
    name: "Momma Badger",
    kind: "named",
    brandId: "edelweiss",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Safeguard",
      description: "Réparer un allié : +30% réparation reçue pendant 5 s.",
    },
    talentSlot: "backpack",
  },

  // --- Uzina Getica ---
  {
    id: "the-setup",
    name: "The Setup",
    kind: "named",
    brandId: "uzina",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfectly Opportunistic",
      description:
        "Toucher un ennemi au fusil à pompe ou de précision : il subit +15% dégâts de toutes sources pendant 5 s.",
    },
    talentSlot: "backpack",
  },
  {
    id: "closer",
    name: "Closer",
    kind: "named",
    brandId: "uzina",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Spotter",
      description: "+20% dégâts totaux d'arme et de compétence vs cibles pulsées.",
    },
    talentSlot: "chest",
  },

  // --- Palisade Steelworks ---
  {
    id: "proxy",
    name: "Proxy",
    kind: "named",
    brandId: "palisade",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfectly Tamper Proof",
      description:
        "Ennemis à 3 m d'une hive, tourelle, pulse distant ou leurre : choc. Armement 2 s, CD 8 s par compétence.",
    },
    talentSlot: "backpack",
  },
  {
    id: "combustor",
    name: "Combustor",
    kind: "named",
    brandId: "palisade",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfectly Explosive Delivery",
      description:
        "Lancer une compétence : explosion 1,5 s après l'atterrissage (5 m), puis toutes les 5 s. Dégâts selon palier. Une fois par compétence.",
    },
    talentSlot: "chest",
  },

  // --- Zwiadowka ---
  {
    id: "bober",
    name: "Bober",
    kind: "named",
    brandId: "zwiadowka",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Entrench",
      description:
        "Sous 30% d'armure, un headshot depuis la couverture répare 30% d'armure. CD 2 s.",
    },
    talentSlot: "chest",
  },
  {
    id: "eagles-grasp",
    name: "Eagles Grasp",
    kind: "named",
    brandId: "zwiadowka",
    slots: ["gloves"],
    extraStats: [{ stat: "weaponHandling", value: 15 }],
    note: "Gants Zwiadowka : +15% maniement extra (jet unique).",
  },

  // --- Shiny Monkey Gear ---
  {
    id: "axel",
    name: "Axel",
    kind: "named",
    brandId: "shiny-monkey",
    slots: ["backpack"],
    extraCores: ["yellow"],
    uniqueTalent: {
      name: "Perfect Energize",
      description:
        "Utiliser un kit d'armure : +1 palier de compétence pendant 15 s. Déjà palier 6 : overcharge. CD 30 s.",
    },
    talentSlot: "backpack",
  },
  {
    id: "grease",
    name: "Grease",
    kind: "named",
    brandId: "shiny-monkey",
    slots: ["kneepads"],
    extraStats: [{ stat: "statusEffects", value: 16 }],
    extraCores: ["yellow"],
    note: "Genouillères Shiny Monkey : +16% effets de statut extra + cœur jaune.",
  },

  // --- Yaahl Gear ---
  {
    id: "the-hollow-man",
    name: "The Hollow Man",
    kind: "named",
    brandId: "yaahl",
    slots: ["mask"],
    extraStats: [{ stat: "damageToHealth", value: 14 }],
    extraCores: ["blue"],
    note: "Masque Yaahl : +14% dégâts à la santé extra + cœur bleu.",
  },

  // ========== Exotiques — masques ==========
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
    id: "vile",
    name: "Vile",
    kind: "exotic",
    slots: ["mask"],
    uniqueTalent: {
      name: "Toxic Delivery",
      description:
        "Appliquer un statut ou infliger des dégâts de compétence pose un DoT. La force scale avec effets de statut et dégâts de compétence.",
    },
  },
  {
    id: "catharsis",
    name: "Catharsis",
    kind: "exotic",
    slots: ["mask"],
    uniqueTalent: {
      name: "Vicious Cycle",
      description:
        "Prendre des dégâts construit un buff. Armure basse : burst de réparation et statut aux ennemis proches.",
    },
  },
  {
    id: "catalyst",
    name: "The Catalyst",
    kind: "exotic",
    slots: ["mask"],
    uniqueTalent: {
      name: "Chain Reaction",
      description:
        "Masque Brooklyn. Les dégâts de compétence et d'arme se renforcent mutuellement. Drop : Army Terminal / élites Charlie.",
    },
  },
  {
    id: "tinkerer",
    name: "Tinkerer",
    kind: "exotic",
    slots: ["mask"],
    uniqueTalent: {
      name: "Jury Rigged",
      description:
        "Autorise des combinaisons de compétences inhabituelles et booste les mods de compétence équipés.",
    },
  },
  {
    id: "investor",
    name: "Investor",
    kind: "exotic",
    slots: ["mask"],
    uniqueTalent: {
      name: "Slotted",
      description:
        "Bonus selon la couleur de chaque attribut non-cœur : rouge +10% CHD, jaune +5% efficacité de compétence, bleu +1% régén armure.",
    },
  },

  // ========== Exotiques — sacs ==========
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
    id: "harrier-pride",
    name: "Harrier Pride",
    kind: "exotic",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Close Air Support",
      description:
        "Sac Brooklyn. Les compétences déployées renforcent les dégâts d'arme à proximité, et inversement.",
    },
  },
  {
    id: "birdies-quick-fix",
    name: "Birdie's Quick Fix",
    kind: "exotic",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Field Medic",
      description:
        "Utiliser un kit ou une compétence de soin : burst de réparation pour le groupe et haste de compétence.",
    },
  },

  // ========== Exotiques — gilets ==========
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
    id: "iron-will",
    name: "Iron Will",
    kind: "exotic",
    slots: ["chest"],
    uniqueTalent: {
      name: "Resolved",
      description:
        "Le prochain tir au corps compte comme un headshot. CD 2 s (PvE) / 3 s (PvP). Fusil de précision, fusil ou pistolet requis.",
    },
  },
  {
    id: "collector",
    name: "Collector",
    kind: "exotic",
    slots: ["chest"],
    uniqueTalent: {
      name: "Hoarder",
      description:
        "Ramasser munitions ou kits : stacks de dégâts d'arme et d'armure. Les ennemis droppent plus de loot.",
    },
  },
  {
    id: "provocator",
    name: "Provocator",
    kind: "exotic",
    slots: ["chest"],
    uniqueTalent: {
      name: "Instigator",
      description:
        "Augmente la menace et convertit une partie des dégâts reçus en armure bonus pour le groupe.",
    },
  },

  // ========== Exotiques — gants ==========
  {
    id: "loaded-for-bear",
    name: "Loaded for Bear",
    kind: "exotic",
    slots: ["gloves"],
    uniqueTalent: {
      name: "Afterburn",
      description:
        "Les impacts appliquent des stacks (20 max par cible). Recharger consomme les stacks : +2% dégâts d'arme par stack.",
    },
  },
  {
    id: "btsu-datagloves",
    name: "BTSU Datagloves",
    kind: "exotic",
    slots: ["gloves"],
    extraStats: [{ stat: "skillHaste", value: 10 }],
    uniqueTalent: {
      name: "Transference",
      description:
        "Déployer une hive : overcharge pour vous et les alliés proches. Les kills de compétence réduisent le CD de la hive.",
    },
  },
  {
    id: "bloody-knuckles",
    name: "Bloody Knuckles",
    kind: "exotic",
    slots: ["gloves"],
    uniqueTalent: {
      name: "Bloodsport",
      description:
        "La mêlée applique un saignement. Dégâts d'arme bonus contre les cibles qui saignent.",
    },
  },
  {
    id: "shocker-punch",
    name: "Shocker Punch",
    kind: "exotic",
    slots: ["gloves"],
    extraStats: [{ stat: "statusEffects", value: 10 }],
    uniqueTalent: {
      name: "Discharge",
      description: "La mêlée applique un choc. Les ennemis choqués subissent plus de dégâts.",
    },
  },
  {
    id: "overdogs",
    name: "Overdogs",
    kind: "exotic",
    slots: ["gloves"],
    extraStats: [{ stat: "armorOnKill", value: 10 }],
    uniqueTalent: {
      name: "Top Dog",
      description:
        "Kills CQC : armure au kill et stacks de dégâts d'arme. Très utilisé en Striker / Heartbreaker.",
    },
  },

  // ========== Exotiques — holsters ==========
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
  {
    id: "centurions-scabbard",
    name: "Centurion's Scabbard",
    kind: "exotic",
    slots: ["holster"],
    uniqueTalent: {
      name: "Gladius",
      description:
        "Tuer avec le pistolet : armure bonus. Changer d'arme vers le pistolet : cadence et dégâts pistolet.",
    },
  },

  // ========== Exotiques — genouillères ==========
  {
    id: "nurses-kneepads",
    name: "Nurse's Kneepads",
    kind: "exotic",
    slots: ["kneepads"],
    extraStats: [{ stat: "hazardProtection", value: 10 }],
    uniqueTalent: {
      name: "First Aid Associate",
      description:
        "Vous et les alliés à 10 m : +40% protection contre les aléas. Socle des builds support / Toxic DZ.",
    },
  },
  {
    id: "acosta-kneepads",
    name: "Acosta's Kneepads",
    kind: "exotic",
    slots: ["kneepads"],
    uniqueTalent: {
      name: "Escape Plan",
      description:
        "Vault, rester immobile 5 s ou subir un statut : bonus de vitesse de déplacement (max 20%). −50% pénalité de mobilité des statuts.",
    },
  },
  {
    id: "blacklisters",
    name: "Blacklisters",
    kind: "exotic",
    slots: ["kneepads"],
    uniqueTalent: {
      name: "Ostracize",
      description:
        "Marque un ennemi : vous prenez 600% de dégâts amplifiés de lui, +20% dégâts amplifiés aux autres. Une marque à la fois.",
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
