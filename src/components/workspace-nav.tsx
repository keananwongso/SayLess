const tabs = [
  { id: "analyze", label: "Analyze", icon: "M3 12h3l3-6 4 12 3-6h5" },
  { id: "wrapped", label: "Wrapped", icon: "M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z" },
  { id: "practice", label: "Practice", icon: "M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" },
  { id: "challenges", label: "Challenges", icon: "m13 2-9 12h7l-1 8 10-12h-7z" },
  { id: "profile", label: "Profile", icon: "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2" },
] as const;

type Tab = (typeof tabs)[number]["id"];

export function WorkspaceNav({ active, onSelect }: {
  active: Tab;
  onSelect: (tab: Tab) => void;
}) {
  return (
    <nav className="phone-dock workspace-nav" aria-label="SayLess workspace">
      {tabs.map(({ id, label, icon }) => (
        <button key={id} type="button" aria-current={active === id ? "page" : undefined} onClick={() => onSelect(id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={icon} />
          </svg>
          {label}
        </button>
      ))}
    </nav>
  );
}
