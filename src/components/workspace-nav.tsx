const tabs = [
  { id: "home", label: "Home", icon: "M3 10l9-7 9 7v10H3zM9 20v-6h6v6" },
  { id: "stats", label: "Stats", icon: "M4 20h16M7 16v-5m5 5V6m5 10V9" },
  { id: "friends", label: "Friends", icon: "M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M17 5a3 3 0 0 1 0 6m3 9v-1a4 4 0 0 0-2-3.5" },
  { id: "profile", label: "Profile", icon: "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2" },
] as const;

type Tab = (typeof tabs)[number]["id"];

export function WorkspaceNav({ active, onSelect }: {
  active: Tab;
  onSelect: (tab: Tab) => void;
}) {
  return (
    <nav className="app-dock workspace-nav" aria-label="SayLess workspace">
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
