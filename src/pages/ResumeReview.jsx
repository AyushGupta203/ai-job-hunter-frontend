import { useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box, Container, Typography, Button, Card,
  CardContent, LinearProgress, Chip, Alert,
  CircularProgress, Divider
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

const ResumeReview = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReview = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/ai/resume-review");
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Upload your resume first");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 70 ? "success" : s >= 50 ? "warning" : "error";

  return (
    <Box sx={{ minHeight: "100vh", background: "transparent" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={0.5}>
          AI Resume Review
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Get honest, actionable feedback on your resume
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!result && (
          <Card elevation={0} sx={{
            border: "2px dashed #6C63FF33",
            borderRadius: 3, p: 6, textAlign: "center",
            background: "linear-gradient(135deg, #6C63FF08, #764ba208)"
          }}>
            <AssessmentIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" mb={1}>Ready to analyze your resume?</Typography>
            <Typography color="text.secondary" mb={3}>
              Make sure you've uploaded your PDF resume first
            </Typography>
            <Button
              variant="contained" size="large"
              onClick={handleReview} disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AssessmentIcon />}
              sx={{ px: 4 }}
            >
              {loading ? "Analyzing..." : "Analyze My Resume"}
            </Button>
          </Card>
        )}

        {result && (
          <Box>
            {/* Score Card */}
            <Card elevation={0} sx={{
              mb: 3, borderRadius: 4,
              border: `1px solid ${result.overallScore >= 70
                ? "rgba(76, 175, 80, 0.3)" : result.overallScore >= 50
                ? "rgba(255, 152, 0, 0.3)" : "rgba(244, 67, 54, 0.3)"}`,
              background: result.overallScore >= 70
                ? "rgba(76, 175, 80, 0.08)" : result.overallScore >= 50
                ? "rgba(255, 152, 0, 0.08)" : "rgba(244, 67, 54, 0.08)"
            }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h2" fontWeight="bold"
                  color={`${scoreColor(result.overallScore)}.main`}>
                  {result.overallScore}
                </Typography>
                <Typography color="text.secondary" mb={2}>Overall Resume Score</Typography>
                <LinearProgress
                  variant="determinate" value={result.overallScore}
                  color={scoreColor(result.overallScore)}
                  sx={{ height: 10, borderRadius: 5, maxWidth: 300, mx: "auto" }}
                />
              </CardContent>
            </Card>

            {/* Summary */}
            <Card elevation={0} sx={{ mb: 2, borderRadius: 4 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>📋 Summary</Typography>
                <Typography color="text.secondary">{result.summary}</Typography>
              </CardContent>
            </Card>

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <Card elevation={0} sx={{
                mb: 2, border: "1px solid rgba(76, 175, 80, 0.2)",
                borderRadius: 4, background: "rgba(76, 175, 80, 0.03)"
              }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="subtitle1" fontWeight="bold">Strengths</Typography>
                  </Box>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {result.strengths.map((s, i) => (
                      <Typography key={i} component="li" color="text.secondary"
                        sx={{ mb: 0.5 }}>{s}</Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <Card elevation={0} sx={{
                mb: 2, border: "1px solid rgba(255, 152, 0, 0.2)",
                borderRadius: 4, background: "rgba(255, 152, 0, 0.03)"
              }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <BuildIcon color="warning" />
                    <Typography variant="subtitle1" fontWeight="bold">What to Improve</Typography>
                  </Box>
                  {result.improvements.map((item, i) => (
                    <Box key={i} sx={{
                      mb: 1.5, p: 1.5, background: "rgba(255, 152, 0, 0.05)",
                      borderRadius: 2, border: "1px solid rgba(255, 152, 0, 0.15)"
                    }}>
                      <Typography variant="body2" fontWeight="bold">
                        Issue: <Typography component="span" fontWeight="normal">{item.issue}</Typography>
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        Fix: <Typography component="span" fontWeight="normal" color="text.secondary">{item.fix}</Typography>
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Missing Keywords */}
            {result.missingKeywords?.length > 0 && (
              <Card elevation={0} sx={{ mb: 3, border: "1px solid rgba(244, 67, 54, 0.2)", borderRadius: 4, background: "rgba(244, 67, 54, 0.03)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <SearchIcon color="error" />
                    <Typography variant="subtitle1" fontWeight="bold">Missing Keywords</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {result.missingKeywords.map((k, i) => (
                      <Chip key={i} label={k} color="error" variant="outlined" size="small" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            <Button
              variant="outlined" startIcon={<RefreshIcon />}
              onClick={() => setResult(null)}
            >
              Analyze Again
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ResumeReview;