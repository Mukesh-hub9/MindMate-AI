import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import Chatbot from './pages/Chatbot';
import Wellness from './pages/Wellness';
import Emergency from './pages/Emergency';
import Journal from './pages/Journal';
import Sidebar from './components/Sidebar';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontSize:'2rem'}}>🧠</div>;
  return user ? children : <Navigate to="/auth" />;
};

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">{children}</main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/mood" element={<PrivateRoute><AppLayout><MoodTracker /></AppLayout></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><AppLayout><Chatbot /></AppLayout></PrivateRoute>} />
          <Route path="/wellness" element={<PrivateRoute><AppLayout><Wellness /></AppLayout></PrivateRoute>} />
          <Route path="/emergency" element={<PrivateRoute><AppLayout><Emergency /></AppLayout></PrivateRoute>} />
          <Route path="/journal" element={<PrivateRoute><AppLayout><Journal /></AppLayout></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
