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

  const data = {
    labels: ["完成的Pomodoro", "中斷的Pomodoro"],
    datasets: [
      {
        label: "數量",
        data: [completedCount, notCompletedCount],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  return (
    <div className="text-center h-full flex flex-col justify-between">
      <h2 className="text-lg font-semibold mb-2">
        完成率: {completionRate.toFixed(2)}%
      </h2>
      <div className="w-full max-w-md mx-auto flex-1">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default PomodoroPieChart;
