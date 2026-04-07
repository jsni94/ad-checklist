"use client";

import { useState } from "react";

export default function KarrotCalculator() {
  const [cpa, setCpa] = useState(11000);
  const [approvalRate, setApprovalRate] = useState(80);
  const [cpc, setCpc] = useState(300);
  const [convRate, setConvRate] = useState(5);
  const [dailyBudget, setDailyBudget] = useState(30000);

  // Calculations
  const costPerDb = cpc / (convRate / 100);
  const effectiveCpa = cpa * (approvalRate / 100);
  const profitPerDb = effectiveCpa - costPerDb;
  const dailyClicks = dailyBudget / cpc;
  const dailyDbs = dailyClicks * (convRate / 100);
  const dailyRevenue = dailyDbs * effectiveCpa;
  const dailyProfit = dailyRevenue - dailyBudget;
  const monthlyProfit = dailyProfit * 21; // 영업일 기준
  const bepConvRate = (cpc / effectiveCpa) * 100;

  const formatNum = (n: number) =>
    isFinite(n) ? Math.round(n).toLocaleString() : "-";
  const formatDec = (n: number, d = 1) =>
    isFinite(n) ? n.toFixed(d) : "-";

  const sliders = [
    {
      label: "건당 CPA 수익",
      value: cpa,
      set: setCpa,
      min: 1000,
      max: 100000,
      step: 1000,
      unit: "원",
    },
    {
      label: "예상 승인율",
      value: approvalRate,
      set: setApprovalRate,
      min: 10,
      max: 100,
      step: 5,
      unit: "%",
    },
    {
      label: "예상 CPC",
      value: cpc,
      set: setCpc,
      min: 50,
      max: 2000,
      step: 50,
      unit: "원",
    },
    {
      label: "클릭→DB 전환율",
      value: convRate,
      set: setConvRate,
      min: 0.5,
      max: 30,
      step: 0.5,
      unit: "%",
    },
    {
      label: "일 예산",
      value: dailyBudget,
      set: setDailyBudget,
      min: 10000,
      max: 500000,
      step: 5000,
      unit: "원",
    },
  ];

  const results = [
    { label: "DB 1건당 예상 광고비", value: `${formatNum(costPerDb)}원` },
    { label: "실질 건당 수익 (CPA x 승인율)", value: `${formatNum(effectiveCpa)}원` },
    {
      label: "건당 순이익",
      value: `${formatNum(profitPerDb)}원`,
      color: profitPerDb >= 0 ? "text-green-600" : "text-red-600",
    },
    { label: "하루 예상 DB 수", value: `${formatDec(dailyDbs)}건` },
    { label: "하루 예상 수익", value: `${formatNum(dailyRevenue)}원` },
    {
      label: "하루 예상 순이익",
      value: `${formatNum(dailyProfit)}원`,
      color: dailyProfit >= 0 ? "text-green-600" : "text-red-600",
    },
    {
      label: "월간 예상 순이익 (21영업일)",
      value: `${formatNum(monthlyProfit)}원`,
      color: monthlyProfit >= 0 ? "text-green-600" : "text-red-600",
      bold: true,
    },
    {
      label: "BEP 전환율 (이상이면 흑자)",
      value: `${formatDec(bepConvRate, 2)}%`,
      color: convRate >= bepConvRate ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">수익 계산기</h2>

      <div className="space-y-4 mb-6">
        {sliders.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{s.label}</span>
              <span className="font-bold">
                {s.unit === "원"
                  ? `${s.value.toLocaleString()}${s.unit}`
                  : `${s.value}${s.unit}`}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>
                {s.unit === "원" ? s.min.toLocaleString() : s.min}
                {s.unit}
              </span>
              <span>
                {s.unit === "원" ? s.max.toLocaleString() : s.max}
                {s.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-sm text-gray-500 mb-3">계산 결과</h3>
        {results.map((r) => (
          <div
            key={r.label}
            className={`flex justify-between py-1 ${
              r.bold ? "border-t pt-2 mt-2" : ""
            }`}
          >
            <span className="text-sm text-gray-600">{r.label}</span>
            <span
              className={`text-sm font-bold ${r.color || "text-gray-900"} ${
                r.bold ? "text-base" : ""
              }`}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>

      {dailyProfit >= 0 ? (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center text-sm text-green-700 font-medium">
          이 조건이면 흑자! 월 {formatNum(monthlyProfit)}원 순이익 예상
        </div>
      ) : (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center text-sm text-red-700 font-medium">
          이 조건이면 적자. 전환율 {formatDec(bepConvRate, 2)}% 이상 필요
        </div>
      )}
    </div>
  );
}
