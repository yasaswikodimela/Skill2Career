// backend/src/controllers/jobController.js
const Job = require('../models/Job');
const RecruiterProfile = require('../models/RecruiterProfile');

// Helper to build filter object from query params
const buildFilter = (query) => {
  const filter = { isPublished: true, isClosed: false };
  if (query.title) filter.title = { $regex: query.title, $options: 'i' };
  if (query.location) filter.location = { $regex: query.location, $options: 'i' };
  if (query.type) filter.type = query.type;
  if (query.skills) {
    const skillsArray = query.skills.split(',').map(s => s.trim());
    filter.requiredSkills = { $all: skillsArray };
  }
  return filter;
};

// @desc Get list of jobs (search & filters, or recruiter own jobs)
// @route GET /api/jobs or GET /api/recruiter/jobs
exports.getJobs = async (req, res) => {
  try {
    let filter = {};
    if (req.query.recruiter === 'true' || req.baseUrl === '/api/recruiter') {
      if (req.user) {
        const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
        if (recruiterProfile) {
          filter.recruiter = recruiterProfile._id;
        }
      }
    } else {
      filter = buildFilter(req.query);
    }
    const jobs = await Job.find(filter).populate('recruiter', 'companyName').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get single job details (public if published)
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'companyName website description');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.isPublished || job.isClosed) {
      if (req.user) {
        const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
        if (recruiterProfile && job.recruiter?._id?.toString() === recruiterProfile._id.toString()) {
          return res.json(job);
        }
      }
      return res.status(403).json({ message: 'Job not available' });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Create a new job (recruiter only)
exports.createJob = async (req, res) => {
  try {
    let recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    if (!recruiterProfile) {
      recruiterProfile = await RecruiterProfile.create({
        user: req.user._id,
        email: req.user.email,
        companyName: req.body.company || '',
        isVerified: process.env.NODE_ENV !== 'production',
      });
    }

    if (!recruiterProfile.isVerified && process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Recruiter account is pending admin verification' });
    }

    const jobData = {
      ...req.body,
      recruiter: recruiterProfile._id,
      company: req.body.company || recruiterProfile.companyName || 'Hiring Company',
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
      isClosed: false,
    };
    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update a job (owner only)
exports.updateJob = async (req, res) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!recruiterProfile || job.recruiter.toString() !== recruiterProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this job' });
    }
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Change job status (publish/close)
exports.setJobStatus = async (req, res) => {
  try {
    const { status } = req.body; // expected values: 'publish', 'close'
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!recruiterProfile || job.recruiter.toString() !== recruiterProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (status === 'publish') job.isPublished = true;
    else if (status === 'close') job.isClosed = true;
    else return res.status(400).json({ message: 'Invalid status value' });
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Delete a job (owner only)
exports.deleteJob = async (req, res) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!recruiterProfile || job.recruiter.toString() !== recruiterProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }
    await Job.deleteOne({ _id: req.params.id });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Exports are already defined on exports object via exports.<name>
