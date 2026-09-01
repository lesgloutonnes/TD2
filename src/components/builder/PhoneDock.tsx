"use client";

type PhoneTab = "loadout" | "edit" | "kit" | "stats";

const TABS: { id: PhoneTab; label: string; icon: string }[] = [
  { id: "loadout", label: "Agent", icon: "◆" },
  { id: "edit", label: "Piece", icon: "▣" },
  { id: "kit", label: "Kit", icon: "☰" },
  { id: "stats", label: "Stats", icon: "▤" },
];

export function PhoneDock({
  tab,
  onTab,
}: {
  tab: PhoneTab;
  onTab: (tab: PhoneTab) => void;
}) {
  return (
    <nav className="phone-dock" aria-label="Builder sections">
      {TABS.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className={tab === entry.id ? "phone-dock-btn active" : "phone-dock-btn"}
          onClick={() => onTab(entry.id)}
        >
          <span className="phone-dock-icon" aria-hidden="true">
            {entry.icon}
          </span>
          {entry.label}
        </button>
      ))}
    </nav>
  );
}

export type { PhoneTab };
