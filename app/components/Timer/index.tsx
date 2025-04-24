import { useEffect, useState } from "react";
import Timer from "./Timer";
import TodoList from "./TodoList";
// import TimerInstruction from "./TimerInstruction";
import ToggleTodoList from "./ToggleTodoList";
import StartTimerInstruction from "./StartTimerInstruction";
import useSettingStore from "../../store/settingStore";
import { Card } from "@/components/ui/card";

interface TimerPageProps {
  page: string | null;
  setPage: (newPage: "timer" | "analytics" | "Setting" | null) => void;
  setTargetPosition: (position: [number, number, number]) => void;
  setLookAtPosition: (position: [number, number, number]) => void;
}

const TimerPage: React.FC<TimerPageProps> = ({
  page,
  setPage,
  setTargetPosition,
  setLookAtPosition,
}) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const [runTour, setRunTour] = useState<boolean>(false);
  const hasSeenTimerInstruction = useSettingStore(
    (state) => state.hasSeenTimerInstruction,
  );

  useEffect(() => {
    if (!hasSeenTimerInstruction) {
      setRunTour(true);
    }
  }, [hasSeenTimerInstruction]);

  const handleCloseInstructions = async () => {
    setRunTour(false);
    useSettingStore.getState().setHasSeenTimerInstruction(true);
    await useSettingStore.getState().saveUserSettings();
  };
  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleStartTour = () => {
    setRunTour(true);
    setIsSideBarOpen(true);
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
        <Card className="relative z-30 flex size-[500px] flex-col items-center justify-center bg-white bg-opacity-60 bg-cover bg-center">
          <Timer
            isSideBarOpen={isSideBarOpen}
            page={page}
            setPage={setPage}
            setTargetPosition={setTargetPosition}
            setLookAtPosition={setLookAtPosition}
          />
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
