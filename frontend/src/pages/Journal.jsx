import { useState, useEffect } from 'react';
import { createJournal, getJournals, deleteJournal } from '../services/api';

const sentimentStyles = {
  positive: 'sentiment-badge sentiment-positive',
  negative: 'sentiment-badge sentiment-negative',
  neutral: 'sentiment-badge sentiment-neutral',
};

export default function Journal() {
  const [journals, setJournals] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); // list | write
  const [result, setResult] = useState(null);

  useEffect(() => { fetchJournals(); }, []);
  const fetchJournals = () => getJournals().then(r => setJournals(r.data)).catch(() => {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    setLoading(true);
    try {
      const res = await createJournal(form);
      setResult(res.data.sentimentData);
      setForm({ title: '', content: '' });
      fetchJournals();
    } catch { alert('Error saving journal.'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteJournal(id);
    setJournals(prev => prev.filter(j => j._id !== id));
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">📔 Daily Journal</h1>
          <p className="page-subtitle">Write your thoughts — AI analyzes your emotional patterns</p>
        </div>
        <button className={`btn ${view === 'write' ? 'btn-ghost' : 'btn-primary'}`}
          onClick={() => { setView(view === 'write' ? 'list' : 'write'); setResult(null); }}>
          {view === 'write' ? '📋 View Entries' : '✍️ Write Entry'}
        </button>
      </div>

      {view === 'write' ? (
        <div style={{ maxWidth: 680 }}>
          {result ? (
            <div className="glass-card animate-fadeInUp" style={{ padding: 32 }}>
              <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: 12 }}>✨</div>
              <h3 style={{ fontWeight: 700, textAlign: 'center', marginBottom: 16 }}>AI Sentiment Analysis</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Primary Emotion</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', textTransform: 'capitalize' }}>{result.primaryEmotion}</div>
                </div>
                <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Overall Tone</div>
                  <span className={sentimentStyles[result.score] || sentimentStyles.neutral} style={{ fontSize: '0.9rem' }}>
                    {result.score === 'positive' ? '😊 Positive' : result.score === 'negative' ? '😔 Needs Care' : '😐 Neutral'}
                  </span>
                </div>
              </div>
              <div className="insight-card" style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem' }}>🤖 AI Summary</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{result.sentiment}</p>
              </div>
              <div style={{ background: 'rgba(6,214,160,0.1)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 6, fontSize: '0.9rem', color: 'var(--accent)' }}>💡 Suggestion</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{result.suggestion}</p>
              </div>
              <button className="btn btn-ghost w-full" style={{ marginTop: 20 }} onClick={() => setResult(null)}>✍️ Write Another Entry</button>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 32 }}>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="input-label">Journal Title</label>
                  <input className="input-field" placeholder="What's today's entry about?" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="input-label">Your Thoughts</label>
                  <textarea className="input-field" rows={10} placeholder="Write freely... Your journal is private and safe. Share your thoughts, worries, achievements, or anything on your mind."
                    value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required
                    style={{ resize: 'vertical', lineHeight: 1.7 }} />
                  <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{form.content.length} characters</div>
                </div>
                <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
                  {loading ? '🤖 AI analyzing your entry...' : '💾 Save & Analyze Entry'}
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div>
          {journals.length === 0 ? (
            <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📔</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No journal entries yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Start writing your first entry to see AI emotional insights.</p>
              <button className="btn btn-primary" onClick={() => setView('write')}>✍️ Write First Entry</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {journals.map((j, i) => (
                <div key={j._id} className="glass-card journal-entry animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{j.title}</h3>
                        <span className={sentimentStyles[j.sentimentScore] || sentimentStyles.neutral}>
                          {j.sentimentScore === 'positive' ? '😊 Positive' : j.sentimentScore === 'negative' ? '😔 Needs Care' : '😐 Neutral'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 8 }}>{j.content.substring(0, 150)}{j.content.length > 150 ? '...' : ''}</p>
                      {j.sentiment && <p style={{ fontSize: '0.82rem', color: 'var(--primary-light)', fontStyle: 'italic' }}>🤖 {j.sentiment}</p>}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        {new Date(j.createdAt).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(j._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, marginLeft: 12, fontSize: '1rem' }}
                      title="Delete entry">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
