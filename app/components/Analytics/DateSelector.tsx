import React, { useState } from "react";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateSelectorProps {
  filterType: "daily" | "weekly" | "monthly";
  setFilterType: (value: "daily" | "weekly" | "monthly") => void;
  currentDate: dayjs.Dayjs;
  setCurrentDate: (date: dayjs.Dayjs) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  filterType,
  setFilterType,
  currentDate,
  setCurrentDate,
}) => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(dayjs(date));
    }
    setCalendarOpen(false);
  };

  const getDisplayDate = () => {
    if (filterType === "daily") {
      return currentDate.format("YYYY-MM-DD");
    } else if (filterType === "weekly") {
      return `${currentDate.startOf("week").format("YYYY-MM-DD")} - ${currentDate.endOf("week").format("YYYY-MM-DD")}`;
    } else if (filterType === "monthly") {
      return currentDate.format("YYYY-MM");
    }
    return "";
  };

  const handlePrev = () => {
    if (filterType === "daily") {
      setCurrentDate(currentDate.subtract(1, "day"));
    } else if (filterType === "weekly") {
      setCurrentDate(currentDate.subtract(1, "week"));
    } else if (filterType === "monthly") {
      setCurrentDate(currentDate.subtract(1, "month"));
    }
  };

  const handleNext = () => {
    const today = dayjs();

    if (filterType === "daily" && currentDate.add(1, "day").isBefore(today)) {
      setCurrentDate(currentDate.add(1, "day"));
    } else if (
      filterType === "weekly" &&
      currentDate.add(1, "week").isBefore(today)
    ) {
      setCurrentDate(currentDate.add(1, "week"));
    } else if (
      filterType === "monthly" &&
      currentDate.add(1, "month").isBefore(today)
    ) {
      setCurrentDate(currentDate.add(1, "month"));
    }
  };

  return (
    <div className="flex w-full flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
      <div className="flex w-full items-center justify-center space-x-2 lg:w-auto">
        <label className="whitespace-nowrap">篩選方式:</label>
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as "daily" | "weekly" | "monthly")
          }
          className="w-auto rounded bg-white p-2 text-black dark:border-gray-600 dark:bg-black dark:text-white dark:shadow-[4px_4px_4px_rgba(255,255,255,0.2)]"
        >
          <option value="daily">每日</option>
          <option value="weekly">每週</option>
          <option value="monthly">每月</option>
        </select>
      </div>

      <div className="flex w-full items-center justify-center space-x-2 lg:w-auto">
        <Button
          variant="analytics"
          onClick={handlePrev}
          disabled={currentDate.isSame(new Date("1900-01-01"))}
        >
          <ChevronLeft />
        </Button>
        <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[240px] pl-3 text-left font-normal"
              onClick={() => setCalendarOpen((prev) => !prev)}
            >
              {getDisplayDate()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={currentDate.toDate()}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="analytics"
          onClick={handleNext}
          disabled={currentDate.isSame(new Date())}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default DateSelector;
