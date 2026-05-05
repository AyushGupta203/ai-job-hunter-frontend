import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Box, Typography, Container, Paper, CircularProgress, Alert, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading", "success", "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await API.get(`/auth/verify-email/${token}`);
        if (res.status === 200 && res.data) {
          setStatus("success");
          setMessage(typeof res.data === "string" ? res.data : "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage("Failed to verify email.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.msg || err.response?.data || "Failed to verify email. Token might be invalid or expired.");
      }
    };

    if (token) {
      verifyToken();
    } else {
      setStatus("error");
      setMessage("Invalid token.");
    }
  }, [token]);

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "transparent",
    }}>
      <Container maxWidth="sm">
        <Paper elevation={12} sx={{ p: 5, borderRadius: 4, textAlign: "center" }}>
          {status === "loading" && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5" fontWeight="bold">
                Verifying your email...
              </Typography>
              <Typography color="text.secondary" mt={1}>
                Please wait a moment while we verify your account.
              </Typography>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" color="success.main">
                Email Verified!
              </Typography>
              <Alert severity="success" sx={{ mt: 3, mb: 3, display: "flex", justifyContent: "center" }}>
                {message}
              </Alert>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => navigate("/login")}
                sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
              >
                Go to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <ErrorIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" color="error.main">
                Verification Failed
              </Typography>
              <Alert severity="error" sx={{ mt: 3, mb: 3, display: "flex", justifyContent: "center" }}>
                {message}
              </Alert>
              <Button 
                variant="outlined" 
                size="large" 
                onClick={() => navigate("/login")}
                sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
              >
                Back to Login
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default VerifyEmail;
