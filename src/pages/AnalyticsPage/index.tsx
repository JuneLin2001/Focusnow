import { useState, useCallback } from "react";
import dayjs from "dayjs";
import { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import { UserAnalytics } from "../../types/type";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import DateSelector from "./DateSelector";
import CompletedTodos from "./CompletedTodos";
import AnalyticsFetcher from "../../utils/AnalyticsFetcher";

import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const { user } = useAuthStore();
  const { filteredAnalytics, setFilteredAnalytics } = useAnalyticsStore();

  const [filterType, setFilterType] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [totalFocusDuration, setTotalFocusDuration] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });

  const calculateDateRange = useCallback(() => {
    let start = dayjs();
    let end = dayjs();

    if (filterType === "daily") {
      start = currentDate.startOf("day");
      end = currentDate.endOf("day");
    } else if (filterType === "weekly") {
      start = currentDate.startOf("week");
      end = currentDate.endOf("week");
    } else if (filterType === "monthly") {
      start = currentDate.startOf("month");
      end = currentDate.endOf("month");
    }

    return { start, end };
  }, [filterType, currentDate]);

  const mergeData = useCallback(
    (filteredData: UserAnalytics[], start: dayjs.Dayjs, end: dayjs.Dayjs) => {
      const mergedData: { [key: string]: number } = {};

      filteredData.forEach((analytics) => {
        const dateKey = dayjs.unix(analytics.startTime.seconds);
        const formattedKey =
          filterType === "daily"
            ? dateKey.startOf("hour").format("HH:mm")
            : filterType === "weekly"
              ? dateKey.format("MM-DD")
              : dateKey.format("MM-DD");

        if (!mergedData[formattedKey]) {
          mergedData[formattedKey] = 0;
        }
        mergedData[formattedKey] += analytics.focusDuration;
      });

      const allDates = [];
      let current = start.clone();
      while (current.isBefore(end) || current.isSame(end)) {
        const dateKey =
          filterType === "daily"
            ? current.startOf("hour").format("HH:mm")
            : filterType === "weekly"
              ? current.format("MM-DD")
              : current.format("MM-DD");

        allDates.push({
          date: dateKey,
          duration: mergedData[dateKey] || 0,
        });
        current = current.add(1, filterType === "daily" ? "hour" : "day");
      }

      return allDates;
    },
    [filterType]
  );

  // 處理從 AnalyticsFetcher 獲取的數據
  const handleDataFetched = useCallback(
    (sortedAnalytics: UserAnalytics[]) => {
      const { start, end } = calculateDateRange();
      const filteredData = sortedAnalytics.filter((analytics) => {
        const analyticsDate = dayjs.unix(analytics.startTime.seconds);
        return (
          analyticsDate.isSame(start, "day") ||
          analyticsDate.isSame(end, "day") ||
          (analyticsDate.isAfter(start) && analyticsDate.isBefore(end))
        );
      });

      setFilteredAnalytics(filteredData);

      const mergedResults = mergeData(filteredData, start, end);
      const chartLabels = mergedResults.map((item) => item.date);
      const chartFocusDurations = mergedResults.map((item) => item.duration);

      setTotalFocusDuration(
        mergedResults.reduce((acc, item) => acc + item.duration, 0)
      );

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: "專注時長（分鐘）",
            data: chartFocusDurations,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    },
    [calculateDateRange, mergeData, setFilteredAnalytics]
  );

  if (!user) {
    return (
      <div className="w-full h-full flex jus">
        <p className="p-96">Please login to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="flex pt-24">
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

        <div className="mt-6 w-[50vw]">
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
      <div className="ml-4 ">
        <CompletedTodos filteredAnalytics={filteredAnalytics} />
      </div>
      <AnalyticsFetcher onDataFetched={handleDataFetched} />
    </div>
  );
};

export default AnalyticsPage;
