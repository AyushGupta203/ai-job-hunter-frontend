import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

import {
  Box, Container, Typography, Card, CardContent,
  Chip, LinearProgress, CircularProgress, Alert, Button,
  TextField, InputAdornment, MenuItem, Select, FormControl,
  Avatar, useTheme,
} from "@mui/material";
import { useMemo, useCallback } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import BusinessIcon from "@mui/icons-material/Business";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";

const Suggestions = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("score");

  const fetchSuggestions = useCallback(async (isRefresh = false) => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/ai/recommend", {
        params: { 
          limit: 10,
          ...(isRefresh === true ? { refresh: true } : {}) 
        }
      });

      const filteredJobs = res.data.filter(job => !job.applied);
      setSuggestions(filteredJobs);

    } catch (err) {
      if (!err.response) {
        setError("Network error. Check your internet.");
      } else {
        setError(err.response?.data?.msg || "Upload resume first");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(false);
  }, [fetchSuggestions]);
  /* Filtering + sorting logic */
 
const processedData = useMemo(() => {
  let result = [...suggestions];

  if (scoreFilter === "70") result = result.filter(s => s.matchScore >= 70);
  else if (scoreFilter === "50") result = result.filter(s => s.matchScore >= 50);

  if (searchText) {
    const q = searchText.toLowerCase();
    result = result.filter(
      s => s.title?.toLowerCase().includes(q) ||
           s.location?.toLowerCase().includes(q)
    );
  }

  if (sortBy === "score") result.sort((a, b) => b.matchScore - a.matchScore);
  else result.sort((a, b) => a.title.localeCompare(b.title));

  return result.slice(0, 8); // limit safety
}, [suggestions, scoreFilter, searchText, sortBy]);
    

  const scoreColor = (s) => (s >= 70 ? "success" : s >= 50 ? "warning" : "error");
  const scoreBg = (s) =>
    s >= 70
      ? isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)"
      : s >= 50
        ? isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)"
        : isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)";
  const scoreTextColor = (s) =>
    s >= 70 ? (isDark ? "#4ade80" : "#16a34a") : s >= 50 ? (isDark ? "#fbbf24" : "#d97706") : (isDark ? "#f87171" : "#dc2626");

  /* Stats */
  const high = suggestions.filter((s) => s.matchScore >= 70).length;
  const mid = suggestions.filter((s) => s.matchScore >= 50 && s.matchScore < 70).length;
  const low = suggestions.filter((s) => s.matchScore < 50).length;

  if (loading)
    return (
      <Box sx={{ minHeight: "100vh", background: "transparent" }}>
        <Navbar />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 12, gap: 2 }}>
          <CircularProgress size={44} />
          <Typography color="text.secondary" fontWeight={500}>Analyzing your resume against all jobs...</Typography>
        </Box>
      </Box>
    );

  return (
    <Box sx={{ minHeight: "100vh", background: "transparent" }}>
      <Navbar />

      {/* ─── HEADER ─── */}
      <Box sx={{ pt: { xs: 4, md: 6 }, pb: 3, px: 2, textAlign: "center" }}>
        <Container maxWidth="md">
          <Box sx={{ display: "inline-flex", bgcolor: isDark ? "rgba(96,165,250,0.12)" : "rgba(0,113,227,0.06)", p: 1.5, borderRadius: 3, mb: 2 }}>
            <AutoAwesomeIcon sx={{ fontSize: 32, color: "primary.main" }} />
          </Box>
          <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
            Your AI-Matched Jobs
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => fetchSuggestions(true)}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                sx={{
                  background: isDark 
                    ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" 
                    : "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  color: "white",
                  fontWeight: 700,
                  px: 4,
                  py: 1,
                  borderRadius: 4,
                  textTransform: "none",
                  fontSize: "1.05rem",
                  boxShadow: isDark 
                    ? "0 8px 20px -6px rgba(139, 92, 246, 0.5)" 
                    : "0 8px 20px -6px rgba(124, 58, 237, 0.5)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-3px) scale(1.02)",
                    boxShadow: isDark 
                      ? "0 12px 28px -8px rgba(139, 92, 246, 0.7)" 
                      : "0 12px 28px -8px rgba(124, 58, 237, 0.7)",
                  },
                  "&:active": {
                    transform: "translateY(1px)",
                  }
                }}
              >
                {loading ? "Hunting Matches..." : "AI Re-Hunt"}
              </Button>
            </Box>
          </Typography>
          
          <Typography color="text.secondary" sx={{ fontSize: 16, maxWidth: 500, mx: "auto", mb: 3 }}>
          
          </Typography>

          {/* Score distribution */}
          {suggestions.length > 0 && (
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mb: 1 }}>
              <Chip icon={<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e", ml: 0.5 }} />} label={`${high} Strong Match`} size="small" sx={{ fontWeight: 600 }} />
              <Chip icon={<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f59e0b", ml: 0.5 }} />} label={`${mid} Moderate`} size="small" sx={{ fontWeight: 600 }} />
              <Chip icon={<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#ef4444", ml: 0.5 }} />} label={`${low} Low Match`} size="small" sx={{ fontWeight: 600 }} />
            </Box>
          )}
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pb: 6 }}>
        {error && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }} action={<Button size="small" onClick={() => navigate("/upload-resume")}>Upload Resume</Button>}>
            {error}
          </Alert>
        )}

        {suggestions.length === 0 && !error && (
          <Card sx={{ py: 8, textAlign: "center", border: "2px dashed", borderColor: "divider", bgcolor: "transparent" }}>
            <AutoAwesomeIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>No matches found</Typography>
            <Typography color="text.secondary" fontSize={14} mb={3}>Upload your resume to get AI-powered job recommendations</Typography>
            <Button variant="contained" onClick={() => navigate("/upload-resume")}>Upload Resume</Button>
          </Card>
        )}

        {/* ─── FILTERS ─── */}
        {suggestions.length > 0 && (
          <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              size="small" placeholder="Filter by title or location..."
              value={searchText} onChange={(e) => setSearchText(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment> } }}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} displayEmpty startAdornment={<FilterListIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />}>
                <MenuItem value="all">All Scores</MenuItem>
                <MenuItem value="70">70%+ Strong</MenuItem>
                <MenuItem value="50">50%+ Moderate</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} startAdornment={<TuneIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />}>
                <MenuItem value="score">Best Match</MenuItem>
                <MenuItem value="title">Title A-Z</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Filtered count */}
        {suggestions.length > 0 && (
          <Typography color="text.secondary" fontSize={13} fontWeight={500} mb={2}>
            Showing {processedData.length} of {suggestions.length} matches
          </Typography>
        )}

        {/* ─── CARDS ─── */}
        {processedData.map((item, i) => (
          <Card
            key={item.jobId}
            onClick={() => navigate(`/jobs/${item.jobId}`)}
            sx={{
              mb: 2, cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 12px 32px rgba(0,0,0,0.08)",
                borderColor: isDark ? "rgba(96,165,250,0.3)" : "rgba(0,113,227,0.25)",
                "& .match-arrow": { transform: "translateX(4px)" },
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, md: 3 } }}>
                {/* Score circle */}
                <Box sx={{ position: "relative", display: "flex", flexShrink: 0 }}>
                  <CircularProgress variant="determinate" value={item.matchScore} size={64} thickness={5} color={scoreColor(item.matchScore)} sx={{ "& .MuiCircularProgress-circle": { strokeLinecap: "round" } }} />
                  <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography fontWeight={800} fontSize={18} sx={{ color: scoreTextColor(item.matchScore) }}>{item.matchScore}</Typography>
                  </Box>
                </Box>

                {/* Job info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.25, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
                    {item.company && (
                      <Chip
                        icon={<BusinessIcon sx={{ fontSize: 13 }} />}
                        label={item.company}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      icon={<LocationOnIcon sx={{ fontSize: 13 }} />}
                      label={item.location}
                      size="small"
                      sx={{ fontSize: 12, height: 24 }}
                    />
                    {item.salary && item.salary !== "Not Disclosed" && (
                      <Chip
                        label={`💰 ${item.salary}`}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600, bgcolor: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)' }}
                      />
                    )}
                    {item.matchScore >= 70 && <Chip label="Strong Match" size="small" color="success" sx={{ fontSize: 11, height: 24, fontWeight: 700 }} />}
                  </Box>

                  {/* Skills Demand & Experience Match */}
                  {((Array.isArray(item.missingSkills) ? item.missingSkills : []).length > 0 || (Array.isArray(item.strengths) ? item.strengths : []).length > 0) && (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
                      {(Array.isArray(item.strengths) ? item.strengths : []).slice(0, 2).map((s, idx) => (
                        <Chip key={`strength-${idx}`} label={`✓ ${s}`} size="small" sx={{ fontSize: 11, bgcolor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(2, 132, 199, 0.05)', color: isDark ? '#38bdf8' : '#0284c7', height: 22, fontWeight: 500 }} />
                      ))}
                      {(Array.isArray(item.missingSkills) ? item.missingSkills : []).slice(0, 2).map((ms, idx) => (
                        <Chip key={`demand-${idx}`} label={`Demand: ${ms}`} size="small" sx={{ fontSize: 11, bgcolor: isDark ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.05)', color: isDark ? '#f87171' : '#dc2626', height: 22, fontWeight: 500 }} />
                      ))}
                    </Box>
                  )}
                  {/* Match reason */}
                  {item.reason && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", fontSize: "0.85rem" }}>
                      {item.reason}
                    </Typography>
                  )}
                </Box>

                {/* Arrow */}
                <ArrowForwardIcon className="match-arrow" sx={{ color: "primary.main", fontSize: 20, transition: "transform 0.2s", flexShrink: 0 }} />
              </Box>

              {/* Progress bar */}
              <LinearProgress
                variant="determinate"
                value={item.matchScore}
                color={scoreColor(item.matchScore)}
                sx={{ mt: 2, height: 4, borderRadius: 2 }}
              />
            </CardContent>
          </Card>
        ))}
      </Container>
    </Box>
  );
};

export default Suggestions;