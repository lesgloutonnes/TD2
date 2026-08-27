"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { GearPiece, Loadout, Slot, WeaponSlot } from "@/lib/types";
import { computeStats, emptyLoadout, slotColor } from "@/lib/calc";
import { applyGearSet, createPiece, pieceLabel } from "@/lib/piece";
import { catalogById } from "@/lib/data/catalog";
import {
  CORE_COLORS,
  CORE_OPTION_LABELS,
  CORE_SHORT_LABELS,
  EMPTY_SLOT_COLOR,
  itemKindColor,
  SLOT_LABELS,
  SLOTS,
} from "@/lib/data/attributes";
import { SKILLS, SPECIALIZATIONS } from "@/lib/data/skills";
import { WEAPONS, WEAPON_TYPE_LABELS } from "@/lib/data/weapons";
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
    setLoadout((current) => ({
      ...current,
      weapons: {
        ...current.weapons,
        [slot]: weaponId ? { weaponId } : null,
      },
    }));
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
              slotColors={slotColors}
              onSelect={(slot) => {
                setActiveSlot(slot);
                if (!loadout.gear[slot]) setPickerOpen(true);
              }}
            />
            <div className="slot-grid">
              {SLOTS.map((slot) => {
                const piece = loadout.gear[slot];
                const source = piece ? catalogById(piece.sourceId) : undefined;
                return (
                  <button
                    key={slot}
                    type="button"
                    className={slot === activeSlot ? "slot-card active" : "slot-card"}
                    onClick={() => {
                      setActiveSlot(slot);
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
                              source?.uniqueTalent ? ` · ${source.uniqueTalent.name}` : ""
                            }`
                          : "Click to equip"}
                      </em>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <PieceEditor
            slot={activeSlot}
            piece={loadout.gear[activeSlot]}
            onChange={(piece) => updateGear(activeSlot, piece)}
            onClear={() => updateGear(activeSlot, null)}
            onSwap={() => setPickerOpen(true)}
          />

          <section className="kit-grid">
            <WeaponSelect
              label="Primary weapon"
              slot="primary"
              value={loadout.weapons.primary?.weaponId ?? ""}
              onChange={setWeapon}
            />
            <WeaponSelect
              label="Secondary weapon"
              slot="secondary"
              value={loadout.weapons.secondary?.weaponId ?? ""}
              onChange={setWeapon}
            />
            <WeaponSelect
              label="Sidearm"
              slot="sidearm"
              value={loadout.weapons.sidearm?.weaponId ?? ""}
              types={["pistol"]}
              onChange={setWeapon}
            />
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
            <label className="field">
              <span>Expertise ({loadout.expertise})</span>
              <input
                type="range"
                min={0}
                max={30}
                value={loadout.expertise}
                onChange={(event) =>
                  setLoadout({ ...loadout, expertise: Number(event.target.value) })
                }
              />
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

      {pickerOpen ? (
        <PickerModal
          slot={activeSlot}
          onClose={() => setPickerOpen(false)}
          onPick={(sourceId) => {
            updateGear(activeSlot, createPiece(activeSlot, sourceId, loadout.gear[activeSlot]?.core));
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
  onChange,
  types,
}: {
  label: string;
  slot: WeaponSlot;
  value: string;
  onChange: (slot: WeaponSlot, weaponId: string) => void;
  types?: Array<(typeof WEAPONS)[number]["type"]>;
}) {
  const options = types ? WEAPONS.filter((weapon) => types.includes(weapon.type)) : WEAPONS;
  const selected = WEAPONS.find((weapon) => weapon.id === value);
  return (
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
      {selected ? (
        <small className="hint">
          {selected.talent} · {selected.rpm} RPM · mag {selected.mag} · {selected.talentDesc}
        </small>
      ) : null}
    </label>
  );
}
