import { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory, clearChat } from '../services/api';
import { useAuth } from '../context/AuthContext';

const quickPrompts = [
  "I'm stressed about exams 😰",
  "Help me focus on studies 📚",
  "I'm feeling anxious 😟",
  "Give me a motivation boost 💪",
  "I can't sleep well 😴",
  "Share a breathing exercise 🫁",
];

export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getChatHistory().then(res => {
      if (Array.isArray(res.data) && res.data.length > 0) setMessages(res.data);
      else setMessages([{ role: 'model', content: `Hi ${user?.name?.split(' ')[0]} 👋 I'm MindMate AI, your personal wellness companion. I'm here to support you through academic stress, anxiety, or any challenges you're facing. How are you feeling today?` }]);
    }).catch(() => {
      setMessages([{ role: 'model', content: `Hi ${user?.name?.split(' ')[0]} 👋 I'm MindMate AI! How can I support you today?` }]);
    });
  }, [user?.name]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setTyping(true);
    try {
      const res = await sendMessage({ message: msg });
      setMessages(prev => [...prev, { role: 'model', content: res.data.reply }]);
    } catch (error) {
      const message = error.response?.data?.message || 'I am having a connection issue. Please try again in a moment.';
      setMessages(prev => [...prev, { role: 'model', content: message }]);
    }
    setTyping(false);
  };

  const handleClear = async () => {
    await clearChat();
    setMessages([{ role: 'model', content: `Chat cleared! How can I help you today, ${user?.name?.split(' ')[0]}?` }]);
  };

  return (
    <div className="animate-fadeIn" style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>🤖 AI Chatbot</h1>
          <p className="page-subtitle">Your 24/7 mental wellness companion — powered by Groq AI</p>
        </div>
        <button className="btn btn-ghost" onClick={handleClear} style={{ fontSize: '0.85rem' }}>🗑 Clear Chat</button>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* AI Badge */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, background: 'var(--gradient)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🧠</div>
          <div>
            <div style={{ fontWeight: 700 }}>MindMate AI</div>
            <div style={{ fontSize: '0.78rem', color: '#06d6a0', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 7, height: 7, background: '#06d6a0', borderRadius: '50%', animation: 'pulse-sos 1.5s infinite' }} />
              Online · Powered by Groq
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'} animate-fadeInUp`}
              style={{ animationDelay: `${i * 0.05}s` }}>
              {msg.role === 'model' && <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)', marginBottom: 4, fontWeight: 600 }}>🤖 MindMate AI</div>}
              {typeof msg.content === 'string' ? msg.content : ''}
            </div>
          ))}
          {typing && (
            <div className="typing-indicator">
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Chips */}
        <div className="chips" style={{ borderTop: '1px solid var(--border)' }}>
          {quickPrompts.map((p, i) => (
            <button key={i} className="chip" onClick={() => handleSend(p)}>{p}</button>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <textarea className="chat-input" rows={1} placeholder="Share what's on your mind..." value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
          <button className="btn btn-primary" onClick={() => handleSend()} disabled={!input.trim() || typing}
            style={{ padding: '14px 20px', borderRadius: 12 }}>
            {typing ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}
