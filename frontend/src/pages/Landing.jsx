import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '😊', title: 'Mood Tracking', desc: 'Daily check-ins with emoji mood selection, stress slider, and 7-day analytics to understand your emotional patterns.' },
  { icon: '🤖', title: 'AI Chatbot', desc: 'Powered by Groq AI, your 24/7 wellness companion for stress, anxiety, motivation, and academic guidance.' },
  { icon: '💡', title: 'Wellness Tips', desc: 'Personalized recommendations based on your mood — breathing exercises, meditation, study techniques, and more.' },
  { icon: '🆘', title: 'Emergency Support', desc: 'One-click SOS with instant access to college counselors, mental health helplines, and emergency contacts.' },
];

const stats = [
  { value: '10K+', label: 'Students Supported' },
  { value: '98%', label: 'Feel More Supported' },
  { value: '24/7', label: 'AI Availability' },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <div className="logo">
            <div className="logo-icon">🧠</div>
            <span className="text-gradient">MindMate</span>
          </div>
          <div className="nav-links">
            <button className="btn btn-ghost" onClick={() => navigate('/auth')}>Login</button>
            <button className="btn btn-primary" onClick={() => navigate('/auth?mode=register')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge animate-fadeInUp">
            ✨ AI-Powered Student Wellness Platform
          </div>
          <h1 className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Your Mental Wellness,<br />
            <span className="text-gradient">Our Priority</span>
          </h1>
          <p className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            MindMate helps students track stress, access AI-powered emotional support, 
            and get personalized wellness recommendations — all in one safe platform.
          </p>
          <div className="hero-btns animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/auth?mode=register')}>
              Start Your Journey 🚀
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/auth')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Everything You Need to <span className="text-gradient">Thrive</span></h2>
          <p className="section-subtitle">Built for students, by understanding what students face every day.</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="glass-card feature-card animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="feature-icon" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: `${i * 0.5}s` }}>{f.icon}</span>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="stats-row">
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="stat-big text-gradient">{s.value}</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,214,160,0.1))', borderRadius: 24, border: '1px solid rgba(124,58,237,0.3)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🧠</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Ready to prioritize your wellness?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Join thousands of students already using MindMate.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/auth?mode=register')}>
              Get Started Free ✨
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© 2024 MindMate · AI-Powered Student Mental Wellness Platform · Built with ❤️ for SDG 3 & 4</p>
        </div>
      </footer>
    </div>
  );
}
