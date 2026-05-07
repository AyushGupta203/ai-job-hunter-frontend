import { useState, useEffect } from "react";
import { 
  Box, Container, Typography, TextField, Button, Card, 
  CardContent, Grid, InputAdornment, Alert, CircularProgress 
} from "@mui/material";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import CodeIcon from "@mui/icons-material/Code";
import BusinessIcon from "@mui/icons-material/Business";
import SaveIcon from "@mui/icons-material/Save";
import { useTheme } from "@mui/material";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [form, setForm] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    leetcode: "",
    companyWebsite: "",
  });

  // Pre-fill existing data when the component loads
  useEffect(() => {
    if (user) {
      setForm({
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
        portfolio: user.socialLinks?.portfolio || "",
        leetcode: user.socialLinks?.leetcode || "",
        companyWebsite: user.companyWebsite || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form, 
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setMessage({ text: "", type: "" });
    setLoading(true);
    
    try {
      const payload = {
        socialLinks: {
          linkedin: form.linkedin,
          github: form.github,
          portfolio: form.portfolio,
          leetcode: form.leetcode,
        },
        companyWebsite: form.companyWebsite,
      };

      const res = await API.put("/users/profile", payload);
      
      // Update global context so changes reflect immediately without relogin
      if (res.data) {
        updateUser({
          socialLinks: res.data.socialLinks,
          companyWebsite: res.data.companyWebsite
        });
      }

      setMessage({ text: "Profile updated successfully! ✅", type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "transparent" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: "-0.02em" }}>
          External Links
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Enhance your profile by adding links to your portfolio, GitHub, and other professional platforms.
        </Typography>

        <Card 
          elevation={0}
          sx={{
            borderRadius: 4,
            background: isDark ? "rgba(30,30,50,0.65)" : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.04)"
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {message.text && (
              <Alert severity={message.type} sx={{ mb: 4 }}>
                {message.text}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedInIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GitHub URL"
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GitHubIcon sx={{ color: isDark ? "#fff" : "#333" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Portfolio URL"
                  name="portfolio"
                  value={form.portfolio}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LeetCode URL"
                  name="leetcode"
                  value={form.leetcode}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CodeIcon sx={{ color: "#f89f1b" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {user?.role === "recruiter" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Website"
                    name="companyWebsite"
                    value={form.companyWebsite}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSave}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ 
                    mt: 2, 
                    px: 5, 
                    py: 1.5, 
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Profile;