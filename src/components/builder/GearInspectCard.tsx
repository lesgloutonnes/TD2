"use client";

import type { PieceInspect } from "@/lib/tooltip";

export function GearInspectCard({
  inspect,
  emptyHint = "Click to equip",
}: {
  inspect: PieceInspect;
  emptyHint?: string;
}) {
  if (inspect.empty) {
    return (
      <>
        <p className="tt-kind">{inspect.slotLabel}</p>
        <h3>Empty slot</h3>
        <p className="tt-empty">{emptyHint}</p>
      </>
    );
  }

  return (
    <>
      <p className="tt-kind">
        {inspect.kindLabel}
        {inspect.prototype ? " · Prototype" : ""} · {inspect.slotLabel}
      </p>
      <h3 style={{ color: inspect.kindColor }}>{inspect.name}</h3>

      {inspect.prototype ? <p className="tt-prototype">Prototype quality</p> : null}

      {inspect.augment ? (
        <div className="tt-talent">
          <p className="tt-kind">
            Augment · Lv {inspect.augment.level} · {inspect.augment.value}% {inspect.augment.effectLabel}
          </p>
          <strong>{inspect.augment.name}</strong>
          <p>{inspect.augment.description}</p>
        </div>
      ) : null}

      <div className="tt-core">
        <span className="tt-core-pip" style={{ background: inspect.coreColor }} />
        <span>
          {inspect.coreLabel} {inspect.coreValue}
        </span>
      </div>

      {inspect.extraCores.map((extra, index) => (
        <div key={`${extra.core}-${index}`} className="tt-core extra">
          <span className="tt-core-pip" style={{ background: extra.color }} />
          <span>Bonus core · {extra.label} {extra.value}</span>
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
          <p className="tt-kind">{inspect.talent.locked ? "Locked talent" : "Talent"}</p>
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
    </>
  );
}
