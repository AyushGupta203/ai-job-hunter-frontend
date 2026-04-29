import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box, Container, Typography, Button, Card,
  CardContent, Alert, CircularProgress, LinearProgress
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const UploadResume = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ text: "Please select a PDF file", type: "error" });
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);
    try {
      await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ text: "Resume uploaded successfully! ✅", type: "success" });
    } catch (err) {
      setMessage({ text: err.response?.data?.msg || "Upload failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "transparent" }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={0.5}>Upload Resume</Typography>
        <Typography color="text.secondary" mb={4}>
          Upload your PDF resume to enable AI matching
        </Typography>

        <Card elevation={0} sx={{ border: "1px solid #eee", borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>

            {/* Upload Zone */}
            <Box sx={{
              border: "2px dashed #6C63FF66",
              borderRadius: 3, p: 5, textAlign: "center",
              background: "#6C63FF08", mb: 3,
              cursor: "pointer",
            }}
              onClick={() => document.getElementById("resume-input").click()}
            >
              {file ? (
                <Box>
                  <CheckCircleIcon sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
                  <Typography fontWeight="bold">{file.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Click to change file
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <UploadFileIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                  <Typography fontWeight="bold">Click to select PDF</Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF files only · Max 5MB
                  </Typography>
                </Box>
              )}
            </Box>

            <input
              id="resume-input" type="file" accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />

            {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

            {message.text && (
              <Alert severity={message.type} sx={{ mb: 2 }}>
                {message.text}
              </Alert>
            )}

            <Button
              fullWidth variant="contained" size="large"
              onClick={handleUpload} disabled={loading || !file}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <UploadFileIcon />}
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default UploadResume;