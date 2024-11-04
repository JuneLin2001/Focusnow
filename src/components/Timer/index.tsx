import { useEffect, useState } from "react";
import Timer from "./Timer.js";
import TodoList from "./TodoList.js";
import TimerInstruction from "./TimerInstruction";
import ToggleTodoList from "./ToggleTodoList";
import StartTimerInstruction from "./StartTimerInstruction";

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

  useEffect(() => {
    setRunTour(true);
  }, []);

  const handleCloseInstructions = () => {
    setRunTour(false);
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
      {runTour && (
        <TimerInstruction
          handleCloseInstructions={handleCloseInstructions}
          runTour={runTour}
          setRunTour={setRunTour}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}
      <div className="relative flex h-screen w-screen items-center justify-center">
        <Timer
          isSideBarOpen={isSideBarOpen}
          page={page}
          setPage={setPage}
          setTargetPosition={setTargetPosition}
          setLookAtPosition={setLookAtPosition}
        />
        <ToggleTodoList
          toggleSidebar={toggleSidebar}
          isSideBarOpen={isSideBarOpen}
        />
        <StartTimerInstruction
          isSideBarOpen={isSideBarOpen}
          handleStartTour={handleStartTour}
        />
      </div>
      <TodoList isSideBarOpen={isSideBarOpen} />
    </>
  );
};

export default TimerPage;
