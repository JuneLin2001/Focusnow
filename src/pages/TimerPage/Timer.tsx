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
import {
  requestNotificationPermission,
  sendBrowserNotification,
} from "../../utils/NotificationService";

const Timer = () => {
  const {
    secondsLeft,
    isPaused,
    mode,
    inputMinutes,
    startTime,
    startTimer,
    resetTimer,
    setTimer,
    addFiveMinutes,
    minusFiveMinutes,
    setInputMinutes,
  } = useTimerStore();

  const { user } = useAuthStore();
  const { todos, removeTodo } = useTodoStore();
  const [showLogin, setShowLogin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    let interval: number;

    if (!isPaused && secondsLeft - 1 >= 0) {
      interval = window.setInterval(() => {
        console.log(secondsLeft - 1);

        if (secondsLeft - 1 === 0) {
          const endTime = new Date();
          const focusDuration = mode === "work" ? inputMinutes : 5;
          const pomodoroCompleted = mode === "work";

          sendBrowserNotification(
            mode === "work" ? "工作時間結束！" : "休息時間結束！",
            mode === "work" ? "切換到休息模式！" : "切換到工作模式"
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
          }
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
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
    startTimer();
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPaused) {
      const value = e.target.value;
      const numericValue = parseInt(value);

      if (!isNaN(numericValue)) {
        const clampedValue = Math.min(Math.max(numericValue, 1), 120);
        setInputMinutes(clampedValue);
        setTimer(clampedValue);
      }
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
      <div>
        <CircularProgressbarWithChildren
          value={
            mode === "work"
              ? (secondsLeft / (inputMinutes * 60)) * 100
              : (secondsLeft / (5 * 60)) * 100
          }
          styles={buildStyles({
            textColor: "#000",
            pathColor: mode === "work" ? "blue" : "green",
            trailColor: "#d6d6d6",
          })}
        >
          {isPaused && (
            <AddOrSubtractButton onClick={addFiveMinutes} disabled={!isPaused}>
              +
            </AddOrSubtractButton>
          )}

          <div className="flex items-center">
            {isEditing ? (
              <input
                type="text"
                value={`${Math.floor(secondsLeft / 60)}`}
                onChange={handleInputChange}
                disabled={!isPaused}
                className="text-5xl border-4 border-black w-24 bg-transparent focus:outline-none text-center"
                onBlur={handleInputBlur}
              />
            ) : (
              <div
                className="text-5xl cursor-pointer"
                onClick={handleInputClick}
              >
                {`${Math.floor(secondsLeft / 60)}:${secondsLeft % 60 < 10 ? "0" + (secondsLeft % 60) : secondsLeft % 60}`}
              </div>
            )}
          </div>
          {isPaused && (
            <AddOrSubtractButton
              onClick={minusFiveMinutes}
              disabled={!isPaused}
            >
              -
            </AddOrSubtractButton>
          )}
        </CircularProgressbarWithChildren>
        <div className="mt-5 flex justify-center">
          {isPaused ? (
            <DefaultButton onClick={handleStartTimer}>開始</DefaultButton>
          ) : mode === "break" ? (
            <ResetButton onClick={resetTimer}>跳過休息</ResetButton>
          ) : (
            <ResetButton onClick={resetTimer}>放棄</ResetButton>
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
