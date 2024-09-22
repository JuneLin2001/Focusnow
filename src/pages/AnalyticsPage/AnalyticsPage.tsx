import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { UserAnalytics } from "../../types/type";
import dayjs from "dayjs"; // 用來處理日期

const AanalyticsPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    filteredAnalytics,
    setAnalyticsList,
    setFilteredAnalytics, // 手動設置篩選後的數據
  } = useAnalyticsStore();

  const [filterType, setFilterType] = useState<string>("daily"); // "daily", "weekly", "monthly"
  const [totalFocusDuration, setTotalFocusDuration] = useState<number>(0); // 專注總時長

  const [currentDate, setCurrentDate] = useState(dayjs()); // 當前選中的日期，用 dayjs 來管理

  // 使用 useCallback 包裹範圍計算邏輯
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

  // 更新數據並篩選
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

            // 按日期排序的 Analytics
            const sortedAnalytics = data.sort((a, b) =>
              a.startTime.seconds < b.startTime.seconds ? 1 : -1
            );

            setAnalyticsList(sortedAnalytics);

            // 根據篩選範圍來篩選數據
            const { start, end } = calculateDateRange();
            const filteredData = sortedAnalytics.filter((analytics) => {
              const analyticsDate = dayjs.unix(analytics.startTime.seconds);
              return (
                analyticsDate.isAfter(start) && analyticsDate.isBefore(end)
              );
            });

            // 更新篩選後的數據
            setFilteredAnalytics(filteredData);

            // 計算篩選後的專注時長總和
            const totalDuration = filteredData.reduce(
              (acc, analytics) => acc + analytics.focusDuration,
              0
            );
            setTotalFocusDuration(totalDuration); // 更新篩選後的總專注時長
          }
        } catch (error) {
          console.error("Error fetching user analytics", error);
        }
      };

      fetchAnalytics();
    }
  }, [user, calculateDateRange, setAnalyticsList, setFilteredAnalytics]);

  // 切換日期
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

  if (!user) {
    return <div className="p-96">Please login to see analytics.</div>;
  }

  return (
    <div className="p-96">
      <h2>Total Focus Duration: {totalFocusDuration} minutes</h2>

      {/* 篩選方式選單 */}
      <div className="mt-4">
        <label>篩選方式:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded p-2 ml-2"
        >
          <option value="daily">每日</option>
          <option value="weekly">每週</option>
          <option value="monthly">每月</option>
        </select>
      </div>

      {/* 用左右箭頭選擇日期範圍 */}
      <div className="mt-4 flex items-center">
        <button onClick={handlePrev} className="bg-gray-300 p-2 rounded-l">
          ←
        </button>
        <div className="px-4">
          {filterType === "daily"
            ? currentDate.format("YYYY-MM-DD")
            : filterType === "weekly"
              ? `${currentDate.startOf("week").format("YYYY-MM-DD")} - ${currentDate
                  .endOf("week")
                  .format("YYYY-MM-DD")}`
              : `${currentDate.format("YYYY-MM")}`}
        </div>
        <button onClick={handleNext} className="bg-gray-300 p-2 rounded-r">
          →
        </button>
      </div>

      <br />
      <h3>Completed Todos:</h3>
      <ul>
        {filteredAnalytics.length > 0 ? (
          filteredAnalytics.map((analytics, index) => (
            <li key={index}>
              <ul>
                {analytics.todos.length > 0
                  ? analytics.todos.map((todo) => (
                      <li key={todo.id}>{todo.title}</li>
                    ))
                  : ""}
              </ul>
            </li>
          ))
        ) : (
          <p>找不到資料：（</p>
        )}
      </ul>
    </div>
  );
};

export default AanalyticsPage;
