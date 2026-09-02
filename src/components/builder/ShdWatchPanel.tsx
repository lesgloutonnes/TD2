"use client";

import type { Loadout, ShdWatchPartId } from "@/lib/types";
import {
  SHD_WATCH_PARTS,
  sanitizeShdWatchParts,
  shdWatchPartValue,
} from "@/lib/data/attributes";

export function ShdWatchPanel({
  loadout,
  onChange,
}: {
  loadout: Loadout;
  onChange: (next: Loadout) => void;
}) {
  function setEnabled(enabled: boolean) {
    onChange({ ...loadout, shdWatch: enabled });
  }

  function setPart(id: ShdWatchPartId, value: number) {
    onChange({
      ...loadout,
      shdWatchParts: sanitizeShdWatchParts({
        ...loadout.shdWatchParts,
        [id]: value,
      }),
    });
  }

  function setAll(toMax: boolean) {
    if (toMax) {
      onChange({ ...loadout, shdWatchParts: undefined });
      return;
    }
    const zero = Object.fromEntries(SHD_WATCH_PARTS.map((part) => [part.id, 0])) as Record<
      ShdWatchPartId,
      number
    >;
    onChange({ ...loadout, shdWatchParts: sanitizeShdWatchParts(zero) });
  }

  return (
    <div className="meta-block">
      <label className="field checkbox">
        <input
          type="checkbox"
          checked={loadout.shdWatch}
          onChange={(event) => setEnabled(event.target.checked)}
        />
        <span>
          SHD Watch
          <small className="hint">
            SHD 1000 caps. Scale each line from 0 if the Watch is not fully unlocked.
          </small>
        </span>
      </label>
      {loadout.shdWatch ? (
        <div className="shd-panel">
          <div className="shd-panel-actions">
            <button type="button" className="ghost-btn" onClick={() => setAll(true)}>
              Max all
            </button>
            <button type="button" className="ghost-btn" onClick={() => setAll(false)}>
              Zero all
            </button>
          </div>
          <div className="shd-sliders">
            {SHD_WATCH_PARTS.map((part) => {
              const max = part.bonus.value;
              const value = shdWatchPartValue(part.id, loadout.shdWatchParts);
              return (
                <label key={part.id} className="field shd-slider">
                  <span>
                    {part.label}
                    <em>
                      {value}/{max}%
                    </em>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={max}
                    step={1}
                    value={value}
                    onChange={(event) => setPart(part.id, Number(event.target.value))}
                  />
                  <input
                    type="number"
                    min={0}
                    max={max}
                    step={1}
                    value={value}
                    onChange={(event) => setPart(part.id, Number(event.target.value))}
                  />
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
