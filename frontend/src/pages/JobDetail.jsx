// frontend/src/pages/JobDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const DEMO_JOB_MAP = {
  dj1: {
    _id: 'dj1',
    title: 'Full Stack React & Node Developer',
    company: 'Acme Cloud Solutions',
    location: 'Remote',
    type: 'Full-time',
    salaryRange: '$85,000 - $110,000',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API'],
    description: `About the Role:
We are looking for an ambitious Full Stack Developer to build our next-generation cloud analytics dashboards and API gateways. You will collaborate directly with product designers and backend architects to deliver responsive, accessible, and high-performance interfaces.

Key Responsibilities:
• Build reusable UI components using React, TypeScript, and modern styling libraries.
• Develop and optimize RESTful endpoints and microservices in Node.js / Express.
• Integrate database schemas and query optimizations in MongoDB.
• Participate in code reviews, automated CI/CD pipelines, and agile ceremonies.

Requirements:
• Solid grasp of modern JavaScript / ES6+, HTML5, and CSS3.
• Hands-on experience with React, state management, and asynchronous data fetching.
• Familiarity with Node.js, Express, and database modeling.
• Strong problem-solving, documentation, and communication skills.`,
  },
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [toast, setToast] = useState(null); // { type, text }
  const [showApplyModal, setShowApplyModal] = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchJobAndResumes = async () => {
      setLoading(true);
      setIsDemo(false);
      try {
        const [jobRes, resumeRes] = await Promise.all([
          api.get(`/jobs/${id}`).catch(() => null),
          api.get('/student/resumes').catch(() => ({ data: [] })),
        ]);

        if (jobRes?.data) {
          setJob(jobRes.data);
        } else {
          // Check if demo job
          const fallback = DEMO_JOB_MAP[id] || {
            _id: id,
            title: 'Software Developer',
            company: 'Tech Innovators',
            location: 'Remote',
            type: 'Full-time',
            salaryRange: '$75k - $95k',
            requiredSkills: ['JavaScript', 'React', 'Node.js'],
            description: 'Exciting career opportunity in modern software development. Work with cutting-edge tools and a supportive team.',
          };
          setJob(fallback);
          setIsDemo(true);
        }

        const resumeList = Array.isArray(resumeRes?.data) ? resumeRes.data : resumeRes?.data?.resumes || [];
        setResumes(resumeList);
        const primary = resumeList.find((r) => r.isPrimary);
        if (primary) setSelectedResumeId(primary._id);
        else if (resumeList.length > 0) setSelectedResumeId(resumeList[0]._id);
      } catch (err) {
        console.warn('Backend unavailable, using demo job detail:', err.message);
        setIsDemo(true);
        setJob(DEMO_JOB_MAP[id] || {
          _id: id,
          title: 'Software Developer',
          company: 'Tech Innovators',
          location: 'Remote',
          type: 'Full-time',
          salaryRange: '$75k - $95k',
          requiredSkills: ['JavaScript', 'React', 'Node.js'],
          description: 'Exciting career opportunity in modern software development.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndResumes();
  }, [id]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (isDemo) {
      showToast('error', '⚠️ Demo mode: backend is unavailable. Application submission disabled.');
      return;
    }

    if (!selectedResumeId) {
      showToast('error', 'Please select or upload a resume before submitting your application.');
      return;
    }

    setApplyLoading(true);
    try {
      await api.post(`/applications/jobs/${id}`, {
        resumeId: selectedResumeId,
        coverLetter,
      });
      showToast('success', 'Application submitted successfully! Redirecting...');
      setTimeout(() => navigate('/student/applications'), 1500);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem' }}>Loading opportunity details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Opportunity Not Found</h2>
        <p style={{ color: '#64748b' }}>This listing may have expired or been removed.</p>
        <Link to="/student/jobs" style={{ color: '#2563eb', fontWeight: 600 }}>← Back to Job Search</Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', maxWidth: '850px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/student/jobs" style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.88rem' }}>
          ← Back to Job Search
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
        }}>
          ℹ️ <strong>Demo Preview:</strong> Backend is offline. Listing details are presented for UI preview.
        </div>
      )}

      {toast && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '0.375rem',
          marginBottom: '1.25rem',
          fontSize: '0.9rem',
          fontWeight: 500,
          background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${toast.type === 'success' ? '#86efac' : '#fca5a5'}`,
          color: toast.type === 'success' ? '#15803d' : '#b91c1c',
        }}>
          {toast.text}
        </div>
      )}

      {/* Header Card */}
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '2rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '1.75rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
              {job.title}
            </h1>
            <div style={{ fontSize: '1rem', color: '#475569', fontWeight: 600 }}>
              🏢 {job.company || job.recruiter?.companyName || 'Verified Partner'}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
              📍 {job.location || 'Remote'} · 💼 <span style={{ color: '#059669', fontWeight: 600 }}>{job.type}</span>
              {job.salaryRange && <span> · 💰 {job.salaryRange}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => setShowApplyModal(true)}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                padding: '0.65rem 1.4rem',
                borderRadius: '0.375rem',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Apply Now 🚀
            </button>
            <Link
              to={`/student/analysis?jobId=${job._id}`}
              style={{
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                padding: '0.65rem 1rem',
                borderRadius: '0.375rem',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              ⚡ Match Gap
            </Link>
          </div>
        </div>
      </div>

      {/* Required Skills Section */}
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          marginBottom: '1.75rem',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', margin: '0 0 0.75rem' }}>
            🎯 Required Competencies & Technologies
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {job.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description Section */}
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '2rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>
          Job Description & Requirements
        </h2>
        <div style={{
          fontSize: '0.95rem',
          lineHeight: 1.7,
          color: '#334155',
          whiteSpace: 'pre-line',
        }}>
          {job.description}
        </div>
      </div>

      {/* Application Drawer / Modal */}
      {showApplyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1e3a8a' }}>
                Submit Application
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 1.25rem' }}>
              Applying for <strong>{job.title}</strong> at {job.company || 'Partner Company'}.
            </p>

            <form onSubmit={handleSubmitApplication}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Select Resume to Attach *
                </label>
                {resumes.length === 0 ? (
                  <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', fontSize: '0.85rem', color: '#b91c1c' }}>
                    No resumes uploaded. Please upload a resume in your <Link to="/student/profile" style={{ color: '#2563eb', fontWeight: 600 }}>Profile page</Link> first.
                  </div>
                ) : (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.9rem' }}
                    required
                  >
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.originalName} {r.isPrimary ? '(Primary)' : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself and explain why you're a great fit for this position..."
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '0.55rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applyLoading || resumes.length === 0}
                  style={{
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: applyLoading || resumes.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: applyLoading || resumes.length === 0 ? 0.6 : 1,
                  }}
                >
                  {applyLoading ? 'Submitting...' : 'Confirm & Apply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
