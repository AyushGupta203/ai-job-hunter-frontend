import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { ThemeToggleProvider } from "./context/ThemeToggleContext";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeToggleProvider>
      <CssBaseline />
      <App />
    </ThemeToggleProvider>
  </StrictMode>
);