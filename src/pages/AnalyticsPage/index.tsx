import { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import { useAnalyticsStore } from "../../store/analyticsStore";
import DateSelector from "./DateSelector";
import CompletedTodos from "./CompletedTodos";
import PomodoroPieChart from "./PomodoroPieChart";
import ChartDisplay from "./ChartDisplay";
import { Card } from "@/components/ui/card";
import { ChartPie, ChartColumn, ListChecks } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const AnalyticsPage = () => {
  const { filteredAnalytics, setFilteredAnalytics, analyticsList } =
    useAnalyticsStore();
  const [filterType, setFilterType] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [totalFocusDuration, setTotalFocusDuration] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedCard, setSelectedCard] = useState<"pie" | "chart" | "todos">(
    "pie"
  );

  const calculateDateRange = useCallback(() => {
    let start = dayjs();
    let end = dayjs();

    switch (filterType) {
      case "daily":
        start = currentDate.startOf("day");
        end = currentDate.endOf("day");
        break;
      case "weekly":
        start = currentDate.startOf("week");
        end = currentDate.endOf("week");
        break;
      case "monthly":
        start = currentDate.startOf("month");
        end = currentDate.endOf("month");
        break;
      default:
        break;
    }

    return { start, end };
  }, [filterType, currentDate]);

  const filterAnalytics = useCallback(() => {
    if (!analyticsList || analyticsList.length === 0) return;
    const { start, end } = calculateDateRange();

    const filteredAllData = analyticsList.filter((analytics) => {
      const analyticsDate = dayjs.unix(analytics.startTime.seconds);
      return (
        analyticsDate.isSame(start, "day") ||
        analyticsDate.isSame(end, "day") ||
        (analyticsDate.isAfter(start, "day") &&
          analyticsDate.isBefore(end, "day"))
      );
    });

    const sortedData = filteredAllData.sort((a, b) =>
      dayjs.unix(b.startTime.seconds).diff(dayjs.unix(a.startTime.seconds))
    );

    setFilteredAnalytics(sortedData);

    const totalDuration = filteredAllData.reduce((acc, analytics) => {
      if (analytics.pomodoroCompleted) {
        return acc + analytics.focusDuration;
      }
      return acc;
    }, 0);

    setTotalFocusDuration(totalDuration);
  }, [calculateDateRange, setFilteredAnalytics, analyticsList]);

  // 確保在快取資料改變時進行篩選
  useEffect(() => {
    filterAnalytics();
  }, [filterType, currentDate, filterAnalytics]);

  return (
    <div className="flex justify-center items-start h-full box-border mt-20 overflow-auto">
      <Card className="box-border w-full h-full bg-gray-200 bg-opacity-50 p-4 mx-4 max-h-[calc(100vh-100px)]">
        <div className="flex flex-col h-full">
          <Card className="p-4 mb-2">
            <DateSelector
              filterType={filterType}
              setFilterType={setFilterType}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />
            <div className="my-4 lg:hidden">
              <ToggleGroup
                type="single"
                defaultValue="pie"
                onValueChange={(value) =>
                  setSelectedCard(value as "pie" | "chart" | "todos")
                }
                className="flex flex-row space-x-4 justify-between"
              >
                <ToggleGroupItem value="pie" aria-label="Toggle pie chart">
                  <div className="flex items-center space-x-2">
                    <ChartPie />
                    <span>完成率</span>
                  </div>
                </ToggleGroupItem>

                <ToggleGroupItem value="chart" aria-label="Toggle bar chart">
                  <div className="flex items-center space-x-2">
                    <ChartColumn />
                    <span>時間分析</span>
                  </div>
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="todos"
                  aria-label="Toggle completed todos"
                >
                  <div className="flex items-center space-x-2">
                    <ListChecks />
                    <span>完成的Todos</span>
                  </div>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </Card>

          <div className="flex lg:hidden flex-grow flex-wrap justify-between mt-1 space-y-4 lg:space-y-0 lg:space-x-4">
            {selectedCard === "pie" && (
              <Card className="flex-[2] p-4 h-auto w-auto">
                <PomodoroPieChart filteredAnalytics={filteredAnalytics} />
              </Card>
            )}
            {selectedCard === "chart" && (
              <Card className="flex-[4] p-4 h-auto">
                <ChartDisplay
                  filteredAnalytics={filteredAnalytics}
                  filterType={filterType}
                  totalFocusDuration={totalFocusDuration}
                  currentDate={currentDate}
                />
              </Card>
            )}
            {selectedCard === "todos" && (
              <Card className="flex-[1] p-4 h-auto">
                <CompletedTodos filteredAnalytics={filteredAnalytics} />
              </Card>
            )}
          </div>
          <div>
            <div className="hidden lg:flex flex-grow flex-wrap justify-between gap-2">
              <Card className="flex-[2] p-4 h-auto min-h-[66vh]">
                <PomodoroPieChart filteredAnalytics={filteredAnalytics} />
              </Card>
              <Card className="flex-[4] p-4 h-auto">
                <ChartDisplay
                  filteredAnalytics={filteredAnalytics}
                  filterType={filterType}
                  totalFocusDuration={totalFocusDuration}
                  currentDate={currentDate}
                />
              </Card>
              <Card className="flex-[1] p-4 h-auto">
                <CompletedTodos filteredAnalytics={filteredAnalytics} />
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
