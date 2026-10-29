// frontend/src/pages/JobSearch.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const DEMO_JOBS = [
  {
    _id: 'dj1',
    title: 'Full Stack React & Node Developer',
    company: 'Acme Cloud Solutions',
    location: 'Remote',
    type: 'Full-time',
    salaryRange: '$85,000 - $110,000',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API'],
    description: 'We are seeking a talented Full Stack Developer to build reliable cloud infrastructure dashboards and consumer applications.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'dj2',
    title: 'Junior Frontend Engineer',
    company: 'Nexus Interactive',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salaryRange: '$75,000 - $95,000',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS'],
    description: 'Join our design systems team creating beautiful, accessible interfaces for millions of users worldwide.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'dj3',
    title: 'Software Engineering Intern',
    company: 'Apex Fintech',
    location: 'New York, NY',
    type: 'Internship',
    salaryRange: '$35 - $42 / hr',
    requiredSkills: ['Python', 'SQL', 'Git', 'Data Structures'],
    description: 'Summer internship program focusing on backend trading systems, microservices, and automated testing suites.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'dj4',
    title: 'Cloud DevOps Specialist',
    company: 'Horizon Data Systems',
    location: 'Austin, TX',
    type: 'Contract',
    salaryRange: '$65 / hr',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD'],
    description: 'Maintain high availability multi-region infrastructure pipelines and ensure automated security compliance.',
    createdAt: new Date().toISOString(),
  },
];

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ title: '', location: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');

  const fetchJobs = async (filterParams = filters) => {
    setLoading(true);
    setError('');
    setIsDemo(false);
    try {
      const cleanParams = {};
      if (filterParams.title?.trim()) cleanParams.title = filterParams.title.trim();
      if (filterParams.location?.trim()) cleanParams.location = filterParams.location.trim();
      if (filterParams.type?.trim()) cleanParams.type = filterParams.type.trim();

      const { data } = await api.get('/jobs', { params: cleanParams });
      const jobList = Array.isArray(data) ? data : data.jobs || [];

      if (jobList.length === 0 && !cleanParams.title && !cleanParams.location && !cleanParams.type) {
        // If server returns empty list initially, fallback to demo jobs for preview
        setJobs(DEMO_JOBS);
        setIsDemo(true);
      } else {
        setJobs(jobList);
      }
    } catch (err) {
      console.warn('Backend unavailable, falling back to demo jobs:', err.message);
      setIsDemo(true);
      setJobs(DEMO_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const handleReset = () => {
    const reset = { title: '', location: '', type: '' };
    setFilters(reset);
    fetchJobs(reset);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
          Explore Career Opportunities
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Browse open listings and run AI gap analysis to see how your skillset compares.
        </p>
      </div>

      {isDemo && (
        <div style={{
          background: '#fef9c3',
          border: '1px solid #fde68a',
          color: '#854d0e',
          padding: '0.65rem 1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.25rem',
          fontSize: '0.85rem',
        }}>
          ℹ️ <strong>Demo Preview:</strong> Backend is offline or database has no open listings. Displaying sample job opportunities.
        </div>
      )}

      {/* Filter Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
          gap: '0.75rem',
          alignItems: 'end',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
            Job Title or Keyword
          </label>
          <input
            name="title"
            placeholder="e.g. Frontend, React"
            value={filters.title}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
            Location
          </label>
          <input
            name="location"
            placeholder="e.g. Remote, Austin"
            value={filters.location}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
            Job Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box', fontSize: '0.9rem' }}
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '0.375rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #cbd5e1',
              padding: '0.6rem 0.85rem',
              borderRadius: '0.375rem',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', margin: 0 }}>
          {loading ? 'Searching opportunities...' : `Showing ${jobs.length} Opportunities`}
        </h2>
      </div>

      {/* Jobs Listing */}
      {jobs.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '3rem',
          textAlign: 'center',
          border: '1px dashed #cbd5e1',
          color: '#64748b',
        }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>No matching jobs found</p>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>Try clearing your filters or searching for a different keyword.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map((job) => (
            <div
              key={job._id}
              style={{
                background: '#fff',
                borderRadius: '0.75rem',
                padding: '1.4rem 1.6rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                    <Link to={`/student/jobs/${job._id}`} style={{ color: 'inherit' }}>
                      {job.title}
                    </Link>
                  </h3>
                  <span style={{
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {job.type || 'Full-time'}
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.35rem', fontWeight: 500 }}>
                  🏢 {job.company || job.recruiter?.companyName || 'Verified Partner'} · 📍 {job.location || 'Remote'}
                  {job.salaryRange && <span> · 💰 {job.salaryRange}</span>}
                </div>

                {job.description && (
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0.6rem 0', lineHeight: 1.5 }}>
                    {job.description.length > 170 ? `${job.description.slice(0, 170)}...` : job.description}
                  </p>
                )}

                {/* Required Skills Badges */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
                    {job.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#f1f5f9',
                          color: '#334155',
                          borderRadius: '0.25rem',
                          padding: '0.15rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '140px' }}>
                <Link
                  to={`/student/jobs/${job._id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#2563eb',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  View & Apply
                </Link>
                <Link
                  to={`/student/analysis?jobId=${job._id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#f0fdf4',
                    color: '#15803d',
                    border: '1px solid #bbf7d0',
                    padding: '0.45rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  ⚡ Match Gap
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSearch;
