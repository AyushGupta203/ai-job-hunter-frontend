import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box, Container, Typography, Card, CardContent,
  Chip, Button, Avatar, CircularProgress, Alert, Collapse, LinearProgress, Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analyzing, setAnalyzing] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/applications/job/${jobId}`);
        setApplicants(res.data);
      } catch (err) {
        setError("Could not load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetch();

  }, [jobId]);

  const updateStatus = async (id, status) => {
    try {
      await API.put("/applications/status", { applicationId: id, status });
      setApplicants((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const hire = async (id) => {
    try {
      await API.put("/applications/hire", { applicationId: id });
      setApplicants((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: "hired" } : app))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const scoreColor = (s) => s >= 70 ? "success" : s >= 50 ? "warning" : "error";

  if (loading) return (
    <Box sx={{ minHeight: "100vh", background: "transparent" }}>
      <Navbar />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    </Box>
  );

  const handleAnalyze = async (id) => {
    setAnalyzing(id);
    try {
      const res = await API.post("/ai/analyze-applicant", { applicationId: id });
      setApplicants((prev) =>
        prev.map((app) => (app._id === id ? { ...app, aiAnalysis: res.data } : app))
      );
    } catch (err) {
      alert(err.response?.data?.msg || "Analysis failed");
    } finally {
      setAnalyzing(null);
    }
  };

  const toggleExpand = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <Box sx={{ minHeight: "100vh", background: "transparent" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/home")} sx={{ mb: 3 }}>
          Back to Dashboard
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
          <PeopleIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">Applicants</Typography>
            <Typography color="text.secondary">
              {applicants.length} candidate{applicants.length !== 1 ? "s" : ""} applied
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {applicants.length === 0 && (
          <Card elevation={0} sx={{ border: "2px dashed #ddd", borderRadius: 3, p: 6, textAlign: "center" }}>
            <Typography color="text.secondary">No applicants yet</Typography>
          </Card>
        )}

        {applicants.map((app) => (
          <Card key={app._id} elevation={0} sx={{
            mb: 2, border: "1px solid #eee", borderRadius: 3,
            "&:hover": { boxShadow: "0 4px 16px rgba(108,99,255,0.08)" },
            transition: "box-shadow 0.2s"
          }}>
            <CardContent sx={{ p: 3 }}>
              {/* Top Row */}
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap", gap: 2
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold" }}>
                    {app.userId?.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {app.userId?.name}
                      </Typography>
                      <Chip
                        label={(app.status || "applied").toUpperCase()}
                        color={
                          app.status === "hired" ? "success" :
                          app.status === "shortlisted" ? "primary" :
                          app.status === "rejected" ? "error" : "default"
                        }
                        size="small"
                        sx={{ fontWeight: "bold", fontSize: 10, height: 20 }}
                      />
                    </Box>
                    <Typography color="text.secondary" fontSize={14}>
                      {app.userId?.email}
                    </Typography>
                    <Typography color="text.secondary" fontSize={12} mt={0.3}>
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {/* Download Resume */}
                  {app.userId?.resumeUrl && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      href={app.userId.resumeUrl}
                      target="_blank"
                      sx={{ borderRadius: 980 }}
                    >
                      Resume
                    </Button>
                  )}

                  {/* AI Analyze */}
                  {!app.aiAnalysis?.matchScore ? (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={
                        analyzing === app._id
                          ? <CircularProgress size={14} color="inherit" />
                          : <AutoAwesomeIcon />
                      }
                      disabled={analyzing === app._id}
                      onClick={() => handleAnalyze(app._id)}
                      sx={{ borderRadius: 980, textTransform: "none" }}
                    >
                      {analyzing === app._id ? "Analyzing..." : "AI Analyze"}
                    </Button>
                  ) : (
                    <Chip
                      label={`AI Match: ${app.aiAnalysis.matchScore}%`}
                      color={scoreColor(app.aiAnalysis.matchScore)}
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: 13 }}
                    />
                  )}
                </Box>
              </Box>

              {/* Status Update Actions */}
              {app.status !== "hired" && app.status !== "rejected" && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                  {app.status !== "shortlisted" && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => updateStatus(app._id, "shortlisted")}
                      sx={{ borderRadius: 980, textTransform: "none" }}
                    >
                      Shortlist
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => updateStatus(app._id, "rejected")}
                    sx={{ borderRadius: 980, textTransform: "none" }}
                  >
                    Reject
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => hire(app._id)}
                    sx={{ borderRadius: 980, textTransform: "none", boxShadow: 0 }}
                  >
                    Hire
                  </Button>
                </Box>
              )}

              {/* AI Analysis Result */}
              {app.aiAnalysis?.matchScore && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }} />

                  {/* Score Bar */}
                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5
                    }}>
                      <Typography variant="caption" fontWeight={600}>
                        Match Score
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color={`${scoreColor(app.aiAnalysis.matchScore)}.main`}
                      >
                        {app.aiAnalysis.matchScore}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={app.aiAnalysis.matchScore}
                      color={scoreColor(app.aiAnalysis.matchScore)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  {/* Toggle Details */}
                  <Button
                    size="small"
                    endIcon={expanded[app._id]
                      ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => toggleExpand(app._id)}
                    sx={{ textTransform: "none" }}
                  >
                    {expanded[app._id] ? "Hide Details" : "View Details"}
                  </Button>

                  <Collapse in={expanded[app._id]}>
                    <Box sx={{ mt: 1.5 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={1.5}
                        sx={{ lineHeight: 1.7 }}
                      >
                        {app.aiAnalysis.summary}
                      </Typography>

                      {app.aiAnalysis.missingSkills?.length > 0 && (
                        <Box mb={1.5}>
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            color="error.main"
                          >
                            Missing Skills:
                          </Typography>
                          <Box sx={{
                            display: "flex", gap: 0.5,
                            flexWrap: "wrap", mt: 0.5
                          }}>
                            {app.aiAnalysis.missingSkills.map((s, i) => (
                              <Chip key={i} label={s} size="small"
                                color="error" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {app.aiAnalysis.strengths?.length > 0 && (
                        <Box>
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            color="success.main"
                          >
                            Strengths:
                          </Typography>
                          <Box sx={{
                            display: "flex", gap: 0.5,
                            flexWrap: "wrap", mt: 0.5
                          }}>
                            {app.aiAnalysis.strengths.map((s, i) => (
                              <Chip key={i} label={s} size="small"
                                color="success" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Container>
    </Box>
  );
};

export default Applicants;