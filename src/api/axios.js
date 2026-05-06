import axios from "axios";

// ── Guard: catch missing env var at startup ──────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error(
    "🔴 [axios] VITE_API_URL is not defined!\n" +
    "  • Locally  → create frontend/.env with: VITE_API_URL=http://localhost:5000/api\n" +
    "  • Vercel   → Project Settings → Environment Variables → add VITE_API_URL\n" +
    "  • Render   → Dashboard → Environment → add VITE_API_URL\n" +
    "All API calls will fail until this is set."
  );
}

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach JWT token on every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Surface API errors clearly in development
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      console.error("🔴 [axios] Network error — is the backend running?", err.message);
    }
    return Promise.reject(err);
  }
);

export default API;