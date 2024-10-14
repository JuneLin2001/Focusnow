import React, { useEffect, useState, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import { ChartData, Chart, registerables } from "chart.js";
import dayjs from "dayjs";
import { UserAnalytics } from "../../types/type";

Chart.register(...registerables);

interface ChartDisplayProps {
  filteredAnalytics: UserAnalytics[];
  filterType: "daily" | "weekly" | "monthly";
  currentDate: dayjs.Dayjs;
  totalFocusDuration: number;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  filteredAnalytics,
  filterType,
  currentDate,
  totalFocusDuration,
}) => {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });

  const calculateDateRange = useCallback(() => {
    let start = currentDate;
    let end = currentDate;

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
  }, [currentDate, filterType]);

  const mergeData = useCallback(
    (filteredData: UserAnalytics[], start: dayjs.Dayjs, end: dayjs.Dayjs) => {
      const mergedData: { [key: string]: number } = {};

      filteredData.forEach((analytics) => {
        if (analytics.pomodoroCompleted) {
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
        }
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

  useEffect(() => {
    const { start, end } = calculateDateRange();

    const mergedResults = mergeData(filteredAnalytics, start, end);
    const chartLabels = mergedResults.map((item) => item.date);
    const chartFocusDurations = mergedResults.map((item) => item.duration);

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
  }, [filteredAnalytics, filterType, mergeData, calculateDateRange]);

  const hasData = totalFocusDuration > 0;

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="text-center h-full flex flex-col justify-between">
      {hasData && (
        <h2 className="text-lg font-semibold mb-2">
          總專注時長: {totalFocusDuration} 分鐘
        </h2>
      )}
      <div className="flex flex-grow justify-center items-center ">
        {hasData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              color: isDarkMode ? "white" : "black",
              scales: {
                x: {
                  ticks: {
                    color: isDarkMode ? "white" : "black",
                  },
                  grid: {
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                },
                y: {
                  ticks: {
                    color: isDarkMode ? "white" : "black",
                  },
                  grid: {
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: isDarkMode ? "white" : "black",
                  },
                },
              },
            }}
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-200">沒有資料</p>
        )}
      </div>
    </div>
  );
};

export default ChartDisplay;
