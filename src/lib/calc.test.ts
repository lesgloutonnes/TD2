import { computeStats, emptyLoadout, slotColor } from "./calc";
import { applyGearSet, createPiece } from "./piece";
import { decodeLoadout, encodeLoadout, PRESETS } from "./share";
import { NAMED_AND_EXOTICS, catalogById, catalogForSlot } from "./data/catalog";
import { WEAPONS } from "./data/weapons";
import { BRANDS } from "./data/brands";
import { GEAR_SETS, gearSetCores } from "./data/gear-sets";
import { CORE_COLORS, EMPTY_SLOT_COLOR, SLOTS, itemKindColor, clampStat } from "./data/attributes";
import { pieceInspect } from "./tooltip";

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
  assert(stats.values.chc === 32, `2pc chc + attrs + mask mod, got ${stats.values.chc}`);
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
  assert(stats.chcCapped === 48, `striker preset CHC, got ${stats.chcCapped}`);
  assert(stats.chcOvercap === 0, `striker preset no overcap, got ${stats.chcOvercap}`);
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
  assert(stats.values.chc === 32, `Ceska 1pc CHC + attrs + mask mod, got ${stats.values.chc}`);
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
  assert(loadout.gear.holster?.core === "yellow", "Picaro's primary core yellow");
  assert(stats.cores.yellow === 1, `Picaro's cœur jaune, got yellow=${stats.cores.yellow}`);
  assert(stats.cores.red === 1, `Picaro's cœur rouge extra, got red=${stats.cores.red}`);
}

function testLockedBrandAndExoticCores() {
  assert(createPiece("mask", "catharsis").core === "blue", "Catharsis armor core");
  assert(createPiece("holster", "forge").core === "yellow", "Forge skill tier core");
  assert(createPiece("kneepads", "brand:badger").core === "blue", "Badger brand armor core");
  assert(createPiece("gloves", "deathgrips").core === "blue", "Deathgrips primary armor core");
  assert(
    JSON.stringify(createPiece("gloves", "deathgrips").extraCores) === JSON.stringify(["red"]),
    "Deathgrips bonus red core",
  );
  const memento = createPiece("backpack", "memento");
  assert(memento.core === "red", "Memento primary red");
  assert(
    JSON.stringify(memento.extraCores) === JSON.stringify(["blue", "yellow"]),
    "Memento bonus blue+yellow",
  );
  // Equipping after a red piece must not inherit red.
  assert(createPiece("holster", "forge", "red").core === "yellow", "Forge ignores inherited red");
  assert(createPiece("mask", "brand:empress", "red").core === "yellow", "Empress brand locks yellow");
  assert(createPiece("holster", "waveform").core === "yellow", "Waveform skill tier");
  assert(createPiece("gloves", "btsu-datagloves").core === "yellow", "BTSU skill tier");
  assert(createPiece("chest", "tardigrade").core === "blue", "Tardigrade armor");

  const forgePicker = catalogForSlot("holster").find((item) => item.id === "forge");
  assert(forgePicker?.lockedCore === "yellow", "Forge locked yellow in picker");
  const deathgripsPicker = catalogForSlot("gloves").find((item) => item.id === "deathgrips");
  assert(deathgripsPicker?.lockedCore === "blue", "Deathgrips locked blue in picker");
  const badgerPicker = catalogForSlot("kneepads").find((item) => item.id === "brand:badger");
  assert(badgerPicker?.lockedCore === "blue", "Badger brand locked blue in picker");
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
  ]) {
    assert(catalogById(required), `catalogue manque ${required}`);
  }
}

function testWeaponCatalog() {
  const ids = WEAPONS.map((weapon) => weapon.id);
  assert(new Set(ids).size === ids.length, "ids armes uniques");
  const named = WEAPONS.filter((weapon) => weapon.quality === "named");
  const exotic = WEAPONS.filter((weapon) => weapon.quality === "exotic");
  assert(named.length >= 80, `au moins 80 armes nommées, got ${named.length}`);
  assert(exotic.length >= 22, `au moins 22 armes exotiques, got ${exotic.length}`);
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
  const mask = createPiece("mask", "set:refactor", "red");
  const chest = createPiece("chest", "set:refactor", "red");
  const holster = createPiece("holster", "set:refactor", "red");
  const backpack = createPiece("backpack", "set:refactor", "red");
  const gloves = createPiece("gloves", "set:refactor", "red");
  const kneepads = createPiece("kneepads", "set:refactor", "red");
  assert(mask.core === "yellow", "Refactor masque jaune");
  assert(chest.core === "yellow", "Refactor gilet jaune");
  assert(holster.core === "yellow", "Refactor holster jaune");
  assert(backpack.core === "blue", "Refactor sac bleu");
  assert(gloves.core === "blue", "Refactor gants bleus");
  assert(kneepads.core === "blue", "Refactor genouillères bleues");

  const loadout = emptyLoadout();
  loadout.shdWatch = false;
  loadout.expertise = 0;
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

function testStatCaps() {
  assert(clampStat("chc", 99) === 6, "CHC max 6");
  assert(clampStat("chd", 20) === 12, "CHD max 12");
  assert(clampStat("armorRegen", 5) === 0.5, "armor regen max 0.5");
  assert(clampStat("chc", -3) === 0, "no negative");
}

function testCatalogSlotLockedCore() {
  const refactorGloves = catalogForSlot("gloves").find((item) => item.id === "set:refactor");
  const refactorMask = catalogForSlot("mask").find((item) => item.id === "set:refactor");
  const strikerGloves = catalogForSlot("gloves").find((item) => item.id === "set:striker");
  const scChest = catalogForSlot("chest").find((item) => item.id === "set:system-corruption");
  assert(refactorGloves?.lockedCore === "blue", "Refactor gants bleus dans le picker");
  assert(refactorMask?.lockedCore === "yellow", "Refactor masque jaune dans le picker");
  assert(strikerGloves?.lockedCore === "red", "Striker reste rouge sur chaque pièce");
  assert(scChest?.lockedCore === "blue", "System Corruption gilet bleu dans le picker");
}

function testEverySetPieceCore() {
  for (const set of GEAR_SETS) {
    const cores = gearSetCores(set);
    for (const slot of SLOTS) {
      const piece = createPiece(slot, `set:${set.id}`, "red");
      assert(
        piece.core === cores[slot],
        `${set.name} ${slot}: expected ${cores[slot]}, got ${piece.core}`,
      );
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
  testLockedBrandAndExoticCores,
  testCatalogCoverage,
  testWeaponCatalog,
  testUniqueTalentNote,
  testSlotCoreColors,
  testRefactorSlotCores,
  testSystemCorruptionSlotCores,
  testKindColors,
  testStatCaps,
  testCatalogSlotLockedCore,
  testEverySetPieceCore,
  testApplyGearSetAllSlots,
  testInspectEmpty,
  testInspectProvidenceTiers,
  testInspectStrikerTalents,
  testInspectNinjaBoost,
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
