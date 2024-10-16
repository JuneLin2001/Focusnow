import { useEffect, useCallback } from "react";
import { collection, onSnapshot } from "firebase/firestore";
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

  const fetchAnalytics = useCallback(() => {
    if (user) {
      const analyticsCollectionRef = collection(
        db,
        "users",
        user.uid,
        "analytics"
      );

      const unsubscribe = onSnapshot(analyticsCollectionRef, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as UserAnalytics[];

          const sortedAnalytics = data.sort((a, b) =>
            a.startTime.seconds < b.startTime.seconds ? 1 : -1
          );

          setAnalyticsList(sortedAnalytics);
          onDataFetched(sortedAnalytics);
        }
      });

      return () => unsubscribe();
    }
  }, [user, setAnalyticsList, onDataFetched]);

  useEffect(() => {
    const unsubscribe = fetchAnalytics();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchAnalytics]);

  return null;
};

export default AnalyticsFetcher;
