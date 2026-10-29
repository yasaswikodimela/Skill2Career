// frontend/src/pages/StudentProfile.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const DEMO_RESUMES = [
  { _id: 'dr1', originalName: 'Alex_Morgan_Resume_2025.pdf', size: 1024 * 145, isPrimary: true, createdAt: '2024-03-01' },
];

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    college: '',
    degree: '',
    graduationYear: '',
    careerGoal: '',
    bio: '',
    skills: [],
  });

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', text }

  // New skill input state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const loadProfileAndResumes = async () => {
    setLoading(true);
    setIsDemo(false);
    try {
      const [pRes, rRes] = await Promise.all([
        api.get('/student/profile'),
        api.get('/student/resumes').catch(() => ({ data: [] })),
      ]);

      if (pRes?.data) {
        setProfile({
          firstName: pRes.data.firstName || '',
          lastName: pRes.data.lastName || '',
          phone: pRes.data.phone || '',
          location: pRes.data.location || '',
          college: pRes.data.college || '',
          degree: pRes.data.degree || '',
          graduationYear: pRes.data.graduationYear || '',
          careerGoal: pRes.data.careerGoal || '',
          bio: pRes.data.bio || '',
          skills: Array.isArray(pRes.data.skills) ? pRes.data.skills : [],
        });
      }

      const resumeList = Array.isArray(rRes?.data) ? rRes.data : rRes?.data?.resumes || [];
      setResumes(resumeList);
    } catch (err) {
      console.warn('Backend unavailable, showing demo student profile:', err.message);
      setIsDemo(true);
      setProfile({
        firstName: 'Alex',
        lastName: 'Morgan',
        phone: '+1 (555) 234-5678',
        location: 'Austin, TX',
        college: 'State University of Texas',
        degree: 'B.S. in Computer Science',
        graduationYear: 2025,
        careerGoal: 'Full Stack Software Engineer',
        bio: 'Passionate developer interested in building high-performance web applications using React, Node.js, and Cloud services.',
        skills: [
          { name: 'JavaScript', level: 'Intermediate' },
          { name: 'React', level: 'Intermediate' },
          { name: 'Node.js', level: 'Beginner' },
          { name: 'SQL', level: 'Intermediate' },
        ],
      });
      setResumes(DEMO_RESUMES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileAndResumes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const exists = profile.skills.some(
      (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (exists) {
      showToast('error', `Skill "${newSkillName}" is already listed.`);
      return;
    }

    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: newSkillName.trim(), level: newSkillLevel }],
    }));
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillNameToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillNameToRemove),
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (isDemo) {
      showToast('error', '⚠️ Demo mode: changes are preview only and cannot be saved to the database.');
      return;
    }

    setSaving(true);
    try {
      await api.put('/student/profile', profile);
      showToast('success', 'Profile updated successfully!');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Resume handlers
  const handleUploadResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isDemo) {
      showToast('error', '⚠️ Demo mode: file upload disabled.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Matches upload.single('file')

    setUploading(true);
    try {
      const { data } = await api.post('/student/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumes((prev) => [data, ...prev]);
      showToast('success', `Resume "${file.name}" uploaded successfully!`);
      e.target.value = '';
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (resumeId) => {
    if (isDemo) {
      showToast('error', '⚠️ Demo mode: action not saved.');
      return;
    }
    try {
      await api.patch(`/student/resumes/${resumeId}/primary`);
      setResumes((prev) =>
        prev.map((r) => ({ ...r, isPrimary: r._id === resumeId }))
      );
      showToast('success', 'Primary resume updated.');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to set primary resume.');
    }
  };

  const handleDeleteResume = async (resumeId, filename) => {
    if (!window.confirm(`Delete resume "${filename}"?`)) return;
    if (isDemo) {
      showToast('error', '⚠️ Demo mode: file cannot be deleted.');
      return;
    }
    try {
      await api.delete(`/student/resumes/${resumeId}`);
      setResumes((prev) => prev.filter((r) => r._id !== resumeId));
      showToast('success', 'Resume removed.');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete resume.');
    }
  };

  const handleDownload = async (resumeId, filename) => {
    if (isDemo) {
      showToast('error', '⚠️ Demo mode: file download not available in preview.');
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
      showToast('error', 'Failed to download resume file.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem' }}>Loading profile information...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
            Student Profile & Resumes
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Keep your skills and credentials updated for AI gap analysis and recruiter discovery.
          </p>
        </div>
        <Link to="/student/dashboard" style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to Dashboard
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
          ⚠️ <strong>Demo Mode:</strong> Backend is unavailable. Displaying sample student profile data.
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

      {/* Main Profile Form */}
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '1.75rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
          Personal & Academic Information
        </h2>

        <form onSubmit={handleSaveProfile}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Location (City, State / Remote)
              </label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                placeholder="San Francisco, CA"
                style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                College / University
              </label>
              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleInputChange}
                placeholder="e.g. University of Texas"
                style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Degree & Major
              </label>
              <input
                type="text"
                name="degree"
                value={profile.degree}
                onChange={handleInputChange}
                placeholder="e.g. B.S. in Computer Science"
                style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Expected Graduation Year
              </label>
              <input
                type="number"
                name="graduationYear"
                value={profile.graduationYear}
                onChange={handleInputChange}
                placeholder="2025"
                style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                Target Career Goal / Job Title
              </label>
              <input
                type="text"
                name="careerGoal"
                value={profile.careerGoal}
                onChange={handleInputChange}
                placeholder="e.g. Full Stack Developer"
                style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
              Brief Bio / Professional Summary
            </label>
            <textarea
              name="bio"
              rows={3}
              value={profile.bio}
              onChange={handleInputChange}
              placeholder="Highlight your passions, key projects, and career aspirations..."
              style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
            />
          </div>

          {/* Technical Skills Section */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            border: '1px solid #e2e8f0',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#1e3a8a' }}>
              🛠 Technical & Professional Skills
            </h3>

            {/* List of currently added skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {profile.skills.length === 0 ? (
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No skills added yet. Use the input below to add your tech stack.</span>
              ) : (
                profile.skills.map((s) => (
                  <span
                    key={s.name}
                    style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '9999px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    {s.name} <span style={{ opacity: 0.65, fontSize: '0.72rem' }}>({s.level})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s.name)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#1e40af',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '0.9rem',
                        lineHeight: 1,
                      }}
                      title="Remove skill"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add skill input row */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="e.g. React, Python, Docker"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                style={{ flex: 2, minWidth: '150px', padding: '0.45rem 0.65rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                style={{ flex: 1, minWidth: '120px', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.85rem' }}
              >
                {SKILL_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                style={{
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  padding: '0.45rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Add Skill
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 1.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.75 : 1,
            }}
          >
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Resumes Management Section */}
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '1.75rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              📄 Uploaded Resumes
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
              Upload your resume in PDF or DOCX format (Max 5MB).
            </p>
          </div>

          <div>
            <label
              style={{
                display: 'inline-block',
                background: uploading ? '#94a3b8' : '#16a34a',
                color: '#fff',
                padding: '0.55rem 1.1rem',
                borderRadius: '0.375rem',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
              }}
            >
              {uploading ? 'Uploading...' : '📁 Upload New Resume'}
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleUploadResume}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {resumes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '0.5rem' }}>
            No resumes uploaded yet. Upload a resume to enable 1-click applications.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resumes.map((r) => (
              <div
                key={r._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.5rem',
                  border: r.isPrimary ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                  background: r.isPrimary ? '#f0f7ff' : '#f8fafc',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.originalName}</span>
                    {r.isPrimary && (
                      <span style={{
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}>
                        ★ PRIMARY
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Size: {r.size ? `${Math.round(r.size / 1024)} KB` : 'Standard'} · Added {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {!r.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(r._id)}
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Make Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDownload(r._id, r.originalName)}
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    ⬇ Download
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteResume(r._id, r.originalName)}
                    style={{
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fecaca',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
