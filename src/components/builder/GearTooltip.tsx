"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { PieceInspect } from "@/lib/tooltip";
import { GearInspectCard } from "@/components/builder/GearInspectCard";

export function GearTooltip({
  inspect,
  anchor,
}: {
  inspect: PieceInspect;
  anchor: DOMRect;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: anchor.top, left: anchor.right + 12 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const gap = 12;
    let left = anchor.right + gap;
    if (anchor.left > window.innerWidth * 0.5 || left + width > window.innerWidth - 8) {
      left = anchor.left - width - gap;
    }
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    let top = anchor.top - 16;
    top = Math.max(8, Math.min(top, window.innerHeight - height - 8));
    setPos({ top, left });
  }, [anchor, inspect]);

  const style: CSSProperties = {
    position: "fixed",
    top: pos.top,
    left: pos.left,
    zIndex: 15,
    pointerEvents: "none",
    borderColor: inspect.empty ? undefined : inspect.kindColor,
  };

  return (
    <div
      ref={ref}
      id={`gear-tooltip-${inspect.slot}`}
      className="gear-tooltip"
      role="tooltip"
      style={style}
    >
      <GearInspectCard inspect={inspect} />
    </div>
  );
}
