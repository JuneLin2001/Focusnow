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
    <div>
      <div
        className={`absolute left-1/2 top-1/2 z-50 -translate-x-1/2 ${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
      >
        <Button className="p-2" variant="timerGhost" onClick={handleStartTour}>
          <Lightbulb />
        </Button>
      </div>
    </div>
  );
};

export default StartTimerInstruction;
