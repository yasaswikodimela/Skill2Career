// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import SkillAnalysis from './pages/SkillAnalysis';
import Roadmap from './pages/Roadmap';
import StudentApplications from './pages/StudentApplications';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterProfile from './pages/RecruiterProfile';
import RecruiterApplicants from './pages/RecruiterApplicants';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '1.25rem', minHeight: 'calc(100vh - 60px)' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute role="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/jobs"
            element={
              <ProtectedRoute role="student">
                <JobSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/jobs/:id"
            element={
              <ProtectedRoute role="student">
                <JobDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/analysis"
            element={
              <ProtectedRoute role="student">
                <SkillAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/roadmap"
            element={
              <ProtectedRoute role="student">
                <Roadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute role="student">
                <StudentApplications />
              </ProtectedRoute>
            }
          />

          {/* Recruiter routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/profile"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterApplicants />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
