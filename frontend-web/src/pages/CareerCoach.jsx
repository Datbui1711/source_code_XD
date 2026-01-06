import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CareerCoach() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Career Coach. I\'m here to help you with career guidance, job search strategies, skill development, and interview preparation. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8091/api/ai/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(-6).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const suggestions = [
    'How can I improve my resume?',
    'What skills should I learn for a tech career?',
    'Tips for job interviews',
    'How to negotiate salary?',
    'Career change advice',
    'Building a professional network'
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>
            CareerMate
          </h1>
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Jobs</a>
            <a href="/coach" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Career Coach</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Logout
            </button>
          </div>
          <button className="nav-mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ flexDirection: 'column', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9' }}></div>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="nav-mobile" style={{ flexDirection: 'column', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Jobs</a>
            <a href="/coach" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#f0f9ff', borderRadius: '6px' }}>Career Coach</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Logout</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            AI Career Coach 🤖
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Get personalized career guidance powered by AI
          </p>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem', overflowY: 'auto', maxHeight: '500px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: msg.role === 'user' ? 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '0.9rem', flexShrink: 0 }}>
                {msg.role === 'user' ? 'You' : 'AI'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  {msg.role === 'user' ? 'You' : 'Career Coach'}
                </div>
                <div style={{ color: '#475569', lineHeight: '1.7', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>
                AI
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  Career Coach
                </div>
                <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: '500' }}>
              Try asking:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(suggestion)}
                  style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e) => (e.target.style.borderColor = '#0ea5e9', e.target.style.color = '#0ea5e9')}
                  onMouseOut={(e) => (e.target.style.borderColor = '#e2e8f0', e.target.style.color = '#64748b')}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your career..."
            disabled={loading}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#0f172a' }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{ padding: '0.75rem 1.5rem', background: loading || !input.trim() ? '#cbd5e1' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.2s' }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          h2 { font-size: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}

export default CareerCoach;
