import { create } from "zustand";

interface TimerState {
  secondsLeft: number;
  isPaused: boolean;
  mode: "work" | "break";
  inputMinutes: number;
  startTime: Date | null;
  setTimer: (minutes: number) => void;
  setInputMinutes: (minutes: number) => void;
  startTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  addFiveMinutes: () => void;
  minusFiveMinutes: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  secondsLeft: 25 * 60,
  isPaused: true,
  mode: "work",
  inputMinutes: 25, // 預設值
  startTime: null, // 初始為 null
  setTimer: (minutes) => set({ secondsLeft: minutes * 60 }),
  setInputMinutes: (minutes) => set({ inputMinutes: minutes }), // 設置 inputMinutes
  startTimer: () => {
    set({ isPaused: false, startTime: new Date() }); // 設置 startTime
    console.log("startTimer");
  },
  resetTimer: () =>
    set((state) => ({
      isPaused: true,
      mode: "work",
      secondsLeft: state.inputMinutes * 60, // 使用者輸入的分鐘數
    })),
  tick: () =>
    set((state) => {
      const newSecondsLeft = Math.max(0, state.secondsLeft - 1);
      if (newSecondsLeft === 0) {
        if (state.mode === "work") {
          return {
            secondsLeft: 5 * 60,
            isPaused: false,
            mode: "break",
          };
        } else {
          return {
            secondsLeft: state.secondsLeft,
            isPaused: true,
            mode: "work",
          };
        }
      }
      return {
        secondsLeft: newSecondsLeft,
        isPaused: state.secondsLeft <= 1 ? true : state.isPaused,
      };
    }),
  addFiveMinutes: () =>
    set((state) => ({
      secondsLeft: Math.max(0, state.secondsLeft + 5 * 60),
    })),
  minusFiveMinutes: () =>
    set((state) => ({
      secondsLeft: Math.max(0, state.secondsLeft - 5 * 60),
    })),
}));
