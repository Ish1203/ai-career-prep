import React from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🎤',
    title: 'Interview Coach',
    desc: 'Practice HR, Technical & Behavioural interviews with real-time AI feedback and performance scoring.',
    path: '/interview',
    color: 'var(--accent)',
    glow: 'rgba(108,99,255,0.2)',
  },
  {
    icon: '📄',
    title: 'Resume Analyser',
    desc: 'Upload your resume and get ATS scores, keyword gaps, bullet rewrites and role-specific feedback.',
    path: '/resume',
    color: 'var(--accent3)',
    glow: 'rgba(67,232,176,0.2)',
  },
  {
    icon: '📚',
    title: 'Exam Prep',
    desc: 'Generate quizzes for TCS, Infosys, Google and more — or upload your own study material.',
    path: '/exam',
    color: 'var(--accent2)',
    glow: 'rgba(255,101,132,0.2)',
  },
];

const STATS = [
  { value: '3', label: 'Powerful Modules' },
  { value: '10+', label: 'Companies Covered' },
  { value: 'AI', label: 'Powered by Claude' },
  { value: '∞', label: 'Practice Sessions' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '60px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 72 }} className="fade-in">
        <div className="tag tag-purple" style={{ marginBottom: 20 }}>
          ✨ AI-Powered Career Preparation
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1.05,
          marginBottom: 20,
          background: 'linear-gradient(135deg, var(--text) 0%, var(--accent) 60%, var(--accent2) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Land Your Dream Job<br />with AI by Your Side
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Practice interviews, analyse your resume, and ace company exams — all in one intelligent platform powered by Claude AI.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate('/interview')}>
            🎤 Start Mock Interview
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate('/resume')}>
            📄 Analyse My Resume
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 64 }}>
        {STATS.map(({ value, label }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {FEATURES.map(({ icon, title, desc, path, color, glow }) => (
          <div
            key={title}
            className="card"
            onClick={() => navigate(path)}
            style={{ cursor: 'pointer', padding: 32, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 120, height: 120, borderRadius: '50%',
              background: glow, filter: 'blur(30px)',
              pointerEvents: 'none',
            }} />
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: `${glow}`, border: `1px solid ${color}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, marginBottom: 20,
            }}>{icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 10, color }}>{title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65 }}>{desc}</p>
            <div style={{ marginTop: 24, fontSize: 13, color, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
              Get Started →
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 64, textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
        Built with React + FastAPI + Claude API · Open source on GitHub
      </div>
    </div>
  );
}
