import { create } from "zustand";
import localforage from "localforage";
import { UserAnalytics } from "../types/type";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useAuthStore from "../store/authStore";

interface AnalyticsState {
  analyticsList: UserAnalytics[];
  filteredAnalytics: UserAnalytics[];
  totalFocusDuration: number;
  startDate: string;
  endDate: string;
  setAnalyticsList: (data: UserAnalytics[]) => void;
  setFilteredAnalytics: (data: UserAnalytics[]) => void;
  setTotalFocusDuration: (duration: number) => void;
  reset: () => void;
  loadAnalyticsFromDB: () => Promise<void>; // 確保返回 Promise<void>
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analyticsList: [],
  filteredAnalytics: [],
  totalFocusDuration: 0,
  startDate: "",
  endDate: "",

  setAnalyticsList: async (data: UserAnalytics[]) => {
    try {
      const existingData =
        (await localforage.getItem<UserAnalytics[]>("analytics")) || [];

      if (JSON.stringify(existingData) !== JSON.stringify(data)) {
        await localforage.setItem("analytics", data);
        set({ analyticsList: data, filteredAnalytics: data });
        console.log("Data saved to localForage");
      } else {
        console.log("No changes detected, state not updated.");
      }
    } catch (error) {
      console.error("Error saving analytics:", error);
    }
  },

  setFilteredAnalytics: (data: UserAnalytics[]) => {
    set({ filteredAnalytics: data });
  },

  setTotalFocusDuration: (duration: number) => {
    set({ totalFocusDuration: duration });
  },

  reset: () => {
    set({
      analyticsList: [],
      filteredAnalytics: [],
      totalFocusDuration: 0,
      startDate: "",
      endDate: "",
    });
  },
  loadAnalyticsFromDB: async (): Promise<void> => {
    const { user } = useAuthStore.getState();
    try {
      const cachedData =
        await localforage.getItem<UserAnalytics[]>("analytics");
      if (cachedData && cachedData.length > 0) {
        set({ analyticsList: cachedData, filteredAnalytics: cachedData });
      } else {
        console.warn(
          "No cached data found in localForage. Fetching from Firestore."
        );

        if (user) {
          const analyticsCollectionRef = collection(
            db,
            "users",
            user.uid,
            "analytics"
          );

          onSnapshot(analyticsCollectionRef, (snapshot) => {
            if (!snapshot.empty) {
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as UserAnalytics[];

              const sortedAnalytics = data.sort((a, b) =>
                a.startTime.seconds < b.startTime.seconds ? 1 : -1
              );

              set({
                analyticsList: sortedAnalytics,
                filteredAnalytics: sortedAnalytics,
              });
              localforage.setItem("analytics", sortedAnalytics);
            } else {
              console.warn("No analytics data found in Firestore.");
            }
          });
        } else {
          console.warn(
            "User is not authenticated. Cannot fetch analytics from Firestore."
          );
        }
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  },
}));
