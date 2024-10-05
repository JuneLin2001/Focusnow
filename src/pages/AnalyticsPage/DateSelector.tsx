import React from "react";
import dayjs from "dayjs";

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
    <div className="mt-4 flex items-center">
      <label className="mr-2">篩選方式:</label>
      <select
        value={filterType}
        onChange={(e) =>
          setFilterType(e.target.value as "daily" | "weekly" | "monthly")
        }
        className="border border-gray-300 rounded p-2 mr-2"
      >
        <option value="daily">每日</option>
        <option value="weekly">每週</option>
        <option value="monthly">每月</option>
      </select>

      <button onClick={handlePrev} className="bg-gray-300 p-2 rounded-l">
        ←
      </button>
      <div className="px-4">
        {filterType === "daily"
          ? currentDate.format("YYYY-MM-DD")
          : filterType === "weekly"
            ? `${currentDate.startOf("week").format("YYYY-MM-DD")} - ${currentDate.endOf("week").format("YYYY-MM-DD")}`
            : `${currentDate.format("YYYY-MM")}`}
      </div>
      <button onClick={handleNext} className="bg-gray-300 p-2 rounded-r">
        →
      </button>
    </div>
  );
};

export default DateSelector;
