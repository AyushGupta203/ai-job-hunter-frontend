import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box, Container, Typography, TextField,
  Button, Card, CardContent, Alert, CircularProgress,
  Grid, Avatar, useTheme
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PostJob = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [formData, setFormData] = useState({
    title: "", company: "", location: "", description: "", salary: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/jobs", formData);
      setMessage({ text: "Job posted successfully! 🎉 Redirecting...", type: "success" });
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      setMessage({ text: err.response?.data?.msg || "Failed to post", type: "error" });
      setLoading(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
      backdropFilter: "blur(10px)",
      borderRadius: 3,
      transition: "all 0.2s",
      color: isDark ? "#f0f0f5" : "#1d1d1f",
      "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" },
      "&:hover fieldset": { borderColor: isDark ? "rgba(96,165,250,0.5) !important" : "rgba(0,113,227,0.4) !important" },
      "&.Mui-focused fieldset": { borderColor: isDark ? "#60a5fa !important" : "#0071e3 !important", borderWidth: "2px" },
      "& input": { color: isDark ? "#f0f0f5" : "#1d1d1f" },
      "& textarea": { color: isDark ? "#f0f0f5" : "#1d1d1f" },
      "& input::placeholder": { color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)", opacity: 1 },
      "& textarea::placeholder": { color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)", opacity: 1 },
    },
  };

  return (
    
    <Box sx={{ minHeight: "100vh", bgcolor: "transparent" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: "text.secondary", fontWeight: 600, '&:hover': { bgcolor: "rgba(0,0,0,0.04)" } }}
        >
          Back to Dashboard
        </Button>
        
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, mb: 5 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "rgba(0,113,227,0.1)", color: "primary.main", borderRadius: 4 }}>
            
            <WorkIcon sx={{ fontSize: 32 }} />
          
          </Avatar>
          <Box>
            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: "-0.03em" }}>
              Post a New Job
            </Typography>
            <Typography color="text.secondary" fontSize={16} fontWeight={500} mt={0.5}>
              Find the perfect candidates to join your incredible team.
            </Typography>
          </Box>
        </Box>
        

        <Card 
          sx={{ 
            borderRadius: 4, 
            boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.06)",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
            bgcolor: isDark ? "rgba(20,20,35,0.85)" : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)"
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {message.text && (
              <Alert severity={message.type} sx={{ mb: 4, borderRadius: 3, fontWeight: 500 }}>
                {message.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: isDark ? "rgba(200,210,255,0.85)" : "text.secondary", mb: 1, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 12 }}>
                    Job Title *
                  </Typography>
                  <TextField 
                    fullWidth 
                    name="title"
                    value={formData.title} 
                    onChange={handleChange}
                    required 
                    placeholder="e.g. Senior Frontend Developer" 
                    sx={inputStyles}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: isDark ? "rgba(200,210,255,0.85)" : "text.secondary", mb: 1, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 12 }}>
                    Company Name *
                  </Typography>
                  <TextField 
                    fullWidth 
                    name="company"
                    value={formData.company} 
                    onChange={handleChange}
                    required 
                    placeholder="e.g. Tech Solutions Inc." 
                    sx={inputStyles}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: isDark ? "rgba(200,210,255,0.85)" : "text.secondary", mb: 1, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 12 }}>
                    Location *
                  </Typography>
                  <TextField 
                    fullWidth 
                    name="location"
                    value={formData.location} 
                    onChange={handleChange}
                    required 
                    placeholder="e.g. Remote, San Francisco, CA" 
                    sx={inputStyles}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: isDark ? "rgba(200,210,255,0.85)" : "text.secondary", mb: 1, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 12 }}>
                    Salary (Optional)
                  </Typography>
                  <TextField
                    fullWidth
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. $120k - $150k"
                    sx={inputStyles}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: isDark ? "rgba(200,210,255,0.85)" : "text.secondary", mb: 1, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 12 }}>
                    Job Description *
                  </Typography>
                  <TextField 
                    fullWidth 
                    name="description"
                    value={formData.description} 
                    onChange={handleChange}
                    required 
                    multiline 
                    rows={8}
                    placeholder="Describe the role, key responsibilities, required skills, and any benefits..." 
                    sx={inputStyles}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button 
                    type="submit" 
                    fullWidth 
                    variant="contained"
                    size="large" 
                    disabled={loading}
                    sx={{ 
                      py: 1.8, 
                      borderRadius: 3, 
                      fontSize: 16, 
                      fontWeight: 700,
                      color: "#fff",
                      background: "linear-gradient(135deg, #0071e3 0%, #42a5f5 100%)",
                      boxShadow: "0 8px 24px rgba(0,113,227,0.3)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 32px rgba(0,113,227,0.4)",
                      },
                      transition: "all 0.2s"
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CircularProgress size={20} color="inherit" />
                        Posting...
                      </Box>
                    ) : "Publish Job Posting"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PostJob;