import { useNavigate } from "react-router-dom";
import {
  Box, Button, Container, Typography,
  Grid, Card, CardContent, AppBar, Toolbar
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentIcon from "@mui/icons-material/Assessment";

const FEATURES = [
  { icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: "#6C63FF" }} />, title: "AI Job Match", desc: "Score your resume against any job instantly" },
  { icon: <SearchIcon sx={{ fontSize: 40, color: "#FF6584" }} />, title: "Smart Search", desc: "Find jobs by title, company, or location" },
  { icon: <AssessmentIcon sx={{ fontSize: 40, color: "#43B89C" }} />, title: "Resume Score", desc: "Get honest AI feedback to improve your CV" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", background: "transparent" }}>

      {/* Navbar */}
      <AppBar position="sticky" elevation={0} sx={{
        background: "transparent",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #eee",
        color: "#333"
      }}>
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 6 } }}>
         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  <Box
    component="img"
    src="/icons/MainLogo.png"
    alt="AI Job Hunter Logo"
    sx={{ width: 36, height: 36, objectFit: "contain" }}
  />
  <Typography variant="h6" fontWeight="bold" color="primary">
    AI Job Hunter
  </Typography>
</Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => navigate("/login")} sx={{ borderRadius: 10 }}>
              Login
            </Button>
            <Button variant="contained" onClick={() => navigate("/register")} sx={{ borderRadius: 10 }}>
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box sx={{
        background: "transparent",
        py: { xs: 10, md: 16 },
        textAlign: "center",
        color: "#fff",
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" mb={2} sx={{ fontSize: { xs: 36, md: 52 } }}>
            Find Jobs That Match
            <br />Your Resume
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85, mb: 4 }}>
            AI-powered matching · Resume scoring · Smart suggestions
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained" size="large"
              onClick={() => navigate("/register")}
              sx={{
                bgcolor: "transparent", color: "text.primary",
                px: 4, py: 1.5, fontSize: 16,
                "&:hover": { bgcolor: "rgba(0,0,0,0.05)" }
              }}
            >
              Start For Free →
            </Button>
            <Button
              variant="outlined" size="large"
              onClick={() => navigate("/login")}
              sx={{ color: "#fff", borderColor: "#fff", px: 4, py: 1.5 }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight="bold" align="center" mb={6}>
          Everything You Need
        </Typography>
        <Grid container spacing={4}>
          {FEATURES.map(({ icon, title, desc }) => (
            <Grid item xs={12} md={4} key={title}>
              <Card elevation={0} sx={{
                textAlign: "center", p: 3,
                border: "1px solid #eee", borderRadius: 3,
                "&:hover": { boxShadow: "0 8px 30px rgba(108,99,255,0.1)", transform: "translateY(-4px)" },
                transition: "all 0.2s"
              }}>
                <CardContent>
                  <Box mb={2}>{icon}</Box>
                  <Typography variant="h6" fontWeight="bold" mb={1}>{title}</Typography>
                  <Typography color="text.secondary">{desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Button
            variant="contained" size="large"
            onClick={() => navigate("/register")}
            sx={{ px: 6, py: 2, fontSize: 16, borderRadius: 10 }}
          >
            Get Started Free →
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;