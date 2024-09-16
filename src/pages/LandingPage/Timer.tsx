import { useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTimerStore } from "../../store/timerStore";
import {
  DefaultButton,
  ResetButton,
  AddOrSubtractButton,
} from "../../components/Button";
import { saveTaskData } from "../../firebase/firebaseService";
import { Timestamp } from "firebase/firestore";
import useAuthStore from "../../store/authStore";
import LoginButton from "../../components/LoginButton";

const Timer = () => {
  const {
    secondsLeft,
    isPaused,
    mode,
    startTimer,
    breakTimer: resetTimer,
    tick,
    setTimer,
    addFiveMinutes,
    minusFiveMinutes,
  } = useTimerStore();

  const { user } = useAuthStore();
  const [inputMinutes, setInputMinutes] = useState(25);
  const [taskSaved, setTaskSaved] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        tick();

        if (secondsLeft <= 0) {
          if (user) {
            // Save data if user is logged in
            const endTime = new Date();
            const startTime = new Date(); // Adjust according to your logic
            const focusDuration = inputMinutes;
            const pomodoroCompleted = mode === "work";

            const taskData = {
              endTime: Timestamp.fromDate(endTime),
              focusDuration,
              pomodoroCompleted,
              startTime: Timestamp.fromDate(startTime),
            };

            // 保存至 Firestore 的 users/{userId}/analytics 子集合中
            saveTaskData(user, taskData)
              .then(() => {
                setTaskSaved(true); // 標記任務已保存
                console.log("Task data saved successfully");
              })
              .catch((error) => {
                console.error("Error saving task data: ", error);
              });
          } else {
            // 如果未登入，顯示登入提示
            setShowLogin(true);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tick, isPaused, secondsLeft, taskSaved, mode, inputMinutes, user]);

  const totalSeconds = mode === "work" ? secondsLeft : 5 * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleSetTimer = () => {
    setTimer(inputMinutes);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div style={{ width: 400, height: 400 }}>
        <CircularProgressbarWithChildren
          value={percentage}
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
      </div>
      <div className="mt-5">
        {isPaused ? (
          <>
            <DefaultButton onClick={startTimer}>Start</DefaultButton>
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
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-xl mb-4">Please log in to save your data</h2>
            <LoginButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
