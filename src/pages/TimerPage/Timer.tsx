import { useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTimerStore } from "../../store/timerStore";
import LoginButton from "../../components/Header/LoginButton";
import { requestNotificationPermission } from "../../utils/NotificationService";
import { Button } from "@/components/ui/button";
import SettingsDialog from "../../components/SettingsDialog";
import {
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Minus,
  Settings,
} from "lucide-react";
import settingStore from "../../store/settingStore";
import { Card } from "@/components/ui/card";

interface TimerProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

const Timer: React.FC<TimerProps> = ({ toggleSidebar, isOpen }) => {
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

  const pathColor =
    mode === "work"
      ? themeMode === "dark"
        ? "#1e3a8a"
        : "#3b82f6"
      : themeMode === "dark"
        ? "#0b4f22"
        : "#009b00";

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="z-30 bg-white bg-opacity-60 w-[500px] h-[500px] flex flex-col justify-center items-center bg-cover bg-center relative">
        <div className="absolute top-2 right-2">
          <Button
            variant="timerGhost"
            size="icon"
            onClick={handleOpenSettingsDialog}
          >
            <Settings />
          </Button>{" "}
        </div>

        <div className="absolute top-[50%] right-2">
          <Button
            className="transition-transform"
            variant="timerGhost"
            size="icon"
            onClick={toggleSidebar}
          >
            {isOpen ? <ChevronsRight /> : <ChevronsLeft />}
          </Button>
        </div>
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
          <div>
            <div className="flex flex-col justify-center items-center h-full w-full">
              <SettingsDialog
                onClose={handleCloseSettingsDialog}
                open={openSettingsDialog}
                isPaused={isPaused}
              />
              <div className="flex items-center justify-center">
                {isPaused && (
                  <Button
                    variant="timerGhost"
                    onClick={minusFiveMinutes}
                    disabled={!isPaused}
                  >
                    <Minus />
                  </Button>
                )}
                <div className="flex items-center">
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
                    onClick={addFiveMinutes}
                    disabled={!isPaused}
                  >
                    <Plus />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CircularProgressbarWithChildren>
        <div className="mt-5 flex justify-center">
          {isPaused ? (
            <Button variant="add" onClick={handleStartTimer}>
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
        {showLoginButton && (
          <div className="flex justify-center items-center bg-gray-800 bg-opacity-50 fixed inset-0">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2 className="text-xl mb-4">請登入以保存數據</h2>
              <LoginButton />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Timer;
