import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { UserAnalytics } from "../types/type";
import { useAuthStore } from "../store/authStore";
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
      "analytics",
    );

    const unsubscribe = onSnapshot(
      analyticsCollectionRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserAnalytics[];

        setAnalyticsList(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching analytics:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, setAnalyticsList]);

  return { isLoading };
};

export default useFetchAnalytics;
