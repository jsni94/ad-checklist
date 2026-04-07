"use client";

import { useState } from "react";
import type { Campaign } from "@/lib/storage";

interface NewCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, platform: Campaign["platform"]) => void;
}

export default function NewCampaignModal({
  open,
  onClose,
  onCreate,
}: NewCampaignModalProps) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Campaign["platform"]>("facebook");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), platform);
    setName("");
    setPlatform("facebook");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">새 광고 캠페인</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              캠페인 이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 영셀 강의 광고 4월"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              플랫폼
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { key: "facebook" as const, label: "Facebook", disabled: false },
                  { key: "karrot" as const, label: "당근", disabled: false },
                  { key: "youtube" as const, label: "YouTube", disabled: true },
                ]
              ).map((p) => (
                <button
                  key={p.key}
                  type="button"
                  disabled={p.disabled}
                  onClick={() => !p.disabled && setPlatform(p.key)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                    p.disabled
                      ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                      : platform === p.key
                      ? platform === "karrot"
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {p.label}
                  {p.disabled && (
                    <span className="block text-[10px] text-gray-300">
                      준비중
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2 px-4 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
