"use client";

import type { ComputedStats, SkillLocalStats } from "@/lib/types";
import { formatBonusList } from "@/lib/calc";
import { formatFlatAmount, formatStat, STAT_LABELS } from "@/lib/data/attributes";
import type { StatKey } from "@/lib/types";

const HIGHLIGHT: StatKey[] = [
  "weaponDamage",
  "signatureWeaponDamage",
  "chc",
  "chd",
  "hsd",
  "damageToArmor",
  "damageToHealth",
  "armor",
  "armorPercent",
  "armorRegen",
  "armorRegenPercent",
  "armorOnKill",
  "incomingRepairs",
  "health",
  "healthPercent",
  "hazardProtection",
  "pulseResistance",
  "bleedResistance",
  "burnResistance",
  "shockResistance",
  "disruptResistance",
  "blindResistance",
  "ensnareResistance",
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
  "meleeDamage",
  "scannerPulseHaste",
  "shieldHealth",
  "skillHealth",
  "reloadSpeed",
  "magazineSize",
  "ammoCapacity",
  "rateOfFire",
  "weaponHandling",
  "stability",
];

export function StatsPanel({
  stats,
  compare,
}: {
  stats: ComputedStats;
  compare?: ComputedStats | null;
}) {
  return (
    <aside className="stats-panel">
      <header className="panel-head">
        <p className="eyebrow">Analysis</p>
        <h2>Build stats</h2>
      </header>

      <div className="core-row">
        <CorePip kind="red" value={stats.cores.red} compare={compare?.cores.red} label="Red" />
        <CorePip kind="blue" value={stats.cores.blue} compare={compare?.cores.blue} label="Blue" />
        <CorePip kind="yellow" value={stats.cores.yellow} compare={compare?.cores.yellow} label="Yellow" />
      </div>

      <div className="index-card">
        <div>
          <p className="eyebrow">Build index</p>
          <strong>
            {stats.offensiveIndex}
            {compare ? <Delta value={stats.offensiveIndex - compare.offensiveIndex} /> : null}
          </strong>
        </div>
        <div>
          <p className="eyebrow">Skill Tiers</p>
          <strong>
            {stats.skillTierCapped}
            <span className="muted"> / 6</span>
            {compare ? <Delta value={stats.skillTierCapped - compare.skillTierCapped} /> : null}
          </strong>
        </div>
      </div>
      <small className="hint index-hint">
        Relative stack compare for planning only — not DPS. Farm the gear in-game, then verify at the
        shooting range.
        {stats.includeAssumed
          ? " Maxed bonuses are ON: stacks, procs, and conditionals at maximum."
          : " Maxed bonuses are OFF: hard rolls only (cores, attributes, mods, brand 1–3pc, set 2–3pc). Always-on talents still apply."}
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
        <small>Hard cap at 60%. SHD Watch already provides 10% when that line is on.</small>
      </div>

      <ul className="stat-list">
        {HIGHLIGHT.map((key) => {
          if (key === "armorRegen" || key === "armorRegenPercent") {
            if (key === "armorRegenPercent") return null;
            if (!stats.derived.armorRegenPerSec && !compare?.derived.armorRegenPerSec) return null;
            return (
              <li key="armorRegenTotal">
                <span>Armor Regeneration</span>
                <strong>
                  {formatFlatAmount(stats.derived.armorRegenPerSec)}/s
                  {compare ? (
                    <Delta value={stats.derived.armorRegenPerSec - compare.derived.armorRegenPerSec} />
                  ) : null}
                </strong>
              </li>
            );
          }
          if (key === "health" || key === "healthPercent") {
            if (key === "healthPercent") return null;
            if (
              !stats.values.armor &&
              !stats.values.health &&
              !stats.values.healthPercent &&
              !compare
            ) {
              return null;
            }
            const pct =
              stats.values.healthPercent > 0
                ? ` (${formatStat("healthPercent", stats.values.healthPercent)})`
                : "";
            return (
              <li key="healthTotal">
                <span>Health</span>
                <strong>
                  {formatFlatAmount(stats.derived.healthFlat)}
                  {pct}
                  {compare ? (
                    <Delta value={stats.derived.healthFlat - compare.derived.healthFlat} />
                  ) : null}
                </strong>
              </li>
            );
          }
          const value = key === "chc" ? stats.chcCapped : stats.values[key];
          const compareValue =
            compare == null ? undefined : key === "chc" ? compare.chcCapped : compare.values[key];
          if (!value && !compareValue) return null;
          return (
            <li key={key}>
              <span>{STAT_LABELS[key]}</span>
              <strong>
                {formatHighlight(key, value, stats)}
                {compareValue != null ? <Delta value={value - compareValue} /> : null}
              </strong>
            </li>
          );
        })}
      </ul>
      <small className="hint index-hint">
        Gear Armor Regen rolls as flat HP/s (max 4,925). Brand/set bonuses add % of total armor.
      </small>

      {stats.skillLocal.length > 0 ? (
        <section>
          <h3>Skill-local</h3>
          <small className="hint index-hint">
            Attachments and skill expertise only change that skill — they do not raise character-wide
            Skill Damage / Haste.
          </small>
          <div className="bonus-list">
            {stats.skillLocal.map((local) => (
              <SkillLocalCard key={local.skillId} local={local} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h3>Active bonuses</h3>
        <div className="bonus-list">
          {stats.bonuses.length === 0 ? (
            <p className="empty">No brand or gear set bonus.</p>
          ) : (
            stats.bonuses.map((bonus) => (
              <article key={bonus.id} className="bonus-card">
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

function SkillLocalCard({ local }: { local: SkillLocalStats }) {
  const parts = [
    local.bonuses.length ? formatBonusList(local.bonuses) : null,
    local.extras.length ? local.extras.join(" · ") : null,
    local.expertise ? `Expertise ${local.expertise}` : null,
  ].filter(Boolean);
  return (
    <article className="bonus-card">
      <div className="bonus-title">
        <span className="swatch" style={{ background: "#5aa8c8" }} />
        <strong>{local.name}</strong>
        <em>this skill only</em>
      </div>
      <p>{parts.join(" · ") || local.summary}</p>
    </article>
  );
}

function Delta({ value }: { value: number }) {
  if (!value) return <span className="delta even">0</span>;
  const rounded = Math.abs(value) >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return <span className={rounded > 0 ? "delta up" : "delta down"}>{`${sign}${rounded}`}</span>;
}

function formatHighlight(key: StatKey, value: number, stats: ComputedStats): string {
  if (key === "armorOnKill" && stats.derived.armorOnKillFlat > 0) {
    return `${formatStat(key, value)} · ${formatFlatAmount(stats.derived.armorOnKillFlat)}`;
  }
  return formatStat(key, value);
}

function CorePip({
  kind,
  value,
  compare,
  label,
}: {
  kind: "red" | "blue" | "yellow";
  value: number;
  compare?: number;
  label: string;
}) {
  return (
    <div className={`core-pip ${kind}`}>
      <strong>
        {value}
        {compare != null ? <Delta value={value - compare} /> : null}
      </strong>
      <span>{label}</span>
    </div>
  );
}
