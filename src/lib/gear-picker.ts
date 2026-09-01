import type { GearPiece, Slot } from "./types";

/** Empty slot, or a second tap on the already-highlighted piece, opens the picker. */
export function shouldOpenGearPicker(
  slot: Slot,
  activeSlot: Slot,
  piece: GearPiece | null,
): boolean {
  return piece == null || slot === activeSlot;
}
