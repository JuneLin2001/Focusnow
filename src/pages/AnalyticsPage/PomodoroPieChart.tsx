// PomodoroPieChart.tsx
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
  // 計算完成的和未完成的 Pomodoros 數量
  const completedCount = filteredAnalytics.filter(
    (analytics) => analytics.pomodoroCompleted
  ).length;
  const totalCount = filteredAnalytics.length;

  const notCompletedCount = totalCount - completedCount;

  const completionRate =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const data = {
    labels: ["完成的 Pomodoros", "未完成的 Pomodoros"],
    datasets: [
      {
        label: "Pomodoro 完成狀況",
        data: [completedCount, notCompletedCount],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold mb-2">Pomodoro 完成狀況</h2>
      <p className="text-md mb-2">完成率: {completionRate.toFixed(2)}%</p>
      <Pie data={data} />
    </div>
  );
};

export default PomodoroPieChart;
