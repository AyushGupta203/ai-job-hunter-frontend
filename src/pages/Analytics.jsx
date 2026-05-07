import { Box, Container, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import Heatmap from "../components/Heatmap";
import { useAuth } from "../context/AuthContext";

const Analytics = () => {
  const { user } = useAuth();
  const isRecruiter = user?.role === "recruiter";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "transparent" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: "-0.02em" }}>
          {isRecruiter ? "Hiring Analytics" : "Your Analytics"}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {isRecruiter 
            ? "Track the volume of applications you receive from candidates day-by-day."
            : "Dive deep into your platform activity and track your consistency over time."}
        </Typography>
        
        {/* Heatmap Section */}
        <Heatmap />
        
        {/* We can add more charts here in the future */}
      </Container>
    </Box>
  );
};

export default Analytics;
