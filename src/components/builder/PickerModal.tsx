"use client";

import { useMemo, useState } from "react";
import type { ItemKind, Slot } from "@/lib/types";
import { catalogForSlot } from "@/lib/data/catalog";
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
      return item.name.toLowerCase().includes(needle);
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
            <p className="eyebrow">Équipement</p>
            <h2 id="picker-title">Choisir une pièce</h2>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Fermer
          </button>
        </div>
        <input
          className="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher une marque, un set, un nommé…"
          autoFocus
        />
        <div className="chip-row">
          <button
            type="button"
            className={kind === "all" ? "chip active" : "chip"}
            onClick={() => setKind("all")}
          >
            Tout
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
                  <strong>{item.name}</strong>
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
                  title="Équiper les 6 emplacements avec ce set"
                  onClick={() => onPickSet(item.id)}
                >
                  6 pièces
                </button>
              ) : null}
            </div>
          ))}
          {items.length === 0 ? <p className="empty">Aucun résultat.</p> : null}
        </div>
      </div>
    </div>
  );
}
