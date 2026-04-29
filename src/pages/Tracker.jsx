import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box, Container, Typography, Card, CardContent,
  Button, Chip, Collapse, CircularProgress,
  LinearProgress, Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const ScoreBar = ({ score }) => (
  <Box sx={{ mb: 1 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
      <Typography variant="caption" fontWeight="bold">Match Score</Typography>
      <Typography variant="caption" fontWeight="bold"
        color={score >= 70 ? "success.main" : score >= 50 ? "warning.main" : "error.main"}>
        {score}%
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate" value={score}
      sx={{
        height: 8, borderRadius: 4,
        bgcolor: "transparent",
        "& .MuiLinearProgress-bar": {
          bgcolor: score >= 70 ? "#4caf50" : score >= 50 ? "#ff9800" : "#f44336",
          borderRadius: 4,
        }
      }}
    />
  </Box>
);

const Tracker = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/applications");
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const toggleExpand = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAnalyze = async (applicationId, index) => {
    setAnalyzing(applicationId);
    try {
      const res = await API.post("/ai/match", { applicationId });
      const updated = [...applications];
      updated[index].aiAnalysis = res.data;
      setApplications(updated);
    } catch (err) {
      alert(err.response?.data?.msg || "Analysis failed");
    } finally {
      setAnalyzing(null);
    }
  };

  if (loading) return (
    <Box sx={{ minHeight: "100vh", background: "transparent" }}>
      <Navbar />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", background: "transparent" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={0.5}>My Applications</Typography>
        <Typography color="text.secondary" mb={4}>
          {applications.length} application{applications.length !== 1 ? "s" : ""}
        </Typography>

        {applications.length === 0 && (
          <Card elevation={0} sx={{ border: "2px dashed #ddd", borderRadius: 3, p: 6, textAlign: "center" }}>
            <Typography color="text.secondary" mb={2}>No applications yet</Typography>
            <Button variant="contained" onClick={() => navigate("/home")}>Browse Jobs</Button>
          </Card>
        )}

        {applications.map((app, index) => (
          <Card key={app._id} elevation={0} sx={{ mb: 2, border: "1px solid #eee", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">{app.jobId?.title}</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 0.5, mb: 1 }}>
                <Chip label={app.jobId?.company} size="small" variant="outlined" />
                <Chip label={app.jobId?.location} size="small" variant="outlined" />
                <Chip label={`Applied: ${new Date(app.createdAt).toLocaleDateString()}`}
                  size="small" color="primary" variant="outlined" />
              </Box>

              {app.aiAnalysis?.matchScore ? (
                <Box>
                  <Divider sx={{ my: 1.5 }} />
                  <ScoreBar score={app.aiAnalysis.matchScore} />

                  <Button
                    size="small"
                    endIcon={expanded[app._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => toggleExpand(app._id)}
                    sx={{ mt: 1 }}
                  >
                    {expanded[app._id] ? "Hide Details" : "Show Details"}
                  </Button>

                  <Collapse in={expanded[app._id]}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {app.aiAnalysis.summary}
                      </Typography>

                      {app.aiAnalysis.missingSkills?.length > 0 && (
                        <Box mb={1.5}>
                          <Typography variant="caption" fontWeight="bold" color="error">
                            Missing Skills:
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                            {app.aiAnalysis.missingSkills.map((s, i) => (
                              <Chip key={i} label={s} size="small" color="error" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {app.aiAnalysis.strengths?.length > 0 && (
                        <Box>
                          <Typography variant="caption" fontWeight="bold" color="success.main">
                            Strengths:
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                            {app.aiAnalysis.strengths.map((s, i) => (
                              <Chip key={i} label={s} size="small" color="success" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Box>
              ) : (
                <Button
                  variant="outlined" size="small"
                  startIcon={analyzing === app._id
                    ? <CircularProgress size={14} /> : <AutoAwesomeIcon />}
                  onClick={() => handleAnalyze(app._id, index)}
                  disabled={analyzing === app._id}
                  sx={{ mt: 1 }}
                >
                  {analyzing === app._id ? "Analyzing..." : "Check AI Match"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </Container>
    </Box>
  );
};

export default Tracker;