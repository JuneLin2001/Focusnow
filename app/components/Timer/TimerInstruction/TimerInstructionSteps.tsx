import { Step, Placement } from "react-joyride";
import { useTimerStore } from "../../store/timerStore";

const TimerInstructionSteps = (): Step[] => {
  const commonStepProps = {
    placement: "top" as Placement,
    hideCloseButton: true,
    disableBeacon: true,
    disableOverlayClose: true,
    spotlightClicks: true,
    disableScrolling: true,
  };
  const { isPaused, mode } = useTimerStore();

  return [
    {
      target: "#toggle-sidebar",
      content: <>點擊這裡以控制 Todo List 的開啟與關閉。</>,
      ...commonStepProps,
    },
    {
      target: "#todo-list",
      content: (
        <>
          這是 Todo List 部分。
          <br />
          可以在這邊進行新增、編輯或刪除
        </>
      ),
      ...commonStepProps,
      placement: window.innerWidth < 1024 ? "center" : "left",
    },
    {
      target: "#new-todo",
      content: (
        <>
          可以在這裡輸入並新增 Todos ，
          <br />
          可以點擊「+」或是使用「Enter」來新增。
        </>
      ),
      ...commonStepProps,
    },
    {
      target: "#todo-list",
      content: <>完成的 Todo 在計時完成時會被一併記錄到統計資料。</>,
      ...commonStepProps,
      placement: window.innerWidth < 1024 ? "center" : "left",
    },
    {
      target: "#edit-timer",
      content: isPaused ? (
        <>
          點擊中心的時間可直接設定番茄鐘的分鐘數，
          <br />
          使用「+」和「-」可快速增加或減少 5 分鐘，
          <br />
          專注時間最短是 1 分鐘，最長是 120 分鐘。
        </>
      ) : (
        <>開始計時的時候不能修改時間</>
      ),
      ...commonStepProps,
    },
    {
      target: "#settings-button",
      content: (
        <>
          點設定按鈕可以設定背景音樂、休息時間
          <br />
          和進行的輪數。
        </>
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
        <>
          {mode === "work" ? (
            <>
              點擊「開始」即可啟動番茄鐘，
              <br />
              啟動後會有三秒的倒數緩衝期，
              <br />
              三秒後僅能「中斷」，無法暫停。
            </>
          ) : (
            <>
              點擊可跳過休息階段，
              <br />
              跳過後將會重置當前輪數並回到工作階段。
            </>
          )}
        </>
      ),
      ...commonStepProps,
      spotlightClicks: false,
    },
    {
      target: "#start-timer-instruction",
      content: (
        <>
          說明就到這邊告一段落！
          <br />
          點擊這裡可以重新觀看說明。
        </>
      ),
      ...commonStepProps,
    },
  ];
};

export default TimerInstructionSteps;
