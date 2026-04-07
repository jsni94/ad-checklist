"use client";

const tabs = [
  { id: "checklist", label: "체크리스트", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { id: "campaigns", label: "캠페인 관리", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
] as const;

export type KarrotTabId = (typeof tabs)[number]["id"];

interface KarrotTabsProps {
  activeTab: KarrotTabId;
  onTabChange: (tab: KarrotTabId) => void;
}

export default function KarrotTabs({ activeTab, onTabChange }: KarrotTabsProps) {
  return (
    <div className="flex gap-1 p-1 rounded-[var(--radius-lg)] mb-6" style={{ backgroundColor: "var(--color-border-default)" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-[var(--radius-md)] transition-all"
          style={{
            backgroundColor: activeTab === tab.id ? "var(--color-bg-surface)" : "transparent",
            color: activeTab === tab.id ? "var(--color-karrot)" : "var(--color-text-secondary)",
            boxShadow: activeTab === tab.id ? "var(--shadow-sm)" : "none",
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
          </svg>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
