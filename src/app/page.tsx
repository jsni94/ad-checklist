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
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ad Checklist</h1>
        <p className="text-gray-500 mt-1">
          광고 돌리기 전에 빠뜨린 거 없나 확인하자
        </p>
      </header>

      <button
        onClick={() => setShowModal(true)}
        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors mb-6 font-medium"
      >
        + 새 캠페인 만들기
      </button>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-lg font-medium">아직 캠페인이 없어요</p>
          <p className="text-sm mt-1">
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
