import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Box, Button, TextField, Typography, Container,
  Paper, Alert, CircularProgress, Link,
  ToggleButton, ToggleButtonGroup
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "seeker" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log("🚀 [Register] Form Submit Triggered!");
    console.log("📦 [Register] Payload:", formData);
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/register", formData);
      login(res.data.token, res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Container maxWidth="xs">
        <Paper elevation={12} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight="bold" align="center" mb={0.5}>
            🤖 AI Job Hunter
          </Typography>
          <Typography color="text.secondary" align="center" mb={3}>
            Create your account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Role Toggle */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <ToggleButtonGroup
              value={formData.role}
              exclusive
              onChange={(e, val) => val && setFormData({ ...formData, role: val })}
              size="small"
            >
              <ToggleButton value="seeker" sx={{ px: 3, gap: 0.5 }}>
                <PersonIcon fontSize="small" /> Job Seeker
              </ToggleButton>
              <ToggleButton value="recruiter" sx={{ px: 3, gap: 0.5 }}>
                <BusinessCenterIcon fontSize="small" /> Recruiter
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" name="name"
              value={formData.name} onChange={handleChange}
              required sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" name="email"
              type="email" value={formData.email}
              onChange={handleChange} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" name="password"
              type="password" value={formData.password}
              onChange={handleChange} required sx={{ mb: 3 }} />
            <Button 
              type="submit" 
              fullWidth 
              variant="contained"
              size="large" 
              disabled={loading} 
              onClick={() => console.log("🔘 [Register] Button Clicked!")}
              sx={{ py: 1.5, fontSize: 15 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
            </Button>
          </form>

          <Typography align="center" mt={2.5} fontSize={14}>
            Already have an account?{" "}
            <Link onClick={() => navigate("/login")}
              sx={{ cursor: "pointer", fontWeight: "bold" }}>
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;