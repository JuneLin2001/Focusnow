import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";

interface InstructionButtonProps {
  isSideBarOpen: boolean;
}

const InstructionButton: React.FC<InstructionButtonProps> = ({
  isSideBarOpen,
}) => {
  const handleStartTour = () => {
    toast.warning("React Joyride 暫時不支援 React 19");
    // setRunTour(true);
    // setIsSideBarOpen(true);
  };

  return (
    <div
      className={`absolute top-20 left-4 z-50 transform transition-all duration-500 ease-in-out ${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
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

export default InstructionButton;
