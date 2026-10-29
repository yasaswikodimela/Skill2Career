// backend/src/controllers/applicationController.js
const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');

// Student submits application to a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resumeId, coverLetter } = req.body;

    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.isPublished || job.isClosed) {
      return res.status(400).json({ message: 'Cannot apply to closed or unpublished job' });
    }

    if (!resumeId) {
      return res.status(400).json({ message: 'Please select a resume to apply' });
    }

    const resume = await Resume.findOne({ _id: resumeId, student: student._id });
    if (!resume) return res.status(400).json({ message: 'Invalid resume selection' });

    const existingApp = await Application.findOne({ student: student._id, job: job._id });
    if (existingApp) {
      return res.status(409).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      student: student._id,
      job: job._id,
      resume: resume._id,
      coverLetter: coverLetter || '',
    });

    // Notify recruiter safely
    try {
      const recProfile = await RecruiterProfile.findById(job.recruiter);
      if (recProfile && recProfile.user) {
        await Notification.create({
          user: recProfile.user,
          type: 'newApplication',
          message: `New application received for ${job.title}`,
        });
      }
    } catch (notifErr) {
      console.warn('Could not dispatch notification:', notifErr.message);
    }

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Application already exists' });
    }
    console.error('Error applying to job:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student fetch own applications
exports.getMyApplications = async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) {
      return res.json([]);
    }
    const apps = await Application.find({ student: student._id })
      .populate('job', 'title company location type salaryRange')
      .populate('resume', 'originalName')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error('Error fetching student applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Recruiter fetch applications for a job they own
exports.getJobApplications = async (req, res) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!recruiterProfile || job.recruiter.toString() !== recruiterProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const apps = await Application.find({ job: job._id })
      .populate('student', 'email firstName lastName phone degree college')
      .populate('resume', 'originalName')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error('Error fetching job applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Recruiter update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    const { id } = req.params; // application id
    const { status } = req.body;
    const allowed = ['Applied', 'Screening', 'Interview', 'Selected', 'Rejected', 'Withdrawn'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }
    const application = await Application.findById(id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (!recruiterProfile || application.job.recruiter.toString() !== recruiterProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    application.status = status;
    await application.save();

    // Notify student safely
    try {
      const studProfile = await StudentProfile.findById(application.student);
      if (studProfile && studProfile.user) {
        await Notification.create({
          user: studProfile.user,
          type: 'applicationStatus',
          message: `Your application status for "${application.job.title}" is now "${status}"`,
        });
      }
    } catch (notifErr) {
      console.warn('Notification create error:', notifErr.message);
    }

    res.json(application);
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
