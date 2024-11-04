import Joyride, {
  CallBackProps,
  EVENTS,
  Events,
  STATUS,
  Step,
  Placement,
} from "react-joyride";

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
      placement: window.innerWidth < 1024 ? "center" : "left",
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
      content: "點擊「開始」以啟動計時器，計時器將開始倒數。",
      ...commonStepProps,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { index, status, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRunTour(false);
      handleCloseInstructions();
    } else if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)
    ) {
      if (index === 0) {
        setIsSideBarOpen(true);
        setRunTour(true);
      } else if (index === 1) {
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
    />
  );
};

export default TimerInstruction;
