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
    "daily",
  );
  const [totalFocusDuration, setTotalFocusDuration] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedCard, setSelectedCard] = useState<"pie" | "chart" | "todos">(
    "pie",
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
      dayjs.unix(b.startTime.seconds).diff(dayjs.unix(a.startTime.seconds)),
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

  useEffect(() => {
    filterAnalytics();
  }, [filterType, currentDate, filterAnalytics]);

  return (
    <div className="mt-20 box-border flex h-full items-start justify-center overflow-auto">
      <Card className="mx-4 box-border size-full max-h-[calc(100vh-100px)] bg-gray-200 bg-opacity-50 p-4">
        <div className="flex h-full flex-col">
          <Card className="mb-2 p-4">
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
                className="flex flex-row justify-between space-x-4"
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

          <div className="mt-1 flex flex-grow flex-wrap justify-between space-y-4 lg:hidden lg:space-x-4 lg:space-y-0">
            {selectedCard === "pie" && (
              <Card className="size-auto flex-[2] p-4">
                <PomodoroPieChart filteredAnalytics={filteredAnalytics} />
              </Card>
            )}
            {selectedCard === "chart" && (
              <Card className="h-auto flex-[4] p-4">
                <ChartDisplay
                  filteredAnalytics={filteredAnalytics}
                  filterType={filterType}
                  totalFocusDuration={totalFocusDuration}
                  currentDate={currentDate}
                />
              </Card>
            )}
            {selectedCard === "todos" && (
              <Card className="h-auto flex-[1] p-4">
                <CompletedTodos filteredAnalytics={filteredAnalytics} />
              </Card>
            )}
          </div>
          <div>
            <div className="hidden flex-grow flex-wrap justify-between gap-2 lg:flex">
              <Card className="h-auto min-h-[66vh] flex-[2] p-4">
                <PomodoroPieChart filteredAnalytics={filteredAnalytics} />
              </Card>
              <Card className="h-auto flex-[4] p-4">
                <ChartDisplay
                  filteredAnalytics={filteredAnalytics}
                  filterType={filterType}
                  totalFocusDuration={totalFocusDuration}
                  currentDate={currentDate}
                />
              </Card>
              <Card className="h-auto flex-[1] p-4">
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