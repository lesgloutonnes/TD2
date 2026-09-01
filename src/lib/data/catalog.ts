import type { CatalogItem } from "../types";
import { BRANDS } from "./brands";
import { GEAR_SETS, gearSetCore } from "./gear-sets";
import { lockedCoreFor } from "./core-lock";
import { talentByName } from "./talents";

/**
 * Named and exotic gear (Y8S3 live).
 * Organized brand by brand, then exotics by slot.
 * Base: community sheet (up to date as of March 22, 2026) + later Y8S2/Y8S3 pieces.
 * Named Perfect talent text is sourced from the live PvE talent library (`talents.ts`).
 * Meme seasonal items (Oh Carol, Sleigher, Bell Ringer, Festive Delivery…) intentionally omitted.
 */
export const NAMED_AND_EXOTICS: CatalogItem[] = [
  // --- Providence Defense ---
  {
    id: "the-gift",
    name: "The Gift",
    kind: "named",
    brandId: "providence",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Vigilance"),
    talentSlot: "backpack",
  },
  {
    id: "the-sacrifice",
    name: "The Sacrifice",
    kind: "named",
    brandId: "providence",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Glass Cannon"),
    talentSlot: "chest",
  },

  // --- Česká Výroba ---
  {
    id: "devils-due",
    name: "Devil's Due",
    kind: "named",
    brandId: "ceska",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Clutch"),
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
        "50% of weapon damage is dealt to another enemy within 30m. If there isn't one, normal damage applies. Does not apply to armor plates.",
    },
    note: "Česká kneepads (April Fools event, later added to the loot pool). Bewildered talent.",
  },

  // --- Grupo Sombra ---
  {
    id: "door-kickers-knock",
    name: "Door-Kicker's Knock",
    kind: "named",
    brandId: "grupo",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Spark"),
    talentSlot: "chest",
  },

  // --- Walker, Harris & Co ---
  {
    id: "chainkiller",
    name: "Chainkiller",
    kind: "named",
    brandId: "walker",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Headhunter"),
    talentSlot: "chest",
  },
  {
    id: "matador",
    name: "Matador",
    kind: "named",
    brandId: "walker",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Adrenaline Rush"),
    talentSlot: "backpack",
  },

  // --- Fenris Group ---
  {
    id: "ferocious-calm",
    name: "Ferocious Calm",
    kind: "named",
    brandId: "fenris",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Overwatch"),
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
    note: "Petrov gloves with +8% Damage to Armor (above the 6% cap).",
  },
  {
    id: "vedmedytsya",
    name: "Vedmedytsya Vest",
    kind: "named",
    brandId: "petrov",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Braced"),
    talentSlot: "chest",
    note: "Gunner specialization research.",
  },

  // --- Overlord Armaments ---
  {
    id: "foxs-prayer",
    name: "Fox's Prayer",
    kind: "named",
    brandId: "overlord",
    slots: ["kneepads"],
    extraStats: [{ stat: "damageToHealth", value: 8 }],
    note: "Overlord kneepads with +8% Damage to Health (above the 6% cap).",
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
    note: "Sokolov gloves: +10% extra Status Effects + blue core.",
  },

  // --- Airaldi Holdings ---
  {
    id: "pristine-example",
    name: "Pristine Example",
    kind: "named",
    brandId: "airaldi",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Focus"),
    talentSlot: "chest",
  },
  {
    id: "melon-baller",
    name: "Melon Baller",
    kind: "named",
    brandId: "airaldi",
    slots: ["backpack"],
    extraCores: ["blue"],
    uniqueTalent: talentByName("Perfect Concussion"),
    talentSlot: "backpack",
  },

  // --- Badger Tuff ---
  {
    id: "zero-fs",
    name: "Zero F's Given",
    kind: "named",
    brandId: "badger",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Unbreakable"),
    talentSlot: "chest",
  },
  {
    id: "ammo-dump",
    name: "Ammo Dump",
    kind: "named",
    brandId: "badger",
    slots: ["holster"],
    extraStats: [{ stat: "ammoCapacity", value: 10 }],
    note: "Badger holster (Firewall specialization research): +10% ammo capacity.",
  },

  // --- Douglas & Harding ---
  {
    id: "punch-drunk",
    name: "Punch Drunk",
    kind: "named",
    brandId: "douglas",
    slots: ["mask"],
    extraStats: [{ stat: "hsd", value: 20 }],
    note: "Douglas mask: +20% extra Headshot Damage (single roll). Brand core: red.",
  },

  // --- Gila Guard ---
  {
    id: "pointman",
    name: "Pointman",
    kind: "named",
    brandId: "gila",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Vanguard"),
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
    note: "Gila mask: 100% Scanner Pulse Haste (approximated as Skill Haste) + yellow core.",
  },
  {
    id: "chill-out",
    name: "Chill Out",
    kind: "named",
    brandId: "gila",
    slots: ["mask"],
    lockedCore: "blue",
    coreLocked: false,
    attributeSlots: 1,
    modSlots: 2,
    note: "Gila seasonal mask: native blue Armor core (recalibratable), one random secondary attribute (not locked), 2 gear mod slots.",
  },

  // --- Belstone Armory ---
  {
    id: "everyday-carrier",
    name: "Everyday Carrier",
    kind: "named",
    brandId: "belstone",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Efficient"),
    talentSlot: "chest",
  },
  {
    id: "liquid-engineer",
    name: "Liquid Engineer",
    kind: "named",
    brandId: "belstone",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Bloodsucker"),
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
    note: "5.11 gloves: brand blue (Armor) core + bonus red (Weapon Damage) core +10% Armor on Kill.",
  },
  {
    id: "keeper",
    name: "Keeper",
    kind: "named",
    brandId: "511",
    slots: ["backpack"],
    extraCores: ["yellow"],
    uniqueTalent: talentByName("Perfect Protector"),
    talentSlot: "backpack",
  },

  // --- Golan Gear ---
  {
    id: "hunter-killer",
    name: "Hunter Killer",
    kind: "named",
    brandId: "golan",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Intimidate"),
    talentSlot: "chest",
  },
  {
    id: "anarchists-cookbook",
    name: "Anarchist's Cookbook",
    kind: "named",
    brandId: "golan",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Wicked"),
    talentSlot: "backpack",
  },

  // --- Empress International ---
  {
    id: "caesars-guard",
    name: "Caesar's Guard",
    kind: "named",
    brandId: "empress",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Skilled"),
    talentSlot: "chest",
  },
  {
    id: "battery-pack",
    name: "Battery Pack",
    kind: "named",
    brandId: "empress",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Calculated"),
    talentSlot: "backpack",
  },

  // --- Wyvern Wear ---
  {
    id: "claws-out",
    name: "Claws Out",
    kind: "named",
    brandId: "wyvern",
    slots: ["holster"],
    lockedCore: "red",
    extraStats: [{ stat: "pistolDamage", value: 10 }],
    note: "Wyvern holster: +10% pistol damage (locked special). Native red core (recalibratable; brand is yellow).",
  },
  {
    id: "impetus",
    name: "Impetus",
    kind: "named",
    brandId: "wyvern",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Kinetic Momentum"),
    talentSlot: "chest",
  },

  // --- Alps Summit ---
  {
    id: "percussive-maintenance",
    name: "Percussive Maintenance",
    kind: "named",
    brandId: "alps",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Tech Support"),
    talentSlot: "backpack",
  },
  {
    id: "motherly-love",
    name: "Motherly Love",
    kind: "named",
    brandId: "alps",
    slots: ["gloves"],
    extraStats: [{ stat: "skillHealth", value: 20 }],
    note: "Alps gloves (Technician specialization research): +20% extra skill health. Brand core: yellow.",
  },

  // --- China Light Industries ---
  {
    id: "strategic-alignment",
    name: "Strategic Alignment",
    kind: "named",
    brandId: "china-light",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Shock and Awe"),
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
    note: "Brazos holster: brand yellow core + bonus red core.",
  },
  {
    id: "hermano",
    name: "Hermano",
    kind: "named",
    brandId: "brazos",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Overclock"),
    talentSlot: "backpack",
  },

  // --- Hana-U Corporation ---
  {
    id: "force-multiplier",
    name: "Force Multiplier",
    kind: "named",
    brandId: "hana-u",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Combined Arms"),
    talentSlot: "backpack",
  },

  // --- Murakami Industries ---
  {
    id: "emperors-guard",
    name: "Emperor's Guard",
    kind: "named",
    brandId: "murakami",
    slots: ["kneepads"],
    extraStats: [{ stat: "armorRegenPercent", value: 1 }],
    note: "Murakami kneepads: +1% extra armor regen. Brand core: yellow.",
  },

  // --- Richter & Kaiser ---
  {
    id: "rushdown",
    name: "Rushdown",
    kind: "named",
    brandId: "richter",
    slots: ["chest"],
    extraCores: ["red"],
    uniqueTalent: talentByName("Tag Team"),
    talentSlot: "chest",
  },
  {
    id: "forge",
    name: "Forge",
    kind: "named",
    brandId: "richter",
    slots: ["holster"],
    extraStats: [{ stat: "skillHealth", value: 20 }],
    note: "Richter holster: +50% shield health (approximated as skill health). Brand core: yellow.",
  },

  // --- Electrique ---
  {
    id: "henri",
    name: "Henri",
    kind: "named",
    brandId: "electrique",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Companion"),
    talentSlot: "chest",
  },
  {
    id: "lavoisier",
    name: "Lavoisier",
    kind: "named",
    brandId: "electrique",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Galvanize"),
    talentSlot: "backpack",
  },

  // --- Habsburg Guard ---
  {
    id: "cherished",
    name: "Cherished",
    kind: "named",
    brandId: "habsburg",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Trauma"),
    talentSlot: "chest",
  },
  {
    id: "the-courier",
    name: "The Courier",
    kind: "named",
    brandId: "habsburg",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Creeping Death"),
    talentSlot: "backpack",
  },

  // --- Lengmo ---
  {
    id: "backbone",
    name: "Backbone",
    kind: "named",
    brandId: "lengmo",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfectly Unstoppable Force"),
    talentSlot: "backpack",
  },
  {
    id: "carpenter",
    name: "Carpenter",
    kind: "named",
    brandId: "lengmo",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfectly Mad Bomber"),
    talentSlot: "chest",
  },

  // --- Legatus ---
  {
    id: "vigil",
    name: "Vigil",
    kind: "named",
    brandId: "legatus",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Versatile"),
    talentSlot: "backpack",
  },
  {
    id: "visionario",
    name: "Visionario",
    kind: "named",
    brandId: "legatus",
    slots: ["mask"],
    extraStats: [{ stat: "optimalRange", value: 50 }],
    note: "Legatus mask: +50% extra optimal range.",
  },

  // --- Imminence Armaments ---
  {
    id: "trick-shot",
    name: "Trick Shot",
    kind: "named",
    brandId: "imminence",
    slots: ["chest"],
    extraCores: ["blue"],
    uniqueTalent: talentByName("Perfect Reassigned"),
    talentSlot: "chest",
  },
  {
    id: "capn",
    name: "Cap'n",
    kind: "named",
    brandId: "imminence",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Leadership"),
    talentSlot: "backpack",
  },
  {
    id: "cloak",
    name: "Cloak",
    kind: "named",
    brandId: "imminence",
    slots: ["kneepads"],
    extraStats: [{ stat: "threat", value: -50 }],
    note: "Imminence kneepads: −50% extra threat.",
  },

  // --- Urban Lookout ---
  {
    id: "sleight",
    name: "Sleight",
    kind: "named",
    brandId: "urban-lookout",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Protected Reload"),
    talentSlot: "chest",
  },
  {
    id: "spot-on",
    name: "Spot-On",
    kind: "named",
    brandId: "urban-lookout",
    slots: ["holster"],
    extraStats: [{ stat: "accuracy", value: 38 }],
    note: "Urban Lookout holster: +38% extra accuracy (single roll).",
  },

  // --- Unit Alloys ---
  {
    id: "equalizer",
    name: "Equalizer",
    kind: "named",
    brandId: "unit-alloys",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Obliterate"),
    talentSlot: "chest",
  },
  {
    id: "salvo",
    name: "Salvo",
    kind: "named",
    brandId: "unit-alloys",
    slots: ["holster"],
    extraStats: [{ stat: "rateOfFire", value: 5 }],
    note: "Unit Alloys holster: +5% extra rate of fire. Brand core: red.",
  },

  // --- Royal Works ---
  {
    id: "robin",
    name: "Robin",
    kind: "named",
    brandId: "royal-works",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Gunslinger"),
    talentSlot: "chest",
  },
  {
    id: "bulldog",
    name: "Bulldog",
    kind: "named",
    brandId: "royal-works",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Composure"),
    talentSlot: "backpack",
  },

  // --- Edelweiss GPz ---
  {
    id: "benefactor",
    name: "Benefactor",
    kind: "named",
    brandId: "edelweiss",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Empathic Resolve"),
    talentSlot: "chest",
  },
  {
    id: "momma-badger",
    name: "Momma Badger",
    kind: "named",
    brandId: "edelweiss",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Safeguard"),
    talentSlot: "backpack",
  },

  // --- Uzina Getica ---
  {
    id: "the-setup",
    name: "The Setup",
    kind: "named",
    brandId: "uzina",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfectly Opportunistic"),
    talentSlot: "backpack",
  },
  {
    id: "closer",
    name: "Closer",
    kind: "named",
    brandId: "uzina",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Spotter"),
    talentSlot: "chest",
  },

  // --- Palisade Steelworks ---
  {
    id: "proxy",
    name: "Proxy",
    kind: "named",
    brandId: "palisade",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfectly Tamper Proof"),
    talentSlot: "backpack",
  },
  {
    id: "combustor",
    name: "Combustor",
    kind: "named",
    brandId: "palisade",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfectly Explosive Delivery"),
    talentSlot: "chest",
  },

  // --- Zwiadowka ---
  {
    id: "bober",
    name: "Bober",
    kind: "named",
    brandId: "zwiadowka",
    slots: ["chest"],
    uniqueTalent: talentByName("Perfect Entrench"),
    talentSlot: "chest",
  },
  {
    id: "eagles-grasp",
    name: "Eagles Grasp",
    kind: "named",
    brandId: "zwiadowka",
    slots: ["gloves"],
    extraStats: [{ stat: "weaponHandling", value: 15 }],
    note: "Zwiadowka gloves: +15% extra weapon handling (single roll).",
  },

  // --- Shiny Monkey Gear ---
  {
    id: "axel",
    name: "Axel",
    kind: "named",
    brandId: "shiny-monkey",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Energize"),
    talentSlot: "backpack",
  },
  {
    id: "grease",
    name: "Grease",
    kind: "named",
    brandId: "shiny-monkey",
    slots: ["kneepads"],
    extraStats: [{ stat: "statusEffects", value: 16 }],
    note: "Shiny Monkey kneepads: +16% extra Status Effects. Brand core: yellow.",
  },

  // --- Yaahl Gear ---
  {
    id: "the-hollow-man",
    name: "The Hollow Man",
    kind: "named",
    brandId: "yaahl",
    slots: ["mask"],
    extraStats: [{ stat: "damageToHealth", value: 14 }],
    note: "Yaahl mask: +14% extra Damage to Health. Brand core: blue.",
  },

  // ========== Exotics — masks ==========
  {
    id: "coyotes-mask",
    name: "Coyote's Mask",
    kind: "exotic",
    lockedCore: "red",
    slots: ["mask"],
    uniqueTalent: {
      name: "Pack Instincts",
      description:
        "Depending on distance: Critical Hit Damage (close), Critical Hit Chance (mid), or Headshot Damage (far). Builder average: +8% Critical Hit Chance and +8% Critical Hit Damage.",
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
    lockedCore: "yellow",
    slots: ["mask"],
    uniqueTalent: {
      name: "Toxic Delivery",
      description:
        "Applying a status effect or dealing skill damage applies a DoT. Its strength scales with Status Effects and Skill Damage.",
    },
  },
  {
    id: "catharsis",
    name: "Catharsis",
    kind: "exotic",
    lockedCore: "blue",
    slots: ["mask"],
    uniqueTalent: {
      name: "Vicious Cycle",
      description:
        "Taking damage builds a buff. At low armor: a burst of repair and applies a status effect to nearby enemies.",
    },
  },
  {
    id: "catalyst",
    name: "The Catalyst",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["mask"],
    uniqueTalent: {
      name: "Chain Reaction",
      description:
        "Brooklyn mask. Skill damage and weapon damage boost each other. Drops from: Army Terminal / Charlie elites.",
    },
  },
  {
    id: "tinkerer",
    name: "Tinkerer",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["mask"],
    uniqueTalent: {
      name: "Jury Rigged",
      description:
        "Allows unusual skill combinations and boosts equipped skill mods.",
    },
  },
  {
    id: "investor",
    name: "Investor",
    kind: "exotic",
    lockedCore: "red",
    coreLocked: false,
    slots: ["mask"],
    uniqueTalent: {
      name: "Slotted",
      description:
        "Bonus based on the color of each non-core attribute: red +10% Critical Hit Damage, yellow +5% skill efficiency, blue +1% armor regen.",
    },
    note: "Core can roll red / blue / yellow on each drop (not locked). Third attribute replaces the gear mod slot.",
  },

  // ========== Exotics — backpacks ==========
  {
    id: "memento",
    name: "Memento",
    kind: "exotic",
    lockedCore: "red",
    coreLocked: true,
    slots: ["backpack"],
    extraCores: ["blue", "yellow"],
    uniqueTalent: {
      name: "Kill Confirmed",
      description:
        "Picking up a trophy: stacks of Weapon Damage, armor, and skill damage. 3 cores. Excellent hybrid piece.",
    },
    assumed: [
      { stat: "weaponDamage", value: 15 },
      { stat: "armorPercent", value: 10 },
      { stat: "skillDamage", value: 15 },
    ],
    assumedNote: "Assumes mid Kill Confirmed trophy stacks in combat.",
    note: "Fixed 3-core package (red + blue + yellow) — not recalibratable.",
  },
  {
    id: "ninjabike",
    name: "NinjaBike Messenger Bag",
    kind: "exotic",
    lockedCore: "red",
    slots: ["backpack"],
    ninja: true,
    uniqueTalent: {
      name: "Resourceful",
      description:
        "Counts as +1 piece for every brand and set already equipped. Allows activating multiple 2pc / 3pc / 4pc bonuses.",
    },
  },
  {
    id: "acosta-go-bag",
    name: "Acosta's Go-Bag",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["backpack"],
    uniqueTalent: {
      name: "One Step Ahead",
      description: "Bonus grenades and kits. Using a grenade: damage/armor buff.",
    },
  },
  {
    id: "harrier-pride",
    name: "Harrier Pride",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Close Air Support",
      description:
        "Brooklyn backpack. Deployed skills boost nearby weapon damage, and vice versa.",
    },
  },
  {
    id: "birdies-quick-fix",
    name: "Birdie's Quick Fix",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Field Medic",
      description:
        "Using a kit or a healing skill: a burst of repair for the group and Skill Haste.",
    },
  },

  // ========== Exotics — chest pieces ==========
  {
    id: "ridgeways-pride",
    name: "Ridgeway's Pride",
    kind: "exotic",
    lockedCore: "red",
    slots: ["chest"],
    uniqueTalent: {
      name: "Bleeding Heart",
      description: "Weapon damage applies bleed. Heals based on bleeding targets.",
    },
  },
  {
    id: "tardigrade",
    name: "Tardigrade Armor System",
    kind: "exotic",
    lockedCore: "blue",
    slots: ["chest"],
    uniqueTalent: {
      name: "Ablative Nanoplating",
      description: "When armor breaks: deploys an armor hive for you and nearby allies.",
    },
  },
  {
    id: "iron-will",
    name: "Iron Will",
    kind: "exotic",
    lockedCore: "red",
    slots: ["chest"],
    uniqueTalent: {
      name: "Resolved",
      description:
        "The next body shot counts as a headshot. Cooldown 2s (PvE) / 3s (PvP). Requires a sniper rifle, rifle, or pistol.",
    },
  },
  {
    id: "collector",
    name: "Collector",
    kind: "exotic",
    lockedCore: "red",
    slots: ["chest"],
    uniqueTalent: {
      name: "Hoarder",
      description:
        "Picking up ammo or kits: stacks of weapon damage and armor. Enemies drop more loot.",
    },
  },
  {
    id: "provocator",
    name: "Provocator",
    kind: "exotic",
    lockedCore: "blue",
    slots: ["chest"],
    uniqueTalent: {
      name: "Instigator",
      description:
        "Increases threat and converts a portion of damage taken into bonus armor for the group.",
    },
  },

  // ========== Exotics — gloves ==========
  {
    id: "loaded-for-bear",
    name: "Loaded for Bear",
    kind: "exotic",
    lockedCore: "red",
    slots: ["gloves"],
    uniqueTalent: {
      name: "Afterburn",
      description:
        "Weapon hits apply stacks (20 max per target). Reloading consumes the stacks: +2% weapon damage per stack.",
    },
  },
  {
    id: "btsu-datagloves",
    name: "BTSU Datagloves",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["gloves"],
    extraStats: [{ stat: "skillHaste", value: 10 }],
    uniqueTalent: {
      name: "Transference",
      description:
        "Deploying a hive: overcharge for you and nearby allies. Skill kills reduce the hive's cooldown.",
    },
  },
  {
    id: "bloody-knuckles",
    name: "Bloody Knuckles",
    kind: "exotic",
    lockedCore: "red",
    slots: ["gloves"],
    uniqueTalent: {
      name: "Bloodsport",
      description:
        "Melee attacks apply bleed. Bonus weapon damage against bleeding targets.",
    },
  },
  {
    id: "shocker-punch",
    name: "Shocker Punch",
    kind: "exotic",
    lockedCore: "blue",
    slots: ["gloves"],
    extraStats: [{ stat: "statusEffects", value: 10 }],
    uniqueTalent: {
      name: "Discharge",
      description: "Melee attacks apply shock. Shocked enemies take more damage.",
    },
  },
  {
    id: "overdogs",
    name: "Overdogs",
    kind: "exotic",
    lockedCore: "red",
    slots: ["gloves"],
    extraStats: [{ stat: "armorOnKill", value: 10 }],
    uniqueTalent: {
      name: "Top Dog",
      description:
        "CQC kills: armor on kill and stacks of weapon damage. Widely used with Striker / Heartbreaker.",
    },
  },

  // ========== Exotics — holsters ==========
  {
    id: "waveform",
    name: "Waveform",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["holster"],
    uniqueTalent: {
      name: "Capacitance",
      description: "Skill damage builds a weapon damage bonus, and vice versa.",
    },
  },
  {
    id: "imperial-dynasty",
    name: "Imperial Dynasty",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["holster"],
    uniqueTalent: {
      name: "Dragon's Negation",
      description: "Nearby enemies: burn. CQC crowd control.",
    },
  },
  {
    id: "dodge-city",
    name: "Dodge City Gunslinger's Holster",
    kind: "exotic",
    lockedCore: "red",
    slots: ["holster"],
    uniqueTalent: {
      name: "Quick Draw",
      description: "Swapping to the pistol: massive pistol headshot damage. Regulus / Liberty.",
    },
  },
  {
    id: "centurions-scabbard",
    name: "Centurion's Scabbard",
    kind: "exotic",
    lockedCore: "red",
    slots: ["holster"],
    uniqueTalent: {
      name: "Gladius",
      description:
        "Killing with the pistol: bonus armor. Swapping to the pistol: rate of fire and pistol damage.",
    },
  },

  // ========== Exotics — kneepads ==========
  {
    id: "sawyers-kneepads",
    name: "Sawyer's Kneepads",
    kind: "exotic",
    lockedCore: "blue",
    slots: ["kneepads"],
    uniqueTalent: {
      name: "Stand Your Ground",
      description:
        "Cannot be staggered by explosions. Gain a stack every second you are not moving, each granting +3% total weapon damage (10 stacks max). Stop gaining stacks when moving; all stacks are lost 10s after moving.",
    },
    note: "Exotic kneepads (Odessa Sawyer) — not a Gila Guard named piece. Armor core is locked.",
  },
  {
    id: "nurses-kneepads",
    name: "Nurse's Kneepads",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["kneepads"],
    extraStats: [{ stat: "hazardProtection", value: 10 }],
    uniqueTalent: {
      name: "First Aid Associate",
      description:
        "You and allies within 10m: +40% hazard protection. Core piece for support / Toxic DZ builds.",
    },
  },
  {
    id: "acosta-kneepads",
    name: "Acosta's Kneepads",
    kind: "exotic",
    lockedCore: "blue",
    slots: ["kneepads"],
    uniqueTalent: {
      name: "Escape Plan",
      description:
        "Vaulting, staying still for 5s, or being affected by a status effect: movement speed bonus (max 20%). −50% status effect mobility penalty.",
    },
  },
  {
    id: "blacklisters",
    name: "Blacklisters",
    kind: "exotic",
    lockedCore: "red",
    slots: ["kneepads"],
    uniqueTalent: {
      name: "Ostracize",
      description:
        "Marks an enemy: you take 600% amplified damage from them, and deal +20% amplified damage to others. One mark at a time.",
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
      // Native brand core is a default only — HE brand cores are recalibratable in-game.
    }),
  ),
  ...GEAR_SETS.map(
    (set): CatalogItem => ({
      id: `set:${set.id}`,
      name: set.name,
      kind: "gear-set",
      gearSetId: set.id,
      slots: "all",
      // Native set core is a default only — gear-set cores are recalibratable in the planner.
    }),
  ),
  ...NAMED_AND_EXOTICS,
];

export function catalogById(id: string): CatalogItem | undefined {
  return CATALOG.find((item) => item.id === id);
}

export function catalogForSlot(slot: import("../types").Slot): CatalogItem[] {
  return CATALOG.filter((item) => item.slots === "all" || item.slots.includes(slot)).map(
    (item) => {
      // Resolve slot-native core for gear sets (default only — not a lock).
      let resolved = item;
      if ((item.kind === "gear-set" || item.gearSetId) && item.gearSetId) {
        const set = GEAR_SETS.find((entry) => entry.id === item.gearSetId);
        if (set) {
          resolved = { ...item, lockedCore: gearSetCore(set, slot) };
        }
      }
      const locked = lockedCoreFor(slot, resolved);
      if (locked) return { ...resolved, lockedCore: locked };
      // Unlocked pieces: do not surface lockedCore in the picker (native stays via createPiece).
      if (resolved.lockedCore != null || resolved.coreLocked != null) {
        const { lockedCore: _core, coreLocked: _flag, ...rest } = resolved;
        return rest;
      }
      return resolved;
    },
  );
}
