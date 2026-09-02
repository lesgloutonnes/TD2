"use client";

import { useMemo, useState } from "react";
import type { SkillDef } from "@/lib/types";
import { SKILLS } from "@/lib/data/skills";

export function SkillPickerModal({
  title,
  selectedId,
  onClose,
  onPick,
}: {
  title: string;
  selectedId: string;
  onClose: () => void;
  onPick: (skillId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "all">("all");

  const categories = useMemo(
    () => [...new Set(SKILLS.map((skill) => skill.category))],
    [],
  );

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return SKILLS.filter((skill) => {
      if (category !== "all" && skill.category !== category) return false;
      if (!needle) return true;
      const haystack = `${skill.name} ${skill.category} ${skill.description}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [category, query]);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal picker-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <p className="eyebrow">Skills</p>
            <h2 id="skill-picker-title">{title}</h2>
          </div>
          <div className="editor-actions">
            {selectedId ? (
              <button type="button" className="ghost-btn danger" onClick={() => onPick("")}>
                Unequip
              </button>
            ) : null}
            <button type="button" className="ghost-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <input
          className="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a skill, family, description…"
          autoFocus
        />
        <div className="chip-row">
          <button
            type="button"
            className={category === "all" ? "chip active" : "chip"}
            onClick={() => setCategory("all")}
          >
            All
          </button>
          {categories.map((entry) => (
            <button
              key={entry}
              type="button"
              className={category === entry ? "chip active" : "chip"}
              onClick={() => setCategory(entry)}
            >
              {entry}
            </button>
          ))}
        </div>
        <div className="picker-grid">
          {items.map((skill) => (
            <SkillTile
              key={skill.id}
              skill={skill}
              selected={skill.id === selectedId}
              onPick={onPick}
            />
          ))}
          {items.length === 0 ? <p className="empty picker-empty">No results.</p> : null}
        </div>
      </div>
    </div>
  );
}

function SkillTile({
  skill,
  selected,
  onPick,
}: {
  skill: SkillDef;
  selected: boolean;
  onPick: (skillId: string) => void;
}) {
  return (
    <article className={selected ? "picker-tile is-selected" : "picker-tile"}>
      <button type="button" className="picker-tile-hit" onClick={() => onPick(skill.id)}>
        <p className="tt-kind">{skill.category}</p>
        <h3>{skill.name}</h3>
        <p className="picker-tile-note">{skill.description}</p>
      </button>
    </article>
  );
}
