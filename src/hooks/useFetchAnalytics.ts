import { useQuery } from "react-query";
import { useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { UserAnalytics } from "../types/type";
import useAuthStore from "../store/authStore";
import { useAnalyticsStore } from "../store/analyticsStore";

const useFetchAnalytics = () => {
  const { user } = useAuthStore();
  const { setAnalyticsList } = useAnalyticsStore();

  const fetchAnalytics = async (): Promise<UserAnalytics[]> => {
    return new Promise((resolve, reject) => {
      // 檢查用戶是否存在，如果不存在則直接返回空數組
      if (!user) return resolve([]); // 或者 reject("User not authenticated"); 這樣會導致 isError 變成 true

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

          resolve(data);
        },
        (error) => reject(error)
      );

      // 清除訂閱
      return () => unsubscribe();
    });
  };

  const {
    data: analyticsData,
    isLoading, // 加入 isLoading 狀態
    isError,
    error,
  } = useQuery("analyticsData", fetchAnalytics, {
    enabled: !!user, // 只有在用戶存在的情況下才執行請求
    refetchOnWindowFocus: false,
    onSuccess: (data) => setAnalyticsList(data),
  });

  useEffect(() => {
    if (isError) {
      console.error("Error fetching analytics:", error);
    }
  }, [isError, error]);

  return { analyticsData, isLoading, isError, error }; // 回傳 isLoading
};

export default useFetchAnalytics;
