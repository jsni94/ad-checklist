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

  // Mini summary for collapsed state
  const collapsedSummary = useMemo(() => {
    const allM = getMetrics(merchant.id);
    const totalSpend = allM.reduce((s, m) => s + m.adSpend, 0);
    const totalRevenue = allM.reduce((s, m) => s + m.revenue, 0);
    const profit = totalRevenue - totalSpend;
    return { profit, hasData: allM.length > 0 };
  }, [merchant.id]);

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
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-[var(--radius-full)]"
                style={{
                  backgroundColor: st.bg,
                  color: st.color,
                  border: `1px solid ${st.border}`,
                }}
              >
                {st.label}
              </span>
              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {merchant.cpaPlat}
              </span>
            </div>
            <h3
              className="font-bold text-base"
              style={{ color: "var(--color-text-primary)" }}
            >
              {merchant.merchantName}
            </h3>
            <div
              className="flex items-center gap-4 mt-1.5 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <span>
                건당{" "}
                <strong
                  className="font-bold font-[family-name:var(--font-mono)] tabular-nums"
                  style={{ color: "var(--color-karrot)" }}
                >
                  {merchant.cpaAmount.toLocaleString()}원
                </strong>
              </span>
              <span>{merchant.approvalType === "confirmed" ? "확정형" : "승인형"}</span>
              <span>{merchant.medium}</span>
            </div>
          </div>

          {/* Right side: mini profit + chevron */}
          <div className="flex items-center gap-3 shrink-0">
            {!expanded && collapsedSummary.hasData && (
              <span
                className="text-xs font-bold font-[family-name:var(--font-mono)] tabular-nums px-2 py-1 rounded-[var(--radius-md)]"
                style={{
                  color: collapsedSummary.profit >= 0 ? "var(--color-profit)" : "var(--color-loss)",
                  backgroundColor: collapsedSummary.profit >= 0 ? "var(--color-profit-bg)" : "var(--color-loss-bg)",
                }}
              >
                {collapsedSummary.profit >= 0 ? "+" : ""}{collapsedSummary.profit.toLocaleString()}원
              </span>
            )}
            <svg
              className="w-5 h-5 transition-transform"
              style={{
                color: "var(--color-text-tertiary)",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transitionDuration: "var(--duration-normal)",
                transitionTimingFunction: "var(--ease-out-expo)",
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div
          className="px-4 pb-4 animate-slide-down"
          style={{ borderTop: "1px solid var(--color-border-default)" }}
        >
          {/* Action buttons */}
          <div className="flex gap-2 py-3">
            <button
              onClick={() => onEdit(merchant)}
              className="text-xs font-semibold px-3.5 py-2 rounded-[var(--radius-md)] transition-all"
              style={{
                border: "1px solid var(--color-border-default)",
                color: "var(--color-text-secondary)",
                backgroundColor: "var(--color-bg-surface)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-karrot-light)";
                e.currentTarget.style.color = "var(--color-karrot)";
                e.currentTarget.style.backgroundColor = "var(--color-karrot-subtle)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-default)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
                e.currentTarget.style.backgroundColor = "var(--color-bg-surface)";
              }}
            >
              수정
            </button>
            <button
              onClick={() => onDelete(merchant.id)}
              className="text-xs font-semibold px-3.5 py-2 rounded-[var(--radius-md)] transition-all"
              style={{
                border: "1px solid var(--color-border-default)",
                color: "var(--color-text-secondary)",
                backgroundColor: "var(--color-bg-surface)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-loss-border)";
                e.currentTarget.style.color = "var(--color-loss)";
                e.currentTarget.style.backgroundColor = "var(--color-loss-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-default)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
                e.currentTarget.style.backgroundColor = "var(--color-bg-surface)";
              }}
            >
              삭제
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "광고비", value: `${summary.totalSpend.toLocaleString()}원`, color: "var(--color-text-primary)" },
              { label: "수익", value: `${summary.totalRevenue.toLocaleString()}원`, color: "var(--color-karrot)" },
              { label: "순이익", value: `${summary.profit >= 0 ? "+" : ""}${summary.profit.toLocaleString()}원`, color: summary.profit >= 0 ? "var(--color-profit)" : "var(--color-loss)" },
              { label: "DB", value: `${summary.totalDb}건`, color: "var(--color-text-primary)" },
            ].map((c) => (
              <div
                key={c.label}
                className="p-3 rounded-[var(--radius-lg)] text-center"
                style={{
                  backgroundColor: "var(--color-bg-base)",
                  border: "1px solid var(--color-border-default)",
                }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {c.label}
                </p>
                <p
                  className="text-sm font-bold mt-1 font-[family-name:var(--font-mono)] tabular-nums"
                  style={{ color: c.color }}
                >
                  {c.value}
                </p>
              </div>
            ))}
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-[var(--radius-md)] transition-all"
              style={{ color: "var(--color-text-tertiary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-bg-base)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-text-tertiary)";
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span
              className="text-sm font-bold font-[family-name:var(--font-mono)] tabular-nums"
              style={{ color: "var(--color-text-primary)" }}
            >
              {year}년 {month}월
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-[var(--radius-md)] transition-all"
              style={{ color: "var(--color-text-tertiary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-bg-base)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-text-tertiary)";
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Calendar Weekday Headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-semibold mb-1.5">
            {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
              <div
                key={d}
                className="py-1"
                style={{ color: i === 0 ? "var(--color-loss)" : i === 6 ? "var(--color-platform-facebook-text)" : "var(--color-text-tertiary)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {calDays.map((day, i) => {
              if (day === null) return <div key={`e${i}`} />;
              const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const m = metricsMap[date];
              const profitable = m && m.revenue > m.adSpend;
              const losing = m && m.revenue < m.adSpend && m.adSpend > 0;

              const cellBg = m
                ? profitable
                  ? "var(--color-profit-bg)"
                  : losing
                  ? "var(--color-loss-bg)"
                  : "var(--color-bg-base)"
                : "var(--color-bg-surface)";

              const cellBorder = m
                ? profitable
                  ? "var(--color-profit-border)"
                  : losing
                  ? "var(--color-loss-border)"
                  : "var(--color-border-default)"
                : "var(--color-border-default)";

              return (
                <button
                  key={day}
                  onClick={() => openMetricEdit(day)}
                  className="p-1 min-h-[42px] rounded-[var(--radius-md)] text-[11px] flex flex-col items-center justify-center gap-0.5 transition-all"
                  style={{
                    backgroundColor: cellBg,
                    border: `1px solid ${cellBorder}`,
                    transitionDuration: "var(--duration-fast)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {day}
                  </span>
                  {m && m.dbCount > 0 && (
                    <span
                      className="font-bold font-[family-name:var(--font-mono)] tabular-nums"
                      style={{
                        color: profitable ? "var(--color-profit)" : losing ? "var(--color-loss)" : "var(--color-text-tertiary)",
                        fontSize: "9px",
                      }}
                    >
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

    {/* Metric Input Modal */}
    {showMetricModal && (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in"
        style={{ backgroundColor: "var(--color-bg-overlay)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowMetricModal(null);
        }}
      >
        <div
          className="w-full max-w-sm rounded-[var(--radius-2xl)] p-5 animate-sheet-up sm:animate-slide-down"
          style={{
            backgroundColor: "var(--color-bg-surface)",
            boxShadow: "var(--shadow-modal)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold font-[family-name:var(--font-mono)] tabular-nums"
              style={{ color: "var(--color-text-primary)" }}
            >
              {showMetricModal}
            </h3>
            <button
              onClick={() => setShowMetricModal(null)}
              className="p-1 rounded-[var(--radius-sm)] transition-all"
              style={{ color: "var(--color-text-tertiary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-bg-base)";
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-text-tertiary)";
              }}
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            {[
              { key: "adSpend", label: "광고비 (원)" },
              { key: "dbCount", label: "DB 신청 수" },
              { key: "approvedCount", label: "승인 수" },
              { key: "revenue", label: "수익금 (원)" },
              { key: "clicks", label: "클릭수" },
            ].map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <label
                  className="text-xs font-semibold w-24 flex-shrink-0"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {f.label}
                </label>
                <input
                  type="number"
                  className="flex-1 rounded-[var(--radius-md)] px-3 py-2.5 text-sm focus:outline-none transition-all"
                  style={{
                    border: "1px solid var(--color-border-default)",
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-primary)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border-focus)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255, 111, 15, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border-default)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  value={(metricForm as Record<string, number | undefined>)[f.key] ?? ""}
                  onChange={(e) => setMetricForm({ ...metricForm, [f.key]: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setShowMetricModal(null)}
              className="flex-1 py-2.5 rounded-[var(--radius-lg)] text-sm font-semibold transition-all"
              style={{
                border: "1px solid var(--color-border-default)",
                color: "var(--color-text-secondary)",
                backgroundColor: "var(--color-bg-surface)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-bg-base)";
                e.currentTarget.style.borderColor = "var(--color-border-strong)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-bg-surface)";
                e.currentTarget.style.borderColor = "var(--color-border-default)";
              }}
            >
              취소
            </button>
            <button
              onClick={saveMetricForm}
              className="flex-1 py-2.5 rounded-[var(--radius-lg)] text-sm font-semibold transition-all"
              style={{
                backgroundColor: "var(--color-karrot)",
                color: "var(--color-text-on-orange)",
                boxShadow: "var(--shadow-karrot)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-karrot-dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-karrot)";
              }}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
