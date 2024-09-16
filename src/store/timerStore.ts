import { create } from "zustand";

interface TimerState {
  secondsLeft: number;
  isPaused: boolean;
  mode: "work" | "break";
  setTimer: (minutes: number) => void; // 新增設定計時器時間的函數
  startTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  addFiveMinutes: () => void;
  minusFiveMinutes: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  secondsLeft: 25 * 60, // 預設為 25 分鐘
  isPaused: true,
  mode: "work",
  setTimer: (minutes) => set({ secondsLeft: minutes * 60 }),
  startTimer: () => {
    set({ isPaused: false });
    console.log("startTimer");
  },
  resetTimer: () => set({ isPaused: true, secondsLeft: 25 * 60 }), // 重置為 25 分鐘
  tick: () =>
    set((state) => ({
      secondsLeft: Math.max(0, state.secondsLeft - 1),
      isPaused: state.secondsLeft <= 1 ? true : state.isPaused,
    })),
  addFiveMinutes: () =>
    set((state) => ({
      secondsLeft: Math.max(0, state.secondsLeft + 5 * 60),
    })),
  minusFiveMinutes: () =>
    set((state) => ({
      secondsLeft: Math.max(0, state.secondsLeft - 5 * 60),
    })),
}));
