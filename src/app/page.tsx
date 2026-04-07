"use client";

import { useState, useEffect } from "react";
import {
  getCampaigns,
  createCampaign,
  saveCampaign,
  deleteCampaign,
  type Campaign,
} from "@/lib/storage";
import CampaignCard from "@/components/CampaignCard";
import NewCampaignModal from "@/components/NewCampaignModal";

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCampaigns(getCampaigns());
  }, []);

  const handleCreate = (name: string, platform: Campaign["platform"]) => {
    const campaign = createCampaign(name, platform);
    saveCampaign(campaign);
    setCampaigns(getCampaigns());
  };

  const handleDelete = (id: string) => {
    deleteCampaign(id);
    setCampaigns(getCampaigns());
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{
            border: "3px solid var(--color-border-default)",
            borderTopColor: "var(--color-karrot)",
          }}
        />
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 w-full">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-karrot)",
              boxShadow: "var(--shadow-karrot)",
            }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Ad Checklist
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              광고 돌리기 전에 빠뜨린 거 없나 확인하자
            </p>
          </div>
        </div>
      </header>

      {/* New Campaign Button */}
      <button
        onClick={() => setShowModal(true)}
        className="group w-full py-3.5 px-5 rounded-[var(--radius-xl)] font-semibold text-sm mb-6 flex items-center justify-center gap-2 transition-all"
        style={{
          backgroundColor: "var(--color-karrot)",
          color: "var(--color-text-on-orange)",
          boxShadow: "var(--shadow-karrot)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-karrot-dark)";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 111, 15, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-karrot)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "var(--shadow-karrot)";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(0.985)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        새 캠페인 만들기
      </button>

      {/* Campaign List or Empty State */}
      {campaigns.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center animate-float"
            style={{ backgroundColor: "var(--color-karrot-subtle)" }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: "var(--color-karrot-light)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <p
            className="text-lg font-bold"
            style={{ color: "var(--color-text-secondary)" }}
          >
            아직 캠페인이 없어요
          </p>
          <p
            className="text-sm mt-1.5 leading-relaxed"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            위 버튼을 눌러 첫 번째 광고 체크리스트를 시작하세요
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                onDelete={handleDelete}
              />
            ))}
        </div>
      )}

      <NewCampaignModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </main>
  );
}
