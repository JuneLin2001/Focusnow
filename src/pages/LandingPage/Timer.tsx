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
  const [inputMinutes, setInputMinutes] = useState(25);
  const [taskSaved, setTaskSaved] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null); // Add state to store start time

  useEffect(() => {
    let interval: number;

    if (!isPaused && secondsLeft >= 0) {
      interval = window.setInterval(() => {
        tick();
        console.log(secondsLeft);

        if (secondsLeft === 1 && !taskSaved) {
          if (user) {
            const endTime = new Date(); // Capture end time when task completes

            if (startTime) {
              const focusDuration = inputMinutes;
              const pomodoroCompleted = mode === "work";

              const taskData = {
                startTime: Timestamp.fromDate(startTime),
                endTime: Timestamp.fromDate(endTime),
                focusDuration,
                pomodoroCompleted,
              };

              saveTaskData(user, taskData)
                .then(() => {
                  setTaskSaved(true); // Mark task as saved
                  console.log("Task data saved successfully");
                })
                .catch((error) => {
                  console.error("Error saving task data: ", error);
                });
            } else {
              console.error("Start time is not set");
            }
          } else {
            setShowLogin(true); // Show login prompt if not logged in
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
    taskSaved,
    mode,
    inputMinutes,
    user,
    startTime,
  ]);

  const handleStartTimer = () => {
    setStartTime(new Date()); // Set start time when starting the timer
    startTimer();
  };

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
