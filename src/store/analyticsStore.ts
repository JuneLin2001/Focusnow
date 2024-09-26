import { create } from "zustand";
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
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  filterByDate: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analyticsList: [],
  filteredAnalytics: [],
  totalFocusDuration: 0,
  startDate: "",
  endDate: "",
  setAnalyticsList: (data) => {
    set({ analyticsList: data, filteredAnalytics: data });
  },
  setFilteredAnalytics: (data) => {
    set({ filteredAnalytics: data });
  },
  setTotalFocusDuration: (duration) => {
    set({ totalFocusDuration: duration });
  },
  setStartDate: (date) => {
    set({ startDate: date });
  },
  setEndDate: (date) => {
    set({ endDate: date });
  },
  filterByDate: () => {
    set((state) => {
      if (!state.startDate || !state.endDate) {
        return {
          filteredAnalytics: [],
          totalFocusDuration: 0,
        };
      }

      const start = new Date(state.startDate).getTime() / 1000;
      const end = new Date(state.endDate).getTime() / 1000;

      const filtered = state.analyticsList.filter((analytics) => {
        const analyticsTime = analytics.startTime.seconds;
        return analyticsTime >= start && analyticsTime <= end;
      });

      const totalDuration = filtered.reduce(
        (acc, analytics) => acc + analytics.focusDuration,
        0
      );

      return {
        filteredAnalytics: filtered,
        totalFocusDuration: totalDuration,
      };
    });
  },
}));
