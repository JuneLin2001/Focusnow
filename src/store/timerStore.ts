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
  addFiveMinutes: () => void;
  minusFiveMinutes: () => void;
}

export const useTimerStore = create<TimerState>((set) => {
  let interval: NodeJS.Timeout | null = null;

  return {
    secondsLeft: 25 * 60,
    isPaused: true,
    mode: "work",
    inputMinutes: 25,
    startTime: null,
    setTimer: (minutes) => set({ secondsLeft: minutes * 60 }),
    setInputMinutes: (minutes) => set({ inputMinutes: minutes }),
    startTimer: () => {
      set({ isPaused: false, startTime: new Date() });
      interval = setInterval(() => {
        set((state) => {
          const newSecondsLeft = Math.max(0, state.secondsLeft - 1);
          if (newSecondsLeft === 0) {
            const newMode = state.mode === "work" ? "break" : "work";
            return {
              secondsLeft:
                newMode === "work" ? state.inputMinutes * 60 : 5 * 60,
              isPaused: false,
              mode: newMode,
            };
          }
          return { secondsLeft: newSecondsLeft };
        });
      }, 1000);
    },
    resetTimer: () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      set((state) => ({
        isPaused: true,
        mode: "work",
        secondsLeft: state.inputMinutes * 60,
      }));
    },
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
  };
});
