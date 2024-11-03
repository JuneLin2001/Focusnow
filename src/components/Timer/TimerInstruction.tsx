import React from "react";
import Joyride, { Step } from "react-joyride";

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
  const steps: Step[] = [
    {
      target: "#toggle-sidebar",
      content: "點擊這裡以開始計時器。",
      placement: "top",
    },
    {
      target: "#todo-list",
      content: "這是您的待辦事項列表。",
      placement: "top",
    },
    // {
    //   target: "#set-timer",
    //   content: "您可以設定計時器的分鐘數，預設為 25 分鐘。",
    //   placement: "top",
    // },
    // {
    //   target: "#edit-timer", // 編輯計時器的區域
    //   content: "點擊顯示的時間可以進入編輯模式，調整計時分鐘數。",
    //   placement: "top",
    // },
    // {
    //   target: "#increase-decrease", // 增加和減少時間的按鈕
    //   content: "使用「+」和「-」按鈕可快速增加或減少 5 分鐘。",
    //   placement: "top",
    // },
    // {
    //   target: "#start-timer", // 開始計時器的按鈕
    //   content: "點擊「開始」以啟動計時器，計時器將開始倒數。",
    //   placement: "top",
    // },
    // {
    //   target: "#reset-timer", // 重置計時器的按鈕
    //   content: "計時完成時，將會顯示瀏覽器通知，您可以在完成後重置計時器。",
    //   placement: "top",
    // },
    // {
    //   target: "#finish-tasks",
    //   content: "請記得在計時器運行時，不要忘記完成您的Todos哦！",
    //   placement: "top",
    // },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        callback={(data) => {
          const { status } = data;
          if (status === "finished" || status === "skipped") {
            setRunTour(false);
            handleCloseInstructions();
          }
        }}
      />
    </div>
  );
};

export default TimerInstruction;
