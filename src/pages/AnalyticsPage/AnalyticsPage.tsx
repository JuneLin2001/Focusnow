import React, { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { UserAnalytics } from "../../types/type";

const AanalyticsPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    filteredAnalytics,
    totalFocusDuration,
    startDate,
    endDate,
    setAnalyticsList,
    setTotalFocusDuration,
    setStartDate,
    setEndDate,
    filterByDate,
  } = useAnalyticsStore();

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

            // 計算總 Focus Duration
            const totalDuration = sortedAnalytics.reduce(
              (acc, analytics) => acc + analytics.focusDuration,
              0
            );
            setTotalFocusDuration(totalDuration);
          }
        } catch (error) {
          console.error("Error fetching user analytics", error);
        }
      };

      fetchAnalytics();
    }
  }, [user, setAnalyticsList, setTotalFocusDuration]);

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
