"use client";

import Link from "next/link";
import type { Campaign } from "@/lib/storage";
import { facebookChecklist } from "@/data/facebook-checklist";
import { karrotChecklist } from "@/data/karrot-checklist";

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (id: string) => void;
}

const platformLabels: Record<Campaign["platform"], string> = {
  facebook: "Facebook/Instagram",
  karrot: "당근",
  youtube: "YouTube (Coming Soon)",
};

function getProgressColor(progress: number): string {
  if (progress === 100) return "var(--color-profit)";
  if (progress >= 70) return "var(--color-profit-light)";
  if (progress >= 30) return "var(--color-karrot)";
  return "var(--color-text-tertiary)";
}

function getProgressTrackGradient(progress: number): string {
  if (progress === 100) return "var(--color-profit)";
  if (progress >= 70) return "linear-gradient(90deg, var(--color-karrot), var(--color-profit-light))";
  if (progress >= 30) return "linear-gradient(90deg, var(--color-text-tertiary), var(--color-karrot))";
  return "var(--color-border-strong)";
}

export default function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  const phases =
    campaign.platform === "karrot" ? karrotChecklist : facebookChecklist;
  const totalItems = phases.reduce((sum, p) => sum + p.items.length, 0);
  const checkedCount = Object.values(campaign.checkedItems).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const platformBadgeClass =
    campaign.platform === "karrot"
      ? "badge-karrot"
      : campaign.platform === "facebook"
      ? "badge-facebook"
      : "badge-karrot";

  return (
    <div className="card card-interactive p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-[var(--radius-full)] ${platformBadgeClass}`}
          >
            {platformLabels[campaign.platform]}
          </span>
          <h3
            className="font-bold text-lg mt-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            {campaign.name}
          </h3>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {new Date(campaign.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (confirm("정말 삭제할까요?")) onDelete(campaign.id);
          }}
          className="p-1.5 rounded-[var(--radius-md)] transition-all"
          style={{ color: "var(--color-text-disabled)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-loss)";
            e.currentTarget.style.backgroundColor = "var(--color-loss-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-disabled)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm mb-2">
          <span
            className="font-[family-name:var(--font-mono)] tabular-nums"
            style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}
          >
            {checkedCount}/{totalItems}
          </span>
          <span
            className="font-bold font-[family-name:var(--font-mono)] tabular-nums"
            style={{ color: getProgressColor(progress), fontSize: "13px" }}
          >
            {progress}%
          </span>
        </div>
        <div className="progress-track">
          <div
            className="h-full rounded-[var(--radius-full)]"
            style={{
              width: `${progress}%`,
              background: getProgressTrackGradient(progress),
              transition: "width 500ms var(--ease-out-expo)",
              animation: "progress-fill 600ms var(--ease-out-expo)",
            }}
          />
        </div>
      </div>

      {/* CTA Button */}
      <Link
        href={`/campaign/${campaign.id}`}
        className="block text-center py-2.5 px-4 rounded-[var(--radius-lg)] text-sm font-semibold transition-all"
        style={
          progress === 100
            ? {
                backgroundColor: "var(--color-profit-bg)",
                color: "var(--color-profit)",
                border: "1px solid var(--color-profit-border)",
              }
            : {
                backgroundColor: "var(--color-text-primary)",
                color: "var(--color-text-on-orange)",
              }
        }
        onMouseEnter={(e) => {
          if (progress !== 100) {
            e.currentTarget.style.backgroundColor = "var(--color-karrot)";
            e.currentTarget.style.boxShadow = "var(--shadow-karrot)";
          }
        }}
        onMouseLeave={(e) => {
          if (progress !== 100) {
            e.currentTarget.style.backgroundColor = "var(--color-text-primary)";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      >
        {progress === 100 ? "완료! 다시 보기" : "이어서 체크하기 \u2192"}
      </Link>
    </div>
  );
}
