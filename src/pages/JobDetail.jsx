import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box, Container, Typography, Button, Card,
  CardContent, Chip, Divider, Alert, CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WorkIcon from "@mui/icons-material/Work";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        setError("Job not found or server error");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await API.post("/applications", { jobId: id });
      setMessage({ text: "Applied successfully! 🎉", type: "success" });
    } catch (err) {
      setMessage({ text: err.response?.data?.msg || "Apply failed", type: "error" });
    } finally {
      setApplying(false);
    }
  };

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const res = await API.post("/ai/evaluate", { jobId: id });
      setAnalysis(res.data);
    } catch (err) {
      setMessage({ text: err.response?.data?.msg || "Evaluation failed. Did you upload a resume?", type: "error" });
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    </Box>
  );

  if (error || !job) return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Job not found"}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/home")}>
          Back to Jobs
        </Button>
      </Container>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/home")}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Back to Jobs
        </Button>

        <Card>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>

            {/* Job Header */}
            <Typography variant="h3" fontWeight={700} mb={1.5}>
              {job.title}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
              <Chip
                icon={<BusinessIcon sx={{ fontSize: 16 }} />}
                label={job.company}
                variant="outlined"
                color="primary"
              />
              <Chip
                icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
                label={job.location}
                variant="outlined"
              />
              {job.salary && job.salary !== "Not disclosed" && (
                <Chip
                  label={`💰 ${job.salary}`}
                  variant="outlined"
                  color="success"
                />
              )}
              {job.experienceLevel && job.experienceLevel !== "Not specified" && (
                <Chip
                  icon={<WorkIcon sx={{ fontSize: 16 }} />}
                  label={`Exp: ${job.experienceLevel}`}
                  variant="outlined"
                  color="secondary"
                />
              )}
            </Box>

            {job.skills && job.skills.trim() !== "" && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600} mb={1}>
                  Required Skills:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {job.skills.split(",").map((skill, idx) => (
                    <Chip key={idx} label={skill.trim()} size="small" sx={{ fontWeight: 500, bgcolor: "rgba(0,113,227,0.08)", color: "primary.main" }} />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Description — Ye Main Fix Hai */}
            <Typography variant="h6" fontWeight={600} mb={2}>
              About This Role
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",  // ← Ye important hai
                wordBreak: "break-word",
              }}
            >
              {job.description}
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Apply Section */}
            {message.text && (
              <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
                {message.text}
              </Alert>
            )}

            {user?.role === "seeker" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleApply}
                    disabled={applying || message.type === "success"}
                    startIcon={
                      applying
                        ? <CircularProgress size={16} color="inherit" />
                        : <SendIcon />
                    }
                    sx={{ px: 4, py: 1.2, borderRadius: 980 }}
                  >
                    {applying ? "Applying..." : "Apply Now"}
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={handleEvaluate}
                    disabled={evaluating || analysis !== null}
                    startIcon={
                      evaluating ? <CircularProgress size={16} /> : <AutoAwesomeIcon />
                    }
                    sx={{ px: 4, py: 1.2, borderRadius: 980, textTransform: "none" }}
                  >
                    {evaluating ? "Analyzing..." : "Analyze Match"}
                  </Button>

                  <Button
                    variant="text"
                    size="large"
                    onClick={() => navigate("/tracker")}
                    sx={{ px: 2, py: 1.2, borderRadius: 980 }}
                  >
                    My Applications
                  </Button>
                </Box>

                {analysis && (
                  <Alert 
                    severity={analysis.matchScore >= 70 ? "success" : analysis.matchScore >= 50 ? "warning" : "error"} 
                    sx={{ borderRadius: 3, p: 2 }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Match Score: {analysis.matchScore}%
                    </Typography>
                    <Typography variant="body2" mt={0.5}>
                      {analysis.summary}
                    </Typography>
                    {/* Show reason if provided */}
                    {analysis.reason && (
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        Reason: {analysis.reason}
                      </Typography>
                    )}
                  </Alert>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default JobDetail;