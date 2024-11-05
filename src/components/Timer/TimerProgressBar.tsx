import { useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { Plus, Minus } from "lucide-react";
import settingStore from "../../store/settingStore";
import { useTimerStore } from "../../store/timerStore";
import { Button } from "@/components/ui/button";
import "react-circular-progressbar/dist/styles.css";

const TimerProgressBar = () => {
  const {
    secondsLeft,
    isPaused,
    mode,
    inputMinutes,
    breakMinutes,
    addFiveMinutes,
    minusFiveMinutes,
    setInputMinutes,
    setTimer,
    startTimer,
    resetTimer,
    rotationCount,
  } = useTimerStore();

  const { themeMode } = settingStore();
  const [isEditing, setIsEditing] = useState(false);

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

  const pathColor =
    mode === "work"
      ? themeMode === "dark"
        ? "#1e3a8a"
        : "#3b82f6"
      : themeMode === "dark"
        ? "#0b4f22"
        : "#009b00";

  return (
    <>
      <CircularProgressbarWithChildren
        value={
          mode === "work"
            ? (secondsLeft / (inputMinutes * 60)) * 100
            : (secondsLeft / (breakMinutes * 60)) * 100
        }
        styles={buildStyles({
          textColor: themeMode === "dark" ? "#e5e7eb" : "#000",
          pathColor: pathColor,
          trailColor: themeMode === "light" ? "#d6d6d6" : "#686868",
        })}
      >
        <div className="flex size-full flex-col items-center justify-center">
          {!isPaused && (
            <div
              className="absolute left-1/2 top-3/4 -translate-x-1/2 transform rounded-full px-3 py-1 text-center text-white"
              style={{ backgroundColor: pathColor }}
            >
              第 {rotationCount + 1} 輪
            </div>
          )}

          <div
            id="edit-timer"
            className={`flex items-center ${isPaused ? "w-5/6 justify-between" : "w-full justify-center"}`}
          >
            {isPaused && (
              <Button
                variant="timerGhost"
                size="timerGhost"
                onClick={minusFiveMinutes}
                disabled={!isPaused}
              >
                <Minus />
              </Button>
            )}
            <div id="set-timer" className="flex items-center justify-center">
              {isEditing ? (
                <input
                  type="text"
                  value={`${Math.floor(secondsLeft / 60)}`}
                  onChange={handleInputChange}
                  disabled={!isPaused}
                  className="w-24 border-4 border-black bg-transparent text-center text-5xl focus:outline-none dark:text-gray-200"
                  onBlur={handleInputBlur}
                />
              ) : (
                <div
                  className="cursor-pointer text-5xl"
                  onClick={handleInputClick}
                >
                  {`${Math.floor(secondsLeft / 60)}:${
                    secondsLeft % 60 < 10
                      ? "0" + (secondsLeft % 60)
                      : secondsLeft % 60
                  }`}
                </div>
              )}
            </div>
            {isPaused && (
              <Button
                variant="timerGhost"
                size="timerGhost"
                onClick={addFiveMinutes}
                disabled={!isPaused}
              >
                <Plus />
              </Button>
            )}
          </div>
        </div>
      </CircularProgressbarWithChildren>
      <div className="mt-5 flex justify-center">
        <Button
          id={isPaused ? "start-timer" : "reset-timer"}
          variant={isPaused ? "default" : "reset"}
          onClick={isPaused ? handleStartTimer : resetTimer}
        >
          {isPaused ? "開始" : mode === "break" ? "跳過休息" : "中斷"}
        </Button>
      </div>
    </>
  );
};

export default TimerProgressBar;
