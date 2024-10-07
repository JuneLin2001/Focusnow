import React, { useEffect, useState } from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { UserAnalytics } from "../../types/type";

Chart.register(ArcElement, Tooltip, Legend);

interface PomodoroPieChartProps {
  filteredAnalytics: UserAnalytics[];
}

const PomodoroPieChart: React.FC<PomodoroPieChartProps> = ({
  filteredAnalytics,
}) => {
  const completedCount = filteredAnalytics.filter(
    (analytics) => analytics.pomodoroCompleted
  ).length;
  const totalCount = filteredAnalytics.length;

  const notCompletedCount = totalCount - completedCount;

  const completionRate =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const data = {
    labels: ["完成的專注", "中斷的專注"],
    datasets: [
      {
        label: "數量",
        data: [completedCount, notCompletedCount],
        backgroundColor: isDarkMode
          ? ["#1a7f7f4e", "#992b454e"]
          : ["#4BC0C0", "#FF6384"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "white" : "black", // 根據模式改變字體顏色
        },
      },
      tooltip: {
        // 你也可以這裡設定 tooltip 的字體顏色
        titleColor: isDarkMode ? "white" : "black",
        bodyColor: isDarkMode ? "white" : "black",
      },
    },
  };

  return (
    <div className="text-center h-full flex flex-col justify-between">
      <h2 className="text-lg font-semibold mb-2">
        完成率: {completionRate.toFixed(2)}%
      </h2>
      <div className="w-full h-full flex-1 flex justify-center items-center">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PomodoroPieChart;
