import { create } from "zustand";

// 定義 Timer 的狀態接口
interface TimerState {
  secondsLeft: number;
  isPaused: boolean;
  mode: "work" | "break";
  startTimer: () => void;
  breakTimer: () => void;
  tick: () => void;
  switchMode: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  secondsLeft: 25 * 60, // 初始時間設為 25 分鐘
  isPaused: true,
  mode: "work",
  startTimer: () => set({ isPaused: false }),
  pauseTimer: () => set({ isPaused: true }),
  breakTimer: () => set({ secondsLeft: 25 * 60, isPaused: true, mode: "work" }),
  tick: () => {
    const { isPaused, switchMode } = get();
    if (!isPaused) {
      set((state) => {
        const newSecondsLeft = state.secondsLeft - 1;
        if (newSecondsLeft <= 0) {
          switchMode();
          return { secondsLeft: state.mode === "work" ? 5 * 60 : 25 * 60 }; // 假設工作模式 25 分鐘，休息模式 5 分鐘
        }
        return { secondsLeft: newSecondsLeft };
      });
    }
  },
  switchMode: () => {
    set((state) => {
      const nextMode = state.mode === "work" ? "break" : "work";
      return {
        mode: nextMode,
        secondsLeft: nextMode === "work" ? 25 * 60 : 5 * 60, // 切換模式後重新設定時間
      };
    });
  },
}));
