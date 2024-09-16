import { useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTimerStore } from "../../store/timerStore";

const Timer = () => {
  const {
    secondsLeft,
    isPaused,
    mode,
    startTimer,
    breakTimer: resetTimer,
    tick,
  } = useTimerStore();

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [tick]);

  const totalSeconds = mode === "work" ? 25 * 60 : 5 * 60; // 模擬模式時間
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = parseInt("0" + seconds);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div style={{ width: 400, height: 400 }}>
        <CircularProgressbar
          value={percentage}
          text={`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`}
          styles={buildStyles({
            textColor: "#000",
            pathColor: mode === "work" ? "blue" : "green",
            trailColor: "#d6d6d6",
          })}
        />
      </div>
      <div className="mt-5 flex justify-center gap-3">
        {isPaused ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={startTimer}
          >
            Start
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={resetTimer}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
