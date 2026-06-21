import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getMoods, getLatestMood } from '../services/api';

const moodEmoji = { happy: '😊', good: '🙂', neutral: '😐', sad: '😔', stressed: '😫' };
const moodColors = { happy: '#06d6a0', good: '#3b82f6', neutral: '#94a3b8', sad: '#f59e0b', stressed: '#ef4444' };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{label}</p>
        <p style={{ color: '#9f67ff', fontWeight: 700 }}>Stress: {payload[0]?.value}/10</p>
        <p style={{ color: '#06d6a0', fontWeight: 700 }}>Mood: {payload[1]?.value}/5</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [moods, setMoods] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moodsRes, latestRes] = await Promise.all([getMoods(), getLatestMood()]);
        setMoods(moodsRes.data);
        setLatest(latestRes.data);
      } catch (e) { /* no data yet */ }
      setLoading(false);
    };
    fetchData();
  }, []);

  const chartData = [...moods].reverse().slice(-7).map(m => ({
    date: new Date(m.date).toLocaleDateString('en', { weekday: 'short' }),
    stress: m.stressLevel,
    mood: m.moodScore,
  }));

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const wellnessScore = latest ? Math.round(((11 - latest.stressLevel) / 10) * 100) : 0;
  const streak = moods.length;

  const quickActions = [
    { icon: '😊', label: 'Track Mood', path: '/mood', color: '#7c3aed' },
    { icon: '🤖', label: 'AI Chatbot', path: '/chat', color: '#3b82f6' },
    { icon: '💡', label: 'Wellness Tips', path: '/wellness', color: '#06d6a0' },
    { icon: '🆘', label: 'Emergency', path: '/emergency', color: '#ef4444' },
    { icon: '📔', label: 'Journal', path: '/journal', color: '#f59e0b' },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Here's your wellness overview for today</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card purple">
          <div className="stat-label">Today's Mood</div>
          <div className="stat-value">{latest ? moodEmoji[latest.mood] : '—'}</div>
          <div className="stat-desc">{latest ? latest.mood.charAt(0).toUpperCase() + latest.mood.slice(1) : 'No entry yet'}</div>
        </div>
        <div className="glass-card stat-card green">
          <div className="stat-label">Stress Level</div>
          <div className="stat-value" style={{ color: latest?.stressLevel > 7 ? '#ef4444' : latest?.stressLevel > 4 ? '#f59e0b' : '#06d6a0' }}>
            {latest ? `${latest.stressLevel}/10` : '—'}
          </div>
          <div className="stat-desc">{latest?.stressLevel > 7 ? 'High – take a break' : latest?.stressLevel > 4 ? 'Moderate' : 'Low – great!'}</div>
        </div>
        <div className="glass-card stat-card blue">
          <div className="stat-label">Wellness Score</div>
          <div className="stat-value" style={{ color: '#3b82f6' }}>{latest ? `${wellnessScore}%` : '—'}</div>
          <div className="stat-desc">Based on latest mood</div>
        </div>
        <div className="glass-card stat-card orange">
          <div className="stat-label">Total Check-ins</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{streak}</div>
          <div className="stat-desc">Keep the streak going!</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1.1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {quickActions.map(a => (
            <button key={a.path} onClick={() => navigate(a.path)} className="glass-card"
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', border: `1px solid ${a.color}33` }}>
              <span style={{ fontSize: '1.4rem' }}>{a.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Chart */}
        <div className="glass-card chart-wrapper">
          <h2 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>📈 7-Day Trend</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="stress" stroke="#9f67ff" strokeWidth={2} dot={{ fill: '#9f67ff', r: 4 }} />
                <Line type="monotone" dataKey="mood" stroke="#06d6a0" strokeWidth={2} dot={{ fill: '#06d6a0', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: '2rem' }}>📊</span>
              <p>Track your mood to see trends here</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#9f67ff' }} /> Stress
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#06d6a0' }} /> Mood
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div>
          {latest?.aiInsight && (
            <div className="insight-card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '1.3rem' }}>🤖</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Wellness Insight</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', background: 'rgba(124,58,237,0.2)', padding: '2px 8px', borderRadius: 8 }}>Groq AI</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{latest.aiInsight}</p>
            </div>
          )}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>🌟 Daily Reminders</h3>
            {['💧 Drink 8 glasses of water today', '😴 Aim for 7-8 hours of sleep', '🧘 Take 5 minutes to breathe', '📚 Take breaks every 25 minutes'].map((tip, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{tip}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
