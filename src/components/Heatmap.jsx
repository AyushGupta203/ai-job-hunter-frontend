import { useEffect , useState } from "react";
import "./Heatmap.css";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import API from "../api/axios";

import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { useAuth } from "../context/AuthContext";

const Heatmap = ()=>{
  const { user } = useAuth();
  const isRecruiter = user?.role === "recruiter";
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [data , setData] = useState([]);

  useEffect(()=>{
    const fetchHeatmap = async()=>{
      try{
        const res = await API.get("/analytics/heatmap");
        setData(res.data);
      }
      catch(err){
        console.log("Error fetching")
      }
    };
    fetchHeatmap();
  },[]);

  // Show only the last 6 months so the boxes are larger and not cramped
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 6);

  return(
    <Card 
      elevation={0}
      className={`heatmap-container ${isDark ? "dark-mode" : ""}`}
      sx={{
        mb: 4, 
        borderRadius: 4,
        background: isDark ? "rgba(30,30,50,0.65)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.04)",
        overflow: "hidden",
        transition: "all 0.3s ease"
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box sx={{ 
            p: 1.2, 
            borderRadius: 2.5, 
            bgcolor: isDark ? "rgba(96,165,250,0.15)" : "rgba(0,113,227,0.08)",
            display: "flex", 
            alignItems: "center" 
          }}>
            <AutoGraphIcon sx={{ color: "primary.main", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
              {isRecruiter ? "Recruitment Heatmap" : "Activity Heatmap"}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500} fontSize={13}>
              {isRecruiter 
                ? "Tracking applications received across all your job postings" 
                : "Tracking your progress over the last 6 months"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: "100%", overflowX: "auto", pb: 1, px: 1 }}>
          <Box sx={{ minWidth: 600, px: 1 }}>
            <CalendarHeatmap 
              startDate={startDate}
              endDate={endDate}
              values={data}
              showWeekdayLabels={true}
              classForValue={(value)=>{
                if(!value || value.count === 0) return "color-empty";
                if (value.count >= 5) return "color-theme-4";
                if (value.count >= 3) return "color-theme-3";
                if (value.count >= 2) return "color-theme-2";
                return "color-theme-1";
              }} 
              titleForValue={(value) => {
                const actionText = isRecruiter ? 'applications received' : 'applications submitted';
                const zeroText = isRecruiter ? 'No applications received' : 'No applications submitted';
                
                if (!value || !value.date || value.count === 0) {
                  return zeroText;
                }
                const dateString = new Date(value.date).toLocaleDateString(undefined, { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                });
                const singularText = isRecruiter ? 'application received' : 'application submitted';
                const text = value.count === 1 ? singularText : actionText;
                
                return `${value.count} ${text} on ${dateString}`;
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Heatmap;