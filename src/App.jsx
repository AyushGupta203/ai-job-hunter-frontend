import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Suspense , lazy } from "react";

import Landing from "./pages/Landing";

import Register from "./pages/Register";
const Home = lazy(()=> import("./pages/Home"));
const JobDetail = lazy(()=> import("./pages/JobDetail"));
const Tracker = lazy(()=> import("./pages/Tracker"));
const PostJob = lazy(()=> import("./pages/PostJob"));
const UploadResume = lazy(() => import("./pages/UploadResume"));
const Suggestions = lazy(() => import("./pages/Suggestions"));
const ResumeReview = lazy(() => import("./pages/ResumeReview"));
const Applicants = lazy(() => import("./pages/Applicants"));

const Analytics = lazy(() => import("./pages/Analytics"));
const Profile = lazy(() => import("./pages/Profile"));
import Login from "./pages/login";
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
       <Suspense fallback={<p>Loading...</p>}>
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
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;