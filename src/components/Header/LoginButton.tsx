import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useFishesCountStore } from "../../store/fishesCountStore";
import { saveTaskData } from "../../firebase/firebaseService";
import { CircleUser } from "lucide-react"; // 使用Lucide的圖標
import { Button } from "@/components/ui/button"; // 使用自訂的Button組件
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import SettingsDialog from "../SettingsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";

const LoginButton = () => {
  const { user, setUser, logout } = useAuthStore();
  const resetAnalytics = useAnalyticsStore((state) => state.reset);
  const setFishesCount = useFishesCountStore((state) => state.setFishesCount);

  // 新增狀態來控制 SettingsDialog 的開關
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

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

        await saveTaskData(user, taskDataToSave); // 保存任務數據
      }
    } catch (error) {
      console.error("Login error", error);
    }
  };

  // 處理登出功能
  const handleLogout = async () => {
    try {
      await logout(); // 登出
      resetAnalytics(); // 重置分析數據
      setFishesCount(0); // 重置魚數
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleOpenSettingsDialog = () => {
    setOpenSettingsDialog(true);
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
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

            <DropdownMenuItem>
              <Button onClick={handleLogout}>登出</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
      <Button variant="ghost" size="icon" onClick={handleOpenSettingsDialog}>
        <Settings className="h-6 w-6" />
      </Button>
      {/* 加入 SettingsDialog */}
      <SettingsDialog
        onClose={handleCloseSettingsDialog} // 傳遞關閉函數
        open={openSettingsDialog} // 傳遞開關狀態
      />
    </div>
  );
};

export default LoginButton;
