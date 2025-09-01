import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Settings } from "lucide-react";

interface SettingButtonProps {
  isSideBarOpen: boolean;
  handleOpenSettingsDialog: () => void;
}

const SettingButton: React.FC<SettingButtonProps> = ({
  isSideBarOpen,
  handleOpenSettingsDialog,
}) => {
  return (
    <>
      <div
        className={`absolute top-4 left-4 transform transition-all duration-500 ease-in-out ${isSideBarOpen ? "opacity-0" : "opacity-100"} lg:opacity-100`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="settings-button"
                variant="timerGhost"
                size="icon"
                onClick={handleOpenSettingsDialog}
              >
                <Settings />
              </Button>
            </TooltipTrigger>
            <TooltipContent>設定</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

export default SettingButton;
