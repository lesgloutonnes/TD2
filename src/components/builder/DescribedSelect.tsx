"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  previewDescribedOption,
  type DescribedOption,
} from "@/lib/described-select";

export function DescribedSelect({
  value,
  onChange,
  options,
  emptyLabel = "None",
  allowEmpty = true,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly DescribedOption[];
  emptyLabel?: string;
  allowEmpty?: boolean;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const selected = options.find((option) => option.value === value);
  const preview = previewDescribedOption(options, value, open ? hoveredValue : null);
  const rows: DescribedOption[] = allowEmpty
    ? [{ value: "", label: emptyLabel }, ...options]
    : [...options];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
      setHoveredValue(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setHoveredValue(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function moveActive(delta: number) {
    const current = hoveredValue ?? value;
    const index = Math.max(
      0,
      rows.findIndex((row) => row.value === current),
    );
    const next = rows[(index + delta + rows.length) % rows.length];
    setHoveredValue(next.value);
  }

  function pick(next: string) {
    onChange(next);
    setOpen(false);
    setHoveredValue(null);
  }

  return (
    <div className="described-select" ref={rootRef}>
      <div className="described-select-anchor">
        <button
          type="button"
          className="described-select-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => {
            setOpen((wasOpen) => {
              const next = !wasOpen;
              setHoveredValue(next ? value : null);
              return next;
            });
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (!open) {
                setOpen(true);
                setHoveredValue(value);
                return;
              }
              moveActive(1);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              if (!open) {
                setOpen(true);
                setHoveredValue(value);
                return;
              }
              moveActive(-1);
            }
            if (open && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              pick(hoveredValue ?? value);
            }
          }}
        >
          <span>{selected?.label ?? emptyLabel}</span>
        </button>
        {open ? (
          <ul id={listId} className="described-select-list" role="listbox">
            {rows.map((row) => {
              const active = (hoveredValue ?? value) === row.value;
              return (
                <li key={row.value || "none"} role="none">
                  <button
                    type="button"
                    role="option"
                    className={
                      row.value === value
                        ? active
                          ? "described-select-option is-selected is-active"
                          : "described-select-option is-selected"
                        : active
                          ? "described-select-option is-active"
                          : "described-select-option"
                    }
                    aria-selected={row.value === value}
                    onMouseEnter={() => setHoveredValue(row.value)}
                    onClick={() => pick(row.value)}
                  >
                    {row.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      {preview?.description ? <p className="hint">{preview.description}</p> : null}
    </div>
  );
}
