import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [params] = useSearchParams();
  const [isRegister, setIsRegister] = useState(params.get('mode') === 'register');
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = isRegister ? await register(form) : await login(form);
      loginUser(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card animate-fadeInUp">
        <div className="auth-header">
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🧠</div>
          <div className="logo" style={{ justifyContent: 'center', marginBottom: 8 }}>
            <span className="text-gradient" style={{ fontSize: '1.6rem', fontWeight: 800 }}>MindMate</span>
          </div>
          <h1 className="auth-title">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="auth-subtitle">{isRegister ? 'Start your wellness journey today' : 'Sign in to continue your journey'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <input className="input-field" type="text" placeholder="Enter your name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
          )}
          <div className="form-group">
            <label className="input-label">Email Address</label>
            <input className="input-field" type="email" placeholder="your@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="input-label">Password</label>
            <input className="input-field" type="password" placeholder="Enter password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          {isRegister && (
            <div className="form-group">
              <label className="input-label">College / University</label>
              <input className="input-field" type="text" placeholder="Your college name" value={form.college}
                onChange={e => setForm({ ...form, college: e.target.value })} />
            </div>
          )}
          {error && <div className="error-msg">⚠️ {error}</div>}
          <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading} style={{ marginTop: 20 }}>
            {loading ? '⏳ Please wait...' : isRegister ? '🚀 Create Account' : '🔐 Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <a onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Sign In' : 'Register'}
          </a>
        </p>
      </div>
    </div>
  );
}
