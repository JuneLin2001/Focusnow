import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useFishesCountStore } from "../../store/fishesCountStore";
import { LogOut, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import localforage from "localforage";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import LoginForm from "./LoginForm";
import { toast } from "react-toastify";

const LoginButton = () => {
  const { user, logout, updateUserProfile } = useAuthStore();
  const resetAnalytics = useAnalyticsStore((state) => state.reset);
  const setFishesCount = useFishesCountStore((state) => state.setFishesCount);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");

  const handleOpenProfileDialog = () => {
    if (!user) {
      return;
    }
    setIsProfileDialogOpen(true);
  };

  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile(newDisplayName);
      toast.success("使用者名稱已更新！");
      setIsProfileDialogOpen(false);
      setNewDisplayName("");
    } catch (error) {
      toast.error("更新失敗，請稍後再試");
      console.error("Profile update error", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      resetAnalytics();
      setFishesCount(0);
      localStorage.clear();
      await localforage.clear();
      console.log("Successfully logged out and cleared all local data.");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <>
      {user ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="roundedicon">
                <Avatar>
                  <AvatarImage
                    src={user.photoURL || ""}
                    alt={user.displayName || "User"}
                  />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user.displayName}
                <br />
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleOpenProfileDialog}>
                <RefreshCcw />
                &nbsp; 更新使用者資訊
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                &nbsp; 登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog
            open={isProfileDialogOpen}
            onOpenChange={setIsProfileDialogOpen}
          >
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
                <Button
                  variant="link"
                  onClick={() => setIsProfileDialogOpen(false)}
                >
                  取消
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <LoginForm />
      )}
    </>
  );
};

export default LoginButton;
