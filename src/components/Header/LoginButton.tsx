// import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useFishesCountStore } from "../../store/fishesCountStore";
import {
  LogOut,
  // RefreshCcw
} from "lucide-react";
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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import LoginForm from "./LoginForm";
// import ProfileDialog from "./ProfileDialog";

const LoginButton = () => {
  const {
    user,
    logout,
    // updateUserProfile
  } = useAuthStore();
  const resetAnalytics = useAnalyticsStore((state) => state.reset);
  const setFishesCount = useFishesCountStore((state) => state.setFishesCount);
  // const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  // const handleOpenProfileDialog = () => {
  //   if (!user) {
  //     return;
  //   }
  //   setIsProfileDialogOpen(true);
  // };

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
              {/* <DropdownMenuItem onClick={handleOpenProfileDialog}>
                <RefreshCcw />
                &nbsp; 更新使用者資訊
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                &nbsp; 登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <ProfileDialog
            isOpen={isProfileDialogOpen}
            onClose={() => setIsProfileDialogOpen(false)}
            onUpdate={updateUserProfile}
            initialDisplayName={user.displayName || ""}
          /> */}
        </>
      ) : (
        <LoginForm />
      )}
    </>
  );
};

export default LoginButton;
