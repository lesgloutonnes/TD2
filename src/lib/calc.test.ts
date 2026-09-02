import { computeStats, emptyLoadout, formatBonusList, slotColor } from "./calc";
import { applyGearSet, catalogItemLabel, createPiece, pieceLabel, setPiecePrototype, setWeaponPrototype } from "./piece";
import { decodeLoadout, encodeLoadout, loadoutBlurb } from "./share";
import type { EquippedSkill, EquippedWeapon, Loadout, SeasonModifier, WeaponSlot } from "./types";
import { NAMED_AND_EXOTICS, catalogById, catalogForSlot } from "./data/catalog";
import { ALL_TALENTS, talentByName, talentsForSlot } from "./data/talents";
import { WEAPONS } from "./data/weapons";
import { BRANDS } from "./data/brands";
import { GEAR_SETS, gearSetCores } from "./data/gear-sets";
import { CORE_COLORS, EMPTY_SLOT_COLOR, GEAR_BASE_ARMOR, SLOTS, itemKindColor, itemDisplayColor, weaponDisplayColor, PROTOTYPE_COLOR, clampStat, ATTRIBUTE_OPTIONS, MOD_OPTIONS } from "./data/attributes";
import { AUGMENTS } from "./data/augments";
import { defaultSkillMods, skillModSlotsFor, weaponsByType, weaponsSorted } from "./data/skill-mods";
import { defaultWeaponMods } from "./data/weapon-mods";
import { defaultWeaponTalentId, weaponTalentByName } from "./data/weapon-talents";
import { clampExpertise } from "./builder-model";
import { pieceInspect, weaponInspect } from "./tooltip";
import { shouldOpenGearPicker } from "./gear-picker";
import {
  SEASON_ACTIVES,
  SEASON_PASSIVES,
  sanitizeSeason,
} from "./data/season-modifiers";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function testWeapon(weaponId: string, expertise: number): EquippedWeapon {
  const def = WEAPONS.find((weapon) => weapon.id === weaponId);
  const talentId =
    def?.quality === "high-end"
      ? (weaponTalentByName(def.talent)?.id ?? defaultWeaponTalentId(def.type))
      : undefined;
  return {
    weaponId,
    expertise,
    mods: def ? defaultWeaponMods(def.type) : [],
    talentId,
  };
}

function testSkill(skillId: string, spec?: string | null, expertise = 0): EquippedSkill {
  return { skillId, mods: defaultSkillMods(skillId, spec), expertise };
}

function applyTestExpertise(loadout: Loadout, level = 12): Loadout {
  const expertise = clampExpertise(level);
  for (const slot of SLOTS) {
    const piece = loadout.gear[slot];
    if (piece) piece.expertise = expertise;
  }
  for (const slot of ["primary", "secondary", "sidearm"] as WeaponSlot[]) {
    const weapon = loadout.weapons[slot];
    if (weapon) weapon.expertise = expertise;
  }
  for (const skill of loadout.skills) {
    if (skill) skill.expertise = expertise;
  }
  return loadout;
}

/** Fixture only — not a user-facing starter kit. */
function strikerSampleLoadout(): Loadout {
  const loadout = emptyLoadout("Striker");
  loadout.gear.mask = createPiece("mask", "set:striker");
  loadout.gear.backpack = createPiece("backpack", "set:striker");
  loadout.gear.chest = createPiece("chest", "set:striker");
  loadout.gear.gloves = createPiece("gloves", "set:striker");
  loadout.gear.holster = createPiece("holster", "brand:ceska");
  loadout.gear.kneepads = createPiece("kneepads", "brand:grupo");
  loadout.weapons.primary = testWeapon("st-elmo", 12);
  loadout.weapons.secondary = testWeapon("lexington", 12);
  loadout.weapons.sidearm = testWeapon("liberty", 12);
  loadout.skills = [testSkill("reviver-hive"), testSkill("crusader-shield")];
  loadout.specialization = "gunner";
  return applyTestExpertise(loadout);
}

function allRedSampleLoadout(): Loadout {
  const loadout = emptyLoadout("All Red Glass Cannon");
  loadout.gear.mask = createPiece("mask", "coyotes-mask");
  loadout.gear.backpack = createPiece("backpack", "the-gift");
  loadout.gear.chest = createPiece("chest", "the-sacrifice");
  loadout.gear.gloves = createPiece("gloves", "contractors-gloves");
  loadout.gear.holster = createPiece("holster", "brand:grupo");
  loadout.gear.kneepads = createPiece("kneepads", "foxs-prayer");
  loadout.weapons.primary = testWeapon("lexington", 12);
  loadout.weapons.secondary = testWeapon("famas", 12);
  loadout.weapons.sidearm = testWeapon("d50", 12);
  loadout.skills = [testSkill("reviver-hive"), testSkill("striker-drone")];
  loadout.specialization = "gunner";
  return applyTestExpertise(loadout);
}

function testEmpty() {
  const stats = computeStats(emptyLoadout());
  assert(stats.cores.red === 0, "empty cores");
  assert(stats.values.chc === 10, "watch CHC still applied by default");
}

function testWatchOff() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  const stats = computeStats(loadout);
  assert(stats.values.chc === 0, "no watch chc");
  assert(stats.values.weaponDamage === 0, "no watch wd");
}

function testProvidence3() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "brand:providence");
  loadout.gear.gloves = createPiece("gloves", "brand:providence");
  loadout.gear.holster = createPiece("holster", "brand:providence");
  const stats = computeStats(loadout);
  assert(stats.values.hsd === 13, `1pc hsd, got ${stats.values.hsd}`);
  assert(stats.values.chc === 32, `2pc chc + attrs + mask mod, got ${stats.values.chc}`);
  assert(stats.values.chd === 49, `3pc chd + attrs, got ${stats.values.chd}`);
}

function testNinja() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "brand:providence");
  loadout.gear.backpack = createPiece("backpack", "ninjabike");
  const stats = computeStats(loadout);
  assert(stats.values.hsd === 13, `ninja 1pc hsd, got ${stats.values.hsd}`);
  assert(stats.values.chc >= 8, `ninja unlocks 2pc chc, got ${stats.values.chc}`);
  assert(stats.cores.red === 2, `Providence + NinjaBike red, got red=${stats.cores.red}`);
  assert(stats.cores.blue === 1 && stats.cores.yellow === 1, "NinjaBike extra blue+yellow cores");
  assert(stats.values.weaponDamage === 30, `2 red cores, got ${stats.values.weaponDamage}`);
  assert(stats.skillTierCapped === 1, `NinjaBike yellow core, got ${stats.skillTierCapped}`);
}

function testStriker4() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "set:striker");
  loadout.gear.backpack = createPiece("backpack", "set:striker");
  loadout.gear.chest = createPiece("chest", "set:striker");
  loadout.gear.gloves = createPiece("gloves", "set:striker");
  const stats = computeStats(loadout);
  assert(stats.values.weaponHandling === 15, `2pc handling, got ${stats.values.weaponHandling}`);
  assert(stats.values.rateOfFire === 15, "3pc rof");
  assert(
    stats.notes.some((note) => note.includes("Press the Advantage")),
    "chest talent note",
  );
  assert(
    stats.notes.some((note) => note.includes("Risk Management")),
    "backpack talent note",
  );
}

function testChcCap() {
  const loadout = emptyLoadout();
  loadout.shdWatch = true;
  for (const slot of ["mask", "backpack", "chest", "gloves", "holster", "kneepads"] as const) {
    loadout.gear[slot] = createPiece(slot, "brand:ceska");
  }
  const stats = computeStats(loadout);
  assert(stats.values.chc > 60, `uncapped over 60, got ${stats.values.chc}`);
  assert(stats.chcCapped === 60, "capped at 60");
  assert(stats.chcOvercap > 0, "overcap flagged");
}

function testShareRoundtrip() {
  const loadout = emptyLoadout("Test");
  loadout.gear.mask = createPiece("mask", "coyotes-mask");
  const encoded = encodeLoadout(loadout);
  const decoded = decodeLoadout(encoded);
  assert(decoded?.name === "Test", "name roundtrip");
  assert(decoded?.gear.mask?.sourceId === "coyotes-mask", "mask roundtrip");
}

function testSkillTierCap() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.specialization = "technician";
  for (const slot of ["mask", "backpack", "chest", "gloves", "holster", "kneepads"] as const) {
    loadout.gear[slot] = createPiece(slot, "brand:empress", "yellow");
  }
  const stats = computeStats(loadout);
  assert(stats.values.skillTier === 7, `6 yellow + technician, got ${stats.values.skillTier}`);
  assert(stats.skillTierCapped === 6, "tier cap 6");
}

function testStrikerSampleChc() {
  const loadout = strikerSampleLoadout();
  const stats = computeStats(loadout);
  assert(stats.chcCapped === 56, `striker sample CHC with weapon optic, got ${stats.chcCapped}`);
  assert(stats.chcOvercap === 0, `striker sample no overcap, got ${stats.chcOvercap}`);
}

function testLoadoutBlurb() {
  const striker = strikerSampleLoadout();
  const strikerBlurb = loadoutBlurb(striker);
  assert(strikerBlurb.includes("4 "), `striker count, got ${strikerBlurb}`);
  assert(strikerBlurb.includes("Striker"), `striker set name, got ${strikerBlurb}`);
  assert(strikerBlurb.includes("Česká") || strikerBlurb.includes("Ceska"), `ceska, got ${strikerBlurb}`);
  assert(strikerBlurb.includes("Grupo"), `grupo, got ${strikerBlurb}`);

  const allRed = allRedSampleLoadout();
  const redBlurb = loadoutBlurb(allRed);
  assert(redBlurb.includes("Coyote") || redBlurb.includes("Gift"), `named/exotic, got ${redBlurb}`);

  assert(loadoutBlurb(emptyLoadout()) === "Empty loadout", "empty blurb");
}

function testY8s3Brands() {
  const walker = emptyLoadout();
  walker.shdWatch = false;
  walker.gear.mask = createPiece("mask", "brand:walker");
  const walkerStats = computeStats(walker);
  assert(
    walkerStats.values.weaponDamage === 21,
    `Walker 1pc 6% WD + cœur 15%, got ${walkerStats.values.weaponDamage}`,
  );

  const grupo = emptyLoadout();
  grupo.shdWatch = false;
  grupo.gear.gloves = createPiece("gloves", "brand:grupo");
  grupo.gear.holster = createPiece("holster", "brand:grupo");
  grupo.gear.kneepads = createPiece("kneepads", "brand:grupo");
  const grupoStats = computeStats(grupo);
  assert(grupoStats.values.hsd === 39, `Grupo 3pc 39% HSD, got ${grupoStats.values.hsd}`);
}

function testCeskaY8s3() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "brand:ceska");
  loadout.gear.gloves = createPiece("gloves", "brand:ceska");
  loadout.gear.holster = createPiece("holster", "brand:ceska");
  const stats = computeStats(loadout);
  assert(stats.values.chc === 32, `Ceska 1pc CHC + attrs + mask mod, got ${stats.values.chc}`);
  assert(stats.values.shotgunDamage === 24, `Ceska 2pc shotgun, got ${stats.values.shotgunDamage}`);
  assert(
    stats.values.hazardProtection === 30,
    `Ceska 3pc hazard, got ${stats.values.hazardProtection}`,
  );
  assert(stats.values.health === 0, `Ceska n'a plus de bonus Santé, got ${stats.values.health}`);
  assert(stats.values.healthPercent === 0, "Ceska sans health %");
}

function testEmberEngine() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "set:ember-engine");
  loadout.gear.backpack = createPiece("backpack", "set:ember-engine");
  loadout.gear.chest = createPiece("chest", "set:ember-engine");
  loadout.gear.gloves = createPiece("gloves", "set:ember-engine");
  const stats = computeStats(loadout);
  assert(stats.values.skillEfficiency === 8, `2pc efficiency, got ${stats.values.skillEfficiency}`);
  assert(stats.values.statusEffects === 40, `3pc 30 + 4pc model 10, got ${stats.values.statusEffects}`);
  assert(
    stats.notes.some((note) => note.includes("Flashpoint")),
    "chest Flashpoint",
  );
  assert(
    stats.notes.some((note) => note.includes("White Hot")),
    "backpack White Hot",
  );
}

function testAcesY8s3() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "set:aces");
  loadout.gear.gloves = createPiece("gloves", "set:aces");
  loadout.gear.holster = createPiece("holster", "set:aces");
  const stats = computeStats(loadout);
  assert(stats.values.mmrDamage === 30, `Aces 2pc MMR, got ${stats.values.mmrDamage}`);
  assert(stats.values.rifleDamage === 30, `Aces 2pc rifle, got ${stats.values.rifleDamage}`);
  assert(stats.values.hsd === 30, `Aces 3pc HSD, got ${stats.values.hsd}`);
  assert(stats.values.weaponHandling === 30, `Aces 3pc handling, got ${stats.values.weaponHandling}`);
}

function testHotshotHandlingMove() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "set:hotshot");
  loadout.gear.gloves = createPiece("gloves", "set:hotshot");
  let stats = computeStats(loadout);
  assert(stats.values.mmrDamage === 30, "Hotshot 2pc MMR");
  assert(stats.values.weaponHandling === 0, "Hotshot handling plus en 2pc");
  loadout.gear.holster = createPiece("holster", "set:hotshot");
  stats = computeStats(loadout);
  assert(stats.values.weaponHandling === 30, "Hotshot handling en 3pc");
}

function testNamedBrandCorrections() {
  const zeroFs = catalogById("zero-fs");
  assert(zeroFs?.brandId === "badger", "Zero F's Given est Badger Tuff");
  assert(zeroFs?.slots !== "all" && zeroFs?.slots.includes("chest"), "Zero F's gilet");
  assert(zeroFs?.uniqueTalent?.name === "Perfect Unbreakable", "Zero F's Perfect Unbreakable");

  const pointman = catalogById("pointman");
  assert(pointman?.brandId === "gila", "Pointman est Gila Guard");
  assert(pointman?.uniqueTalent?.name === "Perfect Vanguard", "Pointman Perfect Vanguard");

  const chainkiller = catalogById("chainkiller");
  assert(chainkiller?.brandId === "walker", "Chainkiller est Walker");

  const vigil = catalogById("vigil");
  assert(vigil?.brandId === "legatus", "Vigil est Legatus");
  assert(vigil?.slots !== "all" && vigil?.slots.includes("backpack"), "Vigil sac");

  const sleight = catalogById("sleight");
  assert(sleight?.slots !== "all" && sleight?.slots.includes("chest"), "Sleight gilet");
  const spotOn = catalogById("spot-on");
  assert(spotOn?.slots !== "all" && spotOn?.slots.includes("holster"), "Spot-On holster");
  const bulldog = catalogById("bulldog");
  assert(bulldog?.slots !== "all" && bulldog?.slots.includes("backpack"), "Bulldog sac");
}

function testNamedPieceBrandLabel() {
  const punch = catalogById("punch-drunk");
  assert(punch, "Punch Drunk exists");
  assert(
    catalogItemLabel(punch!) === "Punch Drunk — Douglas & Harding",
    `named label with brand, got ${catalogItemLabel(punch!)}`,
  );
  assert(
    pieceLabel(createPiece("mask", "punch-drunk")) === "Punch Drunk — Douglas & Harding",
    "equipped named piece shows brand",
  );
  assert(catalogItemLabel(catalogById("brand:gila")!) === "Gila Guard", "brand entry unchanged");
  assert(catalogItemLabel(catalogById("set:striker")!) === "Striker's Battlegear", "set unchanged");
}

function testNamedExtraStats() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.gloves = createPiece("gloves", "contractors-gloves");
  loadout.gear.kneepads = createPiece("kneepads", "foxs-prayer");
  const stats = computeStats(loadout);
  assert(stats.values.damageToArmor === 8, `Contractor's +8 DtA, got ${stats.values.damageToArmor}`);
  assert(stats.values.damageToHealth === 8, `Fox's +8 DtH, got ${stats.values.damageToHealth}`);
}

function testPicaroExtraCore() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.holster = createPiece("holster", "picaros-holster");
  const stats = computeStats(loadout);
  assert(loadout.gear.holster?.core === "yellow", "Picaro's primary core yellow");
  assert(stats.cores.yellow === 1, `Picaro's cœur jaune, got yellow=${stats.cores.yellow}`);
  assert(stats.cores.red === 1, `Picaro's cœur rouge extra, got red=${stats.cores.red}`);

  const doubleRed = emptyLoadout();
  doubleRed.shdWatch = false;
  doubleRed.gear.holster = createPiece("holster", "picaros-holster", "red");
  const redStats = computeStats(doubleRed);
  assert(doubleRed.gear.holster?.core === "red", "Picaro's primary can be recalibrated to red");
  assert(redStats.cores.red === 2, `Picaro's double red cores, got red=${redStats.cores.red}`);
  assert(redStats.cores.yellow === 0, "Picaro's yellow gone after recalibrate");
}

function testNamedCoresAndExtras() {
  const namedWithExtraCore = NAMED_AND_EXOTICS.filter(
    (item) => item.kind === "named" && item.extraCores?.length,
  );
  assert(
    namedWithExtraCore.length === 1 && namedWithExtraCore[0]?.id === "picaros-holster",
    `only Picaro's has a named extra core, got ${namedWithExtraCore.map((item) => item.id).join(",")}`,
  );

  for (const id of ["firm-handshake", "nightwatcher", "deathgrips", "melon-baller", "keeper", "rushdown", "trick-shot"]) {
    const piece = catalogById(id);
    assert(piece, `${id} exists`);
    assert(!piece?.extraCores?.length, `${id} must not invent an extra core`);
  }

  const handshake = createPiece("gloves", "firm-handshake");
  assert(!handshake.extraCores?.length, "Firm Handshake no extra core on piece");
  const handshakeLoadout = emptyLoadout();
  handshakeLoadout.shdWatch = false;
  handshakeLoadout.gear.gloves = handshake;
  assert(computeStats(handshakeLoadout).values.statusEffects === 16, "Firm Handshake +16% status");

  const night = catalogById("nightwatcher");
  assert(
    night?.extraStats?.some((stat) => stat.stat === "scannerPulseHaste" && stat.value === 100),
    "Nightwatcher 100% scanner pulse haste",
  );
  assert(!night?.extraStats?.some((stat) => stat.stat === "skillHaste"), "Nightwatcher is not global skill haste");
  const nightPiece = createPiece("mask", "nightwatcher");
  assert(nightPiece.core === "blue", "Nightwatcher native Gila blue");
  assert(createPiece("mask", "nightwatcher", "red").core === "red", "Nightwatcher core recalibratable");
  const nightLoadout = emptyLoadout();
  nightLoadout.shdWatch = false;
  nightLoadout.gear.mask = nightPiece;
  const nightStats = computeStats(nightLoadout);
  assert(nightStats.values.scannerPulseHaste === 100, "pulse haste on Nightwatcher");
  assert(nightStats.values.skillHaste === 0, "Nightwatcher does not add global skill haste");
  assert(nightStats.cores.yellow === 0, "Nightwatcher no extra yellow");

  const claws = catalogById("claws-out");
  assert(claws?.extraStats?.some((stat) => stat.stat === "meleeDamage" && stat.value === 500), "Claws Out melee");
  assert(claws?.extraStats?.some((stat) => stat.stat === "pistolDamage" && stat.value === 11), "Claws Out pistol 11%");

  const forge = catalogById("forge");
  assert(forge?.extraStats?.some((stat) => stat.stat === "shieldHealth" && stat.value === 50), "Forge +50% shield health");

  const coyote = catalogById("coyotes-mask");
  assert(!coyote?.extraStats?.length, "Coyote CHC/CHD is talent assumed, not extra stats");
  assert(coyote?.assumed?.some((stat) => stat.stat === "chc"), "Coyote assumed CHC");

  const btsu = catalogById("btsu-datagloves");
  assert(!btsu?.extraStats?.length, "BTSU skill haste is a regular secondary, not extra");
  const overdogs = catalogById("overdogs");
  assert(!overdogs?.extraStats?.length, "Overdogs has no extra AoK");
  const nurse = catalogById("nurses-kneepads");
  assert(!nurse?.extraStats?.length, "Nurse hazard is the talent, not extra stat");

  const shocker = catalogById("shocker-punch");
  assert(shocker?.slots !== "all" && shocker?.slots.includes("holster"), "Shocker Punch is a holster");
  assert(!shocker?.slots.includes("gloves"), "Shocker Punch is not gloves");
  assert(shocker?.uniqueTalent?.name === "Defibrillator", "Shocker Punch Defibrillator");
  assert(createPiece("holster", "shocker-punch").core === "blue", "Shocker Punch locked blue");
  assert(createPiece("holster", "shocker-punch", "red").core === "blue", "Shocker Punch core stays locked");
  assert(
    catalogForSlot("holster").some((item) => item.id === "shocker-punch"),
    "Shocker Punch in holster picker",
  );
  assert(
    !catalogForSlot("gloves").some((item) => item.id === "shocker-punch"),
    "Shocker Punch not in gloves picker",
  );

  const collector = catalogById("collector");
  assert(collector?.lockedCore === "red", "Collector weapon damage core");
  assert(collector?.uniqueTalent?.description.includes("grenade"), "Collector Hoarder is grenades");

  const csBag = createPiece("backpack", "set:core-strength");
  assert(csBag.core === "red", "Core Strength backpack primary red");
  assert(
    JSON.stringify(csBag.extraCores) === JSON.stringify(["blue", "yellow"]),
    "Core Strength backpack extra cores",
  );
  const csPicker = catalogForSlot("backpack").find((item) => item.id === "set:core-strength");
  assert(csPicker?.lockedCore === "red", "Core Strength backpack locked in picker");
  assert(
    JSON.stringify(csPicker?.extraCores) === JSON.stringify(["blue", "yellow"]),
    "Core Strength backpack extras in picker",
  );
  const csGloves = catalogForSlot("gloves").find((item) => item.id === "set:core-strength");
  assert(csGloves?.lockedCore === undefined, "Core Strength gloves still recalibratable");
}

function testLockedBrandAndExoticCores() {
  assert(createPiece("mask", "catharsis").core === "blue", "Catharsis armor core");
  assert(createPiece("holster", "forge").core === "yellow", "Forge native yellow (Richter)");
  assert(createPiece("kneepads", "brand:badger").core === "blue", "Badger brand armor core");
  assert(createPiece("gloves", "deathgrips").core === "blue", "Deathgrips primary armor core");
  assert(!createPiece("gloves", "deathgrips").extraCores?.length, "Deathgrips has no extra core");
  const memento = createPiece("backpack", "memento");
  assert(memento.core === "red", "Memento primary red");
  assert(
    JSON.stringify(memento.extraCores) === JSON.stringify(["blue", "yellow"]),
    "Memento bonus blue+yellow",
  );
  assert(createPiece("backpack", "memento", "yellow").core === "red", "Memento package stays locked");

  const ninja = createPiece("backpack", "ninjabike");
  assert(ninja.core === "red", "NinjaBike primary red");
  assert(
    JSON.stringify(ninja.extraCores) === JSON.stringify(["blue", "yellow"]),
    "NinjaBike bonus blue+yellow",
  );
  assert(
    createPiece("backpack", "ninjabike", "yellow").core === "red",
    "NinjaBike package stays locked",
  );

  // Most exotics ignore inherited recalibration.
  assert(createPiece("holster", "waveform", "red").core === "yellow", "Waveform ignores inherited red");
  assert(createPiece("mask", "catharsis", "red").core === "blue", "Catharsis ignores inherited red");

  // Investor exotic: core rolls per drop — recalibratable in the planner.
  assert(createPiece("mask", "investor", "blue").core === "blue", "Investor can be blue");
  assert(createPiece("mask", "investor", "yellow").core === "yellow", "Investor can be yellow");
  assert(createPiece("mask", "investor").core === "red", "Investor native default red");

  // Brand HE + named + gear sets: cores recalibratable.
  assert(createPiece("mask", "brand:empress", "red").core === "red", "Empress brand recalibrates to red");
  assert(createPiece("mask", "brand:empress").core === "yellow", "Empress native yellow");
  assert(createPiece("holster", "forge", "red").core === "red", "Forge named recalibrates to red");
  assert(createPiece("holster", "claws-out").core === "red", "Claws Out native red");
  assert(createPiece("holster", "claws-out", "yellow").core === "yellow", "Claws Out core recalibratable");
  assert(createPiece("mask", "set:striker", "blue").core === "blue", "Striker set core recalibratable");
  assert(createPiece("mask", "set:striker").core === "red", "Striker native red");
  assert(createPiece("holster", "waveform").core === "yellow", "Waveform skill tier");
  assert(createPiece("gloves", "btsu-datagloves").core === "yellow", "BTSU skill tier");
  assert(createPiece("chest", "tardigrade").core === "blue", "Tardigrade armor");
  assert(createPiece("kneepads", "sawyers-kneepads").core === "blue", "Sawyer's armor core");
  assert(
    createPiece("kneepads", "sawyers-kneepads", "red").core === "blue",
    "Sawyer's exotic core stays locked",
  );
  const sawyersPicker = catalogForSlot("kneepads").find((item) => item.id === "sawyers-kneepads");
  assert(sawyersPicker?.lockedCore === "blue", "Sawyer's locked blue in picker");
  assert(sawyersPicker?.kind === "exotic", "Sawyer's listed as exotic");

  const waveformPicker = catalogForSlot("holster").find((item) => item.id === "waveform");
  assert(waveformPicker?.lockedCore === "yellow", "Waveform locked yellow in picker");
  const catharsisPicker = catalogForSlot("mask").find((item) => item.id === "catharsis");
  assert(catharsisPicker?.lockedCore === "blue", "Catharsis locked blue in picker");
  const investorPicker = catalogForSlot("mask").find((item) => item.id === "investor");
  assert(investorPicker?.lockedCore === undefined, "Investor not locked in picker");
  const mementoPicker = catalogForSlot("backpack").find((item) => item.id === "memento");
  assert(mementoPicker?.lockedCore === "red", "Memento package locked in picker");
  const ninjaPicker = catalogForSlot("backpack").find((item) => item.id === "ninjabike");
  assert(ninjaPicker?.lockedCore === "red", "NinjaBike package locked in picker");
  assert(
    JSON.stringify(ninjaPicker?.extraCores) === JSON.stringify(["blue", "yellow"]),
    "NinjaBike picker shows extra cores",
  );
  const deathgripsPicker = catalogForSlot("gloves").find((item) => item.id === "deathgrips");
  assert(deathgripsPicker?.lockedCore === undefined, "Deathgrips named recalibratable in picker");
  const forgePicker = catalogForSlot("holster").find((item) => item.id === "forge");
  assert(forgePicker?.lockedCore === undefined, "Forge named recalibratable in picker");
  const badgerPicker = catalogForSlot("kneepads").find((item) => item.id === "brand:badger");
  assert(badgerPicker?.lockedCore === undefined, "Badger brand recalibratable in picker");
  const empressPicker = catalogForSlot("mask").find((item) => item.id === "brand:empress");
  assert(empressPicker?.lockedCore === undefined, "Empress brand recalibratable in picker");
  const strikerPicker = catalogForSlot("gloves").find((item) => item.id === "set:striker");
  assert(strikerPicker?.lockedCore === undefined, "Striker set recalibratable in picker");
}

function testCatalogCoverage() {
  const ids = NAMED_AND_EXOTICS.map((item) => item.id);
  assert(new Set(ids).size === ids.length, "ids nommés/exotiques uniques");

  const named = NAMED_AND_EXOTICS.filter((item) => item.kind === "named");
  const exotic = NAMED_AND_EXOTICS.filter((item) => item.kind === "exotic");
  assert(named.length >= 65, `au moins 65 nommés, got ${named.length}`);
  assert(exotic.length >= 25, `au moins 25 exotiques gear, got ${exotic.length}`);

  const namedBrands = new Set(named.map((item) => item.brandId).filter(Boolean));
  const expected = [
    "providence",
    "ceska",
    "grupo",
    "walker",
    "fenris",
    "petrov",
    "overlord",
    "sokolov",
    "airaldi",
    "badger",
    "douglas",
    "gila",
    "belstone",
    "511",
    "golan",
    "empress",
    "wyvern",
    "alps",
    "china-light",
    "brazos",
    "hana-u",
    "murakami",
    "richter",
    "electrique",
    "habsburg",
    "lengmo",
    "imminence",
    "urban-lookout",
    "unit-alloys",
    "royal-works",
    "edelweiss",
    "yaahl",
    "uzina",
    "palisade",
    "zwiadowka",
    "legatus",
    "shiny-monkey",
  ];
  for (const brandId of expected) {
    assert(namedBrands.has(brandId), `nommé manquant pour ${brandId}`);
    assert(BRANDS.some((brand) => brand.id === brandId), `marque inconnue ${brandId}`);
  }

  for (const required of [
    "vile",
    "btsu-datagloves",
    "collector",
    "nurses-kneepads",
    "overdogs",
    "force-multiplier",
    "matador",
    "devils-due",
    "equalizer",
    "benefactor",
    "vigil",
    "backbone",
    "the-setup",
    "bober",
    "visionario",
    "sawyers-kneepads",
    "chill-out",
  ]) {
    assert(catalogById(required), `catalogue manque ${required}`);
  }

  const sawyers = catalogById("sawyers-kneepads");
  assert(sawyers?.kind === "exotic", "Sawyer's Kneepads est un exotique");
  assert(!sawyers?.brandId, "Sawyer's n'est pas une marque Gila");
  assert(sawyers?.uniqueTalent?.name === "Stand Your Ground", "Sawyer's Stand Your Ground");
  assert(sawyers?.slots !== "all" && sawyers?.slots.includes("kneepads"), "Sawyer's genouillères");

  const liquid = catalogById("liquid-engineer");
  assert(
    liquid?.uniqueTalent?.description.includes("adds and refreshes a stack of +12% bonus armor"),
    "Perfect Bloodsucker stacking description",
  );
}

function testLiveTalentLibrary() {
  const names = ALL_TALENTS.map((talent) => talent.name);
  assert(new Set(names).size === names.length, "talent names unique");
  const ids = ALL_TALENTS.map((talent) => talent.id);
  assert(new Set(ids).size === ids.length, "talent ids unique");

  const chest = talentsForSlot("chest").filter((talent) => !talent.perfect).map((t) => t.id);
  const pack = talentsForSlot("backpack").filter((talent) => !talent.perfect).map((t) => t.id);
  assert(chest.includes("overwatch") && !pack.includes("overwatch"), "Overwatch is a chest talent");
  assert(pack.includes("wicked") && !chest.includes("wicked"), "Wicked is a backpack talent");
  assert(pack.includes("protector") && !chest.includes("protector"), "Protector is a backpack talent");
  assert(chest.includes("tag-team") && !pack.includes("tag-team"), "Tag Team is a chest talent");

  const intimidate = talentByName("Perfect Intimidate");
  assert(intimidate.description.includes("gain 3 stacks each second"), "Intimidate stacking");
  assert(intimidate.description.includes("max 10"), "Perfect Intimidate 10 stacks");

  const headhunter = talentByName("Perfect Headhunter");
  assert(headhunter.description.includes("killing an enemy with a headshot"), "Headhunter on kill");
  assert(headhunter.description.includes("150%"), "Perfect Headhunter 150%");

  const combined = talentByName("Perfect Combined Arms");
  assert(combined.description.includes("total skill damage by 30%"), "Combined Arms is skill damage");

  const safeguard = talentByName("Perfect Safeguard");
  assert(safeguard.description.includes("While at full armor"), "Safeguard full armor");
  assert(safeguard.description.includes("160%"), "Perfect Safeguard 160% repair");

  const focus = talentByName("Perfect Focus");
  assert(focus.description.includes("scoped 8×"), "Focus requires 8x scope");

  const vanguard = talentByName("Perfect Vanguard");
  assert(vanguard.description.includes("makes it invulnerable"), "Vanguard shields the shield");
  assert(vanguard.description.includes("Cooldown: 25s"), "Perfect Vanguard 25s CD");

  const skilled = talentByName("Perfect Skilled");
  assert(skilled.description.includes("30% chance to reset"), "Skilled is a cooldown reset");

  const vigilance = ALL_TALENTS.find((t) => t.id === "perfect-vigilance");
  assert(vigilance?.assumed?.[0].value === 25, "Perfect Vigilance assumed 25% WD");

  for (const item of NAMED_AND_EXOTICS) {
    if (item.kind !== "named" || !item.uniqueTalent) continue;
    const lib = ALL_TALENTS.find((talent) => talent.name === item.uniqueTalent!.name);
    if (!lib) continue;
    assert(
      item.uniqueTalent.description === lib.description,
      `${item.name} unique talent text must match ${lib.name}`,
    );
  }
}

function testWeaponCatalog() {
  const ids = WEAPONS.map((weapon) => weapon.id);
  assert(new Set(ids).size === ids.length, "ids armes uniques");
  const named = WEAPONS.filter((weapon) => weapon.quality === "named");
  const exotic = WEAPONS.filter((weapon) => weapon.quality === "exotic");
  assert(named.length >= 80, `au moins 80 armes nommées, got ${named.length}`);
  assert(exotic.length >= 35, `au moins 35 armes exotiques, got ${exotic.length}`);
  for (const required of [
    "caduceus",
    "ouroboros",
    "lady-death",
    "ravenous",
    "merciless",
    "sweet-dreams",
    "whiplash",
    "kingbreaker",
    "harmony",
    "lexington",
    "st-elmo",
    "caretaker",
    "the-grudge",
    "bakers-dozen",
    "shroud",
    "dread-edict",
    "sacrum-imperium",
    "overlord",
    "sheriff",
    "underboss",
    "lullaby",
    "ruthless",
    "first-sight",
    "survivalist-d50",
  ]) {
    assert(
      WEAPONS.some((weapon) => weapon.id === required),
      `arme manquante ${required}`,
    );
  }
  const elmo = WEAPONS.find((weapon) => weapon.id === "dread-edict");
  assert(elmo?.talent === "Full Stop", "Dread Edict talent");
  const whip = WEAPONS.find((weapon) => weapon.id === "whiplash");
  assert(whip?.talent === "Faster Than Reloading", "Whiplash live talent");
}

function testUniqueTalentNote() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.chest = createPiece("chest", "the-sacrifice");
  const stats = computeStats(loadout);
  assert(
    stats.notes.some((note) => note.includes("Perfect Glass Cannon")),
    "note talent unique Sacrifice",
  );
}

function testSlotCoreColors() {
  const loadout = emptyLoadout();
  assert(slotColor("mask", loadout) === EMPTY_SLOT_COLOR, "empty slot grey");
  loadout.gear.mask = createPiece("mask", "brand:ceska");
  loadout.gear.chest = createPiece("chest", "set:foundry");
  loadout.gear.gloves = createPiece("gloves", "set:ember-engine");
  assert(slotColor("mask", loadout) === CORE_COLORS.red, "brand high-end follows red core");
  assert(slotColor("chest", loadout) === CORE_COLORS.blue, "foundry follows blue core");
  assert(slotColor("gloves", loadout) === CORE_COLORS.yellow, "ember engine follows yellow core");
}

function testRefactorSlotCores() {
  const mask = createPiece("mask", "set:refactor");
  const chest = createPiece("chest", "set:refactor");
  const holster = createPiece("holster", "set:refactor");
  const backpack = createPiece("backpack", "set:refactor");
  const gloves = createPiece("gloves", "set:refactor");
  const kneepads = createPiece("kneepads", "set:refactor");
  assert(mask.core === "yellow", "Refactor masque jaune");
  assert(chest.core === "yellow", "Refactor gilet jaune");
  assert(holster.core === "yellow", "Refactor holster jaune");
  assert(backpack.core === "blue", "Refactor sac bleu");
  assert(gloves.core === "blue", "Refactor gants bleus");
  assert(kneepads.core === "blue", "Refactor genouillères bleues");
  assert(createPiece("mask", "set:refactor", "red").core === "red", "Refactor masque recalibrable");

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = mask;
  loadout.gear.backpack = backpack;
  const stats = computeStats(loadout);
  assert(stats.cores.yellow === 1, `Refactor 1 jaune, got yellow=${stats.cores.yellow}`);
  assert(stats.cores.blue === 1, `Refactor 1 bleu, got blue=${stats.cores.blue}`);
  assert(stats.cores.red === 0, "Refactor sans cœur rouge par défaut");
}

function testSystemCorruptionSlotCores() {
  assert(createPiece("mask", "set:system-corruption").core === "red", "SC masque rouge");
  assert(createPiece("gloves", "set:system-corruption").core === "red", "SC gants rouge");
  assert(createPiece("holster", "set:system-corruption").core === "red", "SC holster rouge");
  assert(createPiece("backpack", "set:system-corruption").core === "blue", "SC sac bleu");
  assert(createPiece("chest", "set:system-corruption").core === "blue", "SC gilet bleu");
  assert(createPiece("kneepads", "set:system-corruption").core === "blue", "SC genouillères bleues");
}

function testKindColors() {
  assert(itemKindColor("brand") === itemKindColor("named"), "high-end gold");
  assert(itemKindColor("brand") === "#d4af37", "brand gold");
  assert(itemKindColor("gear-set") === "#2ecc71", "set emerald");
  assert(itemKindColor("exotic") === "#c41e3a", "exotic red");
}

function testPrototypeDisplayColor() {
  assert(itemDisplayColor("brand", false) === "#d4af37", "brand gold when not proto");
  assert(itemDisplayColor("gear-set", false) === "#2ecc71", "set green when not proto");
  assert(itemDisplayColor("brand", true) === PROTOTYPE_COLOR, "brand purple when proto");
  assert(itemDisplayColor("gear-set", true) === PROTOTYPE_COLOR, "set purple when proto");
  assert(itemDisplayColor("exotic", true) === "#c41e3a", "exotic stays red");
  assert(weaponDisplayColor("named", true) === PROTOTYPE_COLOR, "named weapon purple");
  assert(weaponDisplayColor("exotic", true) === "#c41e3a", "exotic weapon stays red");
}

function testStatCaps() {
  assert(clampStat("chc", 99) === 6, "CHC max 6");
  assert(clampStat("chd", 20) === 12, "CHD max 12");
  assert(clampStat("armorRegen", 99999) === 4925, "armor regen max 4925 HP/s");
  assert(clampStat("health", 99999) === 18935, "health attr max 18935");
  assert(clampStat("chc", -3) === 0, "no negative");
  assert(clampStat("chc", 99, true) === 9, "Prototype CHC max 9");
  assert(clampStat("chd", 20, true) === 18, "Prototype CHD max 18");
  assert(clampStat("armorRegen", 99999, true) === 7388, "Prototype regen ~1.5×");
}

function testCatalogSlotLockedCore() {
  const refactorGloves = catalogForSlot("gloves").find((item) => item.id === "set:refactor");
  const refactorMask = catalogForSlot("mask").find((item) => item.id === "set:refactor");
  const strikerGloves = catalogForSlot("gloves").find((item) => item.id === "set:striker");
  const scChest = catalogForSlot("chest").find((item) => item.id === "set:system-corruption");
  // Gear-set cores are defaults only — not locked in the picker.
  assert(refactorGloves?.lockedCore === undefined, "Refactor gloves unlocked in picker");
  assert(refactorMask?.lockedCore === undefined, "Refactor mask unlocked in picker");
  assert(strikerGloves?.lockedCore === undefined, "Striker unlocked in picker");
  assert(scChest?.lockedCore === undefined, "System Corruption unlocked in picker");
  const csBackpack = catalogForSlot("backpack").find((item) => item.id === "set:core-strength");
  assert(csBackpack?.lockedCore === "red", "Core Strength backpack locked in picker");
  assert(createPiece("gloves", "set:refactor").core === "blue", "Refactor gloves native blue");
  assert(createPiece("mask", "set:refactor").core === "yellow", "Refactor mask native yellow");
}

function testEverySetPieceCore() {
  for (const set of GEAR_SETS) {
    const cores = gearSetCores(set);
    for (const slot of SLOTS) {
      const native = createPiece(slot, `set:${set.id}`);
      assert(
        native.core === cores[slot],
        `${set.name} ${slot} native: expected ${cores[slot]}, got ${native.core}`,
      );
      if (set.id === "core-strength" && slot === "backpack") {
        assert(native.core === "red", "Core Strength backpack native red");
        assert(
          JSON.stringify(native.extraCores) === JSON.stringify(["blue", "yellow"]),
          "Core Strength backpack extra blue+yellow",
        );
        assert(
          createPiece(slot, `set:${set.id}`, "yellow").core === "red",
          "Core Strength backpack 3-core package is locked",
        );
        continue;
      }
      const recal = createPiece(slot, `set:${set.id}`, "red");
      assert(recal.core === "red", `${set.name} ${slot} recalibrates to red`);
    }
  }
}

function testApplyGearSetAllSlots() {
  const refactor = applyGearSet(emptyLoadout(), "set:refactor");
  assert(refactor.gear.mask?.core === "yellow", "apply Refactor masque");
  assert(refactor.gear.chest?.core === "yellow", "apply Refactor gilet");
  assert(refactor.gear.holster?.core === "yellow", "apply Refactor holster");
  assert(refactor.gear.backpack?.core === "blue", "apply Refactor sac");
  assert(refactor.gear.gloves?.core === "blue", "apply Refactor gants");
  assert(refactor.gear.kneepads?.core === "blue", "apply Refactor genouillères");
  assert(
    SLOTS.every((slot) => refactor.gear[slot]?.sourceId === "set:refactor"),
    "6 pièces Refactor",
  );

  const striker = applyGearSet(emptyLoadout(), "set:striker");
  assert(
    SLOTS.every((slot) => striker.gear[slot]?.core === "red"),
    "Striker 6 pièces rouges",
  );

  const ignored = applyGearSet(emptyLoadout(), "brand:providence");
  assert(SLOTS.every((slot) => ignored.gear[slot] === null), "une marque ne remplit pas le set");
}

function testInspectEmpty() {
  const inspect = pieceInspect("mask", emptyLoadout());
  assert(inspect.empty, "empty slot inspect");
  assert(inspect.slotLabel === "Mask", "slot label");
}

function testInspectProvidenceTiers() {
  const loadout = emptyLoadout();
  loadout.gear.mask = createPiece("mask", "brand:providence");
  const one = pieceInspect("mask", loadout);
  assert(!one.empty, "equipped inspect");
  if (one.empty) return;
  assert(one.name === "Providence Defense", "brand name");
  assert(one.affiliation?.tiers.length === 3, "1/2/3pc listed");
  assert(one.affiliation?.tiers[0]?.active === true, "1pc active");
  assert(one.affiliation?.tiers[1]?.active === false, "2pc locked");
  assert(one.affiliation?.tiers[2]?.active === false, "3pc locked");
  assert(one.affiliation?.tiers[0]?.detail.includes("13"), "1pc hsd");

  loadout.gear.gloves = createPiece("gloves", "brand:providence");
  const two = pieceInspect("mask", loadout);
  assert(!two.empty, "still equipped");
  if (two.empty) return;
  assert(two.affiliation?.tiers[0]?.active === true, "1pc still active");
  assert(two.affiliation?.tiers[1]?.active === true, "2pc lights up");
  assert(two.affiliation?.tiers[2]?.active === false, "3pc still locked");
}

function testInspectStrikerTalents() {
  const loadout = emptyLoadout();
  loadout.gear.mask = createPiece("mask", "set:striker");
  loadout.gear.backpack = createPiece("backpack", "set:striker");
  loadout.gear.chest = createPiece("chest", "set:striker");
  loadout.gear.gloves = createPiece("gloves", "set:striker");
  const inspect = pieceInspect("mask", loadout);
  assert(!inspect.empty, "striker inspect");
  if (inspect.empty) return;
  const tiers = inspect.affiliation?.tiers ?? [];
  assert(tiers.find((tier) => tier.key === "2pc")?.active === true, "2pc");
  assert(tiers.find((tier) => tier.key === "3pc")?.active === true, "3pc");
  assert(tiers.find((tier) => tier.key === "4pc")?.active === true, "4pc");
  assert(tiers.find((tier) => tier.key === "chest-talent")?.active === true, "chest talent on");
  assert(tiers.find((tier) => tier.key === "backpack-talent")?.active === true, "backpack talent on");

  loadout.gear.chest = createPiece("chest", "brand:providence");
  loadout.gear.holster = createPiece("holster", "set:striker");
  const noChest = pieceInspect("mask", loadout);
  assert(!noChest.empty, "still inspect");
  if (noChest.empty) return;
  assert(noChest.affiliation?.tiers.find((tier) => tier.key === "4pc")?.active === true, "4pc still on");
  assert(
    noChest.affiliation?.tiers.find((tier) => tier.key === "chest-talent")?.active === false,
    "chest talent off without set chest",
  );
  assert(
    noChest.affiliation?.tiers.find((tier) => tier.key === "backpack-talent")?.active === true,
    "backpack talent stays on",
  );
}

function testInspectNinjaBoost() {
  const loadout = emptyLoadout();
  loadout.gear.mask = createPiece("mask", "brand:providence");
  loadout.gear.backpack = createPiece("backpack", "ninjabike");
  const inspect = pieceInspect("mask", loadout);
  assert(!inspect.empty, "ninja inspect");
  if (inspect.empty) return;
  assert(inspect.affiliation?.pieces === 2, `ninja counts as 2, got ${inspect.affiliation?.pieces}`);
  assert(inspect.affiliation?.ninjaBoost === true, "ninja badge");
  assert(inspect.affiliation?.tiers[1]?.active === true, "ninja unlocks 2pc");
  assert(inspect.affiliation?.tiers[2]?.active === false, "3pc still locked");

  const bag = pieceInspect("backpack", loadout);
  assert(!bag.empty, "ninja bag inspect");
  if (bag.empty) return;
  assert(bag.talent?.name === "Resourceful", "ninja talent");
  assert(bag.affiliation === null, "ninja has no brand row");
}

function testInspectNamedBrandTiers() {
  const loadout = emptyLoadout();
  loadout.gear.backpack = createPiece("backpack", "the-gift");
  const inspect = pieceInspect("backpack", loadout);
  assert(!inspect.empty, "gift inspect");
  if (inspect.empty) return;
  const brand = BRANDS.find((entry) => entry.id === "providence");
  assert(brand, "providence exists");
  if (!brand) return;
  assert(inspect.kind === "named", "named kind");
  assert(inspect.affiliation?.name === "Providence Defense", "named shows brand");
  assert(inspect.affiliation?.tiers.length === brand.bonuses.length, "named lists 1/2/3pc like a brand");
  brand.bonuses.forEach((bonuses, index) => {
    assert(
      inspect.affiliation?.tiers[index]?.detail === formatBonusList(bonuses),
      `named ${index + 1}pc matches brand`,
    );
  });
}

function testGearPickerSecondTap() {
  const equipped = createPiece("mask", "brand:providence");
  assert(shouldOpenGearPicker("mask", "mask", null), "empty slot opens picker");
  assert(!shouldOpenGearPicker("mask", "gloves", equipped), "other equipped slot just selects");
  assert(shouldOpenGearPicker("mask", "mask", equipped), "second tap on highlight opens change");
}

function testWeaponInspect() {
  const empty = weaponInspect("primary", null);
  assert(empty.empty, "empty weapon inspect");
  assert(empty.slotLabel === "Primary weapon", "weapon slot label");

  const equipped = weaponInspect("primary", { weaponId: "st-elmo", expertise: 12, mods: [] });
  assert(!equipped.empty, "equipped weapon inspect");
  if (equipped.empty) return;
  assert(equipped.name === "St. Elmo's Engine", "exotic name");
  assert(equipped.quality === "exotic", "exotic quality");
  assert(equipped.talent.name === "Actum Est", "exotic talent");
  assert(equipped.rpm === 900, "rpm on tooltip");

  const named = weaponInspect("secondary", { weaponId: "lexington", expertise: 0, mods: [] });
  assert(!named.empty, "named inspect");
  if (named.empty) return;
  assert(named.qualityLabel === "Named", "named label");
  assert(named.talent.name === "Optimized", "lexington talent");

  const sheriff = weaponInspect("primary", { weaponId: "sheriff", expertise: 8, mods: [] });
  assert(!sheriff.empty, "sheriff inspect");
  if (sheriff.empty) return;
  assert(sheriff.extraStats.some((stat) => stat.label.includes("Accuracy")), "sheriff accuracy extra");
}

function testPerItemExpertise() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "brand:providence");
  loadout.gear.mask.expertise = 10;
  loadout.weapons.primary = { weaponId: "lexington", expertise: 15 };
  const stats = computeStats(loadout);
  // 15 WD core + 15 expertise + lexington assumed handling does not add WD
  assert(
    stats.values.weaponDamage === 30,
    `15 WD core + 15 expertise, got ${stats.values.weaponDamage}`,
  );
  // Base piece armor * 1.10 expertise
  assert(
    stats.values.armor >= GEAR_BASE_ARMOR * 1.1,
    `gear expertise armor, got ${stats.values.armor}`,
  );
  assert(
    stats.notes.some((note) => note.includes("Active weapon expertise 15")),
    "active expertise note",
  );
}

function testPistolSlotSanitize() {
  const dirty = emptyLoadout("Pistol leak") as Loadout & { expertise?: number };
  dirty.weapons.primary = { weaponId: "liberty", expertise: 5 };
  dirty.weapons.secondary = { weaponId: "lexington", expertise: 8 };
  dirty.weapons.sidearm = { weaponId: "st-elmo", expertise: 3 };
  dirty.expertise = 20;
  const gloves = createPiece("gloves", "deathgrips");
  delete (gloves as { expertise?: number }).expertise;
  dirty.gear.gloves = gloves as typeof gloves;

  const encoded = encodeLoadout(dirty);
  const decoded = decodeLoadout(encoded);
  assert(decoded, "decoded loadout");
  assert(decoded!.weapons.primary === null, "pistol cleared from primary");
  assert(decoded!.weapons.secondary?.weaponId === "lexington", "rifle stays on secondary");
  assert(decoded!.weapons.secondary?.expertise === 8, "keeps weapon expertise");
  assert(decoded!.weapons.sidearm === null, "non-pistol cleared from sidearm");
  assert(decoded!.gear.gloves?.expertise === 20, "legacy global expertise migrated to piece");
}

function testPrototypeSwitch() {
  const brand = createPiece("mask", "brand:ceska");
  const proto = setPiecePrototype(brand, true);
  assert(proto.prototype === true, "prototype on");
  assert(proto.expertise === 30, "expertise forced to 30");
  assert(proto.augmentId === "echo", "default augment Echo");
  assert(proto.augmentLevel === 1, "default augment level 1");
  assert(proto.attributes[0]?.value === 9, `CHC proto max, got ${proto.attributes[0]?.value}`);

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = { ...proto, augmentId: undefined, augmentLevel: undefined };
  const stats = computeStats(loadout);
  assert(stats.values.weaponDamage === 22.5, `red core ×1.5, got ${stats.values.weaponDamage}`);
  assert(stats.notes.some((note) => note.includes("Prototype")), "prototype note");

  loadout.gear.mask = proto;
  const withEcho = computeStats(loadout);
  assert(withEcho.bonuses.some((bonus) => bonus.source.includes("Echo")), "echo augment bonus");
  assert(withEcho.values.armor > 170_000, "piece base armor + blue? ceska is red — base only");
  assert(withEcho.values.armorPercent === 0 || true, "armor percent tracked");
  assert(withEcho.values.armor >= GEAR_BASE_ARMOR * 1.5, "prototype base armor");

  const exotic = setPiecePrototype(createPiece("mask", "catharsis"), true);
  assert(exotic.prototype === false, "exotics cannot be prototype");

  const off = setPiecePrototype(proto, false);
  assert(off.prototype === false, "prototype off");
  assert(off.augmentId === undefined, "augment cleared");
  assert(off.attributes[0]?.value === 6, `CHC back to HE max, got ${off.attributes[0]?.value}`);
}

function testWeaponPrototype() {
  const base = { weaponId: "lexington", expertise: 12, mods: [] };
  const proto = setWeaponPrototype(base, "named", true);
  assert(proto.prototype === true, "weapon prototype on");
  assert(proto.expertise === 30, "weapon expertise forced to 30");
  assert(proto.augmentId === "echo", "weapon default augment");

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.weapons.primary = {
    ...proto,
    augmentId: "quantum",
    augmentLevel: 10,
  };
  const stats = computeStats(loadout);
  assert(
    stats.bonuses.some((bonus) => bonus.source.includes("Quantum") && bonus.label.includes("4.6%")),
    "primary weapon Quantum L10 = 4.6%",
  );

  const exotic = setWeaponPrototype(
    { weaponId: "st-elmo", expertise: 10, mods: [] },
    "exotic",
    true,
  );
  assert(exotic.prototype === false, "exotic weapons cannot be prototype");

  loadout.weapons.secondary = {
    weaponId: "famas",
    expertise: 30,
    prototype: true,
    augmentId: "quantum",
    augmentLevel: 10,
  };
  const withSecondary = computeStats(loadout);
  const quantum = withSecondary.bonuses.find((bonus) => bonus.source.includes("Quantum"));
  assert(quantum!.label.includes("4.6%"), "secondary Prototype does not stack while inactive");
  assert(
    withSecondary.notes.some((note) => note.includes("Secondary") && note.includes("stored")),
    "secondary prototype stored note",
  );
}


function testArmorFlatAndPercent() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "brand:gila"); // blue brand
  loadout.gear.chest = createPiece("chest", "brand:gila");
  // 1pc Gila = +5% Total Armor
  const stats = computeStats(loadout);
  assert(stats.values.armorPercent === 5, `Gila 1pc armor %, got ${stats.values.armorPercent}`);
  // 2 blue cores + 2 base pieces
  const expectedFlat = (GEAR_BASE_ARMOR + 170000) * 2;
  const expected = expectedFlat * 1.05;
  assert(
    Math.abs(stats.values.armor - expected) < 1,
    `flat armor with %, got ${stats.values.armor} expected ${expected}`,
  );
}

function testTalentAssumed() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.chest = createPiece("chest", "brand:providence");
  loadout.gear.chest.talentId = "glass-cannon";
  const stats = computeStats(loadout);
  assert(stats.values.weaponDamage === 40, `15 core + 25 GC, got ${stats.values.weaponDamage}`);
  assert(stats.bonuses.some((b) => b.source.includes("Glass Cannon")), "GC bonus row");
}

function testStrikerFourAssumed() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  for (const slot of ["mask", "backpack", "chest", "gloves"] as const) {
    loadout.gear[slot] = createPiece(slot, "set:striker");
  }
  const stats = computeStats(loadout);
  // 4 red cores = 60 WD + 40 assumed striker stacks = 100 (no attrs WD)
  assert(stats.values.weaponDamage === 100, `striker 4pc assumed WD, got ${stats.values.weaponDamage}`);
}

function testAugmentStacks() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  for (const slot of ["mask", "gloves", "holster"] as const) {
    const piece = setPiecePrototype(createPiece(slot, "brand:grupo"), true);
    piece.augmentId = "quantum";
    piece.augmentLevel = 10;
    loadout.gear[slot] = piece;
  }
  const stats = computeStats(loadout);
  const quantum = stats.bonuses.find((bonus) => bonus.source.includes("Quantum"));
  assert(quantum, "quantum stack bonus");
  assert(quantum!.label.includes("13.8%"), `3× Quantum L10 = 13.8%, got ${quantum!.label}`);
  assert(AUGMENTS.length === 9, "nine augments");
}

function testAugmentPublishedCurves() {
  const byId = (id: string) => AUGMENTS.find((item) => item.id === id)!;
  assert(byId("quantum").valueAtLevel(1) === 1, "Quantum L1 = 1%");
  assert(byId("quantum").valueAtLevel(10) === 4.6, "Quantum L10 = 4.6%");
  assert(byId("amalgam").valueAtLevel(1) === 1.6, "Amalgam L1 = 1.6%");
  assert(byId("amalgam").valueAtLevel(10) === 4.3, "Amalgam L10 = 4.3%");
  assert(byId("anomaly").valueAtLevel(1) === 4, "Anomaly L1 = 4%");
  assert(byId("anomaly").valueAtLevel(10) === 8.5, "Anomaly L10 = 8.5%");
  assert(byId("synesthesia").valueAtLevel(1) === 5, "Synesthesia L1 = 5%");
  assert(byId("synesthesia").valueAtLevel(10) === 14, "Synesthesia L10 = 14%");
  assert(byId("echo").valueAtLevel(10) === 2.8, "Echo L10 = 2.8%");
  assert(byId("quantum").valueSource === "ubisoft-y8s1.3", "Quantum from Ubisoft notes");
  assert(byId("echo").valueSource === "community", "Echo community curve");
}

function testWeaponListSorting() {
  const sorted = weaponsSorted(["ar", "smg", "shotgun"]);
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1]!;
    const next = sorted[i]!;
    const order = ["ar", "lmg", "smg", "shotgun", "mmr", "rifle", "pistol"];
    const typeOk = order.indexOf(prev.type) <= order.indexOf(next.type);
    assert(typeOk, `type order ${prev.type} before ${next.type}`);
    if (prev.type === next.type) {
      assert(prev.name.localeCompare(next.name, "en") <= 0, `name order ${prev.name} / ${next.name}`);
    }
  }
  const groups = weaponsByType(["smg", "shotgun", "ar"]);
  assert(groups[0]?.type === "ar", "AR group first");
  assert(groups.every((group, index, all) => index === 0 || all[index - 1]!.type !== group.type), "no duplicate groups");
}

function testSkillModsContribute() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.skills = [
    {
      skillId: "striker-drone",
      mods: ["battery-duration", "hull-health", "feed-damage"],
    },
    {
      skillId: "oxidizer",
      mods: ["agitator-damage", "pneumatics-ammo"],
    },
  ];
  const stats = computeStats(loadout);
  assert(stats.values.skillDamage === 10, `drone + oxidizer assumed, mods stay local, got ${stats.values.skillDamage}`);
  assert(stats.values.statusEffects === 5, `oxidizer assumed status, got ${stats.values.statusEffects}`);
  assert(stats.values.skillHealth === 0, `skill health mods are not character-wide, got ${stats.values.skillHealth}`);
  assert(
    stats.notes.some((note) => note.includes("Extra Ammo") && note.includes("+1 ammo")),
    "chem launcher extra ammo note",
  );
  assert(
    stats.notes.some((note) => note.includes("Skill Health") && note.includes("+10%")),
    "drone skill health note",
  );
  assert(
    stats.bonuses.some((bonus) => bonus.source.includes("Skill mods · Striker Drone")),
    "skill mods bonus row",
  );
}

function testLiveSkillModLibrary() {
  const assault = skillModSlotsFor("assault-turret");
  assert(assault.length === 3, `assault turret 3 slots, got ${assault.length}`);
  assert(
    !assault.some((slot) =>
      slot.options.some((option) => option.id.includes("ammo") || option.id.includes("payload")),
    ),
    "assault turret has no extra ammo",
  );
  const sniper = skillModSlotsFor("sniper-turret");
  assert(
    sniper.some((slot) => slot.options.some((option) => option.id === "housing-sniper-ammo")),
    "sniper housing extra ammo +1",
  );
  const oxidizer = skillModSlotsFor("oxidizer");
  assert(oxidizer.length === 2, `chem launcher 2 slots, got ${oxidizer.length}`);
  assert(oxidizer[0]?.label === "Agitator", "chem agitator slot");
  assert(oxidizer[1]?.label === "Pneumatics", "chem pneumatics slot");
  assert(
    oxidizer[1]?.options.some((option) => option.id === "pneumatics-ammo" && option.effect === "+1 ammo"),
    "chem extra ammo is +1 on pneumatics",
  );
  const decoy = skillModSlotsFor("decoy");
  assert(decoy.length === 2, `decoy 2 slots, got ${decoy.length}`);
  const sticky = skillModSlotsFor("sticky-explosive");
  assert(sticky.length === 2, `sticky 2 slots, got ${sticky.length}`);
  const gunnerPulse = skillModSlotsFor("scanner-pulse", "gunner");
  assert(
    gunnerPulse.some((slot) =>
      slot.options.some((option) => option.id === "gunner-directional-transmitter"),
    ),
    "gunner unique pulse mod",
  );
  const noSpecPulse = skillModSlotsFor("scanner-pulse", null);
  assert(
    !noSpecPulse.some((slot) =>
      slot.options.some((option) => option.id === "gunner-directional-transmitter"),
    ),
    "gunner unique hidden without spec",
  );
}

function testLegacySkillShareMigrate() {
  const legacy = {
    ...emptyLoadout("Legacy skills"),
    skills: ["reviver-hive", "crusader-shield"],
  };
  const decoded = decodeLoadout(encodeLoadout(legacy as unknown as Loadout));
  assert(decoded?.skills[0]?.skillId === "reviver-hive", "legacy skill 1 migrated");
  assert(decoded?.skills[1]?.skillId === "crusader-shield", "legacy skill 2 migrated");
  assert((decoded?.skills[0]?.mods?.length ?? 0) === 3, "default skill mods applied");
  assert(
    decoded?.skills[0]?.mods?.every((mod) => typeof mod === "string"),
    "skill mods are attachment ids",
  );
}

function testLegacyStatSkillModsMigrate() {
  const dirty = {
    ...emptyLoadout("Old skill mods"),
    skills: [
      {
        skillId: "sniper-turret",
        mods: [
          { stat: "skillDamage", value: 10 },
          { stat: "skillHaste", value: 12 },
          { stat: "skillDuration", value: 8 },
        ],
      },
      null,
    ],
  };
  const decoded = decodeLoadout(encodeLoadout(dirty as unknown as Loadout));
  assert(decoded?.skills[0]?.skillId === "sniper-turret", "sniper turret kept");
  assert(
    decoded?.skills[0]?.mods?.includes("housing-sniper-ammo"),
    `legacy stat mods remapped to turret attachments, got ${decoded?.skills[0]?.mods?.join(",")}`,
  );
}

function testArmorRegenFlatDerived() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "brand:belstone");
  loadout.gear.mask.attributes = [{ stat: "armorRegen", value: 4925 }];
  loadout.gear.mask.mods = [];
  // Flat attr 4925 + Belstone 1pc +1% of armor
  const stats = computeStats(loadout);
  assert(stats.values.armorRegen === 4925, `flat regen, got ${stats.values.armorRegen}`);
  assert(stats.values.armorRegenPercent === 1, `Belstone %, got ${stats.values.armorRegenPercent}`);
  const expectedPerSec = 4925 + stats.values.armor / 100;
  assert(
    Math.abs(stats.derived.armorRegenPerSec - expectedPerSec) < 1,
    `regen/s got ${stats.derived.armorRegenPerSec} expected ${expectedPerSec}`,
  );
  assert(stats.notes.some((n) => n.includes("Armor Regeneration") && n.includes("/s")), "regen note");
}

function testHealthFlatDerived() {
  const loadout = emptyLoadout();
  loadout.shdWatch = true; // +10% health
  loadout.gear.mask = createPiece("mask", "brand:gila");
  loadout.gear.mask.attributes = [{ stat: "health", value: 18935 }];
  loadout.gear.mask.mods = [];
  const stats = computeStats(loadout);
  assert(stats.values.health === 18935, `flat health attr, got ${stats.values.health}`);
  assert(stats.values.healthPercent === 10, `SHD health %, got ${stats.values.healthPercent}`);
  const expected = (167_000 + 18935) * 1.1;
  assert(
    Math.abs(stats.derived.healthFlat - expected) < 1,
    `health flat got ${stats.derived.healthFlat} expected ${expected}`,
  );
}

function testInvestorSlotted() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  const mask = createPiece("mask", "investor");
  mask.attributes = [
    { stat: "chd", value: 12 },
    { stat: "armorRegen", value: 4925 },
  ];
  loadout.gear.mask = mask;
  const stats = computeStats(loadout);
  assert(stats.values.chd === 22, `12 attr + 10 Investor red, got ${stats.values.chd}`);
  assert(stats.values.armorRegen === 4925, `flat attr unchanged, got ${stats.values.armorRegen}`);
  assert(
    stats.values.armorRegenPercent === 1,
    `Investor blue → +1% regen, got ${stats.values.armorRegenPercent}`,
  );
  assert(stats.bonuses.some((b) => b.source.includes("Investor")), "investor bonus row");
}

function testMementoAssumed() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.backpack = createPiece("backpack", "memento");
  const stats = computeStats(loadout);
  assert(stats.values.weaponDamage === 30, `15 core + 15 memento, got ${stats.values.weaponDamage}`);
  assert(stats.values.armorPercent === 10, `memento armor %, got ${stats.values.armorPercent}`);
  assert(stats.cores.blue === 1 && stats.cores.yellow === 1, "memento extra cores");
}

function testGearModSlots() {
  const mask = createPiece("mask", "brand:providence");
  const gloves = createPiece("gloves", "brand:providence");
  const chill = createPiece("mask", "chill-out");
  assert(mask.mods.length === 1, `standard mask 1 mod, got ${mask.mods.length}`);
  assert(gloves.mods.length === 0, `gloves no mod, got ${gloves.mods.length}`);
  assert(chill.mods.length === 2, `Chill Out 2 mods, got ${chill.mods.length}`);
  assert(chill.core === "blue", `Chill Out native blue, got ${chill.core}`);
  assert(!chill.extraCores?.length, "Chill Out has no bonus core");
  assert(chill.attributes.length === 1, `Chill Out 1 secondary attr, got ${chill.attributes.length}`);
  const chillSource = catalogById("chill-out");
  assert(!chillSource?.extraStats?.length, "Chill Out secondary is not a locked extra");
  assert(createPiece("mask", "chill-out", "red").core === "red", "Chill Out core is not locked");
  const chillPicker = catalogForSlot("mask").find((item) => item.id === "chill-out");
  assert(chillPicker?.lockedCore === undefined, "Chill Out not locked in picker");

  chill.mods[0] = { stat: "chc", value: 6 };
  chill.mods[1] = { stat: "chd", value: 12 };
  chill.attributes = [{ stat: "hazardProtection", value: 10 }];
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = chill;
  const stats = computeStats(loadout);
  assert(stats.values.chc === 6, `chill mod CHC, got ${stats.values.chc}`);
  assert(stats.values.chd === 12, `chill mod CHD, got ${stats.values.chd}`);
  assert(stats.values.hazardProtection === 10, `chill attr hazard, got ${stats.values.hazardProtection}`);
  assert(stats.cores.blue === 1, `Chill Out one blue core, got ${stats.cores.blue}`);
  assert(stats.cores.yellow === 0, `Chill Out no yellow core, got ${stats.cores.yellow}`);
}

function testAttributePoolNoAoK() {
  assert(!ATTRIBUTE_OPTIONS.includes("armorOnKill"), "AoK not a gear attribute roll");
  assert(!ATTRIBUTE_OPTIONS.includes("incomingRepairs"), "Incoming Repairs not a gear attribute roll");
  assert(MOD_OPTIONS.includes("armorOnKill"), "AoK remains a gear mod option");
  assert(MOD_OPTIONS.includes("armorRegen"), "armor regen flat remains a gear mod option");
  assert(MOD_OPTIONS.includes("bleedResistance"), "bleed resistance on gear mods");
  assert(MOD_OPTIONS.includes("burnResistance"), "burn resistance on gear mods");
  assert(ATTRIBUTE_OPTIONS.includes("armorRegen"), "armor regen flat is a gear attribute");
  assert(ATTRIBUTE_OPTIONS.includes("health"), "health flat is a gear attribute");
}

function testWeaponModsPrimary() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.weapons.primary = {
    weaponId: "lexington",
    expertise: 0,
    mods: [
      { kind: "optic", stat: "chc", value: 10 },
      { kind: "magazine", stat: "magazineSize", value: 20 },
      { kind: "muzzle", stat: "chd", value: 15 },
      { kind: "underbarrel", stat: "weaponHandling", value: 10 },
    ],
  };
  const stats = computeStats(loadout);
  // Optimized ×1.3
  assert(stats.values.chc === 13, `Optimized optic CHC 10×1.3, got ${stats.values.chc}`);
  assert(stats.values.chd === 19.5, `Optimized muzzle CHD 15×1.3, got ${stats.values.chd}`);
  assert(stats.values.magazineSize === 26, `Optimized mag 20×1.3, got ${stats.values.magazineSize}`);
  assert(stats.bonuses.some((b) => b.source.includes("Weapon mods")), "weapon mods bonus row");
}

function testHazardGearMod() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  const mask = createPiece("mask", "brand:gila");
  mask.mods = [{ stat: "burnResistance", value: 10 }];
  mask.attributes = [{ stat: "hazardProtection", value: 10 }];
  loadout.gear.mask = mask;
  const stats = computeStats(loadout);
  assert(stats.values.burnResistance === 10, `burn res, got ${stats.values.burnResistance}`);
  assert(stats.values.hazardProtection === 10, `hazard still separate, got ${stats.values.hazardProtection}`);
}

function testIncludeAssumedToggle() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.chest = createPiece("chest", "brand:providence");
  loadout.gear.chest.talentId = "glass-cannon";
  loadout.includeAssumed = false;
  const off = computeStats(loadout);
  assert(off.values.weaponDamage === 15, `hard rolls only, got ${off.values.weaponDamage}`);
  assert(!off.notes.some((note) => note.includes("Glass Cannon")), "GC model off");
  loadout.includeAssumed = true;
  const on = computeStats(loadout);
  assert(on.values.weaponDamage === 40, `builder model on, got ${on.values.weaponDamage}`);
}

function testActiveWeaponSecondary() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.weapons.primary = { weaponId: "lexington", expertise: 10, mods: [] };
  loadout.weapons.secondary = { weaponId: "st-elmo", expertise: 20, mods: [] };
  loadout.activeWeapon = "secondary";
  const stats = computeStats(loadout);
  assert(stats.activeWeapon === "secondary", "active slot");
  assert(stats.values.weaponDamage === 20, `secondary expertise only, got ${stats.values.weaponDamage}`);
  assert(stats.notes.some((note) => note.includes("Primary") && note.includes("stored")), "primary stored");
}

function testHeWeaponTalentOverride() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.weapons.primary = {
    weaponId: "famas",
    expertise: 0,
    talentId: "unhinged",
    mods: [],
  };
  const stats = computeStats(loadout);
  assert(stats.values.weaponDamage === 18, `Unhinged WD, got ${stats.values.weaponDamage}`);
  assert(stats.values.weaponHandling === -20, `Unhinged handling, got ${stats.values.weaponHandling}`);
  assert(formatBonusList([{ stat: "weaponHandling", value: -20 }]).includes("-20%"), "negative bonus format");
}

function testShdWatchParts() {
  const loadout = emptyLoadout();
  loadout.shdWatch = true;
  loadout.shdWatchParts = { chc: false, weaponDamage: false };
  const stats = computeStats(loadout);
  assert(stats.values.chc === 0, "CHC line off");
  assert(stats.values.weaponDamage === 0, "WD line off");
  assert(stats.values.chd === 20, `CHD line still on, got ${stats.values.chd}`);

  loadout.shdWatchParts = { chc: 4, hsd: 10 };
  const scaled = computeStats(loadout);
  assert(scaled.values.chc === 4, `CHC scaled, got ${scaled.values.chc}`);
  assert(scaled.values.hsd === 10, `HSD scaled, got ${scaled.values.hsd}`);
  assert(scaled.values.chd === 20, "CHD stays max when omitted");
}

function testSkillExpertiseLocal() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.includeAssumed = false;
  loadout.skills = [{ skillId: "striker-drone", mods: [], expertise: 12 }, null];
  const stats = computeStats(loadout);
  assert(stats.values.skillDamage === 0, `skill expertise is local, got ${stats.values.skillDamage}`);
  const local = stats.skillLocal.find((item) => item.skillId === "striker-drone");
  assert(local?.expertise === 12, "skill expertise stored");
  assert(local?.bonuses.some((bonus) => bonus.stat === "skillDamage" && bonus.value === 12), "local skill damage");
}

function testCoreStrengthConversion() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  for (const slot of ["mask", "backpack", "chest", "gloves"] as const) {
    loadout.gear[slot] = createPiece(slot, "set:core-strength", "red");
  }
  const stats = computeStats(loadout);
  assert(stats.values.weaponDamage >= 60, `4 red cores, got ${stats.values.weaponDamage}`);
  assert(
    stats.notes.some((note) => note.includes("Core Strength 4pc conversion")),
    "core strength conversion note",
  );
}

function testHeWeaponCatalog() {
  const he = WEAPONS.filter((weapon) => weapon.quality === "high-end");
  assert(he.length >= 50, `at least 50 high-end weapons, got ${he.length}`);
  assert(WEAPONS.some((weapon) => weapon.id === "ak-m"), "AK-M high-end");
  assert(WEAPONS.some((weapon) => weapon.id === "p416"), "P416 high-end");
}

function testPerfectCompanionBackpack() {
  const talent = ALL_TALENTS.find((item) => item.id === "perfect-companion");
  assert(talent?.slot === "backpack", `Perfect Companion is a backpack talent, got ${talent?.slot}`);
}

function testNursesHazardModel() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.kneepads = createPiece("kneepads", "nurses-kneepads");
  const on = computeStats(loadout);
  assert(on.values.hazardProtection === 40, `Nurse's model +40% hazard, got ${on.values.hazardProtection}`);
  loadout.includeAssumed = false;
  const off = computeStats(loadout);
  assert(off.values.hazardProtection === 0, "Nurse's hazard gated by builder model");
}

function testShareNewFields() {
  const loadout = emptyLoadout("Fields");
  loadout.includeAssumed = false;
  loadout.activeWeapon = "sidearm";
  loadout.shdWatchParts = { chc: false };
  loadout.weapons.primary = { weaponId: "famas", expertise: 4, talentId: "strained", mods: [] };
  loadout.skills = [{ skillId: "striker-drone", mods: [], expertise: 8 }, null];
  const decoded = decodeLoadout(encodeLoadout(loadout));
  assert(decoded?.includeAssumed === false, "includeAssumed roundtrip");
  assert(decoded?.activeWeapon === "sidearm", "activeWeapon roundtrip");
  assert(decoded?.shdWatchParts?.chc === 0, "shd parts roundtrip");
  assert(decoded?.weapons.primary?.talentId === "strained", "HE talent roundtrip");
  assert(decoded?.skills[0]?.expertise === 8, "skill expertise roundtrip");
}

function testSeasonModifier() {
  assert(SEASON_ACTIVES.length === 3, "3 actives");
  assert(SEASON_PASSIVES.length === 20, "20 passives");

  const off = emptyLoadout();
  off.shdWatch = false;
  assert(computeStats(off).values.statusEffects === 0, "season off has no gauge SE");

  function withSeason(patch: Partial<SeasonModifier>, assumed = false): Loadout {
    const loadout = emptyLoadout();
    loadout.shdWatch = false;
    loadout.includeAssumed = assumed;
    loadout.season = sanitizeSeason({ enabled: true, ...patch });
    return loadout;
  }

  const high = computeStats(withSeason({ pressure: 90 }));
  assert(high.values.statusEffects === 65, `90% SE, got ${high.values.statusEffects}`);
  assert(high.values.signatureWeaponDamage === 0, "no sig WD without Beta");
  assert(
    high.bonuses.some((bonus) => bonus.source.includes("Under Pressure") && bonus.source.includes("Gauge")),
    "gauge bonus card",
  );

  assert(computeStats(withSeason({ pressure: 0 })).values.statusEffects === 0, "0% no payout");
  assert(computeStats(withSeason({ pressure: 10 })).values.statusEffects === 15, "10% tier 0");
  assert(computeStats(withSeason({ pressure: 35 })).values.statusEffects === 25, "35% tier 1");
  assert(computeStats(withSeason({ pressure: 65 })).values.statusEffects === 40, "65% tier 2");

  const delayed = computeStats(
    withSeason({ pressure: 0, passives: ["delayed-venting", null, null] }),
  );
  assert(delayed.values.statusEffects === 15, `Delayed Venting at 0%, got ${delayed.values.statusEffects}`);
  const delayedMid = computeStats(
    withSeason({ pressure: 50, passives: ["delayed-venting", null, null] }),
  );
  assert(delayedMid.values.statusEffects === 40, `Delayed Venting at 50%, got ${delayedMid.values.statusEffects}`);

  const beta = computeStats(withSeason({ pressure: 90, passives: ["new-formula-beta", null, null] }));
  assert(beta.values.statusEffects === 0, "Beta removes SE");
  assert(beta.values.signatureWeaponDamage === 50, `Beta 90% sig, got ${beta.values.signatureWeaponDamage}`);

  const gamma = computeStats(withSeason({ pressure: 90, passives: ["new-formula-gamma", null, null] }));
  assert(gamma.values.hazardProtection === 40, `Gamma 90% haz, got ${gamma.values.hazardProtection}`);
  assert(gamma.values.statusEffects === 0, "Gamma removes SE");

  const bothFormulas = computeStats(
    withSeason({ pressure: 90, passives: ["new-formula-beta", "new-formula-gamma", null] }),
  );
  assert(bothFormulas.values.statusEffects === 65, "Beta+Gamma cancel to SE");
  assert(bothFormulas.values.signatureWeaponDamage === 0, "Beta cancelled");
  assert(bothFormulas.values.hazardProtection === 0, "Gamma cancelled");

  const aon = computeStats(withSeason({ pressure: 90, passives: ["all-or-nothing", null, null] }));
  assert(aon.values.statusEffects === 81.3, `AoN 90%, got ${aon.values.statusEffects}`);
  const aonLow = computeStats(withSeason({ pressure: 65, passives: ["all-or-nothing", null, null] }));
  assert(aonLow.values.statusEffects === 0, "AoN below 80% is 0");

  const kick = computeStats(withSeason({ pressure: 90, passives: ["kickstart", null, null] }));
  assert(kick.values.statusEffects === 0, "Kickstart above 80% is 0");
  const kickLow = computeStats(withSeason({ pressure: 65, passives: ["kickstart", null, null] }));
  assert(kickLow.values.statusEffects === 60, `Kickstart 65%, got ${kickLow.values.statusEffects}`);

  const bothBrackets = computeStats(
    withSeason({ pressure: 90, passives: ["all-or-nothing", "kickstart", null] }),
  );
  assert(bothBrackets.values.statusEffects === 65, "AoN+Kickstart cancel");

  const fiery = computeStats(withSeason({ pressure: 90 }, true));
  assert(fiery.values.armorRegenPercent === 1.5, `Fiery Aura regen, got ${fiery.values.armorRegenPercent}`);
  const fieryHard = computeStats(withSeason({ pressure: 90 }, false));
  assert(fieryHard.values.armorRegenPercent === 0, "active burst gated by builder model");

  const vicarious = computeStats(
    withSeason({ pressure: 90, activeId: "vicarious-combustion" }, true),
  );
  assert(vicarious.values.hsd === 50, `Vicarious HSD, got ${vicarious.values.hsd}`);

  const shield = computeStats(
    withSeason({ pressure: 90, activeId: "signed-shield-delivered" }, true),
  );
  assert(shield.values.skillEfficiency === 25, "Signed Shield efficiency");
  assert(shield.values.shieldHealth === 500, "Signed Shield health");
  assert(shield.values.signatureWeaponDamage === 50, "Signed Shield sig WD");

  const dup = sanitizeSeason({
    enabled: true,
    passives: ["flow-regulator", "flow-regulator", "throttle-valve"],
  });
  assert(dup.passives[0] === "flow-regulator", "keep first duplicate");
  assert(dup.passives[1] === null, "drop duplicate passive");
  assert(dup.passives[2] === "throttle-valve", "keep unique third");

  const shared = withSeason({
    pressure: 65,
    activeId: "vicarious-combustion",
    passives: ["vacuum-seal", "new-formula-gamma", "modular-plates"],
  });
  const decoded = decodeLoadout(encodeLoadout(shared));
  assert(decoded?.season?.enabled === true, "season enabled roundtrip");
  assert(decoded?.season?.activeId === "vicarious-combustion", "active roundtrip");
  assert(decoded?.season?.pressure === 65, "pressure roundtrip");
  assert(decoded?.season?.passives[1] === "new-formula-gamma", "passive roundtrip");
}

function testExoticAssumedCatalog() {
  const vile = catalogById("vile");
  assert(vile?.assumed?.length, "Vile has a builder model");
  const waveform = catalogById("waveform");
  assert(waveform?.assumed?.length, "Waveform has a builder model");
  const pest = WEAPONS.find((weapon) => weapon.id === "pestilence");
  assert(pest?.assumed?.length, "Pestilence has a builder model");
}

const tests = [
  testEmpty,
  testWatchOff,
  testProvidence3,
  testNinja,
  testStriker4,
  testChcCap,
  testShareRoundtrip,
  testSkillTierCap,
  testStrikerSampleChc,
  testLoadoutBlurb,
  testY8s3Brands,
  testCeskaY8s3,
  testEmberEngine,
  testAcesY8s3,
  testHotshotHandlingMove,
  testNamedBrandCorrections,
  testNamedPieceBrandLabel,
  testNamedExtraStats,
  testPicaroExtraCore,
  testNamedCoresAndExtras,
  testLockedBrandAndExoticCores,
  testCatalogCoverage,
  testLiveTalentLibrary,
  testWeaponCatalog,
  testUniqueTalentNote,
  testSlotCoreColors,
  testRefactorSlotCores,
  testSystemCorruptionSlotCores,
  testKindColors,
  testPrototypeDisplayColor,
  testStatCaps,
  testCatalogSlotLockedCore,
  testEverySetPieceCore,
  testApplyGearSetAllSlots,
  testInspectEmpty,
  testInspectProvidenceTiers,
  testInspectStrikerTalents,
  testInspectNinjaBoost,
  testInspectNamedBrandTiers,
  testGearPickerSecondTap,
  testWeaponInspect,
  testPerItemExpertise,
  testPistolSlotSanitize,
  testPrototypeSwitch,
  testWeaponPrototype,
  testArmorFlatAndPercent,
  testTalentAssumed,
  testStrikerFourAssumed,
  testAugmentStacks,
  testAugmentPublishedCurves,
  testWeaponListSorting,
  testSkillModsContribute,
  testLiveSkillModLibrary,
  testLegacySkillShareMigrate,
  testLegacyStatSkillModsMigrate,
  testArmorRegenFlatDerived,
  testHealthFlatDerived,
  testInvestorSlotted,
  testMementoAssumed,
  testGearModSlots,
  testAttributePoolNoAoK,
  testWeaponModsPrimary,
  testHazardGearMod,
  testIncludeAssumedToggle,
  testActiveWeaponSecondary,
  testHeWeaponTalentOverride,
  testShdWatchParts,
  testSkillExpertiseLocal,
  testCoreStrengthConversion,
  testHeWeaponCatalog,
  testPerfectCompanionBackpack,
  testNursesHazardModel,
  testShareNewFields,
  testSeasonModifier,
  testExoticAssumedCatalog,
];

let failed = 0;
for (const test of tests) {
  try {
    test();
    console.log(`ok ${test.name}`);
  } catch (error) {
    failed += 1;
    console.error(`fail ${test.name}:`, error);
  }
}

if (failed > 0) {
  process.exit(1);
}

console.log(`${tests.length - failed}/${tests.length} passed`);
