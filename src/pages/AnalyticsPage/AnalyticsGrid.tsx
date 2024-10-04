import { Bar } from "react-chartjs-2";
import { Box } from "@mui/material";
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
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid
        container
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 0,
          gridTemplateAreas: `
            "left-top right-full"
            "left-bottom right-full"
          `,
        }}
      >
        <Grid
          sx={{
            gridArea: "left-top",
            backgroundColor: "lightblue",
            height: "50vh",
          }}
        >
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

            <div className="mt-6">
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
          </div>
        </Grid>
        <Grid
          sx={{
            gridArea: "left-bottom",
            backgroundColor: "lightgreen",
            height: "50vh",
          }}
        >
          <PomodoroPieChart filteredAnalytics={filteredAnalytics} />
        </Grid>
        <Grid
          sx={{
            gridArea: "right-full",
            backgroundColor: "lightcoral",
            height: "100vh",
          }}
        >
          <CompletedTodos filteredAnalytics={filteredAnalytics} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsGrid;
