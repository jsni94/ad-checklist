"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getMetricsByMonth,
  saveMetric,
  type DailyMetric,
} from "@/lib/storage";
import dynamic from "next/dynamic";

const Charts = dynamic(() => import("./KarrotCharts"), { ssr: false });

interface Props {
  campaignId: string;
}

function formatKRW(n: number) {
  return n.toLocaleString() + "원";
}

export default function KarrotDashboard({ campaignId }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);
  const [editDate, setEditDate] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DailyMetric>>({});

  useEffect(() => {
    setMetrics(getMetricsByMonth(campaignId, year, month));
  }, [campaignId, year, month]);

  const metricsMap = useMemo(() => {
    const map: Record<string, DailyMetric> = {};
    metrics.forEach((m) => (map[m.date] = m));
    return map;
  }, [metrics]);

  // Monthly summary
  const summary = useMemo(() => {
    const totalSpend = metrics.reduce((s, m) => s + m.adSpend, 0);
    const totalRevenue = metrics.reduce((s, m) => s + m.revenue, 0);
    const profit = totalRevenue - totalSpend;
    const roas = totalSpend > 0 ? (totalRevenue / totalSpend) * 100 : 0;
    return { totalSpend, totalRevenue, profit, roas };
  }, [metrics]);

  // Calendar helpers
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const prevMonth = () => {
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(year + 1); setMonth(1); }
    else setMonth(month + 1);
  };

  const openEdit = (day: number) => {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const existing = metricsMap[date];
    setEditDate(date);
    setForm(
      existing || {
        date,
        campaignId,
        adSpend: 0,
        dbCount: 0,
        approvedCount: 0,
        revenue: 0,
        clicks: undefined,
        ctr: undefined,
        cpc: undefined,
      }
    );
  };

  const handleSave = () => {
    if (!editDate) return;
    const metric: DailyMetric = {
      date: editDate,
      campaignId,
      adSpend: form.adSpend || 0,
      dbCount: form.dbCount || 0,
      approvedCount: form.approvedCount || 0,
      revenue: form.revenue || 0,
      clicks: form.clicks,
      ctr: form.ctr,
      cpc: form.cpc,
    };
    saveMetric(metric);
    setMetrics(getMetricsByMonth(campaignId, year, month));
    setEditDate(null);
  };

  const summaryCards = [
    { label: "총 광고비", value: formatKRW(summary.totalSpend), color: "text-gray-900" },
    { label: "총 수익", value: formatKRW(summary.totalRevenue), color: "text-blue-600" },
    {
      label: "순이익",
      value: formatKRW(summary.profit),
      color: summary.profit >= 0 ? "text-green-600" : "text-red-600",
    },
    {
      label: "ROAS",
      value: summary.roas > 0 ? `${summary.roas.toFixed(0)}%` : "-",
      color: summary.roas >= 100 ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="bg-white border rounded-xl p-3">
            <p className="text-xs text-gray-400">{c.label}</p>
            <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold">
          {year}년 {month}월
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 text-center text-xs mb-1">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="py-1 text-gray-400 font-medium">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const m = metricsMap[date];
          const hasData = !!m;
          const profitable = m && m.revenue > m.adSpend;
          const losing = m && m.revenue < m.adSpend && m.adSpend > 0;

          return (
            <button
              key={day}
              onClick={() => openEdit(day)}
              className={`p-1 rounded-lg text-xs min-h-[52px] flex flex-col items-center border transition-colors ${
                hasData
                  ? profitable
                    ? "bg-green-50 border-green-200 hover:bg-green-100"
                    : losing
                    ? "bg-red-50 border-red-200 hover:bg-red-100"
                    : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                  : "bg-white border-gray-100 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium text-gray-700">{day}</span>
              {m && (
                <span
                  className={`text-[10px] mt-0.5 font-medium ${
                    profitable ? "text-green-600" : losing ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {m.dbCount > 0 ? `${m.dbCount}건` : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Charts */}
      {metrics.length > 0 && <Charts metrics={metrics} />}

      {/* Edit Modal */}
      {editDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5">
            <h3 className="font-bold mb-3">{editDate} 데이터 입력</h3>
            <div className="space-y-2">
              {[
                { key: "adSpend", label: "광고비 소진 (원)", type: "number" },
                { key: "dbCount", label: "DB 신청 수", type: "number" },
                { key: "approvedCount", label: "승인 수", type: "number" },
                { key: "revenue", label: "수익금 (원)", type: "number" },
                { key: "clicks", label: "클릭수 (선택)", type: "number" },
                { key: "ctr", label: "CTR % (선택)", type: "number" },
                { key: "cpc", label: "CPC 원 (선택)", type: "number" },
              ].map((f) => (
                <div key={f.key} className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 w-28 flex-shrink-0">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    value={
                      (form as Record<string, number | undefined>)[f.key] ?? ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [f.key]: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditDate(null)}
                className="flex-1 py-2 border rounded-lg text-sm"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
