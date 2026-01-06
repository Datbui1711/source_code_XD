import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CANDIDATE'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await axios.post('/api/auth/register', registerData);
      
      const loginResponse = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      const { accessToken, refreshToken } = loginResponse.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      onRegister(accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('/api/auth/oauth2/google', {
        idToken: credentialResponse.credential
      });
      
      const { accessToken, refreshToken, role } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userRole', role || 'CANDIDATE');
      
      onRegister(accessToken);
      
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Google sign-up failed. Please try again.');
      console.error('Google sign-up error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-up failed. Please try again.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      {/* Left Side - Branding */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem', color: 'white' }} className="hide-mobile">
        <div style={{ maxWidth: '500px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Join CareerMate
          </h1>
          <p style={{ fontSize: '1.25rem', lineHeight: '1.8', opacity: 0.95, marginBottom: '2rem' }}>
            Start your journey to career success. Get personalized job recommendations, expert guidance, and unlock your full potential.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎯</div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Free to Join</div>
                <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Create your account in minutes</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🚀</div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Instant Access</div>
                <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Start exploring opportunities right away</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🔒</div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Secure & Private</div>
                <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Your data is protected and confidential</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ width: '100%', maxWidth: '440px', padding: '1rem' }}>
          {/* Mobile Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="show-mobile">
            <h1 style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
              CareerMate
            </h1>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              Create your account
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Get started with your free account
            </p>
          </div>

          {error && (
            <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '1.5rem', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500', fontSize: '0.95rem' }}>
                Full Name
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500', fontSize: '0.95rem' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500', fontSize: '0.95rem' }}>
                I am a
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none', cursor: 'pointer', background: 'white' }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="CANDIDATE">Job Seeker</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500', fontSize: '0.95rem' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500', fontSize: '0.95rem' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', marginTop: '0.5rem' }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-1px)', e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)')}
              onMouseOut={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)')}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <div style={{ position: 'relative', textAlign: 'center', margin: '1.5rem 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e2e8f0' }}></div>
              <span style={{ position: 'relative', background: '#f8fafc', padding: '0 1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                Or sign up with
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  const clientId = '779733565753-0a5iejqqpo5mk0r29p750e4bjoaidb1f.apps.googleusercontent.com';
                  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=http://localhost:3000/oauth2/callback&response_type=token id_token&scope=openid email profile&nonce=${Date.now()}`;
                }}
                style={{ 
                  width: '100%', 
                  padding: '0.875rem 1rem', 
                  background: 'white', 
                  border: '1.5px solid #e2e8f0', 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  fontWeight: '500', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                  color: '#334155'
                }}
                onMouseOver={(e) => e.target.style.borderColor = '#cbd5e1'}
                onMouseOut={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
            </div>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '600' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hide-mobile {
            display: none !important;
          }
          .show-mobile {
            display: block !important;
          }
        }
        @media (min-width: 768px) {
          .show-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;
