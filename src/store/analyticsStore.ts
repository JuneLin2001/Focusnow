import { create } from "zustand";
import { UserAnalytics } from "../types/type";

interface AnalyticsState {
  analyticsList: UserAnalytics[];
  filteredAnalytics: UserAnalytics[];
  totalFocusDuration: number;
  startDate: string;
  endDate: string;
  setAnalyticsList: (data: UserAnalytics[]) => void; // 新增 setAnalyticsList
  setFilteredAnalytics: (data: UserAnalytics[]) => void;
  setTotalFocusDuration: (duration: number) => void;
  reset: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analyticsList: [],
  filteredAnalytics: [],
  totalFocusDuration: 0,
  startDate: "",
  endDate: "",

  setAnalyticsList: (data: UserAnalytics[]) => {
    set({ analyticsList: data, filteredAnalytics: data }); // 設定 analyticsList 和 filteredAnalytics
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
}));
