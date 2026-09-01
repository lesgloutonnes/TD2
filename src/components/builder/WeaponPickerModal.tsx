"use client";

import { useMemo, useState } from "react";
import type { WeaponDef, WeaponType } from "@/lib/types";
import { weaponsSorted } from "@/lib/data/skill-mods";
import { WEAPON_TYPE_LABELS } from "@/lib/data/weapons";
import { STAT_LABELS, WEAPON_QUALITY_LABELS, formatStat, weaponDisplayColor } from "@/lib/data/attributes";

type QualityFilter = "featured" | "all" | "named" | "exotic" | "high-end";

const QUALITY_RANK: Record<WeaponDef["quality"], number> = {
  exotic: 0,
  named: 1,
  "high-end": 2,
};

export function WeaponPickerModal({
  title,
  types,
  selectedId,
  onClose,
  onPick,
}: {
  title: string;
  types: readonly WeaponType[];
  selectedId: string;
  onClose: () => void;
  onPick: (weaponId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [quality, setQuality] = useState<QualityFilter>("featured");
  const [type, setType] = useState<WeaponType | "all">("all");

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = weaponsSorted(types).filter((weapon) => {
      if (type !== "all" && weapon.type !== type) return false;
      if (quality === "featured" && weapon.quality === "high-end") return false;
      if (quality === "named" && weapon.quality !== "named") return false;
      if (quality === "exotic" && weapon.quality !== "exotic") return false;
      if (quality === "high-end" && weapon.quality !== "high-end") return false;
      if (!needle) return true;
      const haystack =
        `${weapon.name} ${weapon.talent} ${weapon.talentDesc} ${WEAPON_TYPE_LABELS[weapon.type]}`.toLowerCase();
      return haystack.includes(needle);
    });
    return list.sort((a, b) => {
      const qualityDelta = QUALITY_RANK[a.quality] - QUALITY_RANK[b.quality];
      if (qualityDelta !== 0) return qualityDelta;
      const typeDelta =
        types.indexOf(a.type) - types.indexOf(b.type) ||
        a.type.localeCompare(b.type);
      if (typeDelta !== 0) return typeDelta;
      return a.name.localeCompare(b.name, "en");
    });
  }, [quality, query, type, types]);

  const typeOptions = types.filter((entry, index) => types.indexOf(entry) === index);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal picker-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="weapon-picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <p className="eyebrow">Weapons</p>
            <h2 id="weapon-picker-title">{title}</h2>
          </div>
          <div className="editor-actions">
            {selectedId ? (
              <button type="button" className="ghost-btn danger" onClick={() => onPick("")}>
                Unequip
              </button>
            ) : null}
            <button type="button" className="ghost-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <input
          className="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a named, exotic, talent…"
          autoFocus
        />
        <div className="chip-row">
          {(
            [
              ["featured", "Named & Exotic"],
              ["all", "All"],
              ["exotic", "Exotics"],
              ["named", "Named"],
              ["high-end", "High-End"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={quality === key ? "chip active" : "chip"}
              onClick={() => setQuality(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {typeOptions.length > 1 ? (
          <div className="chip-row">
            <button
              type="button"
              className={type === "all" ? "chip active" : "chip"}
              onClick={() => setType("all")}
            >
              All types
            </button>
            {typeOptions.map((key) => (
              <button
                key={key}
                type="button"
                className={type === key ? "chip active" : "chip"}
                onClick={() => setType(key)}
              >
                {WEAPON_TYPE_LABELS[key]}
              </button>
            ))}
          </div>
        ) : null}
        <div className="picker-grid">
          {items.map((weapon) => (
            <WeaponTile
              key={weapon.id}
              weapon={weapon}
              selected={weapon.id === selectedId}
              onPick={onPick}
            />
          ))}
          {items.length === 0 ? <p className="empty picker-empty">No results.</p> : null}
        </div>
      </div>
    </div>
  );
}

function WeaponTile({
  weapon,
  selected,
  onPick,
}: {
  weapon: WeaponDef;
  selected: boolean;
  onPick: (weaponId: string) => void;
}) {
  const color = weaponDisplayColor(weapon.quality);
  return (
    <article
      className={selected ? "picker-tile is-selected" : "picker-tile"}
      style={{ borderColor: color }}
    >
      <button type="button" className="picker-tile-hit" onClick={() => onPick(weapon.id)}>
        <p className="tt-kind">
          {WEAPON_QUALITY_LABELS[weapon.quality]} · {WEAPON_TYPE_LABELS[weapon.type]}
        </p>
        <h3 style={{ color }}>{weapon.name}</h3>
        <div className="tt-core">
          <span className="tt-core-pip" style={{ background: color }} />
          <span>Rate of fire {weapon.rpm} RPM</span>
        </div>
        <div className="tt-core extra">
          <span className="tt-core-pip" style={{ background: color }} />
          <span>Magazine {weapon.mag}</span>
        </div>
        {weapon.extraStats?.length ? (
          <ul className="tt-stats">
            {weapon.extraStats.map((stat) => (
              <li key={stat.stat}>
                <span>{STAT_LABELS[stat.stat]}</span>
                <strong>{formatStat(stat.stat, stat.value)}</strong>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="tt-talent">
          <p className="tt-kind">Talent</p>
          <strong>{weapon.talent}</strong>
          <p>{weapon.talentDesc}</p>
        </div>
      </button>
    </article>
  );
}
