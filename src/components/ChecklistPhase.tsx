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
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          isComplete ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isComplete
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {isComplete ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              phaseProgress.checked
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{phase.title}</h3>
            <p className="text-sm text-gray-500">{phase.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {phaseProgress.checked}/{phaseProgress.total}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-2">
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
      )}
    </div>
  );
}
