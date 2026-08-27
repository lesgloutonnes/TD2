"use client";

import type { CoreType, GearPiece, Slot, StatKey } from "@/lib/types";
import { catalogById } from "@/lib/data/catalog";
import { ALL_TALENTS, talentsForSlot } from "@/lib/data/talents";
import {
  ATTRIBUTE_OPTIONS,
  CORE_LABELS,
  formatStat,
  MOD_OPTIONS,
  SLOT_LABELS,
  STAT_LABELS,
  STAT_MAX,
} from "@/lib/data/attributes";
import { GEAR_SETS } from "@/lib/data/gear-sets";

export function PieceEditor({
  slot,
  piece,
  onChange,
  onClear,
  onSwap,
}: {
  slot: Slot;
  piece: GearPiece | null;
  onChange: (piece: GearPiece) => void;
  onClear: () => void;
  onSwap: () => void;
}) {
  const source = piece ? catalogById(piece.sourceId) : undefined;
  const talentLocked = Boolean(source?.uniqueTalent) || source?.kind === "gear-set";
  const coreLocked = Boolean(source?.lockedCore || source?.kind === "gear-set");
  const talentOptions =
    slot === "chest" || slot === "backpack" ? talentsForSlot(slot) : [];

  return (
    <section className="editor">
      <header className="panel-head">
        <div>
          <p className="eyebrow">{SLOT_LABELS[slot]}</p>
          <h2>{piece ? source?.name ?? "Pièce" : "Emplacement vide"}</h2>
        </div>
        <div className="editor-actions">
          <button type="button" className="ghost-btn" onClick={onSwap}>
            {piece ? "Changer" : "Équiper"}
          </button>
          {piece ? (
            <button type="button" className="ghost-btn danger" onClick={onClear}>
              Retirer
            </button>
          ) : null}
        </div>
      </header>

      {!piece ? (
        <p className="empty">Choisissez une marque, un set, un nommé ou un exotique.</p>
      ) : (
        <>
          {source?.uniqueTalent ? (
            <div className="talent-box">
              <p className="eyebrow">Talent unique</p>
              <strong>{source.uniqueTalent.name}</strong>
              <p>{source.uniqueTalent.description}</p>
            </div>
          ) : null}

          {source?.kind === "gear-set" && source.gearSetId ? (
            <GearSetHint setId={source.gearSetId} slot={slot} />
          ) : null}

          <label className="field">
            <span>Cœur</span>
            <select
              disabled={coreLocked}
              value={piece.core}
              onChange={(event) =>
                onChange({ ...piece, core: event.target.value as CoreType })
              }
            >
              {(Object.keys(CORE_LABELS) as CoreType[]).map((core) => (
                <option key={core} value={core}>
                  {core === "red" ? "Rouge" : core === "blue" ? "Bleu" : "Jaune"} — {CORE_LABELS[core]}
                </option>
              ))}
            </select>
          </label>

          {piece.attributes.map((attribute, index) => (
            <StatRow
              key={`${attribute.stat}-${index}`}
              label={`Attribut ${index + 1}`}
              stat={attribute.stat}
              value={attribute.value}
              options={ATTRIBUTE_OPTIONS}
              onStat={(stat) => {
                const next = [...piece.attributes];
                next[index] = { stat, value: STAT_MAX[stat] ?? attribute.value };
                onChange({ ...piece, attributes: next });
              }}
              onValue={(value) => {
                const next = [...piece.attributes];
                next[index] = { ...next[index], value };
                onChange({ ...piece, attributes: next });
              }}
            />
          ))}

          {piece.mods.map((mod, index) => (
            <StatRow
              key={`mod-${mod.stat}-${index}`}
              label="Mod"
              stat={mod.stat}
              value={mod.value}
              options={MOD_OPTIONS}
              onStat={(stat) => {
                const next = [...piece.mods];
                next[index] = { stat, value: STAT_MAX[stat] ?? mod.value };
                onChange({ ...piece, mods: next });
              }}
              onValue={(value) => {
                const next = [...piece.mods];
                next[index] = { ...next[index], value };
                onChange({ ...piece, mods: next });
              }}
            />
          ))}

          {talentOptions.length > 0 && !talentLocked ? (
            <label className="field">
              <span>Talent</span>
              <select
                value={piece.talentId ?? ""}
                onChange={(event) => onChange({ ...piece, talentId: event.target.value })}
              >
                <option value="">Aucun</option>
                {talentOptions
                  .filter((talent) => !talent.perfect)
                  .map((talent) => (
                    <option key={talent.id} value={talent.id}>
                      {talent.name}
                    </option>
                  ))}
              </select>
            </label>
          ) : null}

          {piece.talentId && !source?.uniqueTalent ? (
            <p className="hint">
              {ALL_TALENTS.find((talent) => talent.id === piece.talentId)?.description}
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

function GearSetHint({ setId, slot }: { setId: string; slot: Slot }) {
  const set = GEAR_SETS.find((item) => item.id === setId);
  if (!set) return null;
  const talent = slot === "chest" ? set.chestTalent : slot === "backpack" ? set.backpackTalent : null;
  if (!talent) return null;
  return (
    <div className="talent-box">
      <p className="eyebrow">Talent de set (4 pièces)</p>
      <strong>{talent.name}</strong>
      <p>{talent.description}</p>
    </div>
  );
}

function StatRow({
  label,
  stat,
  value,
  options,
  onStat,
  onValue,
}: {
  label: string;
  stat: StatKey;
  value: number;
  options: StatKey[];
  onStat: (stat: StatKey) => void;
  onValue: (value: number) => void;
}) {
  return (
    <label className="field">
      <span>
        {label}
        <em>{formatStat(stat, value)}</em>
      </span>
      <div className="field-split">
        <select value={stat} onChange={(event) => onStat(event.target.value as StatKey)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {STAT_LABELS[option]}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(event) => onValue(Number(event.target.value))}
        />
      </div>
    </label>
  );
}
