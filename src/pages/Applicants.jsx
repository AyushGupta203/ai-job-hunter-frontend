import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box, Container, Typography, Card, CardContent,
  Chip, Button, Avatar, CircularProgress, Alert, Collapse, LinearProgress, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import CodeIcon from "@mui/icons-material/Code";

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analyzing, setAnalyzing] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [topCandidates, setTopCandidates] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/applications/job/${jobId}`);
        setApplicants(res.data);
      } catch (err) {
        setError("Could not load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
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
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold">Applicants</Typography>
            <Typography color="text.secondary">
              {applicants.length} candidate{applicants.length !== 1 ? "s" : ""} applied
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={loadingTop ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
            disabled={loadingTop}
            onClick={async () => {
              setLoadingTop(true);
              try {
                const res = await API.get(`/ai/top-candidates/${jobId}`);
                setTopCandidates(res.data);
              } catch (err) {
                console.error("Failed to load top candidates", err);
              } finally {
                setLoadingTop(false);
              }
            }}
            sx={{
              borderRadius: 980,
              textTransform: "none",
              px: 3, py: 1.2,
              background: "linear-gradient(135deg, #6C63FF 0%, #48C6EF 100%)",
              fontWeight: 600,
              "&:hover": { background: "linear-gradient(135deg, #5a52e0 0%, #3ab5de 100%)" }
            }}
          >
            {loadingTop ? "Analyzing..." : "🏆 Find Top Candidates"}
          </Button>
        </Box>

        {/* Top Candidates Leaderboard */}
        {topCandidates.length > 0 && (
          <Card elevation={0} sx={{
            mb: 4, borderRadius: 3,
            border: "1px solid rgba(108,99,255,0.2)",
            background: "linear-gradient(135deg, rgba(108,99,255,0.03) 0%, rgba(72,198,239,0.03) 100%)"
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">🏆 Top Candidates</Typography>
                <Chip label={`${topCandidates.length} ranked`} size="small" sx={{ fontWeight: 600 }} />
              </Box>
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid #eee" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "rgba(108,99,255,0.06)" }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Candidate</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, fontSize: 13 }}>AI Score</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Fit Level</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Key Strengths</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Missing Skills</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCandidates.map((c, index) => (
                      <TableRow
                        key={c.applicationId}
                        hover
                        sx={{
                          ...(index === 0 && { bgcolor: "rgba(76,175,80,0.06)" }),
                          "&:hover": { bgcolor: "rgba(108,99,255,0.04)" }
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={700} color={index === 0 ? "success.main" : index <= 2 ? "primary.main" : "text.secondary"}>
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: "primary.main" }}>
                              {c.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${c.matchScore}%`}
                            color={c.matchScore >= 70 ? "success" : c.matchScore >= 50 ? "warning" : "error"}
                            size="small"
                            sx={{ fontWeight: 700, minWidth: 55 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={c.tag}
                            variant="outlined"
                            color={c.tag?.includes("Strong") ? "success" : c.tag?.includes("Moderate") ? "warning" : "error"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {(c.strengths || []).slice(0, 2).map((s, i) => (
                              <Chip key={i} label={s} size="small" variant="outlined" color="success" sx={{ fontSize: 11 }} />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {(c.missingSkills || []).slice(0, 2).map((s, i) => (
                              <Chip key={i} label={s} size="small" variant="outlined" color="error" sx={{ fontSize: 11 }} />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

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
                  <Avatar
                    sx={{ bgcolor: "primary.main", fontWeight: "bold", cursor: "pointer" }}
                    onClick={() => setSelectedProfile(app)}
                  >
                    {app.userId?.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ cursor: "pointer", "&:hover": { color: "primary.main", textDecoration: "underline" } }}
                        onClick={() => setSelectedProfile(app)}
                      >
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

              {/* Status Update Actions — Always visible */}
              {app.status !== "hired" && app.status !== "rejected" && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2, pt: 2, borderTop: "1px solid #f0f0f0" }}>
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
            </CardContent>
          </Card>
        ))}

        {/* Candidate Profile Dialog */}
        <Dialog
          open={Boolean(selectedProfile)}
          onClose={() => setSelectedProfile(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          {selectedProfile && (
            <>
              <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48, fontSize: 20 }}>
                  {selectedProfile.userId?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {selectedProfile.userId?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedProfile.userId?.email}
                  </Typography>
                </Box>
                <IconButton onClick={() => setSelectedProfile(null)} size="small">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                {/* Status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Typography variant="body2" fontWeight={600}>Status:</Typography>
                  <Chip
                    label={(selectedProfile.status || "applied").toUpperCase()}
                    color={
                      selectedProfile.status === "hired" ? "success" :
                      selectedProfile.status === "shortlisted" ? "primary" :
                      selectedProfile.status === "rejected" ? "error" : "default"
                    }
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                {/* Applied Date */}
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Applied: {new Date(selectedProfile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </Typography>

                {/* Social Links in Dialog */}
                {selectedProfile.userId?.socialLinks && (Object.values(selectedProfile.userId.socialLinks).some(link => link)) && (
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    {selectedProfile.userId.socialLinks.linkedin && (
                      <Button size="small" variant="outlined" startIcon={<LinkedInIcon />} href={selectedProfile.userId.socialLinks.linkedin} target="_blank" sx={{ color: "#0077b5", borderColor: "rgba(0,119,181,0.3)", borderRadius: 980, textTransform: "none" }}>
                        LinkedIn
                      </Button>
                    )}
                    {selectedProfile.userId.socialLinks.github && (
                      <Button size="small" variant="outlined" startIcon={<GitHubIcon />} href={selectedProfile.userId.socialLinks.github} target="_blank" sx={{ color: "#333", borderColor: "rgba(0,0,0,0.2)", borderRadius: 980, textTransform: "none" }}>
                        GitHub
                      </Button>
                    )}
                    {selectedProfile.userId.socialLinks.portfolio && (
                      <Button size="small" variant="outlined" startIcon={<LanguageIcon />} href={selectedProfile.userId.socialLinks.portfolio} target="_blank" sx={{ borderRadius: 980, textTransform: "none" }}>
                        Portfolio
                      </Button>
                    )}
                    {selectedProfile.userId.socialLinks.leetcode && (
                      <Button size="small" variant="outlined" startIcon={<CodeIcon />} href={selectedProfile.userId.socialLinks.leetcode} target="_blank" sx={{ color: "#f89f1b", borderColor: "rgba(248,159,27,0.3)", borderRadius: 980, textTransform: "none" }}>
                        LeetCode
                      </Button>
                    )}
                  </Box>
                )}

                <Divider sx={{ mb: 2 }} />

                {/* Resume Section */}
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  📄 Resume
                </Typography>
                {selectedProfile.userId?.resumeUrl ? (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    href={selectedProfile.userId.resumeUrl}
                    target="_blank"
                    sx={{ borderRadius: 980, mb: 2 }}
                  >
                    Download Resume
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    No resume uploaded
                  </Typography>
                )}

                <Divider sx={{ mb: 2 }} />

                {/* AI Analysis Section */}
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  🤖 AI Analysis
                </Typography>
                {selectedProfile.aiAnalysis?.matchScore ? (
                  <Box>
                    {/* Score bar */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={600}>Match Score</Typography>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color={`${scoreColor(selectedProfile.aiAnalysis.matchScore)}.main`}
                      >
                        {selectedProfile.aiAnalysis.matchScore}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={selectedProfile.aiAnalysis.matchScore}
                      color={scoreColor(selectedProfile.aiAnalysis.matchScore)}
                      sx={{ height: 8, borderRadius: 4, mb: 2 }}
                    />

                    {selectedProfile.aiAnalysis.summary && (
                      <Typography variant="body2" color="text.secondary" mb={2} sx={{ lineHeight: 1.7 }}>
                        {selectedProfile.aiAnalysis.summary}
                      </Typography>
                    )}

                    {selectedProfile.aiAnalysis.strengths?.length > 0 && (
                      <Box mb={1.5}>
                        <Typography variant="caption" fontWeight={700} color="success.main">
                          Strengths:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                          {selectedProfile.aiAnalysis.strengths.map((s, i) => (
                            <Chip key={i} label={s} size="small" color="success" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {selectedProfile.aiAnalysis.missingSkills?.length > 0 && (
                      <Box mb={1.5}>
                        <Typography variant="caption" fontWeight={700} color="error.main">
                          Missing Skills:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                          {selectedProfile.aiAnalysis.missingSkills.map((s, i) => (
                            <Chip key={i} label={s} size="small" color="error" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {selectedProfile.aiAnalysis.weaknesses?.length > 0 && (
                      <Box>
                        <Typography variant="caption" fontWeight={700} color="warning.main">
                          Weaknesses:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                          {selectedProfile.aiAnalysis.weaknesses.map((s, i) => (
                            <Chip key={i} label={s} size="small" color="warning" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      No AI analysis yet
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={
                        analyzing === selectedProfile._id
                          ? <CircularProgress size={14} color="inherit" />
                          : <AutoAwesomeIcon />
                      }
                      disabled={analyzing === selectedProfile._id}
                      onClick={() => handleAnalyze(selectedProfile._id)}
                      sx={{ borderRadius: 980, textTransform: "none" }}
                    >
                      {analyzing === selectedProfile._id ? "Analyzing..." : "Run AI Analysis"}
                    </Button>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                {selectedProfile.status !== "hired" && selectedProfile.status !== "rejected" && (
                  <>
                    {selectedProfile.status !== "shortlisted" && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => { updateStatus(selectedProfile._id, "shortlisted"); setSelectedProfile(p => ({...p, status: "shortlisted"})); }}
                        sx={{ borderRadius: 980, textTransform: "none" }}
                      >
                        Shortlist
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => { updateStatus(selectedProfile._id, "rejected"); setSelectedProfile(p => ({...p, status: "rejected"})); }}
                      sx={{ borderRadius: 980, textTransform: "none" }}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => { hire(selectedProfile._id); setSelectedProfile(p => ({...p, status: "hired"})); }}
                      sx={{ borderRadius: 980, textTransform: "none", boxShadow: 0 }}
                    >
                      Hire
                    </Button>
                  </>
                )}
                <Button onClick={() => setSelectedProfile(null)} sx={{ borderRadius: 980 }}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Applicants;