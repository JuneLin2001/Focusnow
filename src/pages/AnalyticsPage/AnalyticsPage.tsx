import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import useAuthStore from "../../store/authStore";

interface Task {
  taskId: string;
  taskName: string;
  completed: boolean;
}

interface UserAnalytics {
  focusDuration: number; // 專注長度（以分鐘為單位）
  pomodoroCompleted: boolean; // 番茄鐘是否完成
  startTime: string; // 開始時間（字符串格式）
  endTime: string; // 結束時間（字符串格式）
  tasks: Task[]; // 任務列表
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
              tasks: Array.isArray(data.tasks) ? data.tasks : [], // 確保 tasks 是數組
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
          <h2>Tasks</h2>
          <ul>
            {Array.isArray(analytics.tasks) && analytics.tasks.length > 0 ? (
              analytics.tasks.map((task) => (
                <li key={task.taskId}>
                  {task.taskName} - {task.completed ? "Completed" : "Pending"}
                </li>
              ))
            ) : (
              <li>No tasks available</li>
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
