"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type {
  EquippedSkill,
  EquippedWeapon,
  GearPiece,
  Loadout,
  ShdWatchPartId,
  Slot,
  StatKey,
  WeaponMod,
  WeaponSlot,
  WeaponType,
} from "@/lib/types";
import { computeStats, emptyLoadout, slotColor } from "@/lib/calc";
import { applyGearSet, createPiece, pieceLabel, setWeaponPrototype } from "@/lib/piece";
import { catalogById } from "@/lib/data/catalog";
import {
  CORE_COLORS,
  CORE_OPTION_LABELS,
  CORE_SHORT_LABELS,
  EMPTY_SLOT_COLOR,
  EXPERTISE_MAX,
  formatStat,
  itemDisplayColor,
  parseStatInput,
  PRIMARY_WEAPON_TYPES,
  SHD_WATCH_PARTS,
  SLOT_LABELS,
  SLOTS,
  STAT_LABELS,
  WEAPON_QUALITY_LABELS,
  WEAPON_SLOT_LABELS,
  canWeaponBePrototype,
  weaponDisplayColor,
} from "@/lib/data/attributes";
import { SKILLS, SPECIALIZATIONS } from "@/lib/data/skills";
import { WEAPON_TYPE_LABELS, weaponById } from "@/lib/data/weapons";
import {
  defaultWeaponTalentId,
  weaponTalentsForType,
} from "@/lib/data/weapon-talents";
import { resolveWeaponTalent } from "@/lib/builder-model";
import {
  clampWeaponMod,
  defaultWeaponMods,
  WEAPON_MOD_GROUPS,
  WEAPON_MOD_KIND_LABELS,
  WEAPON_MOD_MAX,
} from "@/lib/data/weapon-mods";
import {
  defaultSkillMods,
  sanitizeSkillMods,
  skillModOptionLabel,
  skillModSlotsFor,
  skillModOptionById,
} from "@/lib/data/skill-mods";
import {
  AUGMENT_LEVEL_MAX,
  AUGMENT_LEVEL_MIN,
  AUGMENTS,
  augmentById,
  clampAugmentLevel,
} from "@/lib/data/augments";
import { pieceInspect, weaponInspect } from "@/lib/tooltip";
import { shouldOpenGearPicker } from "@/lib/gear-picker";
import { usePhoneLayout } from "@/hooks/usePhoneLayout";
import {
  decodeLoadout,
  deleteBuild,
  encodeLoadout,
  listSavedBuilds,
  loadBuild,
  PRESETS,
  renameBuild,
  saveBuild,
  subscribeSaved,
} from "@/lib/share";
import { AgentSilhouette } from "@/components/builder/AgentSilhouette";
import { GearInspectCard } from "@/components/builder/GearInspectCard";
import { GearTooltip } from "@/components/builder/GearTooltip";
import { PhoneDock, type PhoneTab } from "@/components/builder/PhoneDock";
import { WeaponTooltip } from "@/components/builder/WeaponTooltip";
import { PickerModal } from "@/components/builder/PickerModal";
import { WeaponPickerModal } from "@/components/builder/WeaponPickerModal";
import { SkillPickerModal } from "@/components/builder/SkillPickerModal";
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
  const [savedId, setSavedId] = useState<string | null>(null);
  const [compareKey, setCompareKey] = useState("");
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [activeSlot, setActiveSlot] = useState<Slot>("mask");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hover, setHover] = useState<{ slot: Slot; rect: DOMRect } | null>(null);
  const hoverLeaveTimer = useRef<number>(0);
  const isPhone = usePhoneLayout();
  const [phoneTab, setPhoneTab] = useState<PhoneTab>("loadout");

  function showHover(slot: Slot, rect?: DOMRect) {
    window.clearTimeout(hoverLeaveTimer.current);
    if (!rect) return;
    setHover({ slot, rect });
  }

  function hideHover() {
    window.clearTimeout(hoverLeaveTimer.current);
    hoverLeaveTimer.current = window.setTimeout(() => setHover(null), 80);
  }

  useEffect(() => {
    if (hash === hashApplied) return;
    setHashApplied(hash);
    const decoded = decodeLoadout(hash.replace(/^#b=/, ""));
    if (decoded) {
      setLoadout(decoded);
      setSavedId(null);
    }
  }, [hash, hashApplied]);

  const stats = useMemo(() => computeStats(loadout), [loadout]);
  const compareLoadout = useMemo(() => {
    if (!compareKey) return null;
    if (compareKey.startsWith("preset:")) {
      const preset = PRESETS.find((item) => item.id === compareKey.slice(7));
      return preset ? preset.build() : null;
    }
    if (compareKey.startsWith("saved:")) {
      return loadBuild(compareKey.slice(6));
    }
    return null;
  }, [compareKey, saved]);
  const compareStats = useMemo(
    () => (compareLoadout ? computeStats(compareLoadout) : null),
    [compareLoadout],
  );
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
      const def = weaponById(weaponId);
      if (!def) return current;
      const prev = current.weapons[slot];
      const keepMods =
        prev?.weaponId === weaponId && prev.mods?.length
          ? prev.mods
          : defaultWeaponMods(def.type);
      const base: EquippedWeapon = {
        weaponId,
        expertise: prev?.expertise ?? 0,
        mods: keepMods,
        talentId:
          def.quality === "high-end"
            ? prev?.talentId && prev.weaponId === weaponId
              ? prev.talentId
              : (defaultWeaponTalentId(def.type))
            : undefined,
      };
      // Preserve Prototype only when swapping between non-exotic weapons.
      if (prev?.prototype && canWeaponBePrototype(def.quality)) {
        return {
          ...current,
          weapons: {
            ...current.weapons,
            [slot]: setWeaponPrototype(
              {
                ...base,
                augmentId: prev.augmentId,
                augmentLevel: prev.augmentLevel,
              },
              def.quality,
              true,
            ),
          },
        };
      }
      return {
        ...current,
        weapons: {
          ...current.weapons,
          [slot]: base,
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

  function updateWeapon(slot: WeaponSlot, next: EquippedWeapon) {
    setLoadout((current) => ({
      ...current,
      weapons: { ...current.weapons, [slot]: next },
    }));
  }

  function setSkill(index: 0 | 1, skillId: string) {
    setLoadout((current) => {
      const skills: [EquippedSkill | null, EquippedSkill | null] = [
        current.skills[0],
        current.skills[1],
      ];
      if (!skillId) {
        skills[index] = null;
      } else {
        const prev = current.skills[index];
        skills[index] = {
          skillId,
          mods:
            prev?.skillId === skillId && prev.mods?.length
              ? sanitizeSkillMods(skillId, prev.mods, current.specialization)
              : defaultSkillMods(skillId, current.specialization),
          expertise: prev?.skillId === skillId ? prev.expertise : 0,
        };
      }
      return { ...current, skills };
    });
  }

  function setSkillMod(index: 0 | 1, modIndex: number, modId: string) {
    setLoadout((current) => {
      const equipped = current.skills[index];
      if (!equipped) return current;
      const mods = sanitizeSkillMods(
        equipped.skillId,
        equipped.mods,
        current.specialization,
      );
      mods[modIndex] = modId;
      const skills: [EquippedSkill | null, EquippedSkill | null] = [
        current.skills[0],
        current.skills[1],
      ];
      skills[index] = { ...equipped, mods };
      return { ...current, skills };
    });
  }

  async function copyShareLink() {
    const encoded = encodeLoadout(loadout);
    const url = `${window.location.origin}${window.location.pathname}#b=${encoded}`;
    window.location.hash = `b=${encoded}`;
    await navigator.clipboard.writeText(url);
    flash("Build link copied.");
  }

  function setSkillExpertise(index: 0 | 1, expertise: number) {
    setLoadout((current) => {
      const equipped = current.skills[index];
      if (!equipped) return current;
      const skills: [EquippedSkill | null, EquippedSkill | null] = [
        current.skills[0],
        current.skills[1],
      ];
      skills[index] = { ...equipped, expertise };
      return { ...current, skills };
    });
  }

  function persist(overwrite: boolean) {
    const id = saveBuild(loadout, overwrite && savedId ? savedId : undefined);
    setSavedId(id);
    flash(overwrite && savedId ? "Build updated." : "Build saved in this browser.");
  }

  function selectGearSlot(slot: Slot) {
    const piece = loadout.gear[slot];
    const openPicker = shouldOpenGearPicker(slot, activeSlot, piece);
    setActiveSlot(slot);
    hideHover();
    if (openPicker) setPickerOpen(true);
  }

  const emptyHint = isPhone ? "Tap to equip" : "Click to equip";
  const activeInspect = pieceInspect(activeSlot, loadout);

  const slotButtons = SLOTS.map((slot) => {
    const piece = loadout.gear[slot];
    const source = piece ? catalogById(piece.sourceId) : undefined;
    const hovered = !isPhone && hover?.slot === slot;
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
        onMouseEnter={
          isPhone
            ? undefined
            : (event) => showHover(slot, event.currentTarget.getBoundingClientRect())
        }
        onMouseLeave={isPhone ? undefined : hideHover}
        onFocus={
          isPhone
            ? undefined
            : (event) => showHover(slot, event.currentTarget.getBoundingClientRect())
        }
        onBlur={isPhone ? undefined : hideHover}
        onClick={() => selectGearSlot(slot)}
      >
        <span className="swatch-col">
          <span
            className={
              piece?.prototype && source && source.kind !== "exotic"
                ? "swatch swatch-prototype"
                : "swatch"
            }
            style={{
              background: source
                ? itemDisplayColor(source.kind, Boolean(piece?.prototype))
                : EMPTY_SLOT_COLOR,
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
              : emptyHint}
          </em>
        </span>
      </button>
    );
  });

  const specAndWatch = (
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
          checked={loadout.includeAssumed}
          onChange={(event) => setLoadout({ ...loadout, includeAssumed: event.target.checked })}
        />
        <span>
          Include builder model
          <small className="hint">
            Talent / 4pc / exotic averages. Hard rolls always apply. Not a DPS sim.
          </small>
        </span>
      </label>
      <label className="field checkbox">
        <input
          type="checkbox"
          checked={loadout.shdWatch}
          onChange={(event) => setLoadout({ ...loadout, shdWatch: event.target.checked })}
        />
        <span>SHD Watch 1000</span>
      </label>
      {loadout.shdWatch ? (
        <div className="shd-parts">
          {SHD_WATCH_PARTS.map((part) => {
            const on = loadout.shdWatchParts?.[part.id] !== false;
            return (
              <label key={part.id} className="field checkbox">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(event) =>
                    setLoadout({
                      ...loadout,
                      shdWatchParts: {
                        ...loadout.shdWatchParts,
                        [part.id]: event.target.checked,
                      } as Partial<Record<ShdWatchPartId, boolean>>,
                    })
                  }
                />
                <span>
                  {part.label}
                  <small className="hint">
                    {part.bonus.value}
                    {part.bonus.stat === "skillTier" ? "" : "%"}
                  </small>
                </span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );

  const kitGrid = (
    <section className="kit-grid">
      {(["primary", "secondary", "sidearm"] as const).map((slot) => (
        <WeaponSelect
          key={slot}
          label={WEAPON_SLOT_LABELS[slot]}
          slot={slot}
          equipped={loadout.weapons[slot]}
          types={slot === "sidearm" ? ["pistol"] : [...PRIMARY_WEAPON_TYPES]}
          allowHover={!isPhone}
          active={loadout.activeWeapon === slot}
          onActivate={() => setLoadout({ ...loadout, activeWeapon: slot })}
          onChange={setWeapon}
          onExpertiseChange={setWeaponExpertise}
          onModChange={setWeaponMod}
          onUpdate={updateWeapon}
        />
      ))}
      <div className="kit-spacer" aria-hidden="true" />
      <SkillSelect
        label="Skill 1"
        index={0}
        value={loadout.skills[0]}
        specialization={loadout.specialization}
        onChange={setSkill}
        onModChange={setSkillMod}
        onExpertiseChange={setSkillExpertise}
      />
      <SkillSelect
        label="Skill 2"
        index={1}
        value={loadout.skills[1]}
        specialization={loadout.specialization}
        onChange={setSkill}
        onModChange={setSkillMod}
        onExpertiseChange={setSkillExpertise}
      />
    </section>
  );

  const compareBar = (
    <label className="field compare-field">
      <span>Compare with</span>
      <select value={compareKey} onChange={(event) => setCompareKey(event.target.value)}>
        <option value="">None</option>
        <optgroup label="Presets">
          {PRESETS.map((preset) => (
            <option key={preset.id} value={`preset:${preset.id}`}>
              {preset.name}
            </option>
          ))}
        </optgroup>
        {saved.length > 0 ? (
          <optgroup label="Saved">
            {saved.map((item) => (
              <option key={item.id} value={`saved:${item.id}`}>
                {item.name}
              </option>
            ))}
          </optgroup>
        ) : null}
      </select>
      <small className="hint">Deltas in Analysis are current minus the other build.</small>
    </label>
  );

  const savedList =
    saved.length > 0 ? (
      <section className="saved">
        <h3>Saved builds</h3>
        <ul>
          {saved.map((item) => (
            <li key={item.id}>
              {renameId === item.id ? (
                <form
                  className="rename-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (renameBuild(item.id, renameValue)) {
                      if (savedId === item.id) {
                        setLoadout({ ...loadout, name: renameValue.trim() || loadout.name });
                      }
                      setRenameId(null);
                    }
                  }}
                >
                  <input
                    value={renameValue}
                    onChange={(event) => setRenameValue(event.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="ghost-btn">
                    OK
                  </button>
                  <button type="button" className="ghost-btn" onClick={() => setRenameId(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <button
                    type="button"
                    className={savedId === item.id ? "ghost-btn is-current" : "ghost-btn"}
                    onClick={() => {
                      const next = loadBuild(item.id);
                      if (next) {
                        setLoadout(next);
                        setSavedId(item.id);
                      }
                    }}
                  >
                    {item.name}
                  </button>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      setRenameId(item.id);
                      setRenameValue(item.name);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    className="ghost-btn danger"
                    onClick={() => {
                      deleteBuild(item.id);
                      if (savedId === item.id) setSavedId(null);
                      if (compareKey === `saved:${item.id}`) setCompareKey("");
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    ) : null;

  const pieceEditor = (
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
  );

  return (
    <div className={isPhone ? "app-shell is-phone" : "app-shell"}>
      {isPhone ? (
        <>
          <header className="phone-top">
            <div className="phone-top-row">
              <div>
                <p className="eyebrow">Y8S3 Red Horizon</p>
                <h1>Builder</h1>
              </div>
              <div className="phone-top-actions">
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => {
                    setLoadout(emptyLoadout());
                    setSavedId(null);
                  }}
                >
                  Reset
                </button>
                <button type="button" className="ghost-btn" onClick={() => persist(Boolean(savedId))}>
                  {savedId ? "Save" : "Save"}
                </button>
                {savedId ? (
                  <button type="button" className="ghost-btn" onClick={() => persist(false)}>
                    Save as
                  </button>
                ) : null}
                <button type="button" className="primary-btn" onClick={() => void copyShareLink()}>
                  Share
                </button>
              </div>
            </div>
            <label className="name-field">
              <span>Build name</span>
              <input
                value={loadout.name}
                onChange={(event) => setLoadout({ ...loadout, name: event.target.value })}
              />
            </label>
          </header>

          <div className="phone-pane">
            {phoneTab === "loadout" ? (
              <>
                <section className="phone-presets" aria-label="Presets">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className="preset-card"
                      onClick={() => {
                        setLoadout(preset.build());
                        setSavedId(null);
                        flash(`${preset.name} loaded.`);
                      }}
                    >
                      <strong>{preset.name}</strong>
                      <span>{preset.blurb}</span>
                    </button>
                  ))}
                </section>
                <div className="phone-agent-card">
                  <AgentSilhouette
                    activeSlot={activeSlot}
                    hoverSlot={null}
                    slotColors={slotColors}
                    onSelect={selectGearSlot}
                    onHover={() => {}}
                  />
                  <div className="slot-grid">{slotButtons}</div>
                </div>
                <section
                  className="gear-inspect"
                  style={activeInspect.empty ? undefined : { borderColor: activeInspect.kindColor }}
                >
                  <GearInspectCard inspect={activeInspect} emptyHint={emptyHint} />
                  <div className="phone-inspect-actions">
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => {
                        hideHover();
                        setPickerOpen(true);
                      }}
                    >
                      {loadout.gear[activeSlot] ? "Change" : "Equip"}
                    </button>
                    <button type="button" className="ghost-btn" onClick={() => setPhoneTab("edit")}>
                      Edit rolls
                    </button>
                  </div>
                </section>
                {specAndWatch}
                {compareBar}
                {savedList}
              </>
            ) : null}
            {phoneTab === "edit" ? pieceEditor : null}
            {phoneTab === "kit" ? kitGrid : null}
            {phoneTab === "stats" ? (
              <>
                {compareBar}
                <StatsPanel stats={stats} compare={compareStats} />
              </>
            ) : null}
          </div>

          <PhoneDock tab={phoneTab} onTab={setPhoneTab} />
        </>
      ) : (
        <>
          <header className="topbar">
            <div>
              <p className="eyebrow">The Division 2 · Y8S3 Red Horizon</p>
              <h1>Gear Builder</h1>
              <p className="tagline">
                Plan the loadout here. Farm in-game. Test damage at the shooting range — this tool
                does not calculate DPS.
              </p>
            </div>
            <label className="name-field">
              <span>Build name</span>
              <input
                value={loadout.name}
                onChange={(event) => setLoadout({ ...loadout, name: event.target.value })}
              />
            </label>
            <div className="top-actions">
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  setLoadout(emptyLoadout());
                  setSavedId(null);
                }}
              >
                Reset
              </button>
              <button type="button" className="ghost-btn" onClick={() => persist(Boolean(savedId))}>
                {savedId ? "Save" : "Save"}
              </button>
              {savedId ? (
                <button type="button" className="ghost-btn" onClick={() => persist(false)}>
                  Save as
                </button>
              ) : null}
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
                setSavedId(null);
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
                  onSelect={selectGearSlot}
                  onHover={(slot, rect) => {
                    if (slot && rect) showHover(slot, rect);
                    else hideHover();
                  }}
                />
                <div className="slot-grid">{slotButtons}</div>
                {specAndWatch}
                {compareBar}
              </div>
              {pieceEditor}
              {kitGrid}
              {savedList}
            </div>
            <StatsPanel stats={stats} compare={compareStats} />
          </div>
        </>
      )}

      {hover && !pickerOpen && !isPhone ? (
        <GearTooltip inspect={pieceInspect(hover.slot, loadout)} anchor={hover.rect} />
      ) : null}

      {pickerOpen ? (
        <PickerModal
          slot={activeSlot}
          onClose={() => setPickerOpen(false)}
          onPick={(sourceId) => {
            updateGear(activeSlot, createPiece(activeSlot, sourceId));
            setPickerOpen(false);
            if (isPhone) setPhoneTab("edit");
          }}
          onPickSet={(sourceId) => {
            setLoadout((current) => applyGearSet(current, sourceId));
            setPickerOpen(false);
            if (isPhone) setPhoneTab("loadout");
            const source = catalogById(sourceId);
            if (source) flash(`${source.name}: 6 pieces equipped.`);
          }}
        />
      ) : null}

      {toast ? <div className={isPhone ? "toast phone-toast" : "toast"}>{toast}</div> : null}

      {isPhone ? null : (
        <footer className="legal">
          Fan-made, offline, no account. Live Y8S3 Red Horizon data (27 Aug 2026):
          brands, gear sets, talents, named items, exotics. Not affiliated with Ubisoft.
        </footer>
      )}
    </div>
  );
}

function WeaponSelect({
  label,
  slot,
  equipped,
  onChange,
  onExpertiseChange,
  onModChange,
  onUpdate,
  types,
  allowHover = true,
  active = false,
  onActivate,
}: {
  label: string;
  slot: WeaponSlot;
  equipped: EquippedWeapon | null;
  onChange: (slot: WeaponSlot, weaponId: string) => void;
  onExpertiseChange: (slot: WeaponSlot, expertise: number) => void;
  onModChange: (slot: WeaponSlot, index: number, mod: WeaponMod) => void;
  onUpdate: (slot: WeaponSlot, next: EquippedWeapon) => void;
  types: readonly WeaponType[];
  allowHover?: boolean;
  active?: boolean;
  onActivate?: () => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);
  const hoverLeaveTimer = useRef(0);
  const value = equipped?.weaponId ?? "";
  const expertise = equipped?.expertise ?? 0;
  const mods = equipped?.mods ?? [];
  const selected = value ? weaponById(value) : undefined;
  const resolvedTalent = selected ? resolveWeaponTalent(selected, equipped) : null;
  const heTalents = selected?.quality === "high-end" ? weaponTalentsForType(selected.type) : [];
  const prototypeAllowed = canWeaponBePrototype(selected?.quality);
  const isPrototype = Boolean(equipped?.prototype) && prototypeAllowed;
  const qualityColor = selected
    ? weaponDisplayColor(selected.quality, isPrototype)
    : EMPTY_SLOT_COLOR;
  const inspect = weaponInspect(slot, equipped);

  function showHover(rect: DOMRect) {
    window.clearTimeout(hoverLeaveTimer.current);
    setHoverRect(rect);
  }

  function hideHover() {
    window.clearTimeout(hoverLeaveTimer.current);
    hoverLeaveTimer.current = window.setTimeout(() => setHoverRect(null), 80);
  }

  return (
    <div className={isPrototype ? "field weapon-field is-prototype" : "field weapon-field"}>
      {onActivate ? (
        <label className="field checkbox">
          <input type="radio" name="active-weapon" checked={active} onChange={onActivate} />
          <span>Active in Analysis</span>
        </label>
      ) : null}
      <button
        type="button"
        className={hoverRect && !pickerOpen ? "slot-card weapon-slot-card hovered" : "slot-card weapon-slot-card"}
        aria-describedby={`weapon-tooltip-${slot}`}
        onClick={() => {
          hideHover();
          setPickerOpen(true);
        }}
        onPointerEnter={
          allowHover
            ? (event) => showHover(event.currentTarget.getBoundingClientRect())
            : undefined
        }
        onPointerMove={
          allowHover && !hoverRect
            ? (event) => showHover(event.currentTarget.getBoundingClientRect())
            : undefined
        }
        onPointerLeave={allowHover ? hideHover : undefined}
        onFocus={
          allowHover
            ? (event) => showHover(event.currentTarget.getBoundingClientRect())
            : undefined
        }
        onBlur={allowHover ? hideHover : undefined}
      >
        <span className="swatch-col">
          <span
            className={isPrototype ? "swatch swatch-prototype" : "swatch"}
            style={{ background: qualityColor }}
          />
        </span>
        <span>
          <small>{label}</small>
          <strong>{selected ? selected.name : "Empty"}</strong>
          <em>
            {selected
              ? `${isPrototype ? "Prototype" : WEAPON_QUALITY_LABELS[selected.quality]} · ${WEAPON_TYPE_LABELS[selected.type]} · ${selected.rpm} RPM · mag ${selected.mag}`
              : "Click to equip"}
          </em>
        </span>
      </button>
      {selected && equipped ? (
        <>
          <small className="hint">
            {resolvedTalent?.name ?? selected.talent} · {resolvedTalent?.description ?? selected.talentDesc}
          </small>
          {heTalents.length > 0 ? (
            <label className="field">
              <span>Weapon talent</span>
              <select
                value={equipped.talentId ?? defaultWeaponTalentId(selected.type)}
                onChange={(event) =>
                  onUpdate(slot, { ...equipped, talentId: event.target.value })
                }
              >
                {heTalents.map((talent) => (
                  <option key={talent.id} value={talent.id}>
                    {talent.name}
                  </option>
                ))}
              </select>
              {resolvedTalent?.assumedNote ? (
                <small className="hint">{resolvedTalent.assumedNote}</small>
              ) : null}
            </label>
          ) : null}
          {prototypeAllowed ? (
            <label className="field checkbox prototype-switch">
              <input
                type="checkbox"
                checked={isPrototype}
                onChange={(event) =>
                  onUpdate(slot, setWeaponPrototype(equipped, selected.quality, event.target.checked))
                }
              />
              <span>
                Prototype
                <small className="hint">
                  Expertise 30 · Augment stacks with gear Prototypes when this weapon is active. Not
                  available on exotics.
                </small>
              </span>
            </label>
          ) : (
            <p className="hint">Exotics cannot be converted to Prototype.</p>
          )}
          {isPrototype ? (
            <>
              <label className="field">
                <span>Augment</span>
                <select
                  value={equipped.augmentId ?? ""}
                  onChange={(event) =>
                    onUpdate(slot, {
                      ...equipped,
                      augmentId: event.target.value || undefined,
                      augmentLevel: clampAugmentLevel(equipped.augmentLevel ?? 1),
                    })
                  }
                >
                  {AUGMENTS.map((augment) => (
                    <option key={augment.id} value={augment.id}>
                      {augment.name}
                    </option>
                  ))}
                </select>
                {augmentById(equipped.augmentId) ? (
                  <small className="hint">{augmentById(equipped.augmentId)!.description}</small>
                ) : null}
              </label>
              <label className="field expertise-field">
                <span>
                  Augment level ({clampAugmentLevel(equipped.augmentLevel ?? 1)})
                  {augmentById(equipped.augmentId)
                    ? ` · ${augmentById(equipped.augmentId)!.valueAtLevel(equipped.augmentLevel ?? 1)}%`
                    : ""}
                </span>
                <input
                  type="range"
                  min={AUGMENT_LEVEL_MIN}
                  max={AUGMENT_LEVEL_MAX}
                  value={clampAugmentLevel(equipped.augmentLevel ?? 1)}
                  onChange={(event) =>
                    onUpdate(slot, {
                      ...equipped,
                      augmentLevel: Number(event.target.value),
                    })
                  }
                />
                <small className="hint">
                  Primary weapon Augment counts toward the 7-piece Prototype stack with gear.
                </small>
              </label>
            </>
          ) : null}
          <label className="field expertise-field">
            <span>Expertise ({expertise})</span>
            <input
              type="range"
              min={0}
              max={EXPERTISE_MAX}
              value={expertise}
              disabled={isPrototype}
              onChange={(event) => onExpertiseChange(slot, Number(event.target.value))}
            />
            {isPrototype ? (
              <small className="hint">Prototype locks Expertise at 30.</small>
            ) : null}
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

      {hoverRect && !pickerOpen && allowHover ? <WeaponTooltip inspect={inspect} anchor={hoverRect} /> : null}

      {pickerOpen ? (
        <WeaponPickerModal
          title={label}
          types={types}
          selectedId={value}
          onClose={() => setPickerOpen(false)}
          onPick={(weaponId) => {
            onChange(slot, weaponId);
            setPickerOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function SkillSelect({
  label,
  index,
  value,
  specialization,
  onChange,
  onModChange,
  onExpertiseChange,
}: {
  label: string;
  index: 0 | 1;
  value: EquippedSkill | null;
  specialization: string | null;
  onChange: (index: 0 | 1, skillId: string) => void;
  onModChange: (index: 0 | 1, modIndex: number, modId: string) => void;
  onExpertiseChange: (index: 0 | 1, expertise: number) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const selected = SKILLS.find((skill) => skill.id === value?.skillId);
  const slots = selected ? skillModSlotsFor(selected.id, specialization) : [];
  const mods =
    selected && value ? sanitizeSkillMods(selected.id, value.mods, specialization) : [];
  const expertise = value?.expertise ?? 0;
  return (
    <div className="field weapon-field">
      <button
        type="button"
        className="slot-card weapon-slot-card"
        onClick={() => setPickerOpen(true)}
      >
        <span className="swatch-col">
          <span className="swatch" style={{ background: selected ? "#7ec8e8" : EMPTY_SLOT_COLOR }} />
        </span>
        <span>
          <small>{label}</small>
          <strong>{selected ? selected.name : "Empty"}</strong>
          <em>{selected ? selected.category : "Tap to equip"}</em>
        </span>
      </button>
      {selected && value ? (
        <>
          <small className="hint">{selected.description}</small>
          <label className="field expertise-field">
            <span>Skill expertise ({expertise})</span>
            <input
              type="range"
              min={0}
              max={EXPERTISE_MAX}
              value={expertise}
              onChange={(event) => onExpertiseChange(index, Number(event.target.value))}
            />
            <small className="hint">
              +1% Skill Damage / Repair / Health on this skill only (0–30).
            </small>
          </label>
          <div className="weapon-mods skill-mod-grid">
            <p className="eyebrow">Skill mods</p>
            <small className="hint">
              Live Gear 2.0 slots for this variant, max rolls. They only change this skill
              — not gear Skill Damage / Haste. Extra ammo and charges are +1 per slot; Skill
              Tier is the main scaler.
            </small>
            {slots.map((slot, modIndex) => {
              const selectedMod = skillModOptionById(
                selected.id,
                mods[modIndex],
                specialization,
              );
              return (
                <div key={slot.id} className="weapon-mod-row">
                  <label className="field">
                    <span>{slot.label}</span>
                    <select
                      value={mods[modIndex] ?? "none"}
                      onChange={(event) => onModChange(index, modIndex, event.target.value)}
                    >
                      {slot.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {skillModOptionLabel(option)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <small className="hint skill-mod-effect">
                    {selectedMod?.id === "none"
                      ? selectedMod.effect
                      : `${selectedMod?.effect ?? ""} · this skill only`}
                  </small>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
      {pickerOpen ? (
        <SkillPickerModal
          title={label}
          selectedId={value?.skillId ?? ""}
          onClose={() => setPickerOpen(false)}
          onPick={(skillId) => {
            onChange(index, skillId);
            setPickerOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
