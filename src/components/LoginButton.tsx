import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import useAuthStore from "../store/authStore";
import { useAnalyticsStore } from "../store/analyticsStore";
import { saveTaskData } from "../firebase/firebaseService";
import { CircleUser } from "lucide-react"; // 使用Lucide的圖標
import { Button } from "@/components/ui/button"; // 使用自訂的Button組件
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"; // 使用自訂的下拉菜單組件
import SettingsDialog from "./SettingsDialog"; // 引入設定對話框組件

const LoginButton = () => {
  const { user, setUser, logout } = useAuthStore();
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const resetAnalytics = useAnalyticsStore((state) => state.reset);

  // 處理登錄功能
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user); // 設置用戶

      // 檢查並保存任務數據
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
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // 打開設定對話框
  const handleOpenSettingsDialog = () => {
    setOpenSettingsDialog(true);
  };

  // 關閉設定對話框
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
              <>
                <img
                  src={user.photoURL || "/src/assets/icons/globePenguin.svg"}
                  alt={user.displayName || "User"}
                  className="h-8 w-8 rounded-full"
                />
              </>
            ) : (
              <>
                <CircleUser className="h-5 w-5" /> {/* 未登入顯示圖標 */}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        {user && ( // 只有在用戶登入後才顯示菜單
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleOpenSettingsDialog}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      {/* 使用獨立的設定彈出視窗元件 */}
      {/* <SettingsDialog
        open={openSettingsDialog}
        onClose={handleCloseSettingsDialog}
      /> */}
    </div>
  );
};

export default LoginButton;
