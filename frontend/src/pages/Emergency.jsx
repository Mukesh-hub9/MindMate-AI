import { useState } from 'react';

const emergencyContacts = [
  { icon: '🏫', label: 'College Counselor', name: 'Student Wellness Center', phone: '1800-XXX-XXXX', color: '#7c3aed', desc: 'Free counseling for all enrolled students' },
  { icon: '👨‍🏫', label: 'Faculty Mentor', name: 'Academic Support Office', phone: '1800-XXX-XXXX', color: '#3b82f6', desc: 'Academic stress and guidance support' },
  { icon: '☎️', label: 'iCall Helpline', name: 'TISS iCall', phone: '9152987821', color: '#06d6a0', desc: 'Free psychological counseling service' },
  { icon: '🫂', label: 'Vandrevala Foundation', name: '24/7 Mental Health Helpline', phone: '1860-2662-345', color: '#f59e0b', desc: 'Round-the-clock crisis support' },
  { icon: '🏥', label: 'NIMHANS', name: 'National Mental Health Helpline', phone: '080-46110007', color: '#ec4899', desc: 'Government mental health support' },
  { icon: '📱', label: 'Snehi Helpline', name: 'Emotional Support', phone: '044-24640050', color: '#8b5cf6', desc: 'Emotional wellness and crisis support' },
];

export default function Emergency() {
  const [sosActivated, setSosActivated] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customAdded, setCustomAdded] = useState(false);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">🆘 Emergency Support</h1>
        <p className="page-subtitle">You are never alone. Help is always available — reach out immediately.</p>
      </div>

      {/* SOS Section */}
      <div className="glass-card" style={{ padding: 40, textAlign: 'center', marginBottom: 28, background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.05))', borderColor: 'rgba(239,68,68,0.2)' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '1rem' }}>
          In a crisis? Press the SOS button for immediate help
        </p>
        <button className="sos-btn" onClick={() => setSosActivated(!sosActivated)}>
          <span style={{ fontSize: '2rem' }}>🆘</span>
          <span style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '0.1em' }}>SOS</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>PRESS FOR HELP</span>
        </button>
        {sosActivated && (
          <div className="animate-fadeInUp" style={{ marginTop: 28, padding: 20, background: 'rgba(239,68,68,0.1)', borderRadius: 16, border: '1px solid rgba(239,68,68,0.3)' }}>
            <p style={{ fontWeight: 700, color: '#f87171', fontSize: '1rem', marginBottom: 8 }}>🚨 Crisis Mode Activated</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>Please contact one of the helplines below immediately or ask someone nearby for help.</p>
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>📞 Call iCall Now: <a href="tel:9152987821" style={{ color: '#06d6a0' }}>9152987821</a></p>
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16 }}>📞 Emergency Contacts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
          {emergencyContacts.map((c, i) => (
            <a key={i} href={`tel:${c.phone}`} className="glass-card contact-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className="contact-icon" style={{ background: `${c.color}22`, border: `1px solid ${c.color}44` }}>
                {c.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{c.name}</div>
                <div style={{ color: c.color, fontWeight: 700, fontSize: '1rem' }}>{c.phone}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{c.desc}</div>
              </div>
              <div style={{ color: c.color, fontSize: '1.4rem' }}>📞</div>
            </a>
          ))}
        </div>
      </div>

      {/* Add Personal Contact */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>👤 Add Personal Emergency Contact</h2>
        {customAdded ? (
          <div style={{ color: '#06d6a0', fontWeight: 600 }}>✅ Contact saved: {customName} — {customPhone}</div>
        ) : (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input className="input-field" placeholder="Parent / Guardian name" value={customName} onChange={e => setCustomName(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
            <input className="input-field" placeholder="Phone number" value={customPhone} onChange={e => setCustomPhone(e.target.value)} style={{ flex: 1, minWidth: 160 }} />
            <button className="btn btn-primary" onClick={() => { if(customName && customPhone) setCustomAdded(true); }}>Save Contact</button>
          </div>
        )}
      </div>

      {/* Reminder */}
      <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(6,214,160,0.08)', borderRadius: 12, border: '1px solid rgba(6,214,160,0.2)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.3rem' }}>💙</span>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>You matter. Your mental health matters.</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Seeking help is a sign of strength, not weakness. Don't hesitate to reach out — support is always available.</div>
        </div>
      </div>
    </div>
  );
}
