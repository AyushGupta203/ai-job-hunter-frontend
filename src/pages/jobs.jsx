import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";


const Jobs = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        setError("Could not load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading jobs...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <h2>AI Job Hunter</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>Hi, {user?.name}</span>
          
          {user?.role === "seeker" && (
            <>
            <button onClick={() => navigate("/tracker")}>
              My Applications
            </button>
            {user?.role === "seeker" && (
  <>
    <button onClick={() => navigate("/tracker")}>
      My Applications
    </button>
    <button onClick={() => navigate("/upload-resume")}>
      Upload Resume
    </button>
  </>
)}
            </>
          
          )}

          {user?.role === "recruiter" && (
            <button onClick={() => navigate("/post-job")}>
              Post Job
            </button>
          )}

          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <h3>Available Jobs ({jobs.length})</h3>

      {jobs.length === 0 && (
        <p>No jobs posted yet.</p>
      )}

      {jobs.map((job) => (
        <div
          key={job._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/jobs/${job._id}`)}
        >
          <h4>{job.title}</h4>
          <p>{job.company} — {job.location}</p>
          <p style={{ color: "#666", fontSize: "14px" }}>
            {job.description.slice(0, 100)}...
          </p>
        </div>
      ))}
    </div>
  );
};

export default Jobs;  