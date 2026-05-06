import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, Container, Typography,
  Grid, Card, CardContent, AppBar, Toolbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/* ── Typing cursor hook ─── */
const useTyping = (words, speed = 80, pause = 2000) => {
  const [display, setDisplay] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = words[wi];
    const t = setTimeout(() => {
      if (!del) {
        setDisplay(cur.slice(0, ci + 1));
        if (ci + 1 === cur.length) setTimeout(() => setDel(true), pause);
        else setCi((c) => c + 1);
      } else {
        setDisplay(cur.slice(0, ci - 1));
        if (ci - 1 === 0) { setDel(false); setWi((w) => (w + 1) % words.length); setCi(0); }
        else setCi((c) => c - 1);
      }
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [ci, del, wi, words, speed, pause]);
  return display;
};

const FEATURES = [
  {
    icon: PsychologyIcon,
    title: "AI Job Match",
    desc: "Paste any job description — get an instant AI match score against your resume.",
  },
  {
    icon: SearchIcon,
    title: "Smart Search",
    desc: "Filter live jobs by title, location, salary and experience level in real time.",
  },
  {
    icon: AssessmentIcon,
    title: "Resume Score",
    desc: "Structured AI feedback on your CV — gaps, keywords and tone — before you apply.",
  },
  {
    icon: TrackChangesIcon,
    title: "Application Tracker",
    desc: "Track every job you applied to and manage your pipeline without spreadsheets.",
  },
  {
    icon: AutoAwesomeIcon,
    title: "AI Job Hunter",
    desc: "Tell the AI your profile. It hunts and ranks best-matched open roles for you.",
  },
  {
    icon: WorkspacePremiumIcon,
    title: "Recruiter Tools",
    desc: "Post jobs, view AI-ranked applicants and update hiring status in one dashboard.",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = isDark ? "#60a5fa" : "#0071e3";
  const typed = useTyping(["your resume", "your skills", "your future", "you"]);

  const cardBase = {
    background: isDark ? "rgba(15,15,25,0.5)" : "rgba(255,255,255,0.55)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.7)"}`,
    borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.9)"}`,
    borderRadius: "20px",
    boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.04)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "transparent" }}>

      {/* ── Navbar ── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: isDark ? "rgba(7,7,10,0.7)" : "rgba(250,248,255,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 6 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              component="img"
              src="/icons/MainLogo.png"
              alt="AI Job Hunter Logo"
              onError={(e) => { e.target.style.display = "none"; }}
              sx={{ width: 36, height: 36, objectFit: "contain" }}
            />
            <Typography variant="h6" fontWeight={800} color="text.primary">
              AI Job Hunter
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{ borderRadius: "10px", px: 2.5, fontWeight: 600 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{ borderRadius: "10px", px: 2.5, fontWeight: 700 }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Hero ── */}
      <Box sx={{ background: "transparent", py: { xs: 12, md: 18 }, textAlign: "center" }}>
        <Container maxWidth="md">

          {/* AI badge */}
          <Box
            sx={{
              display: "inline-flex", alignItems: "center", gap: 0.8,
              px: 2, py: 0.7, borderRadius: "50px", mb: 4,
              background: isDark ? "rgba(96,165,250,0.1)" : "rgba(0,113,227,0.07)",
              border: `1px solid ${isDark ? "rgba(96,165,250,0.25)" : "rgba(0,113,227,0.18)"}`,
              animation: "fadeUp 0.5s ease both",
              "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "none" } },
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 13, color: primary }} />
            <Typography variant="caption" sx={{ color: primary, fontWeight: 700, letterSpacing: "0.08em" }}>
              POWERED BY MISTRAL AI
            </Typography>
          </Box>

          {/* Headline */}
          <Typography
            variant="h2"
            fontWeight={800}
            mb={1}
            color="text.primary"
            sx={{
              fontSize: { xs: 34, md: 54 },
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              animation: "fadeUp 0.55s 0.05s ease both",
            }}
          >
            Find jobs that match
          </Typography>
          <Typography
            variant="h2"
            fontWeight={800}
            mb={4}
            sx={{
              fontSize: { xs: 34, md: 54 },
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: primary,
              minHeight: { xs: "3rem", md: "4rem" },
              animation: "fadeUp 0.6s 0.1s ease both",
            }}
          >
            {typed}
            <Box
              component="span"
              sx={{
                display: "inline-block", ml: "2px",
                animation: "blink 1s step-end infinite",
                "@keyframes blink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0 } },
              }}
            >|</Box>
          </Typography>

          <Typography
            variant="h6"
            fontWeight={400}
            sx={{
              color: "text.secondary", mb: 5, maxWidth: 480, mx: "auto",
              fontSize: { xs: 16, md: 18 }, lineHeight: 1.75,
              animation: "fadeUp 0.65s 0.15s ease both",
            }}
          >
            AI-powered matching · Resume scoring · Smart suggestions
          </Typography>

          {/* CTA buttons */}
          <Box
            sx={{
              display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap",
              animation: "fadeUp 0.7s 0.2s ease both",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<RocketLaunchIcon />}
              onClick={() => navigate("/register")}
              sx={{
                px: 4, py: 1.5, fontSize: 16, borderRadius: "12px", fontWeight: 700,
                "&:hover": { transform: "translateY(-2px)" },
                transition: "all 0.2s",
              }}
            >
              Start For Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/login")}
              sx={{
                px: 4, py: 1.5, fontSize: 16, borderRadius: "12px", fontWeight: 600,
                "&:hover": { transform: "translateY(-2px)" },
                transition: "all 0.2s",
              }}
            >
              Sign In
            </Button>
          </Box>

          {/* Trust row */}
          <Box
            sx={{
              display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap", mt: 4,
              animation: "fadeUp 0.75s 0.25s ease both",
            }}
          >
            {["Free to use", "Email verified", "AI-powered matching", "No spam"].map((t) => (
              <Box key={t} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CheckCircleIcon sx={{ fontSize: 14, color: isDark ? "#4ade80" : "#16a34a" }} />
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>{t}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Divider line ── */}
      <Box sx={{ width: "100%", height: "1px", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} />

      {/* ── Features ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <Typography
          variant="h4"
          fontWeight={800}
          align="center"
          mb={1.5}
          color="text.primary"
          sx={{ letterSpacing: "-0.02em" }}
        >
          Everything You Need
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          mb={7}
          sx={{ maxWidth: 420, mx: "auto" }}
        >
          Built for job seekers and recruiters. No fluff — just tools that work.
        </Typography>

        <Grid container spacing={2.5}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Grid item xs={12} sm={6} md={4} key={title}>
              <Card
                elevation={0}
                sx={{
                  ...cardBase,
                  textAlign: "left", height: "100%",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: isDark ? "rgba(96,165,250,0.25)" : "rgba(0,113,227,0.2)",
                    boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.5)" : "0 20px 50px rgba(0,113,227,0.08)",
                  },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Box
                    sx={{
                      width: 48, height: 48, borderRadius: "12px", mb: 2.5,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isDark ? "rgba(96,165,250,0.1)" : "rgba(0,113,227,0.07)",
                    }}
                  >
                    <Icon sx={{ fontSize: 24, color: primary }} />
                  </Box>
                  <Typography variant="h6" fontWeight={700} mb={1} color="text.primary">
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    {desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/register")}
            startIcon={<RocketLaunchIcon />}
            sx={{
              px: 5, py: 1.8, fontSize: 16, borderRadius: "12px", fontWeight: 700,
              "&:hover": { transform: "translateY(-2px)" },
              transition: "all 0.2s",
            }}
          >
            Get Started Free
          </Button>
          <Typography variant="body2" color="text.secondary" mt={1.5}>
            Free account · No credit card required
          </Typography>
        </Box>
      </Container>

      {/* ── Footer ── */}
      <Box
        sx={{
          py: 3,
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © 2026 AI Job Hunter · Built with Mistral AI
        </Typography>
      </Box>
    </Box>
  );
};

export default Landing;