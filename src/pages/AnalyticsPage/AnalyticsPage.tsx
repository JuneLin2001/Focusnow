import React, { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import useAuthStore from "../../store/authStore";

interface Todos {
  completed: boolean;
  doneTime: Timestamp;
  id: string;
  startTime: Timestamp;
  title: string;
}

interface UserAnalytics {
  focusDuration: number;
  pomodoroCompleted: boolean;
  startTime: Timestamp;
  endTime: Timestamp;
  todos: Todos[];
}

const AanalyticsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [analyticsList, setAnalyticsList] = useState<UserAnalytics[]>([]);
  const [filteredAnalytics, setFilteredAnalytics] = useState<UserAnalytics[]>(
    []
  );
  const [totalFocusDuration, setTotalFocusDuration] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(""); // 開始日期
  const [endDate, setEndDate] = useState<string>(""); // 結束日期

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
            setFilteredAnalytics(sortedAnalytics); // 初始狀態下顯示所有數據

            // 計算總 Focus Duration
            const totalDuration = sortedAnalytics.reduce((acc, analytics) => {
              return acc + analytics.focusDuration;
            }, 0);
            setTotalFocusDuration(totalDuration);
          }
        } catch (error) {
          console.error("Error fetching user analytics", error);
        }
      };

      fetchAnalytics();
    }
  }, [user]);

  // 根據日期範圍篩選數據
  const filterByDate = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate).getTime() / 1000; // 轉換成秒
    const end = new Date(endDate).getTime() / 1000;

    const filtered = analyticsList.filter((analytics) => {
      const analyticsTime = analytics.startTime.seconds;
      return analyticsTime >= start && analyticsTime <= end;
    });

    setFilteredAnalytics(filtered);

    // 重新計算總 Focus Duration
    const totalDuration = filtered.reduce((acc, analytics) => {
      return acc + analytics.focusDuration;
    }, 0);
    setTotalFocusDuration(totalDuration);
  };

  if (!user) {
    return <div className="p-96">Please login to see analytics.</div>;
  }

  return (
    <div className="p-96">
      <h2>Total Focus Duration: {totalFocusDuration} minutes</h2>

      {/* 日期篩選區域 */}
      <div className="mt-4">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded p-2 ml-2"
        />
        <label className="ml-4">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded p-2 ml-2"
        />
        <button
          onClick={filterByDate}
          className="ml-4 bg-blue-500 text-white p-2 rounded"
        >
          Filter
        </button>
      </div>

      <br />
      <h3>Completed Todos:</h3>
      <ul>
        {filteredAnalytics.length > 0 ? (
          filteredAnalytics.map((analytics, index) => (
            <li key={index}>
              <ul>
                {analytics.todos.length > 0 ? (
                  analytics.todos.map((todo) => (
                    <li key={todo.id}>{todo.title}</li>
                  ))
                ) : (
                  <li>No todos available</li>
                )}
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
