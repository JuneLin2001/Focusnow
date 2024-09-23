import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { saveTaskData } from "../../firebase/firebaseService";
import useAuthStore from "../../store/authStore";
import { useTimerStore } from "../../store/timerStore";
import LoginButton from "../../components/LoginButton";
import {
  DefaultButton,
  ResetButton,
  AddOrSubtractButton,
} from "../../components/Button";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTodoStore } from "../../store/todoStore";
import { ToastContainer } from "react-toastify";
import {
  requestNotificationPermission,
  sendBrowserNotification,
} from "../../utils/NotificationService"; // 引入新的函數

const Timer = () => {
  const {
    secondsLeft,
    isPaused,
    mode,
    startTimer,
    resetTimer,
    tick,
    setTimer,
    addFiveMinutes,
    minusFiveMinutes,
  } = useTimerStore();
  const { user } = useAuthStore();
  const { todos, removeTodo } = useTodoStore();
  const [inputMinutes, setInputMinutes] = useState(25);
  const [showLogin, setShowLogin] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  useEffect(() => {
    requestNotificationPermission();

    const savedTime = localStorage.getItem("remainingTime");
    if (savedTime) {
      const remainingTime = Number(savedTime);
      if (remainingTime > 0) {
        setTimer(Math.floor(remainingTime / 60));
      }
    }
  }, [setTimer]);

  useEffect(() => {
    let interval: number;

    if (!isPaused && secondsLeft >= 0) {
      interval = window.setInterval(() => {
        tick();
        localStorage.setItem("remainingTime", secondsLeft.toString());

        if (secondsLeft === 1) {
          const endTime = new Date();
          const focusDuration = mode === "work" ? inputMinutes : 5; // 休息為 5 分鐘
          const pomodoroCompleted = mode === "work";

          sendBrowserNotification(
            mode === "work" ? "工作時間結束！" : "休息時間結束！",
            "請準備切換模式！"
          );

          if (startTime) {
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
              focusDuration,
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
                })
                .catch((error) => {
                  console.error("Error saving task data: ", error);
                });
            } else {
              localStorage.setItem("taskData", JSON.stringify(taskData));
              todos
                .filter((todo) => todo.completed)
                .forEach((todo) => {
                  removeTodo(todo.id);
                });
              setShowLogin(true);
            }
          } else {
            console.error("Start time is not set");
          }
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      localStorage.removeItem("remainingTime");
    };
  }, [
    tick,
    isPaused,
    secondsLeft,
    mode,
    inputMinutes,
    user,
    startTime,
    todos,
    removeTodo,
  ]);

  const handleStartTimer = () => {
    setStartTime(new Date());
    startTimer();
    localStorage.setItem("remainingTime", secondsLeft.toString());
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPaused) {
      const value = parseInt(e.target.value);
      setInputMinutes(value);
      setTimer(value);
    }
  };

  const handleInputClick = () => {
    if (isPaused) {
      setIsEditing(true);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <ToastContainer />
      <div>
        <CircularProgressbarWithChildren
          value={(secondsLeft / (inputMinutes * 60)) * 100}
          styles={buildStyles({
            textColor: "#000",
            pathColor: mode === "work" ? "blue" : "green",
            trailColor: "#d6d6d6",
          })}
        >
          <AddOrSubtractButton onClick={addFiveMinutes} disabled={!isPaused}>
            +
          </AddOrSubtractButton>
          <div className="flex items-center">
            {isEditing ? (
              <input
                type="number"
                value={inputMinutes}
                onChange={handleInputChange}
                min="1"
                onBlur={handleInputBlur}
                className="text-5xl border-none bg-transparent focus:outline-none text-center"
              />
            ) : (
              <div
                className="text-5xl cursor-pointer"
                onClick={handleInputClick}
              >{`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`}</div>
            )}
          </div>
          <AddOrSubtractButton onClick={minusFiveMinutes} disabled={!isPaused}>
            -
          </AddOrSubtractButton>
        </CircularProgressbarWithChildren>

        <div className="mt-5 flex justify-center">
          {isPaused ? (
            <DefaultButton onClick={handleStartTimer}>Start</DefaultButton>
          ) : (
            <ResetButton onClick={resetTimer}>Reset</ResetButton>
          )}
        </div>

        {showLogin && (
          <div className="flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2 className="text-xl mb-4">請登入以保存數據</h2>
              <LoginButton onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
