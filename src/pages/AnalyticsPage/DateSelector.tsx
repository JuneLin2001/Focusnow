import React, { useState } from "react";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  // 將日曆選擇的日期轉換為 dayjs 對象
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(dayjs(date)); // 將選擇的日期設置為 currentDate
    }
    setCalendarOpen(false); // 選擇日期後關閉日曆
  };

  // 根據篩選方式返回顯示的日期範圍
  const getDisplayDate = () => {
    if (filterType === "daily") {
      return currentDate.format("YYYY-MM-DD");
    } else if (filterType === "weekly") {
      return `${currentDate.startOf("week").format("YYYY-MM-DD")} - ${currentDate.endOf("week").format("YYYY-MM-DD")}`;
    } else if (filterType === "monthly") {
      return currentDate.format("YYYY-MM");
    }
    return ""; // 預設返回空字串
  };

  // 處理上一個日期的邏輯
  const handlePrev = () => {
    if (filterType === "daily") {
      setCurrentDate(currentDate.subtract(1, "day"));
    } else if (filterType === "weekly") {
      setCurrentDate(currentDate.subtract(1, "week"));
    } else if (filterType === "monthly") {
      setCurrentDate(currentDate.subtract(1, "month"));
    }
  };

  // 處理下一個日期的邏輯
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
      <label className="mb-2 sm:mb-0">篩選方式:</label>
      <select
        value={filterType}
        onChange={(e) =>
          setFilterType(e.target.value as "daily" | "weekly" | "monthly")
        }
        className="border border-gray-300 rounded p-2 mb-2 sm:mb-0"
      >
        <option value="daily">每日</option>
        <option value="weekly">每週</option>
        <option value="monthly">每月</option>
      </select>

      {/* 左右箭頭按鈕 */}
      <div className="flex items-center space-x-2">
        <Button onClick={handlePrev} className="bg-gray-300">
          ←
        </Button>
        <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-[240px] pl-3 text-left font-normal"
              onClick={() => setCalendarOpen((prev) => !prev)} // 點擊按鈕切換日曆顯示
            >
              {getDisplayDate()} {/* 顯示當前日期範圍 */}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={currentDate.toDate()} // 轉換為 Date 對象
              onSelect={handleDateSelect} // 當選擇日期時調用
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button onClick={handleNext} className="bg-gray-300">
          →
        </Button>
      </div>
    </div>
  );
};

export default DateSelector;
