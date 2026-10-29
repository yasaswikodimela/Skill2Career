// frontend/src/pages/Roadmap.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const DEMO_ROADMAP = {
  _id: 'demo-rd1',
  title: 'Full Stack Web Developer Roadmap',
  tasks: [
    {
      _id: 't1',
      skill: 'TypeScript Essentials',
      description: 'Master strict typing, generics, interfaces, and migration of React components from JS to TS.',
      status: 'Completed',
    },
    {
      _id: 't2',
      skill: 'Backend Microservices with Node.js & Express',
      description: 'Build authenticated REST APIs with JWT, express-validator, rate limiting, and automated testing with Jest.',
      status: 'In Progress',
    },
    {
      _id: 't3',
      skill: 'Database Design & Indexing with MongoDB & PostgreSQL',
      description: 'Design relational & document schemas, optimize compound indexes, and handle ACID transactions.',
      status: 'In Progress',
    },
    {
      _id: 't4',
      skill: 'Docker & Containerization Fundamentals',
      description: 'Create multi-stage Dockerfiles for frontend and backend, manage local dev stacks with Docker Compose.',
      status: 'Not Started',
    },
    {
      _id: 't5',
      skill: 'CI/CD Pipelines & Cloud Deployment',
      description: 'Set up GitHub Actions to run linters, build artifacts, and deploy container images to Render / AWS.',
      status: 'Not Started',
    },
  ],
};

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      setIsDemo(false);
      try {
        const { data } = await api.get('/roadmap/latest');
        if (data && data.tasks) {
          setRoadmap(data);
        } else {
          setRoadmap(DEMO_ROADMAP);
          setIsDemo(true);
        }
      } catch (err) {
        console.warn('Backend unavailable or no roadmap created, showing demo roadmap:', err.message);
        setIsDemo(true);
        setRoadmap(DEMO_ROADMAP);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    if (!roadmap) return;

    if (isDemo) {
      // Update in local demo state
      setRoadmap((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
      }));
      return;
    }

    setUpdatingTaskId(taskId);
    try {
      const { data } = await api.patch(`/roadmap/${roadmap._id}/tasks/${taskId}`, {
        status: newStatus,
      });
      setRoadmap(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const calculateProgress = () => {
    if (!roadmap?.tasks || roadmap.tasks.length === 0) return 0;
    const completed = roadmap.tasks.filter((t) => t.status === 'Completed').length;
    return Math.round((completed / roadmap.tasks.length) * 100);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem' }}>Loading learning roadmap milestones...</p>
      </div>
    );
  }

  const progress = calculateProgress();
  const completedCount = roadmap?.tasks?.filter((t) => t.status === 'Completed').length || 0;
  const inProgressCount = roadmap?.tasks?.filter((t) => t.status === 'In Progress').length || 0;

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b', maxWidth: '850px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
            Personalized Learning Roadmap
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Structured milestones designed to close your skill gaps and prepare you for target roles.
          </p>
        </div>
        <Link to="/student/dashboard" style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.88rem' }}>
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
          ℹ️ <strong>Demo Preview:</strong> Backend is offline. Displaying sample curriculum roadmap. Status changes update locally for preview.
        </div>
      )}

      {/* Progress Overview Card */}
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '1.75rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {roadmap?.title || 'Target Role Roadmap'}
            </h2>
            <div style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.25rem' }}>
              {completedCount} of {roadmap?.tasks?.length || 0} milestones completed ({inProgressCount} in progress)
            </div>
          </div>

          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: progress === 100 ? '#16a34a' : '#2563eb' }}>
            {progress}%
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ background: '#e2e8f0', borderRadius: '9999px', height: '10px', overflow: 'hidden' }}>
          <div style={{
            background: progress === 100 ? '#16a34a' : '#2563eb',
            width: `${progress}%`,
            height: '100%',
            transition: 'width 0.4s ease',
          }}></div>
        </div>
      </div>

      {/* Tasks / Milestones List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {roadmap?.tasks?.map((task, idx) => {
          const isDone = task.status === 'Completed';
          const isInProgress = task.status === 'In Progress';

          return (
            <div
              key={task._id}
              style={{
                background: '#fff',
                borderRadius: '0.75rem',
                padding: '1.25rem 1.5rem',
                border: isDone ? '1px solid #bbf7d0' : isInProgress ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                borderLeft: isDone ? '5px solid #16a34a' : isInProgress ? '5px solid #2563eb' : '5px solid #94a3b8',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isDone ? '#dcfce7' : isInProgress ? '#dbeafe' : '#f1f5f9',
                    color: isDone ? '#15803d' : isInProgress ? '#1d4ed8' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}>
                    {isDone ? '✓' : idx + 1}
                  </span>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    margin: 0,
                    color: isDone ? '#166534' : '#0f172a',
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}>
                    {task.skill}
                  </h3>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0.25rem 0 0', lineHeight: 1.5, paddingLeft: '2rem' }}>
                  {task.description}
                </p>
              </div>

              {/* Status Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  value={task.status}
                  disabled={updatingTaskId === task._id}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  style={{
                    padding: '0.4rem 0.65rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid #cbd5e1',
                    background: isDone ? '#f0fdf4' : isInProgress ? '#eff6ff' : '#f8fafc',
                    color: isDone ? '#166534' : isInProgress ? '#1e40af' : '#475569',
                  }}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed ✓</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <Link
          to="/student/analysis"
          style={{
            display: 'inline-block',
            background: '#f1f5f9',
            color: '#1e3a8a',
            border: '1px solid #cbd5e1',
            padding: '0.65rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          ⚡ Run Another Gap Analysis
        </Link>
      </div>
    </div>
  );
};

export default Roadmap;
