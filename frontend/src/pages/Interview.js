import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API = 'https://ai-career-prep-backend.onrender.com/interview';

const ROLES = [
  'Software Development Engineer (SDE)', 'Data Analyst', 'Data Scientist',
  'Product Manager', 'Frontend Developer', 'Backend Developer',
  'DevOps Engineer', 'Business Analyst', 'Machine Learning Engineer', 'Full Stack Developer'
];

const TYPES = [
  { id: 'technical', label: 'Technical', icon: '💻', desc: 'DSA, system design, coding concepts' },
  { id: 'hr', label: 'HR Round', icon: '🤝', desc: 'Culture fit, salary, motivation' },
  { id: 'behavioural', label: 'Behavioural', icon: '🧠', desc: 'STAR method, past experiences' },
];

export default function Interview() {
  const [step, setStep] = useState('setup'); // setup | chat | summary
  const [role, setRole] = useState(ROLES[0]);
  const [type, setType] = useState('technical');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const startInterview = async () => {
    setStep('chat');
    setMessages([]);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat`, { role, interview_type: type, messages: [], question_count: 0 });
      setMessages([{ role: 'assistant', content: res.data.response }]);
      setQuestionCount(1);
    } catch (e) {
      setMessages([{ role: 'assistant', content: '⚠️ Could not connect to backend. Make sure the server is running.' }]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat`, {
        role, interview_type: type, messages: updatedMsgs, question_count: questionCount
      });
      setMessages([...updatedMsgs, { role: 'assistant', content: res.data.response }]);
      setQuestionCount(q => q + 1);
    } catch (e) {
      setMessages([...updatedMsgs, { role: 'assistant', content: '⚠️ Error fetching response.' }]);
    }
    setLoading(false);
  };

  const endInterview = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/summary`, { role, interview_type: type, messages });
      setSummary(res.data.summary);
      setStep('summary');
    } catch (e) {
      setSummary('Could not generate summary. Please try again.');
      setStep('summary');
    }
    setLoading(false);
  };

  const reset = () => { setStep('setup'); setMessages([]); setSummary(''); setQuestionCount(0); };

  if (step === 'setup') return (
    <div style={{ padding: '48px', maxWidth: 700, margin: '0 auto' }} className="fade-in">
      <div className="tag tag-purple" style={{ marginBottom: 16 }}>🎤 Interview Coach</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Mock Interview</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 40, lineHeight: 1.6 }}>
        Practice with an AI interviewer and get detailed feedback on every answer.
      </p>

      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginBottom: 10, color: 'var(--text-muted)' }}>
          Target Role
        </label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 36 }}>
        <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginBottom: 10, color: 'var(--text-muted)' }}>
          Interview Type
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {TYPES.map(({ id, label, icon, desc }) => (
            <div
              key={id}
              onClick={() => setType(id)}
              className="card"
              style={{
                cursor: 'pointer', padding: 20, textAlign: 'center',
                border: type === id ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: type === id ? 'rgba(108,99,255,0.1)' : 'var(--card)',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4, color: type === id ? 'var(--accent)' : 'var(--text)' }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 16 }} onClick={startInterview}>
        🚀 Start Interview
      </button>
    </div>
  );

  if (step === 'summary') return (
    <div style={{ padding: '48px', maxWidth: 800, margin: '0 auto' }} className="fade-in">
      <div className="tag tag-green" style={{ marginBottom: 16 }}>✅ Interview Complete</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Performance Report</h1>
      <div className="card" style={{ padding: 32, marginBottom: 24 }}>
        <div className="prose">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-primary" onClick={startInterview}>🔄 Practice Again</button>
        <button className="btn btn-ghost" onClick={reset}>← Change Settings</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: 13 }} onClick={reset}>←</button>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{role}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {TYPES.find(t => t.id === type)?.icon} {TYPES.find(t => t.id === type)?.label} · Q{questionCount}
            </div>
          </div>
        </div>
        <button className="btn btn-danger" style={{ fontSize: 13 }} onClick={endInterview} disabled={loading || messages.length < 2}>
          End & Get Report
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'fadeInUp 0.3s ease',
          }}>
            <div style={{
              maxWidth: '75%', padding: '16px 20px', borderRadius: 16,
              background: m.role === 'user' ? 'var(--accent)' : 'var(--bg3)',
              border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              fontSize: 14, lineHeight: 1.65,
              borderBottomRightRadius: m.role === 'user' ? 4 : 16,
              borderBottomLeftRadius: m.role === 'assistant' ? 4 : 16,
            }}>
              {m.role === 'assistant' ? (
                <div className="prose" style={{ color: 'var(--text)' }}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '16px 20px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, borderBottomLeftRadius: 4 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: `pulse 1.2s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div style={{ display: 'flex', gap: 12, maxWidth: 900, margin: '0 auto' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
            rows={2}
            style={{ flex: 1, resize: 'none', borderRadius: 12 }}
          />
          <button
            className="btn btn-primary"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ alignSelf: 'flex-end', padding: '14px 20px' }}
          >
            {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '→'}
          </button>
        </div>
      </div>
    </div>
  );
}
