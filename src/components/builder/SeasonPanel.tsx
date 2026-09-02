"use client";

import type { Loadout, SeasonPassiveId } from "@/lib/types";
import {
  SEASON_ACTIVES,
  SEASON_MODIFIER_NAME,
  SEASON_NAME,
  SEASON_PASSIVE_GROUPS,
  SEASON_PASSIVES,
  sanitizeSeason,
  seasonActiveById,
  seasonFromLoadout,
  seasonGaugePreview,
  seasonPassiveById,
} from "@/lib/data/season-modifiers";

export function SeasonPanel({
  loadout,
  onChange,
}: {
  loadout: Loadout;
  onChange: (next: Loadout) => void;
}) {
  const season = seasonFromLoadout(loadout);
  const active = seasonActiveById(season.activeId) ?? SEASON_ACTIVES[0];
  const gauge = seasonGaugePreview(season);

  function patch(next: Partial<typeof season>) {
    onChange({
      ...loadout,
      season: sanitizeSeason({ ...season, ...next }),
    });
  }

  function setPassive(index: 0 | 1 | 2, value: string) {
    const passives: typeof season.passives = [...season.passives];
    const id = (value || null) as SeasonPassiveId | null;
    if (id) {
      for (let i = 0; i < passives.length; i += 1) {
        if (i !== index && passives[i] === id) passives[i] = null;
      }
    }
    passives[index] = id;
    patch({ passives });
  }

  return (
    <div className="meta-block">
      <label className="field checkbox">
        <input
          type="checkbox"
          checked={season.enabled}
          onChange={(event) => patch({ enabled: event.target.checked })}
        />
        <span>
          Season modifier
          <small className="hint">
            {SEASON_MODIFIER_NAME} · {SEASON_NAME}. 1 active + 3 passives. Assumed pressure, not a
            combat sim.
          </small>
        </span>
      </label>
      {season.enabled ? (
        <div className="season-panel">
          <div className="season-active">
            <label className="field">
              <span>Active</span>
              <select
                value={season.activeId}
                onChange={(event) =>
                  patch({
                    activeId:
                      seasonActiveById(event.target.value)?.id ?? SEASON_ACTIVES[0].id,
                  })
                }
              >
                {SEASON_ACTIVES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.secondary}
                  </option>
                ))}
              </select>
              <small className="hint">{active.description}</small>
            </label>
          </div>
          <div className="season-passives">
            {([0, 1, 2] as const).map((index) => {
              const selected = season.passives[index];
              const used = new Set(
                season.passives.filter((id, slot) => id && slot !== index),
              );
              const selectedDef = seasonPassiveById(selected);
              return (
                <label key={index} className="field">
                  <span>Passive {index + 1}</span>
                  <select
                    value={selected ?? ""}
                    onChange={(event) => setPassive(index, event.target.value)}
                  >
                    <option value="">None</option>
                    {SEASON_PASSIVE_GROUPS.map((group) => (
                      <optgroup key={group.id} label={group.label}>
                        {SEASON_PASSIVES.filter((item) => item.category === group.id).map(
                          (item) => (
                            <option
                              key={item.id}
                              value={item.id}
                              disabled={used.has(item.id)}
                            >
                              {item.name}
                            </option>
                          ),
                        )}
                      </optgroup>
                    ))}
                  </select>
                  {selectedDef ? <small className="hint">{selectedDef.description}</small> : null}
                </label>
              );
            })}
          </div>
          <label className="field expertise-field">
            <span>Assumed pressure ({season.pressure}%)</span>
            <input
              type="range"
              min={0}
              max={100}
              value={season.pressure}
              onChange={(event) => patch({ pressure: Number(event.target.value) })}
            />
            <small className="hint">
              {gauge.label}
              {gauge.formulaCancelled ? " · Beta + Gamma cancel." : ""}
              {gauge.bracketCancelled ? " · All or Nothing + Kickstart cancel." : ""}
            </small>
          </label>
        </div>
      ) : null}
    </div>
  );
}
