
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

// CORS MUST BE FIRST
const corsOptions = {
  origin: [
    'https://skill2careerr.netlify.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Diagnostic routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Skill2Career API is running',
    databaseConnected: mongoose.connection.readyState === 1,
  });
});

app.get('/debug', (req, res) => {
  res.json({ message: 'Skill2Career backend is running' });
});

// Middleware
const { generalLimiter } = require('./middleware/rateLimiter');
app.use(generalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
connectDB();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/roadmap', roadmapRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Skill2Career backend running on port ${PORT}`);
});
