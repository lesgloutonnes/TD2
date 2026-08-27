import type { CSSProperties } from "react";
import type { Slot } from "@/lib/types";

const ANCHORS: Record<Slot, { x: number; y: number }> = {
  mask: { x: 50, y: 10 },
  backpack: { x: 82, y: 32 },
  chest: { x: 50, y: 38 },
  gloves: { x: 18, y: 48 },
  holster: { x: 68, y: 58 },
  kneepads: { x: 38, y: 78 },
};

export function AgentSilhouette({
  activeSlot,
  slotColors,
  onSelect,
}: {
  activeSlot: Slot | null;
  slotColors: Record<Slot, string>;
  onSelect: (slot: Slot) => void;
}) {
  return (
    <svg
      viewBox="0 0 100 110"
      className="agent-svg"
      role="img"
      aria-label="Silhouette de l'agent avec emplacements d'équipement"
    >
      <defs>
        <linearGradient id="body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1c242e" />
          <stop offset="100%" stopColor="#10151c" />
        </linearGradient>
      </defs>
      <path
        d="M50 8c4.6 0 8 3.6 8 8.2 0 4.8-3.6 8.4-8 8.4s-8-3.6-8-8.4C42 11.6 45.4 8 50 8zm-11 19h22c3 0 6 2 7 5l6 18c.6 1.8-.6 3.6-2.4 3.6h-4.2l-2 28c-.3 4-3.4 7-7.2 7H43.8c-3.8 0-6.9-3-7.2-7l-2-28H30.4c-1.8 0-3-1.8-2.4-3.6l6-18c1-3 4-5 7-5z"
        fill="url(#body)"
        stroke="#ff6b1a"
        strokeOpacity="0.35"
        strokeWidth="0.7"
      />
      {Object.entries(ANCHORS).map(([slot, point]) => {
        const isActive = activeSlot === slot;
        const color = slotColors[slot as Slot];
        return (
          <g
            key={slot}
            className="slot-anchor"
            style={{ "--slot-color": color } as CSSProperties}
            onClick={() => onSelect(slot as Slot)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(slot as Slot);
              }
            }}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r={isActive ? 7.4 : 6.4}
              fill="#07090b"
              stroke={isActive ? "#ffb347" : color}
              strokeWidth={isActive ? 1.6 : 1.1}
            />
            <circle cx={point.x} cy={point.y} r="2.2" fill={color} />
          </g>
        );
      })}
    </svg>
  );
}
