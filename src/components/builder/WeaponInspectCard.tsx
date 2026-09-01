"use client";

import type { WeaponInspect } from "@/lib/tooltip";

export function WeaponInspectCard({
  inspect,
  emptyHint = "Click to equip",
}: {
  inspect: WeaponInspect;
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
        {inspect.qualityLabel}
        {inspect.prototype ? " · Prototype" : ""} · {inspect.typeLabel} · {inspect.slotLabel}
      </p>
      <h3 style={{ color: inspect.qualityColor }}>{inspect.name}</h3>

      {inspect.prototype ? <p className="tt-prototype">Prototype quality</p> : null}

      <div className="tt-core">
        <span className="tt-core-pip" style={{ background: inspect.qualityColor }} />
        <span>Rate of fire {inspect.rpm} RPM</span>
      </div>
      <div className="tt-core extra">
        <span className="tt-core-pip" style={{ background: inspect.qualityColor }} />
        <span>Magazine {inspect.mag}</span>
      </div>
      {inspect.expertise > 0 ? (
        <div className="tt-core extra">
          <span className="tt-core-pip" />
          <span>Expertise +{inspect.expertise}%</span>
        </div>
      ) : null}

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
    </>
  );
}
