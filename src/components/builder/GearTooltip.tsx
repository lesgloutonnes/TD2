"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { PieceInspect } from "@/lib/tooltip";

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
  };

  if (inspect.empty) {
    return (
      <div
        ref={ref}
        id={`gear-tooltip-${inspect.slot}`}
        className="gear-tooltip"
        role="tooltip"
        style={style}
      >
        <p className="tt-kind">{inspect.slotLabel}</p>
        <h3>Emplacement vide</h3>
        <p className="tt-empty">Cliquer pour équiper</p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id={`gear-tooltip-${inspect.slot}`}
      className="gear-tooltip"
      role="tooltip"
      style={{ ...style, borderColor: inspect.kindColor }}
    >
      <p className="tt-kind">
        {inspect.kindLabel} · {inspect.slotLabel}
      </p>
      <h3 style={{ color: inspect.kindColor }}>{inspect.name}</h3>

      <div className="tt-core">
        <span className="tt-core-pip" style={{ background: inspect.coreColor }} />
        <span>
          {inspect.coreLabel} {inspect.coreValue}
        </span>
      </div>

      {inspect.extraCores.map((extra, index) => (
        <div key={`${extra.core}-${index}`} className="tt-core extra">
          <span className="tt-core-pip" style={{ background: extra.color }} />
          <span>Cœur bonus · {extra.label}</span>
        </div>
      ))}

      {inspect.stats.length > 0 ? (
        <ul className="tt-stats">
          {inspect.stats.map((stat, index) => (
            <li key={`${stat.label}-${index}`}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </li>
          ))}
        </ul>
      ) : null}

      {inspect.talent ? (
        <div className={inspect.talent.locked ? "tt-talent locked" : "tt-talent"}>
          <p className="tt-kind">{inspect.talent.locked ? "Talent verrouillé" : "Talent"}</p>
          <strong>{inspect.talent.name}</strong>
          <p>{inspect.talent.description}</p>
        </div>
      ) : null}

      {inspect.affiliation ? (
        <div className="tt-affiliation">
          <div className="tt-aff-head">
            <span className="swatch" style={{ background: inspect.affiliation.color }} />
            <strong>{inspect.affiliation.name}</strong>
            <em>
              {`${Math.min(inspect.affiliation.pieces, inspect.affiliation.required)}/${inspect.affiliation.required}`}
              {inspect.affiliation.ninjaBoost ? " · NinjaBike +1" : ""}
            </em>
          </div>
          {inspect.affiliation.tiers.map((tier) => (
            <div key={tier.key} className={tier.active ? "tt-tier active" : "tt-tier locked"}>
              <span className="tt-mark" aria-hidden="true">
                {tier.active ? "◆" : "◇"}
              </span>
              <span>
                <small>{tier.label}</small>
                {tier.detail}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
