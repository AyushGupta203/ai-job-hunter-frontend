# 🎯 AI Job Hunter — Frontend

A modern React-based frontend for an AI-powered job platform that enables users to **discover jobs, upload resumes, get AI insights, and manage applications through an intuitive role-based interface**.

---

## 🧭 Overview

This frontend connects to a Node.js backend to provide a complete job platform experience:

* Job seekers can explore jobs, upload resumes, and get AI-driven feedback
* Recruiters can post jobs, view applicants, and evaluate candidates
* The UI adapts dynamically based on user roles

---

## ⚡ Key Features

### 🔐 Authentication & Role-Based Access

* User login & registration
* JWT-based authentication (stored in localStorage)
* Role-based UI:

  * **Seeker**
  * **Recruiter**
* Protected routes with access control

---

### 💼 Job Browsing & Application

* View all available jobs
* Navigate to detailed job pages
* Apply to jobs (Seeker)
* Clean job cards with preview content

---

### 📄 Resume & AI Features

* Upload resume (PDF)
* AI-based resume analysis
* Resume scoring system
* Smart suggestions for improvement
* AI-powered job matching

---

### 📊 Seeker Dashboard

* Track applications
* View resume insights
* Access AI suggestions
* Resume review page

---

### 🧑‍💼 Recruiter Dashboard

* Post new jobs
* View applicants per job
* Manage application status
* Evaluate candidates with AI insights

---

## 🧠 Frontend Architecture

```text id="c1z7qv"
React Components (Pages + UI)
        ↓
Context API (Auth + Theme)
        ↓
Axios API Layer
        ↓
Backend (Node.js + MongoDB + AWS S3 + AI)
```

---

## 🏗 Core Concepts

### 🔹 Context API

* `AuthContext` → manages user & token globally
* `ThemeContext` → handles dark/light mode
* Persistent state using localStorage

---

### 🔹 Routing System

#### Public Routes

```text id="0rx7j2"
/
/login
/register
```

#### Protected Routes

```text id="u5x8k2"
/home
/jobs/:id
```

#### Seeker Routes

```text id="qpyk9n"
/tracker
/upload-resume
/ai-hunter
/resume-score
```

#### Recruiter Routes

```text id="0f5xk1"
/post-job
/applicants/:jobId
```

---

### 🔹 API Integration

All API calls are handled through a centralized Axios instance:

* Automatically attaches JWT token
* Simplifies request handling

Example endpoints used:

```text id="2y7z6u"
POST   /api/auth/login
POST   /api/auth/register
GET    /api/jobs
POST   /api/applications
POST   /api/resume/upload
POST   /api/ai/match
```

---

## 📂 Project Structure

```text id="d1y9fx"
src/
 ├── api/
 │   └── axios.js
 │
 ├── context/
 │   ├── AuthContext.jsx
 │   └── ThemeToggleContext.jsx
 │
 ├── pages/
 │   ├── Landing.jsx
 │   ├── Login.jsx
 │   ├── Register.jsx
 │   ├── Home.jsx
 │   ├── Jobs.jsx
 │   ├── JobDetail.jsx
 │   ├── Tracker.jsx
 │   ├── UploadResume.jsx
 │   ├── Suggestions.jsx
 │   ├── ResumeReview.jsx
 │   ├── PostJob.jsx
 │   └── Applicants.jsx
 │
 ├── components/
 │   └── Navbar.jsx
 │
 ├── App.jsx
 ├── main.jsx
 └── theme.js
```

---

## 🎨 UI & Design

* Built with **Material UI (MUI)**
* Responsive layout (mobile + desktop)
* Theme support (light / dark mode)
* Smooth hover effects and transitions
* Clean and modern interface

---

## ⚙️ Setup

### 1. Install dependencies

```bash id="r6w6cu"
npm install
```

---

### 2. Start development server

```bash id="1u8q5o"
npm run dev
```

---

### 3. Backend requirement

Make sure backend is running:

```text id="v9q0u4"
http://localhost:5000
```

---

### 4. Environment configuration (optional)

```env id="e4d7lx"
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Security Notes

* JWT stored in localStorage
* Protected routes prevent unauthorized access
* Role-based UI ensures correct permissions

---

## ⚡ Performance Notes

* Centralized API layer reduces redundant logic
* Loading states improve UX
* Efficient routing using React Router

---

## 📌 Project Status

* Frontend: functional and integrated
* Backend: complete

---

## 🚀 Future Improvements

* Advanced job filtering & search
* Real-time notifications
* Chat system (recruiter ↔ seeker)
* Drag-and-drop resume upload
* Analytics dashboard

---

## 🧾 Summary

This frontend demonstrates:

* Real-world React architecture
* Role-based UI and routing
* Integration with backend APIs
* AI-driven user experience

---
