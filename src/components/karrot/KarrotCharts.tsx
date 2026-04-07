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

  // Cumulative profit
  let cumProfit = 0;
  const cumData = chartData.map((d) => {
    cumProfit += d.profit;
    return { ...d, cumProfit };
  });

  const formatKRW = (v: number) =>
    v >= 10000 ? `${(v / 10000).toFixed(1)}만` : `${v.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Chart 1: Ad Spend vs Revenue */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-2">
          일별 광고비 vs 수익금
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={formatKRW} />
            <Tooltip
              formatter={(value: unknown, name: unknown) => [
                `${Number(value).toLocaleString()}원`,
                String(name) === "adSpend" ? "광고비" : "수익금",
              ]}
            />
            <Legend
              formatter={(value) =>
                value === "adSpend" ? "광고비" : "수익금"
              }
            />
            <Line
              type="monotone"
              dataKey="adSpend"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Cumulative Profit */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-2">
          일별 누적 순이익
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={cumData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={formatKRW} />
            <Tooltip
              formatter={(value: unknown) => [
                `${Number(value).toLocaleString()}원`,
                "누적 순이익",
              ]}
            />
            <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="cumProfit"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 3: DB Count Bar Chart */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-2">
          일별 DB 신청 / 승인
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: unknown, name: unknown) => [
                `${value}건`,
                String(name) === "dbCount" ? "DB 신청" : "승인",
              ]}
            />
            <Legend
              formatter={(value) =>
                value === "dbCount" ? "DB 신청" : "승인"
              }
            />
            <Bar dataKey="dbCount" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            <Bar dataKey="approvedCount" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
