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
  const [showLogin, setShowLogin] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null); // Add state to store start time

  const handleLoginSuccess = () => {
    setShowLogin(false); // Close the login popup on successful login
  };

  useEffect(() => {
    let interval: number;

    if (!isPaused && secondsLeft >= 0) {
      interval = window.setInterval(() => {
        tick();
        console.log(secondsLeft);

        if (secondsLeft === 1) {
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

            if (user) {
              // User is logged in, save data to Firestore and remove from localStorage
              saveTaskData(user, taskData)
                .then(() => {
                  console.log("Task data saved successfully");
                  localStorage.removeItem("taskData");
                })
                .catch((error) => {
                  console.error("Error saving task data: ", error);
                });
            } else {
              // User is not logged in, save data to localStorage
              localStorage.setItem("taskData", JSON.stringify(taskData));
              setShowLogin(true); // Show login prompt if not logged in
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
  }, [tick, isPaused, secondsLeft, mode, inputMinutes, user, startTime]);

  useEffect(() => {
    if (user) {
      const savedTaskData = localStorage.getItem("taskData");
      if (savedTaskData) {
        try {
          const taskData = JSON.parse(savedTaskData);

          // 將 Firestore Timestamp 格式的數據轉換為 JavaScript Date 對象
          const startTimeDate = new Date(
            taskData.startTime.seconds * 1000 +
              taskData.startTime.nanoseconds / 1000000
          );
          const endTimeDate = new Date(
            taskData.endTime.seconds * 1000 +
              taskData.endTime.nanoseconds / 1000000
          );

          // 將 JavaScript Date 對象轉換為 Firestore Timestamp
          const startTimeTimestamp = Timestamp.fromDate(startTimeDate);
          const endTimeTimestamp = Timestamp.fromDate(endTimeDate);

          // 更新 taskData 以使用 Firestore Timestamp
          const updatedTaskData = {
            ...taskData,
            startTime: startTimeTimestamp,
            endTime: endTimeTimestamp,
          };

          // 儲存到 Firestore
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
    setStartTime(new Date()); // Set start time when starting the timer
    startTimer();
  };

  // const totalSeconds = mode === "work" ? secondsLeft : 5 * 60;
  // const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleSetTimer = () => {
    setTimer(inputMinutes);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div style={{ width: 400, height: 400 }}>
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
            <LoginButton onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
