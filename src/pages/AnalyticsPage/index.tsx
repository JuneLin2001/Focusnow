import { useState, useCallback } from "react";
import dayjs from "dayjs";
import { ChartData } from "chart.js";
import { UserAnalytics } from "../../types/type";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import AnalyticsFetcher from "../../utils/AnalyticsFetcher";
import AnalyticsGrid from "./AnalyticsGrid";

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

  const handleDataFetched = useCallback(
    (sortedAnalytics: UserAnalytics[]) => {
      const { start, end } = calculateDateRange();

      // 過濾資料以取得 pomodoroCompleted 為 true 的資料
      const filteredCompletedData = sortedAnalytics.filter((analytics) => {
        const analyticsDate = dayjs.unix(analytics.startTime.seconds);
        return (
          analytics.pomodoroCompleted && // 只計算 pomodoroCompleted 為 true 的資料
          (analyticsDate.isSame(start, "day") ||
            analyticsDate.isSame(end, "day") ||
            (analyticsDate.isAfter(start) && analyticsDate.isBefore(end)))
        );
      });

      // 過濾資料以取得所有的資料 (pomodoroCompleted 為 true 和 false)
      const filteredAllData = sortedAnalytics.filter((analytics) => {
        const analyticsDate = dayjs.unix(analytics.startTime.seconds);
        return (
          analyticsDate.isSame(start, "day") ||
          analyticsDate.isSame(end, "day") ||
          (analyticsDate.isAfter(start) && analyticsDate.isBefore(end))
        );
      });

      setFilteredAnalytics(filteredAllData); // 設置過濾後的分析資料

      // 計算完成的資料
      const mergedResults = mergeData(filteredCompletedData, start, end);
      const chartLabels = mergedResults.map((item) => item.date);
      const chartFocusDurations = mergedResults.map((item) => item.duration);

      // 計算總專注時長
      setTotalFocusDuration(
        mergedResults.reduce((acc, item) => acc + item.duration, 0)
      );

      // 設置條形圖資料
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

      setFilteredAnalytics(filteredAllData);
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
    <>
      <AnalyticsGrid
        filterType={filterType}
        setFilterType={setFilterType}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        totalFocusDuration={totalFocusDuration}
        chartData={chartData}
        filteredAnalytics={filteredAnalytics}
      />
      <AnalyticsFetcher onDataFetched={handleDataFetched} />
    </>
  );
};

export default AnalyticsPage;
