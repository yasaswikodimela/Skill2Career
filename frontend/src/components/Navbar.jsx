// frontend/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? '#ffffff' : '#bfdbfe',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: isActive(path) ? '600' : '500',
    padding: '0.4rem 0.75rem',
    borderRadius: '0.375rem',
    background: isActive(path) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
    transition: 'all 0.15s ease',
    display: 'inline-block',
  });

  return (
    <nav className="hs-navbar" style={{
      backgroundColor: '#1e3a8a',
      color: '#fff',
      padding: '0.65rem 1.25rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/" style={{
            color: '#fff',
            fontSize: '1.25rem',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <span style={{ fontSize: '1.4rem' }}>🎯</span>
            <span>Skill<span style={{ color: '#60a5fa' }}>2</span>Career</span>
          </Link>
          {user?.role && (
            <span style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 700,
              background: user.role === 'admin' ? '#7c3aed' : user.role === 'recruiter' ? '#0284c7' : '#16a34a',
              color: '#fff',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
            }}>
              {user.role}
            </span>
          )}
        </div>

        {/* Navigation links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          flexWrap: 'wrap',
        }}>
          {user ? (
            <>
              {user.role === 'student' && (
                <>
                  <Link to="/student/dashboard" style={linkStyle('/student/dashboard')}>Dashboard</Link>
                  <Link to="/student/profile" style={linkStyle('/student/profile')}>Profile</Link>
                  <Link to="/student/jobs" style={linkStyle('/student/jobs')}>Jobs</Link>
                  <Link to="/student/analysis" style={linkStyle('/student/analysis')}>Skill Analysis</Link>
                  <Link to="/student/roadmap" style={linkStyle('/student/roadmap')}>Roadmap</Link>
                  <Link to="/student/applications" style={linkStyle('/student/applications')}>Applications</Link>
                </>
              )}

              {user.role === 'recruiter' && (
                <>
                  <Link to="/recruiter/dashboard" style={linkStyle('/recruiter/dashboard')}>Dashboard</Link>
                  <Link to="/recruiter/profile" style={linkStyle('/recruiter/profile')}>Company Profile</Link>
                </>
              )}

              {user.role === 'admin' && (
                <Link to="/admin/dashboard" style={linkStyle('/admin/dashboard')}>Admin Panel</Link>
              )}

              <button
                onClick={handleLogout}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  marginLeft: '0.5rem',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ef4444')}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" style={linkStyle('/')}>Home</Link>
              <Link to="/login" style={linkStyle('/login')}>Login</Link>
              <Link
                to="/register"
                style={{
                  ...linkStyle('/register'),
                  background: '#2563eb',
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
