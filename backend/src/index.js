// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const recruiterRoutes = require('./routes/recruiter');
const adminRoutes = require('./routes/admin');
const resumeRoutes = require('./routes/resume');
const skillsRoutes = require('./routes/skills');
const applicationsRoutes = require('./routes/applications');
const studentRoutes = require('./routes/student');
const roadmapRoutes = require('./routes/roadmap');

const app = express();
const PORT = process.env.PORT || 5000;
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Skill2Career API routes are responding',
    version: '2026-10-30'
  });
});
app.get('/debug', (req, res) => {
  res.json({
    message: 'Correct Skill2Career backend is running',
    version: 'debug-2026-10-30'
  });
});

// CORS configuration
const allowedOrigins = [
  'https://skill2careerr.netlify.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// Rate limiter & Body parsing
const { generalLimiter } = require('./middleware/rateLimiter');
app.use(generalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB (graceful if unset)
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/roadmap', roadmapRoutes);

// Health check

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => console.log(`🚀 Skill2Career backend running on port ${PORT}`));
