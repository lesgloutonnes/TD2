import { computeStats, emptyLoadout } from "./calc";
import { createPiece } from "./piece";
import { decodeLoadout, encodeLoadout, PRESETS } from "./share";
import { NAMED_AND_EXOTICS, catalogById } from "./data/catalog";
import { WEAPONS } from "./data/weapons";
import { BRANDS } from "./data/brands";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function testEmpty() {
  const stats = computeStats(emptyLoadout());
  assert(stats.cores.red === 0, "empty cores");
  assert(stats.values.chc === 10, "watch CHC still applied by default");
}

function testWatchOff() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.expertise = 0;
  const stats = computeStats(loadout);
  assert(stats.values.chc === 0, "no watch chc");
  assert(stats.values.weaponDamage === 0, "no watch wd");
}

function testProvidence3() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.expertise = 0;
  loadout.gear.mask = createPiece("mask", "brand:providence");
  loadout.gear.gloves = createPiece("gloves", "brand:providence");
  loadout.gear.holster = createPiece("holster", "brand:providence");
  const stats = computeStats(loadout);
  assert(stats.values.hsd === 13, `1pc hsd, got ${stats.values.hsd}`);
  assert(stats.values.chc === 44, `2pc chc + attrs + mods, got ${stats.values.chc}`);
  assert(stats.values.chd === 49, `3pc chd + attrs, got ${stats.values.chd}`);
}

function testNinja() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.expertise = 0;
  loadout.gear.mask = createPiece("mask", "brand:providence");
  loadout.gear.backpack = createPiece("backpack", "ninjabike");
  const stats = computeStats(loadout);
  assert(stats.values.hsd === 13, `ninja 1pc hsd, got ${stats.values.hsd}`);
  assert(stats.values.chc >= 8, `ninja unlocks 2pc chc, got ${stats.values.chc}`);
}

function testStriker4() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.expertise = 0;
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
  loadout.expertise = 0;
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
  loadout.expertise = 0;
  loadout.specialization = "technician";
  for (const slot of ["mask", "backpack", "chest", "gloves", "holster", "kneepads"] as const) {
    loadout.gear[slot] = createPiece(slot, "brand:empress", "yellow");
  }
  const stats = computeStats(loadout);
  assert(stats.values.skillTier === 7, `6 yellow + technician, got ${stats.values.skillTier}`);
  assert(stats.skillTierCapped === 6, "tier cap 6");
}

function testStrikerPresetChc() {
  const loadout = PRESETS[0].build();
  const stats = computeStats(loadout);
  assert(stats.chcCapped === 60, `striker preset capped at 60, got ${stats.chcCapped}`);
  assert(stats.chcOvercap <= 2, `striker preset little overcap, got ${stats.chcOvercap}`);
}

function testY8s3Brands() {
  const walker = emptyLoadout();
  walker.shdWatch = false;
  walker.expertise = 0;
  walker.gear.mask = createPiece("mask", "brand:walker");
  const walkerStats = computeStats(walker);
  assert(
    walkerStats.values.weaponDamage === 21,
    `Walker 1pc 6% WD + cœur 15%, got ${walkerStats.values.weaponDamage}`,
  );

  const grupo = emptyLoadout();
  grupo.shdWatch = false;
  grupo.expertise = 0;
  grupo.gear.gloves = createPiece("gloves", "brand:grupo");
  grupo.gear.holster = createPiece("holster", "brand:grupo");
  grupo.gear.kneepads = createPiece("kneepads", "brand:grupo");
  const grupoStats = computeStats(grupo);
  assert(grupoStats.values.hsd === 39, `Grupo 3pc 39% HSD, got ${grupoStats.values.hsd}`);
}

function testCeskaY8s3() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.expertise = 0;
  loadout.gear.mask = createPiece("mask", "brand:ceska");
  loadout.gear.gloves = createPiece("gloves", "brand:ceska");
  loadout.gear.holster = createPiece("holster", "brand:ceska");
  const stats = computeStats(loadout);
  assert(stats.values.chc === 44, `Ceska 1pc CHC + attrs, got ${stats.values.chc}`);
  assert(stats.values.shotgunDamage === 24, `Ceska 2pc shotgun, got ${stats.values.shotgunDamage}`);
  assert(
    stats.values.hazardProtection === 30,
    `Ceska 3pc hazard, got ${stats.values.hazardProtection}`,
  );
  assert(stats.values.health === 0, `Ceska n'a plus de bonus Santé, got ${stats.values.health}`);
}

function testEmberEngine() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.expertise = 0;
  loadout.gear.mask = createPiece("mask", "set:ember-engine");
  loadout.gear.backpack = createPiece("backpack", "set:ember-engine");
  loadout.gear.chest = createPiece("chest", "set:ember-engine");
  loadout.gear.gloves = createPiece("gloves", "set:ember-engine");
  const stats = computeStats(loadout);
  assert(stats.values.skillEfficiency === 8, `2pc efficiency, got ${stats.values.skillEfficiency}`);
  assert(stats.values.statusEffects === 30, `3pc status, got ${stats.values.statusEffects}`);
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
  loadout.expertise = 0;
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
  loadout.expertise = 0;
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
}

function testNamedExtraStats() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.expertise = 0;
  loadout.gear.gloves = createPiece("gloves", "contractors-gloves");
  loadout.gear.kneepads = createPiece("kneepads", "foxs-prayer");
  const stats = computeStats(loadout);
  assert(stats.values.damageToArmor === 8, `Contractor's +8 DtA, got ${stats.values.damageToArmor}`);
  assert(stats.values.damageToHealth === 8, `Fox's +8 DtH, got ${stats.values.damageToHealth}`);
}

function testPicaroExtraCore() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.expertise = 0;
  loadout.gear.holster = createPiece("holster", "picaros-holster");
  const stats = computeStats(loadout);
  assert(stats.cores.yellow === 1, `Picaro's cœur jaune, got yellow=${stats.cores.yellow}`);
  assert(stats.cores.red === 1, `Picaro's cœur rouge extra, got red=${stats.cores.red}`);
}

function testCatalogCoverage() {
  const ids = NAMED_AND_EXOTICS.map((item) => item.id);
  assert(new Set(ids).size === ids.length, "ids nommés/exotiques uniques");

  const named = NAMED_AND_EXOTICS.filter((item) => item.kind === "named");
  const exotic = NAMED_AND_EXOTICS.filter((item) => item.kind === "exotic");
  assert(named.length >= 50, `au moins 50 nommés, got ${named.length}`);
  assert(exotic.length >= 20, `au moins 20 exotiques gear, got ${exotic.length}`);

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
  ]) {
    assert(catalogById(required), `catalogue manque ${required}`);
  }
}

function testWeaponCatalog() {
  const ids = WEAPONS.map((weapon) => weapon.id);
  assert(new Set(ids).size === ids.length, "ids armes uniques");
  const named = WEAPONS.filter((weapon) => weapon.quality === "named");
  const exotic = WEAPONS.filter((weapon) => weapon.quality === "exotic");
  assert(named.length >= 25, `au moins 25 armes nommées, got ${named.length}`);
  assert(exotic.length >= 20, `au moins 20 armes exotiques, got ${exotic.length}`);
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
  ]) {
    assert(
      WEAPONS.some((weapon) => weapon.id === required),
      `arme manquante ${required}`,
    );
  }
}

function testUniqueTalentNote() {
  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.expertise = 0;
  loadout.gear.chest = createPiece("chest", "the-sacrifice");
  const stats = computeStats(loadout);
  assert(
    stats.notes.some((note) => note.includes("Perfect Glass Cannon")),
    "note talent unique Sacrifice",
  );
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
  testStrikerPresetChc,
  testY8s3Brands,
  testCeskaY8s3,
  testEmberEngine,
  testAcesY8s3,
  testHotshotHandlingMove,
  testNamedBrandCorrections,
  testNamedExtraStats,
  testPicaroExtraCore,
  testCatalogCoverage,
  testWeaponCatalog,
  testUniqueTalentNote,
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
