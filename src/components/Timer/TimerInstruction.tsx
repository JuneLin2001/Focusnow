import React from "react";
import Joyride, { Step, CallBackProps, Placement } from "react-joyride";

interface TimerInstructionProps {
  handleCloseInstructions: () => void;
  runTour: boolean;
  setRunTour: (run: boolean) => void;
}

const TimerInstruction: React.FC<TimerInstructionProps> = ({
  handleCloseInstructions,
  runTour,
  setRunTour,
}) => {
  const commonStepProps = {
    placement: "top" as Placement,
    hideCloseButton: true,
    disableBeacon: true,
    disableOverlayClose: true,
    spotlightClicks: true,
    disableScrolling: true,
  };
  const steps: Step[] = [
    {
      target: "#toggle-sidebar",
      content: "點擊這裡以控制側邊欄開啟與關閉。",
      ...commonStepProps,
    },
    {
      target: "#todo-list",
      content: "這是您的待辦事項列表。",
      ...commonStepProps,
    },
    {
      target: "#set-timer",
      content: "您可以點擊設定計時器的分鐘數，預設為 25 分鐘。",
      ...commonStepProps,
    },
    {
      target: "#edit-timer",
      content: "使用「+」和「-」按鈕可快速增加或減少 5 分鐘。",
      ...commonStepProps,
    },
    {
      target: "#settings-button",
      content: "這是設定按鈕。",
      ...commonStepProps,
    },
    {
      target: "#start-timer",
      content: "計時完成時，將會顯示瀏覽器通知，您可以在完成後重置計時器。",
      ...commonStepProps,
    },

    {
      target: "#start-timer",
      content: "點擊「開始」以啟動計時器，計時器將開始倒數。",
      ...commonStepProps,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      setRunTour(false);
      handleCloseInstructions();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
      />
    </div>
  );
};

export default TimerInstruction;
