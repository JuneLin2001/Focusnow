import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
      setNewDisplayName(""); // 清空顯示名稱
    } catch (error) {
      toast.error("更新失敗，請稍後再試");
      console.error("Profile update error", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>更改使用者名稱</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="新名稱"
          value={newDisplayName}
          onChange={(e) => setNewDisplayName(e.target.value)}
        />
        <DialogFooter>
          <Button variant="default" onClick={handleProfileUpdate}>
            更新
          </Button>
          <Button variant="link" onClick={onClose}>
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
