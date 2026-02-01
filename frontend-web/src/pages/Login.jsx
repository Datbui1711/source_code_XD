import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      });

      const { accessToken, refreshToken, role } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userRole', role || 'CANDIDATE');

      onLogin(accessToken);

      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'RECRUITER') navigate('/recruiter/dashboard');
      else navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRedirect = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/oauth2/google/url');
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error(error);
      setError('Failed to initialize Google login. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>

      {/* Left */}
      <div
        className="hide-mobile"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem',
          color: 'white'
        }}
      >
        <div style={{ maxWidth: 500 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            CareerMate
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.95 }}>
            Your intelligent career companion. Connect with opportunities and grow faster.
          </p>
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          <h2 style={{ marginBottom: '1.5rem' }}>Sign In</h2>

          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee2e2',
              borderRadius: 8,
              marginBottom: '1rem',
              color: '#dc2626'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
            />

            <button type="submit" disabled={loading} style={primaryBtn}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleGoogleRedirect}
              style={googleBtn}
            >
              Sign in with Google
            </button>

          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            Don't have an account? <Link to="/register">Create account</Link>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hide-mobile { display:none }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  padding: '0.9rem',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: '1rem'
};

const primaryBtn = {
  padding: '1rem',
  border: 'none',
  borderRadius: 8,
  background: '#0ea5e9',
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer'
};

const googleBtn = {
  padding: '1rem',
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  background: 'white',
  cursor: 'pointer',
  fontWeight: 500
};

export default Login;
