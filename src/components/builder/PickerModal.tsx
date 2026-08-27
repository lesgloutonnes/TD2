"use client";

import { useMemo, useState } from "react";
import type { ItemKind, Slot } from "@/lib/types";
import { catalogForSlot } from "@/lib/data/catalog";
import { itemKindColor } from "@/lib/data/attributes";

const KIND_LABELS: Record<ItemKind, string> = {
  brand: "Marques",
  "gear-set": "Sets",
  named: "Nommés",
  exotic: "Exotiques",
};

export function PickerModal({
  slot,
  onClose,
  onPick,
}: {
  slot: Slot;
  onClose: () => void;
  onPick: (sourceId: string) => void;
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
            <button
              key={item.id}
              type="button"
              className="picker-row"
              onClick={() => onPick(item.id)}
            >
              <span className="swatch" style={{ background: itemKindColor(item.kind) }} />
              <span className="picker-copy">
                <strong>{item.name}</strong>
                <small>
                  {KIND_LABELS[item.kind]}
                  {item.uniqueTalent ? ` · ${item.uniqueTalent.name}` : ""}
                  {item.note ? ` · ${item.note}` : ""}
                </small>
              </span>
            </button>
          ))}
          {items.length === 0 ? <p className="empty">Aucun résultat.</p> : null}
        </div>
      </div>
    </div>
  );
}
