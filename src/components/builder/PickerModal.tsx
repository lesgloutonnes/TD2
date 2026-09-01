"use client";

import { useMemo, useState } from "react";
import type { CatalogItem, ItemKind, Slot } from "@/lib/types";
import { catalogForSlot } from "@/lib/data/catalog";
import { BRANDS } from "@/lib/data/brands";
import { GEAR_SETS } from "@/lib/data/gear-sets";
import { nativeCoreFor } from "@/lib/piece";
import { formatBonusList } from "@/lib/calc";
import {
  CORE_COLORS,
  CORE_OPTION_LABELS,
  CORE_VALUES,
  formatStat,
  itemKindColor,
  KIND_LABELS,
  STAT_LABELS,
} from "@/lib/data/attributes";

export function PickerModal({
  slot,
  onClose,
  onPick,
  onPickSet,
}: {
  slot: Slot;
  onClose: () => void;
  onPick: (sourceId: string) => void;
  onPickSet: (sourceId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ItemKind | "all">("all");

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return catalogForSlot(slot).filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (!needle) return true;
      const brandName =
        item.brandId != null
          ? (BRANDS.find((brand) => brand.id === item.brandId)?.name ?? "")
          : "";
      const haystack =
        `${item.name} ${brandName} ${item.uniqueTalent?.name ?? ""} ${item.note ?? ""}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [kind, query, slot]);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal picker-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <p className="eyebrow">Gear</p>
            <h2 id="picker-title">Choose a piece</h2>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <input
          className="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a brand, gear set, named item…"
          autoFocus
        />
        <div className="chip-row">
          <button
            type="button"
            className={kind === "all" ? "chip active" : "chip"}
            onClick={() => setKind("all")}
          >
            All
          </button>
          {(Object.keys(KIND_LABELS) as ItemKind[]).map((key) => (
            <button
              key={key}
              type="button"
              className={kind === key ? "chip active" : "chip"}
              onClick={() => setKind(key)}
            >
              {KIND_LABELS[key]}
            </button>
          ))}
        </div>
        <div className="picker-grid">
          {items.map((item) => (
            <PickerTile
              key={item.id}
              item={item}
              slot={slot}
              onPick={onPick}
              onPickSet={onPickSet}
            />
          ))}
          {items.length === 0 ? <p className="empty picker-empty">No results.</p> : null}
        </div>
      </div>
    </div>
  );
}

function PickerTile({
  item,
  slot,
  onPick,
  onPickSet,
}: {
  item: CatalogItem;
  slot: Slot;
  onPick: (sourceId: string) => void;
  onPickSet: (sourceId: string) => void;
}) {
  const kindColor = itemKindColor(item.kind);
  const brand = item.brandId ? BRANDS.find((entry) => entry.id === item.brandId) : undefined;
  const set = item.gearSetId ? GEAR_SETS.find((entry) => entry.id === item.gearSetId) : undefined;
  const core = nativeCoreFor(slot, item);
  const coreLocked = Boolean(item.lockedCore);
  const extraCores = item.extraCores ?? [];

  return (
    <article className="picker-tile" style={{ borderColor: kindColor }}>
      <button type="button" className="picker-tile-hit" onClick={() => onPick(item.id)}>
        <p className="tt-kind">{KIND_LABELS[item.kind]}</p>
        <h3 style={{ color: kindColor }}>{item.name}</h3>

        <div className="tt-core">
          <span className="tt-core-pip" style={{ background: CORE_COLORS[core] }} />
          <span>
            {CORE_OPTION_LABELS[core]} {formatStat(CORE_VALUES[core].stat, CORE_VALUES[core].value)}
            {coreLocked ? " · locked" : ""}
          </span>
        </div>

        {extraCores.map((extra) => (
          <div key={extra} className="tt-core extra">
            <span className="tt-core-pip" style={{ background: CORE_COLORS[extra] }} />
            <span>Bonus core · {CORE_OPTION_LABELS[extra]}</span>
          </div>
        ))}

        {item.extraStats?.length ? (
          <ul className="tt-stats">
            {item.extraStats.map((stat) => (
              <li key={stat.stat}>
                <span>{STAT_LABELS[stat.stat]}</span>
                <strong>{formatStat(stat.stat, stat.value)}</strong>
              </li>
            ))}
          </ul>
        ) : null}

        {item.uniqueTalent ? (
          <div className="tt-talent">
            <p className="tt-kind">Talent</p>
            <strong>{item.uniqueTalent.name}</strong>
            <p>{item.uniqueTalent.description}</p>
          </div>
        ) : null}

        {item.note && !item.uniqueTalent ? <p className="picker-tile-note">{item.note}</p> : null}

        {brand ? (
          <div className="tt-affiliation">
            <div className="tt-aff-head">
              <span className="swatch" style={{ background: brand.color }} />
              <strong>{brand.name}</strong>
            </div>
            {item.kind === "brand"
              ? brand.bonuses.map((bonuses, index) => (
                  <div key={`${brand.id}-${index}`} className="tt-tier">
                    <span className="tt-mark" aria-hidden="true">
                      ◆
                    </span>
                    <span>
                      <small>{index + 1} piece</small>
                      {formatBonusList(bonuses)}
                    </span>
                  </div>
                ))
              : null}
          </div>
        ) : null}

        {set ? (
          <div className="tt-affiliation">
            <div className="tt-aff-head">
              <span className="swatch" style={{ background: set.color }} />
              <strong>{set.name}</strong>
            </div>
            <div className="tt-tier">
              <span className="tt-mark" aria-hidden="true">
                ◆
              </span>
              <span>
                <small>2 piece</small>
                {set.two}
              </span>
            </div>
            <div className="tt-tier">
              <span className="tt-mark" aria-hidden="true">
                ◆
              </span>
              <span>
                <small>3 piece</small>
                {set.three}
              </span>
            </div>
            <div className="tt-tier">
              <span className="tt-mark" aria-hidden="true">
                ◆
              </span>
              <span>
                <small>4 piece</small>
                {set.four}
              </span>
            </div>
          </div>
        ) : null}
      </button>
      {item.kind === "gear-set" ? (
        <button
          type="button"
          className="picker-tile-all"
          title="Equip all 6 slots with this gear set"
          onClick={() => onPickSet(item.id)}
        >
          Equip 6 pieces
        </button>
      ) : null}
    </article>
  );
}
