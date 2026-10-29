// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';

/* ─── Demo data (shown when backend is unavailable) ─── */
const DEMO_USERS = [
  { _id: 'demo-u1', email: 'alice@example.com',   role: 'student',   createdAt: '2024-01-15T10:00:00Z' },
  { _id: 'demo-u2', email: 'bob@example.com',     role: 'recruiter', createdAt: '2024-02-20T08:30:00Z' },
  { _id: 'demo-u3', email: 'carol@example.com',   role: 'student',   createdAt: '2024-03-05T14:22:00Z' },
  { _id: 'demo-u4', email: 'dave@corp.io',        role: 'recruiter', createdAt: '2024-03-18T09:10:00Z' },
  { _id: 'demo-u5', email: 'eve@example.com',     role: 'student',   createdAt: '2024-04-02T11:05:00Z' },
];

const DEMO_RECRUITERS = [
  { _id: 'demo-r1', companyName: 'Acme Corp',   email: 'hr@acme.com',   isVerified: false, createdAt: '2024-02-20T08:30:00Z' },
  { _id: 'demo-r2', companyName: 'Beta Ltd',    email: 'jobs@beta.io',  isVerified: true,  createdAt: '2024-03-18T09:10:00Z' },
  { _id: 'demo-r3', companyName: 'Gamma Tech',  email: 'hi@gamma.co',   isVerified: false, createdAt: '2024-04-10T15:45:00Z' },
];

const DEMO_JOBS = [
  { _id: 'demo-j1', title: 'Frontend Engineer',  company: 'Acme Corp',   location: 'Remote',      isPublished: true,  isClosed: false, createdAt: '2024-04-01T00:00:00Z' },
  { _id: 'demo-j2', title: 'Data Analyst',       company: 'Beta Ltd',    location: 'New York',    isPublished: true,  isClosed: true,  createdAt: '2024-03-20T00:00:00Z' },
  { _id: 'demo-j3', title: 'Backend Developer',  company: 'Gamma Tech',  location: 'San Francisco', isPublished: false, isClosed: false, createdAt: '2024-04-12T00:00:00Z' },
];

/* ─── Inline styles (keeps the file self-contained; no extra CSS file needed) ─── */
const S = {
  page: {
    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
    color: '#1e293b',
    minHeight: '100vh',
    background: '#f1f5f9',
  },
  header: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
    color: '#fff',
    padding: '1.75rem 2rem',
    borderRadius: '0 0 1rem 1rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(30,58,138,.25)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  headerSub: {
    margin: '0.25rem 0 0',
    opacity: 0.8,
    fontSize: '0.9rem',
  },
  demoBar: {
    background: '#fef9c3',
    border: '1px solid #fde68a',
    color: '#78350f',
    borderRadius: '0.5rem',
    padding: '0.75rem 1.25rem',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: (accent) => ({
    background: '#fff',
    borderRadius: '0.75rem',
    padding: '1.1rem 1.25rem',
    boxShadow: '0 1px 4px rgba(0,0,0,.07)',
    borderTop: `4px solid ${accent}`,
  }),
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.78rem',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  section: {
    background: '#fff',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 4px rgba(0,0,0,.07)',
    marginBottom: '1.75rem',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e40af',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  count: {
    background: '#dbeafe',
    color: '#1d4ed8',
    borderRadius: '9999px',
    padding: '0.1rem 0.6rem',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.88rem',
  },
  th: {
    padding: '0.6rem 1rem',
    textAlign: 'left',
    fontWeight: 600,
    color: '#475569',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '0.65rem 1rem',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle',
  },
  btn: (color, bg) => ({
    display: 'inline-block',
    padding: '0.28rem 0.75rem',
    fontSize: '0.78rem',
    fontWeight: 500,
    color,
    background: bg,
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
    marginRight: '0.35rem',
  }),
  badge: (color, bg) => ({
    display: 'inline-block',
    padding: '0.15rem 0.55rem',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    fontWeight: 700,
    color,
    background: bg,
    letterSpacing: '0.03em',
  }),
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
};

/* ─── Helpers ─── */
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const roleBadge = (role) => {
  const map = {
    admin:     { color: '#7c3aed', bg: '#ede9fe' },
    recruiter: { color: '#0369a1', bg: '#e0f2fe' },
    student:   { color: '#15803d', bg: '#dcfce7' },
  };
  const s = map[role] || { color: '#475569', bg: '#f1f5f9' };
  return <span style={S.badge(s.color, s.bg)}>{role}</span>;
};

/* ─── Component ─── */
const AdminDashboard = () => {
  const [users,      setUsers]      = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs,       setJobs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [isDemo,     setIsDemo]     = useState(false);
  const [tab,        setTab]        = useState('users'); // 'users' | 'recruiters' | 'jobs'
  const [actionMsg,  setActionMsg]  = useState(null);   // { type: 'success'|'error', text }

  /* ── fetch all data in parallel ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    setIsDemo(false);
    try {
      // GET /api/admin/users  → returns all users
      // GET /api/jobs         → public endpoint, returns jobs (admin uses this for moderation)
      // There is no /admin/recruiters endpoint; we filter users by role from the users list
      // and separately fetch recruiter profiles via /api/jobs to get companies.
      // For recruiter profiles we rely on the users list (role === 'recruiter').
      const [usersRes, jobsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/jobs'),
      ]);

      const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
      setUsers(allUsers);

      // Derive recruiter list from user list (role === 'recruiter').
      // Augment with job company names where possible.
      const recruiterUsers = allUsers.filter(u => u.role === 'recruiter');
      setRecruiters(recruiterUsers.map(u => ({
        _id:        u._id,
        email:      u.email,
        companyName: u.companyName || u.email,
        isVerified:  !!u.isVerified,
        createdAt:   u.createdAt,
      })));

      const allJobs = Array.isArray(jobsRes.data)
        ? jobsRes.data
        : Array.isArray(jobsRes.data?.jobs)
          ? jobsRes.data.jobs
          : [];
      setJobs(allJobs);
    } catch (err) {
      console.warn('Admin dashboard: backend unavailable – showing demo data.', err?.message);
      setIsDemo(true);
      setUsers(DEMO_USERS);
      setRecruiters(DEMO_RECRUITERS);
      setJobs(DEMO_JOBS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── flash message helper ── */
  const flash = (type, text) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 3500);
  };

  /* ── User: delete ── */
  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Permanently delete user "${email}"? This cannot be undone.`)) return;
    if (isDemo) { flash('error', '⚠ Demo mode – user not deleted from database.'); return; }
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      setRecruiters(prev => prev.filter(r => r._id !== userId));
      flash('success', `User "${email}" deleted.`);
    } catch (err) {
      flash('error', err.response?.data?.message || 'Delete failed.');
    }
  };

  /* ── Recruiter: verify / reject ── */
  // Backend route: POST /api/admin/recruiter/verify  body: { recruiterId, verify }
  const handleVerify = async (recruiterId, verifyValue) => {
    if (isDemo) { flash('error', '⚠ Demo mode – verification not saved to database.'); return; }
    try {
      await api.post('/admin/recruiter/verify', { recruiterId, verify: verifyValue });
      setRecruiters(prev => prev.map(r =>
        r._id === recruiterId ? { ...r, isVerified: verifyValue } : r
      ));
      flash('success', `Recruiter ${verifyValue ? 'verified' : 'rejected'}.`);
    } catch (err) {
      flash('error', err.response?.data?.message || 'Verification failed.');
    }
  };

  /* ── Job: remove ── */
  // Backend route: DELETE /api/admin/jobs/:id
  const handleRemoveJob = async (jobId, title) => {
    if (!window.confirm(`Remove job listing "${title}"?`)) return;
    if (isDemo) { flash('error', '⚠ Demo mode – job not removed from database.'); return; }
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      setJobs(prev => prev.filter(j => j._id !== jobId));
      flash('success', `Job "${title}" removed.`);
    } catch (err) {
      flash('error', err.response?.data?.message || 'Remove failed.');
    }
  };

  /* ── Stats ── */
  const totalUsers     = users.length;
  const totalStudents  = users.filter(u => u.role === 'student').length;
  const totalRecruiters = recruiters.length;
  const totalJobs      = jobs.length;

  /* ── Render helpers ── */
  const TabBtn = ({ id, label, count }) => (
    <button
      onClick={() => setTab(id)}
      style={{
        padding: '0.5rem 1.1rem',
        border: 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: '0.875rem',
        background: tab === id ? '#1e3a8a' : '#e2e8f0',
        color:      tab === id ? '#fff'    : '#475569',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
    >
      {label}
      <span style={{
        background: tab === id ? 'rgba(255,255,255,.25)' : '#94a3b8',
        color: '#fff',
        borderRadius: '9999px',
        padding: '0 0.45rem',
        fontSize: '0.7rem',
        fontWeight: 700,
      }}>{count}</span>
    </button>
  );

  if (loading) {
    return (
      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.headerTitle}>🛡 Admin Dashboard</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem' }}>Loading dashboard data…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* ── Header ── */}
      <div style={S.header}>
        <h1 style={S.headerTitle}>🛡 Admin Dashboard</h1>
        <p style={S.headerSub}>Skill2Career Platform Control Panel</p>
      </div>

      <div style={{ padding: '0 1rem 2rem' }}>
        {/* ── Demo Banner ── */}
        {isDemo && (
          <div style={S.demoBar}>
            <span>⚠</span>
            <span>
              <strong>Demo mode:</strong> Backend is unavailable. Displaying sample data for UI preview.
              Actions will not be saved to the database.
            </span>
          </div>
        )}

        {/* ── Flash message ── */}
        {actionMsg && (
          <div style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '0.5rem',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            background: actionMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${actionMsg.type === 'success' ? '#86efac' : '#fca5a5'}`,
            color:  actionMsg.type === 'success' ? '#15803d' : '#b91c1c',
          }}>
            {actionMsg.text}
          </div>
        )}

        {/* ── Summary cards ── */}
        <div style={S.statsGrid}>
          {[
            { label: 'Total Users',    value: totalUsers,      accent: '#6366f1' },
            { label: 'Students',       value: totalStudents,   accent: '#22c55e' },
            { label: 'Recruiters',     value: totalRecruiters, accent: '#3b82f6' },
            { label: 'Job Listings',   value: totalJobs,       accent: '#f59e0b' },
          ].map(({ label, value, accent }) => (
            <div key={label} style={S.statCard(accent)}>
              <div style={{ ...S.statValue, color: accent }}>{value}</div>
              <div style={S.statLabel}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <TabBtn id="users"      label="👤 Users"      count={totalUsers} />
          <TabBtn id="recruiters" label="🏢 Recruiters" count={totalRecruiters} />
          <TabBtn id="jobs"       label="💼 Jobs"       count={totalJobs} />
        </div>

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <h3 style={S.sectionTitle}>
                👤 User Management
                <span style={S.count}>{totalUsers}</span>
              </h3>
            </div>
            {users.length === 0 ? (
              <div style={S.empty}>No users found.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Email</th>
                      <th style={S.th}>Role</th>
                      <th style={S.th}>Joined</th>
                      <th style={S.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={{ transition: 'background .1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = ''}>
                        <td style={S.td}>
                          <span style={{ fontWeight: 500 }}>{u.email}</span>
                        </td>
                        <td style={S.td}>{roleBadge(u.role)}</td>
                        <td style={{ ...S.td, color: '#64748b', fontSize: '0.82rem' }}>
                          {fmtDate(u.createdAt)}
                        </td>
                        <td style={S.td}>
                          <button
                            style={S.btn('#fff', '#ef4444')}
                            onClick={() => handleDeleteUser(u._id, u.email)}
                            title="Delete user"
                          >
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── RECRUITERS TAB ── */}
        {tab === 'recruiters' && (
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <h3 style={S.sectionTitle}>
                🏢 Recruiter Verification
                <span style={S.count}>{totalRecruiters}</span>
              </h3>
            </div>
            {recruiters.length === 0 ? (
              <div style={S.empty}>No recruiter accounts found.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Company / Email</th>
                      <th style={S.th}>Status</th>
                      <th style={S.th}>Joined</th>
                      <th style={S.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recruiters.map(r => (
                      <tr key={r._id}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = ''}>
                        <td style={S.td}>
                          <div style={{ fontWeight: 500 }}>{r.companyName || '—'}</div>
                          <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{r.email}</div>
                        </td>
                        <td style={S.td}>
                          {r.isVerified
                            ? <span style={S.badge('#15803d', '#dcfce7')}>✓ Verified</span>
                            : <span style={S.badge('#92400e', '#fef3c7')}>⏳ Pending</span>}
                        </td>
                        <td style={{ ...S.td, color: '#64748b', fontSize: '0.82rem' }}>
                          {fmtDate(r.createdAt)}
                        </td>
                        <td style={S.td}>
                          {!r.isVerified ? (
                            <button
                              style={S.btn('#fff', '#22c55e')}
                              onClick={() => handleVerify(r._id, true)}
                              title="Approve recruiter"
                            >
                              ✓ Verify
                            </button>
                          ) : (
                            <button
                              style={S.btn('#fff', '#f59e0b')}
                              onClick={() => handleVerify(r._id, false)}
                              title="Revoke verification"
                            >
                              ✗ Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── JOBS TAB ── */}
        {tab === 'jobs' && (
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <h3 style={S.sectionTitle}>
                💼 Job Moderation
                <span style={S.count}>{totalJobs}</span>
              </h3>
            </div>
            {jobs.length === 0 ? (
              <div style={S.empty}>No job listings found.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Job Title</th>
                      <th style={S.th}>Company</th>
                      <th style={S.th}>Location</th>
                      <th style={S.th}>Status</th>
                      <th style={S.th}>Posted</th>
                      <th style={S.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(j => {
                      const company = j.company || j.recruiter?.companyName || '—';
                      const published = j.isPublished;
                      const closed    = j.isClosed;
                      const statusLabel = closed ? 'Closed' : published ? 'Live' : 'Draft';
                      const statusStyle = closed
                        ? S.badge('#475569', '#f1f5f9')
                        : published
                          ? S.badge('#15803d', '#dcfce7')
                          : S.badge('#92400e', '#fef3c7');

                      return (
                        <tr key={j._id}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.background = ''}>
                          <td style={S.td}>
                            <span style={{ fontWeight: 500 }}>{j.title}</span>
                          </td>
                          <td style={S.td}>{company}</td>
                          <td style={{ ...S.td, color: '#64748b' }}>{j.location || '—'}</td>
                          <td style={S.td}><span style={statusStyle}>{statusLabel}</span></td>
                          <td style={{ ...S.td, color: '#64748b', fontSize: '0.82rem' }}>
                            {fmtDate(j.createdAt)}
                          </td>
                          <td style={S.td}>
                            <button
                              style={S.btn('#fff', '#ef4444')}
                              onClick={() => handleRemoveJob(j._id, j.title)}
                              title="Remove job listing"
                            >
                              🗑 Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Footer note ── */}
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem', marginTop: '1rem' }}>
          Skill2Career Admin Panel · Actions are permanent and cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
