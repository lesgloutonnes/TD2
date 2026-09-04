import type { CatalogItem } from "../types";
import { BRANDS } from "./brands";
import { GEAR_SETS, gearSetCore } from "./gear-sets";
import { lockedCoreFor, packageExtraCores } from "./core-lock";
import { talentByName } from "./talents";

/**
 * Named and exotic gear (Y8S3 live).
 * Organized brand by brand, then exotics by slot.
 * Base: community sheet (up to date as of March 22, 2026) + later Y8S2/Y8S3 pieces.
 * Named Perfect talent text is sourced from the live PvE talent library (`talents.ts`).
 * Exotic uniqueTalent text is in-game PvE wording (Ubisoft PvE talent tables).
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
    uniqueTalent: {
      name: "Bewildered",
      description:
        "50% of weapon damage is dealt to another enemy within 30m. If there isn't one, normal damage applies. Does not apply to armor plates.",
    },
    note: "Česká kneepads (April Fools event, later added to the loot pool). Bewildered talent only — no extra CHD core/stat.",
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
    extraStats: [{ stat: "statusEffects", value: 16 }],
    note: "Sokolov gloves: +16% extra Status Effects (named attribute, not an extra core). Brand core: red, recalibratable.",
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
    uniqueTalent: talentByName("Perfect Concussion"),
    talentSlot: "backpack",
    note: "Airaldi backpack (Y8S3). Perfect Concussion only — no extra core.",
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
    extraStats: [{ stat: "scannerPulseHaste", value: 100 }],
    note: "Gila mask: +100% Scanner Pulse Haste (pulse only, not global Skill Haste). Brand core: blue, recalibratable. No extra yellow core.",
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
    note: "5.11 gloves: +10% Armor on Kill (named extra). Brand core: blue, recalibratable. No extra red core.",
  },
  {
    id: "keeper",
    name: "Keeper",
    kind: "named",
    brandId: "511",
    slots: ["backpack"],
    uniqueTalent: talentByName("Perfect Protector"),
    talentSlot: "backpack",
    note: "5.11 backpack (Y8S3). Perfect Protector only — no extra core.",
  },

  // --- Golan Gear ---
  {
    id: "hunter-killer",
    name: "Hunter-Killer",
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
    extraStats: [{ stat: "pistolDamage", value: 11 }, { stat: "meleeDamage", value: 500 }],
    note: "Wyvern holster: +11% pistol damage and +500% melee (named extras). Native red core (recalibratable; brand is yellow).",
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
    extraStats: [{ stat: "skillHealth", value: 25 }],
    note: "Alps gloves (Technician specialization research): +25% extra skill health. Brand core: yellow.",
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
    note: "Brazos holster: brand yellow core + bonus red Weapon Damage core (15%). Primary is recalibratable; the extra red stays (can be double red).",
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
    uniqueTalent: {
      name: "Tag Team",
      description:
        "The last enemy you have damaged with a skill is marked. Dealing weapon damage to that enemy consumes the mark to reduce active skill cooldowns by 12s. Cooldown: 4s.",
    },
    talentSlot: "chest",
    note: "Richter chest (Y8S3). Named Tag Team is 12s (HE chest Tag Team remains 6s). No extra core.",
  },
  {
    id: "forge",
    name: "Forge",
    kind: "named",
    brandId: "richter",
    slots: ["holster"],
    extraStats: [{ stat: "shieldHealth", value: 50 }],
    note: "Richter holster: +50% Shield Health (named extra, not a core). Brand core: yellow, recalibratable.",
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
    uniqueTalent: talentByName("Perfect Reassigned"),
    talentSlot: "chest",
    note: "Imminence chest (Y8S3). Perfect Reassigned only — no extra core.",
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
    name: "Eagle's Grasp",
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
    extraStats: [{ stat: "damageToHealth", value: 10 }],
    note: "Yaahl mask: +10% extra Damage to Health (unique named roll, TU9). Brand core: blue.",
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
        "You and all group members gain a damage buff based on the distance of the last enemy you hit. 0-15m: +25% Critical Hit Damage. 15-25m: +10% Critical Hit Chance and +10% Critical Hit Damage. 25m+: +25% Critical Hit Chance. A group member can receive all 3 damage buffs at the same time. However, a group member can only have 1 of each damage buff at a time.",
    },
    assumed: [{ stat: "chd", value: 25 }],
    assumedNote: "Max Pack Instincts at close range (+25% Critical Hit Damage).",
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
        "Status effects also apply a damage over time debuff for 10s. Total damage dealt is equal to 50% of your concussion grenade damage and is increased by your status effect attributes.",
    },
    assumed: [{ stat: "statusEffects", value: 10 }, { stat: "skillDamage", value: 8 }],
    assumedNote: "Toxic Delivery DoT averaged as Status Effects + Skill Damage while applying statuses.",
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
        "Taking damage builds stacks to a cap of 30. Each stack grants 1.5% Weapon Damage. Taking damage at max stacks triggers a purge, removing all stacks and Status Effects and then dropping a healing cloud which restores 5% of Max Armor for 10s to all allies in the cloud.",
    },
    assumed: [{ stat: "incomingRepairs", value: 10 }, { stat: "armorOnKill", value: 8 }],
    assumedNote: "Vicious Cycle repair burst averaged as Incoming Repairs + Armor on Kill.",
  },
  {
    id: "catalyst",
    name: "The Catalyst",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["mask"],
    uniqueTalent: {
      name: "Chemical Agent",
      description:
        "Dealing and receiving status effects (Burn, Bleed, Shock, EMP/Disrupt, Poison, and Blind/Disorient) builds stacks of Catalysis to a maximum of 12. Each stack grants +2% Weapon Damage and +2% Status Effects. For each enemy within 15 meters that is affected by a status effect grants 1 stack/sec. Receiving Status Effects grants 2 stacks/sec. Stacks decay at 1 stack/sec after 5 seconds if no enemies or you are affected by status effects. At max stacks, killing a status-affected enemy grants +25% bonus armor and +20% reload speed for 5s. While burning, you can maintain ADS without disruption.",
    },
    assumed: [{ stat: "weaponDamage", value: 10 }, { stat: "skillDamage", value: 10 }],
    assumedNote: "Chain Reaction mid-fight weapon/skill loop.",
  },
  {
    id: "tinkerer",
    name: "Tinkerer",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["mask"],
    uniqueTalent: {
      name: "Abridged",
      description:
        "If your Primary and Secondary weapon are not Exotic or Named and of the same type, the Secondary Weapon's talent will also be applied to the Primary Weapon. (Doesn't apply to talents that include Weapon Swapping.)",
    },
    assumed: [{ stat: "skillEfficiency", value: 10 }, { stat: "skillHaste", value: 8 }],
    assumedNote: "Jury Rigged unusual combos modeled as Skill Efficiency + Haste.",
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
        "Receive bonuses for each non-Core Attribute on this item, depending on their color: Red: +10% Critical Hit Damage. Yellow: +5% Skill Efficiency. Blue: +1% Armor Regen. This item can feature any Core Attribute. This item features a third random Attribute instead of having a Gear Mod Slot. This item cannot feature Headshot Damage, Health or Skill Repair.",
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
        "Enemies you kill drop a trophy on death. Collecting trophies provides both a short and long term buff. The first of which scales with the number of core attributes equipped and lasts 10s. Red Core: +5% Weapon Damage. Blue Core: +10% Bonus Armor. Yellow Core: +5% Skill Efficiency. For every trophy collected gain an additional +1% Weapon Damage, +1% Skill Efficiency and +0.1% Armor Regeneration for 300s. Maximum 30 stacks.",
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
    coreLocked: true,
    slots: ["backpack"],
    extraCores: ["blue", "yellow"],
    ninja: true,
    uniqueTalent: {
      name: "Resourceful",
      description:
        "Slots in with any equipped Gear Set and/or Brand Set item to fulfill a requirement towards unlocking a Gear and/or Brand Sets bonus. Allows to unlock bonuses from multiple sets simultaneously.",
    },
    note: "Fixed 3-core package (red + blue + yellow) — not recalibratable.",
  },
  {
    id: "acosta-go-bag",
    name: "Acosta's Go-Bag",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["backpack"],
    uniqueTalent: {
      name: "One in the Hand",
      description:
        "Throwing a grenade refunds it and grants +1 Skill Tier for 15s. Grants Overcharge if already at Skill Tier 6. Cooldown: 60s. Two in the Bag: +1 Armor Kit Capacity, +3 Grenade Capacity, +25% Ammo Capacity, +10% Repair Skills, +10% Status Effects.",
    },
    assumed: [{ stat: "explosiveDamage", value: 15 }, { stat: "armorPercent", value: 5 }],
    assumedNote: "Grenade/kit window averaged as Explosive Damage + bonus armor.",
  },
  {
    id: "harrier-pride",
    name: "Harrier Pride",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Rebalance",
      description:
        "Getting kills and hitting enemies 3 times builds Red stacks. Each stack provides 0.5% Weapon Damage. Getting hit 3 times builds Blue stacks. Each stack provides 0.5% Damage Resistance. Upon reaching 80 stacks in total, lose all stacks and receive a separate bonus of 0.5% Damage Resistance per Red stack and 0.5% Weapon Damage per Blue stack until the next time the stack cap is reached.",
    },
    assumed: [{ stat: "weaponDamage", value: 8 }, { stat: "skillDamage", value: 8 }],
    assumedNote: "Close Air Support near a deployed skill.",
  },
  {
    id: "birdies-quick-fix",
    name: "Birdie's Quick Fix",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Combat Medic",
      description:
        "+90% Revive Speed. -50% Weakened debuff time. +45% Hive Efficiency. Provides 50% Damage Resistance to both agents while reviving or being revived, and for 5s after a successful Hive Revive, or 10s after a Manual Revive. Any successful revives provide +1 Skill Tier for 30s. Revives at Skill Tier 6 grant Overcharge for 15s.",
    },
    assumed: [{ stat: "skillHaste", value: 10 }, { stat: "skillRepair", value: 15 }],
    assumedNote: "Field Medic kit/heal window averaged.",
  },

  // ========== Exotics — chest pieces ==========
  {
    id: "ridgeways-pride",
    name: "Ridgeway's Pride",
    kind: "exotic",
    lockedCore: "red",
    slots: ["chest"],
    uniqueTalent: {
      name: "Bleeding Edge",
      description:
        "Shooting enemies within 15m applies bleed to the target. Repair 3-48% of your armor per second for every enemy that is bleeding within 15m. Repair strength per number of bleeding enemies: 1: 3%, 2: 6%, 3: 12%, 4: 24%, 5: 48%.",
    },
    assumed: [{ stat: "weaponDamage", value: 8 }, { stat: "incomingRepairs", value: 10 }],
    assumedNote: "Bleeding Heart mid-uptime vs bleeding targets.",
  },
  {
    id: "tardigrade",
    name: "Tardigrade Armor System",
    kind: "exotic",
    lockedCore: "blue",
    slots: ["chest"],
    uniqueTalent: {
      name: "Ablative Nano-Plating",
      description:
        "Whenever you or any ally's armor breaks, they gain 80% of your armor as bonus armor for 10s. Cooldown per ally: 45s. Killing an enemy with your specialization weapon removes this cooldown for all allies.",
    },
    assumed: [{ stat: "armorPercent", value: 10 }],
    assumedNote: "Ablative hive window averaged as +10% Total Armor.",
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
        "Your next body shot will be considered a headshot. Cooldown: 2s (PvE) / 3s (PvP). Requires a Marksman Rifle, Rifle, or Pistol.",
    },
    assumed: [{ stat: "hsd", value: 12 }],
    assumedNote: "Resolved body-to-headshot modeled as extra Headshot Damage on MMR/rifle/pistol.",
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
        "+3 Grenade Capacity. +50% Grenade Radius. +35% Grenade Damage. +25% Grenade Damage for each extra enemy caught in the blast. Automatically regenerate grenades every 30s, if you have less than 2 grenades in your inventory.",
    },
    assumed: [{ stat: "explosiveDamage", value: 25 }],
    assumedNote: "Hoarder grenade package averaged as Explosive Damage.",
    note: "Exotic chest. Weapon Damage core is locked. Talent is grenade-focused (not extra cores).",
  },
  {
    id: "provocator",
    name: "Provocator",
    kind: "exotic",
    lockedCore: "blue",
    slots: ["chest"],
    uniqueTalent: {
      name: "Challenger",
      description:
        "Receive +25% Damage Resistance from enemies within 20m.",
    },
    assumed: [{ stat: "armorPercent", value: 8 }, { stat: "threat", value: 10 }],
    assumedNote: "Instigator group bonus armor + threat averaged.",
  },
  {
    id: "beacon",
    name: "Beacon",
    kind: "exotic",
    lockedCore: "red",
    slots: ["chest"],
    uniqueTalent: {
      name: "Bond",
      description:
        "Both you and Allies receive +30% Critical Hit Damage, +15% Skill Efficiency and +2% Armor Regen when an Ally is within 10m of you. Receive +15% Critical Hit Damage, +7.5% Skill Efficiency and +1% Armor Regen when one of your Skills is within 10m of you. Only the highest group of buffs can be active at one time.",
    },
    assumed: [
      { stat: "chd", value: 30 },
      { stat: "skillEfficiency", value: 15 },
      { stat: "armorRegenPercent", value: 2 },
    ],
    assumedNote: "Bond ally-within-10m group (highest). Skill-proximity group does not stack.",
    note: "Y7S4 Mutiny exotic chest. Weapon Damage core is locked. CHC/CHD secondaries.",
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
        "Hitting enemies applies stacks to them (20 max per target). Reloading consumes all stacks to deal 2% Weapon Damage per stack to that enemy.",
    },
    note: "Climax exotic (end of Y8S3). Afterburn is a reload consume burst (2%/stack, 20 max), not a standing Weapon Damage buff.",
  },
  {
    id: "btsu-datagloves",
    name: "BTSU Datagloves",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["gloves"],
    uniqueTalent: {
      name: "Transference Overclock",
      description:
        "Grants 15% Hive skill haste per skill tier. Detonating a hive refreshes your skill cooldowns and grants Overcharge for 15s. If at Skill Tier 6, this effect also applies to all allies. Allies receiving this effect are unable to benefit from it again for 120s.",
    },
    assumed: [{ stat: "skillHaste", value: 15 }, { stat: "skillDamage", value: 10 }],
    assumedNote: "Hive overcharge window averaged as Skill Haste + Skill Damage.",
  },
  {
    id: "bloody-knuckles",
    name: "Bloody Knuckles",
    kind: "exotic",
    lockedCore: "red",
    slots: ["gloves"],
    uniqueTalent: {
      name: "Over the Top",
      description:
        "Damaging an enemy with a grenade or striking an enemy with a melee attack activates Seeing Red. Seeing Red grants +25% Weapon Damage and +100% melee damage. Seeing Red lasts 20 seconds and starts a 60 second cooldown after completion. While in cooldown, striking an enemy with a melee attack or hitting an enemy with the effect of a grenade will complete the cooldown instantly.",
    },
    assumed: [{ stat: "weaponDamage", value: 8 }, { stat: "meleeDamage", value: 10 }],
    assumedNote: "Over the Top / Seeing Red vs grenade or melee uptime.",
  },
  {
    id: "overdogs",
    name: "Overdogs",
    kind: "exotic",
    lockedCore: "red",
    slots: ["gloves"],
    uniqueTalent: {
      name: "Weakest Link",
      description:
        "Amplifies Weapon Damage by 30% to the lowest ranking enemies within the Tier hierarchy. Tier 1: Hunter, Rogue, Leader, Tank, Shield, Heavy Weapons, RPG, Medic, Controller, Warhound, Marauder. Tier 2: Support, Engineer, Bodyguard, Immobilizer, Bomber, Mini Tank, Drone Operator. Tier 3: Any other enemy or skill proxy.",
    },
    assumed: [{ stat: "weaponDamage", value: 15 }],
    assumedNote: "Weakest Link 30% vs the lowest-rank target, averaged across a mixed group.",
    note: "Exotic gloves. Weapon Damage core is locked. CHC/CHD secondaries — no extra Armor on Kill core/stat.",
  },
  {
    id: "exodus",
    name: "Exodus",
    kind: "exotic",
    lockedCore: "red",
    slots: ["gloves"],
    uniqueTalent: {
      name: "Smoke Screen",
      description:
        "On armor break, drop a Smoke Bomb at your feet, concealing you from enemies for 3s. Cooldown 40s.",
    },
    note: "Y6S3 Burden of Truth exotic gloves. Smoke Screen is combat-only concealment — not sheet Weapon Damage. Weapon Damage core is locked. CHC/CHD secondaries.",
  },

  // ========== Exotics — holsters ==========
  {
    id: "shocker-punch",
    name: "Shocker Punch",
    kind: "exotic",
    lockedCore: "blue",
    slots: ["holster"],
    uniqueTalent: {
      name: "Defibrillator",
      description:
        "While Shocker Punch is equipped, the stun received by the agent from the Shock status effect will be reduced by 50%. Using a shield will give 100% to melee damage. Using St. Elmo's Engine with the holster will give 100% extra melee damage and will make the next melee attack apply Shock to the target. Using all three items will offer all of the above mentioned bonuses and the Shock from the melee attack will have a 5m radius, starting from the first target. 15 second cooldown.",
    },
    assumed: [{ stat: "meleeDamage", value: 50 }, { stat: "hazardProtection", value: 5 }],
    assumedNote: "Defibrillator melee with a shield equipped; Elmo combo is extra.",
    note: "Exotic holster (not gloves). Armor core is locked. Secondaries are Explosive Resistance / Hazard Protection — not extra cores.",
  },
  {
    id: "waveform",
    name: "Waveform",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["holster"],
    uniqueTalent: {
      name: "Alternating Current",
      description:
        "Generate a stack of 2.5% Skill Damage on one of your skills every second, capping at 10 stacks. When at 10 stacks, 10 seconds pass before the stacks transfer to the other skill one by one. The process then repeats.",
    },
    assumed: [{ stat: "weaponDamage", value: 8 }, { stat: "skillDamage", value: 12 }],
    assumedNote: "Capacitance mid-fight weapon/skill loop.",
  },
  {
    id: "imperial-dynasty",
    name: "Imperial Dynasty",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["holster"],
    uniqueTalent: {
      name: "Dragon's Glare",
      description:
        "While in combat, applies Burn to the enemy closest to you within 20m. Cooldown: 35s.",
    },
    assumed: [{ stat: "statusEffects", value: 12 }],
    assumedNote: "Proximity burn modeled as Status Effects.",
  },
  {
    id: "dodge-city",
    name: "Dodge City Gunslinger's Holster",
    kind: "exotic",
    lockedCore: "red",
    slots: ["holster"],
    uniqueTalent: {
      name: "Quick Draw",
      description:
        "While your pistol is holstered, gain a stacking buff every 0.3s, up to 100. When you swap to it, your first shot consumes the buff and deals +10% damage per stack (for a maximum of 1000% damage). This deals headshot damage anywhere you hit.",
    },
    assumed: [{ stat: "pistolDamage", value: 20 }, { stat: "hsd", value: 15 }],
    assumedNote: "Quick Draw after swapping to the sidearm.",
  },
  {
    id: "centurions-scabbard",
    name: "Centurion's Scabbard",
    kind: "exotic",
    lockedCore: "red",
    slots: ["holster"],
    uniqueTalent: {
      name: "Counter",
      description:
        "Swapping weapons will give the following groups of bonuses one by one, in order: 1. +20% Rate of Fire, +20% Weapon Damage. 2. +50% Magazine Size, +50% Reload Speed. The bonuses remain active for 12s or until the next weapon swap. Swapping to your sidearm will not trigger the next group of bonuses.",
    },
    assumed: [{ stat: "pistolDamage", value: 12 }, { stat: "armorPercent", value: 8 }],
    assumedNote: "Gladius pistol swap / kill window averaged.",
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
        "Cannot be staggered by explosions. Increases total weapon damage by 3% each second you are not moving. Stacks up to 10 until you start moving. Stacks decay gradually once you start moving. All stacks are lost 10s after moving.",
    },
    assumed: [{ stat: "weaponDamage", value: 18 }],
    assumedNote: "Stand Your Ground at ~6 stacks while planted.",
    note: "Exotic kneepads (Odessa Sawyer) — not a Gila Guard named piece. Armor core is locked.",
  },
  {
    id: "nurses-kneepads",
    name: "Nurse's Kneepads",
    kind: "exotic",
    lockedCore: "yellow",
    slots: ["kneepads"],
    uniqueTalent: {
      name: "Impervious",
      description:
        "Both you and allies within 10m of you receive 40% Hazard Protection.",
    },
    assumed: [{ stat: "hazardProtection", value: 40 }],
    assumedNote: "First Aid Associate is always on within 10m — +40% Hazard Protection.",
    note: "Exotic kneepads. Skill Tier core is locked. The +40% hazard is the talent, not an extra core/stat on the piece.",
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
        "Vaulting, climbing or dropping from on top of an object gives +10% Movement Speed for 3 seconds. After not moving for 5 seconds, receive +20% Movement Speed for 5 seconds. Being applied a Status Effect will provide +10% Movement Speed for 5 seconds. Max Movement Speed bonus is 20%. The bonuses do not stack with Movement Speed bonuses from other sources. -50% Movement Impairment penalty from Status Effects.",
    },
    assumed: [{ stat: "hazardProtection", value: 5 }],
    assumedNote: "Escape Plan mobility/status penalty modeled as mild Hazard Protection.",
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
        "Shooting an enemy applies a mark. Only one mark can be active at a time. The mark disappears after 15s, or when the marked enemy dies. Receive 600% Amplified Damage from the marked enemy. Deal 20% Amplified Damage to unmarked enemies. If only one enemy remains in combat, the mark disappears and cannot be reapplied.",
    },
    assumed: [{ stat: "weaponDamage", value: 10 }],
    assumedNote: "Ostracize +20% vs unmarked targets, averaged (the marked enemy is a tank check).",
  },
  {
    id: "ninjabike-kneepads",
    name: "NinjaBike Messenger Kneepads",
    kind: "exotic",
    lockedCore: "red",
    slots: ["kneepads"],
    uniqueTalent: {
      name: "Parkour!",
      description:
        "Performing a cover to cover or vaulting reloads your drawn weapon and grants +25% bonus armor for 5s.",
    },
    note: "TU8 exotic kneepads — a different item from the NinjaBike Messenger Bag. Parkour! is combat-only (reload + bonus armor). Does not fill brand/set requirements.",
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
          const extras = packageExtraCores(slot, resolved);
          if (extras.length) {
            resolved = { ...resolved, extraCores: extras, coreLocked: true };
          }
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
