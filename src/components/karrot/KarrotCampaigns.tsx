"use client";

import { useState, useEffect } from "react";
import {
  getMerchants,
  saveMerchant,
  deleteMerchant,
  type KarrotMerchant,
  type KarrotCreative,
} from "@/lib/storage";

interface Props {
  campaignId: string;
}

const emptyMerchant = (campaignId: string): KarrotMerchant => ({
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
});

const statusLabels = { active: "운영중", paused: "일시정지", ended: "종료" };
const statusColors = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  ended: "bg-gray-100 text-gray-500",
};

export default function KarrotCampaigns({ campaignId }: Props) {
  const [merchants, setMerchants] = useState<KarrotMerchant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<KarrotMerchant>(emptyMerchant(campaignId));

  useEffect(() => {
    setMerchants(getMerchants(campaignId));
  }, [campaignId]);

  const handleSave = () => {
    if (!form.merchantName.trim()) return;
    saveMerchant(form);
    setMerchants(getMerchants(campaignId));
    setShowForm(false);
    setEditId(null);
    setForm(emptyMerchant(campaignId));
  };

  const handleEdit = (m: KarrotMerchant) => {
    setForm(m);
    setEditId(m.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("삭제할까요?")) return;
    deleteMerchant(id);
    setMerchants(getMerchants(campaignId));
  };

  const handleAddCreative = () => {
    const c: KarrotCreative = {
      id: crypto.randomUUID(),
      name: "",
      active: true,
      memo: "",
    };
    setForm({ ...form, creatives: [...form.creatives, c] });
  };

  const updateCreative = (idx: number, updates: Partial<KarrotCreative>) => {
    const creatives = [...form.creatives];
    creatives[idx] = { ...creatives[idx], ...updates };
    setForm({ ...form, creatives });
  };

  const removeCreative = (idx: number) => {
    setForm({ ...form, creatives: form.creatives.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">캠페인 / 머천트 관리</h2>
        <button
          onClick={() => {
            setForm(emptyMerchant(campaignId));
            setEditId(null);
            setShowForm(true);
          }}
          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
        >
          + 머천트 추가
        </button>
      </div>

      {showForm && (
        <div className="border border-orange-200 rounded-xl p-4 mb-4 bg-orange-50 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                머천트명
              </label>
              <input
                className="w-full border rounded-lg px-2 py-1.5 text-sm"
                value={form.merchantName}
                onChange={(e) =>
                  setForm({ ...form, merchantName: e.target.value })
                }
                placeholder="예: 지니쌤 무료강의"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                CPA 플랫폼
              </label>
              <select
                className="w-full border rounded-lg px-2 py-1.5 text-sm"
                value={form.cpaPlat}
                onChange={(e) => setForm({ ...form, cpaPlat: e.target.value })}
              >
                <option>에어CPA</option>
                <option>디비센스</option>
                <option>애드팟</option>
                <option>기타</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                건당 수익 (원)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-2 py-1.5 text-sm"
                value={form.cpaAmount}
                onChange={(e) =>
                  setForm({ ...form, cpaAmount: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                승인 방식
              </label>
              <select
                className="w-full border rounded-lg px-2 py-1.5 text-sm"
                value={form.approvalType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    approvalType: e.target.value as "confirmed" | "approval",
                  })
                }
              >
                <option value="confirmed">확정형</option>
                <option value="approval">승인형</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                진행 매체
              </label>
              <input
                className="w-full border rounded-lg px-2 py-1.5 text-sm"
                value={form.medium}
                onChange={(e) => setForm({ ...form, medium: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                상태
              </label>
              <select
                className="w-full border rounded-lg px-2 py-1.5 text-sm"
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as "active" | "paused" | "ended",
                  })
                }
              >
                <option value="active">운영중</option>
                <option value="paused">일시정지</option>
                <option value="ended">종료</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-600">소재 관리</span>
              <button
                onClick={handleAddCreative}
                className="text-xs text-orange-600 hover:text-orange-700"
              >
                + 소재 추가
              </button>
            </div>
            {form.creatives.map((c, i) => (
              <div
                key={c.id}
                className="flex gap-2 items-center mb-2 bg-white rounded-lg p-2 border"
              >
                <input
                  className="flex-1 border rounded px-2 py-1 text-xs"
                  placeholder="소재명"
                  value={c.name}
                  onChange={(e) => updateCreative(i, { name: e.target.value })}
                />
                <input
                  className="w-16 border rounded px-2 py-1 text-xs"
                  placeholder="CTR %"
                  type="number"
                  step="0.01"
                  value={c.ctr || ""}
                  onChange={(e) =>
                    updateCreative(i, { ctr: Number(e.target.value) || undefined })
                  }
                />
                <input
                  className="w-16 border rounded px-2 py-1 text-xs"
                  placeholder="CPC"
                  type="number"
                  value={c.cpc || ""}
                  onChange={(e) =>
                    updateCreative(i, { cpc: Number(e.target.value) || undefined })
                  }
                />
                <button
                  onClick={() => removeCreative(i)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="flex-1 py-1.5 border rounded-lg text-sm text-gray-600"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium"
            >
              {editId ? "수정" : "추가"}
            </button>
          </div>
        </div>
      )}

      {merchants.length === 0 && !showForm ? (
        <p className="text-center text-gray-400 py-8">
          등록된 머천트가 없습니다
        </p>
      ) : (
        <div className="space-y-3">
          {merchants.map((m) => (
            <div
              key={m.id}
              className="border rounded-xl p-4 bg-white hover:shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[m.status]
                      }`}
                    >
                      {statusLabels[m.status]}
                    </span>
                    <span className="text-xs text-gray-400">{m.cpaPlat}</span>
                  </div>
                  <h3 className="font-bold">{m.merchantName}</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(m)}
                    className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-gray-400 hover:text-red-500 text-xs px-2 py-1"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                <div>
                  건당{" "}
                  <span className="font-bold text-gray-900">
                    {m.cpaAmount.toLocaleString()}원
                  </span>
                </div>
                <div>{m.approvalType === "confirmed" ? "확정형" : "승인형"}</div>
                <div>{m.medium}</div>
              </div>
              {m.creatives.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-400 mb-1">
                    소재 {m.creatives.length}개
                  </p>
                  {m.creatives.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 text-xs text-gray-600 py-0.5"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          c.active ? "bg-green-400" : "bg-gray-300"
                        }`}
                      />
                      <span className="flex-1">{c.name || "(이름 없음)"}</span>
                      {c.ctr != null && <span>CTR {c.ctr}%</span>}
                      {c.cpc != null && <span>CPC {c.cpc}원</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
