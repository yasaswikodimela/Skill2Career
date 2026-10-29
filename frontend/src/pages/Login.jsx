// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (res.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(res.message);
    }
  };

  const fillDemo = (demoRole) => {
    if (demoRole === 'student') {
      setEmail('student@example.com');
      setPassword('password123');
    } else if (demoRole === 'recruiter') {
      setEmail('recruiter@acme.com');
      setPassword('password123');
    } else if (demoRole === 'admin') {
      setEmail('admin@skill2career.com');
      setPassword('admin123');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '2.5rem auto', padding: '0 1rem' }}>
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Sign in to access your Skill2Career dashboard
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.65rem 0.9rem',
            borderRadius: '0.375rem',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.7rem',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast-Fill */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px dashed #e2e8f0',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick fill sample account:
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '0.4rem' }}>
            <button
              type="button"
              onClick={() => fillDemo('student')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '0.25rem', cursor: 'pointer' }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => fillDemo('recruiter')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '0.25rem', cursor: 'pointer' }}
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '0.25rem', cursor: 'pointer' }}
            >
              Admin
            </button>
          </div>
        </div>

        <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.88rem', color: '#64748b', margin: '1.25rem 0 0' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
