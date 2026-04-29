import { createTheme } from "@mui/material";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: { main: mode === "dark" ? "#60a5fa" : "#0071e3" },
    secondary: { main: "#6e6e73" },
    background: {
      default: "transparent",
      paper: mode === "dark" ? "rgba(10, 10, 10, 0.4)" : "rgba(255, 255, 255, 0.25)",
    },
    text: {
      primary: mode === "dark" ? "#fbfbfb" : "#1d1d1f",
      secondary: mode === "dark" ? "#a1a1aa" : "#6e6e73",
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: 16,
    h1: { fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 },
    h2: { fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 },
    h3: { fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 },
    h4: { fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.25 },
    h5: { fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.35 },
    h6: { fontSize: "1.125rem", fontWeight: 700, letterSpacing: "0", lineHeight: 1.35 },
    subtitle1: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.4, letterSpacing: "-0.005em" },
    body1: { fontSize: "1rem", lineHeight: 1.6, letterSpacing: "0.01em" },
    body2: { fontSize: "0.875rem", lineHeight: 1.57, letterSpacing: "0.01em" },
    caption: { fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 500, letterSpacing: "0.02em" },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.02em" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          transition: background-color 0.4s ease, color 0.4s ease;
          background-color: ${mode === 'dark' ? '#07070a' : '#faf8ff'};
        }
        body::before {
          content: '';
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;
          filter: blur(80px);
          pointer-events: none;
          transition: background 0.6s ease;
          background: ${mode === 'dark' 
            ? `radial-gradient(circle at 20% 30%, rgba(90, 40, 160, 0.5) 0%, transparent 50%),
               radial-gradient(circle at 80% 60%, rgba(60, 30, 140, 0.5) 0%, transparent 50%),
               radial-gradient(circle at 50% 80%, rgba(100, 50, 180, 0.4) 0%, transparent 60%)`
            : `radial-gradient(circle at 20% 30%, rgba(212, 140, 255, 0.6) 0%, transparent 50%),
               radial-gradient(circle at 80% 60%, rgba(180, 120, 255, 0.6) 0%, transparent 50%),
               radial-gradient(circle at 50% 80%, rgba(230, 180, 255, 0.6) 0%, transparent 60%)`
          };
        }
      `,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
          borderTop: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.6)"}`,
          boxShadow: mode === "dark" ? "0 10px 40px rgba(0, 0, 0, 0.5)" : "0 10px 40px rgba(0, 0, 0, 0.03)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: mode === "dark" ? "rgba(20, 20, 20, 0.35)" : "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
          borderTop: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.7)"}`,
          boxShadow: mode === "dark" ? "0 10px 40px rgba(0, 0, 0, 0.6)" : "0 10px 40px rgba(0, 0, 0, 0.04)",
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s ease",
          "&:hover": {
            borderColor: mode === "dark" ? "rgba(96, 165, 250, 0.25)" : "rgba(0, 113, 227, 0.2)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
          fontSize: "0.95rem",
          letterSpacing: "0.01em",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:active": {
            transform: "scale(0.97)",
          },
          "&.Mui-disabled": {
            opacity: 0.45,
          },
        },
        contained: {
          background: mode === "dark"
            ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            : "linear-gradient(135deg, #0071e3 0%, #005bb5 100%)",
          color: "#fff",
          boxShadow: mode === "dark"
            ? "0 4px 14px rgba(59, 130, 246, 0.35)"
            : "0 4px 14px rgba(0, 113, 227, 0.3)",
          "&:hover": {
            background: mode === "dark"
              ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
              : "linear-gradient(135deg, #0077ed 0%, #0063cc 100%)",
            boxShadow: mode === "dark"
              ? "0 8px 25px rgba(59, 130, 246, 0.45)"
              : "0 8px 25px rgba(0, 113, 227, 0.4)",
            transform: "translateY(-1px)",
          },
        },
        containedSuccess: {
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          color: "#fff",
          boxShadow: "0 4px 14px rgba(34, 197, 94, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
            boxShadow: "0 8px 25px rgba(34, 197, 94, 0.4)",
          },
        },
        containedError: {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
          },
        },
        outlined: {
          borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)",
          color: mode === "dark" ? "#e2e8f0" : "#1d1d1f",
          backdropFilter: "blur(10px)",
          "&:hover": {
            background: mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
            borderColor: mode === "dark" ? "rgba(96, 165, 250, 0.5)" : "rgba(0, 113, 227, 0.5)",
            transform: "translateY(-1px)",
          },
        },
        text: {
          color: mode === "dark" ? "#93c5fd" : "#0071e3",
          "&:hover": {
            background: mode === "dark" ? "rgba(96, 165, 250, 0.1)" : "rgba(0, 113, 227, 0.06)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 14,
            background: mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            color: mode === "dark" ? "#f0f0f5" : "#1d1d1f",
            "& fieldset": { borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.6)" },
            "&:hover fieldset": { borderColor: mode === "dark" ? "rgba(96, 165, 250, 0.6)" : "rgba(0, 113, 227, 0.6)" },
            "&.Mui-focused fieldset": { borderColor: mode === "dark" ? "#60a5fa" : "#0071e3", borderWidth: 2 },
            "& input": { color: mode === "dark" ? "#f0f0f5" : "#1d1d1f" },
            "& textarea": { color: mode === "dark" ? "#f0f0f5" : "#1d1d1f" },
            "& input::placeholder": { color: mode === "dark" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)", opacity: 1 },
            "& textarea::placeholder": { color: mode === "dark" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)", opacity: 1 },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "& .MuiInputLabel-root": {
            color: mode === "dark" ? "rgba(200,210,255,0.7)" : undefined,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: mode === "dark" ? "#60a5fa" : "#0071e3",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "transparent",
          boxShadow: "none",
          borderBottom: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          background: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
          transition: "all 0.15s ease",
        },
        clickable: {
          "&:hover": {
            background: mode === "dark" ? "rgba(96, 165, 250, 0.2)" : "rgba(0, 113, 227, 0.1)",
            color: mode === "dark" ? "#93c5fd" : "#0071e3",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 6,
          backgroundColor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        },
      },
    },
  },
});

export const lightTheme = createTheme(getDesignTokens("light"));
export const darkTheme = createTheme(getDesignTokens("dark"));