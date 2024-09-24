import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import useAuthStore from "../store/authStore";
import {
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

interface LoginButtonProps {
  onLoginSuccess: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLoginSuccess }) => {
  const { user, setUser, logout } = useAuthStore();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user); // 更新全局狀態中的使用者資訊
      onLoginSuccess(); // Notify that login was successful
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // 使用全局狀態中的登出方法
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

  return (
    <>
      <Tooltip title={user ? "Open settings" : "Login with Google"}>
        <IconButton
          onClick={user ? handleOpenUserMenu : handleLogin} // 如果已登入則打開選單，否則直接登入
          sx={{ p: 0 }}
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
      {user && ( // 只有在用戶已登入時顯示選單
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
        </Menu>
      )}
    </>
  );
};

export default LoginButton;
