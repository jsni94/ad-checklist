"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getMetrics,
  getMetricsByMonth,
  saveMetric,
  type KarrotMerchant,
  type DailyMetric,
} from "@/lib/storage";
import dynamic from "next/dynamic";

const Charts = dynamic(() => import("./KarrotCharts"), { ssr: false });

interface Props {
  merchant: KarrotMerchant;
  onEdit: (m: KarrotMerchant) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  active: { label: "운영중", bg: "var(--color-profit-bg)", color: "var(--color-profit)", border: "var(--color-profit-border)" },
  paused: { label: "일시정지", bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  ended: { label: "종료", bg: "var(--color-breakeven-bg)", color: "var(--color-breakeven)", border: "var(--color-border-default)" },
};

export default function MerchantCard({ merchant, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showMetricModal, setShowMetricModal] = useState<string | null>(null);
  const [metricForm, setMetricForm] = useState<Partial<DailyMetric>>({});

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);

  useEffect(() => {
    if (expanded) {
      setMetrics(getMetricsByMonth(merchant.id, year, month));
    }
  }, [expanded, merchant.id, year, month]);

  // All-time metrics for summary
  const allMetrics = useMemo(() => {
    if (!expanded) return [];
    return getMetrics(merchant.id);
  }, [expanded, merchant.id]);

  const summary = useMemo(() => {
    const totalSpend = metrics.reduce((s, m) => s + m.adSpend, 0);
    const totalRevenue = metrics.reduce((s, m) => s + m.revenue, 0);
    const profit = totalRevenue - totalSpend;
    const roas = totalSpend > 0 ? (totalRevenue / totalSpend) * 100 : 0;
    const totalDb = metrics.reduce((s, m) => s + m.dbCount, 0);
    return { totalSpend, totalRevenue, profit, roas, totalDb };
  }, [metrics]);

  // Calendar
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const calDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calDays.push(i);

  const metricsMap = useMemo(() => {
    const m: Record<string, DailyMetric> = {};
    metrics.forEach((d) => (m[d.date] = d));
    return m;
  }, [metrics]);

  const prevMonth = () => { if (month === 1) { setYear(year - 1); setMonth(12); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 12) { setYear(year + 1); setMonth(1); } else setMonth(month + 1); };

  const openMetricEdit = (day: number) => {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const existing = metricsMap[date];
    setMetricForm(existing || { date, campaignId: merchant.id, adSpend: 0, dbCount: 0, approvedCount: 0, revenue: 0 });
    setShowMetricModal(date);
  };

  const saveMetricForm = () => {
    if (!showMetricModal) return;
    const m: DailyMetric = {
      date: showMetricModal,
      campaignId: merchant.id,
      adSpend: metricForm.adSpend || 0,
      dbCount: metricForm.dbCount || 0,
      approvedCount: metricForm.approvedCount || 0,
      revenue: metricForm.revenue || 0,
      clicks: metricForm.clicks,
      ctr: metricForm.ctr,
      cpc: metricForm.cpc,
    };
    saveMetric(m);
    setMetrics(getMetricsByMonth(merchant.id, year, month));
    setShowMetricModal(null);
  };

  const st = statusConfig[merchant.status];

  return (
    <>
    <div className="card card-interactive overflow-hidden">
      {/* Card Header */}
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-full)]" style={{ backgroundColor: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                {st.label}
              </span>
              <span className="text-[11px] font-medium" style={{ color: "var(--color-text-tertiary)" }}>{merchant.cpaPlat}</span>
            </div>
            <h3 className="font-bold text-base" style={{ color: "var(--color-text-primary)" }}>{merchant.merchantName}</h3>
            <div className="flex items-center gap-4 mt-1.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              <span>건당 <strong className="font-bold" style={{ color: "var(--color-karrot)", fontFamily: "var(--font-mono)" }}>{merchant.cpaAmount.toLocaleString()}원</strong></span>
              <span>{merchant.approvalType === "confirmed" ? "확정형" : "승인형"}</span>
              <span>{merchant.medium}</span>
            </div>
          </div>
          <svg className={`w-5 h-5 transition-transform ${expanded ? "rotate-180" : ""}`} style={{ color: "var(--color-text-tertiary)", transitionDuration: "var(--duration-normal)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--color-border-default)" }}>
          {/* Action buttons */}
          <div className="flex gap-2 py-3">
            <button onClick={() => onEdit(merchant)} className="text-xs font-medium px-3 py-1.5 rounded-[var(--radius-md)] transition-all" style={{ border: "1px solid var(--color-border-default)", color: "var(--color-text-secondary)" }}>
              수정
            </button>
            <button onClick={() => onDelete(merchant.id)} className="text-xs font-medium px-3 py-1.5 rounded-[var(--radius-md)] transition-all" style={{ border: "1px solid var(--color-loss-border)", color: "var(--color-loss)" }}>
              삭제
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "광고비", value: `${summary.totalSpend.toLocaleString()}원`, color: "var(--color-text-primary)" },
              { label: "수익", value: `${summary.totalRevenue.toLocaleString()}원`, color: "var(--color-karrot)" },
              { label: "순이익", value: `${summary.profit.toLocaleString()}원`, color: summary.profit >= 0 ? "var(--color-profit)" : "var(--color-loss)" },
              { label: "DB", value: `${summary.totalDb}건`, color: "var(--color-text-primary)" },
            ].map((c) => (
              <div key={c.label} className="p-2.5 rounded-[var(--radius-lg)] text-center" style={{ backgroundColor: "var(--color-bg-base)" }}>
                <p className="text-[10px] font-medium" style={{ color: "var(--color-text-tertiary)" }}>{c.label}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: c.color, fontFamily: "var(--font-mono)" }}>{c.value}</p>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <button onClick={prevMonth} className="p-1 rounded-[var(--radius-md)] hover:opacity-70">
              <svg className="w-4 h-4" style={{ color: "var(--color-text-tertiary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{year}년 {month}월</span>
            <button onClick={nextMonth} className="p-1 rounded-[var(--radius-md)] hover:opacity-70">
              <svg className="w-4 h-4" style={{ color: "var(--color-text-tertiary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-medium mb-1" style={{ color: "var(--color-text-tertiary)" }}>
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => <div key={d} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {calDays.map((day, i) => {
              if (day === null) return <div key={`e${i}`} />;
              const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const m = metricsMap[date];
              const profitable = m && m.revenue > m.adSpend;
              const losing = m && m.revenue < m.adSpend && m.adSpend > 0;
              return (
                <button
                  key={day}
                  onClick={() => openMetricEdit(day)}
                  className="p-1 min-h-[40px] rounded-[var(--radius-md)] text-[11px] flex flex-col items-center transition-all"
                  style={{
                    backgroundColor: m ? (profitable ? "var(--color-profit-bg)" : losing ? "var(--color-loss-bg)" : "var(--color-bg-base)") : "var(--color-bg-surface)",
                    border: `1px solid ${m ? (profitable ? "var(--color-profit-border)" : losing ? "var(--color-loss-border)" : "var(--color-border-default)") : "var(--color-border-default)"}`,
                  }}
                >
                  <span className="font-medium" style={{ color: "var(--color-text-secondary)" }}>{day}</span>
                  {m && m.dbCount > 0 && (
                    <span className="font-bold" style={{ color: profitable ? "var(--color-profit)" : losing ? "var(--color-loss)" : "var(--color-text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "9px" }}>
                      {m.dbCount}건
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Charts */}
          {metrics.length > 0 && <Charts metrics={metrics} />}
        </div>
      )}
    </div>

    {/* Metric Input Modal — 카드 밖에 렌더링 (hover 충돌 방지) */}
    {showMetricModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "var(--color-bg-overlay)" }}>
        <div className="w-full max-w-sm rounded-[var(--radius-2xl)] p-5" style={{ backgroundColor: "var(--color-bg-surface)", boxShadow: "var(--shadow-modal)" }}>
          <h3 className="font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>{showMetricModal}</h3>
          <div className="space-y-3">
            {[
              { key: "adSpend", label: "광고비 (원)" },
              { key: "dbCount", label: "DB 신청 수" },
              { key: "approvedCount", label: "승인 수" },
              { key: "revenue", label: "수익금 (원)" },
              { key: "clicks", label: "클릭수" },
            ].map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <label className="text-xs font-medium w-24 flex-shrink-0" style={{ color: "var(--color-text-secondary)" }}>{f.label}</label>
                <input
                  type="number"
                  className="flex-1 rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus-ring"
                  style={{ border: "1px solid var(--color-border-default)", fontFamily: "var(--font-mono)" }}
                  value={(metricForm as Record<string, number | undefined>)[f.key] ?? ""}
                  onChange={(e) => setMetricForm({ ...metricForm, [f.key]: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setShowMetricModal(null)} className="flex-1 py-2.5 rounded-[var(--radius-lg)] text-sm font-semibold" style={{ border: "1px solid var(--color-border-default)", color: "var(--color-text-secondary)" }}>취소</button>
            <button onClick={saveMetricForm} className="flex-1 py-2.5 rounded-[var(--radius-lg)] text-sm font-semibold" style={{ backgroundColor: "var(--color-karrot)", color: "var(--color-text-on-orange)" }}>저장</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
