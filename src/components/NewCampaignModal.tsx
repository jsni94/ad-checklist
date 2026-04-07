"use client";

import { useState } from "react";
import type { Campaign } from "@/lib/storage";

interface NewCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, platform: Campaign["platform"]) => void;
}

const platformOptions = [
  {
    key: "facebook" as const,
    label: "Facebook",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    disabled: false,
    activeStyle: {
      borderColor: "var(--color-platform-facebook-border)",
      backgroundColor: "var(--color-platform-facebook-bg)",
      color: "var(--color-platform-facebook-text)",
    },
  },
  {
    key: "karrot" as const,
    label: "당근",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
      </svg>
    ),
    disabled: false,
    activeStyle: {
      borderColor: "var(--color-border-karrot-subtle)",
      backgroundColor: "var(--color-karrot-subtle)",
      color: "var(--color-karrot-dark)",
    },
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    disabled: true,
    activeStyle: {},
  },
];

export default function NewCampaignModal({
  open,
  onClose,
  onCreate,
}: NewCampaignModalProps) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Campaign["platform"]>("facebook");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), platform);
    setName("");
    setPlatform("facebook");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: "var(--color-bg-overlay)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-[var(--radius-2xl)] p-6 animate-sheet-up sm:animate-slide-down"
        style={{
          backgroundColor: "var(--color-bg-surface)",
          boxShadow: "var(--shadow-modal)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            새 광고 캠페인
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-md)] transition-all"
            style={{ color: "var(--color-text-tertiary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-bg-base)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--color-text-tertiary)";
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campaign Name */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              캠페인 이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 영셀 강의 광고 4월"
              className="w-full px-3.5 py-2.5 rounded-[var(--radius-lg)] text-sm transition-all focus:outline-none"
              style={{
                border: "1px solid var(--color-border-default)",
                color: "var(--color-text-primary)",
                backgroundColor: "var(--color-bg-surface)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-focus)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 111, 15, 0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-default)";
                e.currentTarget.style.boxShadow = "none";
              }}
              autoFocus
            />
          </div>

          {/* Platform Selection */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              플랫폼
            </label>
            <div className="grid grid-cols-3 gap-2">
              {platformOptions.map((p) => {
                const isActive = platform === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    disabled={p.disabled}
                    onClick={() => !p.disabled && setPlatform(p.key)}
                    className="flex flex-col items-center gap-1.5 py-3 px-3 rounded-[var(--radius-lg)] text-sm font-semibold border-2 transition-all"
                    style={
                      p.disabled
                        ? {
                            borderColor: "var(--color-border-default)",
                            color: "var(--color-text-disabled)",
                            backgroundColor: "var(--color-bg-base)",
                            cursor: "not-allowed",
                            opacity: 0.6,
                          }
                        : isActive
                        ? {
                            ...p.activeStyle,
                            borderWidth: "2px",
                            borderStyle: "solid",
                          }
                        : {
                            borderColor: "var(--color-border-default)",
                            color: "var(--color-text-secondary)",
                            backgroundColor: "var(--color-bg-surface)",
                          }
                    }
                  >
                    <span style={isActive && !p.disabled ? { color: p.activeStyle.color } : undefined}>
                      {p.icon}
                    </span>
                    {p.label}
                    {p.disabled && (
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: "var(--color-text-disabled)" }}
                      >
                        준비중
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-[var(--radius-lg)] text-sm font-semibold transition-all"
              style={{
                border: "1px solid var(--color-border-default)",
                color: "var(--color-text-secondary)",
                backgroundColor: "var(--color-bg-surface)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-bg-base)";
                e.currentTarget.style.borderColor = "var(--color-border-strong)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-bg-surface)";
                e.currentTarget.style.borderColor = "var(--color-border-default)";
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2.5 px-4 rounded-[var(--radius-lg)] text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-karrot)",
                color: "var(--color-text-on-orange)",
                boxShadow: name.trim() ? "var(--shadow-karrot)" : "none",
              }}
              onMouseEnter={(e) => {
                if (name.trim()) {
                  e.currentTarget.style.backgroundColor = "var(--color-karrot-dark)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-karrot)";
              }}
            >
              만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
