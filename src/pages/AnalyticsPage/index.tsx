import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { UserAnalytics } from "../../types/type";
import dayjs from "dayjs";
import DateSelector from "./DateSelector";
import CompletedTodos from "./CompletedTodos";
import { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";

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
  const {
    filteredAnalytics,
    setAnalyticsList,
    setFilteredAnalytics,
    setLast30DaysFocusDuration,
    last30DaysFocusDuration,
  } = useAnalyticsStore();

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
          duration: mergedData[dateKey] || 0, // 若無資料則為 0
        });
        current = current.add(1, filterType === "daily" ? "hour" : "day");
      }

      return allDates;
    },
    [filterType]
  );

  useEffect(() => {
    if (user) {
      const fetchAnalytics = async () => {
        try {
          const analyticsCollectionRef = collection(
            db,
            "users",
            user.uid,
            "analytics"
          );
          const analyticsSnapshot = await getDocs(analyticsCollectionRef);

          if (!analyticsSnapshot.empty) {
            const data = analyticsSnapshot.docs.map((doc) =>
              doc.data()
            ) as UserAnalytics[];

            const sortedAnalytics = data.sort((a, b) =>
              a.startTime.seconds < b.startTime.seconds ? 1 : -1
            );

            setAnalyticsList(sortedAnalytics);
            setLast30DaysFocusDuration();

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
            const chartFocusDurations = mergedResults.map(
              (item) => item.duration
            );

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
          }
        } catch (error) {
          console.error("Error fetching user analytics", error);
        }
      };

      fetchAnalytics();
    }
  }, [
    user,
    calculateDateRange,
    setAnalyticsList,
    setFilteredAnalytics,
    setLast30DaysFocusDuration,
    mergeData,
  ]);

  if (!user) {
    return <div className="p-96">Please login to see analytics.</div>;
  }

  return (
    <div className="w-full h-full bg-gray-100 p-4 pt-24">
      <h2 className="text-xl font-semibold">
        Total Focus Duration: {totalFocusDuration} minutes
      </h2>
      <h2 className="text-xl font-semibold">
        Last 30 Days Total Focus Duration: {last30DaysFocusDuration} minutes
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

      <CompletedTodos filteredAnalytics={filteredAnalytics} />
    </div>
  );
};

export default AnalyticsPage;
