import { useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTimerStore } from "../../store/timerStore";
import LoginButton from "../Header/LoginButton";
import { requestNotificationPermission } from "../../utils/notificationService";
import { Button } from "@/components/ui/button";
import SettingsDialog from "./SettingsDialog";
import { Plus, Minus, Settings, X } from "lucide-react";
import settingStore from "../../store/settingStore";
import { Card } from "@/components/ui/card";
import TimerDisplay from "./TimerDisplay";
import { toast } from "react-toastify";

interface TimerProps {
  isSideBarOpen: boolean;
  page: string | null;
  setPage: (newPage: "timer" | "analytics" | "Setting" | null) => void;
  setTargetPosition: (position: [number, number, number]) => void;
  setLookAtPosition: (position: [number, number, number]) => void;
}

const Timer: React.FC<TimerProps> = ({
  isSideBarOpen,
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
    rotationCount,
  } = useTimerStore();

  const { themeMode } = settingStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const sendBrowserNotification = (title: string, message: string) => {
      if (Notification.permission === "granted") {
        new Notification(title, { body: message });
      } else if (Notification.permission !== "denied") {
        toast.info("請允許瀏覽器通知以啟用此功能。");
        requestNotificationPermission().then((granted) => {
          if (granted) {
            new Notification(title, { body: message });
          } else {
            console.warn("通知權限未被授予。");
          }
        });
      } else {
        console.warn("通知權限未被授予，且已被拒絕。");
      }
    };
    sendBrowserNotification("提醒", "這是你的通知訊息");
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
    <Card className="relative z-30 flex size-[500px] flex-col items-center justify-center bg-white bg-opacity-60 bg-cover bg-center">
      <div
        className={`absolute right-4 top-4 ${isSideBarOpen ? "opacity-100" : "opacity-0"} lg:opacity-100`}
      >
        <Button variant="timerGhost" size="icon" onClick={handleCloseTimerPage}>
          <X />
        </Button>
      </div>

      <div
        className={`absolute left-4 top-4 transform transition-all duration-500 ease-in-out ${isSideBarOpen ? "opacity-100" : "opacity-0"} lg:opacity-100`}
      >
        <Button
          id="settings-button"
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
        className={`transform transition-all duration-500 ease-in-out ${isSideBarOpen ? "opacity-100" : "opacity-0"} lg:opacity-100`}
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
          <div className="flex size-full flex-col items-center justify-center">
            {!isPaused && (
              <div
                className="absolute left-1/2 top-3/4 -translate-x-1/2 transform rounded-full px-3 py-1 text-center text-white"
                style={{ backgroundColor: pathColor }}
              >
                第 {rotationCount + 1} 輪
              </div>
            )}

            <SettingsDialog
              onClose={handleCloseSettingsDialog}
              open={openSettingsDialog}
              isPaused={isPaused}
            />
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
          {isPaused ? (
            <Button
              id="start-timer"
              variant="default"
              onClick={handleStartTimer}
            >
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="flex flex-col items-center rounded bg-white p-5 shadow-lg">
            <h2 className="mb-4 text-xl">請登入以保存數據</h2>
            <LoginButton />
          </div>
        </div>
      )}
    </Card>
  );
};

export default Timer;
