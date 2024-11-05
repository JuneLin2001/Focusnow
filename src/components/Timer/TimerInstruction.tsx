import Joyride, {
  CallBackProps,
  EVENTS,
  Events,
  STATUS,
  Step,
  Placement,
} from "react-joyride";
import { useTimerStore } from "../../store/timerStore";
import settingStore from "../../store/settingStore";

interface TimerInstructionProps {
  handleCloseInstructions: () => void;
  runTour: boolean;
  setRunTour: (run: boolean) => void;
  isSideBarOpen: boolean;
  setIsSideBarOpen: (isOpen: boolean) => void;
}

const TimerInstruction: React.FC<TimerInstructionProps> = ({
  handleCloseInstructions,
  runTour,
  setRunTour,
  isSideBarOpen,
  setIsSideBarOpen,
}) => {
  const { isPaused, mode } = useTimerStore();
  const { themeMode } = settingStore();

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
      content: "點擊這裡以控制Todo List的開啟與關閉。",
      ...commonStepProps,
    },
    {
      target: "#todo-list",
      content: "這是Todo-List部分。",
      ...commonStepProps,
      placement: window.innerWidth < 1024 ? "center" : "left",
    },
    {
      target: "#new-todo",
      content: "可以在這裡輸入並新增Todos",
      ...commonStepProps,
    },
    {
      target: "#todo-list",
      content: "完成的項目在計時完成時會被一併記錄到統計資料。",
      ...commonStepProps,
      placement: window.innerWidth < 1024 ? "center" : "left",
    },
    {
      target: "#edit-timer",
      content: isPaused ? (
        <div>
          點擊時間可設定計時器的分鐘數，
          <br />
          使用「+」和「-」按鈕可快速增加或減少 5 分鐘。
        </div>
      ) : (
        <div>開始計時的時候不能修改時間</div>
      ),
      ...commonStepProps,
    },
    {
      target: "#settings-button",
      content: (
        <div>
          點設定按鈕可以設定背景音樂、休息時間
          <br />
          和進行的輪數。
        </div>
      ),
      ...commonStepProps,
    },
    {
      target: "#pip-button",
      content: <div>點擊這裡可以開啟或關閉子母畫面模式。</div>,
      ...commonStepProps,
    },
    {
      target: isPaused ? "#start-timer" : "#reset-timer",
      content: (
        <div>
          {mode === "work" ? (
            <>
              點擊「開始」即可啟動計時器，
              <br />
              計時啟動時僅能中斷，無法暫停。
            </>
          ) : (
            "點擊可跳過休息階段"
          )}
        </div>
      ),
      ...commonStepProps,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { index, status, type } = data;

    console.log(index);

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRunTour(false);
      handleCloseInstructions();
    } else if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)
    ) {
      if (index <= 2) {
        setIsSideBarOpen(true);
        setRunTour(true);
      } else if (index >= 3) {
        setTimeout(() => {
          if (isSideBarOpen) {
            setRunTour(true);
            setIsSideBarOpen(false);
          } else {
            setRunTour(true);
          }
        }, 100);
      } else {
        setIsSideBarOpen(false);
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      disableOverlayClose={true}
      styles={{
        options: {
          arrowColor: "#e3ffeb",
          primaryColor: themeMode === "light" ? "#3b82f6" : "#000",
          zIndex: 1000,
        },
      }}
    />
  );
};

export default TimerInstruction;