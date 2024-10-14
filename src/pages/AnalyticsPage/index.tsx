import { useState, useCallback } from "react";
import dayjs from "dayjs";
import { UserAnalytics } from "../../types/type";
import { useAnalyticsStore } from "../../store/analyticsStore";
import DateSelector from "./DateSelector";
import CompletedTodos from "./CompletedTodos";
import AnalyticsFetcher from "../../utils/AnalyticsFetcher";
import PomodoroPieChart from "./PomodoroPieChart";
import ChartDisplay from "./ChartDisplay";
import { Card } from "@/components/ui/card";

const AnalyticsPage = () => {
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

      const filteredAllData = sortedAnalytics.filter((analytics) => {
        const analyticsDate = dayjs.unix(analytics.startTime.seconds);
        return (
          analyticsDate.isSame(start, "day") ||
          analyticsDate.isSame(end, "day") ||
          (analyticsDate.isAfter(start) && analyticsDate.isBefore(end))
        );
      });

      setFilteredAnalytics(filteredAllData);

      const totalDuration = filteredAllData.reduce((acc, analytics) => {
        if (analytics.pomodoroCompleted) {
          return acc + analytics.focusDuration;
        }
        return acc;
      }, 0);

      setTotalFocusDuration(totalDuration);
    },
    [calculateDateRange, setFilteredAnalytics]
  );

  return (
    <div className="flex justify-center items-start h-full box-border mt-20 overflow-auto">
      {" "}
      <Card className="box-border w-full h-full bg-gray-200 bg-opacity-50 p-4 mx-4 max-h-[calc(100vh-100px)]">
        <div className="flex flex-col h-full">
          <Card className="p-4">
            <DateSelector
              filterType={filterType}
              setFilterType={setFilterType}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />
          </Card>
          <div className="flex flex-col lg:flex-row flex-grow flex-wrap justify-between mt-1 space-y-4 lg:space-y-0 lg:space-x-4">
            <Card className="flex-[2] m-2 p-4 h-auto w-auto">
              <PomodoroPieChart filteredAnalytics={filteredAnalytics} />
            </Card>
            <Card className="flex-[4] m-2 p-4 h-auto">
              <ChartDisplay
                filteredAnalytics={filteredAnalytics}
                filterType={filterType}
                totalFocusDuration={totalFocusDuration}
                currentDate={currentDate}
              />
            </Card>
            <Card className="flex-[1] m-2 p-4 h-auto">
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
