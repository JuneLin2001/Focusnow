import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import useAuthStore from "../store/authStore";
import { saveTaskData } from "../firebase/firebaseService"; // 確保導入正確
import {
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface LoginButtonProps {
  onLoginSuccess: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLoginSuccess }) => {
  const { user, setUser, logout } = useAuthStore();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false); // 用於控制彈出視窗的狀態

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);

      // 獲取並儲存 localStorage 中的任務數據
      const taskDataString = localStorage.getItem("taskData");
      if (taskDataString) {
        const taskData = JSON.parse(taskDataString);

        // 確保從 localStorage 獲取的 taskData 是符合格式的
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

        await saveTaskData(user, taskDataToSave); // 儲存任務數據到 Firestore
      }

      onLoginSuccess();
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
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
    setOpenSettingsDialog(true); // 打開彈出視窗
    handleCloseUserMenu(); // 關閉用戶菜單
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false); // 關閉彈出視窗
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
          <MenuItem onClick={handleLogout}>
            <Typography sx={{ textAlign: "center" }}>Logout</Typography>
          </MenuItem>
          <MenuItem onClick={handleOpenSettingsDialog}>
            <Typography sx={{ textAlign: "center" }}>Settings</Typography>
          </MenuItem>
        </Menu>
      )}

      {/* 設定彈出視窗 */}
      <Dialog open={openSettingsDialog} onClose={handleCloseSettingsDialog}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          {/* 在這裡放置設定頁面的內容 */}
          <Typography>這裡是設定頁面的內容。</Typography>
          {/* 例如：可以放置表單或其他設定選項 */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettingsDialog} color="primary">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginButton;
