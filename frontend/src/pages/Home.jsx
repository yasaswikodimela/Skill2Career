// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'recruiter') return '/recruiter/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
        color: '#fff',
        borderRadius: '1rem',
        padding: '3.5rem 2rem',
        textAlign: 'center',
        marginBottom: '3rem',
        boxShadow: '0 8px 24px rgba(30, 58, 138, 0.25)',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(4px)',
          padding: '0.35rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 600,
          letterSpacing: '0.03em',
          marginBottom: '1.25rem',
          color: '#bfdbfe',
        }}>
          ⚡ AI-Powered Skill Gap Analysis & Career Opportunity Management
        </div>

        <h1 style={{
          fontSize: '2.75rem',
          fontWeight: 800,
          lineHeight: 1.2,
          margin: '0 auto 1.25rem',
          maxWidth: '850px',
          color: '#ffffff',
          letterSpacing: '-0.02em',
        }}>
          Bridge the Gap Between Your <span style={{ color: '#93c5fd' }}>Skills</span> and Your Dream <span style={{ color: '#86efac' }}>Career</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          maxWidth: '680px',
          margin: '0 auto 2rem',
          color: '#e0e7ff',
          lineHeight: 1.6,
        }}>
          Analyze job requirements, pinpoint missing competencies, generate personalized learning roadmaps,
          and connect directly with verified recruiters.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {user ? (
            <Link
              to={getDashboardLink()}
              style={{
                background: '#2563eb',
                color: '#fff',
                padding: '0.75rem 1.75rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              }}
            >
              Go to Your Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}
              >
                Sign Up Free
              </Link>
              <Link
                to="/login"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.5rem' }}>
            Everything You Need to Accelerate Your Career
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Tailored tools for students, job seekers, and forward-looking recruiters.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {[
            {
              icon: '🔍',
              title: 'AI Skill Gap Analysis',
              desc: 'Compare your resume and profile skills against live job descriptions or custom roles with instant match scores.',
              accent: '#3b82f6',
            },
            {
              icon: '🗺️',
              title: 'Personalized Roadmaps',
              desc: 'Get structured, step-by-step milestones to acquire missing competencies and track your learning progress.',
              accent: '#8b5cf6',
            },
            {
              icon: '💼',
              title: 'Verified Job Opportunities',
              desc: 'Browse curated full-time, part-time, internship, and remote roles posted directly by verified recruiters.',
              accent: '#10b981',
            },
            {
              icon: '📊',
              title: 'Transparent Application Tracking',
              desc: 'Follow your applications in real-time through Screening, Interview, and Selection with automated status updates.',
              accent: '#f59e0b',
            },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                padding: '1.75rem',
                borderRadius: '0.75rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderTop: `4px solid ${f.accent}`,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a' }}>
                {f.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        background: '#f8fafc',
        borderRadius: '1rem',
        padding: '3rem 2rem',
        marginBottom: '3rem',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.5rem' }}>
            How Skill2Career Works
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Three simple steps to level up your employability.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
        }}>
          {[
            {
              step: '1',
              title: 'Build Your Profile & Resume',
              desc: 'Upload your latest resume and specify your current technical skills, degree, and career interests.',
            },
            {
              step: '2',
              title: 'Run Gap Analysis & Roadmaps',
              desc: 'Identify what you lack for target roles and follow curated tasks to close the divide.',
            },
            {
              step: '3',
              title: 'Apply With Confidence',
              desc: 'Send targeted applications to verified recruiters with high match scores and direct feedback.',
            },
          ].map((s, i) => (
            <div key={i} style={{ padding: '1rem' }}>
              <div style={{
                width: '45px',
                height: '45px',
                background: '#1e3a8a',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}>
                {s.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role Calls to Action */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          padding: '2rem',
          borderRadius: '0.75rem',
          border: '1px solid #bfdbfe',
        }}>
          <h3 style={{ color: '#1e40af', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            🎓 For Students & Job Seekers
          </h3>
          <p style={{ color: '#1e3a8a', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Don't apply blindly. Learn exactly what hiring managers want, master high-demand tools, and submit standout applications.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-block',
              background: '#2563eb',
              color: '#fff',
              padding: '0.55rem 1.25rem',
              borderRadius: '0.375rem',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Create Student Account →
          </Link>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          padding: '2rem',
          borderRadius: '0.75rem',
          border: '1px solid #bbf7d0',
        }}>
          <h3 style={{ color: '#166534', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            🏢 For Recruiters & Companies
          </h3>
          <p style={{ color: '#14532d', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Publish job openings, evaluate qualified applicants with matched competencies, and manage the candidate pipeline efficiently.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-block',
              background: '#16a34a',
              color: '#fff',
              padding: '0.55rem 1.25rem',
              borderRadius: '0.375rem',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Join as Recruiter →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #e2e8f0',
        padding: '2rem 0',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.85rem',
      }}>
        <p style={{ margin: 0 }}>
          Skill2Career &copy; {new Date().getFullYear()} — Empowering students with AI-driven career pathing and talent discovery.
        </p>
      </footer>
    </div>
  );
};

export default Home;
