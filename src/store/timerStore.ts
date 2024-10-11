import { create } from "zustand";
import { Timestamp } from "firebase/firestore";
import { saveTaskData } from "../firebase/firebaseService";
import useAuthStore from "./authStore";
import { useTodoStore } from "./todoStore";
import { sendBrowserNotification } from "../utils/NotificationService";
import { useFishesCountStore } from "./fishesCountStore";
import FishesCountFetcher from "../utils/FishesCountFetcher";

interface TimerState {
  secondsLeft: number;
  isPaused: boolean;
  mode: "work" | "break";
  inputMinutes: number;
  breakMinutes: number;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  rotationCount: number;
  setTimer: (minutes: number) => void;
  setInputMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  startTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  addFiveMinutes: () => void;
  minusFiveMinutes: () => void;
  checkEndCondition: (pomodoroCompleted: boolean) => void;
  showLoginButton: boolean;
  toggleLoginButton: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => {
  let animationFrameId: number | null = null;

  const updateTimer = () => {
    const state = get();
    if (state.isPaused || !state.startTime || !state.endTime) return;

    const now = Timestamp.now();
    const elapsedSeconds = Math.floor(now.seconds - state.startTime.seconds);
    const totalSeconds = Math.floor(
      state.endTime.seconds - state.startTime.seconds
    );
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

    if (remainingSeconds === 0) {
      const nextMode = state.mode === "work" ? "break" : "work";
      const nextMinutes =
        nextMode === "work" ? state.inputMinutes : state.breakMinutes;

      set((prevState) => ({
        rotationCount: prevState.rotationCount + 1,
      }));

      if (get().rotationCount >= 4) {
        set({
          isPaused: true,
          mode: "work",
          secondsLeft: get().inputMinutes * 60,
          startTime: null,
          endTime: null,
          rotationCount: 0,
        });

        sendBrowserNotification(
          "計時結束",
          "恭喜您已完成四輪工作與休息的循環。"
        );

        return;
      }

      set({
        mode: nextMode,
        secondsLeft: nextMinutes * 60,
        startTime: now,
        endTime: Timestamp.fromMillis(now.toMillis() + nextMinutes * 60 * 1000),
        isPaused: false,
      });

      get().checkEndCondition(true);

      animationFrameId = requestAnimationFrame(updateTimer);
    } else {
      set({ secondsLeft: remainingSeconds });
      animationFrameId = requestAnimationFrame(updateTimer);
    }
  };

  return {
    secondsLeft: 25 * 60,
    isPaused: true,
    mode: "work",
    inputMinutes: 25,
    breakMinutes: 5,
    startTime: null,
    endTime: null,
    rotationCount: 0,
    showLoginButton: false,

    toggleLoginButton: () =>
      set((state) => ({ showLoginButton: !state.showLoginButton })),

    setTimer: (minutes) => set({ secondsLeft: minutes * 60 }),

    setInputMinutes: (minutes) => set({ inputMinutes: minutes }),

    setBreakMinutes: (minutes) => set({ breakMinutes: minutes }),

    startTimer: () => {
      const now = Timestamp.now();
      const currentMinutes =
        get().mode === "work" ? get().inputMinutes : get().breakMinutes;

      set({
        isPaused: false,
        startTime: now,
        endTime: Timestamp.fromMillis(
          now.toMillis() + currentMinutes * 60 * 1000
        ),
        secondsLeft: currentMinutes * 60,
      });
      animationFrameId = requestAnimationFrame(updateTimer);
    },

    resumeTimer: () => {
      const now = Timestamp.now();
      const currentMinutes =
        get().mode === "work" ? get().inputMinutes : get().breakMinutes;

      set((state) => ({
        isPaused: false,
        startTime: now,
        endTime: Timestamp.fromMillis(
          now.toMillis() + state.secondsLeft * 1000
        ),
        secondsLeft: currentMinutes * 60,
      }));
      animationFrameId = requestAnimationFrame(updateTimer);
    },

    resetTimer: () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      set((state) => ({
        isPaused: true,
        mode: "work",
        secondsLeft: state.inputMinutes * 60,
        startTime: null,
        endTime: null,
        rotationCount: 0,
      }));
      get().checkEndCondition(false);
    },

    addFiveMinutes: () => {
      set((state) => {
        const currentMinutes = Math.floor(state.secondsLeft / 60);
        const newMinutes =
          currentMinutes === 1 ? 5 : Math.min(currentMinutes + 5, 120);
        const newSecondsLeft = newMinutes * 60;

        return {
          secondsLeft: newSecondsLeft,
          inputMinutes: newMinutes,
          endTime: state.startTime
            ? Timestamp.fromMillis(
                state.startTime.toMillis() + newSecondsLeft * 1000
              )
            : null,
        };
      });
    },

    minusFiveMinutes: () => {
      set((state) => {
        const newMinutes = Math.max(state.inputMinutes - 5, 1);
        const newSecondsLeft = newMinutes * 60;
        return {
          secondsLeft: newSecondsLeft,
          inputMinutes: newMinutes,
          endTime: state.startTime
            ? Timestamp.fromMillis(
                state.startTime.toMillis() + newSecondsLeft * 1000
              )
            : null,
        };
      });
    },

    checkEndCondition: (pomodoroCompleted: boolean) => {
      const { startTime, mode, inputMinutes } = get();
      if (!startTime) return;

      const endTime = Timestamp.now();

      if (pomodoroCompleted) {
        const currentRotation = get().rotationCount;
        sendBrowserNotification(
          mode === "break"
            ? `第 ${currentRotation} 輪工作時間結束！`
            : `第 ${currentRotation} 輪休息時間結束！`,
          mode === "break" ? "切換到休息模式！" : "切換到工作模式"
        );
      }

      const { user } = useAuthStore.getState();
      const { todos, removeTodo } = useTodoStore.getState();

      const formattedTodos = todos
        .filter((todo) => todo.completed)
        .map((todo) => ({
          ...todo,
          startTime:
            todo.startTime instanceof Timestamp
              ? todo.startTime
              : Timestamp.fromDate(todo.startTime),
          doneTime:
            todo.doneTime instanceof Timestamp
              ? todo.doneTime
              : todo.doneTime
                ? Timestamp.fromDate(todo.doneTime)
                : null,
        }));

      const taskData = {
        startTime,
        endTime,
        focusDuration: inputMinutes,
        pomodoroCompleted,
        todos: formattedTodos,
      };

      if (user) {
        saveTaskData(user, taskData)
          .then(() => {
            console.log("Task data saved successfully");
            todos
              .filter((todo) => todo.completed)
              .forEach((todo) => {
                removeTodo(todo.id);
              });
            localStorage.removeItem("taskData");

            if (pomodoroCompleted) {
              const { FishesCount, updateFishesCount } =
                useFishesCountStore.getState();
              updateFishesCount(inputMinutes);
              FishesCountFetcher(user, FishesCount);
            }
          })
          .catch((error) => {
            console.error("Error saving task data: ", error);
          });
      } else {
        console.log("User is not logged in");
        localStorage.setItem("taskData", JSON.stringify(taskData));
        todos
          .filter((todo) => todo.completed)
          .forEach((todo) => {
            removeTodo(todo.id);
          });
        get().toggleLoginButton();
      }
    },
  };
});
