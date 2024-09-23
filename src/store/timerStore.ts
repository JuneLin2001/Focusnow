import { create } from "zustand";

interface TimerState {
  secondsLeft: number;
  isPaused: boolean;
  mode: "work" | "break";
  setTimer: (minutes: number) => void;
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
  setTimer: (minutes) => set({ secondsLeft: minutes * 60 }),
  startTimer: () => {
    set({ isPaused: false });
    console.log("startTimer");
  },
  resetTimer: () => set({ isPaused: true, mode: "work" }),
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
