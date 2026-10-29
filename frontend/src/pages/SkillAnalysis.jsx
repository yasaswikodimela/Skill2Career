// frontend/src/pages/SkillAnalysis.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../api/api';

const DEMO_ANALYSIS_RESULT = {
  matchScore: 68,
  matchedSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'REST API'],
  missingSkills: ['Node.js', 'Docker', 'PostgreSQL', 'GraphQL'],
  explanation: `Based on your profile, you possess strong foundations in modern client-side engineering (JavaScript, React, RESTful patterns). 

To achieve full alignment with this target role, you should prioritize server-side execution with Node.js and containerization fundamentals with Docker. 

We recommend checking out our curated Learning Milestones to complete step-by-step projects bridging these gaps.`,
  assessmentId: 'demo-assess-1',
};

const SkillAnalysis = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [customDesc, setCustomDesc] = useState('');
  const [customSkillsInput, setCustomSkillsInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');

  // Fetch jobs for dropdown selection
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        const list = Array.isArray(data) ? data : data.jobs || [];
        setJobs(list);
      } catch (err) {
        console.warn('Jobs fetch error for analysis selector, providing demo options');
        setJobs([
          { _id: 'dj1', title: 'Full Stack React & Node Developer (Remote)' },
          { _id: 'dj2', title: 'Junior Frontend Engineer (San Francisco)' },
          { _id: 'dj3', title: 'Software Engineering Intern (New York)' },
        ]);
      }
    };
    fetchJobs();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedJobId && !customDesc.trim() && !customSkillsInput.trim()) {
      setError('Please choose a job from the list or paste a custom role description/skills.');
      return;
    }

    setLoading(true);
    setError('');
    setIsDemo(false);

    try {
      const payload = selectedJobId
        ? { jobId: selectedJobId }
        : {
            customDescription: customDesc.trim(),
            customSkills: customSkillsInput
              ? customSkillsInput.split(',').map((s) => s.trim()).filter(Boolean)
              : undefined,
          };

      const { data } = await api.post('/skills/analyze', payload);
      setResult(data);
    } catch (err) {
      console.warn('Backend analysis failed, displaying demo analysis:', err.message);
      setIsDemo(true);
      setResult(DEMO_ANALYSIS_RESULT);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a'; // green
    if (score >= 50) return '#2563eb'; // blue
    if (score >= 30) return '#d97706'; // amber
    return '#dc2626'; // red
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', maxWidth: '850px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
          🎯 AI Skill-Gap Analysis
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Evaluate your current competencies against job requirements and identify areas to upskill.
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
          ℹ️ <strong>Demo Preview:</strong> Backend or Gemini service is unavailable. Displaying sample analysis results.
        </div>
      )}

      {/* Analysis Form Card */}
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '1.75rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '2rem',
      }}>
        <form onSubmit={handleAnalyze}>
          {/* Job Selection */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
              Option A: Select an Existing Job Listing
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                if (e.target.value) {
                  setCustomDesc('');
                  setCustomSkillsInput('');
                }
              }}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                fontSize: '0.9rem',
                background: '#fff',
                boxSizing: 'border-box',
              }}
            >
              <option value="">-- Choose from available job openings --</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} ({job.location || 'Remote'})
                </option>
              ))}
            </select>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.25rem 0',
            color: '#94a3b8',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <div style={{ flex: 1, borderTop: '1px solid #e2e8f0' }}></div>
            <span style={{ padding: '0 0.75rem', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, borderTop: '1px solid #e2e8f0' }}></div>
          </div>

          {/* Custom Description & Skills */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
              Option B: Paste a Custom Job Description
            </label>
            <textarea
              rows={4}
              value={customDesc}
              disabled={!!selectedJobId}
              onChange={(e) => setCustomDesc(e.target.value)}
              placeholder="e.g. We are looking for a Senior React Engineer with experience in TypeScript, Next.js, Redux, Node.js, GraphQL, and AWS cloud deployment..."
              style={{
                width: '100%',
                padding: '0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                fontSize: '0.88rem',
                boxSizing: 'border-box',
                background: selectedJobId ? '#f8fafc' : '#fff',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
              Specific Required Skills (Optional comma-separated override)
            </label>
            <input
              type="text"
              value={customSkillsInput}
              disabled={!!selectedJobId}
              onChange={(e) => setCustomSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, Docker, AWS"
              style={{
                width: '100%',
                padding: '0.55rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                fontSize: '0.88rem',
                boxSizing: 'border-box',
                background: selectedJobId ? '#f8fafc' : '#fff',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.65rem 0.9rem',
              borderRadius: '0.375rem',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '0.7rem 1.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {loading ? 'Evaluating Competencies...' : '⚡ Analyze Skill Gap'}
          </button>
        </form>
      </div>

      {/* Analysis Result Card */}
      {result && (
        <div style={{
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '2rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              Skill-Gap Assessment Results
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: getScoreColor(result.matchScore || 0),
                lineHeight: 1,
              }}>
                {result.matchScore || 0}%
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                  Overall Competency Match
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Based on skills registered in your Student Profile
                </div>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div style={{ background: '#e2e8f0', borderRadius: '9999px', height: '10px', overflow: 'hidden', marginTop: '1rem' }}>
              <div style={{
                background: getScoreColor(result.matchScore || 0),
                width: `${result.matchScore || 0}%`,
                height: '100%',
                transition: 'width 0.5s ease',
              }}></div>
            </div>
          </div>

          {/* Matched vs Missing Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
            {/* Matched Skills */}
            <div style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ✓ Matched Skills ({result.matchedSkills?.length || 0})
              </h3>
              {(!result.matchedSkills || result.matchedSkills.length === 0) ? (
                <p style={{ color: '#15803d', fontSize: '0.85rem', margin: 0 }}>No overlapping skills found in profile.</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {result.matchedSkills.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills */}
            <div style={{ background: '#fef2f2', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991b1b', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ⚠ Missing Skills ({result.missingSkills?.length || 0})
              </h3>
              {(!result.missingSkills || result.missingSkills.length === 0) ? (
                <p style={{ color: '#15803d', fontSize: '0.85rem', margin: 0 }}>🎉 No missing skills! You meet all listed requirements.</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {result.missingSkills.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gemini / AI Explanation */}
          {result.explanation && (
            <div style={{
              background: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', margin: '0 0 0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🤖 AI Career Advisor Insights
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                {result.explanation}
              </div>
            </div>
          )}

          {/* Action Links */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to="/student/roadmap"
              style={{
                background: '#2563eb',
                color: '#fff',
                padding: '0.65rem 1.25rem',
                borderRadius: '0.375rem',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              View Learning Roadmap →
            </Link>
            <Link
              to="/student/profile"
              style={{
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '0.65rem 1.25rem',
                borderRadius: '0.375rem',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Update Skills in Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillAnalysis;
