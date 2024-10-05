// src/components/ChartDisplay.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartData } from "chart.js";

interface ChartDisplayProps {
  chartData: ChartData<"bar">;
  filterType: "daily" | "weekly" | "monthly";
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  chartData,
  filterType,
}) => {
  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: `專注時長（${filterType === "daily" ? "每日" : filterType === "weekly" ? "每週" : "每月"}）`,
          },
        },
      }}
    />
  );
};

export default ChartDisplay;
