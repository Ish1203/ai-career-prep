import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const TOPICS = [
  'Data Structures & Algorithms', 'Operating Systems', 'Database Management (DBMS)',
  'Computer Networks', 'Object Oriented Programming', 'System Design',
  'Aptitude & Reasoning', 'Python Programming', 'JavaScript', 'SQL',
  'Machine Learning Basics', 'Web Development'
];

const COMPANIES = ['TCS','Infosys','Wipro','Cognizant','Accenture','Google','Microsoft','Amazon','Flipkart','Deloitte'];
const DIFFICULTIES = [{id:'easy',label:'Easy 🟢'},{id:'medium',label:'Medium 🟡'},{id:'hard',label:'Hard 🔴'}];

export default function ExamPrep() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [company, setCompany] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQ, setNumQ] = useState(5);
  const [customContent, setCustomContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [evaluated, setEvaluated] = useState({});
  const [evaluating, setEvaluating] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const onDrop = useCallback(async (files) => {
    setUploadLoading(true);
    const fd = new FormData();
    fd.append('file', files[0]);
    try {
      const res = await axios.post('https://ai-career-prep-backend.onrender.com/exam/upload-material', fd, { headers: {'Content-Type': 'multipart/form-data'} });
      setCustomContent(res.data.content);
    } catch { alert('Failed to upload file'); }
    setUploadLoading(false);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });

  const generateQuiz = async () => {
    setLoading(true); setQuestions([]); setAnswers({}); setEvaluated({}); setQuizDone(false);
    try {
      const res = await axios.post('https://ai-career-prep-backend.onrender.com/exam/generate', {
        topic, company: company || null, difficulty, num_questions: numQ,
        custom_content: customContent || null
      });
      setQuestions(res.data.questions);
    } catch (e) { alert('Failed to generate quiz. Check backend connection.'); }
    setLoading(false);
  };

  const selectAnswer = (qId, opt) => {
    if (evaluated[qId]) return;
    setAnswers(a => ({ ...a, [qId]: opt }));
  };

  const evaluateAnswer = async (q) => {
    if (!answers[q.id]) return;
    setEvaluating(e => ({ ...e, [q.id]: true }));
    try {
      const res = await axios.post('https://ai-career-prep-backend.onrender.com/exam/evaluate', {
        question: q.question,
        user_answer: answers[q.id],
        correct_answer: q.correct,
        topic
      });
      setEvaluated(e => ({ ...e, [q.id]: res.data }));
    } catch { setEvaluated(e => ({ ...e, [q.id]: { is_correct: answers[q.id][0] === q.correct, feedback: 'Could not get detailed feedback.', explanation: `Correct answer: ${q.correct}` } })); }
    setEvaluating(ev => ({ ...ev, [q.id]: false }));
  };

  const finishQuiz = () => setQuizDone(true);

  const score = quizDone ? Object.values(evaluated).filter(e => e.is_correct).length : 0;

  return (
    <div style={{ padding: '48px', maxWidth: 900, margin: '0 auto' }} className="fade-in">
      <div className="tag tag-red" style={{ marginBottom: 16 }}>📚 Exam Prep</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Exam Preparation</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 36, lineHeight: 1.6 }}>
        Generate quizzes for company exams, topics, or your own study material.
      </p>

      {/* Config */}
      <div className="card" style={{ marginBottom: 24, padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>TOPIC</label>
            <select value={topic} onChange={e => setTopic(e.target.value)}>
              {TOPICS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>COMPANY (Optional)</label>
            <select value={company} onChange={e => setCompany(e.target.value)}>
              <option value="">General / No Company</option>
              {COMPANIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>DIFFICULTY</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {DIFFICULTIES.map(d => (
                <button key={d.id} onClick={() => setDifficulty(d.id)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 8, border: '1px solid',
                    borderColor: difficulty === d.id ? 'var(--accent)' : 'var(--border)',
                    background: difficulty === d.id ? 'rgba(108,99,255,0.15)' : 'transparent',
                    color: difficulty === d.id ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600,
                    transition: 'var(--transition)',
                  }}>{d.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>NUMBER OF QUESTIONS: {numQ}</label>
            <input type="range" min={3} max={10} value={numQ} onChange={e => setNumQ(Number(e.target.value))}
              style={{ padding: 0, height: 4, cursor: 'pointer', accentColor: 'var(--accent)' }} />
          </div>
        </div>

        {/* Upload Study Material */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>UPLOAD STUDY MATERIAL (Optional PDF)</label>
          <div {...getRootProps()} style={{
            border: '1px dashed var(--border)', borderRadius: 10, padding: '16px 20px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg2)',
          }}>
            <input {...getInputProps()} />
            <span style={{ fontSize: 20 }}>{uploadLoading ? '⏳' : customContent ? '✅' : '📎'}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {uploadLoading ? 'Extracting text...' : customContent ? 'Material uploaded — quiz will use your content' : 'Drop a PDF or click to upload your notes'}
            </span>
            {customContent && <button onClick={(e) => { e.stopPropagation(); setCustomContent(''); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer', fontSize: 18 }}>×</button>}
          </div>
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 15, marginBottom: 36 }}
        onClick={generateQuiz} disabled={loading}>
        {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Generating Quiz...</> : '⚡ Generate Quiz'}
      </button>

      {/* Quiz Summary */}
      {quizDone && (
        <div className="card" style={{ padding: 28, marginBottom: 24, background: score >= numQ * 0.7 ? 'rgba(67,232,176,0.07)' : 'rgba(255,101,132,0.07)', border: `1px solid ${score >= numQ * 0.7 ? 'rgba(67,232,176,0.25)' : 'rgba(255,101,132,0.25)'}` }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>
            {score >= numQ * 0.7 ? '🎉 Great job!' : '📖 Keep practising!'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            You scored <strong style={{ color: 'var(--text)' }}>{score} / {Object.keys(evaluated).length}</strong> answered questions.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={generateQuiz}>Generate New Quiz</button>
        </div>
      )}

      {/* Questions */}
      {questions.map((q, idx) => (
        <div key={q.id} className="card" style={{ marginBottom: 16, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-dim)' }}>Q{idx + 1}</div>
            {evaluated[q.id] && (
              <div className={`tag ${evaluated[q.id].is_correct ? 'tag-green' : 'tag-red'}`}>
                {evaluated[q.id].is_correct ? '✅ Correct' : '❌ Wrong'}
              </div>
            )}
          </div>
          <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 20, lineHeight: 1.5 }}>{q.question}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {q.options.map(opt => {
              const letter = opt[0];
              const isSelected = answers[q.id] === opt;
              const ev = evaluated[q.id];
              const isCorrect = ev && letter === q.correct;
              const isWrong = ev && isSelected && !ev.is_correct;
              return (
                <div key={opt} onClick={() => selectAnswer(q.id, opt)}
                  style={{
                    padding: '12px 16px', borderRadius: 10, cursor: evaluated[q.id] ? 'default' : 'pointer',
                    border: `1px solid ${isCorrect ? 'var(--accent3)' : isWrong ? 'var(--accent2)' : isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    background: isCorrect ? 'rgba(67,232,176,0.1)' : isWrong ? 'rgba(255,101,132,0.1)' : isSelected ? 'rgba(108,99,255,0.12)' : 'var(--bg2)',
                    fontSize: 14, lineHeight: 1.4, transition: 'var(--transition)',
                    color: isCorrect ? 'var(--accent3)' : isWrong ? 'var(--accent2)' : isSelected ? 'var(--accent)' : 'var(--text-muted)',
                  }}>{opt}</div>
              );
            })}
          </div>

          {!evaluated[q.id] && answers[q.id] && (
            <button className="btn btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}
              onClick={() => evaluateAnswer(q)} disabled={evaluating[q.id]}>
              {evaluating[q.id] ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Checking...</> : '✓ Submit Answer'}
            </button>
          )}

          {evaluated[q.id] && (
            <div style={{ marginTop: 16, padding: 16, background: 'var(--bg3)', borderRadius: 10, fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{evaluated[q.id].feedback}</div>
              <div style={{ color: 'var(--text-dim)' }}>💡 {evaluated[q.id].explanation}</div>
              {evaluated[q.id].tip && <div style={{ marginTop: 8, color: 'var(--accent)', fontSize: 12 }}>📌 Study tip: {evaluated[q.id].tip}</div>}
            </div>
          )}
        </div>
      ))}

      {questions.length > 0 && !quizDone && (
        <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={finishQuiz}>
          🏁 Finish Quiz & See Score
        </button>
      )}
    </div>
  );
}
