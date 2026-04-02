"use client";

import { useState } from "react";
import type { ChecklistItem as ChecklistItemType } from "@/data/facebook-checklist";

interface ChecklistItemProps {
  item: ChecklistItemType;
  checked: boolean;
  note: string;
  onToggle: (id: string) => void;
  onNote: (id: string, note: string) => void;
}

export default function ChecklistItem({
  item,
  checked,
  note,
  onToggle,
  onNote,
}: ChecklistItemProps) {
  const [showNote, setShowNote] = useState(false);
  const [localNote, setLocalNote] = useState(note);

  const handleNoteBlur = () => {
    onNote(item.id, localNote);
  };

  return (
    <div
      className={`border rounded-lg p-3 transition-colors ${
        checked ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(item.id)}
          className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
            checked
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-400"
          }`}
        >
          {checked && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`font-medium ${
              checked ? "text-green-700 line-through" : "text-gray-900"
            }`}
          >
            {item.label}
          </p>
          {item.description && (
            <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
          )}

          {showNote ? (
            <textarea
              className="mt-2 w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={2}
              placeholder="메모 입력..."
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              onBlur={handleNoteBlur}
              autoFocus
            />
          ) : note ? (
            <button
              onClick={() => setShowNote(true)}
              className="mt-1 text-sm text-blue-600 bg-blue-50 rounded px-2 py-0.5 hover:bg-blue-100"
            >
              {note}
            </button>
          ) : null}
        </div>

        <button
          onClick={() => setShowNote(!showNote)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          title="메모"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
