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
  inputMinutes: 25,
  startTime: null,
  setTimer: (minutes) => set({ secondsLeft: minutes * 60 }),
  setInputMinutes: (minutes) => set({ inputMinutes: minutes }),
  startTimer: () => {
    set({ isPaused: false, startTime: new Date() });
    console.log("startTimer");
  },
  resetTimer: () =>
    set((state) => ({
      isPaused: true,
      mode: "work",
      secondsLeft: state.inputMinutes * 60,
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
            secondsLeft: state.inputMinutes * 60,
            isPaused: false,
            mode: "work",
          };
        }
      }

      return {
        secondsLeft: newSecondsLeft,
        isPaused: state.isPaused,
      };
    }),

  addFiveMinutes: () =>
    set((state) => {
      const newMinutes = Math.min(state.inputMinutes + 5, 120);
      return {
        secondsLeft: newMinutes * 60,
        inputMinutes: newMinutes,
      };
    }),

  minusFiveMinutes: () =>
    set((state) => {
      const newMinutes = Math.max(state.inputMinutes - 5, 1);
      return {
        secondsLeft: newMinutes * 60,
        inputMinutes: newMinutes,
      };
    }),
}));
