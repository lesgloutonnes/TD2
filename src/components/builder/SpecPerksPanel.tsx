"use client";

import type { Loadout, SpecPerkDef } from "@/lib/types";
import {
  exclusivePerkGroups,
  setSpecPerkFlags,
  specPerkEnabled,
  specializationById,
} from "@/lib/data/skills";
import { formatBonusList } from "@/lib/calc";

export function SpecPerksPanel({
  loadout,
  onChange,
}: {
  loadout: Loadout;
  onChange: (next: Loadout) => void;
}) {
  const spec = specializationById(loadout.specialization);
  if (!spec) return null;
  const selected = spec;
  const choiceGroups = exclusivePerkGroups(spec);
  const exclusiveIds = new Set(choiceGroups.flatMap((group) => group.map((perk) => perk.id)));

  const sheet = spec.perks.filter(
    (perk) => perk.group === "sheet" && !exclusiveIds.has(perk.id),
  );
  const weapon = spec.perks.filter((perk) => perk.group === "weapon-type");

  function setPerk(perk: SpecPerkDef, on: boolean) {
    onChange({
      ...loadout,
      specPerks: setSpecPerkFlags(loadout.specPerks, selected, (item) => {
        if (item.id === perk.id) return on;
        if (on && perk.exclusiveGroup && item.exclusiveGroup === perk.exclusiveGroup) {
          return false;
        }
        return specPerkEnabled(item, loadout.specPerks);
      }),
    });
  }

  function setChoice(group: SpecPerkDef[], perkId: string | null) {
    const groupId = group[0]?.exclusiveGroup;
    onChange({
      ...loadout,
      specPerks: setSpecPerkFlags(loadout.specPerks, selected, (item) => {
        if (item.exclusiveGroup !== groupId) {
          return specPerkEnabled(item, loadout.specPerks);
        }
        return perkId ? item.id === perkId : false;
      }),
    });
  }

  function sheetDefaults() {
    onChange({
      ...loadout,
      specPerks: setSpecPerkFlags(loadout.specPerks, selected, (perk) =>
        perk.defaultOn ? undefined : false,
      ),
    });
  }

  function allOn() {
    onChange({
      ...loadout,
      specPerks: setSpecPerkFlags(loadout.specPerks, selected, () => true),
    });
  }

  return (
    <div className="spec-perks">
      <div className="shd-panel-actions">
        <button type="button" className="ghost-btn" onClick={sheetDefaults}>
          Sheet defaults
        </button>
        <button type="button" className="ghost-btn" onClick={allOn}>
          All on
        </button>
      </div>
      <p className="hint spec-perks-hint">
        Tree points are limited. Uncheck sheet perks you skipped. Forks are one-or-the-other.
        Weapon-type nodes start off — check only what you took.
      </p>
      <div className="spec-perk-group">
        <p className="eyebrow">Sheet perks</p>
        <div className="spec-perk-grid">
          {sheet.map((perk) => (
            <PerkToggle
              key={perk.id}
              perk={perk}
              checked={specPerkEnabled(perk, loadout.specPerks)}
              onChange={(on) => setPerk(perk, on)}
            />
          ))}
        </div>
      </div>
      {choiceGroups.map((group) => {
        const groupId = group[0]?.exclusiveGroup ?? group[0]?.id ?? "choice";
        const selectedId =
          group.find((perk) => specPerkEnabled(perk, loadout.specPerks))?.id ?? "";
        return (
          <fieldset key={groupId} className="spec-perk-choice">
            <legend>Skill focus — pick one</legend>
            {group.map((perk) => (
              <label key={perk.id} className="field checkbox spec-perk">
                <input
                  type="radio"
                  name={`spec-choice-${groupId}`}
                  checked={selectedId === perk.id}
                  onChange={() => setChoice(group, perk.id)}
                />
                <span>
                  {perk.name}
                  <small className="hint">{formatBonusList(perk.bonuses)}</small>
                </span>
              </label>
            ))}
            <label className="field checkbox spec-perk">
              <input
                type="radio"
                name={`spec-choice-${groupId}`}
                checked={selectedId === ""}
                onChange={() => setChoice(group, null)}
              />
              <span>
                Neither
                <small className="hint">Skipped this fork</small>
              </span>
            </label>
          </fieldset>
        );
      })}
      <div className="spec-perk-group">
        <p className="eyebrow">Weapon type</p>
        <div className="spec-perk-grid spec-perk-grid-compact">
          {weapon.map((perk) => (
            <PerkToggle
              key={perk.id}
              perk={perk}
              checked={specPerkEnabled(perk, loadout.specPerks)}
              onChange={(on) => setPerk(perk, on)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PerkToggle({
  perk,
  checked,
  onChange,
}: {
  perk: SpecPerkDef;
  checked: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <label className="field checkbox spec-perk">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        {perk.name}
        <small className="hint">{formatBonusList(perk.bonuses)}</small>
      </span>
    </label>
  );
}
