import { useEffect, useState } from "react";
import { useTimerStore } from "../../store/timerStore";
import LoginButton from "../Header/LoginButton";
import { requestNotificationPermission } from "../../utils/notificationService";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Settings, X } from "lucide-react";
import PipButton from "./PipButton";
import { toast } from "react-toastify";
import useSettingStore from "../../store/settingStore";
import SettingsDialog from "./SettingsDialog";
import TimerProgressBar from "./TimerProgressBar";
interface TimerProps {
  isSideBarOpen: boolean;
  page: string | null;
  setPage: (newPage: "timer" | "analytics" | "Setting" | null) => void;
  setTargetPosition: (position: [number, number, number]) => void;
  setLookAtPosition: (position: [number, number, number]) => void;
}

const Timer: React.FC<TimerProps> = ({
  isSideBarOpen,
  setPage,
  setTargetPosition,
  setLookAtPosition,
}) => {
  const { showLoginButton } = useTimerStore();
  const { isPaused } = useTimerStore();

  const hasSeenTimerInstruction = useSettingStore(
    (state) => state.hasSeenTimerInstruction,
  );

  useEffect(() => {
    if (!hasSeenTimerInstruction) {
      toast.info("開啟通知權限以在專注完成時收到通知。");
    }

    const requestPermission = async () => {
      const granted = await requestNotificationPermission();
      if (granted && !hasSeenTimerInstruction) {
        toast.success("通知權限已獲得。");
      } else if (!granted) {
        toast.error("未獲得通知權限。");
      }
    };

    requestPermission();
  }, [hasSeenTimerInstruction]);

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

  return (
    <>
      <div
        className={`absolute right-4 top-4 transform transition-all duration-500 ease-in-out ${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
      >
        <Button variant="timerGhost" size="icon" onClick={handleCloseTimerPage}>
          <X />
        </Button>
      </div>
      <div
        className={`absolute left-4 top-4 transform transition-all duration-500 ease-in-out ${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="settings-button"
                variant="timerGhost"
                size="icon"
                onClick={handleOpenSettingsDialog}
              >
                <Settings />
              </Button>
            </TooltipTrigger>
            <TooltipContent>設定</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div
        className={`absolute left-4 top-12 transform transition-all duration-500 ease-in-out ${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
      >
        <PipButton />
      </div>
      <div
        className={`${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
      >
        <TimerProgressBar />
      </div>
      {showLoginButton && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="flex flex-col items-center rounded bg-white p-5 shadow-lg">
            <h2 className="mb-4 text-xl">請登入以保存數據</h2>
            <LoginButton />
          </div>
        </div>
      )}
      <SettingsDialog
        onClose={handleCloseSettingsDialog}
        open={openSettingsDialog}
        isPaused={isPaused}
      />
    </>
  );
};

export default Timer;
