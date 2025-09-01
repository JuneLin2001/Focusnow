"use client";

import { useEffect } from "react";
import { useTimerStore } from "@/store/timerStore";
import LoginButton from "@/components/Auth/LoginButton";
import { requestNotificationPermission } from "@/utils/notificationService";
import PipButton from "./PipButton";
import { toast } from "react-toastify";
import { useSettingStore } from "@/store/settingStore";
import TimerProgressBar from "./TimerProgressBar";
import usePageNavigation from "@/hooks/usePageNavigation";
import CloseTimerButton from "./CloseTimerButton";
import InstructionButton from "./InstructionButton";
import { Card } from "@/components/ui/card";
import Settings from "./Settings";

interface TimerCardProps {
  isSideBarOpen: boolean;
}

const TimerCard: React.FC<TimerCardProps> = ({ isSideBarOpen }) => {
  const { showLoginButton } = useTimerStore();
  const { handleRootPageClick } = usePageNavigation();

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

  const handleCloseTimerPage = () => {
    handleRootPageClick();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Card className="bg-opacity-60 relative z-30 flex size-[500px] flex-col items-center justify-center bg-white bg-cover bg-center">
        <Settings isSideBarOpen={isSideBarOpen} />
        <CloseTimerButton
          handleCloseTimerPage={handleCloseTimerPage}
          isSideBarOpen={isSideBarOpen}
        />
        <PipButton isSideBarOpen={isSideBarOpen} />
        <div
          className={`${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
        >
          <InstructionButton isSideBarOpen={isSideBarOpen} />
          <TimerProgressBar />
        </div>
        {showLoginButton && (
          <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-gray-800">
            <div className="flex flex-col items-center rounded bg-white p-5 shadow-lg">
              <h2 className="mb-4 text-xl">請登入以保存數據</h2>
              <LoginButton />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TimerCard;
