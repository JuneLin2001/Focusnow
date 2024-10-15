import { useEffect, useCallback } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { UserAnalytics } from "../types/type";
import useAuthStore from "../store/authStore";
import { useAnalyticsStore } from "../store/analyticsStore";

const AnalyticsFetcher = ({
  onDataFetched,
}: {
  onDataFetched: (data: UserAnalytics[]) => void; // 定義傳入的函數類型
}) => {
  const { user } = useAuthStore(); // 獲取用戶狀態
  const { setAnalyticsList } = useAnalyticsStore(); // 獲取設置分析列表的函數

  // 定義獲取數據的函數
  const fetchAnalytics = useCallback(() => {
    if (user) {
      const analyticsCollectionRef = collection(
        db,
        "users",
        user.uid,
        "analytics"
      );

      // 使用 onSnapshot 監聽 Firestore 集合的實時變更
      const unsubscribe = onSnapshot(analyticsCollectionRef, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as UserAnalytics[];

          // 按 startTime 排序
          const sortedAnalytics = data.sort((a, b) =>
            a.startTime.seconds < b.startTime.seconds ? 1 : -1
          );

          setAnalyticsList(sortedAnalytics); // 設置分析數據列表
          onDataFetched(sortedAnalytics); // 傳遞數據給父組件
        }
      });

      // 返回清理函數以停止監聽
      return () => unsubscribe();
    }
  }, [user, setAnalyticsList, onDataFetched]);

  useEffect(() => {
    const unsubscribe = fetchAnalytics(); // 調用獲取數據的函數

    // 返回清理函數以防止內存洩漏
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchAnalytics]); // 當 fetchAnalytics 改變時重新執行

  return null; // 此組件不需要渲染任何內容
};

export default AnalyticsFetcher;
