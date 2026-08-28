import type { CatalogItem, CoreType, Slot } from "../types";
import { BRANDS } from "./brands";
import { GEAR_SETS, gearSetCore } from "./gear-sets";

/**
 * Live TD2 planning rules for cores:
 * - Brand HE / named / gear sets: cores recalibratable (unique talents & extraStats stay fixed).
 * - Most exotics: core locked to `lockedCore`.
 * - Exceptions: `coreLocked: false` (Investor — core rolls per drop).
 * - Multi-core exotic packages: `coreLocked: true` (Memento).
 */
export function lockedCoreFor(slot: Slot, source: CatalogItem | undefined): CoreType | undefined {
  if (!source) return undefined;

  if (source.coreLocked === false) return undefined;

  if (source.coreLocked === true) {
    return source.lockedCore ?? nativeCoreFor(slot, source);
  }

  if (source.kind === "brand" || source.kind === "named" || source.kind === "gear-set") {
    return undefined;
  }

  if (source.kind === "exotic") {
    return source.lockedCore;
  }

  return undefined;
}

export function isCoreLocked(slot: Slot, source: CatalogItem | undefined): boolean {
  return lockedCoreFor(slot, source) !== undefined;
}

export function coreLockHint(slot: Slot, source: CatalogItem | undefined): string {
  if (!isCoreLocked(slot, source)) {
    return "Recalibratable — change freely like in-game.";
  }
  if (source?.extraCores?.length) {
    return "Core package locked (exotic multi-core).";
  }
  return "Core locked (exotic).";
}

/** Default / native core when the piece is first equipped (not necessarily a lock). */
export function nativeCoreFor(slot: Slot, source: CatalogItem | undefined): CoreType {
  if (!source) return "red";
  if (source.kind === "gear-set" || source.gearSetId) {
    const set = GEAR_SETS.find((item) => item.id === source.gearSetId);
    if (set) return gearSetCore(set, slot);
  }
  if (source.lockedCore) return source.lockedCore;
  if (source.brandId) {
    const brand = BRANDS.find((item) => item.id === source.brandId);
    if (brand) return brand.core;
  }
  return "red";
}

export function resolveCore(
  slot: Slot,
  source: CatalogItem | undefined,
  core?: CoreType,
): CoreType {
  return lockedCoreFor(slot, source) ?? core ?? nativeCoreFor(slot, source);
}
