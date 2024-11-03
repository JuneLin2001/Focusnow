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
import TimerInstruction from "./TimerInstruction.js";
import { toast } from "react-toastify";

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

    if (hasSeenInstructions === null) {
      setShowInstructions(true);
    } else {
      const isBoolean =
        hasSeenInstructions === "true" || hasSeenInstructions === "false";
      if (!isBoolean) {
        toast.error("Invalid value for hasSeenInstructions");
        setShowInstructions(false);
      } else {
        setShowInstructions(hasSeenInstructions === "false");
      }
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
      <div className="z-30">
        {showInstructions && (
          <TimerInstruction handleCloseInstructions={handleCloseInstructions} />
        )}
        <div className="relative flex h-screen w-screen items-center justify-center">
          <Timer
            isOpen={isOpen}
            page={page}
            setPage={setPage}
            setTargetPosition={setTargetPosition}
            setLookAtPosition={setLookAtPosition}
          />
          <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-60 transform lg:-translate-y-1/2 lg:translate-x-[12.5rem]">
            <Button
              className="transition-transform"
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
