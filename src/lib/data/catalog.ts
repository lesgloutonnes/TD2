import type { CatalogItem } from "../types";
import { BRANDS } from "./brands";
import { GEAR_SETS, gearSetCore } from "./gear-sets";

/**
 * Named and exotic gear (Y8S3 live).
 * Organized brand by brand, then exotics by slot.
 * Base: community sheet (up to date as of March 22, 2026) + later Y8S2/Y8S3 pieces.
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
    uniqueTalent: {
      name: "Perfect Vigilance",
      description: "+25% total weapon damage. Taking damage disables the buff for 3s.",
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
      description: "Damage dealt +30%. Damage taken +60%.",
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
        "Armor destroyed: critical hits repair 3.5% armor and shots repair 0.6% health for 5s. Cooldown 15s.",
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
    uniqueTalent: {
      name: "Perfect Spark",
      description:
        "Destroying an enemy skill: +30% total weapon and skill damage for 20s.",
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
        "After a headshot, the next headshot within 5s is amplified (150% of the first shot's damage, capped).",
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
        "Killing within 8m: 25% bonus armor (max 50%). Lasts 10s.",
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
        "Staying in cover for 5s: +15% total weapon and skill damage for you and allies (15s).",
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
    note: "Petrov gloves with +8% Damage to Armor (above the 6% cap).",
  },
  {
    id: "vedmedytsya",
    name: "Vedmedytsya Vest",
    kind: "named",
    brandId: "petrov",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Braced",
      description: "While in cover: +50% weapon handling.",
    },
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
    uniqueTalent: {
      name: "Perfect Focus",
      description:
        "Staying still: +1.2% total weapon damage per second, up to 12%. Moving resets it.",
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
        "Headshot: +20% total weapon damage for 1.5s (5s with a sniper rifle). Headshot kill: +15% for 10s.",
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
        "When armor is destroyed, repairs 100% of armor. Cooldown 60s. Free armor kit for 7s.",
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
    uniqueTalent: {
      name: "Perfect Vanguard",
      description:
        "Deploying a shield: invulnerable for 7s and grants allies 60% of your armor as bonus armor (20s). Cooldown 60s.",
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
    note: "Gila mask: 100% Scanner Pulse Haste (approximated as Skill Haste) + yellow core.",
  },
  {
    id: "sawyers-kneepads",
    name: "Sawyer's Kneepads",
    kind: "named",
    brandId: "gila",
    slots: ["kneepads"],
    extraStats: [{ stat: "armorRegen", value: 1 }],
    extraCores: ["red"],
    note: "Gila kneepads: extra armor regen + red core.",
  },
  {
    id: "chill-out",
    name: "Chill Out",
    kind: "named",
    brandId: "gila",
    slots: ["mask"],
    extraStats: [{ stat: "skillHaste", value: 10 }],
    extraCores: ["yellow"],
    note: "Gila seasonal mask: 2 mod slots (the builder only simulates one) + yellow core.",
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
        "Using an armor kit out of combat doesn't consume it. In combat, +30% kit repair.",
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
      description: "Killing: 12% bonus armor per nearby enemy, up to 60%. Lasts 10s.",
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
    note: "5.11 gloves: brand blue (Armor) core + bonus red (Weapon Damage) core +10% Armor on Kill.",
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
        "When the shield takes damage: +25% bonus armor, and allies gain 35% of your armor as bonus armor for 3s. Cooldown 3s.",
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
        "Within 8m, +40% total weapon damage if you have bonus armor.",
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
      description: "Applying a status effect: +21% total weapon damage for 20s.",
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
        "Killing with a skill: +25% Skill Damage for 15s. Stacks up to 3.",
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
        "Killing with a skill: reduces all active cooldowns by 20%.",
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
    lockedCore: "red",
    extraStats: [{ stat: "pistolDamage", value: 10 }],
    note: "Wyvern holster: extra pistol damage, high melee damage; locked red core (overrides brand yellow).",
  },
  {
    id: "impetus",
    name: "Impetus",
    kind: "named",
    brandId: "wyvern",
    slots: ["chest"],
    uniqueTalent: {
      name: "Perfect Kinetic Momentum",
      description:
        "In combat, each active skill (or off cooldown) generates stacks: +1.5% Skill Damage and +2% repair per stack, 18 max per skill.",
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
        "Killing with a skill: +30% skill damage/repair for 15s.",
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
    note: "Alps gloves (Technician specialization research): +20% extra skill health. Brand core: yellow.",
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
        "Killing with a skill: pulses enemies within 20m for 8s. Cooldown 10s.",
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
    note: "Brazos holster: brand yellow core + bonus red core.",
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
        "Allies within 15m of a deployed skill: +30% reload speed and −0.6s active cooldowns per second.",
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
      description: "Using a skill: +30% total weapon damage for 10s.",
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
    uniqueTalent: {
      name: "Tag Team",
      description:
        "The last enemy damaged by a skill is marked. Weapon damage on that target: -12s active cooldowns. Cooldown 4s.",
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
    note: "Richter holster: +50% shield health (approximated as skill health). Brand core: yellow.",
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
        "Ally or skill within 5m: +20% total weapon damage.",
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
        "Applying a status effect: allies within 20m gain 50% bonus armor for 10s.",
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
      description: "Headshot: applies bleed to enemies within 10m. Cooldown 12s.",
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
      description: "Applying a status effect: spreads to enemies within 12m. Cooldown 12s.",
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
        "Killing: +7% total weapon damage for 15s, 5 stacks. A grenade kill grants 2 stacks.",
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
        "Grenade radius +75%. Grenade kills are refunded. Grenades can be cooked. +15% bonus armor while aiming a grenade.",
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
        "Swapping weapons (different types): +45% total damage within 15m (shotgun/SMG), +45% beyond 25m (rifle/MMR), +20% between 15 and 25m (LMG/AR). 10s, once every 5s per type.",
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
    uniqueTalent: {
      name: "Perfect Reassigned",
      description: "Killing an enemy: 1 random special round loaded into the pistol. Cooldown 8s.",
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
        "Cover-to-cover movement: 20% of your armor as bonus armor for you and allies (10s). Tripled if you end up within 10m of an enemy. Cooldown 10s.",
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
    note: "Imminence kneepads: −50% extra threat.",
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
        "While reloading: +40% bonus armor. Allies reloading: 0–30% of your armor as bonus armor (depending on blue cores).",
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
    note: "Urban Lookout holster: +38% extra accuracy (single roll).",
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
        "Critical hits increase total weapon damage by 1% for 5s. 30 stacks max.",
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
    note: "Unit Alloys holster: +5% extra rate of fire. Brand core: red.",
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
        "Swapping weapons: +25% total weapon damage for 8s. Cooldown 8s.",
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
      description: "While in cover: +20% total weapon damage.",
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
        "Repairing an ally: grants them +3% to +20% total weapon and skill damage for 10s (depending on skill tier).",
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
      description: "Repairing an ally: +30% healing received for 5s.",
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
        "Hitting an enemy with a shotgun or sniper rifle: they take +15% damage from all sources for 5s.",
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
      description: "+20% total weapon and skill damage vs pulsed targets.",
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
        "Enemies within 3m of a hive, turret, remote pulse, or decoy: shocked. 2s arming time, 8s cooldown per skill.",
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
        "Throwing a skill: explodes 1.5s after landing (5m radius), then every 5s. Damage depends on skill tier. Once per skill.",
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
        "Below 30% armor, a headshot from cover repairs 30% armor. Cooldown 2s.",
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
    note: "Zwiadowka gloves: +15% extra weapon handling (single roll).",
  },

  // --- Shiny Monkey Gear ---
  {
    id: "axel",
    name: "Axel",
    kind: "named",
    brandId: "shiny-monkey",
    slots: ["backpack"],
    uniqueTalent: {
      name: "Perfect Energize",
      description:
        "Using an armor kit: +1 skill tier for 15s. Already at tier 6: overcharge. Cooldown 30s.",
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
    slots: ["mask"],
    uniqueTalent: {
      name: "Slotted",
      description:
        "Bonus based on the color of each non-core attribute: red +10% Critical Hit Damage, yellow +5% skill efficiency, blue +1% armor regen.",
    },
  },

  // ========== Exotics — backpacks ==========
  {
    id: "memento",
    name: "Memento",
    kind: "exotic",
    lockedCore: "red",
    slots: ["backpack"],
    extraCores: ["blue", "yellow"],
    uniqueTalent: {
      name: "Kill Confirmed",
      description:
        "Picking up a trophy: stacks of Weapon Damage, armor, and skill damage. 3 cores. Excellent hybrid piece.",
    },
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
      lockedCore: brand.core,
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
  return CATALOG.filter((item) => item.slots === "all" || item.slots.includes(slot)).map(
    (item) => {
      if (item.gearSetId) {
        const set = GEAR_SETS.find((entry) => entry.id === item.gearSetId);
        if (set) return { ...item, lockedCore: gearSetCore(set, slot) };
      }
      if (item.lockedCore) return item;
      if (item.brandId) {
        const brand = BRANDS.find((entry) => entry.id === item.brandId);
        if (brand) return { ...item, lockedCore: brand.core };
      }
      return item;
    },
  );
}
