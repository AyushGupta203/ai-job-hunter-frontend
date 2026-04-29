import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

import {
  AppBar, Toolbar, Typography, Button, Avatar,
  Menu, MenuItem, Box, Divider, IconButton,
  CircularProgress, Tooltip, useScrollTrigger, Slide,
  ListItemIcon, ListItemText
} from "@mui/material";
import { useThemeToggle } from "../context/ThemeToggleContext";

import ExploreIcon from "@mui/icons-material/Explore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AssessmentIcon from "@mui/icons-material/Assessment";
import WorkIcon from "@mui/icons-material/Work";
import LogoutIcon from "@mui/icons-material/Logout";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import UploadFileIcon from "@mui/icons-material/UploadFile";

// Hide navbar on scroll
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeToggle();

  const [anchorEl, setAnchorEl] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navBtn = (label, path, icon) => (
    <Button
      key={path}
      onClick={() => navigate(path)}
      startIcon={icon}
      sx={{
        color: isActive(path) ? "primary.main" : "text.primary",
        fontWeight: isActive(path) ? 600 : 500,
        px: 2,
        borderRadius: 3,
        bgcolor: isActive(path) ? "rgba(0,113,227,0.15)" : "transparent",
        backdropFilter: isActive(path) ? "blur(10px)" : "none",
        "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
        transition: "all 0.3s ease",
      }}
    >
      {label}
    </Button>
  );

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    try {
      await API.post("/resume/upload", formData);
      setFile(null);
      setAnchorEl(null); // close menu
      alert("Resume uploaded successfully! ✅");
    } catch (err) {
      console.error("Upload error:", err);
      const msg = err.response?.data?.error || err.response?.data?.msg || err.message || "Upload failed";
      alert(`Upload failed: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        className="glass-navbar"
        sx={{
          bgcolor: "transparent",
        }}
      >
        <Toolbar
          sx={{
            position: "relative",
            maxWidth: "1200px",
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: 4 },
            minHeight: 64,
          }}
        >
          {/* LEFT: LOGO */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              cursor: "pointer",
            }}
            onClick={() => navigate("/home")}
          >
            <Box
              component="img"
              src="/icons/MainLogo.png"
              alt="logo"
              sx={{ width: 36, height: 36, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
            />
            <Typography variant="h6" fontWeight={700} sx={{
              background: "linear-gradient(45deg, #0071e3, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 10px rgba(0,113,227,0.2)"
            }}>
              AI Job Hunter
            </Typography>
          </Box>

          {/* CENTER: NAVIGATION */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "none", md: "flex" },
              gap: 1.5,
            }}
          >
            {user?.role === "seeker" && (
              <>
                {navBtn("Explore", "/home", <ExploreIcon />)}
                {navBtn("Applications", "/tracker", <AssignmentIcon />)}
                {navBtn("AI Hunter", "/ai-hunter", <AutoAwesomeIcon />)}
                {navBtn("Resume Score", "/resume-score", <AssessmentIcon />)}
              </>
            )}

            {user?.role === "recruiter" && (
              <Button
                variant="contained"
                startIcon={<WorkIcon />}
                onClick={() => navigate("/post-job")}
                sx={{
                  bgcolor: "rgba(0,113,227,0.8)",
                  backdropFilter: "blur(10px)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,113,227,1)" }
                }}
              >
                Post Job
              </Button>
            )}
          </Box>

          {/* RIGHT: PROFILE */}
          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Tooltip title="Toggle Theme">
              <IconButton onClick={toggleTheme} sx={{ color: "text.primary" }}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <Avatar
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  cursor: "pointer",
                  bgcolor: "primary.main",
                  width: 36,
                  height: 36,
                }}
              >
                {user?.name?.[0]}
              </Avatar>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton
                onClick={logout}
                sx={{
                  "&:hover": { color: "error.main" },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        {/* PROFILE MENU */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem disabled>{user?.name}</MenuItem>

          <Divider />

          {/* Upload Resume */}
          <MenuItem>
            <Box>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                startIcon={
                  uploading
                    ? <CircularProgress size={14} />
                    : <UploadFileIcon />
                }
              >
                Upload Resume
              </Button>
            </Box>
          </MenuItem>

          <Divider />

          <MenuItem onClick={logout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;