import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
  { icon: '😊', label: 'Mood Tracker', path: '/mood' },
  { icon: '🤖', label: 'AI Chatbot', path: '/chat' },
  { icon: '💡', label: 'Wellness', path: '/wellness' },
  { icon: '📔', label: 'Journal', path: '/journal' },
  { icon: '🆘', label: 'Emergency', path: '/emergency' },
];

export default function Sidebar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logoutUser(); navigate('/'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo">
          <div className="logo-icon">🧠</div>
          <span className="text-gradient">MindMate</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 16 }}>
        <div style={{ padding: '12px 16px', marginBottom: 8 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 2 }}>Logged in as</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.college || 'Student'}</div>
        </div>
        <button className="sidebar-item w-full" onClick={handleLogout} style={{ color: '#f87171', width: '100%', background: 'none', border: 'none', textAlign: 'left' }}>
          <span className="icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
