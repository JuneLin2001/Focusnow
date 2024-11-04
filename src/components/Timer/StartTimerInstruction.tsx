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
      className={`absolute left-1/2 top-2/3 z-50 -translate-x-1/2 -translate-y-60 transform lg:top-1/2 lg:-translate-y-48 lg:translate-x-[12.5rem] ${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
    >
      <Button className="p-2" variant="timerGhost" onClick={handleStartTour}>
        <Lightbulb />
      </Button>
    </div>
  );
};

export default StartTimerInstruction;
