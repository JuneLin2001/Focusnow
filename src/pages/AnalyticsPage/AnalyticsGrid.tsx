import { Bar } from "react-chartjs-2";
import Grid from "@mui/material/Grid2";
import DateSelector from "./DateSelector";
import PomodoroPieChart from "./PomodoroPieChart";
import CompletedTodos from "./CompletedTodos";
import { UserAnalytics } from "../../types/type";
import dayjs from "dayjs";
import {
  ChartData,
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalyticsGridProps {
  filterType: "daily" | "weekly" | "monthly";
  setFilterType: React.Dispatch<
    React.SetStateAction<"daily" | "weekly" | "monthly">
  >;
  currentDate: dayjs.Dayjs;
  setCurrentDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  totalFocusDuration: number;
  chartData: ChartData<"bar">;
  filteredAnalytics: UserAnalytics[];
}

const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({
  filterType,
  setFilterType,
  currentDate,
  setCurrentDate,
  totalFocusDuration,
  chartData,
  filteredAnalytics,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <div className="bg-gray-100 p-4">
          <h2 className="text-xl font-semibold">
            Total Focus Duration: {totalFocusDuration} minutes
          </h2>

          <DateSelector
            filterType={filterType}
            setFilterType={setFilterType}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
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
        </div>
      </Grid>
      <Grid size={6}>
        <PomodoroPieChart filteredAnalytics={filteredAnalytics} />
      </Grid>
      <Grid size={6}>
        <CompletedTodos filteredAnalytics={filteredAnalytics} />
      </Grid>
    </Grid>
  );
};

export default AnalyticsGrid;
