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
  const completedCount = filteredAnalytics.filter(
    (analytics) => analytics.pomodoroCompleted
  ).length;
  const notCompletedCount = filteredAnalytics.length - completedCount;

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
    <>
      <Pie data={data} />
    </>
  );
};

export default PomodoroPieChart;
