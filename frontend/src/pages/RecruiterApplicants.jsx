// frontend/src/pages/RecruiterApplicants.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

const STATUS_OPTIONS = ['Applied', 'Screening', 'Interview', 'Selected', 'Rejected', 'Withdrawn'];

const DEMO_APPLICANTS = [
  {
    _id: 'app-demo-1',
    status: 'Screening',
    appliedAt: '2024-03-15T12:00:00Z',
    coverLetter: 'I have 2+ years of React and full stack experience and would love to contribute to your engineering team!',
    student: {
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.morgan@university.edu',
      phone: '+1 (555) 234-5678',
      degree: 'B.S. in Computer Science',
      college: 'State University',
    },
    resume: {
      _id: 'res-demo-1',
      originalName: 'Alex_Morgan_Resume.pdf',
    },
  },
  {
    _id: 'app-demo-2',
    status: 'Interview',
    appliedAt: '2024-03-18T09:30:00Z',
    coverLetter: 'Strong background in Node.js, distributed databases, and high-performance API design.',
    student: {
      firstName: 'Jordan',
      lastName: 'Lee',
      email: 'jordan.lee@college.edu',
      phone: '+1 (555) 987-6543',
      degree: 'M.S. in Software Engineering',
      college: 'Tech Institute',
    },
    resume: {
      _id: 'res-demo-2',
      originalName: 'Jordan_Lee_CV.pdf',
    },
  },
];

const RecruiterApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      setIsDemo(false);
      try {
        const [appRes, jobRes] = await Promise.all([
          api.get(`/applications/recruiter/${jobId}`).catch(() => null),
          api.get(`/jobs/${jobId}`).catch(() => null),
        ]);

        if (jobRes?.data) setJob(jobRes.data);
        if (appRes?.data) {
          const list = Array.isArray(appRes.data) ? appRes.data : [];
          setApplicants(list.length > 0 ? list : DEMO_APPLICANTS);
          if (list.length === 0) setIsDemo(true);
        } else {
          setApplicants(DEMO_APPLICANTS);
          setIsDemo(true);
        }
      } catch (err) {
        console.warn('Backend unavailable, showing demo applicants:', err.message);
        setIsDemo(true);
        setApplicants(DEMO_APPLICANTS);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    if (isDemo) {
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
      showToast('error', '⚠️ Demo mode: applicant status updated locally.');
      return;
    }

    setUpdatingId(appId);
    try {
      const { data } = await api.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: data.status || newStatus } : a))
      );
      showToast('success', `Candidate status updated to "${newStatus}".`);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update candidate status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadResume = async (resumeId, filename) => {
    if (isDemo) {
      showToast('error', '⚠️ Demo mode: resume download not available in preview.');
      return;
    }
    try {
      const response = await api.get(`/student/resumes/${resumeId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showToast('error', 'Failed to download applicant resume file.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem' }}>Loading candidate applications...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', maxWidth: '1050px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f766e', margin: 0 }}>
            Candidate Pipeline: {job?.title || 'Job Opening'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Review candidate resumes, cover notes, and manage interview progression.
          </p>
        </div>
        <Link to="/recruiter/dashboard" style={{ color: '#0f766e', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to Workspace
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
          ℹ️ <strong>Demo Preview:</strong> Backend is offline or no applicants have applied yet. Displaying sample candidate submissions.
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

      {/* Applicants Table Card */}
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        {applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
            No candidate applications received for this position yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1.2rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Candidate Details</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Academic Background</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Resume & Note</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Applied Date</th>
                  <th style={{ padding: '0.75rem 1.2rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Hiring Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a) => (
                  <tr
                    key={a._id}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>
                        {a.student?.firstName || a.student?.lastName
                          ? `${a.student.firstName || ''} ${a.student.lastName || ''}`.trim()
                          : a.student?.email || 'Student Applicant'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.82rem' }}>{a.student?.email}</div>
                      {a.student?.phone && (
                        <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>📞 {a.student.phone}</div>
                      )}
                    </td>

                    <td style={{ padding: '1rem', color: '#475569' }}>
                      <div style={{ fontWeight: 500 }}>{a.student?.degree || 'Undergraduate'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.student?.college || 'University'}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {a.resume?._id ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadResume(a.resume._id, a.resume.originalName)}
                          style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-block',
                            marginBottom: '0.35rem',
                          }}
                        >
                          📄 {a.resume.originalName || 'Download Resume'}
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No file attached</span>
                      )}

                      {a.coverLetter && (
                        <div style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic', maxWidth: '220px' }}>
                          "{a.coverLetter.length > 80 ? `${a.coverLetter.slice(0, 80)}...` : a.coverLetter}"
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.82rem' }}>
                      {new Date(a.appliedAt || a.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    <td style={{ padding: '1rem 1.2rem' }}>
                      <select
                        value={a.status || 'Applied'}
                        disabled={updatingId === a._id}
                        onChange={(e) => handleStatusChange(a._id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: '1px solid #cbd5e1',
                          background:
                            a.status === 'Selected' ? '#f0fdf4' :
                            a.status === 'Interview' ? '#faf5ff' :
                            a.status === 'Rejected' ? '#fef2f2' : '#f8fafc',
                          color:
                            a.status === 'Selected' ? '#15803d' :
                            a.status === 'Interview' ? '#7e22ce' :
                            a.status === 'Rejected' ? '#b91c1c' : '#1e293b',
                        }}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterApplicants;

