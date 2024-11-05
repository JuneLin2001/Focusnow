import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartTimerInstructionProps {
  isSideBarOpen: boolean;
  handleStartTour: () => void;
}

const StartTimerInstruction: React.FC<StartTimerInstructionProps> = ({
  isSideBarOpen,
  handleStartTour,
}) => {
  return (
    <div
      className={`absolute left-4 top-20 z-50 ${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
    >
      <Button
        variant="timerGhost"
        size="icon"
        onClick={handleStartTour}
        className="mt-4"
      >
        <Lightbulb />
      </Button>
    </div>
  );
};

export default StartTimerInstruction;
