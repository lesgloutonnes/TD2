"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { GearPiece, Loadout, Slot, StatKey, WeaponMod, WeaponSlot } from "@/lib/types";
import { computeStats, emptyLoadout, slotColor } from "@/lib/calc";
import { applyGearSet, createPiece, pieceLabel } from "@/lib/piece";
import { catalogById } from "@/lib/data/catalog";
import {
  CORE_COLORS,
  CORE_OPTION_LABELS,
  CORE_SHORT_LABELS,
  EMPTY_SLOT_COLOR,
  EXPERTISE_MAX,
  formatStat,
  itemKindColor,
  parseStatInput,
  PRIMARY_WEAPON_TYPES,
  SLOT_LABELS,
  SLOTS,
  STAT_LABELS,
} from "@/lib/data/attributes";
import { SKILLS, SPECIALIZATIONS } from "@/lib/data/skills";
import { WEAPONS, WEAPON_TYPE_LABELS } from "@/lib/data/weapons";
import {
  clampWeaponMod,
  defaultWeaponMods,
  WEAPON_MOD_GROUPS,
  WEAPON_MOD_KIND_LABELS,
  WEAPON_MOD_MAX,
} from "@/lib/data/weapon-mods";
import { augmentById } from "@/lib/data/augments";
import { pieceInspect } from "@/lib/tooltip";
import {
  decodeLoadout,
  deleteBuild,
  encodeLoadout,
  listSavedBuilds,
  loadBuild,
  PRESETS,
  saveBuild,
  subscribeSaved,
} from "@/lib/share";
import { AgentSilhouette } from "@/components/builder/AgentSilhouette";
import { GearTooltip } from "@/components/builder/GearTooltip";
import { PickerModal } from "@/components/builder/PickerModal";
import { PieceEditor } from "@/components/builder/PieceEditor";
import { StatsPanel } from "@/components/builder/StatsPanel";

const emptySaved: { id: string; name: string; savedAt: number }[] = [];

export function BuilderApp() {
  const hash = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("hashchange", onChange);
      return () => window.removeEventListener("hashchange", onChange);
    },
    () => window.location.hash,
    () => "",
  );
  const saved = useSyncExternalStore(subscribeSaved, listSavedBuilds, () => emptySaved);
  const [loadout, setLoadout] = useState<Loadout>(() => emptyLoadout());
  const [hashApplied, setHashApplied] = useState("");
  const [activeSlot, setActiveSlot] = useState<Slot>("mask");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hover, setHover] = useState<{ slot: Slot; rect: DOMRect } | null>(null);
  const hoverLeaveTimer = useRef<number>(0);

  function showHover(slot: Slot, rect?: DOMRect) {
    window.clearTimeout(hoverLeaveTimer.current);
    if (!rect) return;
    setHover({ slot, rect });
  }

  function hideHover() {
    window.clearTimeout(hoverLeaveTimer.current);
    hoverLeaveTimer.current = window.setTimeout(() => setHover(null), 80);
  }

  if (hash !== hashApplied) {
    setHashApplied(hash);
    const decoded = decodeLoadout(hash.replace(/^#b=/, ""));
    if (decoded) setLoadout(decoded);
  }

  const stats = useMemo(() => computeStats(loadout), [loadout]);
  const slotColors = useMemo(
    () =>
      Object.fromEntries(SLOTS.map((slot) => [slot, slotColor(slot, loadout)])) as Record<
        Slot,
        string
      >,
    [loadout],
  );

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function updateGear(slot: Slot, piece: GearPiece | null) {
    setLoadout((current) => ({
      ...current,
      gear: { ...current.gear, [slot]: piece },
    }));
  }

  function setWeapon(slot: WeaponSlot, weaponId: string) {
    setLoadout((current) => {
      if (!weaponId) {
        return {
          ...current,
          weapons: { ...current.weapons, [slot]: null },
        };
      }
      const def = WEAPONS.find((weapon) => weapon.id === weaponId);
      if (!def) return current;
      const prev = current.weapons[slot];
      return {
        ...current,
        weapons: {
          ...current.weapons,
          [slot]: {
            weaponId,
            expertise: prev?.expertise ?? 0,
            mods:
              prev?.weaponId === weaponId && prev.mods?.length
                ? prev.mods
                : defaultWeaponMods(def.type),
          },
        },
      };
    });
  }

  function setWeaponExpertise(slot: WeaponSlot, expertise: number) {
    setLoadout((current) => {
      const equipped = current.weapons[slot];
      if (!equipped) return current;
      return {
        ...current,
        weapons: {
          ...current.weapons,
          [slot]: { ...equipped, expertise },
        },
      };
    });
  }

  function setWeaponMod(slot: WeaponSlot, index: number, nextMod: WeaponMod) {
    setLoadout((current) => {
      const equipped = current.weapons[slot];
      if (!equipped) return current;
      const mods = [...(equipped.mods ?? [])];
      mods[index] = nextMod;
      return {
        ...current,
        weapons: {
          ...current.weapons,
          [slot]: { ...equipped, mods },
        },
      };
    });
  }

  async function copyShareLink() {
    const encoded = encodeLoadout(loadout);
    const url = `${window.location.origin}${window.location.pathname}#b=${encoded}`;
    window.location.hash = `b=${encoded}`;
    await navigator.clipboard.writeText(url);
    flash("Build link copied.");
  }

  function persist() {
    saveBuild(loadout);
    flash("Build saved in this browser.");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">The Division 2 · Y8S3 Red Horizon</p>
          <h1>Gear Builder</h1>
        </div>
        <label className="name-field">
          <span>Build name</span>
          <input
            value={loadout.name}
            onChange={(event) => setLoadout({ ...loadout, name: event.target.value })}
          />
        </label>
        <div className="top-actions">
          <button type="button" className="ghost-btn" onClick={() => setLoadout(emptyLoadout())}>
            Reset
          </button>
          <button type="button" className="ghost-btn" onClick={persist}>
            Save
          </button>
          <button type="button" className="primary-btn" onClick={() => void copyShareLink()}>
            Share
          </button>
        </div>
      </header>

      <section className="presets">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="preset-card"
            onClick={() => {
              setLoadout(preset.build());
              flash(`${preset.name} loaded.`);
            }}
          >
            <strong>{preset.name}</strong>
            <span>{preset.blurb}</span>
          </button>
        ))}
      </section>

      <div className="workspace">
        <div className="loadout-column">
          <div className="agent-board">
            <AgentSilhouette
              activeSlot={activeSlot}
              hoverSlot={hover?.slot ?? null}
              slotColors={slotColors}
              onSelect={(slot) => {
                setActiveSlot(slot);
                hideHover();
                if (!loadout.gear[slot]) setPickerOpen(true);
              }}
              onHover={(slot, rect) => {
                if (slot && rect) showHover(slot, rect);
                else hideHover();
              }}
            />
            <div className="slot-grid">
              {SLOTS.map((slot) => {
                const piece = loadout.gear[slot];
                const source = piece ? catalogById(piece.sourceId) : undefined;
                const hovered = hover?.slot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    className={
                      slot === activeSlot
                        ? hovered
                          ? "slot-card active hovered"
                          : "slot-card active"
                        : hovered
                          ? "slot-card hovered"
                          : "slot-card"
                    }
                    aria-describedby={`gear-tooltip-${slot}`}
                    onMouseEnter={(event) =>
                      showHover(slot, event.currentTarget.getBoundingClientRect())
                    }
                    onMouseLeave={hideHover}
                    onFocus={(event) =>
                      showHover(slot, event.currentTarget.getBoundingClientRect())
                    }
                    onBlur={hideHover}
                    onClick={() => {
                      setActiveSlot(slot);
                      hideHover();
                      if (!piece) setPickerOpen(true);
                    }}
                  >
                    <span className="swatch-col">
                      <span
                        className="swatch"
                        style={{
                          background: source ? itemKindColor(source.kind) : EMPTY_SLOT_COLOR,
                        }}
                      />
                      {piece ? (
                        <span
                          className="core-pip-mini"
                          title={CORE_OPTION_LABELS[piece.core]}
                          style={{ background: CORE_COLORS[piece.core] }}
                        />
                      ) : null}
                    </span>
                    <span>
                      <small>{SLOT_LABELS[slot]}</small>
                      <strong>{piece ? pieceLabel(piece) : "Empty"}</strong>
                      <em>
                        {piece
                          ? `${CORE_SHORT_LABELS[piece.core]}${
                              piece.prototype && source?.kind !== "exotic" ? " · Prototype" : ""
                            }${
                              piece.prototype && augmentById(piece.augmentId)
                                ? ` · ${augmentById(piece.augmentId)!.name}`
                                : ""
                            }${source?.uniqueTalent ? ` · ${source.uniqueTalent.name}` : ""}`
                          : "Click to equip"}
                      </em>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="agent-meta">
              <label className="field">
                <span>Specialization</span>
                <select
                  value={loadout.specialization ?? ""}
                  onChange={(event) =>
                    setLoadout({ ...loadout, specialization: event.target.value || null })
                  }
                >
                  <option value="">None</option>
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name} — {spec.signature}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field checkbox">
                <input
                  type="checkbox"
                  checked={loadout.shdWatch}
                  onChange={(event) => setLoadout({ ...loadout, shdWatch: event.target.checked })}
                />
                <span>SHD Watch 1000</span>
              </label>
            </div>
          </div>

          <PieceEditor
            slot={activeSlot}
            piece={loadout.gear[activeSlot]}
            onChange={(piece) => updateGear(activeSlot, piece)}
            onClear={() => updateGear(activeSlot, null)}
            onSwap={() => {
              hideHover();
              setPickerOpen(true);
            }}
          />

          <section className="kit-grid">
            <WeaponSelect
              label="Primary weapon"
              slot="primary"
              value={loadout.weapons.primary?.weaponId ?? ""}
              expertise={loadout.weapons.primary?.expertise ?? 0}
              mods={loadout.weapons.primary?.mods ?? []}
              types={[...PRIMARY_WEAPON_TYPES]}
              onChange={setWeapon}
              onExpertiseChange={setWeaponExpertise}
              onModChange={setWeaponMod}
            />
            <WeaponSelect
              label="Secondary weapon"
              slot="secondary"
              value={loadout.weapons.secondary?.weaponId ?? ""}
              expertise={loadout.weapons.secondary?.expertise ?? 0}
              mods={loadout.weapons.secondary?.mods ?? []}
              types={[...PRIMARY_WEAPON_TYPES]}
              onChange={setWeapon}
              onExpertiseChange={setWeaponExpertise}
              onModChange={setWeaponMod}
            />
            <WeaponSelect
              label="Sidearm"
              slot="sidearm"
              value={loadout.weapons.sidearm?.weaponId ?? ""}
              expertise={loadout.weapons.sidearm?.expertise ?? 0}
              mods={loadout.weapons.sidearm?.mods ?? []}
              types={["pistol"]}
              onChange={setWeapon}
              onExpertiseChange={setWeaponExpertise}
              onModChange={setWeaponMod}
            />
            <div className="kit-spacer" aria-hidden="true" />
            <label className="field">
              <span>Skill 1</span>
              <select
                value={loadout.skills[0] ?? ""}
                onChange={(event) =>
                  setLoadout({
                    ...loadout,
                    skills: [event.target.value || null, loadout.skills[1]],
                  })
                }
              >
                <option value="">None</option>
                {SKILLS.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.category} — {skill.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Skill 2</span>
              <select
                value={loadout.skills[1] ?? ""}
                onChange={(event) =>
                  setLoadout({
                    ...loadout,
                    skills: [loadout.skills[0], event.target.value || null],
                  })
                }
              >
                <option value="">None</option>
                {SKILLS.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.category} — {skill.name}
                  </option>
                ))}
              </select>
            </label>
          </section>

          {saved.length > 0 ? (
            <section className="saved">
              <h3>Saved builds</h3>
              <ul>
                {saved.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => {
                        const next = loadBuild(item.id);
                        if (next) setLoadout(next);
                      }}
                    >
                      {item.name}
                    </button>
                    <button
                      type="button"
                      className="ghost-btn danger"
                      onClick={() => {
                        deleteBuild(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <StatsPanel loadout={loadout} stats={stats} />
      </div>

      {hover && !pickerOpen ? (
        <GearTooltip inspect={pieceInspect(hover.slot, loadout)} anchor={hover.rect} />
      ) : null}

      {pickerOpen ? (
        <PickerModal
          slot={activeSlot}
          onClose={() => setPickerOpen(false)}
          onPick={(sourceId) => {
            // Always resolve the piece's own locked/brand core — never inherit the previous slot core.
            updateGear(activeSlot, createPiece(activeSlot, sourceId));
            setPickerOpen(false);
          }}
          onPickSet={(sourceId) => {
            setLoadout((current) => applyGearSet(current, sourceId));
            setPickerOpen(false);
            const source = catalogById(sourceId);
            if (source) flash(`${source.name}: 6 pieces equipped.`);
          }}
        />
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}

      <footer className="legal">
        Fan-made, offline, no account. Live Y8S3 Red Horizon data (27 Aug 2026):
        brands, gear sets, talents, named items, exotics. Not affiliated with Ubisoft.
      </footer>
    </div>
  );
}

function WeaponSelect({
  label,
  slot,
  value,
  expertise,
  mods,
  onChange,
  onExpertiseChange,
  onModChange,
  types,
}: {
  label: string;
  slot: WeaponSlot;
  value: string;
  expertise: number;
  mods: WeaponMod[];
  onChange: (slot: WeaponSlot, weaponId: string) => void;
  onExpertiseChange: (slot: WeaponSlot, expertise: number) => void;
  onModChange: (slot: WeaponSlot, index: number, mod: WeaponMod) => void;
  types?: Array<(typeof WEAPONS)[number]["type"]>;
}) {
  const options = types ? WEAPONS.filter((weapon) => types.includes(weapon.type)) : WEAPONS;
  const selected = WEAPONS.find((weapon) => weapon.id === value);
  return (
    <div className="field weapon-field">
      <label className="field">
        <span>{label}</span>
        <select value={value} onChange={(event) => onChange(slot, event.target.value)}>
          <option value="">None</option>
          {options.map((weapon) => (
            <option key={weapon.id} value={weapon.id}>
              {WEAPON_TYPE_LABELS[weapon.type]} — {weapon.name}
            </option>
          ))}
        </select>
      </label>
      {selected ? (
        <>
          <small className="hint">
            {selected.talent} · {selected.rpm} RPM · mag {selected.mag} · {selected.talentDesc}
          </small>
          <label className="field expertise-field">
            <span>Expertise ({expertise})</span>
            <input
              type="range"
              min={0}
              max={EXPERTISE_MAX}
              value={expertise}
              onChange={(event) => onExpertiseChange(slot, Number(event.target.value))}
            />
          </label>
          <div className="weapon-mods">
            <p className="eyebrow">Weapon mods</p>
            {mods.map((mod, index) => {
              const groups = WEAPON_MOD_GROUPS[mod.kind];
              const max = WEAPON_MOD_MAX[mod.stat];
              return (
                <div key={`${mod.kind}-${index}`} className="weapon-mod-row">
                  <label className="field">
                    <span>{WEAPON_MOD_KIND_LABELS[mod.kind]}</span>
                    <select
                      value={mod.stat}
                      onChange={(event) => {
                        const stat = event.target.value as StatKey;
                        onModChange(slot, index, {
                          kind: mod.kind,
                          stat,
                          value: clampWeaponMod(stat, WEAPON_MOD_MAX[stat] ?? mod.value),
                        });
                      }}
                    >
                      {groups.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.stats.map((stat) => (
                            <option key={stat} value={stat}>
                              {STAT_LABELS[stat]}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>
                      {formatStat(mod.stat, mod.value)}
                      {max != null ? ` · max ${formatStat(mod.stat, max)}` : ""}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={max}
                      step={0.1}
                      value={mod.value}
                      onChange={(event) =>
                        onModChange(slot, index, {
                          ...mod,
                          value: clampWeaponMod(mod.stat, parseStatInput(event.target.value)),
                        })
                      }
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
