import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import LoginButton from "../LoginButton";
import ToggleBgm from "./ToggleBgm";

interface ResponsiveAppBarProps {
  pages: string[]; // 新增 pages 屬性
  setPage: (newPage: "timer" | "analytics" | "game" | null) => void; // 原始 setPage
  setTargetPosition: (position: [number, number, number]) => void;
}

const ResponsiveAppBar: React.FC<ResponsiveAppBarProps> = ({
  pages, // 從 props 中解構 pages
  setPage,
  setTargetPosition,
}) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLoginSuccess = () => {
    console.log("handleLoginSuccess");
  };

  return (
    <div className="bg-gray-200">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          {/* 手機版漢堡選單 */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu(); // 關閉選單
                    if (page === "Timer") {
                      setTargetPosition([32, 20, -50]);
                      setPage("timer");
                    } else if (page === "Analytics") {
                      setTargetPosition([-75, 25, 100]);
                      setPage("analytics");
                    } else if (page === "Game") {
                      setPage(null);
                      setTargetPosition([5, 60, 10]);
                    }
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {page} Page
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          {/* 桌面版按鈕 */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  if (page === "Timer") {
                    setTargetPosition([32, 20, -50]);
                    setPage("timer");
                  } else if (page === "Analytics") {
                    setTargetPosition([-75, 25, 100]);
                    setPage("analytics");
                  } else if (page === "Game") {
                    setPage(null);
                    setTargetPosition([5, 60, 10]);
                  }
                }}
                sx={{ my: 2, color: "black", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <LoginButton onLoginSuccess={handleLoginSuccess} />
            <ToggleBgm />
          </Box>
        </Toolbar>
      </Container>
    </div>
  );
};

export default ResponsiveAppBar;
