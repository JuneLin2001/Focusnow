import { useState } from "react";
import { useTimerStore } from "@/store/timerStore";
import SettingButton from "./SettingButton";
import SettingsDialog from "./SettingsDialog";

interface SettingsProps {
  isSideBarOpen: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isSideBarOpen }) => {
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const { isPaused } = useTimerStore();

  const handleOpenSettingsDialog = () => {
    setOpenSettingsDialog(true);
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
  };

  return (
    <>
      <SettingButton
        isSideBarOpen={isSideBarOpen}
        handleOpenSettingsDialog={handleOpenSettingsDialog}
      />
      <SettingsDialog
        onClose={handleCloseSettingsDialog}
        open={openSettingsDialog}
        isPaused={isPaused}
      />
    </>
  );
};

export default Settings;
