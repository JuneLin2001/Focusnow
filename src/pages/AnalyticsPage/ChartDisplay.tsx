import { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";

type FilterType = "daily" | "weekly" | "monthly";

interface ChartDisplayProps {
  chartData: ChartData<"bar">;
  filterType: FilterType;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  chartData,
  filterType,
}) => {
  // 確保 chartData 是有效的
  const hasData =
    chartData.labels &&
    chartData.labels.length > 0 &&
    chartData.datasets &&
    chartData.datasets.length > 0;

  return (
    <div className="mt-6">
      {hasData ? (
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
      ) : (
        <div>無數據可顯示</div>
      )}
    </div>
  );
};

export default ChartDisplay;
