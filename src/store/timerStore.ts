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
  breakMinutes: number; // 新增屬性以設定休息時間
  startTime: Date | null;
  setTimer: (minutes: number) => void;
  setInputMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void; // 新增設置休息時間的方法
  startTimer: () => void;
  resetTimer: () => void;
  addFiveMinutes: () => void;
  minusFiveMinutes: () => void;
  checkEndCondition: (
    startTime: Date | null,
    mode: "work" | "break",
    inputMinutes: number,
    endTime: Date,
    pomodoroCompleted: boolean
  ) => void;
  showLoginButton: boolean;
  toggleLoginButton: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => {
  let interval: NodeJS.Timeout | null = null;

  return {
    secondsLeft: 25 * 60,
    isPaused: true,
    mode: "work",
    inputMinutes: 25,
    breakMinutes: 5, // 預設休息時間為5分鐘
    startTime: null,
    showLoginButton: false,

    toggleLoginButton: () =>
      set((state) => ({ showLoginButton: !state.showLoginButton })),

    setTimer: (minutes) => set({ secondsLeft: minutes * 60 }),

    setInputMinutes: (minutes) => set({ inputMinutes: minutes }),

    setBreakMinutes: (minutes) => set({ breakMinutes: minutes }), // 設置休息時間的方法

    startTimer: () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      set({ isPaused: false, startTime: new Date() });

      interval = setInterval(() => {
        set((state) => {
          const newSecondsLeft = Math.max(0, state.secondsLeft - 1);
          const nextState = { secondsLeft: newSecondsLeft, mode: state.mode };

          if (newSecondsLeft === 0) {
            console.log("Timer is done!");
            nextState.mode = state.mode === "work" ? "break" : "work";
            nextState.secondsLeft =
              nextState.mode === "work"
                ? state.inputMinutes * 60
                : state.breakMinutes * 60; // 使用用戶自定義的休息時間

            get().checkEndCondition(
              state.startTime,
              nextState.mode,
              state.inputMinutes,
              new Date(),
              true // 完成的 pomodoro
            );
          }
          return nextState;
        });
      }, 1000);
    },

    resetTimer: () => {
      const { startTime, inputMinutes } = get();

      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      // 重置計時器並保留未完成的 pomodoro 狀態
      set((state) => ({
        isPaused: true,
        mode: "work",
        secondsLeft: state.inputMinutes * 60,
      }));

      // 將未完成的 pomodoro 狀態保存到 Firestore
      get().checkEndCondition(
        startTime,
        "work", // 保持當前的模式為工作模式
        inputMinutes,
        new Date(),
        false // 未完成的 pomodoro
      );
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

    checkEndCondition: (
      startTime,
      mode,
      inputMinutes,
      endTime,
      pomodoroCompleted
    ) => {
      if (!startTime) {
        console.error("Start time is null");
        return;
      }

      if (pomodoroCompleted) {
        sendBrowserNotification(
          mode === "break" ? "工作時間結束！" : "休息時間結束！",
          mode === "break" ? "切換到休息模式！" : "切換到工作模式"
        );
      }

      const { user } = useAuthStore.getState();
      const { todos, removeTodo } = useTodoStore.getState();

      const formattedTodos = todos
        .filter((todo) => todo.completed)
        .map((todo) => ({
          ...todo,
          startTime: Timestamp.fromDate(todo.startTime.toDate()),
          doneTime: todo.doneTime
            ? Timestamp.fromDate(todo.doneTime.toDate())
            : null,
        }));

      const taskData = {
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
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
              updateFishesCount(inputMinutes); // 只有在 pomodoro 完成時才更新魚數量
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
