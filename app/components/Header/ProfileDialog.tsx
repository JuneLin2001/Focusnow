import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newDisplayName: string) => Promise<void>;
  initialDisplayName: string;
}

const ProfileDialog = ({
  isOpen,
  onClose,
  onUpdate,
  initialDisplayName,
}: ProfileDialogProps) => {
  const [newDisplayName, setNewDisplayName] = useState(initialDisplayName);

  const handleProfileUpdate = async () => {
    try {
      await onUpdate(newDisplayName);
      toast.success("使用者名稱已更新！");
      onClose();
      setNewDisplayName("");
    } catch (error) {
      toast.error("更新失敗，請稍後再試");
      console.error("Profile update error", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-black/30">
          <div className="mb-4 text-lg font-semibold dark:text-white">
            更改使用者名稱
          </div>
          <Input
            placeholder="新名稱"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="timerGhost" onClick={onClose}>
              取消
            </Button>
            <Button variant="timerGhost" onClick={handleProfileUpdate}>
              更新
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileDialog;
