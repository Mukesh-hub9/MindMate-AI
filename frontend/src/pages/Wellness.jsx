import { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';

const resources = [
  { icon: '🧘', title: '5-Min Meditation', desc: 'Box breathing: Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat 5 times.', category: 'Meditation' },
  { icon: '😴', title: 'Sleep Hygiene Tips', desc: 'No screens 1hr before bed. Sleep at consistent times. Keep room cool and dark.', category: 'Sleep' },
  { icon: '⏱️', title: 'Pomodoro Technique', desc: 'Study 25 minutes → 5-minute break. After 4 rounds, take a 20-minute break.', category: 'Study' },
  { icon: '🏃', title: 'Quick Exercise', desc: '10 jumping jacks + 10 push-ups + 1-min plank. Repeat twice for an energy boost.', category: 'Exercise' },
  { icon: '📖', title: 'Mindful Journaling', desc: 'Write 3 things you\'re grateful for + 1 challenge you\'re working on each day.', category: 'Mindfulness' },
  { icon: '🎵', title: 'Music Therapy', desc: 'Classical music at 60-80 BPM reduces anxiety. Try lo-fi, binaural beats, or nature sounds.', category: 'Relaxation' },
];

export default function Wellness() {
  const [recommendations, setRecommendations] = useState([]);
  const [stressLevel, setStressLevel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendations().then(res => {
      setRecommendations(res.data.recommendations);
      setStressLevel(res.data.stressLevel);
    }).finally(() => setLoading(false));
  }, []);

  const priorityColor = { high: '#ef4444', medium: '#f59e0b', low: '#06d6a0' };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">💡 Wellness Hub</h1>
        <p className="page-subtitle">Personalized recommendations based on your mood & expert-curated resources</p>
      </div>

      {/* AI Recommendations */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>🤖 AI Recommendations</h2>
          {stressLevel && (
            <span style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: 12, background: stressLevel >= 8 ? 'rgba(239,68,68,0.15)' : stressLevel >= 5 ? 'rgba(245,158,11,0.15)' : 'rgba(6,214,160,0.15)', color: stressLevel >= 8 ? '#ef4444' : stressLevel >= 5 ? '#f59e0b' : '#06d6a0', fontWeight: 600 }}>
              Stress: {stressLevel}/10
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[1,2,3,4].map(i => <div key={i} className="glass-card" style={{ height: 100, opacity: 0.4 }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {recommendations.map((rec, i) => (
              <div key={i} className={`glass-card rec-card rec-priority-${rec.priority} animate-fadeInUp`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="rec-icon" style={{ background: `${priorityColor[rec.priority]}22` }}>
                  {rec.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{rec.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{rec.desc}</div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: 10, background: `${priorityColor[rec.priority]}22`, color: priorityColor[rec.priority], fontWeight: 600 }}>
                      {rec.priority === 'high' ? '🔴 High Priority' : rec.priority === 'medium' ? '🟡 Recommended' : '🟢 Helpful'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resource Library */}
      <div>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16 }}>📚 Wellness Resource Library</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {resources.map((r, i) => (
            <div key={i} className="glass-card" style={{ padding: 20, cursor: 'pointer' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{r.icon}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.category}</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{r.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
