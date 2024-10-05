// src/components/ChartDisplay.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartDisplayProps {
  chartData: { date: string; duration: number }[]; // 更新數據結構
  filterType: "daily" | "weekly" | "monthly";
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  chartData,
  filterType,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="duration" fill="#82ca9d" />
        <text
          x={300}
          y={20}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-semibold"
        >
          專注時長（
          {filterType === "daily"
            ? "每日"
            : filterType === "weekly"
              ? "每週"
              : "每月"}
          ）
        </text>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartDisplay;
