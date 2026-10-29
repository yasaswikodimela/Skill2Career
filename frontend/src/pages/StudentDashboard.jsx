// frontend/src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const DEMO_JOBS = [
  { _id: 'dj1', title: 'Full Stack React & Node Developer', company: 'Acme Cloud', location: 'Remote', type: 'Full-time', salaryRange: '$80k - $105k' },
  { _id: 'dj2', title: 'Junior Frontend Engineer', company: 'Nexus Interactive', location: 'San Francisco, CA', type: 'Full-time', salaryRange: '$70k - $90k' },
  { _id: 'dj3', title: 'Software Engineering Intern', company: 'Apex Fintech', location: 'New York, NY', type: 'Internship', salaryRange: '$35/hr' },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setIsDemo(false);
      try {
        const [profileRes, jobsRes, appsRes] = await Promise.all([
          api.get('/student/profile').catch(() => null),
          api.get('/jobs', { params: { limit: 5 } }).catch(() => null),
          api.get('/applications/me').catch(() => null),
        ]);

        if (profileRes?.data) setProfile(profileRes.data);
        if (jobsRes?.data) {
          const jobList = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.jobs || [];
          setJobs(jobList.slice(0, 4));
        }
        if (appsRes?.data) {
          const appList = Array.isArray(appsRes.data) ? appsRes.data : appsRes.data.applications || [];
          setApplications(appList);
        }

        // If all requests failed, show demo data
        if (!profileRes && !jobsRes && !appsRes) {
          throw new Error('Backend unavailable');
        }
      } catch (err) {
        console.warn('Backend unavailable, using dashboard demo data:', err.message);
        setIsDemo(true);
        setProfile({
          firstName: 'Alex',
          lastName: 'Morgan',
          email: user?.email || 'alex.morgan@university.edu',
          degree: 'B.S. in Computer Science',
          college: 'State University',
          graduationYear: 2025,
          careerGoal: 'Full Stack Software Engineer',
          skills: [{ name: 'JavaScript', level: 'Intermediate' }, { name: 'React', level: 'Intermediate' }, { name: 'Node.js', level: 'Beginner' }],
        });
        setJobs(DEMO_JOBS);
        setApplications([
          { _id: 'a1', status: 'Screening', createdAt: new Date().toISOString(), job: { title: 'Junior Frontend Engineer', company: 'Nexus Interactive' } },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    if (!profile) return 20;
    let score = 20; // registered
    if (profile.firstName || profile.lastName) score += 15;
    if (profile.degree || profile.college) score += 15;
    if (profile.careerGoal) score += 15;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.bio || profile.location) score += 15;
    return Math.min(score, 100);
  };

  const completionPct = calculateCompletion();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem' }}>Loading student dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', paddingBottom: '2rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        color: '#fff',
        borderRadius: '0.75rem',
        padding: '2rem',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 12px rgba(30,58,138,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.4rem', color: '#fff' }}>
            Hello, {profile?.firstName ? `${profile.firstName}!` : 'Student!'} 👋
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
            {profile?.careerGoal ? `Targeting: ${profile.careerGoal}` : 'Track your applications and close your technical skill gaps.'}
          </p>
        </div>

        <Link
          to="/student/analysis"
          style={{
            background: '#fff',
            color: '#1e3a8a',
            fontWeight: 700,
            fontSize: '0.9rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '0.375rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          ⚡ Run Skill Analysis
        </Link>
      </div>

      {isDemo && (
        <div style={{
          background: '#fef9c3',
          border: '1px solid #fde68a',
          color: '#854d0e',
          padding: '0.65rem 1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span>ℹ️</span>
          <span><strong>Demo Preview:</strong> Backend is offline. Displaying sample student metrics and opportunities.</span>
        </div>
      )}

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Profile Completion</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: completionPct >= 80 ? '#16a34a' : '#2563eb', margin: '0.25rem 0' }}>
            {completionPct}%
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
            <div style={{ background: completionPct >= 80 ? '#16a34a' : '#2563eb', width: `${completionPct}%`, height: '100%' }}></div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Active Applications</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6366f1', margin: '0.25rem 0' }}>
            {applications.length}
          </div>
          <Link to="/student/applications" style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
            View status history →
          </Link>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Recorded Skills</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0891b2', margin: '0.25rem 0' }}>
            {profile?.skills?.length || 0}
          </div>
          <Link to="/student/profile" style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
            Manage in profile →
          </Link>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Personalized Path</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d97706', margin: '0.5rem 0 0.25rem' }}>
            Learning Roadmap
          </div>
          <Link to="/student/roadmap" style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
            Open latest roadmap →
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recommended Jobs & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Recommended Jobs */}
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              💼 Recommended Opportunities
            </h2>
            <Link to="/student/jobs" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>
              Browse all jobs →
            </Link>
          </div>

          {jobs.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No open job listings found at the moment.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jobs.map((job) => (
                <div
                  key={job._id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #f1f5f9',
                    background: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.2rem', color: '#1e293b' }}>
                      {job.title}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {job.company || job.recruiter?.companyName || 'Company'} · {job.location || 'Remote'} · <span style={{ color: '#059669', fontWeight: 500 }}>{job.type}</span>
                    </div>
                  </div>

                  <Link
                    to={`/student/jobs/${job._id}`}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#2563eb',
                      background: '#eff6ff',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.375rem',
                    }}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Recent Applications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Actions Card */}
          <div style={{
            background: '#fff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>
              ⚡ Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Link
                to="/student/profile"
                style={{
                  padding: '0.85rem',
                  borderRadius: '0.5rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: '#1e293b',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>📄</span>
                Edit Profile & Resumes
              </Link>

              <Link
                to="/student/analysis"
                style={{
                  padding: '0.85rem',
                  borderRadius: '0.5rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: '#1e293b',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>🎯</span>
                Analyze Job Gap
              </Link>

              <Link
                to="/student/roadmap"
                style={{
                  padding: '0.85rem',
                  borderRadius: '0.5rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: '#1e293b',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>🗺️</span>
                Learning Milestones
              </Link>

              <Link
                to="/student/jobs"
                style={{
                  padding: '0.85rem',
                  borderRadius: '0.5rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: '#1e293b',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>🔍</span>
                Search All Jobs
              </Link>
            </div>
          </div>

          {/* Recent Applications Preview */}
          <div style={{
            background: '#fff',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>
              📋 Latest Application Status
            </h2>
            {applications.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                You haven't applied to any roles yet. Explore the job board to find a match!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {applications.slice(0, 3).map((app) => (
                  <div key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 500 }}>{app.job?.title || 'Job Application'}</span>
                    <span style={{
                      background: app.status === 'Selected' ? '#dcfce7' : app.status === 'Interview' ? '#ede9fe' : '#e0f2fe',
                      color: app.status === 'Selected' ? '#15803d' : app.status === 'Interview' ? '#6b21a8' : '#0369a1',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      {app.status || 'Applied'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
