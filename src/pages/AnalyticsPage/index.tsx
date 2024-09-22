import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { UserAnalytics } from "../../types/type";
import dayjs from "dayjs";
import ChartDisplay from "./ChartDisplay";
import DateSelector from "./DateSelector";
import CompletedTodos from "./CompletedTodos";
import { ChartData } from "chart.js";

const AanalyticsPage: React.FC = () => {
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
    let start, end;

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
                analyticsDate.isAfter(start) && analyticsDate.isBefore(end)
              );
            });

            setFilteredAnalytics(filteredData);

            const totalDuration = filteredData.reduce(
              (acc, analytics) => acc + analytics.focusDuration,
              0
            );
            setTotalFocusDuration(totalDuration);

            const chartLabels = filteredData.map((analytics) =>
              dayjs.unix(analytics.startTime.seconds).format("YYYY-MM-DD")
            );
            const chartFocusDurations = filteredData.map(
              (analytics) => analytics.focusDuration
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
  ]);

  if (!user) {
    return <div className="p-96">Please login to see analytics.</div>;
  }

  return (
    <div className="p-96">
      <h2>Total Focus Duration: {totalFocusDuration} minutes</h2>
      <h2>
        Last 30 Days Total Focus Duration: {last30DaysFocusDuration} minutes
      </h2>

      <DateSelector
        filterType={filterType}
        setFilterType={setFilterType}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      <ChartDisplay chartData={chartData} filterType={filterType} />

      <CompletedTodos filteredAnalytics={filteredAnalytics} />
    </div>
  );
};

export default AanalyticsPage;
