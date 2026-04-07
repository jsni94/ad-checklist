"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { facebookChecklist } from "@/data/facebook-checklist";
import { karrotChecklist } from "@/data/karrot-checklist";
import { useChecklist } from "@/hooks/useChecklist";
import { getCampaign } from "@/lib/storage";
import ProgressBar from "@/components/ProgressBar";
import ChecklistPhase from "@/components/ChecklistPhase";
import KarrotTabs, { type KarrotTabId } from "@/components/karrot/KarrotTabs";
import KarrotCampaigns from "@/components/karrot/KarrotCampaigns";
import KarrotDashboard from "@/components/karrot/KarrotDashboard";
import KarrotCalculator from "@/components/karrot/KarrotCalculator";

function getChecklistForPlatform(platform: string) {
  if (platform === "karrot") return karrotChecklist;
  return facebookChecklist;
}

export default function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const [platform, setPlatform] = useState<string>("facebook");
  const [activeTab, setActiveTab] = useState<KarrotTabId>("checklist");

  useEffect(() => {
    setMounted(true);
    const c = getCampaign(id);
    if (c) setPlatform(c.platform);
  }, [id]);

  const phases = getChecklistForPlatform(platform);
  const {
    campaign,
    toggleItem,
    setNote,
    progress,
    checkedCount,
    totalItems,
    getPhaseProgress,
  } = useChecklist(id, phases);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500">캠페인을 찾을 수 없습니다.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
          돌아가기
        </Link>
      </main>
    );
  }

  const isKarrot = campaign.platform === "karrot";

  const renderChecklist = () => (
    <>
      <div className="sticky top-0 z-10 bg-[#f9fafb] py-3 mb-4">
        <ProgressBar
          progress={progress}
          checked={checkedCount}
          total={totalItems}
        />
      </div>

      {progress === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
          <p className="text-green-700 font-bold text-lg">모든 준비 완료!</p>
          <p className="text-green-600 text-sm mt-1">광고 집행 시작하세요</p>
        </div>
      )}

      <div className="space-y-4">
        {phases.map((phase) => (
          <ChecklistPhase
            key={phase.id}
            phase={phase}
            checkedItems={campaign.checkedItems}
            notes={campaign.notes}
            phaseProgress={getPhaseProgress(phase)}
            onToggle={toggleItem}
            onNote={setNote}
          />
        ))}
      </div>
    </>
  );

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 w-full">
      <div className="mb-4">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          목록으로
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {new Date(campaign.createdAt).toLocaleDateString("ko-KR")} 생성
        </p>
      </div>

      {isKarrot ? (
        <>
          <KarrotTabs activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "checklist" && renderChecklist()}
          {activeTab === "campaigns" && (
            <KarrotCampaigns campaignId={id} />
          )}
          {activeTab === "dashboard" && (
            <KarrotDashboard campaignId={id} />
          )}
          {activeTab === "calculator" && <KarrotCalculator />}
        </>
      ) : (
        renderChecklist()
      )}
    </main>
  );
}
