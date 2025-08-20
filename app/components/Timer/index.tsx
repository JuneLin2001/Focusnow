import {
  // useEffect  ,
  useState,
} from "react";
import Timer from "./Timer";
import TodoList from "./TodoList";
// import TimerInstruction from "./TimerInstruction";
import ToggleTodoList from "./ToggleTodoList";
import StartTimerInstruction from "./StartTimerInstruction";
// import { useSettingStore } from "@/store/settingStore";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";

const TimerPage = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  // const [runTour, setRunTour] = useState<boolean>(true);
  // const { hasSeenTimerInstruction } = useSettingStore();

  // useEffect(() => {
  //   if (!hasSeenTimerInstruction) {
  //     setRunTour(true);
  //   }
  // }, [hasSeenTimerInstruction]);

  // const handleCloseInstructions = async () => {
  // setRunTour(false);
  // useSettingStore.getState().setHasSeenTimerInstruction(true);
  // await useSettingStore.getState().saveUserSettings();
  // };

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleStartTour = () => {
    toast.warning("React Joyride 暫時不支援 React 19");
    // setRunTour(true);
    // setIsSideBarOpen(true);
  };

  return (
    <>
      {/* {runTour && (
        <TimerInstruction
          handleCloseInstructions={handleCloseInstructions}
          runTour={runTour}
          setRunTour={setRunTour}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )} */}
      <div className="relative flex h-screen w-screen items-center justify-center">
        <Card className="bg-opacity-60 relative z-30 flex size-[500px] flex-col items-center justify-center bg-white bg-cover bg-center">
          <Timer isSideBarOpen={isSideBarOpen} />
          <StartTimerInstruction
            isSideBarOpen={isSideBarOpen}
            handleStartTour={handleStartTour}
          />
        </Card>

        <ToggleTodoList
          toggleSidebar={toggleSidebar}
          isSideBarOpen={isSideBarOpen}
        />
      </div>
      <TodoList isSideBarOpen={isSideBarOpen} />
    </>
  );
};

export default TimerPage;
