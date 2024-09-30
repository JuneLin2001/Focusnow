// src/components/AnalyticsFetcher.tsx
import { useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { UserAnalytics } from "../types/type";
import useAuthStore from "../store/authStore";
import { useAnalyticsStore } from "../store/analyticsStore";

const AnalyticsFetcher = ({
  onDataFetched,
}: {
  onDataFetched: (data: UserAnalytics[]) => void;
}) => {
  const { user } = useAuthStore();
  const { setAnalyticsList } = useAnalyticsStore();

  const fetchAnalytics = useCallback(async () => {
    if (user) {
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

          const sortedAnalytics = data.sort((a, b) =>
            a.startTime.seconds < b.startTime.seconds ? 1 : -1
          );

          setAnalyticsList(sortedAnalytics);
          onDataFetched(sortedAnalytics);
        }
      } catch (error) {
        console.error("Error fetching user analytics", error);
      }
    }
  }, [user, setAnalyticsList, onDataFetched]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return null;
};

export default AnalyticsFetcher;
