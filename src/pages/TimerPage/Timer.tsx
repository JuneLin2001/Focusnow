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
    tick,
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
    startTimer();
    localStorage.setItem("remainingTime", secondsLeft.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPaused) {
      const value = e.target.value;
      const numericValue = parseInt(value);

      // 檢查是否為數字
      if (!isNaN(numericValue)) {
        // 設定最小值為 1，最大值為 120
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
                type="text"
                value={Math.floor(secondsLeft / 60)} // 只顯示分鐘數
                onChange={handleInputChange}
                disabled={!isPaused} // 當未暫停時禁用編輯
                className="text-5xl border-none bg-transparent focus:outline-none text-center mx-2"
                onBlur={handleInputBlur} // 失去焦點時關閉編輯模式
              />
            ) : (
              <div
                className="text-5xl cursor-pointer"
                onClick={handleInputClick} // 點擊時進入編輯模式
              >
                {`${Math.floor(secondsLeft / 60)}:${secondsLeft % 60 < 10 ? "0" + (secondsLeft % 60) : secondsLeft % 60}`}
              </div>
            )}
          </div>
          <AddOrSubtractButton onClick={minusFiveMinutes} disabled={!isPaused}>
            -
          </AddOrSubtractButton>
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
