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
    if (filterType === "daily") {
      setCurrentDate(currentDate.add(1, "day"));
    } else if (filterType === "weekly") {
      setCurrentDate(currentDate.add(1, "week"));
    } else if (filterType === "monthly") {
      setCurrentDate(currentDate.add(1, "month"));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center w-full space-y-4 lg:space-y-0 lg:space-x-4">
      <div className="flex justify-center w-full lg:w-auto items-center space-x-2">
        <label className="whitespace-nowrap">篩選方式:</label>
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as "daily" | "weekly" | "monthly")
          }
          className="border dark:border-2 border-gray-300 bg-white dark:bg-black dark:border-gray-600 text-black dark:text-white rounded p-2 w-28"
        >
          <option value="daily">每日</option>
          <option value="weekly">每週</option>
          <option value="monthly">每月</option>
        </select>
      </div>

      <div className="flex justify-center  w-full lg:w-auto items-center space-x-2">
        <Button variant="analytics" onClick={handlePrev}>
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
        <Button variant="analytics" onClick={handleNext}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default DateSelector;
