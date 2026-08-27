"use client";

import type { ComputedStats, Loadout } from "@/lib/types";
import { formatFlatAmount, formatStat, STAT_LABELS } from "@/lib/data/attributes";
import type { StatKey } from "@/lib/types";

const HIGHLIGHT: StatKey[] = [
  "weaponDamage",
  "chc",
  "chd",
  "hsd",
  "damageToArmor",
  "damageToHealth",
  "armor",
  "armorPercent",
  "armorRegen",
  "armorOnKill",
  "health",
  "hazardProtection",
  "skillDamage",
  "skillHaste",
  "skillDuration",
  "skillRepair",
  "skillEfficiency",
  "statusEffects",
  "protectionFromElites",
  "arDamage",
  "lmgDamage",
  "smgDamage",
  "shotgunDamage",
  "mmrDamage",
  "rifleDamage",
  "pistolDamage",
  "reloadSpeed",
  "magazineSize",
  "rateOfFire",
  "weaponHandling",
];

export function StatsPanel({
  loadout,
  stats,
}: {
  loadout: Loadout;
  stats: ComputedStats;
}) {
  return (
    <aside className="stats-panel">
      <header className="panel-head">
        <p className="eyebrow">Analysis</p>
        <h2>Build stats</h2>
      </header>

      <div className="core-row">
        <CorePip kind="red" value={stats.cores.red} label="Red" />
        <CorePip kind="blue" value={stats.cores.blue} label="Blue" />
        <CorePip kind="yellow" value={stats.cores.yellow} label="Yellow" />
      </div>

      <div className="index-card">
        <div>
          <p className="eyebrow">Offense score</p>
          <strong>{stats.offensiveIndex}</strong>
        </div>
        <div>
          <p className="eyebrow">Skill Tiers</p>
          <strong>
            {stats.skillTierCapped}
            <span className="muted"> / 6</span>
          </strong>
        </div>
        <div>
          <p className="eyebrow">Primary expertise</p>
          <strong>{loadout.weapons.primary?.expertise ?? 0}</strong>
        </div>
      </div>
      <small className="hint index-hint">
        Relative estimate — not DPS. Assumes talent / 4pc uptime noted in Analysis.
      </small>

      <div className="chc-meter">
        <div className="chc-label">
          <span>Critical Hit Chance</span>
          <span>
            {stats.chcCapped.toFixed(1)}%
            {stats.chcOvercap > 0 ? ` · +${stats.chcOvercap.toFixed(1)}% over cap` : ""}
          </span>
        </div>
        <div className="meter">
          <div
            className={stats.chcOvercap > 0 ? "meter-fill over" : "meter-fill"}
            style={{ width: `${Math.min(100, (stats.values.chc / 60) * 100)}%` }}
          />
        </div>
        <small>Hard cap at 60%. SHD Watch already provides 10%.</small>
      </div>

      <ul className="stat-list">
        {HIGHLIGHT.map((key) => {
          const value = key === "chc" ? stats.chcCapped : stats.values[key];
          if (!value && key !== "health") return null;
          if (key === "health" && !value && !stats.values.armor) return null;
          return (
            <li key={key}>
              <span>{STAT_LABELS[key]}</span>
              <strong>{formatHighlight(key, value, stats)}</strong>
            </li>
          );
        })}
      </ul>
      <small className="hint index-hint">
        Armor Regeneration rolls as % of total armor /s on blue attributes — the flat armor/s
        amount is derived, not a separate gear roll.
      </small>

      <section>
        <h3>Active bonuses</h3>
        <div className="bonus-list">
          {stats.bonuses.length === 0 ? (
            <p className="empty">No brand or gear set bonus.</p>
          ) : (
            stats.bonuses.map((bonus) => (
              <article key={bonus.source} className="bonus-card">
                <div className="bonus-title">
                  <span className="swatch" style={{ background: bonus.color }} />
                  <strong>{bonus.source}</strong>
                  <em>{bonus.label}</em>
                </div>
                <p>{bonus.detail}</p>
              </article>
            ))
          )}
        </div>
      </section>

      {stats.notes.length > 0 ? (
        <section>
          <h3>Notes</h3>
          <ul className="notes">
            {stats.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}

function formatHighlight(key: StatKey, value: number, stats: ComputedStats): string {
  if (key === "armorRegen" && stats.derived.armorRegenPerSec > 0) {
    return `${formatStat(key, value)} · ${formatFlatAmount(stats.derived.armorRegenPerSec)}/s`;
  }
  if (key === "armorOnKill" && stats.derived.armorOnKillFlat > 0) {
    return `${formatStat(key, value)} · ${formatFlatAmount(stats.derived.armorOnKillFlat)}`;
  }
  if (key === "health") {
    const pct = value > 0 ? ` (${formatStat("health", value)})` : "";
    return `${formatFlatAmount(stats.derived.healthFlat)}${pct}`;
  }
  return formatStat(key, value);
}

function CorePip({
  kind,
  value,
  label,
}: {
  kind: "red" | "blue" | "yellow";
  value: number;
  label: string;
}) {
  return (
    <div className={`core-pip ${kind}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
