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
        <div className="w-10 h-10 rounded-full skeleton" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <p style={{ color: "var(--color-text-secondary)" }}>캠페인을 찾을 수 없습니다.</p>
        <Link href="/" style={{ color: "var(--color-karrot)" }} className="hover:underline mt-2 inline-block">
          돌아가기
        </Link>
      </main>
    );
  }

  const isKarrot = campaign.platform === "karrot";

  const renderChecklist = () => (
    <>
      <div className="sticky top-0 z-10 py-3 mb-4" style={{ backgroundColor: "var(--color-bg-base)" }}>
        <ProgressBar
          progress={progress}
          checked={checkedCount}
          total={totalItems}
        />
      </div>

      {progress === 100 && (
        <div className="card p-5 mb-4 text-center" style={{ backgroundColor: "var(--color-profit-bg)", borderColor: "var(--color-profit-border)" }}>
          <p className="font-bold text-lg" style={{ color: "var(--color-profit)" }}>모든 준비 완료!</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-profit-light)" }}>광고 집행 시작하세요</p>
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
      <div className="mb-5">
        <Link
          href="/"
          className="text-sm flex items-center gap-1.5 mb-3 transition-colors"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          목록으로
        </Link>

        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{campaign.name}</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
          {new Date(campaign.createdAt).toLocaleDateString("ko-KR")} 생성
        </p>
      </div>

      {isKarrot ? (
        <>
          <KarrotTabs activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "checklist" && renderChecklist()}
          {activeTab === "campaigns" && <KarrotCampaigns campaignId={id} />}
        </>
      ) : (
        renderChecklist()
      )}
    </main>
  );
}
