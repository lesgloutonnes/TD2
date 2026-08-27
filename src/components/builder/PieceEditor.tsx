"use client";

import type { CoreType, GearPiece, Slot, StatKey } from "@/lib/types";
import { catalogById } from "@/lib/data/catalog";
import { ALL_TALENTS, talentsForSlot } from "@/lib/data/talents";
import {
  ATTRIBUTE_GROUPS,
  canBePrototype,
  clampStat,
  CORE_OPTION_LABELS,
  defaultAttributes,
  defaultMod,
  EXPERTISE_MAX,
  formatStat,
  gearSetAttribute,
  hasGearMod,
  MOD_GROUPS,
  parseStatInput,
  SLOT_LABELS,
  STAT_LABELS,
  STAT_MAX,
  statMax,
  statStep,
} from "@/lib/data/attributes";
import { GEAR_SETS } from "@/lib/data/gear-sets";
import { isCoreLocked, setPiecePrototype } from "@/lib/piece";

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
  const coreLocked = isCoreLocked(slot, source);
  const talentOptions =
    slot === "chest" || slot === "backpack" ? talentsForSlot(slot) : [];
  const showMod = Boolean(piece && hasGearMod(slot));
  const prototypeAllowed = canBePrototype(source?.kind);
  const isPrototype = Boolean(piece?.prototype) && prototypeAllowed;

  return (
    <section className="editor">
      <header className="panel-head">
        <div>
          <p className="eyebrow">{SLOT_LABELS[slot]}</p>
          <h2>{piece ? source?.name ?? "Piece" : "Empty slot"}</h2>
        </div>
        <div className="editor-actions">
          <button type="button" className="ghost-btn" onClick={onSwap}>
            {piece ? "Change" : "Equip"}
          </button>
          {piece ? (
            <button type="button" className="ghost-btn danger" onClick={onClear}>
              Remove
            </button>
          ) : null}
        </div>
      </header>

      {!piece ? (
        <p className="empty">Pick a brand, gear set, named item, or exotic.</p>
      ) : (
        <>
          {source?.uniqueTalent ? (
            <div className="talent-box">
              <p className="eyebrow">Unique talent</p>
              <strong>{source.uniqueTalent.name}</strong>
              <p>{source.uniqueTalent.description}</p>
            </div>
          ) : null}

          {source?.kind === "gear-set" && source.gearSetId ? (
            <GearSetHint setId={source.gearSetId} slot={slot} />
          ) : null}

          {prototypeAllowed ? (
            <label className="field checkbox prototype-switch">
              <input
                type="checkbox"
                checked={isPrototype}
                onChange={(event) => onChange(setPiecePrototype(piece, event.target.checked))}
              />
              <span>
                Prototype
                <small className="hint">
                  Attribute caps ×1.5 · red/blue cores ×1.5 · requires Expertise 30. Not available on
                  exotics.
                </small>
              </span>
            </label>
          ) : (
            <p className="hint">Exotics cannot be converted to Prototype.</p>
          )}

          <label className="field">
            <span>Core</span>
            <select
              disabled={coreLocked}
              value={piece.core}
              onChange={(event) => {
                const core = event.target.value as CoreType;
                onChange({
                  ...piece,
                  core,
                  attributes:
                    source?.kind === "gear-set"
                      ? [gearSetAttribute(core)]
                      : defaultAttributes(core),
                  mods: hasGearMod(slot) ? [defaultMod(core)] : [],
                });
              }}
            >
              {(Object.keys(CORE_OPTION_LABELS) as CoreType[]).map((core) => (
                <option key={core} value={core}>
                  {CORE_OPTION_LABELS[core]}
                </option>
              ))}
            </select>
            {coreLocked ? <small className="hint">Core locked for this piece.</small> : null}
          </label>

          <label className="field expertise-field">
            <span>Expertise ({piece.expertise})</span>
            <input
              type="range"
              min={0}
              max={EXPERTISE_MAX}
              value={piece.expertise}
              onChange={(event) =>
                onChange({ ...piece, expertise: Number(event.target.value) })
              }
            />
            <small className="hint">+1% Armor on this piece per level (0–30).</small>
          </label>

          {piece.attributes.map((attribute, index) => (
            <StatRow
              key={`${attribute.stat}-${index}`}
              label={`Attribute ${index + 1}`}
              stat={attribute.stat}
              value={attribute.value}
              prototype={isPrototype}
              groups={ATTRIBUTE_GROUPS}
              onStat={(stat) => {
                const next = [...piece.attributes];
                next[index] = { stat, value: statMax(stat, isPrototype) ?? attribute.value };
                onChange({ ...piece, attributes: next });
              }}
              onValue={(value) => {
                const next = [...piece.attributes];
                next[index] = {
                  ...next[index],
                  value: clampStat(next[index].stat, value, isPrototype),
                };
                onChange({ ...piece, attributes: next });
              }}
            />
          ))}

          {showMod
            ? piece.mods.map((mod, index) => (
                <StatRow
                  key={`mod-${mod.stat}-${index}`}
                  label="Mod"
                  stat={mod.stat}
                  value={mod.value}
                  prototype={false}
                  groups={MOD_GROUPS}
                  onStat={(stat) => {
                    const next = [...piece.mods];
                    next[index] = { stat, value: STAT_MAX[stat] ?? mod.value };
                    onChange({ ...piece, mods: next });
                  }}
                  onValue={(value) => {
                    const next = [...piece.mods];
                    next[index] = { ...next[index], value: clampStat(next[index].stat, value) };
                    onChange({ ...piece, mods: next });
                  }}
                />
              ))
            : (
              <p className="hint">No gear mod on this slot (mask, backpack, and chest only).</p>
            )}

          {talentOptions.length > 0 && !talentLocked ? (
            <label className="field">
              <span>Talent</span>
              <select
                value={piece.talentId ?? ""}
                onChange={(event) => onChange({ ...piece, talentId: event.target.value })}
              >
                <option value="">None</option>
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
      <p className="eyebrow">Gear set talent (4 pieces)</p>
      <strong>{talent.name}</strong>
      <p>{talent.description}</p>
    </div>
  );
}

function StatRow({
  label,
  stat,
  value,
  prototype = false,
  groups,
  onStat,
  onValue,
}: {
  label: string;
  stat: StatKey;
  value: number;
  prototype?: boolean;
  groups: { label: string; stats: StatKey[] }[];
  onStat: (stat: StatKey) => void;
  onValue: (value: number) => void;
}) {
  const max = statMax(stat, prototype);
  return (
    <label className="field">
      <span>
        {label}
        <em>
          {formatStat(stat, value)}
          {max != null ? ` · max ${formatStat(stat, max)}` : ""}
          {prototype ? " · Prototype" : ""}
        </em>
      </span>
      <div className="field-split">
        <select value={stat} onChange={(event) => onStat(event.target.value as StatKey)}>
          {groups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.stats.map((option) => (
                <option key={option} value={option}>
                  {STAT_LABELS[option]}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={statStep(stat)}
          value={value}
          title={max != null ? `Live cap: ${formatStat(stat, max)}` : undefined}
          onChange={(event) => onValue(parseStatInput(event.target.value))}
        />
      </div>
    </label>
  );
}
