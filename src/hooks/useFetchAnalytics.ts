import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { UserAnalytics } from "../types/type";
import useAuthStore from "../store/authStore";
import { useAnalyticsStore } from "../store/analyticsStore";

const useFetchAnalytics = () => {
  const { user } = useAuthStore();
  const { setAnalyticsList } = useAnalyticsStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const analyticsCollectionRef = collection(
      db,
      "users",
      user.uid,
      "analytics"
    );

    const unsubscribe = onSnapshot(
      analyticsCollectionRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserAnalytics[];

        setAnalyticsList(data); // 更新 Zustand 狀態
        setIsLoading(false); // 完成加載
      },
      (error) => {
        console.error("Error fetching analytics:", error);
        setIsLoading(false); // 發生錯誤時也停止加載
      }
    );

    // 清除訂閱
    return () => unsubscribe();
  }, [user, setAnalyticsList]);

  return { isLoading }; // 回傳 isLoading 狀態
};

export default useFetchAnalytics;
