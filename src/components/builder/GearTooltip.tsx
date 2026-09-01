"use client";

import type { PieceInspect } from "@/lib/tooltip";
import { GearInspectCard } from "@/components/builder/GearInspectCard";
import { FloatingTooltip } from "@/components/builder/FloatingTooltip";

export function GearTooltip({
  inspect,
  anchor,
}: {
  inspect: PieceInspect;
  anchor: DOMRect;
}) {
  return (
    <FloatingTooltip
      id={`gear-tooltip-${inspect.slot}`}
      anchor={anchor}
      borderColor={inspect.empty ? undefined : inspect.kindColor}
      zIndex={15}
    >
      <GearInspectCard inspect={inspect} />
    </FloatingTooltip>
  );
}
