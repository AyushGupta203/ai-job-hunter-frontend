import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import JobDetail from "./pages/JobDetail";
import Tracker from "./pages/Tracker";
import PostJob from "./pages/PostJob";
import UploadResume from "./pages/UploadResume";
import Suggestions from "./pages/Suggestions";
import ResumeReview from "./pages/ResumeReview";
import Applicants from "./pages/Applicants";
import VerifyEmail from "./pages/VerifyEmail";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Protected routes for both roles */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            }
          />

          {/* Seeker only */}
          <Route
            path="/tracker"
            element={
              <ProtectedRoute allowedRole="seeker">
                <Tracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-resume"
            element={
              <ProtectedRoute allowedRole="seeker">
                <UploadResume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-hunter"
            element={
              <ProtectedRoute allowedRole="seeker">
                <Suggestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-score"
            element={
              <ProtectedRoute allowedRole="seeker">
                <ResumeReview />
              </ProtectedRoute>
            }
          />

          {/* Recruiter only */}
          <Route
            path="/post-job"
            element={
              <ProtectedRoute allowedRole="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicants/:jobId"
            element={
              <ProtectedRoute allowedRole="recruiter">
                <Applicants />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;