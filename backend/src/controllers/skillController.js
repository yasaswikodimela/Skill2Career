// backend/src/controllers/skillController.js
const SkillAssessment = require('../models/SkillAssessment');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const { getGeminiResponse } = require('../services/geminiService');

// Known tech skills vocabulary for keyword extraction
const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
  'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
  'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'Sass',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'GraphQL', 'REST API',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub', 'Linux',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Pandas',
  'SQL', 'Agile', 'Scrum', 'Figma', 'System Design', 'Testing', 'Jest'
];

// Helper to normalize skill names
const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== 'string') return '';
  const lowered = skill.trim().toLowerCase();
  const map = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    node: 'Node.js',
    'node.js': 'Node.js',
    nodejs: 'Node.js',
    react: 'React',
    reactjs: 'React',
    'react.js': 'React',
    python: 'Python',
    py: 'Python',
    mongo: 'MongoDB',
    mongodb: 'MongoDB',
    postgres: 'PostgreSQL',
    postgresql: 'PostgreSQL',
    docker: 'Docker',
    git: 'Git',
  };
  return map[lowered] || (skill.trim().charAt(0).toUpperCase() + skill.trim().slice(1));
};

// Extract skills from text
const extractSkillsFromText = (text) => {
  if (!text) return [];
  const found = new Set();
  const textLower = text.toLowerCase();
  for (const s of COMMON_SKILLS) {
    const pattern = new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(textLower)) {
      found.add(s);
    }
  }
  return Array.from(found);
};

// POST /api/skills/analyze
exports.analyzeSkills = async (req, res) => {
  try {
    const { jobId, customDescription, customSkills, description } = req.body;
    const descText = customDescription || description || '';

    let student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) {
      student = await StudentProfile.create({ user: req.user._id, email: req.user.email });
    }

    // Gather student skills (normalized strings)
    const studentSkills = (student.skills || [])
      .map(s => normalizeSkill(typeof s === 'string' ? s : s?.name))
      .filter(Boolean);

    // Get job requirements
    let requiredSkills = [];
    let jobTitle = 'Custom Position';

    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: 'Job not found' });
      jobTitle = job.title;
      requiredSkills = (job.requiredSkills || []).map(normalizeSkill).filter(Boolean);
      if (requiredSkills.length === 0 && job.description) {
        requiredSkills = extractSkillsFromText(job.description);
      }
    } else if (descText || customSkills) {
      if (Array.isArray(customSkills) && customSkills.length > 0) {
        requiredSkills = customSkills.map(normalizeSkill).filter(Boolean);
      } else if (typeof customSkills === 'string' && customSkills.trim()) {
        requiredSkills = customSkills.split(',').map(s => normalizeSkill(s)).filter(Boolean);
      } else {
        requiredSkills = extractSkillsFromText(descText);
      }
    } else {
      return res.status(400).json({ message: 'Please provide either a jobId or a job description/skills' });
    }

    // Fallback if no skills could be parsed
    if (requiredSkills.length === 0) {
      requiredSkills = ['JavaScript', 'React', 'Problem Solving', 'Communication'];
    }

    // Deterministic match calculation (case-insensitive)
    const studentSkillsLower = studentSkills.map(s => s.toLowerCase());
    const matched = requiredSkills.filter(rs => studentSkillsLower.includes(rs.toLowerCase()));
    const missing = requiredSkills.filter(rs => !studentSkillsLower.includes(rs.toLowerCase()));

    const matchScore = requiredSkills.length
      ? Math.round((matched.length / requiredSkills.length) * 100)
      : 0;

    // Optional Gemini explanation with fallback
    let explanation = '';
    const prompt = `You are a career counselor and technical mentor. Analyze the skill gap for a candidate aiming for "${jobTitle}".
Candidate skills: ${studentSkills.join(', ') || 'None listed yet'}.
Job required skills: ${requiredSkills.join(', ')}.
Matched skills: ${matched.join(', ') || 'None'}.
Missing skills: ${missing.join(', ') || 'None'}.
Provide a concise, encouraging 3-paragraph assessment with actionable advice on what to learn first.`;

    try {
      const geminiResp = await getGeminiResponse(prompt);
      if (geminiResp?.text) {
        explanation = geminiResp.text;
      }
    } catch (gemErr) {
      console.warn('Gemini error, using deterministic explanation fallback:', gemErr.message);
    }

    if (!explanation) {
      if (matched.length === requiredSkills.length) {
        explanation = `Outstanding! You have a 100% skill match for this role. Your profile includes all required competencies: ${matched.join(', ')}. We recommend reviewing advanced system design and preparing tailored portfolio examples.`;
      } else if (matched.length > 0) {
        explanation = `You have strong foundations with matches in ${matched.join(', ')} (${matchScore}% match). To become a competitive applicant, focus on acquiring: ${missing.join(', ')}. Building a project that integrates these missing skills will rapidly bridge your gap.`;
      } else {
        explanation = `You currently have a ${matchScore}% direct match with the requested skills (${missing.join(', ')}). Consider starting with fundamental courses and hands-on tutorials for ${missing.slice(0, 3).join(', ')} to begin your learning roadmap.`;
      }
    }

    // Save assessment record
    let assessment = null;
    try {
      assessment = await SkillAssessment.create({
        student: student._id,
        job: jobId || null,
        matchedSkills: matched,
        missingSkills: missing,
        relatedSkills: [],
        matchScore,
        explanation,
      });
    } catch (saveErr) {
      console.warn('Could not persist assessment record:', saveErr.message);
    }

    res.json({
      matchedSkills: matched,
      missingSkills: missing,
      relatedSkills: [],
      matchScore,
      explanation,
      assessmentId: assessment?._id || 'temp-assessment',
    });
  } catch (err) {
    console.error('Skill analysis error:', err);
    res.status(500).json({ message: 'Server error during skill analysis' });
  }
};

// GET /api/skills/assessments
exports.getAssessments = async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) return res.json([]);
    const assessments = await SkillAssessment.find({ student: student._id })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });
    res.json(assessments);
  } catch (err) {
    console.error('Error fetching assessments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
