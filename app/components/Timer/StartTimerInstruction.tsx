import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      className={`absolute left-4 top-20 z-50 transform transition-all duration-500 ease-in-out ${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="start-timer-instruction"
              variant="timerGhost"
              size="icon"
              onClick={handleStartTour}
              className="mt-4"
            >
              <Lightbulb />
            </Button>
          </TooltipTrigger>
          <TooltipContent>操作指南</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StartTimerInstruction;
