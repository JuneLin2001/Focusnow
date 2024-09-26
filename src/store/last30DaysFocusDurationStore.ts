import { create } from "zustand";
import { UserAnalytics } from "../types/type";

interface Last30DaysFocusDurationState {
  last30DaysFocusDuration: number;
  setLast30DaysFocusDuration: (analyticsList?: UserAnalytics[]) => void;
}

export const useLast30DaysFocusDurationStore =
  create<Last30DaysFocusDurationState>((set) => ({
    last30DaysFocusDuration: 0,
    setLast30DaysFocusDuration: (analyticsList = []) => {
      if (analyticsList.length === 0) {
        set({ last30DaysFocusDuration: 0 });
        return;
      }

      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const filtered = analyticsList.filter((analytics) => {
        const analyticsDate = new Date(analytics.startTime.seconds * 1000);
        return analyticsDate >= last30Days;
      });

      const totalDuration = filtered.reduce(
        (acc, analytics) => acc + analytics.focusDuration,
        0
      );

      set({ last30DaysFocusDuration: totalDuration });
    },
  }));
