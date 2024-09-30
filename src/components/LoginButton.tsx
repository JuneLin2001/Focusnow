import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import useAuthStore from "../store/authStore";
import { useAnalyticsStore } from "../store/analyticsStore";
import { saveTaskData } from "../firebase/firebaseService";
import {
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import SettingsDialog from "./SettingsDialog";
import AchievementsPage from "./AchievementsPage"; // 引入成就頁面組件

interface LoginButtonProps {
  onLoginSuccess: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLoginSuccess }) => {
  const { user, setUser, logout } = useAuthStore();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [openAchievements, setOpenAchievements] = useState(false); // 用於控制顯示成就頁面
  const resetAnalytics = useAnalyticsStore((state) => state.reset);

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

      onLoginSuccess();
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      resetAnalytics();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenSettingsDialog = () => {
    setOpenSettingsDialog(true);
    handleCloseUserMenu();
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
  };

  const handleOpenAchievements = () => {
    setOpenAchievements(true); // 打開成就頁面
    handleCloseUserMenu();
  };

  const handleCloseAchievements = () => {
    setOpenAchievements(false); // 關閉成就頁面
  };

  return (
    <>
      <Tooltip
        title={
          user ? (
            <>
              {user.displayName}
              <br />
              {user.email}
            </>
          ) : (
            "Login with Google"
          )
        }
      >
        <IconButton
          onClick={user ? handleOpenUserMenu : handleLogin}
          sx={{ p: 0, mr: 4 }}
        >
          {user ? (
            <Avatar
              alt={user.displayName || "User"}
              src={user.photoURL || "/static/images/avatar/2.jpg"}
            />
          ) : (
            <Avatar />
          )}
        </IconButton>
      </Tooltip>
      {user && (
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleOpenSettingsDialog}>
            <Typography sx={{ textAlign: "center" }}>Settings</Typography>
          </MenuItem>
          <MenuItem onClick={handleOpenAchievements}>
            {" "}
            {/* 添加成就菜單項 */}
            <Typography sx={{ textAlign: "center" }}>Achievements</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Typography sx={{ textAlign: "center" }}>Logout</Typography>
          </MenuItem>
        </Menu>
      )}

      {/* 使用獨立的設定彈出視窗元件 */}
      <SettingsDialog
        open={openSettingsDialog}
        onClose={handleCloseSettingsDialog}
      />

      <AchievementsPage
        open={openAchievements}
        onClose={handleCloseAchievements}
      />
    </>
  );
};

export default LoginButton;
