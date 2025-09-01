import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CloseTimerButtonProps {
  handleCloseTimerPage: () => void;
  isSideBarOpen: boolean;
}

const CloseTimerButton: React.FC<CloseTimerButtonProps> = ({
  handleCloseTimerPage,
  isSideBarOpen,
}) => {
  return (
    <div
      className={`absolute top-4 right-4 transform transition-all duration-500 ease-in-out ${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
    >
      <Button variant="timerGhost" size="icon" onClick={handleCloseTimerPage}>
        <X />
      </Button>
    </div>
  );
};

export default CloseTimerButton;
