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

  useEffect(() => {
    let interval: number;

    if (!isPaused && secondsLeft >= 0) {
      interval = window.setInterval(() => {
        tick();
        console.log(secondsLeft);

        if (secondsLeft === 1) {
          const endTime = new Date();

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
      if (interval) clearInterval(interval);
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
    console.log(startTime);
    startTimer();
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleSetTimer = () => {
    setTimer(inputMinutes);
  };

  return (
    //TODO: Timer的大小和位置，不能用w-screen h-screen不然會蓋住Canva就不能滑動畫面
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
