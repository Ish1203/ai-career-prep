import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';

const ROLES = [
  'Software Development Engineer', 'Data Analyst', 'Data Scientist',
  'Product Manager', 'Frontend Developer', 'Backend Developer',
  'DevOps Engineer', 'Machine Learning Engineer', 'Full Stack Developer', 'Business Analyst'
];

function ScoreRing({ score, max = 10, color = 'var(--accent)', size = 100 }) {
  const pct = score / max;
  const r = 36, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={8} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize={18} fontWeight={800} fill={color} fontFamily="Syne">{score}</text>
      </svg>
    </div>
  );
}

function ATSBar({ score }) {
  const color = score >= 70 ? 'var(--accent3)' : score >= 50 ? 'var(--accent)' : 'var(--accent2)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>ATS Compatibility Score</span>
        <span style={{ color, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{score}/100</span>
      </div>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 4, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

export default function ResumeAnalyser() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState(ROLES[0]);
  const [jd, setJd] = useState('');
  const [mode, setMode] = useState('analyse'); // analyse | match
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback(files => { setFile(files[0]); setResult(null); setError(''); }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });

  const handleAnalyse = async () => {
    if (!file) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('target_role', role);
      const endpoint = mode === 'analyse' ? 'https://ai-career-prep-backend.onrender.com/resume/analyse' : 'https://ai-career-prep-backend.onrender.com/resume/match';
      if (mode === 'match') fd.append('job_description', jd);
      const res = await axios.post(endpoint, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to analyse resume. Make sure the backend is running.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '48px', maxWidth: 900, margin: '0 auto' }} className="fade-in">
      <div className="tag tag-green" style={{ marginBottom: 16 }}>📄 Resume Analyser</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Resume Analysis</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 36, lineHeight: 1.6 }}>
        Get ATS scores, keyword gaps, and bullet point rewrites tailored to your target role.
      </p>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'var(--bg2)', padding: 4, borderRadius: 10, border: '1px solid var(--border)', width: 'fit-content' }}>
        {[{id:'analyse',label:'📊 Full Analysis'},{id:'match',label:'🎯 JD Match'}].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            style={{
              padding: '8px 20px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: mode === m.id ? 'var(--accent)' : 'transparent',
              color: mode === m.id ? 'white' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13,
              transition: 'var(--transition)',
            }}>{m.label}</button>
        ))}
      </div>

      {/* Upload */}
      <div {...getRootProps()} style={{
        border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)', padding: 40, textAlign: 'center', cursor: 'pointer',
        background: isDragActive ? 'rgba(108,99,255,0.05)' : 'var(--card)',
        transition: 'var(--transition)', marginBottom: 24,
      }}>
        <input {...getInputProps()} />
        <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
        {file ? (
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)' }}>{file.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>Click to replace</div>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 6 }}>Drop your resume PDF here</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>or click to browse</div>
          </div>
        )}
      </div>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: mode === 'match' ? '1fr' : '1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Target Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        {mode === 'match' && (
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Paste Job Description</label>
            <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the full job description here..." rows={6} />
          </div>
        )}
      </div>

      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 15 }}
        onClick={handleAnalyse} disabled={!file || loading || (mode === 'match' && !jd.trim())}>
        {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Analysing...</> : '🔍 Analyse Resume'}
      </button>

      {error && <div style={{ marginTop: 20, padding: 16, background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', borderRadius: 10, color: 'var(--accent2)', fontSize: 14 }}>{error}</div>}

      {/* Results */}
      {result && (
        <div style={{ marginTop: 40 }} className="fade-in">
          {mode === 'analyse' ? <FullAnalysis result={result} /> : <JDMatch result={result} />}
        </div>
      )}
    </div>
  );
}

function FullAnalysis({ result }) {
  const readinessColor = { 'Ready': 'var(--accent3)', 'Almost Ready': 'var(--accent)', 'Needs Work': 'var(--accent2)' }[result.readiness] || 'var(--accent)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Scores */}
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Overall Assessment</h2>
          <div className="tag" style={{ background: `${readinessColor}22`, color: readinessColor, border: `1px solid ${readinessColor}44` }}>
            {result.readiness}
          </div>
        </div>
        <ATSBar score={result.ats_score} />
        <p style={{ marginTop: 20, color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{result.summary}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'center' }}>
          <ScoreRing score={result.overall_score} max={10} color="var(--accent)" size={80} />
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Overall Score</div>
      </div>

      {/* Strengths & Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--accent3)', marginBottom: 16 }}>✅ Strengths</h3>
          {result.strengths?.map((s, i) => <div key={i} style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 0', borderBottom: i < result.strengths.length - 1 ? '1px solid var(--border)' : 'none', lineHeight: 1.5 }}>• {s}</div>)}
        </div>
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--accent2)', marginBottom: 16 }}>⚠️ Weaknesses</h3>
          {result.weaknesses?.map((w, i) => <div key={i} style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 0', borderBottom: i < result.weaknesses.length - 1 ? '1px solid var(--border)' : 'none', lineHeight: 1.5 }}>• {w}</div>)}
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🔑 Missing Keywords</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {result.missing_keywords?.map(k => <span key={k} className="tag tag-red">{k}</span>)}
        </div>
      </div>

      {/* Bullet Rewrites */}
      {result.bullet_point_rewrites?.length > 0 && (
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>✏️ Bullet Point Rewrites</h3>
          {result.bullet_point_rewrites.map((b, i) => (
            <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < result.bullet_point_rewrites.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 13, color: 'var(--accent2)', marginBottom: 6 }}>❌ {b.original}</div>
              <div style={{ fontSize: 13, color: 'var(--accent3)' }}>✅ {b.improved}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div className="card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>💡 Top Recommendations</h3>
        {result.top_recommendations?.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < result.top_recommendations.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{r}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JDMatch({ result }) {
  const color = result.match_score >= 70 ? 'var(--accent3)' : result.match_score >= 50 ? 'var(--accent)' : 'var(--accent2)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <ScoreRing score={result.match_score} max={100} color={color} size={120} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginTop: 12, color }}>{result.verdict}</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>JD Match Score</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent3)', marginBottom: 12, fontSize: 14 }}>✅ Matched Keywords</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{result.matched_keywords?.map(k => <span key={k} className="tag tag-green">{k}</span>)}</div>
        </div>
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent2)', marginBottom: 12, fontSize: 14 }}>❌ Missing Keywords</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{result.missing_keywords?.map(k => <span key={k} className="tag tag-red">{k}</span>)}</div>
        </div>
      </div>
      <div className="card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>💡 How to Improve Your Match</h3>
        {result.tips?.map((t, i) => <div key={i} style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 0', borderBottom: i < result.tips.length - 1 ? '1px solid var(--border)' : 'none' }}>• {t}</div>)}
      </div>
    </div>
  );
}
