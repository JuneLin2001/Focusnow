import { useEffect, useState } from "react";
import Timer from "./Timer.js";
import TodoList from "./TodoList.js";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TimerInstruction from "./TimerInstruction";

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
  const [showInstructions, setShowInstructions] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem("hasSeenInstructions");
    if (!hasSeenInstructions) {
      setShowInstructions(true);
    }
  }, []);

  const handleCloseInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem("hasSeenInstructions", "true");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="z-30 ">
        {showInstructions && (
          <TimerInstruction handleCloseInstructions={handleCloseInstructions} />
        )}
        <div className="w-screen h-screen flex justify-center items-center relative">
          <Timer
            isOpen={isOpen}
            page={page}
            setPage={setPage}
            setTargetPosition={setTargetPosition}
            setLookAtPosition={setLookAtPosition}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[15rem] z-40 lg:translate-x-[12.5rem] lg:-translate-y-1/2">
            <Button
              className="transition-transform "
              variant="timerGhost"
              size="icon"
              onClick={toggleSidebar}
            >
              {isOpen ? (
                <>
                  <ChevronsRight className="hidden lg:block" />
                  <ChevronsDown className="block lg:hidden" />
                </>
              ) : (
                <>
                  <ChevronsLeft className="hidden lg:block" />
                  <ChevronsUp className="block lg:hidden" />
                </>
              )}
            </Button>
          </div>
        </div>
        <TodoList isOpen={isOpen} />
      </div>
    </>
  );
};

export default TimerPage;
