// src/components/AnalyticsPage.tsx
import { useState, useCallback } from "react";
import dayjs from "dayjs";
import { UserAnalytics } from "../../types/type";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import DateSelector from "./DateSelector";
import CompletedTodos from "./CompletedTodos";
import AnalyticsFetcher from "../../utils/AnalyticsFetcher";
import PomodoroPieChart from "./PomodoroPieChart";
import ChartDisplay from "./ChartDisplay";
import { Card } from "@/components/ui/card";

const AnalyticsPage = () => {
  const { user } = useAuthStore();
  const { filteredAnalytics, setFilteredAnalytics } = useAnalyticsStore();
  const [filterType, setFilterType] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [totalFocusDuration, setTotalFocusDuration] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState(dayjs());

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

  const handleDataFetched = useCallback(
    (sortedAnalytics: UserAnalytics[]) => {
      const { start, end } = calculateDateRange();

      // 過濾資料以取得所有的資料
      const filteredAllData = sortedAnalytics.filter((analytics) => {
        const analyticsDate = dayjs.unix(analytics.startTime.seconds);
        return (
          analyticsDate.isSame(start, "day") ||
          analyticsDate.isSame(end, "day") ||
          (analyticsDate.isAfter(start) && analyticsDate.isBefore(end))
        );
      });

      setFilteredAnalytics(filteredAllData); // 設置過濾後的分析資料

      // 計算總專注時長
      const totalDuration = filteredAllData.reduce(
        (acc, analytics) => acc + analytics.focusDuration,
        0
      );
      setTotalFocusDuration(totalDuration);
    },
    [calculateDateRange, setFilteredAnalytics]
  );

  if (!user) {
    return (
      <div className="box-border w-full h-full flex justify-center items-center">
        <p className="p-96">Please login to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start h-full box-border mt-20">
      <Card className="box-border w-full h-full bg-red-200 p-4">
        <div className="flex flex-col space-y-4 h-full">
          {/* 上方的 Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <DateSelector
                filterType={filterType}
                setFilterType={setFilterType}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
              />
            </Card>
            <Card className="p-4">
              <p>Total Focus Duration: {totalFocusDuration} minutes</p>
            </Card>
          </div>
          {/* 下方的圖表和完成的 Todo */}
          <div className="flex flex-grow flex-wrap justify-between mt-4">
            <Card className="flex-1 m-2 p-4 h-2/3">
              <PomodoroPieChart filteredAnalytics={filteredAnalytics} />
            </Card>
            <Card className="flex-1 m-2 p-4 h-2/3">
              <ChartDisplay
                filteredAnalytics={filteredAnalytics}
                filterType={filterType}
              />
            </Card>
            <Card className="flex-1 m-2 p-4 h-2/3">
              <CompletedTodos filteredAnalytics={filteredAnalytics} />
            </Card>
          </div>
        </div>
      </Card>
      <AnalyticsFetcher onDataFetched={handleDataFetched} />
    </div>
  );
};

export default AnalyticsPage;
