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

const platformColors: Record<Campaign["platform"], string> = {
  facebook: "bg-blue-100 text-blue-700",
  karrot: "bg-orange-100 text-orange-700",
  youtube: "bg-red-100 text-red-700",
};

export default function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  const phases =
    campaign.platform === "karrot" ? karrotChecklist : facebookChecklist;
  const totalItems = phases.reduce((sum, p) => sum + p.items.length, 0);
  const checkedCount = Object.values(campaign.checkedItems).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              platformColors[campaign.platform]
            }`}
          >
            {platformLabels[campaign.platform]}
          </span>
          <h3 className="font-bold text-lg mt-2 text-gray-900">
            {campaign.name}
          </h3>
          <p className="text-sm text-gray-400">
            {new Date(campaign.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (confirm("정말 삭제할까요?")) onDelete(campaign.id);
          }}
          className="text-gray-300 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>
            {checkedCount}/{totalItems}
          </span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress === 100 ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Link
        href={`/campaign/${campaign.id}`}
        className="block text-center py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
      >
        {progress === 100 ? "완료! 다시 보기" : "이어서 체크하기"}
      </Link>
    </div>
  );
}
