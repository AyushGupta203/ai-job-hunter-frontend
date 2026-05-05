import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";

import {
  Box, Container, Typography, TextField, Card, CardContent,
  Button, Chip, Grid, InputAdornment, Skeleton, Avatar, useTheme,
  LinearProgress, CircularProgress, Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DeleteIcon from "@mui/icons-material/Delete";
import PauseIcon from "@mui/icons-material/Pause";
import LockIcon from "@mui/icons-material/Lock";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

/* ── helpers ── */
const timeAgo = (dateStr) => {
  if (!dateStr) return "Just posted";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const isRecent = (dateStr) => {
  if (!dateStr) return true;
  return Date.now() - new Date(dateStr).getTime() < 7 * 86400000;
};

/* ── skeleton ── */
const JobSkeleton = () => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent sx={{ p: 2.5 }}>
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="40%" height={18} sx={{ mt: 0.5 }} />
      <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
        <Skeleton variant="rounded" width={80} height={22} />
        <Skeleton variant="rounded" width={70} height={22} />
      </Box>
      <Skeleton variant="text" width="90%" sx={{ mt: 1.5 }} />
    </CardContent>
  </Card>
);

/* ══════════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const url = user?.role === "recruiter" ? "/jobs/mine" : "/jobs";
        const res = await API.get(url);
        let fetchedJobs = res.data;
        if (user?.role !== "recruiter") {
          fetchedJobs = fetchedJobs.filter((job) => job.status === "open");
        }
        setJobs(fetchedJobs);
        setFiltered(fetchedJobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user]);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(e.target.value);
    setActiveTag("");
    setFiltered(
      jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(val) ||
          j.company?.toLowerCase().includes(val) ||
          j.location?.toLowerCase().includes(val) ||
          j.description?.toLowerCase().includes(val)
      )
    );
  };

  const filterJobsByTag = (tag) => {
    if (activeTag === tag) {
      setActiveTag("");
      setSearch("");
      setFiltered(jobs);
      return;
    }
    setActiveTag(tag);
    setSearch(tag);
    const val = tag.toLowerCase();
    setFiltered(
      jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(val) ||
          j.company?.toLowerCase().includes(val) ||
          j.location?.toLowerCase().includes(val) ||
          j.description?.toLowerCase().includes(val)
      )
    );
  };

  const [statusLoading, setStatusLoading] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});

  const updateJobStatus = async (jobId, status) => {
    setStatusLoading((p) => ({ ...p, [jobId]: status }));
    try {
      await API.put("/jobs/status", { jobId, status });
      setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, status } : j)));
      setFiltered((prev) => prev.map((j) => (j._id === jobId ? { ...j, status } : j)));
    } catch (err) {
      console.error("Failed to update job status", err);
    } finally {
      setStatusLoading((p) => { const n = { ...p }; delete n[jobId]; return n; });
    }
  };

  const deleteJob = async (jobId) => {
    setDeleteLoading((p) => ({ ...p, [jobId]: true }));
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      setFiltered((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error("Failed to delete job", err);
    } finally {
      setDeleteLoading((p) => { const n = { ...p }; delete n[jobId]; return n; });
      setDeleteConfirm((p) => { const n = { ...p }; delete n[jobId]; return n; });
    }
  };

  /* ── Top Picks for seekers ── */
  const [topPicks, setTopPicks] = useState([]);
  const [topPicksLoading, setTopPicksLoading] = useState(false);
  const [topPicksError, setTopPicksError] = useState(false);

  useEffect(() => {
    if (user?.role === "seeker") {
      setTopPicksLoading(true);
      API.get("/ai/recommend")
        .then((res) => setTopPicks((res.data || []).slice(0, 3)))
        .catch(() => setTopPicksError(true))
        .finally(() => setTopPicksLoading(false));
    }
  }, [user]);

  /* ── RECRUITER DASHBOARD ── */
  if (user?.role === "recruiter") {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "transparent" }}>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 5, flexWrap: "wrap", gap: 2, background: "linear-gradient(135deg, rgba(0,113,227,0.05) 0%, rgba(66,165,245,0.05) 100%)", p: 4, borderRadius: 4, border: "1px solid rgba(0,113,227,0.1)" }}>
            <Box>
              <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: "-0.03em", mb: 0.5 }}>Dashboard</Typography>
              <Typography variant="h5" color="text.secondary" fontWeight={500} sx={{ mb: 2 }}>
                Welcome back, <Box component="span" color="primary.main" fontWeight={700}>{user?.name}</Box> 👋
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
                <Box sx={{ bgcolor: isDark ? "rgba(255,255,255,0.07)" : "#fff", p: 2.5, borderRadius: 3, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.04)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "none", minWidth: 140 }}>
                  <Typography color="text.secondary" fontSize={13} fontWeight={600} textTransform="uppercase" mb={0.5}>Total Jobs</Typography>
                  <Typography variant="h4" fontWeight={800} color="#0071e3">{jobs.length}</Typography>
                </Box>
                <Box sx={{ bgcolor: isDark ? "rgba(255,255,255,0.07)" : "#fff", p: 2.5, borderRadius: 3, boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.04)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "none", minWidth: 140 }}>
                  <Typography color="text.secondary" fontSize={13} fontWeight={600} textTransform="uppercase" mb={0.5}>Active Now</Typography>
                  <Typography variant="h4" fontWeight={800} color="#34c759">{jobs.filter((j) => j.status === "open").length}</Typography>
                </Box>
              </Box>
            </Box>
            <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => navigate("/post-job")} sx={{ px: 4, py: 1.5, borderRadius: 3, fontSize: 15, fontWeight: 700 }}>
              Post New Job
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 5, gap: 1.5 }}>
            <Box sx={{ width: 4, height: 28, bgcolor: "primary.main", borderRadius: 4 }} />
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: "-0.02em", flexGrow: 1 }}>Your Postings</Typography>
          </Box>

          {loading ? (
            [1, 2, 3].map((i) => <JobSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <Card sx={{ border: "2px dashed", borderColor: "divider", bgcolor: "transparent", py: 8, textAlign: "center", borderRadius: 3 }}>
              <WorkIcon sx={{ fontSize: 52, color: "text.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={2}>No jobs posted yet</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/post-job")} sx={{ px: 4 }}>Post Your First Job</Button>
            </Card>
          ) : (
            filtered.map((job) => (
              <Card key={job._id} sx={{ mb: 2.5, borderRadius: 3, transition: "all 0.25s", "&:hover": { boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 12px 32px rgba(0,0,0,0.08)", transform: "translateY(-2px)" } }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Avatar variant="rounded" sx={{ width: 52, height: 52, bgcolor: "rgba(0,113,227,0.08)", color: "primary.main", fontWeight: 700, borderRadius: 2.5 }}>
                          {job.company?.[0]?.toUpperCase() || "C"}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                            <Typography variant="h6" fontWeight={700}>{job.title}</Typography>
                            <Chip label={(job.status || "open").toUpperCase()} size="small" color={job.status === "closed" ? "error" : job.status === "paused" ? "warning" : "success"} sx={{ fontWeight: 700, fontSize: 10, height: 22 }} />
                          </Box>
                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                            <Chip icon={<BusinessIcon sx={{ fontSize: 14 }} />} label={job.company} size="small" sx={{ fontWeight: 500 }} />
                            <Chip icon={<LocationOnIcon sx={{ fontSize: 14 }} />} label={job.location} size="small" sx={{ fontWeight: 500 }} />
                            {job.salary && job.salary !== "Not disclosed" && <Chip label={`💰 ${job.salary}`} size="small" color="success" variant="outlined" />}
                            {job.experienceLevel && job.experienceLevel !== "Not specified" && <Chip icon={<WorkIcon sx={{ fontSize: 14 }} />} label={job.experienceLevel} size="small" color="secondary" variant="outlined" sx={{ fontWeight: 500 }} />}
                            {job.skills && job.skills.trim() !== "" && <Chip icon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />} label={job.skills.split(",")[0].trim() + (job.skills.split(",").length > 1 ? " +" : "")} size="small" sx={{ fontWeight: 500, bgcolor: "rgba(0,113,227,0.08)", color: "primary.main" }} />}
                          </Box>
                          <Typography color="text.secondary" fontSize={14} sx={{ lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{job.description}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>

                        {/* ── PRIMARY: View Applicants ── */}
                        <Tooltip title="View and manage all candidates" arrow placement="top">
                          <Button
                            variant="contained"
                            startIcon={<PeopleIcon />}
                            onClick={() => navigate(`/applicants/${job._id}`)}
                            fullWidth
                            sx={{
                              borderRadius: 2.5, py: 1.3, fontWeight: 700, fontSize: 14,
                              background: "linear-gradient(135deg, #0071e3 0%, #42a5f5 100%)",
                              boxShadow: "0 4px 14px rgba(0,113,227,0.3)",
                              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                              "&:hover": { transform: "translateY(-2px) scale(1.02)", boxShadow: "0 8px 24px rgba(0,113,227,0.45)" },
                              "&:active": { transform: "scale(0.97)" },
                            }}
                          >
                            View Applicants
                          </Button>
                        </Tooltip>

                        {/* ── SECONDARY: Status controls ── */}
                        <Box sx={{ display: "flex", gap: 1.5, mt: 1.5 }}>
                          {/* OPEN → Pause + Close */}
                          {job.status === "open" && (
                            <>
                              <Tooltip title="Temporarily stop receiving applications" arrow>
                                <Button
                                  variant="outlined" size="small" fullWidth
                                  startIcon={statusLoading[job._id] === "paused" ? <CircularProgress size={14} color="inherit" /> : <PauseIcon sx={{ fontSize: 16 }} />}
                                  disabled={!!statusLoading[job._id]}
                                  onClick={() => updateJobStatus(job._id, "paused")}
                                  sx={{
                                    borderRadius: 2, fontWeight: 700, fontSize: 12.5, py: 0.85,
                                    borderWidth: 1.5,
                                    borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)",
                                    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                                    "&:hover": {
                                      bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                                      borderColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
                                      color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
                                      transform: "translateY(-1px) scale(1.02)",
                                      borderWidth: 1.5,
                                    },
                                    "&:active": { transform: "scale(0.97)" },
                                  }}
                                >
                                  Pause
                                </Button>
                              </Tooltip>
                              <Tooltip title="Stop accepting applications" arrow>
                                <Button
                                  variant="outlined" size="small" fullWidth
                                  startIcon={statusLoading[job._id] === "closed" ? <CircularProgress size={14} color="inherit" /> : <LockIcon sx={{ fontSize: 16 }} />}
                                  disabled={!!statusLoading[job._id]}
                                  onClick={() => updateJobStatus(job._id, "closed")}
                                  sx={{
                                    borderRadius: 2, fontWeight: 700, fontSize: 12.5, py: 0.85,
                                    borderWidth: 1.5,
                                    borderColor: isDark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.3)",
                                    color: isDark ? "rgba(248,113,113,0.7)" : "rgba(185,28,28,0.6)",
                                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                                    "&:hover": {
                                      bgcolor: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
                                      borderColor: isDark ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.5)",
                                      color: isDark ? "#f87171" : "#b91c1c",
                                      transform: "translateY(-1px) scale(1.02)",
                                      borderWidth: 1.5,
                                    },
                                    "&:active": { transform: "scale(0.97)" },
                                  }}
                                >
                                  Close
                                </Button>
                              </Tooltip>
                            </>
                          )}

                          {/* PAUSED → Resume + Close */}
                          {job.status === "paused" && (
                            <>
                              <Tooltip title="Resume accepting applications" arrow>
                                <Button
                                  variant="outlined" color="success" size="small" fullWidth
                                  startIcon={statusLoading[job._id] === "open" ? <CircularProgress size={14} color="inherit" /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
                                  disabled={!!statusLoading[job._id]}
                                  onClick={() => updateJobStatus(job._id, "open")}
                                  sx={{
                                    borderRadius: 2, fontWeight: 700, fontSize: 12.5, py: 0.85,
                                    borderWidth: 1.5, borderColor: isDark ? "rgba(34,197,94,0.5)" : "rgba(34,197,94,0.6)",
                                    color: isDark ? "#4ade80" : "#15803d",
                                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                                    "&:hover": {
                                      bgcolor: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.1)",
                                      borderColor: isDark ? "rgba(34,197,94,0.7)" : "rgba(34,197,94,0.8)",
                                      transform: "translateY(-1px) scale(1.02)",
                                      borderWidth: 1.5,
                                    },
                                    "&:active": { transform: "scale(0.97)" },
                                  }}
                                >
                                  Resume
                                </Button>
                              </Tooltip>
                              <Tooltip title="Stop accepting applications" arrow>
                                <Button
                                  variant="outlined" size="small" fullWidth
                                  startIcon={statusLoading[job._id] === "closed" ? <CircularProgress size={14} color="inherit" /> : <LockIcon sx={{ fontSize: 16 }} />}
                                  disabled={!!statusLoading[job._id]}
                                  onClick={() => updateJobStatus(job._id, "closed")}
                                  sx={{
                                    borderRadius: 2, fontWeight: 700, fontSize: 12.5, py: 0.85,
                                    borderWidth: 1.5,
                                    borderColor: isDark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.3)",
                                    color: isDark ? "rgba(248,113,113,0.7)" : "rgba(185,28,28,0.6)",
                                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                                    "&:hover": {
                                      bgcolor: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
                                      borderColor: isDark ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.5)",
                                      color: isDark ? "#f87171" : "#b91c1c",
                                      transform: "translateY(-1px) scale(1.02)",
                                      borderWidth: 1.5,
                                    },
                                    "&:active": { transform: "scale(0.97)" },
                                  }}
                                >
                                  Close
                                </Button>
                              </Tooltip>
                            </>
                          )}

                          {/* CLOSED → Reopen only */}
                          {job.status === "closed" && (
                            <Tooltip title="Reopen this job and start accepting applications" arrow>
                              <Button
                                variant="outlined" color="success" size="small" fullWidth
                                startIcon={statusLoading[job._id] === "open" ? <CircularProgress size={14} color="inherit" /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
                                disabled={!!statusLoading[job._id]}
                                onClick={() => updateJobStatus(job._id, "open")}
                                sx={{
                                  borderRadius: 2, fontWeight: 700, fontSize: 12.5, py: 0.85,
                                  borderWidth: 1.5, borderColor: isDark ? "rgba(34,197,94,0.5)" : "rgba(34,197,94,0.6)",
                                  color: isDark ? "#4ade80" : "#15803d",
                                  transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                                  "&:hover": {
                                    bgcolor: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.1)",
                                    borderColor: isDark ? "rgba(34,197,94,0.7)" : "rgba(34,197,94,0.8)",
                                    transform: "translateY(-1px) scale(1.02)",
                                    borderWidth: 1.5,
                                  },
                                  "&:active": { transform: "scale(0.97)" },
                                }}
                              >
                                Reopen
                              </Button>
                            </Tooltip>
                          )}
                        </Box>

                        {/* ── DANGER: Delete ── */}
                        <Box sx={{
                          mt: 2, pt: 1.5,
                          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                        }}>
                          {!deleteConfirm[job._id] ? (
                            <Tooltip title="Permanently delete this job and all applications" arrow>
                              <Button
                                variant="text" color="error" size="small" fullWidth
                                startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                                onClick={() => setDeleteConfirm((p) => ({ ...p, [job._id]: true }))}
                                sx={{
                                  borderRadius: 2, fontWeight: 700, fontSize: 12.5, py: 0.7,
                                  color: isDark ? "rgba(248,113,113,0.75)" : "rgba(185,28,28,0.7)",
                                  transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                                  "&:hover": {
                                    color: isDark ? "#f87171" : "#b91c1c",
                                    bgcolor: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
                                    transform: "scale(1.02)",
                                  },
                                  "&:active": { transform: "scale(0.97)" },
                                }}
                              >
                                Delete Job
                              </Button>
                            </Tooltip>
                          ) : (
                            <Box sx={{
                              display: "flex", gap: 1, alignItems: "center",
                              bgcolor: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.04)",
                              borderRadius: 2, px: 1.5, py: 0.75,
                            }}>
                              <Typography variant="caption" color="error.main" fontWeight={700} sx={{ flex: 1, fontSize: 11.5 }}>
                                Delete this job?
                              </Typography>
                              <Button
                                size="small"
                                onClick={() => setDeleteConfirm((p) => { const n = { ...p }; delete n[job._id]; return n; })}
                                sx={{
                                  borderRadius: 2, fontSize: 11.5, fontWeight: 600, minWidth: 0, px: 2, py: 0.5,
                                  transition: "all 0.2s",
                                  "&:active": { transform: "scale(0.97)" },
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained" color="error" size="small"
                                disabled={deleteLoading[job._id]}
                                startIcon={deleteLoading[job._id] ? <CircularProgress size={12} color="inherit" /> : <DeleteIcon sx={{ fontSize: 14 }} />}
                                onClick={() => deleteJob(job._id)}
                                sx={{
                                  borderRadius: 2, fontSize: 11.5, fontWeight: 700, minWidth: 0, px: 2, py: 0.5,
                                  boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
                                  transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                                  "&:hover": { boxShadow: "0 4px 16px rgba(239,68,68,0.4)", transform: "scale(1.02)" },
                                  "&:active": { transform: "scale(0.96)" },
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          )}
                        </Box>

                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          )}
        </Container>
      </Box>
    );
  }

  /* ── JOB CARD ── */
  const renderJobCard = (job) => (
    <Grid item xs={12} sm={6} md={4} key={job._id}>
      <Card
        onClick={() => navigate(`/jobs/${job._id}`)}
        sx={{
          height: "100%", display: "flex", flexDirection: "column", cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
          bgcolor: isDark ? "rgba(30,30,50,0.65)" : "rgba(255,255,255,0.7)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.5)" : "0 16px 48px rgba(0,0,0,0.1)",
            borderColor: isDark ? "rgba(96,165,250,0.4)" : "rgba(0,113,227,0.3)",
            "& .card-arrow": { transform: "translateX(3px)", opacity: 1 },
          },
        }}
      >
        <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
            <Avatar variant="rounded" sx={{ width: 42, height: 42, bgcolor: isDark ? "rgba(96,165,250,0.12)" : "rgba(0,113,227,0.08)", color: "primary.main", fontWeight: 700, borderRadius: 2, fontSize: 18 }}>
              {job.company?.[0]?.toUpperCase() || "C"}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.25, mb: 0.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>{job.company}</Typography>
            </Box>
          </Box>

          {/* Meta chips */}
          <Box sx={{ display: "flex", gap: 0.75, mb: 1.5, flexWrap: "wrap" }}>
            <Chip icon={<LocationOnIcon sx={{ fontSize: 13 }} />} label={job.location} size="small" sx={{ fontSize: 12, height: 26 }} />
            {job.salary && job.salary !== "Not disclosed" ? (
              <Chip label={`💰 ${job.salary}`} size="small" sx={{ fontSize: 12, height: 26, fontWeight: 600, bgcolor: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)", color: isDark ? "#4ade80" : "#16a34a" }} />
            ) : (
              <Chip label="Salary: Undisclosed" size="small" sx={{ fontSize: 11, height: 26, opacity: 0.6 }} />
            )}
            {job.experienceLevel && job.experienceLevel !== "Not specified" && (
              <Chip icon={<WorkIcon sx={{ fontSize: 13 }} />} label={job.experienceLevel} size="small" sx={{ fontSize: 12, height: 26 }} />
            )}
            {job.skills && job.skills.trim() !== "" && (
              <Chip label={job.skills.split(",").slice(0, 2).join(", ")} size="small" sx={{ fontSize: 12, height: 26, bgcolor: isDark ? "rgba(96,165,250,0.15)" : "rgba(0,113,227,0.08)", color: "primary.main", fontWeight: 500 }} />
            )}
          </Box>

          {/* Description */}
          <Typography color="text.secondary" fontSize={13} sx={{ lineHeight: 1.55, mb: "auto", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {job.description}
          </Typography>

          {/* Footer */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, pt: 1.5, borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">{timeAgo(job.createdAt)}</Typography>
              </Box>
              {isRecent(job.createdAt) && (
                <Chip label="Active" size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, bgcolor: isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)", color: isDark ? "#4ade80" : "#16a34a" }} />
              )}
            </Box>
            <ArrowForwardIcon className="card-arrow" sx={{ fontSize: 16, color: "primary.main", opacity: 0.5, transition: "all 0.2s" }} />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  /* ── SEEKER VIEW ── */
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "transparent" }}>
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <Box sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 4, md: 5 }, px: 2 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Chip icon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />} label="AI-Powered Platform" size="small" sx={{ mb: 2, fontWeight: 600, bgcolor: isDark ? "rgba(96,165,250,0.15)" : "rgba(0,113,227,0.08)", color: "primary.main" }} />

          <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: 32, md: 48 }, letterSpacing: "-0.04em", mb: 1.5 }}>
            Your Resume Finds
            <Box component="span" sx={{ background: "linear-gradient(135deg, #0071e3, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>
              The Right Job
            </Box>
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: { xs: 15, md: 17 }, mb: 3, maxWidth: 520, mx: "auto", lineHeight: 1.6 }}>
            Upload your resume. Our AI scores it, matches you to the best roles, and tells you exactly why each job fits.
          </Typography>

          {/* CTAs */}
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap", mb: 3 }}>
            <Button variant="contained" size="large" startIcon={<UploadFileIcon />} onClick={() => navigate("/upload-resume")}
              sx={{ px: 4, py: 1.5, fontSize: 16, fontWeight: 700, borderRadius: 3 }}>
              Upload Resume & Match
            </Button>
            <Button variant="outlined" size="large" startIcon={<SearchIcon />} onClick={() => { const el = document.getElementById("search-field"); if (el) el.focus(); }}
              sx={{ px: 3, py: 1.5, fontSize: 15, borderRadius: 3 }}>
              Browse Jobs
            </Button>
          </Box>

          {/* Quick stats */}
          <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: <WorkIcon sx={{ fontSize: 16 }} />, text: `${jobs.length} Open Roles` },
              { icon: <AutoAwesomeIcon sx={{ fontSize: 16 }} />, text: "AI Matching" },
              { icon: <TrendingUpIcon sx={{ fontSize: 16 }} />, text: "Resume Scoring" },
            ].map((s, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "text.secondary", fontSize: 13, fontWeight: 500 }}>
                {s.icon} {s.text}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ─── SEARCH ─── */}
      <Container maxWidth="lg">
        <TextField
          id="search-field"
          fullWidth
          placeholder="Search by title, company, or location..."
          value={search}
          onChange={handleSearch}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "primary.main" }} /></InputAdornment> } }}
          sx={{ maxWidth: 600, mx: "auto", display: "block", mb: 2 }}
        />
        <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center", mb: 4, flexWrap: "wrap" }}>
          {["Remote", "Frontend", "Backend", "Full Stack", "React", "Node.js"].map((tag) => (
            <Chip key={tag} label={tag} size="small" clickable onClick={() => filterJobsByTag(tag)}
              sx={{
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                ...(activeTag === tag ? { bgcolor: isDark ? "rgba(96,165,250,0.25)" : "rgba(0,113,227,0.12)", color: "primary.main", borderColor: "primary.main", border: "1px solid" } : {}),
              }}
            />
          ))}
        </Box>

        {/* ─── AI BANNER ─── */}
        <Card onClick={() => navigate("/ai-hunter")} sx={{ mb: 4, cursor: "pointer", background: isDark ? "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(37,99,235,0.15) 100%)" : "linear-gradient(135deg, #0071e3 0%, #42a5f5 100%)", border: "none", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 16px 40px rgba(0,113,227,0.35)" } }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: { xs: 2.5, md: 3.5 }, flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Box sx={{ bgcolor: "rgba(255,255,255,0.15)", p: 1.5, borderRadius: 2.5, display: "flex" }}>
                <AutoAwesomeIcon sx={{ fontSize: 30, color: isDark ? "#93c5fd" : "#fff" }} />
              </Box>
              <Box>
                <Typography fontWeight={800} variant="h6" sx={{ color: isDark ? "#e2e8f0" : "#fff", mb: 0.25 }}>AI Job Matcher</Typography>
                <Typography sx={{ color: isDark ? "rgba(226,232,240,0.75)" : "rgba(255,255,255,0.85)", fontSize: 14 }}>
                  Get AI-matched jobs ranked by fit. See why each role matches your skills.
                </Typography>
              </Box>
            </Box>
            <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{ bgcolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.95)", color: isDark ? "#fff" : "#0071e3", fontWeight: 700, "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.25)" : "#fff" }, borderRadius: 2.5, px: 3 }}>
              See Matches
            </Button>
          </CardContent>
        </Card>

        {/* ─── TOP PICKS FOR YOU ─── */}
        {!topPicksError && (topPicksLoading || topPicks.length > 0) && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
              <Box sx={{ width: 4, height: 24, bgcolor: "#f59e0b", borderRadius: 4 }} />
              <AutoAwesomeIcon sx={{ color: "#f59e0b", fontSize: 22 }} />
              <Typography variant="h5" fontWeight={800} sx={{ flexGrow: 1 }}>Top Picks for You</Typography>
              <Button size="small" onClick={() => navigate("/ai-hunter")} endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 600 }}>See All</Button>
            </Box>

            {topPicksLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {topPicks.map((item, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Card
                      onClick={() => navigate(`/jobs/${item.jobId}`)}
                      sx={{
                        cursor: "pointer", height: "100%",
                        transition: "all 0.25s",
                        background: isDark
                          ? "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(59,130,246,0.08) 100%)"
                          : "linear-gradient(135deg, rgba(245,158,11,0.04) 0%, rgba(59,130,246,0.04) 100%)",
                        border: isDark ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(245,158,11,0.15)",
                        "&:hover": { transform: "translateY(-3px)", boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 12px 32px rgba(245,158,11,0.15)" },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                          <Box sx={{
                            position: "relative", width: 48, height: 48, borderRadius: "50%",
                            background: item.matchScore >= 70 ? "linear-gradient(135deg, #22c55e, #16a34a)" : item.matchScore >= 50 ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #ef4444, #dc2626)",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            <Typography fontWeight={800} fontSize={16} color="#fff">{item.matchScore}</Typography>
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography fontWeight={700} fontSize={15} noWrap>{item.title}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <LocationOnIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                              <Typography variant="caption" color="text.secondary">{item.location}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        {item.reason && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, fontStyle: "italic", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {item.reason}
                          </Typography>
                        )}
                        <LinearProgress variant="determinate" value={item.matchScore} color={item.matchScore >= 70 ? "success" : item.matchScore >= 50 ? "warning" : "error"} sx={{ mt: 1.5, height: 3, borderRadius: 2 }} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* ─── JOB LISTINGS ─── */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: "primary.main", borderRadius: 4 }} />
          <Typography variant="h5" fontWeight={800} sx={{ flexGrow: 1 }}>
            {search ? `Results for "${search}"` : "All Jobs"}
          </Typography>
          <Typography color="text.secondary" fontSize={14} fontWeight={600}>
            {filtered.length} {filtered.length === 1 ? "job" : "jobs"}
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={2} sx={{ pb: 6 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}><JobSkeleton /></Grid>
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <Card sx={{ py: 6, textAlign: "center", border: "2px dashed", borderColor: "divider", bgcolor: "transparent", mb: 6 }}>
            <SearchIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
            <Typography color="text.secondary" fontSize={16} fontWeight={500} mb={1}>No jobs found for "{search}"</Typography>
            <Button variant="outlined" size="small" onClick={() => { setSearch(""); setActiveTag(""); setFiltered(jobs); }}>Clear Search</Button>
          </Card>
        ) : (
          <Grid container spacing={2} sx={{ pb: 6 }}>
            {filtered.map((job) => renderJobCard(job))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Home;