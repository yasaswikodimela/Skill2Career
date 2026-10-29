// frontend/src/pages/StudentApplications.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const DEMO_APPLICATIONS = [
  {
    _id: 'app1',
    status: 'Screening',
    appliedAt: '2024-03-12T10:30:00Z',
    job: {
      title: 'Full Stack React & Node Developer',
      company: 'Acme Cloud Solutions',
      location: 'Remote',
      type: 'Full-time',
    },
    resume: { originalName: 'Alex_Morgan_Resume_2025.pdf' },
  },
  {
    _id: 'app2',
    status: 'Interview',
    appliedAt: '2024-03-02T14:15:00Z',
    job: {
      title: 'Junior Frontend Engineer',
      company: 'Nexus Interactive',
      location: 'San Francisco, CA',
      type: 'Full-time',
    },
    resume: { originalName: 'Alex_Morgan_Resume_2025.pdf' },
  },
  {
    _id: 'app3',
    status: 'Applied',
    appliedAt: '2024-03-25T09:00:00Z',
    job: {
      title: 'Software Engineering Intern',
      company: 'Apex Fintech',
      location: 'New York, NY',
      type: 'Internship',
    },
    resume: { originalName: 'Alex_Morgan_Resume_2025.pdf' },
  },
];

const getStatusBadge = (status) => {
  const map = {
    Applied: { bg: '#dbeafe', color: '#1d4ed8' },
    Screening: { bg: '#fef3c7', color: '#92400e' },
    Interview: { bg: '#ede9fe', color: '#6b21a8' },
    Selected: { bg: '#dcfce7', color: '#15803d' },
    Rejected: { bg: '#fee2e2', color: '#b91c1c' },
    Withdrawn: { bg: '#f1f5f9', color: '#475569' },
  };

  const current = map[status] || { bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{
      background: current.bg,
      color: current.color,
      padding: '0.2rem 0.65rem',
      borderRadius: '9999px',
      fontSize: '0.78rem',
      fontWeight: 700,
      letterSpacing: '0.02em',
    }}>
      {status || 'Applied'}
    </span>
  );
};

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setIsDemo(false);
      try {
        const { data } = await api.get('/applications/me');
        const list = Array.isArray(data) ? data : data.applications || [];
        if (list.length === 0) {
          setApplications(DEMO_APPLICATIONS);
          setIsDemo(true);
        } else {
          setApplications(list);
        }
      } catch (err) {
        console.warn('Backend unavailable, showing demo student applications:', err.message);
        setIsDemo(true);
        setApplications(DEMO_APPLICATIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem' }}>Loading application history...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', maxWidth: '950px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
            My Applications
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Real-time pipeline tracking for positions you have applied for.
          </p>
        </div>
        <Link to="/student/jobs" style={{ background: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.85rem' }}>
          + Explore More Jobs
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
          ℹ️ <strong>Demo Preview:</strong> Backend is offline or no active applications submitted. Displaying sample applications.
        </div>
      )}

      {applications.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '3rem',
          textAlign: 'center',
          border: '1px dashed #cbd5e1',
          color: '#64748b',
        }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>No applications yet</p>
          <p style={{ fontSize: '0.9rem', margin: '0 0 1.25rem' }}>Browse open roles and apply with your uploaded resume to track status updates here.</p>
          <Link to="/student/jobs" style={{ background: '#2563eb', color: '#fff', padding: '0.55rem 1.2rem', borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.88rem' }}>
            Browse Opportunities
          </Link>
        </div>
      ) : (
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1.2rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Position & Company</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Location</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Attached Resume</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Applied Date</th>
                  <th style={{ padding: '0.75rem 1.2rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Current Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app._id}
                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>
                        {app.job?.title || 'Position'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.82rem' }}>
                        {app.job?.company || 'Verified Company'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#475569' }}>
                      {app.job?.location || 'Remote'}
                    </td>
                    <td style={{ padding: '1rem', color: '#475569', fontSize: '0.85rem' }}>
                      📄 {app.resume?.originalName || 'Primary Resume'}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.82rem' }}>
                      {new Date(app.appliedAt || app.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      {getStatusBadge(app.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
