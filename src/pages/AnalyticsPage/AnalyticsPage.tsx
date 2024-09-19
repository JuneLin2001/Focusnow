import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import useAuthStore from "../../store/authStore";

interface Todos {
  completed: boolean;
  doneTime: string;
  id: string;
  startTime: string;
  title: string;
}

interface UserAnalytics {
  focusDuration: number;
  pomodoroCompleted: boolean;
  startTime: string;
  endTime: string;
  todos: Todos[];
}

const AanalyticsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);

  useEffect(() => {
    if (user) {
      const fetchAnalytics = async () => {
        try {
          // 讀取 `analytics` 集合中的所有文檔
          const analyticsCollectionRef = collection(
            db,
            "users",
            user.uid,
            "analytics"
          );
          const analyticsSnapshot = await getDocs(analyticsCollectionRef);

          // 假設只有一個文檔，取第一個文檔的數據
          if (!analyticsSnapshot.empty) {
            const data = analyticsSnapshot.docs[0].data();

            // 將時間戳轉換為可顯示的格式
            const formatTimestamp = (timestamp: {
              seconds: number;
              nanoseconds: number;
            }) => {
              const date = new Date(timestamp.seconds * 1000);
              return date.toLocaleString(); // 或使用 date.toISOString() 根據需求調整
            };

            setAnalytics({
              focusDuration: data.focusDuration || 0,
              pomodoroCompleted: data.pomodoroCompleted || false,
              startTime: data.startTime
                ? formatTimestamp(data.startTime)
                : "N/A",
              endTime: data.endTime ? formatTimestamp(data.endTime) : "N/A",
              todos: Array.isArray(data.todos) ? data.todos : [], // 確保 todos 是數組
            });
          }
        } catch (error) {
          console.error("Error fetching user analytics", error);
        }
      };

      fetchAnalytics();
    }
  }, [user]);

  if (!user) {
    return <div className="p-96">Please login to see analytics.</div>;
  }

  return (
    <div className="p-96">
      {analytics ? (
        <div>
          <p>
            <strong>Focus Duration:</strong> {analytics.focusDuration} minutes
          </p>
          <p>
            <strong>Pomodoro Completed:</strong>{" "}
            {analytics.pomodoroCompleted ? "Yes" : "No"}
          </p>
          <p>
            <strong>Start Time:</strong> {analytics.startTime}
          </p>
          <p>
            <strong>End Time:</strong> {analytics.endTime}
          </p>
          <h2>Todos</h2>
          <ul>
            {Array.isArray(analytics.todos) && analytics.todos.length > 0 ? (
              analytics.todos.map((task) => (
                <li key={task.id}>
                  {task.title} - {task.completed ? "Completed" : "Pending"}
                </li>
              ))
            ) : (
              <li>No todos available</li>
            )}
          </ul>
        </div>
      ) : (
        <p>Loading analytics...</p>
      )}
    </div>
  );
};

export default AanalyticsPage;
