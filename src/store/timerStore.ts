import { create } from "zustand";
import { Timestamp } from "firebase/firestore";
import { saveTaskData } from "../firebase/firebaseService";
import useAuthStore from "./authStore";
import { useTodoStore } from "./todoStore";
import { sendBrowserNotification } from "../utils/NotificationService";
import { useFishesCountStore } from "./fishesCountStore";
import FishesCountFetcher from "../utils/FishesCountFetcher";
import { WorkerResponse } from "../types/type";
import { toast } from "react-toastify";

interface TimerState {
  secondsLeft: number;
  isPaused: boolean;
  mode: "work" | "break";
  inputMinutes: number;
  breakMinutes: number;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  rotationCount: number;
  worker: Worker | null;
  setTimer: (minutes: number) => void;
  setInputMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  startTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  addFiveMinutes: () => void;
  minusFiveMinutes: () => void;
  checkEndCondition: (pomodoroCompleted: boolean) => void;
  updateTitle: () => void;
  showLoginButton: boolean;
  showLogin: () => void;
  hideLogin: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => {
  let worker: Worker | null = null;

  const initializeWorker = () => {
    worker = new Worker(new URL("../utils/timerWorker.ts", import.meta.url), {
      type: "module",
    });
    set({ worker });

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      if (e.data.type === "tick" && e.data.secondsLeft !== undefined) {
        set({ secondsLeft: e.data.secondsLeft });
        updateTitle();
      } else if (e.data.type === "timerComplete") {
        handleTimerComplete();
      }
    };

    worker.onerror = (error) => {
      console.error("Worker error:", error);
    };
  };

  const updateTitle = () => {
    const { secondsLeft, mode } = get();
    const minutes = Math.floor(secondsLeft / 60);
    const displaySeconds =
      secondsLeft % 60 < 10 ? `0${secondsLeft % 60}` : secondsLeft % 60;
    document.title = `${mode === "work" ? "工作中" : "休息中"} | 剩餘時間: ${minutes}:${displaySeconds}`;
  };

  const resetTitle = () => {
    document.title = "Focusnow";
  };

  const handleTimerComplete = () => {
    const state = get();
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

      sendBrowserNotification("計時結束", "恭喜您已完成四輪工作與休息的循環。");

      resetTitle();
      return;
    }

    const now = Timestamp.now();
    set({
      mode: nextMode,
      secondsLeft: nextMinutes * 60,
      startTime: now,
      endTime: Timestamp.fromMillis(now.toMillis() + nextMinutes * 60 * 1000),
      isPaused: false,
    });

    get().checkEndCondition(true);
    get().startTimer();

    updateTitle();
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
    worker: null,
    updateTitle,
    resetTitle,

    showLogin: () => set({ showLoginButton: true }),
    hideLogin: () => set({ showLoginButton: false }),

    setTimer: (minutes) => set({ secondsLeft: minutes * 60 }),

    setInputMinutes: (minutes) => set({ inputMinutes: minutes }),

    setBreakMinutes: (minutes) => set({ breakMinutes: minutes }),

    startTimer: () => {
      if (!worker) {
        initializeWorker();
      }
      const now = Timestamp.now();
      const currentMinutes =
        get().mode === "work" ? get().inputMinutes : get().breakMinutes;
      const endTime = Timestamp.fromMillis(
        now.toMillis() + currentMinutes * 60 * 1000
      );

      set({
        isPaused: false,
        startTime: now,
        endTime: endTime,
        secondsLeft: currentMinutes * 60,
      });

      worker?.postMessage({
        action: "start",
        startTime: now.toMillis(),
        endTime: endTime.toMillis(),
      });
      updateTitle();
    },

    resumeTimer: () => {
      if (!worker) {
        initializeWorker();
      }
      const now = Timestamp.now();
      const { secondsLeft } = get();
      const endTime = Timestamp.fromMillis(now.toMillis() + secondsLeft * 1000);

      set({
        isPaused: false,
        startTime: now,
        endTime: endTime,
      });

      worker?.postMessage({
        action: "start",
        startTime: now.toMillis(),
        endTime: endTime.toMillis(),
      });
      updateTitle();
    },

    resetTimer: () => {
      console.log("Reset timer");
      const { mode, startTime } = get();

      worker?.postMessage({ action: "stop" });
      worker?.terminate();
      worker = null;

      if (startTime && mode === "work") {
        get().checkEndCondition(false);
      }

      set((state) => ({
        isPaused: true,
        mode: "work",
        secondsLeft: state.inputMinutes * 60,
        startTime: null,
        endTime: null,
        rotationCount: 0,
      }));
      resetTitle();
    },

    addFiveMinutes: () => {
      set((state) => {
        const currentMinutes = Math.floor(state.secondsLeft / 60);
        const newMinutes =
          currentMinutes === 1 ? 5 : Math.min(currentMinutes + 5, 120);
        const newSecondsLeft = newMinutes * 60;

        if (!state.isPaused) {
          const now = Timestamp.now();
          const newEndTime = Timestamp.fromMillis(
            now.toMillis() + newSecondsLeft * 1000
          );
          worker?.postMessage({
            action: "start",
            startTime: now.toMillis(),
            endTime: newEndTime.toMillis(),
          });
        }

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

        if (!state.isPaused) {
          const now = Timestamp.now();
          const newEndTime = Timestamp.fromMillis(
            now.toMillis() + newSecondsLeft * 1000
          );
          worker?.postMessage({
            action: "start",
            startTime: now.toMillis(),
            endTime: newEndTime.toMillis(),
          });
        }

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

        updateTitle();
      }

      const { user } = useAuthStore.getState();
      const { todos, removeTodo } = useTodoStore.getState();

      const formattedTodos = todos
        .filter((todo) => todo.completed)
        .map((todo) => ({
          ...todo,
          startTime: isTimestamp(todo.startTime)
            ? Timestamp.fromDate(todo.startTime.toDate())
            : Timestamp.now(),
          doneTime: todo.doneTime
            ? isTimestamp(todo.doneTime)
              ? Timestamp.fromDate(todo.doneTime.toDate())
              : null
            : null,
        }));

      function isTimestamp(value: unknown): value is Timestamp {
        return value instanceof Timestamp;
      }

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
                toast.success(`你完成的 「 ${todo.title} 」 已經儲存成功！`);
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
        get().showLogin();
      }

      updateTitle();
    },
  };
});
