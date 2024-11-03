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
    (analytics) => analytics.pomodoroCompleted,
  ).length;

  const totalCount = filteredAnalytics.length;

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
        data: [completedCount, totalCount - completedCount],
        backgroundColor: isDarkMode
          ? ["#4bc0c088", "#ff638588"]
          : ["#4bc0c088", "#ff638588"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "white" : "black",
        },
        onClick: () => {},
      },
    },
  };

  const hasData = totalCount > 0;

  return (
    <div className="flex h-full flex-col justify-between text-center">
      {hasData && (
        <h2 className="mb-2 text-lg font-semibold">
          完成率: {completionRate.toFixed(2)}%
        </h2>
      )}
      <div className="flex size-full flex-1 items-center justify-center">
        {hasData ? (
          <Pie data={data} options={options} />
        ) : (
          <p className="text-gray-500 dark:text-gray-200">沒有資料</p>
        )}
      </div>
    </div>
  );
};

export default PomodoroPieChart;
