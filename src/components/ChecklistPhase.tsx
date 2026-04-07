"use client";

import { useState } from "react";
import type { ChecklistPhase as ChecklistPhaseType } from "@/data/facebook-checklist";
import ChecklistItem from "./ChecklistItem";

interface ChecklistPhaseProps {
  phase: ChecklistPhaseType;
  checkedItems: Record<string, boolean>;
  notes: Record<string, string>;
  phaseProgress: { checked: number; total: number };
  onToggle: (id: string) => void;
  onNote: (id: string, note: string) => void;
}

export default function ChecklistPhase({
  phase,
  checkedItems,
  notes,
  phaseProgress,
  onToggle,
  onNote,
}: ChecklistPhaseProps) {
  const isComplete = phaseProgress.checked === phaseProgress.total;
  const [expanded, setExpanded] = useState(!isComplete);

  return (
    <div
      className="card overflow-hidden"
    >
      {/* Phase Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left transition-all"
        style={{
          backgroundColor: isComplete ? "var(--color-profit-bg)" : "var(--color-bg-base)",
          transitionDuration: "var(--duration-normal)",
        }}
        onMouseEnter={(e) => {
          if (!isComplete) {
            e.currentTarget.style.backgroundColor = "var(--color-karrot-subtle)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isComplete) {
            e.currentTarget.style.backgroundColor = "var(--color-bg-base)";
          }
        }}
      >
        <div className="flex items-center gap-3">
          {/* Phase Number Circle */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all"
            style={
              isComplete
                ? {
                    backgroundColor: "var(--color-profit)",
                    color: "white",
                    transitionDuration: "var(--duration-normal)",
                  }
                : {
                    backgroundColor: "var(--color-karrot)",
                    color: "var(--color-text-on-orange)",
                    boxShadow: "var(--shadow-karrot)",
                    transitionDuration: "var(--duration-normal)",
                  }
            }
          >
            {isComplete ? (
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              phaseProgress.checked
            )}
          </div>
          <div>
            <h3
              className="font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {phase.title}
            </h3>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {phase.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-sm font-[family-name:var(--font-mono)] tabular-nums"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {phaseProgress.checked}/{phaseProgress.total}
          </span>
          <svg
            className="w-5 h-5 transition-transform"
            style={{
              color: "var(--color-text-tertiary)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transitionDuration: "var(--duration-normal)",
              transitionTimingFunction: "var(--ease-out-expo)",
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Items */}
      <div
        style={{
          display: expanded ? "block" : "none",
        }}
      >
        <div
          className="p-4 space-y-2"
          style={{ borderTop: "1px solid var(--color-border-default)" }}
        >
          {phase.items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              checked={!!checkedItems[item.id]}
              note={notes[item.id] || ""}
              onToggle={onToggle}
              onNote={onNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
