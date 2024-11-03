import { useEffect, useState } from "react";
import Timer from "./Timer.js";
import TodoList from "./TodoList.js";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsDown,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TimerInstruction from "./TimerInstruction.js";

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
      <div className="z-30">
        {runTour && (
          <TimerInstruction
            handleCloseInstructions={handleCloseInstructions}
            runTour={runTour}
            setRunTour={setRunTour}
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
          <div
            id="timer-button"
            className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-60 transform lg:-translate-y-1/2 lg:translate-x-[12.5rem]"
          >
            <Button
              id="toggle-sidebar"
              className="transition-transform"
              variant="timerGhost"
              size="icon"
              onClick={toggleSidebar}
            >
              {isSideBarOpen ? (
                <>
                  <ChevronsLeft className="hidden lg:block" />
                  <ChevronsUp className="block lg:hidden" />
                </>
              ) : (
                <>
                  <ChevronsRight className="hidden lg:block" />
                  <ChevronsDown className="block lg:hidden" />
                </>
              )}
            </Button>
          </div>
          <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-60 transform lg:-translate-y-48 lg:translate-x-[12.5rem]">
            <Button
              className="p-2"
              variant="timerGhost"
              onClick={handleStartTour}
            >
              <Lightbulb />
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 z-20">
          <TodoList isSideBarOpen={isSideBarOpen} />
        </div>
      </div>
    </>
  );
};

export default TimerPage;
