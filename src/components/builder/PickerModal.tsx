"use client";

import { useMemo, useState } from "react";
import type { ItemKind, Slot } from "@/lib/types";
import { catalogForSlot } from "@/lib/data/catalog";
import { BRANDS } from "@/lib/data/brands";
import { catalogItemLabel } from "@/lib/piece";
import {
  CORE_COLORS,
  CORE_OPTION_LABELS,
  itemKindColor,
  KIND_LABELS,
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
        className="modal"
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
        <div className="picker-list">
          {items.map((item) => (
            <div key={item.id} className="picker-row-wrap">
              <button type="button" className="picker-row" onClick={() => onPick(item.id)}>
                <span className="swatch" style={{ background: itemKindColor(item.kind) }} />
                {item.lockedCore ? (
                  <span
                    className="core-pip-mini"
                    title={CORE_OPTION_LABELS[item.lockedCore]}
                    style={{ background: CORE_COLORS[item.lockedCore] }}
                  />
                ) : null}
                <span className="picker-copy">
                  <strong>{catalogItemLabel(item)}</strong>
                  <small>
                    {KIND_LABELS[item.kind]}
                    {item.lockedCore ? ` · ${CORE_OPTION_LABELS[item.lockedCore]}` : ""}
                    {item.uniqueTalent ? ` · ${item.uniqueTalent.name}` : ""}
                    {item.note ? ` · ${item.note}` : ""}
                  </small>
                </span>
              </button>
              {item.kind === "gear-set" ? (
                <button
                  type="button"
                  className="ghost-btn set-all-btn"
                  title="Equip all 6 slots with this gear set"
                  onClick={() => onPickSet(item.id)}
                >
                  6 pieces
                </button>
              ) : null}
            </div>
          ))}
          {items.length === 0 ? <p className="empty">No results.</p> : null}
        </div>
      </div>
    </div>
  );
}
