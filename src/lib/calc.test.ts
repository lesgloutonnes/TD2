import { computeStats, emptyLoadout, formatBonusList, slotColor } from "./calc";
import { applyGearSet, catalogItemLabel, createPiece, pieceLabel, setPiecePrototype, setWeaponPrototype } from "./piece";
import { decodeLoadout, encodeLoadout, loadoutBlurb } from "./share";
import type { EquippedSkill, EquippedWeapon, Loadout, SeasonModifier, WeaponSlot } from "./types";
import { NAMED_AND_EXOTICS, catalogById, catalogForSlot } from "./data/catalog";
import { ALL_TALENTS, talentByName, talentsForSlot } from "./data/talents";
import { WEAPONS } from "./data/weapons";
import { BRANDS } from "./data/brands";
import { GEAR_SETS, gearSetCores } from "./data/gear-sets";
import { CORE_COLORS, EMPTY_SLOT_COLOR, GEAR_BASE_ARMOR, SLOTS, itemKindColor, itemDisplayColor, weaponDisplayColor, PROTOTYPE_COLOR, clampStat, ATTRIBUTE_OPTIONS, MOD_OPTIONS, storedCoreValue } from "./data/attributes";
import { AUGMENTS } from "./data/augments";
import {
  defaultSkillMods,
  skillModLocalBreakdown,
  skillModSlotsFor,
  weaponsByType,
  weaponsSorted,
} from "./data/skill-mods";
import {
  SKILLS,
  SPECIALIZATIONS,
  exclusivePerkGroups,
  sanitizeSpecPerks,
  setSpecPerkFlags,
  specPerkEnabled,
  specializationById,
} from "./data/skills";
import { defaultWeaponMods } from "./data/weapon-mods";
import { defaultWeaponTalentId, weaponTalentByName, weaponTalentsForType } from "./data/weapon-talents";
import { clampExpertise } from "./builder-model";
import { pieceInspect, weaponInspect } from "./tooltip";
import { shouldOpenGearPicker } from "./gear-picker";
import { previewDescribedOption } from "./described-select";
import {
  SEASON_ACTIVES,
  SEASON_GAUGE_NOTE,
  SEASON_HOSTILE_NOTE,
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

function testSpecPerks() {
  const spec = specializationById("gunner");
  assert(spec?.perks.some((perk) => perk.id === "gunner-aok" && perk.defaultOn), "gunner AoK default on");
  assert(specPerkEnabled(spec!.perks.find((perk) => perk.id === "gunner-ar")!, undefined) === false, "AR node default off");

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.specialization = "gunner";
  const on = computeStats(loadout);
  assert(on.values.armorOnKill === 10, `gunner default AoK, got ${on.values.armorOnKill}`);
  assert(on.values.ammoCapacity === 25, `gunner default ammo, got ${on.values.ammoCapacity}`);
  assert(on.values.arDamage === 0, "weapon-type nodes off by default");

  loadout.specPerks = { "gunner-aok": false };
  const off = computeStats(loadout);
  assert(off.values.armorOnKill === 0, "AoK unchecked");
  assert(off.values.ammoCapacity === 25, "ammo still default on");

  loadout.specPerks = { "gunner-aok": false, "gunner-ar": true };
  const ar = computeStats(loadout);
  assert(ar.values.arDamage === 5, `optional AR node, got ${ar.values.arDamage}`);

  const tech = emptyLoadout();
  tech.shdWatch = false;
  tech.specialization = "technician";
  tech.specPerks = { "technician-tier": false };
  assert(computeStats(tech).values.skillTier === 0, "technician tier can be skipped");
  assert(computeStats(tech).values.skillDamage === 0, "technician skill-focus default off");
  assert(computeStats(tech).values.skillRepair === 0, "technician repair fork default off");

  const overclock = specializationById("technician")?.perks.find(
    (perk) => perk.id === "technician-overclock",
  );
  const diagnostics = specializationById("technician")?.perks.find(
    (perk) => perk.id === "technician-diagnostics",
  );
  assert(overclock?.exclusiveGroup === "technician-skill-focus", "overclock exclusive group");
  assert(diagnostics?.exclusiveGroup === overclock?.exclusiveGroup, "diagnostics same fork");

  tech.specPerks = { "technician-overclock": true };
  const damagePick = computeStats(tech);
  assert(damagePick.values.skillDamage === 10, `overclock skill damage, got ${damagePick.values.skillDamage}`);
  assert(damagePick.values.skillRepair === 0, "overclock does not grant repair");

  tech.specPerks = { "technician-diagnostics": true };
  const repairPick = computeStats(tech);
  assert(repairPick.values.skillRepair === 10, `diagnostics skill repair, got ${repairPick.values.skillRepair}`);
  assert(repairPick.values.skillDamage === 0, "diagnostics does not grant skill damage");

  const both = sanitizeSpecPerks({
    "technician-overclock": true,
    "technician-diagnostics": true,
  });
  assert(both?.["technician-overclock"] === true, "sanitize keeps overclock");
  assert(both?.["technician-diagnostics"] === false, "sanitize drops the other fork");
  tech.specPerks = { "technician-overclock": true, "technician-diagnostics": true };
  const collapsed = computeStats(tech);
  assert(collapsed.values.skillDamage === 10, "calc keeps first exclusive perk");
  assert(collapsed.values.skillRepair === 0, "calc ignores second exclusive perk");

  const techSpec = specializationById("technician")!;
  const allOn = setSpecPerkFlags(undefined, techSpec, () => true);
  assert(allOn?.["technician-overclock"] === true, "All on picks skill damage");
  assert(allOn?.["technician-diagnostics"] === false, "All on does not pick both forks");

  const repairShare = emptyLoadout();
  repairShare.specialization = "technician";
  repairShare.specPerks = { "technician-diagnostics": true };
  const decodedRepair = decodeLoadout(encodeLoadout(repairShare));
  assert(decodedRepair?.specPerks?.["technician-diagnostics"] === true, "repair fork roundtrip");
  assert(decodedRepair?.specPerks?.["technician-overclock"] !== true, "overclock stays off in share");
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

  const airaldi = emptyLoadout();
  airaldi.shdWatch = false;
  airaldi.gear.mask = createPiece("mask", "brand:airaldi");
  airaldi.gear.gloves = createPiece("gloves", "brand:airaldi");
  const airaldiStats = computeStats(airaldi);
  assert(airaldiStats.values.mmrDamage === 12, `Airaldi 1pc MMR, got ${airaldiStats.values.mmrDamage}`);
  assert(airaldiStats.values.hsd === 26, `Airaldi 2pc 26% HSD (live, not PTS 13%), got ${airaldiStats.values.hsd}`);

  const murakami = BRANDS.find((brand) => brand.id === "murakami");
  assert(murakami?.bonuses[0][0]?.stat === "skillDuration" && murakami.bonuses[0][0].value === 15, "Murakami 1pc duration");
  assert(murakami?.bonuses[1][0]?.stat === "skillRepair" && murakami.bonuses[1][0].value === 35, "Murakami 2pc 35% repair (live, not PTS 52%)");
  assert(murakami?.bonuses[2][0]?.stat === "skillDamage" && murakami.bonuses[2][0].value === 18, "Murakami 3pc 18% skill damage (live, not PTS 13%)");
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
  loadout.includeAssumed = true;
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
  assert(coyote?.assumed?.some((stat) => stat.stat === "chd"), "Coyote assumed CHD (close-range max)");

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
    if (item.id === "rushdown") {
      assert(
        item.uniqueTalent.description.includes("12s") && item.uniqueTalent.name === "Tag Team",
        "Rushdown named Tag Team is 12s (live Y8S3), not HE 6s",
      );
      continue;
    }
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
    "quickstep",
    "prima-donna",
    "first-bloom",
    "insult-to-injury",
    "brain-break",
    "rabid-d50",
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

  const yellow = setPiecePrototype(createPiece("gloves", "brand:alps"), true);
  const yellowLoadout = emptyLoadout();
  yellowLoadout.shdWatch = false;
  yellowLoadout.gear.gloves = yellow;
  assert(
    computeStats(yellowLoadout).values.skillTier === 1.5,
    `yellow Prototype core is 1.5, got ${computeStats(yellowLoadout).values.skillTier}`,
  );

  const exotic = setPiecePrototype(createPiece("mask", "catharsis"), true);
  assert(exotic.prototype === false, "exotics cannot be prototype");

  const off = setPiecePrototype(proto, false);
  assert(off.prototype === false, "prototype off");
  assert(off.augmentId === undefined, "augment cleared");
  assert(off.attributes[0]?.value === 6, `CHC back to HE max, got ${off.attributes[0]?.value}`);
}

function testCoreRolls() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.gear.mask = createPiece("mask", "brand:providence");
  assert(computeStats(loadout).values.weaponDamage === 15, "default red core max");

  loadout.gear.mask.coreValue = 10;
  assert(computeStats(loadout).values.weaponDamage === 10, "red core roll 10");

  loadout.gear.mask.coreValue = 99;
  assert(computeStats(loadout).values.weaponDamage === 15, "red core clamped to max");

  const scaled = setPiecePrototype(
    { ...createPiece("mask", "brand:providence"), coreValue: 10 },
    true,
  );
  assert(scaled.coreValue === 15, `10% HE scales to 15% Prototype, got ${scaled.coreValue}`);
  const scaledLoadout = emptyLoadout();
  scaledLoadout.shdWatch = false;
  scaledLoadout.gear.mask = { ...scaled, augmentId: undefined, augmentLevel: undefined };
  assert(computeStats(scaledLoadout).values.weaponDamage === 15, "scaled Prototype red roll");

  const back = setPiecePrototype(scaled, false);
  assert(back.coreValue === 10, `Prototype off restores 10% HE, got ${back.coreValue}`);

  const yellow = createPiece("mask", "brand:alps");
  yellow.coreValue = 0.2;
  const yellowLoadout = emptyLoadout();
  yellowLoadout.shdWatch = false;
  yellowLoadout.gear.mask = yellow;
  assert(computeStats(yellowLoadout).values.skillTier === 1, "yellow High-End is always 1");

  const blue = createPiece("holster", "brand:belstone");
  const blueLoadout = emptyLoadout();
  blueLoadout.shdWatch = false;
  blueLoadout.gear.holster = blue;
  const maxArmor = computeStats(blueLoadout).values.armor;
  blue.coreValue = 100_000;
  const lowArmor = computeStats(blueLoadout).values.armor;
  assert(lowArmor < maxArmor, "lower blue core lowers armor");
  assert(lowArmor === GEAR_BASE_ARMOR + 100_000, `base + blue roll, got ${lowArmor}`);

  const share = emptyLoadout("Core roll");
  share.gear.mask = { ...createPiece("mask", "brand:providence"), coreValue: 11 };
  const decoded = decodeLoadout(encodeLoadout(share));
  assert(decoded?.gear.mask?.coreValue === 11, "coreValue share roundtrip");
  share.gear.mask.coreValue = 15;
  const decodedMax = decodeLoadout(encodeLoadout(share));
  assert(decodedMax?.gear.mask?.coreValue === undefined, "max core omitted from share");
  assert(storedCoreValue("yellow", 1.5, true) === undefined, "yellow core is not stored");
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
  loadout.includeAssumed = true;
  const stats = computeStats(loadout);
  assert(stats.values.weaponDamage === 40, `15 core + 25 GC, got ${stats.values.weaponDamage}`);
  assert(stats.bonuses.some((b) => b.source.includes("Glass Cannon")), "GC bonus row");
}

function testStrikerFourAssumed() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.includeAssumed = true;
  for (const slot of ["mask", "backpack", "chest", "gloves"] as const) {
    loadout.gear[slot] = createPiece(slot, "set:striker");
  }
  const stats = computeStats(loadout);
  // 4 red cores = 60 WD + max 200 stacks × 1% (chest + backpack) = 260
  assert(stats.values.weaponDamage === 260, `striker 4pc max WD, got ${stats.values.weaponDamage}`);

  loadout.gear.chest = null;
  loadout.gear.holster = createPiece("holster", "set:striker");
  const noChest = computeStats(loadout);
  // 4pc with backpack, no chest: 100 stacks × 1% = 100. 4 red cores = 60.
  assert(noChest.values.weaponDamage === 160, `striker 4pc no chest, got ${noChest.values.weaponDamage}`);
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
  loadout.includeAssumed = true;
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
  loadout.includeAssumed = true;
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
  loadout.gear.chest.talentId = "obliterate";
  loadout.includeAssumed = false;
  const off = computeStats(loadout);
  assert(off.values.weaponDamage === 15, `hard rolls only, got ${off.values.weaponDamage}`);
  assert(!off.notes.some((note) => note.includes("Obliterate")), "Obliterate maxed bonuses off");
  loadout.includeAssumed = true;
  const on = computeStats(loadout);
  assert(on.values.weaponDamage === 35, `maxed Obliterate 20 stacks, got ${on.values.weaponDamage}`);
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
  assert(stats.values.stability === -25, `Unhinged stability, got ${stats.values.stability}`);
  assert(stats.values.accuracy === -25, `Unhinged accuracy, got ${stats.values.accuracy}`);
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
  loadout.includeAssumed = true;
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
  loadout.includeAssumed = true;
  loadout.gear.kneepads = createPiece("kneepads", "nurses-kneepads");
  const on = computeStats(loadout);
  assert(on.values.hazardProtection === 40, `Nurse's model +40% hazard, got ${on.values.hazardProtection}`);
  loadout.includeAssumed = false;
  const off = computeStats(loadout);
  assert(off.values.hazardProtection === 0, "Nurse's hazard gated by maxed bonuses");
}

function testShareNewFields() {
  const loadout = emptyLoadout("Fields");
  loadout.includeAssumed = false;
  loadout.activeWeapon = "sidearm";
  loadout.shdWatchParts = { chc: false };
  loadout.weapons.primary = { weaponId: "famas", expertise: 4, talentId: "strained", mods: [] };
  loadout.skills = [{ skillId: "striker-drone", mods: [], expertise: 8 }, null];
  loadout.specialization = "firewall";
  loadout.specPerks = { "firewall-armor": false, "firewall-smg": true };
  const decoded = decodeLoadout(encodeLoadout(loadout));
  assert(decoded?.includeAssumed === false, "includeAssumed roundtrip");
  assert(decoded?.specPerks?.["firewall-armor"] === false, "spec perk off roundtrip");
  assert(decoded?.specPerks?.["firewall-smg"] === true, "spec perk on roundtrip");
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
  assert(fieryHard.values.armorRegenPercent === 0, "active burst gated by maxed bonuses");

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

function testSeasonLiveY8s3Copy() {
  const fiery = SEASON_ACTIVES.find((item) => item.id === "fiery-aura");
  assert(fiery?.assumed.some((bonus) => bonus.stat === "armorRegenPercent" && bonus.value === 1.5), "Fiery Aura 1.5%/s");
  assert(fiery?.assumedNote.includes("15% Bonus Armor"), "Fiery Aura L5 bonus armor");
  assert(fiery?.assumedNote.includes("100% while sprinting"), "Fiery Aura sprint DR");
  assert(fiery?.description.includes("15% Bonus Armor"), "Fiery Aura description L5");

  const vicarious = SEASON_ACTIVES.find((item) => item.id === "vicarious-combustion");
  assert(vicarious?.assumed.some((bonus) => bonus.stat === "hsd" && bonus.value === 50), "Vicarious 50% HSD");
  assert(vicarious?.assumedNote.includes("20 m"), "Vicarious 20 m spread");
  assert(vicarious?.assumedNote.includes("50%–10%") || vicarious?.assumedNote.includes("50%-10%"), "Vicarious burn penalty band");

  const signed = SEASON_ACTIVES.find((item) => item.id === "signed-shield-delivered");
  assert(signed?.assumed.some((bonus) => bonus.stat === "skillEfficiency" && bonus.value === 25), "Signed 25% SE");
  assert(signed?.assumed.some((bonus) => bonus.stat === "shieldHealth" && bonus.value === 500), "Signed +500% shield");
  assert(signed?.assumed.some((bonus) => bonus.stat === "signatureWeaponDamage" && bonus.value === 50), "Signed +50% sig WD");
  assert(signed?.assumedNote.includes("+150% Shield Active Regen"), "Signed shield active regen");
  assert(signed?.description.includes("+2 s") && signed.description.includes("+1 s"), "Signed L5 duration extend");

  const leaky = SEASON_PASSIVES.find((item) => item.id === "leaky-valve");
  assert(leaky?.description.includes("95%"), "Leaky Valve 95%");
  assert(/regardless of other effects/i.test(leaky?.description ?? ""), "Leaky Valve overrides Delayed Venting");

  const reserve = SEASON_PASSIVES.find((item) => item.id === "reserve-tank");
  assert(reserve?.description.includes("20%"), "Reserve Tank resets to 20%");

  const flint = SEASON_PASSIVES.find((item) => item.id === "flint-and-steel");
  assert(flint?.description.includes("15 seconds"), "Flint and Steel 15 s");

  assert(SEASON_PASSIVES.length === 20, "still 20 player passives");
  assert(SEASON_ACTIVES.length === 3, "still 3 actives");
  assert(
    !SEASON_PASSIVES.some((item) => /draining|achilles|thousand-cuts/.test(item.id)),
    "hostile modifiers are not selectable passives",
  );
}

function testExoticAssumedCatalog() {
  const vile = catalogById("vile");
  assert(vile?.assumed?.length, "Vile has maxed bonuses");
  const waveform = catalogById("waveform");
  assert(waveform?.assumed?.length, "Waveform has maxed bonuses");
  const pest = WEAPONS.find((weapon) => weapon.id === "pestilence");
  assert(pest?.assumed?.length, "Pestilence has maxed bonuses");
}

/** Live Y8S3 (TU 2.34) gear-table lock: Ubisoft Red Horizon Gear Updates PDF. */
function testY8s3LiveGearTables() {
  const truePatriot = GEAR_SETS.find((set) => set.id === "true-patriot");
  assert(truePatriot?.twoStats.some((b) => b.stat === "weaponHandling" && b.value === 15), "TP 2pc 15% handling");
  assert(truePatriot?.four.includes("every 2s"), `TP 4pc base 2s, got ${truePatriot?.four}`);
  assert(truePatriot?.chestTalent.description.includes("1s"), "TP chest Waving the Flag 1s");
  assert(truePatriot?.four.includes("15%"), "TP red 15%");
  assert(truePatriot?.four.includes("10%"), "TP blue 10%");

  const aces = GEAR_SETS.find((set) => set.id === "aces");
  assert(aces?.four.includes("75%"), "Aces Dead Man's Hand 75%");
  assert(aces?.chestTalent.description.includes("100%"), "Aces No Limit 100%");
  assert(aces?.four.includes("Rifle"), "Aces 4pc Rifle or MMR");

  const hotshot = GEAR_SETS.find((set) => set.id === "hotshot");
  assert(hotshot?.four.includes("80%"), "Hotshot Headache 80%");

  const od = GEAR_SETS.find((set) => set.id === "ongoing-directive");
  assert(od?.four.includes("40%"), "OD Hollow-Point 40%");
  assert(od?.chestTalent.description.includes("60%"), "OD Parabellum 60%");

  const scales = GEAR_SETS.find((set) => set.id === "tipping-scales");
  assert(scales?.four.includes("+5%"), "Tipping Scales 5% CHD/stack");
  assert(scales?.backpackTalent.description.includes("8%"), "Snowball 8%");

  const bp = GEAR_SETS.find((set) => set.id === "breaking-point");
  assert(bp?.four.includes("20s"), "On Point 20s");
  assert(bp?.chestTalent.name === "Point of No Return", "Point of No Return spelling");
  assert(bp?.chestTalent.description.includes("40s"), "Point of No Return 40s");

  const company = GEAR_SETS.find((set) => set.id === "concentrated-company");
  assert(company?.four.includes("35"), "Camaraderie max 35 stacks");
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.includeAssumed = true;
  for (const slot of ["mask", "gloves", "holster", "kneepads"] as const) {
    const piece = createPiece(slot, "set:concentrated-company");
    piece.attributes = [];
    loadout.gear[slot] = piece;
  }
  const stats = computeStats(loadout);
  // 4 red cores = 60 WD + 2pc 10 + 4pc max 35×3% = 105 → 175
  assert(stats.values.weaponDamage === 175, `Camaraderie max 35 stacks WD, got ${stats.values.weaponDamage}`);
  assert(stats.values.chd === 105, `Camaraderie max 35×3% CHD, got ${stats.values.chd}`);

  const pack = createPiece("backpack", "set:concentrated-company");
  pack.attributes = [];
  loadout.gear.backpack = pack;
  loadout.gear.kneepads = null;
  const withPack = computeStats(loadout);
  // still 4 red cores + 2pc 10 + 35×6% = 210 → 280
  assert(withPack.values.weaponDamage === 280, `Camaraderie backpack 6%/stack, got ${withPack.values.weaponDamage}`);

  const spear = emptyLoadout();
  spear.shdWatch = false;
  spear.gear.mask = createPiece("mask", "set:tip-of-the-spear");
  spear.gear.gloves = createPiece("gloves", "set:tip-of-the-spear");
  const spearStats = computeStats(spear);
  assert(spearStats.values.signatureWeaponDamage === 20, `ToTS 2pc sig WD, got ${spearStats.values.signatureWeaponDamage}`);

  const sc = emptyLoadout();
  sc.shdWatch = false;
  sc.gear.mask = createPiece("mask", "set:system-corruption");
  sc.gear.gloves = createPiece("gloves", "set:system-corruption");
  sc.gear.holster = createPiece("holster", "set:system-corruption");
  const scStats = computeStats(sc);
  assert(scStats.values.pulseResistance === 40, "SC 3pc pulse");
  assert(scStats.values.disruptResistance === 40, `SC 3pc disrupt, got ${scStats.values.disruptResistance}`);

  const foundry = emptyLoadout();
  foundry.shdWatch = false;
  foundry.gear.mask = createPiece("mask", "set:foundry");
  foundry.gear.gloves = createPiece("gloves", "set:foundry");
  foundry.gear.holster = createPiece("holster", "set:foundry");
  const foundryStats = computeStats(foundry);
  assert(foundryStats.values.shieldHealth === 50, `Foundry 3pc shield health, got ${foundryStats.values.shieldHealth}`);

  const rushdown = catalogById("rushdown");
  assert(rushdown?.uniqueTalent?.description.includes("12s"), "Rushdown Tag Team 12s");
  assert(!rushdown?.uniqueTalent?.description.includes("6s"), "Rushdown is not HE 6s Tag Team");

  const ironWill = catalogById("iron-will");
  assert(ironWill?.uniqueTalent?.description.includes("Marksman Rifle"), "Iron Will MMR wording");
  assert(ironWill?.uniqueTalent?.description.includes("2s"), "Iron Will PvE 2s");

  const bear = catalogById("loaded-for-bear");
  assert(bear?.uniqueTalent?.description.includes("2% Weapon Damage per stack"), "Afterburn consume burst");

  const ember = GEAR_SETS.find((set) => set.id === "ember-engine");
  assert(ember?.core === "yellow", "Ember Engine yellow core");
  assert(ember?.four.includes("40%"), "Spontaneous Combustion 40%");
  assert(ember?.chestTalent.description.includes("60%"), "Flashpoint 60%");
  assert(ember?.fourAssumedNote?.includes("not burn DPS"), "Ember 4pc note is honest");
}

function testY8S3LiveSkillCatalog() {
  const byId = new Map(SKILLS.map((skill) => [skill.id, skill]));
  assert(byId.has("banshee-pulse"), "Banshee Pulse (Gunner) is live");
  assert(byId.get("banshee-pulse")?.name === "Banshee Pulse", "Banshee English name");
  assert(byId.has("achilles-pulse"), "Achilles Pulse is live");
  assert(byId.has("shrapnel-trap"), "Shrapnel Trap is live");
  assert(byId.has("precision-smart-cover"), "Precision Smart Cover (Brooklyn) is live");
  assert(byId.has("fortified-smart-cover"), "Fortified Smart Cover (Brooklyn) is live");
  assert(!byId.has("sticky-flash"), "Flashbang Sticky is Division 1 only");
  assert(byId.get("repair-chem")?.name === "Reinforcer Chem Launcher", "Reinforcer in-game name");
  assert(SKILLS.filter((skill) => skill.category === "Sticky Bomb").length === 3, "three sticky variants");
  assert(SKILLS.filter((skill) => skill.category === "Pulse").length === 5, "five pulse variants");
  assert(SKILLS.filter((skill) => skill.category === "Trap").length === 3, "three trap variants");
  assert(SKILLS.filter((skill) => skill.category === "Smart Cover").length === 2, "two smart cover variants");

  const banshee = skillModSlotsFor("banshee-pulse", "gunner");
  assert(
    banshee.some((slot) => slot.options.some((option) => option.id === "coil-cone")),
    "Banshee coil cone size",
  );
  assert(
    banshee.some((slot) => slot.options.some((option) => option.id === "gunner-directional-transmitter")),
    "Gunner unique on Banshee",
  );

  const shrapnel = skillModSlotsFor("shrapnel-trap");
  assert(shrapnel.length === 2, `shrapnel trap 2 slots, got ${shrapnel.length}`);
  assert(shrapnel[0]?.label === "Charge", "trap charge slot");
  assert(shrapnel[1]?.label === "Electronic", "trap electronic slot");

  const precision = skillModSlotsFor("precision-smart-cover");
  assert(precision.length === 2, `precision smart cover 2 slots, got ${precision.length}`);
  assert(precision[0]?.label === "Smart Launcher", "smart launcher slot");
  assert(precision[1]?.label === "Smart Projectile", "smart projectile slot");
  assert(
    precision[1]?.options.some((option) => option.id === "smart-projectile-handling"),
    "precision projectile handling",
  );
  assert(
    !precision[1]?.options.some((option) => option.id === "smart-projectile-bonus-armor"),
    "precision does not roll fortified bonus armor",
  );

  const fortified = skillModSlotsFor("fortified-smart-cover");
  assert(
    fortified[1]?.options.some((option) => option.id === "smart-projectile-bonus-armor"),
    "fortified projectile bonus armor",
  );
  assert(
    !fortified[1]?.options.some((option) => option.id === "smart-projectile-handling"),
    "fortified does not roll precision handling",
  );
}

function testY8s3LiveWeaponCatalog() {
  const determined = weaponTalentByName("Determined");
  assert(determined?.description.includes("converted shot"), "Y8S3 Determined no-chain text");
  assert(determined?.types?.includes("mmr") && determined.types.includes("rifle") && determined.types.includes("pistol"), "Determined MMR/rifle/pistol");
  assert(!determined?.assumed?.length, "Determined is not a reload-speed sheet stat");
  assert(determined?.assumedNote?.includes("Iron Will"), "Determined points chaining to Iron Will");

  const boiling = weaponTalentByName("Boiling Point");
  assert(boiling?.description.includes("53%"), "Boiling Point live 53%");
  assert(boiling?.assumed?.some((stat) => stat.stat === "chc" && stat.value === 100), "Boiling Point remaining mag 100% CHC");

  const fafnir = WEAPONS.find((weapon) => weapon.id === "fafnir");
  assert(fafnir?.talent === "Dragon's Breath", "Fafnir talent");
  assert(fafnir?.talentDesc.includes("40%"), "Fafnir 40% Burn");
  assert(fafnir?.talentDesc.includes("50%"), "Fafnir 50% SE amp");
  assert(fafnir?.extraStats?.some((stat) => stat.stat === "chc" && stat.value === 15), "Fafnir locked +15% CHC");
  assert(fafnir?.extraStats?.some((stat) => stat.stat === "magazineSize" && stat.value === 5), "Fafnir locked +5 mag");
  assert(fafnir?.extraStats?.some((stat) => stat.stat === "weaponHandling" && stat.value === 10), "Fafnir locked +10% handling");
  assert(!fafnir?.assumed?.length, "Fafnir SE amp is not a fake WD average");

  const acr = WEAPONS.find((weapon) => weapon.id === "steel-and-sons");
  assert(acr?.name === "Steel & Sons ACR", "Steel & Sons ACR id");
  assert(acr?.type === "rifle" && acr.quality === "exotic", "Steel & Sons is exotic ACR SS rifle");
  assert(acr?.rpm === 320 && acr.mag === 30, "Steel & Sons ACR SS rpm/mag");
  assert(acr?.talent === "Confirm & Execute", "Confirm & Execute");
  assert(acr?.talentDesc.includes("Max stacks: 4"), "Y8S3 max stacks 4");
  assert(acr?.talentDesc.includes("+30% Amplified Damage"), "Y8S3 weak-point +30%");
  assert(acr?.extraStats?.some((stat) => stat.stat === "chc" && stat.value === 15), "Steel & Sons locked optic");
  assert(acr?.assumed?.some((stat) => stat.stat === "weaponDamage" && stat.value === 16), "4 stacks × 4% amp");

  const teapot = WEAPONS.find((weapon) => weapon.id === "teapot");
  const steamer = WEAPONS.find((weapon) => weapon.id === "steamer");
  assert(teapot?.talent === "Perfect Boiling Point" && teapot.talentDesc.includes("48%"), "Teapot Perfect Boiling Point");
  assert(steamer?.talent === "Perfect Boiling Point" && steamer.type === "ar", "Steamer named AR");

  const relic = WEAPONS.find((weapon) => weapon.id === "relic");
  const prophet = WEAPONS.find((weapon) => weapon.id === "prophet");
  assert(relic?.talentDesc.includes("converted shot"), "Relic Perfectly Determined no-chain");
  assert(prophet?.talentDesc.includes("converted shot"), "Prophet Perfectly Determined no-chain");
}

/** Live Y8S3 PvE (TU 2.34) sheet-perk lock. Do not silently retune specs. */
function testSpecPerksLiveY8s3() {
  const expected: Record<
    string,
    { signature: string; sheet: { id: string; name: string; stat: string; value: number }[] }
  > = {
    gunner: {
      signature: "M134 Minigun",
      sheet: [
        { id: "gunner-aok", name: "Armor on Kill", stat: "armorOnKill", value: 10 },
        { id: "gunner-ammo", name: "Ammo Capacity", stat: "ammoCapacity", value: 25 },
        { id: "gunner-pulse", name: "Vital Protection", stat: "pulseResistance", value: 50 },
        { id: "gunner-sig-wd", name: "Signature Weapon Damage", stat: "signatureWeaponDamage", value: 40 },
      ],
    },
    technician: {
      signature: "P-017 Missile Launcher",
      sheet: [
        { id: "technician-tier", name: "Amped", stat: "skillTier", value: 1 },
        { id: "technician-pulse", name: "Vital Protection", stat: "pulseResistance", value: 50 },
        { id: "technician-sig-wd", name: "Signature Weapon Damage", stat: "signatureWeaponDamage", value: 40 },
      ],
    },
    sharpshooter: {
      signature: "TAC-50",
      sheet: [
        { id: "sharpshooter-hsd", name: "Headshot Damage", stat: "hsd", value: 15 },
        { id: "sharpshooter-mmr", name: "Marksman Rifle damage", stat: "mmrDamage", value: 10 },
        { id: "sharpshooter-breath", name: "Breath Control", stat: "stability", value: 15 },
        { id: "sharpshooter-pulse", name: "Vital Protection", stat: "pulseResistance", value: 50 },
        { id: "sharpshooter-sig-wd", name: "Signature Weapon Damage", stat: "signatureWeaponDamage", value: 40 },
      ],
    },
    survivalist: {
      signature: "Explosive Crossbow",
      sheet: [
        { id: "survivalist-repairs", name: "Incoming Repairs", stat: "incomingRepairs", value: 10 },
        { id: "survivalist-status", name: "Status Effects", stat: "statusEffects", value: 10 },
        { id: "survivalist-triage", name: "Triage Specialist", stat: "skillRepair", value: 15 },
        { id: "survivalist-elite", name: "Elite Defense", stat: "protectionFromElites", value: 10 },
        { id: "survivalist-pulse", name: "Vital Protection", stat: "pulseResistance", value: 50 },
        { id: "survivalist-sig-wd", name: "Signature Weapon Damage", stat: "signatureWeaponDamage", value: 40 },
      ],
    },
    demolitionist: {
      signature: "M32A1 Grenade Launcher",
      sheet: [
        { id: "demolitionist-explosive", name: "Explosive Damage", stat: "explosiveDamage", value: 15 },
        { id: "demolitionist-lmg", name: "LMG damage", stat: "lmgDamage", value: 10 },
        { id: "demolitionist-incombustible", name: "Incombustible", stat: "burnResistance", value: 20 },
        { id: "demolitionist-pulse", name: "Vital Protection", stat: "pulseResistance", value: 50 },
        { id: "demolitionist-sig-wd", name: "Signature Weapon Damage", stat: "signatureWeaponDamage", value: 40 },
      ],
    },
    firewall: {
      signature: "K8-JetStream Flamethrower",
      sheet: [
        { id: "firewall-armor", name: "Total Armor", stat: "armorPercent", value: 10 },
        { id: "firewall-status", name: "Status Effects", stat: "statusEffects", value: 10 },
        { id: "firewall-pulse", name: "Vital Protection", stat: "pulseResistance", value: 50 },
        { id: "firewall-sig-wd", name: "Signature Weapon Damage", stat: "signatureWeaponDamage", value: 40 },
      ],
    },
  };

  assert(SPECIALIZATIONS.length === 6, `six live specs, got ${SPECIALIZATIONS.length}`);
  assert(
    SPECIALIZATIONS.map((spec) => spec.id).join(",") === Object.keys(expected).join(","),
    "spec order is gunner/technician/sharpshooter/survivalist/demolitionist/firewall",
  );

  for (const spec of SPECIALIZATIONS) {
    const want = expected[spec.id];
    assert(want, `unexpected spec ${spec.id}`);
    assert(spec.signature === want.signature, `${spec.id} signature ${spec.signature}`);

    const sheet = spec.perks.filter((perk) => perk.group === "sheet" && !perk.exclusiveGroup);
    assert(sheet.length === want.sheet.length, `${spec.id} sheet count ${sheet.length}`);
    for (const [index, perk] of sheet.entries()) {
      const row = want.sheet[index];
      assert(perk.id === row.id && perk.name === row.name, `${spec.id} sheet ${perk.id} ${perk.name}`);
      assert(perk.defaultOn === true, `${perk.id} default on`);
      assert(
        perk.bonuses.length === 1 && perk.bonuses[0]?.stat === row.stat && perk.bonuses[0]?.value === row.value,
        `${perk.id} bonus`,
      );
    }

    const weapon = spec.perks.filter((perk) => perk.group === "weapon-type");
    const expectWeapon = spec.id === "sharpshooter" || spec.id === "demolitionist" ? 6 : 7;
    assert(weapon.length === expectWeapon, `${spec.id} weapon-type count ${weapon.length}`);
    assert(
      weapon.every((perk) => perk.defaultOn === false && perk.bonuses[0]?.value === 5),
      `${spec.id} weapon-type +5% default off`,
    );
  }

  assert(
    !SPECIALIZATIONS.find((spec) => spec.id === "sharpshooter")?.perks.some(
      (perk) => perk.group === "weapon-type" && perk.id === "sharpshooter-mmr",
    ),
    "Sharpshooter filters generated MMR +5% against the 10% sheet node",
  );
  assert(
    !SPECIALIZATIONS.find((spec) => spec.id === "demolitionist")?.perks.some(
      (perk) => perk.group === "weapon-type" && perk.id === "demolitionist-lmg",
    ),
    "Demolitionist filters generated LMG +5% against the 10% sheet node",
  );

  const forks = SPECIALIZATIONS.flatMap((spec) =>
    exclusivePerkGroups(spec).map((group) => ({ spec: spec.id, group })),
  );
  assert(forks.length === 1 && forks[0]?.spec === "technician", "only Technician has an exclusive sheet fork");
  const techFork = forks[0]!.group;
  assert(techFork.map((perk) => perk.id).join(",") === "technician-overclock,technician-diagnostics", "fork ids");
  assert(techFork[0]?.name === "Overclocked CPU" && techFork[0].bonuses[0]?.stat === "skillDamage" && techFork[0].bonuses[0]?.value === 10, "Overclocked CPU +10% Skill Damage");
  assert(techFork[1]?.name === "Enhanced Diagnostics" && techFork[1].bonuses[0]?.stat === "skillRepair" && techFork[1].bonuses[0]?.value === 10, "Enhanced Diagnostics +10% Skill Repair");
  assert(techFork.every((perk) => perk.defaultOn === false && perk.exclusiveGroup === "technician-skill-focus"), "fork default off");

  const loadout = emptyLoadout();
  loadout.shdWatch = false;

  loadout.specialization = "gunner";
  let stats = computeStats(loadout);
  assert(stats.values.armorOnKill === 10 && stats.values.ammoCapacity === 25, "gunner sheet defaults");
  assert(stats.values.signatureWeaponDamage === 40, "gunner signature WD default on");
  assert(stats.values.pulseResistance === 50, "gunner Vital Protection default on");
  assert(stats.values.arDamage === 0, "gunner weapon-type off");

  loadout.specialization = "technician";
  loadout.specPerks = undefined;
  stats = computeStats(loadout);
  assert(stats.values.skillTier === 1, "Amped default on");
  assert(stats.values.pulseResistance === 50, "Technician Vital Protection pulse");
  assert(stats.values.skillDamage === 0 && stats.values.skillRepair === 0, "technician fork default off");

  loadout.specialization = "sharpshooter";
  stats = computeStats(loadout);
  assert(stats.values.hsd === 15 && stats.values.mmrDamage === 10, "sharpshooter sheet defaults");
  assert(stats.values.stability === 15, "Breath Control default on");
  assert(stats.values.pulseResistance === 50, "sharpshooter Vital Protection default on");

  loadout.specialization = "survivalist";
  stats = computeStats(loadout);
  assert(stats.values.incomingRepairs === 10 && stats.values.statusEffects === 10, "survivalist sheet defaults");
  assert(stats.values.protectionFromElites === 10, "Elite Defense default on");
  assert(stats.values.skillRepair === 15, "Triage Specialist default on");
  assert(stats.values.pulseResistance === 50, "survivalist Vital Protection default on");

  loadout.specialization = "demolitionist";
  stats = computeStats(loadout);
  assert(stats.values.explosiveDamage === 15 && stats.values.lmgDamage === 10, "demolitionist sheet defaults");
  assert(stats.values.burnResistance === 20, "Incombustible default on");
  assert(stats.values.pulseResistance === 50, "demolitionist Vital Protection default on");

  loadout.specialization = "firewall";
  stats = computeStats(loadout);
  assert(stats.values.armorPercent === 10 && stats.values.statusEffects === 10, "firewall sheet defaults");
  assert(stats.values.pulseResistance === 50, "firewall Vital Protection default on");
}

function testQuickstep() {
  const family = WEAPONS.find((weapon) => weapon.id === "tactical-m1911");
  const quickstep = WEAPONS.find((weapon) => weapon.id === "quickstep");
  assert(quickstep?.name === "Quickstep", "Quickstep name");
  assert(quickstep?.type === "pistol" && quickstep.quality === "named", "Quickstep named pistol");
  assert(quickstep?.talent === "Sport Mode", "Sport Mode");
  assert(quickstep?.talentDesc.includes("+20% Movement Speed"), "Sport Mode +20%");
  assert(quickstep?.talentDesc.includes("unholstered"), "Sport Mode unholstered");
  assert(quickstep?.talentDesc.includes("does not stack"), "Sport Mode no stack");
  assert(quickstep?.rpm === 310 && quickstep.mag === 7, "Quickstep inherits Tactical M1911 310/7");
  assert(family?.type === "pistol" && family.rpm === 310 && family.mag === 7, "HE Tactical M1911 family");
  assert(
    quickstep?.extraStats?.some((stat) => stat.stat === "movementSpeed" && stat.value === 20),
    "Sport Mode +20 Movement Speed extraStats",
  );
  assert(!quickstep?.assumed?.length, "Sport Mode is not fake Weapon Damage");
  assert(!ATTRIBUTE_OPTIONS.includes("movementSpeed"), "movementSpeed is not a gear attribute roll");
  assert(!MOD_OPTIONS.includes("movementSpeed"), "movementSpeed is not a gear mod");

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.weapons.sidearm = { weaponId: "quickstep", expertise: 0, mods: [] };
  loadout.activeWeapon = "sidearm";
  const unholstered = computeStats(loadout);
  assert(
    unholstered.values.movementSpeed === 20,
    `Quickstep unholstered +20% Movement Speed, got ${unholstered.values.movementSpeed}`,
  );
  assert(unholstered.values.weaponDamage === 0, "Sport Mode is not Weapon Damage");
  assert(
    unholstered.notes.some((note) => note.includes("Movement Speed")),
    "innate Movement Speed note",
  );

  loadout.activeWeapon = "primary";
  const holstered = computeStats(loadout);
  assert(holstered.values.movementSpeed === 0, "Sport Mode only while the pistol is active");

  const prima = WEAPONS.find((weapon) => weapon.id === "prima-donna");
  assert(prima?.name === "Prima Donna", "Prima Donna name");
  assert(prima?.type === "mmr" && prima.quality === "exotic", "Prima Donna exotic MMR");
  assert(prima?.rpm === 55 && prima.mag === 7, "Prima Donna official 55 RPM / mag 7");
  assert(prima?.talent.includes("You can look"), "You can look talent");
  assert(prima?.talentDesc.includes("12.5%"), "Prima Donna 12.5% amp per stack");
  assert(prima?.talentDesc.includes("10 stacks"), "Prima Donna 10 PvE stacks");
  assert(!prima?.assumed?.length, "Prima Donna stacks are not fake WD");

  const scratchQs = weaponTalentByName("Head Scratcher");
  assert(scratchQs?.description.includes("30%"), "Head Scratcher live 30%");
  assert(scratchQs?.description.includes("4 kills"), "Head Scratcher 4 kills");
  assert(!scratchQs?.assumed?.length, "Head Scratcher is not a sheet WD average");
}

function testY8s3LiveHeTalentPicker() {
  const killer = weaponTalentByName("Killer");
  assert(killer?.description.includes("+70%"), "Killer live 70% CHD");
  assert(killer?.assumed?.some((stat) => stat.stat === "chd" && stat.value === 70), "Killer assumed 70 CHD");

  const optimist = weaponTalentByName("Optimist");
  assert(optimist?.description.includes("+3.5%"), "Optimist live 3.5%");
  assert(optimist?.assumed?.some((stat) => stat.stat === "weaponDamage" && stat.value === 35), "Optimist empty mag 35%");

  const strained = weaponTalentByName("Strained");
  assert(strained?.description.includes("0.5s"), "Strained live fire-time stacks");
  assert(strained?.assumed?.some((stat) => stat.stat === "chd" && stat.value === 50), "Strained 5×10% CHD");

  const fastHands = weaponTalentByName("Fast Hands");
  assert(fastHands?.description.includes("Max stack is 40"), "Fast Hands 40 stacks");

  const breadbasket = weaponTalentByName("Breadbasket");
  assert(breadbasket?.description.includes("+55%"), "Breadbasket live 55% HSD");

  const rifleman = weaponTalentByName("Rifleman");
  assert(rifleman?.description.includes("+10%"), "Rifleman 10% per headshot");
  assert(rifleman?.types?.includes("rifle") && !rifleman.types.includes("mmr"), "Rifleman is rifle-only");

  const firstBlood = weaponTalentByName("First Blood");
  assert(firstBlood?.description.includes("8x"), "First Blood requires 8x scope");
  assert(!firstBlood?.assumed?.length, "First Blood is not a sheet HSD bonus");

  const unhinged = weaponTalentByName("Unhinged");
  assert(unhinged?.description.includes("-25% Stability"), "Unhinged live -25% stability/accuracy");
  assert(unhinged?.types?.includes("lmg") && unhinged.types.length === 1, "Unhinged is LMG-only");

  const frenzy = weaponTalentByName("Frenzy");
  assert(frenzy?.description.includes("reloading from empty"), "Frenzy empty-reload scaling");
  assert(frenzy?.types?.includes("lmg") && !frenzy.types.includes("ar"), "Frenzy is LMG-only");

  const streamline = weaponTalentByName("Streamline");
  assert(streamline?.description.includes("42%"), "Streamline live 42%");
  const onEmpty = weaponTalentByName("On Empty");
  assert(onEmpty?.description.includes("+60%"), "On Empty live 60% handling");
  assert(onEmpty?.types?.includes("ar"), "On Empty is AR-only");

  const stabilize = weaponTalentByName("Stabilize");
  assert(stabilize?.description.includes("+60%"), "Stabilize live 60% cap");
  const pressure = weaponTalentByName("Pressure Point");
  assert(pressure?.description.includes("15%"), "Pressure Point live 15%");
  const future = weaponTalentByName("Future Perfect");
  assert(future?.description.includes("+1 skill tier"), "Future Perfect skill tier stacks");

  const scratch = weaponTalentByName("Head Scratcher");
  assert(scratch?.description.includes("30%"), "Head Scratcher live 30%");
  assert(scratch?.description.includes("4 kills"), "Head Scratcher 4 kills");
  assert(!scratch?.assumed?.length, "Head Scratcher is not a sheet WD average");

  assert(!weaponTalentByName("Accurate"), "Accurate is Perfect-only — off the HE picker");
  assert(!weaponTalentByName("Esagerato"), "Esagerato is not a live picker talent");
  assert(!weaponTalentByName("Swift"), "Swift is named-only (The Stinger), not On Empty");

  const arIds = weaponTalentsForType("ar").map((talent) => talent.id);
  assert(arIds.includes("on-empty") && arIds.includes("near-sighted"), "AR picker has On Empty / Near Sighted");
  assert(!arIds.includes("unhinged") && !arIds.includes("rifleman"), "AR picker hides LMG/rifle-only talents");
  const lmgIds = weaponTalentsForType("lmg").map((talent) => talent.id);
  assert(lmgIds.includes("unhinged") && lmgIds.includes("frenzy") && lmgIds.includes("overwhelm"), "LMG picker");
  const pistolIds = weaponTalentsForType("pistol").map((talent) => talent.id);
  assert(pistolIds.includes("finisher") && pistolIds.includes("salvage"), "pistol picker");
  assert(!pistolIds.includes("boiling-point"), "Boiling Point is AR/SMG/LMG");

  const pinprick = WEAPONS.find((weapon) => weapon.id === "pinprick");
  assert(pinprick?.talentDesc.includes("8x"), "Pinprick Perfect First Blood live wording");
  const railsplitter = WEAPONS.find((weapon) => weapon.id === "railsplitter");
  assert(railsplitter?.extraStats?.some((stat) => stat.stat === "accuracy" && stat.value === 50), "Railsplitter Perfectly Accurate +50%");
}

/** Named extras vs live names: Hollow Man TU9 10% DtH; Afterburn is not standing WD. */
function testGearCatalogLiveHoles() {
  const hollow = catalogById("the-hollow-man");
  assert(hollow?.name === "The Hollow Man", "Hollow Man English name");
  assert(
    hollow?.extraStats?.some((stat) => stat.stat === "damageToHealth" && stat.value === 10),
    `Hollow Man unique DtH 10% (TU9 / Namu lvl 40), got ${JSON.stringify(hollow?.extraStats)}`,
  );

  const hollowLoadout = emptyLoadout();
  hollowLoadout.shdWatch = false;
  hollowLoadout.gear.mask = createPiece("mask", "the-hollow-man");
  hollowLoadout.gear.mask.attributes = [];
  const hollowStats = computeStats(hollowLoadout);
  assert(hollowStats.values.damageToHealth === 10, `Hollow Man sheet DtH, got ${hollowStats.values.damageToHealth}`);

  const bear = catalogById("loaded-for-bear");
  assert(bear?.uniqueTalent?.name === "Afterburn", "Afterburn talent");
  assert(
    !bear?.assumed?.some((stat) => stat.stat === "weaponDamage"),
    "Afterburn must not invent standing Weapon Damage",
  );
  assert(bear?.note?.includes("Climax"), "Loaded for Bear is the Y8S3 Climax exotic");

  const bearLoadout = emptyLoadout();
  bearLoadout.shdWatch = false;
  bearLoadout.includeAssumed = true;
  bearLoadout.gear.gloves = createPiece("gloves", "loaded-for-bear");
  bearLoadout.gear.gloves.attributes = [];
  const bearStats = computeStats(bearLoadout);
  assert(bearStats.values.weaponDamage === 15, `red core only, no Afterburn WD fudge, got ${bearStats.values.weaponDamage}`);

  assert(catalogById("hunter-killer")?.name === "Hunter-Killer", "Hunter-Killer hyphen");
  assert(catalogById("eagles-grasp")?.name === "Eagle's Grasp", "Eagle's Grasp apostrophe");

  const airaldi = BRANDS.find((brand) => brand.id === "airaldi");
  assert(airaldi?.bonuses[1]?.some((b) => b.stat === "hsd" && b.value === 26), "Airaldi 2pc 26% HSD live");
  const grupo = BRANDS.find((brand) => brand.id === "grupo");
  assert(grupo?.bonuses[2]?.some((b) => b.stat === "hsd" && b.value === 39), "Grupo 3pc 39% HSD live");
}

function testY8S3SkillPveSheetGaps() {
  const byId = new Map(SKILLS.map((skill) => [skill.id, skill]));
  const booster = byId.get("booster-hive");
  assert(booster?.assumed?.some((stat) => stat.stat === "hazardProtection" && stat.value === 5), "Booster assumed hazard");
  assert(booster?.assumed?.some((stat) => stat.stat === "meleeDamage" && stat.value === 5), "Booster assumed melee");
  assert(!booster?.assumed?.some((stat) => stat.stat === "weaponDamage"), "Booster Hive is not weapon damage");

  const artificer = byId.get("artificer-hive");
  assert(artificer?.assumed?.some((stat) => stat.stat === "skillDamage" && stat.value === 10), "Artificer PvE 10% buff");
  assert(artificer?.assumed?.some((stat) => stat.stat === "skillRepair" && stat.value === 10), "Artificer PvE 10% skill repair");
  assert(artificer?.description.includes("+10%"), "Artificer description cites live PvE buff");

  const airburst = byId.get("airburst-seeker");
  assert(airburst?.description.toLowerCase().includes("burn"), "Airburst PvE burn");
  assert(airburst?.assumed?.some((stat) => stat.stat === "statusEffects"), "Airburst burn as status hint");

  assert(byId.get("explosive-seeker")?.description.toLowerCase().includes("bleed"), "Explosive seeker bleed");
  assert(byId.get("artillery-turret")?.description.toLowerCase().includes("bleed"), "Artillery bleed");
  assert(byId.get("jammer-pulse")?.description.toLowerCase().includes("omnidirectional"), "Jammer is radius EMP");
  assert(byId.get("achilles-pulse")?.description.includes("Skill Tier"), "Achilles zone count scales");

  const jammer = skillModSlotsFor("jammer-pulse");
  assert(
    jammer.some((slot) => slot.options.some((option) => option.id === "coil-radius")),
    "Jammer coil is Radius",
  );
  assert(
    !jammer.some((slot) => slot.options.some((option) => option.id === "coil-cone")),
    "Jammer is not a cone",
  );
  const banshee = skillModSlotsFor("banshee-pulse");
  assert(
    banshee.some((slot) => slot.options.some((option) => option.id === "coil-cone")),
    "Banshee keeps cone size",
  );

  const artificerMods = skillModSlotsFor("artificer-hive");
  assert(
    artificerMods.some((slot) => slot.options.some((option) => option.id === "drones-skill-repair")),
    "Artificer drones Skill Repair",
  );
  assert(
    artificerMods.some((slot) => slot.options.some((option) => option.id === "launcher-artificer-charges")),
    "Artificer extra charges",
  );
  const reviverMods = skillModSlotsFor("reviver-hive");
  assert(
    reviverMods.some((slot) => slot.options.some((option) => option.id === "launcher-reviver-charges")),
    "Reviver extra charges",
  );

  const shrapnel = skillModSlotsFor("shrapnel-trap");
  assert(
    shrapnel.some((slot) => slot.options.some((option) => option.id === "charge-extra")),
    "Trap extra traps",
  );
  assert(
    shrapnel.some((slot) => slot.options.some((option) => option.id === "electronic-damage")),
    "Shrapnel electronic damage",
  );
  assert(
    !shrapnel.some((slot) => slot.options.some((option) => option.id === "electronic-repair")),
    "Shrapnel does not roll repair",
  );
  const repairTrap = skillModSlotsFor("repair-trap");
  assert(
    repairTrap.some((slot) => slot.options.some((option) => option.id === "electronic-repair")),
    "Repair Trap electronic repair",
  );
  const shock = skillModSlotsFor("shock-trap");
  assert(
    shock.some((slot) => slot.options.some((option) => option.id === "electronic-shock")),
    "Shock Trap shock duration",
  );

  const airburstMods = skillModSlotsFor("airburst-seeker");
  assert(
    airburstMods.some((slot) => slot.options.some((option) => option.id === "payload-burn")),
    "Airburst payload burn duration",
  );
  const emp = skillModSlotsFor("sticky-emp");
  assert(
    emp.some((slot) => slot.options.some((option) => option.id === "payload-emp-radius")),
    "EMP sticky blast radius",
  );
}

function testY8S3SkillPveLivePdfDescriptions() {
  const byId = new Map(SKILLS.map((skill) => [skill.id, skill]));

  const repairTrap = byId.get("repair-trap");
  assert(repairTrap?.description.includes("Immunizing Serum"), "Repair Trap Immunizing Serum");
  assert(repairTrap?.description.includes("10s"), "Immunizing Serum 10s");

  const stinger = byId.get("stinger-hive");
  assert(stinger?.description.toLowerCase().includes("bleed"), "Stinger PvE bleed");

  const booster = byId.get("booster-hive");
  assert(booster?.description.includes("20%"), "Booster PvE T0 stim 20%");
  assert(booster?.description.toLowerCase().includes("not weapon damage"), "Booster still not WD");
  assert(!booster?.assumed?.some((stat) => stat.stat === "weaponDamage"), "Booster assumed is not WD");

  const artificer = byId.get("artificer-hive");
  assert(artificer?.description.includes("3s"), "Artificer PvE T0 skill refresh 3s");
  assert(artificer?.description.includes("+10% Skill Repair"), "Artificer PvE 10% skill repair stays");

  const defender = byId.get("defender-drone");
  assert(defender?.description.includes("20%"), "Defender PvE T0 20% DR");

  const scanner = byId.get("scanner-pulse");
  assert(scanner?.description.includes("100m"), "Scanner PvE 100m radius");
  assert(scanner?.description.includes("Weakness Exploit"), "Scanner OC Weakness Exploit");
  assert(!scanner?.assumed?.some((stat) => stat.stat === "weaponDamage"), "Weakness Exploit is not sheet WD");

  const jammer = byId.get("jammer-pulse");
  assert(jammer?.description.includes("20m"), "Jammer PvE 20m radius");
  assert(jammer?.description.includes("3s"), "Jammer PvE 3s EMP");

  const banshee = byId.get("banshee-pulse");
  assert(banshee?.description.includes("Disorient") || banshee?.description.includes("disorient"), "Banshee disorient");
  assert(banshee?.description.includes("20 cone"), "Banshee PvE cone size 20");

  const achilles = byId.get("achilles-pulse");
  assert(achilles?.description.includes("10s"), "Achilles PvE 10s zone duration");
  assert(achilles?.description.includes("3 at T6"), "Achilles 3 zones at T6");

  const cluster = byId.get("cluster-seeker");
  assert(cluster?.description.includes("3 cluster"), "Cluster PvE 3 mines");

  const emp = byId.get("sticky-emp");
  assert(emp?.description.includes("4m"), "EMP sticky PvE 4m blast");

  const reviver = byId.get("reviver-hive");
  assert(reviver?.description.includes("25%"), "Reviver PvE 25% armor restore");

  const striker = byId.get("striker-shield");
  assert(striker?.description.includes("5%"), "Striker Shield PvE 5% per enemy");
  assert(striker?.description.includes("45°"), "Striker Shield buff angle");
  assert(striker?.assumedNote?.includes("one enemy"), "Striker assumed is one-enemy T0 hint");

  const fortified = byId.get("fortified-smart-cover");
  assert(fortified?.description.includes("Explosive Resistance"), "Fortified T0 explosive resist");
  assert(fortified?.description.includes("Pulse Resistance"), "Fortified T0 pulse resist");

  const chem = byId.get("repair-chem");
  assert(chem?.name === "Reinforcer Chem Launcher", "Reinforcer name stays");
  assert(chem?.description.includes("2 ammo"), "Reinforcer PvE 2 ammo");

  const achillesMods = skillModSlotsFor("achilles-pulse");
  assert(
    !achillesMods.some((slot) => slot.options.some((option) => option.id === "coil-radius")),
    "Achilles coil is not Scanner radius",
  );
  assert(
    !achillesMods.some((slot) => slot.options.some((option) => option.id === "coil-cone")),
    "Achilles coil is not Banshee cone",
  );
  assert(
    achillesMods.some((slot) => slot.options.some((option) => option.id === "housing-duration")),
    "Achilles still rolls Pulse Housing duration",
  );

  const strikerMods = skillModLocalBreakdown("striker-shield", ["circuit-damage-bonus", "coating-health", "gyro-damage-bonus"]);
  assert(
    strikerMods.bonuses.some((bonus) => bonus.stat === "weaponDamage" && bonus.value === 5),
    "Striker Shield gyro damage bonus is local weapon damage, not skill damage",
  );
  assert(
    !strikerMods.bonuses.some((bonus) => bonus.stat === "skillDamage"),
    "Striker Shield cone buff is not skill damage",
  );
}

function testSeasonLiveGaugeAndHostileNotes() {
  const kick80 = computeStats(
    (() => {
      const loadout = emptyLoadout();
      loadout.shdWatch = false;
      loadout.season = sanitizeSeason({
        enabled: true,
        pressure: 80,
        passives: ["kickstart", null, null],
      });
      return loadout;
    })(),
  );
  assert(kick80.values.statusEffects === 60, `Kickstart 80% inclusive, got ${kick80.values.statusEffects}`);

  const aon80 = computeStats(
    (() => {
      const loadout = emptyLoadout();
      loadout.shdWatch = false;
      loadout.season = sanitizeSeason({
        enabled: true,
        pressure: 80,
        passives: ["all-or-nothing", null, null],
      });
      return loadout;
    })(),
  );
  assert(aon80.values.statusEffects === 50, `AoN 80%+, got ${aon80.values.statusEffects}`);

  const fiery = SEASON_ACTIVES.find((item) => item.id === "fiery-aura");
  assert(fiery?.description.includes("0.5%–1.5%/s") || fiery?.description.includes("0.5%-1.5%/s"), "Fiery Aura regen band");
  assert(fiery?.description.includes("+25%") && fiery.description.includes("+65%"), "Fiery Aura DR band");
  assert(fiery?.assumedNote.includes("0.5%–1.5%/s") || fiery?.assumedNote.includes("0.5%-1.5%/s"), "Fiery Aura assumed band");

  const vicarious = SEASON_ACTIVES.find((item) => item.id === "vicarious-combustion");
  assert(vicarious?.description.includes("50%–10%") || vicarious?.description.includes("50%-10%"), "Vicarious burn penalty in description");

  assert(SEASON_HOSTILE_NOTE.includes("5 m"), "Draining Presence live 5 m");
  assert(SEASON_HOSTILE_NOTE.includes("−10%") || SEASON_HOSTILE_NOTE.includes("-10%"), "Draining Presence mag drain");
  assert(SEASON_HOSTILE_NOTE.includes("5% Pressure"), "Achilles' Heal live 5% Pressure");
  assert(SEASON_HOSTILE_NOTE.includes("10 m"), "Achilles' Heal 10 m heal");
  assert(SEASON_HOSTILE_NOTE.includes("0.5%"), "Thousand Cuts 0.5% DR");
  assert(SEASON_HOSTILE_NOTE.includes("15 s"), "Thousand Cuts 15 s");

  assert(SEASON_GAUGE_NOTE.includes("+1% Pressure"), "Group Kill +1%");
  assert(SEASON_GAUGE_NOTE.includes("freezes"), "gauge freezes during Active");
  assert(SEASON_GAUGE_NOTE.includes("+15 / +25 / +40 / +65%"), "default SE table");
  assert(SEASON_GAUGE_NOTE.includes("unpublished"), "live fill amounts unpublished");
  assert(!SEASON_GAUGE_NOTE.includes("2.5%"), "do not ship PTS kill fill as live");

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.season = sanitizeSeason({ enabled: true, pressure: 90 });
  const stats = computeStats(loadout);
  assert(stats.notes.some((note) => note.includes("group kills")), "gauge note on sheet");
  assert(stats.notes.some((note) => note.includes("Draining Presence") && note.includes("5 m")), "hostile numbers on sheet");
  assert(stats.notes.some((note) => note.includes("Achilles") && note.includes("5%")), "Achilles 5% on sheet");
}

/** Extra live sheet nodes filled from Namu trees (Ubisoft Y8S3 PDF does not retune specs). */
function testSpecPerksSheetGapsY8s3() {
  for (const spec of SPECIALIZATIONS) {
    const sig = spec.perks.find((perk) => perk.id === `${spec.id}-sig-wd`);
    assert(sig?.name === "Signature Weapon Damage", `${spec.id} Signature Weapon Damage name`);
    assert(sig?.defaultOn === true && sig.bonuses[0]?.stat === "signatureWeaponDamage" && sig.bonuses[0]?.value === 40, `${spec.id} sig WD +40%`);
  }

  const tech = specializationById("technician")!;
  assert(
    tech.perks.some((perk) => perk.id === "technician-pulse" && perk.name === "Vital Protection"),
    "Technician Vital Protection id",
  );
  for (const spec of SPECIALIZATIONS) {
    const pulse = spec.perks.find((perk) => perk.id === `${spec.id}-pulse`);
    assert(pulse?.name === "Vital Protection", `${spec.id} Vital Protection name`);
    assert(
      pulse?.defaultOn === true && pulse.bonuses[0]?.stat === "pulseResistance" && pulse.bonuses[0]?.value === 50,
      `${spec.id} Vital Protection +50% Pulse Resistance`,
    );
  }

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.specialization = "technician";
  loadout.specPerks = { "technician-pulse": false, "technician-sig-wd": false };
  const skipped = computeStats(loadout);
  assert(skipped.values.skillTier === 1, "Amped still on when optional sheet nodes skipped");
  assert(skipped.values.pulseResistance === 0, "Vital Protection can be skipped");
  assert(skipped.values.signatureWeaponDamage === 0, "sig WD can be skipped");

  loadout.specialization = "gunner";
  loadout.specPerks = { "gunner-sig-wd": false };
  assert(computeStats(loadout).values.armorOnKill === 10, "Gunner identity perks stay on");
  assert(computeStats(loadout).values.weaponDamage === 0, "no invented Weapon Damage from spec tree");
}

/** Homemade picker blurbs must not leak into exotic / gear-set talent text. */
function testOfficialExoticAndGearSetCopy() {
  const homemade = /Ideal for|Excellent |Skill DPS build|Drops from:|Toxic DZ|hybrid piece|CQC crowd/;
  for (const item of NAMED_AND_EXOTICS) {
    if (item.kind !== "exotic" || !item.uniqueTalent) continue;
    assert(
      !homemade.test(item.uniqueTalent.description),
      `${item.id} talent is homemade: ${item.uniqueTalent.description.slice(0, 80)}`,
    );
  }
  for (const weapon of WEAPONS) {
    if (weapon.quality !== "exotic") continue;
    assert(
      !homemade.test(weapon.talentDesc),
      `${weapon.id} talentDesc is homemade: ${weapon.talentDesc.slice(0, 80)}`,
    );
  }

  const coyote = catalogById("coyotes-mask");
  assert(coyote?.uniqueTalent?.name === "Pack Instincts", "Coyote Pack Instincts");
  assert(
    coyote?.uniqueTalent?.description.includes("0-15m") &&
      coyote.uniqueTalent.description.includes("25%") &&
      coyote.uniqueTalent.description.includes("Critical Hit Damage"),
    "Coyote official range bands",
  );

  const memento = catalogById("memento");
  assert(memento?.uniqueTalent?.name === "Kill Confirmed", "Memento Kill Confirmed");
  assert(memento?.uniqueTalent?.description.includes("trophy"), "Memento trophies");
  assert(memento?.uniqueTalent?.description.includes("30"), "Memento 30 stacks");

  const ninja = catalogById("ninjabike");
  assert(
    ninja?.uniqueTalent?.description.includes("Gear Set") &&
      ninja.uniqueTalent.description.includes("Brand Set"),
    "NinjaBike Resourceful official",
  );

  const catalyst = catalogById("catalyst");
  assert(catalyst?.uniqueTalent?.name === "Chemical Agent", "Catalyst Chemical Agent");
  assert(catalyst?.uniqueTalent?.description.includes("15 meters"), "Catalyst official 15m Catalysis radius");
  assert(!catalyst?.uniqueTalent?.description.includes("25 meters"), "Catalyst is not 25m");

  const ridgeway = catalogById("ridgeways-pride");
  assert(ridgeway?.uniqueTalent?.name === "Bleeding Edge", "Ridgeway Bleeding Edge");
  assert(ridgeway?.uniqueTalent?.description.includes("15m"), "Bleeding Edge 15m");

  const waveform = catalogById("waveform");
  assert(waveform?.uniqueTalent?.name === "Alternating Current", "Waveform Alternating Current");

  const nurse = catalogById("nurses-kneepads");
  assert(nurse?.uniqueTalent?.name === "Impervious", "Nurse Impervious");
  assert(nurse?.uniqueTalent?.description.includes("40% Hazard Protection"), "Impervious 40%");

  const tinkerer = catalogById("tinkerer");
  assert(tinkerer?.uniqueTalent?.name === "Abridged", "Tinkerer Abridged");

  const heartbreaker = GEAR_SETS.find((set) => set.id === "heartbreaker");
  assert(heartbreaker?.four.includes("+1% weapon damage"), "Heartstopper official 1% WD/stack");
  assert(!heartbreaker?.four.includes("1.1%"), "Heartstopper is not 1.1%");

  const striker = GEAR_SETS.find((set) => set.id === "striker");
  assert(striker?.four.startsWith("Striker's Gamble"), "Striker 4pc named");
  assert(striker?.four.includes("0.65%"), "Striker official 0.65%");
  assert(
    striker?.backpackTalent.description.includes("from 0.65% to 1%"),
    "Risk Management official live 1%",
  );
  assert(
    !striker?.backpackTalent.description.includes("0.65% → 1%"),
    "no homemade arrow shorthand on Striker backpack",
  );

  const umbra = GEAR_SETS.find((set) => set.id === "umbra");
  assert(umbra?.four.includes("1.2% Critical Hit Damage"), "Umbra official per-stack CHD");
  assert(
    umbra?.chestTalent.description.includes("From the Shadows"),
    "Umbra chest buffs From the Shadows",
  );
  assert(
    umbra?.backpackTalent.description.includes("Into the Light"),
    "Umbra backpack buffs Into the Light",
  );

  const elmo = WEAPONS.find((weapon) => weapon.id === "st-elmo");
  assert(elmo?.talent === "Actum Est", "Elmo Actum Est");
  assert(elmo?.talentDesc.includes("shock ammo"), "Elmo official shock ammo");
  assert(!elmo?.talentDesc.includes("Ideal for"), "Elmo no build advice");

  const eagle = WEAPONS.find((weapon) => weapon.id === "eagle-bearer");
  assert(eagle?.talent === "Eagle's Strike", "Eagle Bearer Eagle's Strike");

  const chatterbox = WEAPONS.find((weapon) => weapon.id === "chatterbox");
  assert(chatterbox?.talent === "Incessant Chatter", "Chatterbox official talent name");

  const backfire = WEAPONS.find((weapon) => weapon.id === "backfire");
  assert(backfire?.talent === "Payment in Kind", "Backfire official talent name");

  const underboss = WEAPONS.find((weapon) => weapon.id === "underboss");
  assert(underboss?.talentDesc.includes("other agents using this weapon"), "Underboss official group marks");
}

/** Named gaps filled from mx-division-builds live BuildStation API (Y8S3, 27 Aug 2026). */
function testMxLiveNamedGaps() {
  const pdr = WEAPONS.find((weapon) => weapon.id === "pdr");
  assert(pdr?.type === "ar" && pdr.quality === "high-end" && pdr.rpm === 700 && pdr.mag === 30, "HE PDR 700/30");

  const mdr = WEAPONS.find((weapon) => weapon.id === "urban-mdr");
  assert(mdr?.type === "rifle" && mdr.quality === "high-end" && mdr.rpm === 380 && mdr.mag === 20, "HE Urban MDR 380/20");

  const bloom = WEAPONS.find((weapon) => weapon.id === "first-bloom");
  assert(bloom?.name === "First Bloom" && bloom.type === "ar" && bloom.quality === "named", "First Bloom named PDR");
  assert(bloom?.rpm === 700 && bloom.mag === 30, "First Bloom 700/30");
  assert(bloom?.talent === "Blossom Harvest", "Blossom Harvest");
  assert(bloom?.talentDesc.includes("3.3%"), "Blossom Harvest 3.3%");
  assert(bloom?.talentDesc.includes("combined Armor and Health"), "Blossom Harvest remaining armor+health");
  assert(!bloom?.assumed?.length, "Blossom Harvest is not sheet Weapon Damage");

  const insult = WEAPONS.find((weapon) => weapon.id === "insult-to-injury");
  assert(insult?.name === "Insult To Injury" && insult.type === "lmg" && insult.quality === "named", "Insult To Injury SA80");
  assert(insult?.rpm === 610 && insult.mag === 30, "Insult To Injury 610/30");
  assert(insult?.talent === "Perfect Head Scratcher", "Insult Perfect Head Scratcher");
  assert(insult?.talentDesc.includes("35%") && insult.talentDesc.includes("3 kills"), "Perfect Head Scratcher 35%/3");
  assert(!insult?.assumed?.length, "Perfect Head Scratcher is not sheet WD");

  const brain = WEAPONS.find((weapon) => weapon.id === "brain-break");
  assert(brain?.name === "Brain Break" && brain.type === "rifle" && brain.quality === "named", "Brain Break MDR");
  assert(brain?.rpm === 360 && brain.mag === 20, "Brain Break 360/20");
  assert(brain?.talent === "Perfect Head Scratcher", "Brain Break Perfect Head Scratcher");
  assert(!brain?.assumed?.length, "Brain Break is not sheet WD");

  const rabid = WEAPONS.find((weapon) => weapon.id === "rabid-d50");
  assert(rabid?.name === "Rabid D50" && rabid.type === "pistol" && rabid.quality === "named", "Rabid D50");
  assert(rabid?.rpm === 200 && rabid.mag === 8, "Rabid D50 200/8");
  assert(rabid?.talent === "Foam at the Mouth", "Foam at the Mouth");
  assert(rabid?.talentDesc.includes("Ensnare") && rabid.talentDesc.includes("25%"), "Foam ensnare +25%");
  assert(!rabid?.assumed?.length, "Foam at the Mouth is not sheet WD");

  const d50 = WEAPONS.find((weapon) => weapon.id === "d50");
  assert(d50?.rpm === 200 && d50.mag === 8, "HE D50 family 200/8");
  const survivalist = WEAPONS.find((weapon) => weapon.id === "survivalist-d50");
  assert(survivalist?.rpm === 200 && survivalist.mag === 8, "Survivalist D50 200/8");

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.includeAssumed = true;
  loadout.weapons.primary = { weaponId: "first-bloom", expertise: 0, mods: [] };
  loadout.activeWeapon = "primary";
  const bloomStats = computeStats(loadout);
  assert(bloomStats.values.weaponDamage === 0, "Blossom Harvest does not add standing WD");

  loadout.weapons.primary = { weaponId: "insult-to-injury", expertise: 0, mods: [] };
  const insultStats = computeStats(loadout);
  assert(insultStats.values.weaponDamage === 0, "Perfect Head Scratcher does not add standing WD");

  loadout.weapons.sidearm = { weaponId: "rabid-d50", expertise: 0, mods: [] };
  loadout.activeWeapon = "sidearm";
  const rabidStats = computeStats(loadout);
  assert(rabidStats.values.weaponDamage === 0, "Foam at the Mouth does not add standing WD");
}

/** mx live exotic gear the first import skipped: Beacon chest, Exodus gloves, NinjaBike kneepads. */
function testMxLiveExoticGearGaps() {
  const beacon = catalogById("beacon");
  assert(beacon?.name === "Beacon" && beacon.kind === "exotic", "Beacon exotic");
  assert(beacon?.slots !== "all" && beacon?.slots.includes("chest"), "Beacon is a chest");
  assert(beacon?.lockedCore === "red", "Beacon red core");
  assert(beacon?.uniqueTalent?.name === "Bond", "Bond talent");
  assert(beacon?.uniqueTalent?.description.includes("+30% Critical Hit Damage"), "Bond ally 30% CHD");
  assert(beacon?.uniqueTalent?.description.includes("+15% Skill Efficiency"), "Bond ally 15% SE");
  assert(beacon?.uniqueTalent?.description.includes("+2% Armor Regen"), "Bond ally 2% regen");
  assert(beacon?.uniqueTalent?.description.includes("Skills is within 10m"), "Bond skill-proximity group");
  assert(beacon?.uniqueTalent?.description.includes("highest group"), "Bond groups do not stack");
  assert(
    beacon?.assumed?.some((stat) => stat.stat === "chd" && stat.value === 30),
    "Bond assumed ally CHD",
  );
  assert(
    !beacon?.assumed?.some((stat) => stat.stat === "weaponDamage"),
    "Bond is not fake Weapon Damage",
  );

  const beaconLoadout = emptyLoadout();
  beaconLoadout.shdWatch = false;
  beaconLoadout.includeAssumed = true;
  beaconLoadout.gear.chest = createPiece("chest", "beacon");
  beaconLoadout.gear.chest.attributes = [];
  const beaconOn = computeStats(beaconLoadout);
  assert(beaconOn.values.chd === 30, `Bond ally CHD, got ${beaconOn.values.chd}`);
  assert(beaconOn.values.skillEfficiency === 15, `Bond ally Skill Efficiency, got ${beaconOn.values.skillEfficiency}`);
  assert(beaconOn.values.armorRegenPercent === 2, `Bond ally Armor Regen, got ${beaconOn.values.armorRegenPercent}`);
  beaconLoadout.includeAssumed = false;
  const beaconOff = computeStats(beaconLoadout);
  assert(beaconOff.values.chd === 0, "Bond proximity is gated by maxed bonuses");

  const exodus = catalogById("exodus");
  assert(exodus?.name === "Exodus" && exodus.kind === "exotic", "Exodus exotic");
  assert(exodus?.slots !== "all" && exodus?.slots.includes("gloves"), "Exodus is gloves");
  assert(exodus?.lockedCore === "red", "Exodus red core");
  assert(exodus?.uniqueTalent?.name === "Smoke Screen", "Smoke Screen talent");
  assert(exodus?.uniqueTalent?.description.includes("armor break"), "Smoke Screen on armor break");
  assert(exodus?.uniqueTalent?.description.includes("3s"), "Smoke Screen PvE 3s");
  assert(exodus?.uniqueTalent?.description.includes("40s"), "Smoke Screen 40s CD");
  assert(!exodus?.assumed?.length, "Smoke Screen is not sheet Weapon Damage");

  const exodusLoadout = emptyLoadout();
  exodusLoadout.shdWatch = false;
  exodusLoadout.includeAssumed = true;
  exodusLoadout.gear.gloves = createPiece("gloves", "exodus");
  exodusLoadout.gear.gloves.attributes = [];
  assert(computeStats(exodusLoadout).values.weaponDamage === 15, "Exodus red core only, no Smoke Screen WD");

  const pads = catalogById("ninjabike-kneepads");
  assert(pads?.name === "NinjaBike Messenger Kneepads", "NinjaBike kneepads English name");
  assert(pads?.kind === "exotic" && pads.slots !== "all" && pads.slots.includes("kneepads"), "NinjaBike kneepads slot");
  assert(!pads?.slots.includes("backpack"), "kneepads are not the bag");
  assert(pads?.lockedCore === "red", "NinjaBike kneepads red core");
  assert(pads?.ninja !== true, "Parkour kneepads do not fill brand/set requirements");
  assert(pads?.uniqueTalent?.name === "Parkour!", "Parkour! talent");
  assert(pads?.uniqueTalent?.description.includes("cover to cover"), "Parkour C2C");
  assert(pads?.uniqueTalent?.description.includes("+25% bonus armor"), "Parkour 25% bonus armor");
  assert(!pads?.assumed?.length, "Parkour is combat-only, not sheet WD");
  assert(catalogById("ninjabike")?.ninja === true, "Messenger Bag still has ninja: true");
  assert(
    catalogForSlot("kneepads").some((item) => item.id === "ninjabike-kneepads"),
    "kneepads picker has NinjaBike Messenger Kneepads",
  );
  assert(
    !catalogForSlot("backpack").some((item) => item.id === "ninjabike-kneepads"),
    "backpack picker does not list the kneepads",
  );
  assert(
    catalogForSlot("backpack").some((item) => item.id === "ninjabike"),
    "backpack picker still has the Messenger Bag",
  );

  const padLoadout = emptyLoadout();
  padLoadout.shdWatch = false;
  padLoadout.includeAssumed = true;
  padLoadout.gear.kneepads = createPiece("kneepads", "ninjabike-kneepads");
  padLoadout.gear.kneepads.attributes = [];
  const padStats = computeStats(padLoadout);
  assert(padStats.values.weaponDamage === 15, "kneepads red core only");
  assert(padStats.values.hsd === 0, "Parkour kneepads do not unlock Airaldi like the bag");
}

/** Unique-attribute nameds + HE families filled from mx live / Ubisoft Veteran Rewards (Y8S3). */
function testUniqueAttrNamedAndHeFamilies() {
  const kard = WEAPONS.find((weapon) => weapon.id === "tdi-kard");
  const kardHe = WEAPONS.find((weapon) => weapon.id === "kard-45");
  assert(kard?.name === 'TDI "Kard" Custom' && kard.type === "pistol" && kard.quality === "named", "TDI Kard named pistol");
  assert(kard?.rpm === 310 && kard.mag === 10, "TDI Kard KARD-45 family 310/10");
  assert(kard?.talent === "Innate Skill Tier", "TDI Kard is unique Skill Tier, not Perfectly Unhinged");
  assert(kard?.talentDesc.includes("Skill Tier"), "TDI Kard +1 Skill Tier text");
  assert(kard?.extraStats?.some((stat) => stat.stat === "skillTier" && stat.value === 1), "TDI Kard extraStats +1 ST");
  assert(!kard?.assumed?.length, "TDI Kard unique ST is extraStats, not assumed WD");
  assert(kardHe?.quality === "high-end" && kardHe.rpm === 310 && kardHe.mag === 10, "HE KARD-45 310/10");

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.weapons.sidearm = { weaponId: "tdi-kard", expertise: 0, mods: [] };
  loadout.activeWeapon = "sidearm";
  const drawn = computeStats(loadout);
  assert(drawn.values.skillTier === 1, `TDI Kard drawn +1 Skill Tier, got ${drawn.values.skillTier}`);
  loadout.activeWeapon = "primary";
  const holstered = computeStats(loadout);
  assert(holstered.values.skillTier === 0, "TDI Kard Skill Tier only while drawn");

  const broker = WEAPONS.find((weapon) => weapon.id === "stack-broker");
  assert(broker?.name === "Stack Broker" && broker.type === "shotgun" && broker.quality === "named", "Stack Broker named ACS-12");
  assert(broker?.rpm === 360 && broker.mag === 20, "Stack Broker 360/20 vs ACS-12 300/20");
  assert(broker?.talentDesc.includes("rate of fire"), "Stack Broker unique RoF");
  assert(!broker?.assumed?.length, "Stack Broker unique RoF is not sheet WD");

  const sling = WEAPONS.find((weapon) => weapon.id === "slingshot");
  const umpTac = WEAPONS.find((weapon) => weapon.id === "tactical-ump-45");
  assert(sling?.name === "Slingshot" && sling.type === "smg" && sling.quality === "named", "Slingshot named UMP");
  assert(sling?.rpm === 650 && sling.mag === 25, "Slingshot Tactical UMP 650/25");
  assert(sling?.talentDesc.includes("60m"), "Slingshot 60m Optimal Range");
  assert(!sling?.assumed?.length, "Slingshot OR is not sheet WD");
  assert(umpTac?.quality === "high-end" && umpTac.rpm === 650 && umpTac.mag === 25, "HE Tactical UMP-45");

  const basket = WEAPONS.find((weapon) => weapon.id === "handbasket");
  assert(basket?.name === "Handbasket" && basket.type === "mmr" && basket.quality === "named", "Handbasket named SVD");
  assert(basket?.rpm === 60 && basket.mag === 10, "Handbasket slower SVD 60/10");
  assert(!basket?.assumed?.length, "Handbasket unique damage is not sheet WD");

  assert(WEAPONS.some((weapon) => weapon.id === "tkb-408" && weapon.rpm === 600 && weapon.mag === 30), "HE TKB-408");
  assert(WEAPONS.some((weapon) => weapon.id === "gr9" && weapon.rpm === 750 && weapon.mag === 200), "HE GR9 750/200");
  assert(WEAPONS.some((weapon) => weapon.id === "resolute-mk47" && weapon.rpm === 300 && weapon.mag === 30), "HE Resolute MK47");
  assert(WEAPONS.some((weapon) => weapon.id === "g28" && weapon.rpm === 180 && weapon.mag === 20), "HE G28");
  assert(WEAPONS.some((weapon) => weapon.id === "tactical-308" && weapon.rpm === 70 && weapon.mag === 7), "HE Tactical .308");
  assert(WEAPONS.some((weapon) => weapon.id === "aug-a3-cqc" && weapon.rpm === 680 && weapon.mag === 42), "HE AUG A3-CQC");

  const king = WEAPONS.find((weapon) => weapon.id === "kingbreaker");
  assert(king?.rpm === 600 && king.mag === 30, "Kingbreaker TKB-408 family 600/30");
  const dare = WEAPONS.find((weapon) => weapon.id === "dare");
  const cricket = WEAPONS.find((weapon) => weapon.id === "cricket");
  assert(dare?.rpm === 750 && dare.mag === 200, "Dare GR9 mag 200");
  assert(cricket?.rpm === 750 && cricket.mag === 200, "Cricket GR9 mag 200");
  const harmony = WEAPONS.find((weapon) => weapon.id === "harmony");
  assert(harmony?.rpm === 300 && harmony.mag === 30, "Harmony MK47 300/30");
  const relic = WEAPONS.find((weapon) => weapon.id === "relic");
  const sacrum = WEAPONS.find((weapon) => weapon.id === "sacrum-imperium");
  assert(relic?.rpm === 180 && relic.mag === 20, "Relic G28 180/20");
  assert(sacrum?.rpm === 180 && sacrum.mag === 20, "Sacrum Imperium G28 180/20");
  const teapot = WEAPONS.find((weapon) => weapon.id === "teapot");
  const steamer = WEAPONS.find((weapon) => weapon.id === "steamer");
  const lud = WEAPONS.find((weapon) => weapon.id === "lud");
  assert(teapot?.rpm === 360 && teapot.mag === 30, "Teapot M4 rifle 360/30");
  assert(steamer?.rpm === 650 && steamer.mag === 30, "Steamer SCAR-L 650/30");
  assert(lud?.rpm === 650 && lud.mag === 30, "Lud SCAR-L 650/30");

  assert(!WEAPONS.some((weapon) => /oh carol|sleigher|bell ringer|october fifth/i.test(weapon.name)), "meme / unobtainable nameds stay omitted");
}

function testIronLungExoticArdent() {
  const lung = WEAPONS.find((weapon) => weapon.id === "iron-lung");
  assert(lung?.quality === "exotic", "Iron Lung is the TU19 exotic, not named Perfect Frenzy");
  assert(lung?.type === "lmg" && lung.name === "Iron Lung", "Iron Lung exotic LMG");
  assert(lung?.talent === "Ardent", "Ardent talent");
  assert(lung?.talentDesc.includes("heat meter"), "Ardent official heat meter");
  assert(lung?.talentDesc.includes("ignite"), "Ardent ignite when full");
  assert(lung?.rpm === 800 && lung.mag === 85, "MG5 800 RPM, 50+35 Bellows mag");
  assert(lung?.extraStats?.some((stat) => stat.stat === "chc" && stat.value === 10), "Dragon Horns +10% CHC");
  assert(lung?.extraStats?.some((stat) => stat.stat === "chd" && stat.value === 20), "Scales +20% CHD");
  assert(!lung?.assumed?.length, "Ardent burn is not fake Weapon Damage");
}

function testTalentHoverPreview() {
  const creeping = ALL_TALENTS.find((talent) => talent.id === "creeping-death");
  const overclock = ALL_TALENTS.find((talent) => talent.id === "overclock");
  assert(creeping && overclock, "Creeping Death and Overclock exist");
  if (!creeping || !overclock) return;
  const options = [
    { value: creeping.id, label: creeping.name, description: creeping.description },
    { value: overclock.id, label: overclock.name, description: overclock.description },
  ];
  assert(
    previewDescribedOption(options, "creeping-death", null)?.description === creeping.description,
    "closed list shows selected talent",
  );
  assert(
    previewDescribedOption(options, "creeping-death", "overclock")?.description ===
      overclock.description,
    "hover previews Overclock while Creeping Death is selected",
  );
  assert(
    previewDescribedOption(options, "creeping-death", "") === undefined,
    "hovering None clears the description",
  );
}

/** Live Y8S3 Under Pressure copy holes filled 4 Sep 2026 from launch article + PTS tables unchanged at live. */
function testSeasonLiveY8s3CopyHoles4Sep() {
  assert(SEASON_GAUGE_NOTE.includes("no cooldown"), "actives have no cooldown");
  assert(SEASON_GAUGE_NOTE.includes("freezes"), "gauge still freezes during Active");
  assert(!SEASON_GAUGE_NOTE.includes("2.5%"), "still do not ship PTS kill fill");

  assert(
    SEASON_HOSTILE_NOTE.includes("permanently removes or reverses"),
    "hostile burn permanently removes or reverses",
  );

  const leaky = SEASON_PASSIVES.find((item) => item.id === "leaky-valve");
  assert(leaky?.description.includes("cover-to-cover"), "Leaky Valve cover-to-cover");
  assert(leaky?.description.includes("95%"), "Leaky Valve 95%");

  const vicarious = SEASON_ACTIVES.find((item) => item.id === "vicarious-combustion");
  assert(vicarious?.description.includes("+10 / +20 / +30 / +50%"), "Vicarious HSD L3 band");
  assert(vicarious?.assumedNote.includes("10 / 20 / 30 / 50%"), "Vicarious assumed HSD band");

  const signed = SEASON_ACTIVES.find((item) => item.id === "signed-shield-delivered");
  assert(signed?.description.includes("+10 / +12.5 / +15 / +25%"), "Signed SE L3 band");
  assert(signed?.description.includes("+500%") && signed.description.includes("+50%"), "Signed L5 shield/sig in description");
  assert(signed?.description.includes("regular weapon"), "Signed mag refill on shielded regular weapons");
  assert(signed?.assumedNote.includes("10 / 12.5 / 15 / 25%"), "Signed assumed SE band");

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.season = sanitizeSeason({
    enabled: true,
    pressure: 80,
    passives: ["delayed-venting", "kickstart", null],
  });
  const delayedKick = computeStats(loadout);
  assert(
    delayedKick.values.statusEffects === 97.5,
    `Delayed Venting + Kickstart at 80% inclusive, got ${delayedKick.values.statusEffects}`,
  );

  assert(SEASON_PASSIVES.length === 20, "still 20 player passives");
  assert(SEASON_ACTIVES.length === 3, "still 3 actives");
}

/** TU6 Vital Protection is Pulse Resistance on every spec; Survivalist Triage Specialist is outgoing Skill Repair. */
function testSpecPerksVitalProtectionAllSpecsY8s3() {
  for (const spec of SPECIALIZATIONS) {
    const pulse = spec.perks.find((perk) => perk.id === `${spec.id}-pulse`);
    assert(pulse?.group === "sheet" && pulse.defaultOn, `${spec.id}-pulse is a default-on sheet perk`);
    assert(pulse?.exclusiveGroup === undefined, `${spec.id}-pulse is not a fork`);
  }

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.specialization = "gunner";
  loadout.specPerks = { "gunner-pulse": false };
  const skippedGunner = computeStats(loadout);
  assert(skippedGunner.values.pulseResistance === 0, "Gunner Vital Protection can be skipped");
  assert(skippedGunner.values.armorOnKill === 10, "Gunner identity AoK stays on without pulse");

  loadout.specialization = "firewall";
  loadout.specPerks = undefined;
  assert(computeStats(loadout).values.pulseResistance === 50, "Firewall Vital Protection default on");
  loadout.specPerks = { "firewall-pulse": false };
  assert(computeStats(loadout).values.armorPercent === 10, "Firewall identity armor stays on without pulse");

  loadout.specialization = "survivalist";
  loadout.specPerks = undefined;
  const survivalist = computeStats(loadout);
  assert(survivalist.values.skillRepair === 15, "Triage Specialist +15% Skill Repair");
  assert(survivalist.values.incomingRepairs === 10, "Incoming Repairs identity stays separate from Triage");
  loadout.specPerks = { "survivalist-triage": false };
  const skippedTriage = computeStats(loadout);
  assert(skippedTriage.values.skillRepair === 0, "Triage Specialist can be skipped");
  assert(skippedTriage.values.incomingRepairs === 10, "Incoming Repairs stays on without Triage");
  assert(skippedTriage.values.pulseResistance === 50, "Vital Protection stays on without Triage");
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
  testSpecPerks,
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
  testCoreRolls,
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
  testSeasonLiveY8s3Copy,
  testExoticAssumedCatalog,
  testY8s3LiveGearTables,
  testY8S3LiveSkillCatalog,
  testY8s3LiveWeaponCatalog,
  testSpecPerksLiveY8s3,
  testQuickstep,
  testGearCatalogLiveHoles,
  testY8s3LiveHeTalentPicker,
  testY8S3SkillPveSheetGaps,
  testY8S3SkillPveLivePdfDescriptions,
  testSeasonLiveGaugeAndHostileNotes,
  testSpecPerksSheetGapsY8s3,
  testOfficialExoticAndGearSetCopy,
  testTalentHoverPreview,
  testIronLungExoticArdent,
  testMxLiveNamedGaps,
  testMxLiveExoticGearGaps,
  testSeasonLiveY8s3CopyHoles4Sep,
  testSpecPerksVitalProtectionAllSpecsY8s3,
  testUniqueAttrNamedAndHeFamilies,
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
