"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import type { DailyMetric } from "@/lib/storage";

interface Props {
  metrics: DailyMetric[];
}

export default function KarrotCharts({ metrics }: Props) {
  const sorted = [...metrics].sort((a, b) => a.date.localeCompare(b.date));

  const chartData = sorted.map((m) => {
    const day = parseInt(m.date.split("-")[2]);
    return {
      name: `${day}일`,
      adSpend: m.adSpend,
      revenue: m.revenue,
      profit: m.revenue - m.adSpend,
      dbCount: m.dbCount,
      approvedCount: m.approvedCount,
    };
  });

  let cumProfit = 0;
  const cumData = chartData.map((d) => {
    cumProfit += d.profit;
    return { ...d, cumProfit };
  });

  const formatKRW = (v: number) =>
    v >= 10000 ? `${(v / 10000).toFixed(1)}만` : `${v.toLocaleString()}`;

  const sectionStyle = {
    padding: "16px",
    borderRadius: "var(--radius-lg)",
    backgroundColor: "var(--color-bg-surface)",
    border: "1px solid var(--color-border-default)",
  };

  return (
    <div className="space-y-4">
      <div style={sectionStyle}>
        <h3 className="text-xs font-bold mb-3" style={{ color: "var(--color-text-tertiary)" }}>
          광고비 vs 수익금
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#A8A29E" }} />
            <YAxis tick={{ fontSize: 10, fill: "#A8A29E" }} tickFormatter={formatKRW} />
            <Tooltip formatter={(value: unknown, name: unknown) => [`${Number(value).toLocaleString()}원`, String(name) === "adSpend" ? "광고비" : "수익금"]} />
            <Legend formatter={(value) => (value === "adSpend" ? "광고비" : "수익금")} />
            <Line type="monotone" dataKey="adSpend" stroke="#DC2626" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={sectionStyle}>
        <h3 className="text-xs font-bold mb-3" style={{ color: "var(--color-text-tertiary)" }}>
          누적 순이익
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={cumData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#A8A29E" }} />
            <YAxis tick={{ fontSize: 10, fill: "#A8A29E" }} tickFormatter={formatKRW} />
            <Tooltip formatter={(value: unknown) => [`${Number(value).toLocaleString()}원`, "누적 순이익"]} />
            <ReferenceLine y={0} stroke="#78716C" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="cumProfit" stroke="#FF6F0F" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={sectionStyle}>
        <h3 className="text-xs font-bold mb-3" style={{ color: "var(--color-text-tertiary)" }}>
          DB 신청 / 승인
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#A8A29E" }} />
            <YAxis tick={{ fontSize: 10, fill: "#A8A29E" }} />
            <Tooltip formatter={(value: unknown, name: unknown) => [`${value}건`, String(name) === "dbCount" ? "DB 신청" : "승인"]} />
            <Legend formatter={(value) => (value === "dbCount" ? "DB 신청" : "승인")} />
            <Bar dataKey="dbCount" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            <Bar dataKey="approvedCount" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
