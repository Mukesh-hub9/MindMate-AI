import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveMood } from '../services/api';

const moods = [
  { key: 'happy', emoji: '😊', label: 'Happy', color: '#06d6a0' },
  { key: 'good', emoji: '🙂', label: 'Good', color: '#3b82f6' },
  { key: 'neutral', emoji: '😐', label: 'Neutral', color: '#94a3b8' },
  { key: 'sad', emoji: '😔', label: 'Sad', color: '#f59e0b' },
  { key: 'stressed', emoji: '😫', label: 'Stressed', color: '#ef4444' },
];

const stressLabels = { 1: 'Very Low 😌', 2: 'Low', 3: 'Mild', 4: 'Moderate', 5: 'Noticeable', 6: 'High 😟', 7: 'Very High', 8: 'Intense 😰', 9: 'Severe', 10: 'Extreme 😱' };

export default function MoodTracker() {
  const [selected, setSelected] = useState('');
  const [stress, setStress] = useState(5);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!selected) return alert('Please select your mood first!');
    setLoading(true);
    try {
      const res = await saveMood({ mood: selected, stressLevel: stress, note });
      setResult(res.data);
    } catch (e) { alert('Error saving mood. Check your connection.'); }
    setLoading(false);
  };

  const stressColor = stress >= 8 ? '#ef4444' : stress >= 5 ? '#f59e0b' : '#06d6a0';

  if (result) {
    return (
      <div className="animate-fadeIn" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 8 }}>Mood Logged!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Here's your AI wellness insight:</p>
          <div className="insight-card" style={{ textAlign: 'left', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
              <span style={{ fontWeight: 700 }}>MindMate AI Insight</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.aiInsight}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/wellness')}>View Recommendations 💡</button>
            <button className="btn btn-ghost" onClick={() => { setResult(null); setSelected(''); setNote(''); setStress(5); }}>Log Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">😊 Mood Tracker</h1>
        <p className="page-subtitle">How are you feeling right now? Be honest — this is your safe space.</p>
      </div>

      <div className="glass-card" style={{ padding: 32 }}>
        <h2 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem', color: 'var(--text-secondary)' }}>SELECT YOUR MOOD</h2>
        <div className="mood-grid">
          {moods.map(m => (
            <div key={m.key} className={`mood-card ${selected === m.key ? 'selected' : ''}`}
              onClick={() => setSelected(m.key)}
              style={selected === m.key ? { borderColor: m.color, background: `${m.color}22` } : {}}>
              <span className="mood-emoji">{m.emoji}</span>
              <span className="mood-label">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="slider-container" style={{ marginTop: 28 }}>
          <div className="slider-label">
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>⚡ Stress Level</span>
            <span style={{ fontWeight: 800, color: stressColor, fontSize: '1.1rem' }}>{stress}/10 — {stressLabels[stress]}</span>
          </div>
          <input type="range" className="slider" min="1" max="10" value={stress}
            onChange={e => setStress(Number(e.target.value))}
            style={{ background: `linear-gradient(to right, ${stressColor} ${(stress - 1) * 11.1}%, rgba(255,255,255,0.1) 0%)` }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
            <span>😌 Very Low</span><span>😰 Extreme</span>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 24 }}>
          <label className="input-label">📝 Personal Note (optional)</label>
          <textarea className="input-field" rows={3} placeholder="What's on your mind? Share anything..." value={note}
            onChange={e => setNote(e.target.value)} style={{ resize: 'vertical' }} />
        </div>

        <button className="btn btn-primary btn-lg w-full" style={{ marginTop: 8 }} onClick={handleSave} disabled={loading}>
          {loading ? '🤖 AI is analyzing your mood...' : '💾 Save Mood & Get AI Insight'}
        </button>
      </div>
    </div>
  );
}
