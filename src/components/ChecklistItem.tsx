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
      className="rounded-[var(--radius-lg)] p-3.5 transition-all"
      style={{
        backgroundColor: checked ? "var(--color-karrot-subtle)" : "var(--color-bg-surface)",
        border: `1px solid ${checked ? "var(--color-border-karrot-subtle)" : "var(--color-border-default)"}`,
        transitionDuration: "var(--duration-normal)",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(item.id)}
          className="checkbox-base mt-0.5"
          style={
            checked
              ? {
                  backgroundColor: "var(--color-karrot)",
                  borderColor: "var(--color-karrot)",
                  color: "white",
                }
              : {
                  borderColor: "var(--color-border-strong)",
                  backgroundColor: "var(--color-bg-surface)",
                }
          }
          onMouseEnter={(e) => {
            if (!checked) {
              e.currentTarget.style.borderColor = "var(--color-karrot-light)";
              e.currentTarget.style.backgroundColor = "var(--color-karrot-subtle)";
            }
          }}
          onMouseLeave={(e) => {
            if (!checked) {
              e.currentTarget.style.borderColor = "var(--color-border-strong)";
              e.currentTarget.style.backgroundColor = "var(--color-bg-surface)";
            }
          }}
          aria-label={checked ? `${item.label} 완료됨` : `${item.label} 미완료`}
        >
          {checked && (
            <svg
              className="w-3 h-3 animate-check-pop"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className="font-medium transition-all"
            style={{
              color: checked ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
              textDecoration: checked ? "line-through" : "none",
              transitionDuration: "var(--duration-normal)",
            }}
          >
            {item.label}
          </p>
          {item.description && (
            <p
              className="text-sm mt-0.5"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {item.description}
            </p>
          )}

          {/* Note Area */}
          {showNote ? (
            <textarea
              className="mt-2 w-full text-sm rounded-[var(--radius-md)] p-2.5 resize-none focus:outline-none transition-all"
              rows={2}
              placeholder="메모 입력..."
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              onBlur={handleNoteBlur}
              autoFocus
              style={{
                border: "1px solid var(--color-border-default)",
                color: "var(--color-text-primary)",
                backgroundColor: "var(--color-bg-surface)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-focus)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 111, 15, 0.12)";
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-default)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          ) : note ? (
            <button
              onClick={() => setShowNote(true)}
              className="mt-2 text-sm rounded-[var(--radius-md)] px-2.5 py-1 transition-all"
              style={{
                backgroundColor: "var(--color-karrot-subtle)",
                color: "var(--color-karrot-dark)",
                border: "1px solid var(--color-border-karrot-subtle)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-karrot-muted)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-karrot-subtle)";
              }}
            >
              {note}
            </button>
          ) : null}
        </div>

        {/* Note Toggle */}
        <button
          onClick={() => setShowNote(!showNote)}
          className="flex-shrink-0 p-1 rounded-[var(--radius-sm)] transition-all"
          title="메모"
          style={{ color: "var(--color-text-tertiary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-karrot)";
            e.currentTarget.style.backgroundColor = "var(--color-karrot-subtle)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-tertiary)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
