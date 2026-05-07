import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log("🚀 [Login] Form Submit Triggered!");
    console.log("📧 [Login] Email:", formData.email);
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", formData);
      login(res.data.token, res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={12} sx={{ p: 4, borderRadius: 4 }}>
          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <Box
              component="img"
              src="/icons/MainLogo.png"
              alt="AI Job Hunter Logo"
              sx={{
                width: 70,
                height: 70,
                objectFit: "contain",
                display: "block",
                mx: "auto",
                mb: 1.2,
                filter: "drop-shadow(0 0 12px rgba(108,99,255,0.6))",
              }}
            />
            <Typography variant="h5" fontWeight="bold">
              AI Job Hunter
            </Typography>
          </Box>

          <Typography sx={{ textAlign: "center", color: "text.secondary", mb: 3 }}>
            Welcome back — sign in to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} autoComplete="on">
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, fontSize: 15 }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <Typography sx={{ textAlign: "center", mt: 2.5, fontSize: 14 }}>
            Don't have an account?{" "}
            <Link
              onClick={() => navigate("/register")}
              sx={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Register here
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;