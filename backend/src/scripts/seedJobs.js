// backend/src/scripts/seedJobs.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const RecruiterProfile = require('../models/RecruiterProfile');
const Job = require('../models/Job');

const SAMPLE_JOBS = [
  {
    title: 'Full Stack React & Node Developer',
    company: 'Acme Cloud Solutions',
    location: 'Remote',
    type: 'Full-time',
    salaryRange: '$85,000 - $110,000',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API'],
    description: `About the Role:
We are seeking an enthusiastic Full Stack Developer to build cloud analytics dashboards and consumer applications. You will work across modern React frontends and scalable Node.js microservices.

Key Responsibilities:
• Build reusable UI components using React, TypeScript, and modern styling libraries.
• Develop and optimize RESTful endpoints in Node.js / Express.
• Design and query database schemas in MongoDB.
• Collaborate on code reviews, automated tests, and agile sprint planning.

Requirements:
• Strong proficiency in JavaScript / ES6+, React, and Node.js.
• Experience connecting to REST APIs and database backends.
• Eagerness to learn, document, and deploy clean software.`,
  },
  {
    title: 'Junior Frontend Engineer',
    company: 'Nexus Interactive',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salaryRange: '$75,000 - $95,000',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS'],
    description: `Join our design systems engineering team to create beautiful, accessible user interfaces.

Key Responsibilities:
• Implement pixel-perfect, accessible components according to Figma design specs.
• Maintain responsive layouts across desktop, tablet, and mobile browsers.
• Collaborate closely with UX researchers and product managers.

Requirements:
• Solid understanding of semantic HTML5, modern CSS3, and JavaScript.
• Hands-on experience building components in React.
• Familiarity with Git workflows and version control.`,
  },
  {
    title: 'Software Engineering Intern',
    company: 'Apex Fintech',
    location: 'New York, NY',
    type: 'Internship',
    salaryRange: '$35 - $42 / hr',
    requiredSkills: ['Python', 'SQL', 'Git', 'Data Structures'],
    description: `Apex Fintech is looking for driven student interns to work on backend financial systems and microservice data pipelines.

Key Responsibilities:
• Assist in developing automated verification and testing suites in Python.
• Write SQL queries and analyze transaction datasets.
• Participate in daily engineering standups and sprint retrospectives.

Requirements:
• Currently enrolled in a Computer Science, Software Engineering, or related degree.
• Strong foundation in algorithms, data structures, and object-oriented programming.`,
  },
  {
    title: 'Cloud DevOps Specialist',
    company: 'Horizon Data Systems',
    location: 'Austin, TX',
    type: 'Contract',
    salaryRange: '$60 - $75 / hr',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD'],
    description: `Help us build and maintain high-availability cloud infrastructure and automated deployment pipelines.

Key Responsibilities:
• Configure multi-stage Docker container builds and Kubernetes deployments.
• Automate CI/CD pipelines using GitHub Actions.
• Monitor server reliability, logs, and security compliance.

Requirements:
• Hands-on experience with containerization (Docker) and Linux environments.
• Understanding of cloud infrastructure (AWS/GCP/Azure).`,
  },
  {
    title: 'Backend Node.js & API Engineer',
    company: 'Acme Cloud Solutions',
    location: 'Remote',
    type: 'Full-time',
    salaryRange: '$95,000 - $125,000',
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Docker'],
    description: `Scale our core backend services and secure authentication infrastructure for hundreds of thousands of daily requests.

Key Responsibilities:
• Design and maintain high-throughput Express REST APIs.
• Optimize MongoDB indexes, aggregate pipelines, and query performance.
• Implement security best practices, JWT session verification, and rate limiting.

Requirements:
• 2+ years of hands-on experience developing backend APIs in Node.js.
• Solid background with MongoDB and asynchronous JavaScript programming.`,
  },
];

async function seedJobs() {
  // Prevent accidental execution in production unless explicitly forced
  if (process.env.NODE_ENV === 'production' && !process.argv.includes('--force')) {
    console.error('❌ Refusing to seed database in production without --force flag.');
    process.exit(1);
  }

  console.log('🌱 Starting Skill2Career database job seeder...');
  await connectDB();

  try {
    // 1. Ensure a verified demo recruiter user and profile exist to own the seeded jobs
    const demoRecruiterEmail = 'recruiter.demo@skill2career.com';
    let recruiterUser = await User.findOne({ email: demoRecruiterEmail });

    if (!recruiterUser) {
      recruiterUser = await User.create({
        email: demoRecruiterEmail,
        password: 'password123',
        role: 'recruiter',
        isVerified: true,
      });
      console.log(` Created demo recruiter user: ${demoRecruiterEmail}`);
    }

    let recruiterProfile = await RecruiterProfile.findOne({ user: recruiterUser._id });
    if (!recruiterProfile) {
      recruiterProfile = await RecruiterProfile.create({
        user: recruiterUser._id,
        email: demoRecruiterEmail,
        companyName: 'Acme Cloud Solutions',
        website: 'https://acmecloud.example.com',
        description: 'Enterprise developer platform specializing in infrastructure and cloud services.',
        isVerified: true,
      });
      console.log(` Created demo recruiter profile for: ${recruiterProfile.companyName}`);
    } else if (!recruiterProfile.isVerified) {
      recruiterProfile.isVerified = true;
      await recruiterProfile.save();
    }

    // 2. Insert sample jobs idempotently
    let insertedCount = 0;
    let existingCount = 0;

    for (const jobData of SAMPLE_JOBS) {
      const existing = await Job.findOne({
        title: jobData.title,
        company: jobData.company,
      });

      if (existing) {
        existingCount++;
      } else {
        await Job.create({
          ...jobData,
          recruiter: recruiterProfile._id,
          isPublished: true,
          isClosed: false,
        });
        insertedCount++;
        console.log(` + Inserted job: "${jobData.title}" (${jobData.company})`);
      }
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   - Jobs newly inserted: ${insertedCount}`);
    console.log(`   - Jobs already existing: ${existingCount}`);
    console.log(`   - Total jobs in database: ${await Job.countDocuments()}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedJobs();

