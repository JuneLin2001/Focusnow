import { useAuthStore } from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useFishesCountStore } from "../../store/fishesCountStore";
import { LogOut, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import LoginForm from "./LoginForm";
import { useState } from "react";
import ProfileDialog from "./ProfileDialog";
import { toast } from "react-toastify";

const LoginButton = () => {
  const { user, logout, updateUserProfile } = useAuthStore();
  const resetAnalytics = useAnalyticsStore((state) => state.reset);
  const setFishesCount = useFishesCountStore((state) => state.setFishesCount);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      resetAnalytics();
      setFishesCount(0);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleUpdateUserInfo = () => {
    if (user?.displayName === "訪客帳號") {
      toast.error("訪客帳號無法更改使用者名稱");
    } else {
      setIsDialogOpen(true);
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
              <DropdownMenuItem onClick={handleUpdateUserInfo}>
                <RefreshCcw />
                &nbsp; 更新使用者資訊
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                &nbsp; 登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isDialogOpen && (
            <ProfileDialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              onUpdate={updateUserProfile}
              initialDisplayName={user.displayName || ""}
            />
          )}
        </>
      ) : (
        <LoginForm />
      )}
    </>
  );
};

export default LoginButton;
