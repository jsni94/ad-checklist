"use client";

import { useState } from "react";
import type { KarrotMerchant } from "@/lib/storage";

interface Props {
  campaignId: string;
  merchant: KarrotMerchant | null;
  onSave: (m: KarrotMerchant) => void;
  onCancel: () => void;
}

export default function MerchantForm({ campaignId, merchant, onSave, onCancel }: Props) {
  const [form, setForm] = useState<KarrotMerchant>(
    merchant || {
      id: crypto.randomUUID(),
      campaignId,
      merchantName: "",
      cpaPlat: "에어CPA",
      cpaAmount: 11000,
      approvalType: "confirmed",
      medium: "당근",
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
      creatives: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.merchantName.trim()) return;
    onSave(form);
  };

  const inputCls = "w-full rounded-[var(--radius-md)] px-3 py-2 text-sm transition-all focus:outline-none focus-ring";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "var(--color-bg-overlay)" }}>
      <div className="w-full max-w-md rounded-[var(--radius-2xl)] p-6" style={{ backgroundColor: "var(--color-bg-surface)", boxShadow: "var(--shadow-modal)" }}>
        <h2 className="text-lg font-bold mb-5" style={{ color: "var(--color-text-primary)" }}>
          {merchant ? "머천트 수정" : "새 머천트 추가"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>머천트명</label>
            <input
              className={inputCls}
              style={{ border: "1px solid var(--color-border-default)" }}
              value={form.merchantName}
              onChange={(e) => setForm({ ...form, merchantName: e.target.value })}
              placeholder="예: 지니쌤 무료강의"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>CPA 플랫폼</label>
              <select className={inputCls} style={{ border: "1px solid var(--color-border-default)" }} value={form.cpaPlat} onChange={(e) => setForm({ ...form, cpaPlat: e.target.value })}>
                <option>에어CPA</option>
                <option>디비센스</option>
                <option>애드팟</option>
                <option>기타</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>건당 수익 (원)</label>
              <input type="number" className={inputCls} style={{ border: "1px solid var(--color-border-default)" }} value={form.cpaAmount} onChange={(e) => setForm({ ...form, cpaAmount: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>승인 방식</label>
              <select className={inputCls} style={{ border: "1px solid var(--color-border-default)" }} value={form.approvalType} onChange={(e) => setForm({ ...form, approvalType: e.target.value as "confirmed" | "approval" })}>
                <option value="confirmed">확정형</option>
                <option value="approval">승인형</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>진행 매체</label>
              <input className={inputCls} style={{ border: "1px solid var(--color-border-default)" }} value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-[var(--radius-lg)] text-sm font-semibold transition-all" style={{ border: "1px solid var(--color-border-default)", color: "var(--color-text-secondary)" }}>
              취소
            </button>
            <button type="submit" disabled={!form.merchantName.trim()} className="flex-1 py-2.5 rounded-[var(--radius-lg)] text-sm font-semibold transition-all disabled:opacity-40" style={{ backgroundColor: "var(--color-karrot)", color: "var(--color-text-on-orange)", boxShadow: "var(--shadow-karrot)" }}>
              {merchant ? "수정" : "추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
