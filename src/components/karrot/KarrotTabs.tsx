"use client";

import { useState } from "react";

const tabs = [
  { id: "checklist", label: "체크리스트" },
  { id: "campaigns", label: "캠페인 관리" },
  { id: "dashboard", label: "성과 추적" },
  { id: "calculator", label: "수익 계산기" },
] as const;

export type KarrotTabId = (typeof tabs)[number]["id"];

interface KarrotTabsProps {
  activeTab: KarrotTabId;
  onTabChange: (tab: KarrotTabId) => void;
}

export default function KarrotTabs({ activeTab, onTabChange }: KarrotTabsProps) {
  return (
    <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.id
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
