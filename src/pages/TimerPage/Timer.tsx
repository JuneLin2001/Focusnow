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
import { useTodoStore, Todo } from "../../store/todoStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("Notification permission denied");
    }
  };

  const sendBrowserNotification = (title: string, message: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    } else {
      console.warn("Notification permission not granted.");
    }
  };

  const sendNotification = (title: string, message: string) => {
    toast(
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>,
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  useEffect(() => {
    requestNotificationPermission(); // 請求通知權限

    // 檢查 localStorage 是否有保存的時間
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
          sendNotification("計時完成！", "恭喜你完成了專注時段！");
          sendBrowserNotification("計時完成！", "恭喜你完成了專注時段！"); // 使用瀏覽器通知

          if (startTime) {
            const focusDuration = inputMinutes;
            const pomodoroCompleted = mode === "work";

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

  useEffect(() => {
    if (user) {
      const savedTaskData = localStorage.getItem("taskData");
      if (savedTaskData) {
        try {
          const taskData = JSON.parse(savedTaskData);

          const startTimeDate = new Date(
            taskData.startTime.seconds * 1000 +
              taskData.startTime.nanoseconds / 1000000
          );
          const endTimeDate = new Date(
            taskData.endTime.seconds * 1000 +
              taskData.endTime.nanoseconds / 1000000
          );

          const startTimeTimestamp = Timestamp.fromDate(startTimeDate);
          const endTimeTimestamp = Timestamp.fromDate(endTimeDate);

          const updatedTodos = taskData.todos.map((todo: Todo) => ({
            ...todo,
            startTime: Timestamp.fromDate(
              new Date(
                todo.startTime.seconds * 1000 +
                  todo.startTime.nanoseconds / 1000000
              )
            ),
            doneTime: todo.doneTime
              ? Timestamp.fromDate(
                  new Date(
                    todo.doneTime.seconds * 1000 +
                      todo.doneTime.nanoseconds / 1000000
                  )
                )
              : null,
          }));

          const updatedTaskData = {
            ...taskData,
            startTime: startTimeTimestamp,
            endTime: endTimeTimestamp,
            todos: updatedTodos,
          };

          saveTaskData(user, updatedTaskData)
            .then(() => {
              console.log("Task data saved successfully");
              localStorage.removeItem("taskData");
            })
            .catch((error) => {
              console.error("Error saving task data: ", error);
            });
        } catch (error) {
          console.error("Error parsing saved task data: ", error);
        }
      }
    }
  }, [user]);

  const handleStartTimer = () => {
    setStartTime(new Date());
    startTimer();
    localStorage.setItem("remainingTime", secondsLeft.toString());
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleSetTimer = () => {
    setTimer(inputMinutes);
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
          <div className="text-5xl">{`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`}</div>
          <AddOrSubtractButton onClick={minusFiveMinutes} disabled={!isPaused}>
            -
          </AddOrSubtractButton>
        </CircularProgressbarWithChildren>
        <div className="mt-5">
          {isPaused ? (
            <>
              <DefaultButton onClick={handleStartTimer}>Start</DefaultButton>
              <input
                type="number"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(parseInt(e.target.value))}
                min="1"
                className="ml-2 p-2 border border-gray-300 rounded"
              />
              <DefaultButton onClick={handleSetTimer}>Set Timer</DefaultButton>
            </>
          ) : (
            <ResetButton onClick={resetTimer}>Reset</ResetButton>
          )}
        </div>
        {showLogin && (
          <div className="flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2 className="text-xl mb-4">Please login to save your data</h2>
              <LoginButton onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
