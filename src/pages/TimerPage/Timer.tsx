import { useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTimerStore } from "../../store/timerStore";
import LoginButton from "../../components/Header/LoginButton";
import { requestNotificationPermission } from "../../utils/notificationService";
import { Button } from "@/components/ui/button";
import SettingsDialog from "./SettingsDialog";
import { Plus, Minus, Settings, X } from "lucide-react";
import settingStore from "../../store/settingStore";
import { Card } from "@/components/ui/card";
import TimerDisplay from "./TimerDisplay";

interface TimerProps {
  isOpen: boolean;
  page: string | null;
  setPage: (newPage: "timer" | "analytics" | "Setting" | null) => void;
  setTargetPosition: (position: [number, number, number]) => void;
  setLookAtPosition: (position: [number, number, number]) => void;
}

const Timer: React.FC<TimerProps> = ({
  isOpen,
  page,
  setPage,
  setTargetPosition,
  setLookAtPosition,
}) => {
  const {
    secondsLeft,
    isPaused,
    mode,
    inputMinutes,
    breakMinutes,
    startTimer,
    resetTimer,
    addFiveMinutes,
    minusFiveMinutes,
    setInputMinutes,
    setTimer,
    showLoginButton,
  } = useTimerStore();

  const { themeMode } = settingStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

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

  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const handleOpenSettingsDialog = () => {
    setOpenSettingsDialog(true);
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
  };

  const handleCloseTimerPage = () => {
    setPage(null);
    setTargetPosition([-250, 60, 10]);
    setLookAtPosition([0, 0, 0]);
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
    <Card className="z-30 bg-white bg-opacity-60 w-[500px] h-[500px] flex flex-col justify-center items-center bg-cover bg-center relative ">
      <div
        className={`absolute top-4 right-4 ${isOpen ? "opacity-100" : "opacity-0"} lg:opacity-100`}
      >
        <Button variant="timerGhost" size="icon" onClick={handleCloseTimerPage}>
          <X />
        </Button>
      </div>

      <div
        className={`absolute top-4 left-4 transition-all duration-500 ease-in-out transform ${isOpen ? "opacity-100" : "opacity-0"} lg:opacity-100`}
      >
        <Button
          variant="timerGhost"
          size="icon"
          onClick={handleOpenSettingsDialog}
        >
          <Settings />
        </Button>
        <TimerDisplay
          page={page}
          setPage={setPage}
          setTargetPosition={setTargetPosition}
        />
      </div>

      <div
        className={`transition-all duration-500 ease-in-out transform ${isOpen ? "opacity-100" : "opacity-0"} lg:opacity-100`}
      >
        <CircularProgressbarWithChildren
          value={
            mode === "work"
              ? (secondsLeft / (inputMinutes * 60)) * 100
              : (secondsLeft / (breakMinutes * 60)) * 100
          }
          styles={buildStyles({
            textColor: themeMode === "dark" ? "#e5e7eb" : "#000",
            pathColor: pathColor,
            trailColor: "#d6d6d6",
          })}
        >
          <div className="flex flex-col justify-center items-center h-full w-full">
            <SettingsDialog
              onClose={handleCloseSettingsDialog}
              open={openSettingsDialog}
              isPaused={isPaused}
            />
            <div
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
              <div className="flex items-center justify-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={`${Math.floor(secondsLeft / 60)}`}
                    onChange={handleInputChange}
                    disabled={!isPaused}
                    className="text-5xl border-4 border-black w-24 bg-transparent focus:outline-none text-center dark:text-gray-200"
                    onBlur={handleInputBlur}
                  />
                ) : (
                  <div
                    className="text-5xl cursor-pointer"
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
          {isPaused ? (
            <Button variant="default" onClick={handleStartTimer}>
              開始
            </Button>
          ) : mode === "break" ? (
            <Button variant="reset" onClick={resetTimer}>
              跳過休息
            </Button>
          ) : (
            <Button variant="reset" onClick={resetTimer}>
              放棄
            </Button>
          )}
        </div>
      </div>
      {showLoginButton && (
        <div className="flex justify-center items-center bg-gray-800 bg-opacity-50 fixed inset-0">
          <div className="bg-white p-5 rounded shadow-lg flex flex-col items-center ">
            <h2 className="text-xl mb-4">請登入以保存數據</h2>
            <LoginButton />
          </div>
        </div>
      )}
    </Card>
  );
};

export default Timer;
