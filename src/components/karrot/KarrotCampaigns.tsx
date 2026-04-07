"use client";

import { useState, useEffect } from "react";
import {
  getMerchants,
  saveMerchant,
  deleteMerchant,
  type KarrotMerchant,
  type KarrotCreative,
} from "@/lib/storage";
import MerchantCard from "./MerchantCard";
import MerchantForm from "./MerchantForm";

interface Props {
  campaignId: string;
}

export default function KarrotCampaigns({ campaignId }: Props) {
  const [merchants, setMerchants] = useState<KarrotMerchant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editMerchant, setEditMerchant] = useState<KarrotMerchant | null>(null);

  const reload = () => setMerchants(getMerchants(campaignId));

  useEffect(() => { reload(); }, [campaignId]);

  const handleSave = (m: KarrotMerchant) => {
    saveMerchant(m);
    reload();
    setShowForm(false);
    setEditMerchant(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("이 머천트를 삭제할까요?")) return;
    deleteMerchant(id);
    reload();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
            캠페인 / 머천트
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            {merchants.length}개 머천트
          </p>
        </div>
        <button
          onClick={() => { setEditMerchant(null); setShowForm(true); }}
          className="px-4 py-2 text-sm font-semibold rounded-[var(--radius-lg)] transition-all"
          style={{
            backgroundColor: "var(--color-karrot)",
            color: "var(--color-text-on-orange)",
            boxShadow: "var(--shadow-karrot)",
          }}
        >
          + 머천트 추가
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <MerchantForm
          campaignId={campaignId}
          merchant={editMerchant}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditMerchant(null); }}
        />
      )}

      {/* Merchant Cards */}
      {merchants.length === 0 && !showForm ? (
        <div className="card py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--color-karrot-subtle)" }}>
            <svg className="w-8 h-8" style={{ color: "var(--color-karrot)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            등록된 머천트가 없습니다
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            위 버튼을 눌러 CPA 오퍼를 추가하세요
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {merchants.map((m) => (
            <MerchantCard
              key={m.id}
              merchant={m}
              onEdit={(m) => { setEditMerchant(m); setShowForm(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
