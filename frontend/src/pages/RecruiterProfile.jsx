// frontend/src/pages/RecruiterProfile.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const RecruiterProfile = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    email: '',
    website: '',
    description: '',
    isVerified: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setIsDemo(false);
      try {
        const { data } = await api.get('/recruiter/profile');
        if (data) {
          setProfile({
            companyName: data.companyName || '',
            email: data.email || data.user?.email || '',
            website: data.website || '',
            description: data.description || '',
            isVerified: !!data.isVerified,
          });
        }
      } catch (err) {
        console.warn('Backend unavailable, showing demo recruiter profile:', err.message);
        setIsDemo(true);
        setProfile({
          companyName: 'Acme Cloud Solutions',
          email: 'recruiter@acme.com',
          website: 'https://acmecloud.example.com',
          description: 'Global developer platform specializing in infrastructure monitoring and modern web engineering tools.',
          isVerified: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (isDemo) {
      showToast('error', '⚠️ Demo mode: changes cannot be saved to the database.');
      return;
    }

    setSaving(true);
    try {
      const { data } = await api.put('/recruiter/profile', profile);
      setProfile((prev) => ({ ...prev, ...data }));
      showToast('success', 'Company profile updated successfully!');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem' }}>Loading recruiter profile...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', maxWidth: '700px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f766e', margin: 0 }}>
            Company Profile
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Update your organization's hiring presence and verification details.
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
          ⚠️ <strong>Demo Mode:</strong> Backend is offline. Displaying sample recruiter profile.
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

      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '2rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {/* Verification Status Banner */}
        <div style={{
          background: profile.isVerified ? '#f0fdf4' : '#fffbeb',
          border: `1px solid ${profile.isVerified ? '#bbf7d0' : '#fde68a'}`,
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span style={{ fontSize: '1.4rem' }}>{profile.isVerified ? '🛡️' : '⏳'}</span>
          <div>
            <div style={{ fontWeight: 700, color: profile.isVerified ? '#15803d' : '#92400e', fontSize: '0.95rem' }}>
              {profile.isVerified ? 'Verified Recruiter Account' : 'Account Pending Admin Verification'}
            </div>
            <div style={{ fontSize: '0.85rem', color: profile.isVerified ? '#166534' : '#78350f' }}>
              {profile.isVerified
                ? 'Your company listings are marked with verified badge and visible to all students.'
                : 'Our platform administrator verifies company credentials to maintain high trust.'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Company / Organization Name *
            </label>
            <input
              type="text"
              required
              value={profile.companyName}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Contact / Recruitment Email
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', background: '#f8fafc', color: '#64748b', boxSizing: 'border-box' }}
            />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Email is tied to your primary user login credentials.</span>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Official Website URL
            </label>
            <input
              type="url"
              placeholder="https://company.example.com"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Company Bio & Culture Overview
            </label>
            <textarea
              rows={4}
              placeholder="Tell candidates about your company mission, tech stack, and workplace culture..."
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              background: '#0f766e',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 1.6rem',
              borderRadius: '0.375rem',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.75 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save Company Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecruiterProfile;

