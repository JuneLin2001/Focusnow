import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useFishesCountStore } from "../../store/fishesCountStore";
import { LogOut } from "lucide-react";
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

const LoginButton = () => {
  const { user, logout } = useAuthStore();
  const resetAnalytics = useAnalyticsStore((state) => state.reset);
  const setFishesCount = useFishesCountStore((state) => state.setFishesCount);

  const handleLogout = async () => {
    try {
      await logout();
      resetAnalytics();
      setFishesCount(0);
    } catch (error) {
      console.error("Logout error", error);
    }
  };
  return (
    <>
      {user ? (
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
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              &nbsp; 登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <LoginForm />
      )}
    </>
  );
};

export default LoginButton;
