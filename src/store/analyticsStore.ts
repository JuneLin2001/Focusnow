import { create } from "zustand";
import localforage from "localforage";
import { UserAnalytics } from "../types/type";

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
  loadAnalyticsFromDB: () => Promise<void>;
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

  loadAnalyticsFromDB: async () => {
    try {
      const cachedData =
        await localforage.getItem<UserAnalytics[]>("analytics");
      if (cachedData && cachedData.length > 0) {
        set({ analyticsList: cachedData, filteredAnalytics: cachedData });
      } else {
        console.warn("No cached data found in localForage.");
      }
    } catch (error) {
      console.error("Error loading analytics from localForage:", error);
    }
  },
}));
