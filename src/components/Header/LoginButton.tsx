import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useFishesCountStore } from "../../store/fishesCountStore";
import { saveTaskData } from "../../firebase/firebaseService";
import { CircleUser, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const LoginButton = () => {
  const { user, setUser, logout } = useAuthStore();
  const resetAnalytics = useAnalyticsStore((state) => state.reset);
  const setFishesCount = useFishesCountStore((state) => state.setFishesCount);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);

      const taskDataString = localStorage.getItem("taskData");
      if (taskDataString) {
        const taskData = JSON.parse(taskDataString);
        const taskDataToSave = {
          ...taskData,
          startTime: {
            seconds: taskData.startTime.seconds,
            nanoseconds: 0,
          },
          endTime: {
            seconds: taskData.endTime.seconds,
            nanoseconds: 0,
          },
          todos: taskData.todos.map(
            (todo: {
              startTime: { seconds: number };
              doneTime: { seconds: number };
            }) => ({
              ...todo,
              startTime: {
                seconds: todo.startTime.seconds,
                nanoseconds: 0,
              },
              doneTime: todo.doneTime
                ? {
                    seconds: todo.doneTime.seconds,
                    nanoseconds: 0,
                  }
                : null,
            })
          ),
        };

        await saveTaskData(user, taskDataToSave);
      }
    } catch (error) {
      console.error("Login error", error);
    }
  };

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
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            onClick={user ? handleLogout : handleLogin}
            className="rounded-full flex items-center gap-2"
          >
            {user ? (
              <Avatar>
                <AvatarImage
                  src={user.photoURL || ""}
                  alt={user.displayName || "User"}
                />
              </Avatar>
            ) : (
              <Avatar>
                <AvatarFallback>
                  <CircleUser className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
          </Button>
        </DropdownMenuTrigger>
        {user && (
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
        )}
      </DropdownMenu>
    </div>
  );
};

export default LoginButton;
