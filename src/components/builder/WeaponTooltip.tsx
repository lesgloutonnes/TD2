"use client";

import type { WeaponInspect } from "@/lib/tooltip";
import { WeaponInspectCard } from "@/components/builder/WeaponInspectCard";
import { FloatingTooltip } from "@/components/builder/FloatingTooltip";

export function WeaponTooltip({
  inspect,
  anchor,
}: {
  inspect: WeaponInspect;
  anchor: DOMRect;
}) {
  return (
    <FloatingTooltip
      id={`weapon-tooltip-${inspect.slot}`}
      anchor={anchor}
      borderColor={inspect.empty ? undefined : inspect.qualityColor}
      zIndex={25}
    >
      <WeaponInspectCard inspect={inspect} />
    </FloatingTooltip>
  );
}
