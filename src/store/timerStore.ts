import { create } from "zustand";
import { Timestamp } from "firebase/firestore";
import { saveTaskData } from "../firebase/firebaseService";
import useAuthStore from "./authStore";
import { useTodoStore } from "./todoStore";
import { sendBrowserNotification } from "../utils/NotificationService";

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
  checkEndCondition: (
    startTime: Date | null,
    mode: "work" | "break",
    inputMinutes: number,
    endTime: Date
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
    startTime: null,
    showLoginButton: false,
    toggleLoginButton: () =>
      set((state) => ({ showLoginButton: !state.showLoginButton })),
    setTimer: (minutes) => set({ secondsLeft: minutes * 60 }),
    setInputMinutes: (minutes) => set({ inputMinutes: minutes }),
    startTimer: () => {
      set({ isPaused: false, startTime: new Date() });
      interval = setInterval(() => {
        set((state) => {
          const newSecondsLeft = Math.max(0, state.secondsLeft - 1);
          const nextState = { secondsLeft: newSecondsLeft, mode: state.mode };
          console.log(newSecondsLeft);

          if (newSecondsLeft === 0) {
            console.log("Timer is done!");
            nextState.mode = state.mode === "work" ? "break" : "work";
            nextState.secondsLeft =
              nextState.mode === "work" ? state.inputMinutes * 60 : 5 * 60;

            get().checkEndCondition(
              state.startTime,
              nextState.mode,
              state.inputMinutes,
              new Date()
            );
          }
          return nextState;
        });
      }, 1000);
    },
    resetTimer: () => {
      if (interval) {
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

    checkEndCondition: (startTime, mode, inputMinutes, endTime) => {
      if (!startTime) {
        console.error("Start time is null");
        return;
      }

      sendBrowserNotification(
        mode === "break" ? "工作時間結束！" : "休息時間結束！",
        mode === "break" ? "切換到休息模式！" : "切換到工作模式"
      );

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
        pomodoroCompleted: true,
        todos: formattedTodos,
      };

      if (user) {
        if (mode === "break") {
          saveTaskData(user, taskData)
            .then(() => {
              console.log("Task data saved successfully");
              todos
                .filter((todo) => todo.completed)
                .forEach((todo) => {
                  removeTodo(todo.id);
                });
              localStorage.removeItem("taskData");
            })
            .catch((error) => {
              console.error("Error saving task data: ", error);
            });
        }
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
