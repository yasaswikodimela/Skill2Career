// frontend/src/pages/RecruiterDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const DEMO_JOBS = [
  {
    _id: 'rj1',
    title: 'Senior Frontend Engineer',
    company: 'Acme Cloud Solutions',
    location: 'Remote',
    type: 'Full-time',
    salaryRange: '$120k - $140k',
    isPublished: true,
    isClosed: false,
    requiredSkills: ['React', 'TypeScript', 'Next.js'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'rj2',
    title: 'Junior Backend Developer',
    company: 'Acme Cloud Solutions',
    location: 'Austin, TX',
    type: 'Full-time',
    salaryRange: '$75k - $90k',
    isPublished: false,
    isClosed: false,
    requiredSkills: ['Node.js', 'Express', 'MongoDB'],
    createdAt: new Date().toISOString(),
  },
];

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [toast, setToast] = useState(null); // { type, text }

  // New Job modal / form state
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: 'Remote',
    type: 'Full-time',
    salaryRange: '',
    description: '',
    requiredSkills: '',
  });
  const [creatingJob, setCreatingJob] = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const loadRecruiterData = async () => {
    setLoading(true);
    setIsDemo(false);
    try {
      const [profileRes, jobsRes] = await Promise.all([
        api.get('/recruiter/profile').catch(() => null),
        api.get('/recruiter/jobs').catch(() => null),
      ]);

      if (profileRes?.data) {
        setProfile(profileRes.data);
        setJobForm((prev) => ({ ...prev, company: profileRes.data.companyName || '' }));
      }
      if (jobsRes?.data) {
        const list = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.jobs || [];
        setJobs(list);
      }

      if (!profileRes && !jobsRes) {
        throw new Error('Backend unavailable');
      }
    } catch (err) {
      console.warn('Backend unavailable, showing recruiter demo dashboard:', err.message);
      setIsDemo(true);
      setProfile({
        companyName: 'Acme Cloud Solutions',
        email: user?.email || 'recruiter@acme.com',
        website: 'https://acmecloud.example.com',
        description: 'Leading provider of enterprise cloud developer tooling and analytics.',
        isVerified: true,
      });
      setJobs(DEMO_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiterData();
  }, [user]);

  const handleToggleStatus = async (jobId, currentPublished, currentClosed) => {
    if (isDemo) {
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, isPublished: !currentPublished } : j))
      );
      showToast('error', '⚠️ Demo mode: job status toggled locally for preview.');
      return;
    }

    try {
      const nextStatus = currentPublished ? 'close' : 'publish';
      const { data } = await api.patch(`/recruiter/jobs/${jobId}/status`, { status: nextStatus });
      setJobs((prev) => prev.map((j) => (j._id === jobId ? data : j)));
      showToast('success', `Job status updated to ${nextStatus}.`);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update job status.');
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Delete job posting "${title}"?`)) return;

    if (isDemo) {
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      showToast('error', '⚠️ Demo mode: job removed locally.');
      return;
    }

    try {
      await api.delete(`/recruiter/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      showToast('success', 'Job posting deleted.');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete job.');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.description.trim()) {
      showToast('error', 'Please provide a job title and description.');
      return;
    }

    if (isDemo) {
      const newJob = {
        _id: `demo-${Date.now()}`,
        ...jobForm,
        requiredSkills: jobForm.requiredSkills
          ? jobForm.requiredSkills.split(',').map((s) => s.trim())
          : [],
        isPublished: true,
        isClosed: false,
        createdAt: new Date().toISOString(),
      };
      setJobs((prev) => [newJob, ...prev]);
      setShowJobModal(false);
      showToast('error', '⚠️ Demo mode: job added locally for preview.');
      return;
    }

    setCreatingJob(true);
    try {
      const payload = {
        ...jobForm,
        company: jobForm.company || profile?.companyName || 'Company',
        requiredSkills: jobForm.requiredSkills
          ? jobForm.requiredSkills.split(',').map((s) => s.trim())
          : [],
        isPublished: true,
      };

      const { data } = await api.post('/recruiter/jobs', payload);
      setJobs((prev) => [data, ...prev]);
      setShowJobModal(false);
      setJobForm({
        title: '',
        company: profile?.companyName || '',
        location: 'Remote',
        type: 'Full-time',
        salaryRange: '',
        description: '',
        requiredSkills: '',
      });
      showToast('success', 'Job posting created successfully!');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to create job posting.');
    } finally {
      setCreatingJob(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem' }}>Loading recruiter workspace...</p>
      </div>
    );
  }

  const publishedJobsCount = jobs.filter((j) => j.isPublished && !j.isClosed).length;

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #0369a1 100%)',
        color: '#fff',
        borderRadius: '0.75rem',
        padding: '2rem',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 12px rgba(15,118,110,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#fff' }}>
              {profile?.companyName || 'Company Workspace'}
            </h1>
            {profile?.isVerified ? (
              <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                ✓ Verified Partner
              </span>
            ) : (
              <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.15rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                ⏳ Pending Admin Verification
              </span>
            )}
          </div>
          <p style={{ margin: '0.35rem 0 0', opacity: 0.9, fontSize: '0.92rem' }}>
            Manage your open listings, review incoming candidates, and update hiring statuses.
          </p>
        </div>

        <button
          onClick={() => setShowJobModal(true)}
          style={{
            background: '#fff',
            color: '#0f766e',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '0.65rem 1.4rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          + Post New Job Opening
        </button>
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
          ℹ️ <strong>Demo Preview:</strong> Backend is offline. Displaying sample recruiter dashboard and candidates.
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

      {/* Recruiter Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Total Jobs Posted</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f766e', margin: '0.25rem 0' }}>
            {jobs.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Active in database</div>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Live Listings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: '0.25rem 0' }}>
            {publishedJobsCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Visible to students</div>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Account Status</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: profile?.isVerified ? '#16a34a' : '#d97706', margin: '0.5rem 0 0.25rem' }}>
            {profile?.isVerified ? 'Verified' : 'Pending Review'}
          </div>
          <Link to="/recruiter/profile" style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
            Edit company profile →
          </Link>
        </div>
      </div>

      {/* Posted Jobs Section */}
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
            💼 Your Job Openings ({jobs.length})
          </h2>
        </div>

        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <p style={{ margin: '0 0 1rem', fontSize: '1rem' }}>You haven't posted any jobs yet.</p>
            <button
              onClick={() => setShowJobModal(true)}
              style={{ background: '#0f766e', color: '#fff', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1.2rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Position Title</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Location & Type</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Applicants</th>
                  <th style={{ padding: '0.75rem 1.2rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr
                    key={j._id}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{j.title}</div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{j.salaryRange || 'Competitive'}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#475569' }}>
                      {j.location || 'Remote'} · <span style={{ fontWeight: 500 }}>{j.type}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {j.isClosed ? (
                        <span style={{ background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                          Closed
                        </span>
                      ) : j.isPublished ? (
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                          ✓ Live
                        </span>
                      ) : (
                        <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                          Draft
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Link
                        to={`/recruiter/jobs/${j._id}/applicants`}
                        style={{
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          display: 'inline-block',
                        }}
                      >
                        👥 View Applicants
                      </Link>
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(j._id, j.isPublished, j.isClosed)}
                          style={{
                            background: j.isPublished ? '#fef3c7' : '#dcfce7',
                            color: j.isPublished ? '#854d0e' : '#166534',
                            border: 'none',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {j.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteJob(j._id, j.title)}
                          style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showJobModal && (
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: '#0f766e' }}>
                Post a New Opportunity
              </h3>
              <button
                onClick={() => setShowJobModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateJob}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Remote or City, State"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Type
                  </label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Salary Range (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. $90,000 - $120,000"
                  value={jobForm.salaryRange}
                  onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, TypeScript, AWS"
                  value={jobForm.requiredSkills}
                  onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Job Description & Qualifications *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Detail the role responsibilities, ideal candidate profile, and application expectations..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.55rem 1rem', borderRadius: '0.375rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingJob}
                  style={{
                    background: '#0f766e',
                    color: '#fff',
                    border: 'none',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '0.375rem',
                    fontWeight: 600,
                    cursor: creatingJob ? 'not-allowed' : 'pointer',
                  }}
                >
                  {creatingJob ? 'Publishing...' : 'Publish Job Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
