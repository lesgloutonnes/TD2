"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { WeaponInspect } from "@/lib/tooltip";

export function WeaponTooltip({
  inspect,
  anchor,
}: {
  inspect: WeaponInspect;
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
    zIndex: 25,
    pointerEvents: "none",
  };

  if (inspect.empty) {
    return (
      <div
        ref={ref}
        id={`weapon-tooltip-${inspect.slot}`}
        className="gear-tooltip"
        role="tooltip"
        style={style}
      >
        <p className="tt-kind">{inspect.slotLabel}</p>
        <h3>Empty slot</h3>
        <p className="tt-empty">Click to equip</p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id={`weapon-tooltip-${inspect.slot}`}
      className="gear-tooltip"
      role="tooltip"
      style={{ ...style, borderColor: inspect.qualityColor }}
    >
      <p className="tt-kind">
        {inspect.qualityLabel}
        {inspect.prototype ? " · Prototype" : ""} · {inspect.typeLabel} · {inspect.slotLabel}
      </p>
      <h3 style={{ color: inspect.qualityColor }}>{inspect.name}</h3>

      {inspect.prototype ? <p className="tt-prototype">Prototype quality</p> : null}

      <ul className="tt-stats">
        <li>
          <span>Rate of fire</span>
          <strong>{inspect.rpm} RPM</strong>
        </li>
        <li>
          <span>Magazine</span>
          <strong>{inspect.mag}</strong>
        </li>
        {inspect.expertise > 0 ? (
          <li>
            <span>Expertise</span>
            <strong>+{inspect.expertise}%</strong>
          </li>
        ) : null}
      </ul>

      {inspect.augment ? (
        <div className="tt-talent">
          <p className="tt-kind">
            Augment · Lv {inspect.augment.level} · {inspect.augment.value}% {inspect.augment.effectLabel}
          </p>
          <strong>{inspect.augment.name}</strong>
          <p>{inspect.augment.description}</p>
        </div>
      ) : null}

      {inspect.extraStats.length > 0 ? (
        <ul className="tt-stats">
          {inspect.extraStats.map((stat, index) => (
            <li key={`${stat.label}-${index}`}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </li>
          ))}
        </ul>
      ) : null}

      {inspect.mods.length > 0 ? (
        <ul className="tt-stats">
          {inspect.mods.map((stat, index) => (
            <li key={`${stat.label}-${index}`}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="tt-talent">
        <p className="tt-kind">Talent</p>
        <strong>{inspect.talent.name}</strong>
        <p>{inspect.talent.description}</p>
      </div>

      {inspect.assumedNote ? <p className="picker-tile-note">{inspect.assumedNote}</p> : null}
    </div>
  );
}
