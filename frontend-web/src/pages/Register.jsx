import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, username, ...registerData } = formData;

      await axios.post('/api/auth/register', registerData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: false
      });

      const loginResponse = await axios.post(
        '/api/auth/login',
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false
        }
      );

      const { accessToken, refreshToken, role } = loginResponse.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userRole', role || 'CANDIDATE');

      // Create default candidate profile
      try {
        await axios.post('/api/candidates/profile', {
          email: formData.email,
          fullName: username || 'New User',
          phone: '',
          location: '',
          skills: '',
          experience: '',
          education: '',
          points: 0
        });
      } catch (profileError) {
        console.log('Profile creation skipped:', profileError?.response?.status);
      }

      onRegister(accessToken);

      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'RECRUITER') navigate('/recruiter/dashboard');
      else navigate('/dashboard');

    } catch (err) {
      console.error(err);

      if (err.response?.status === 400) {
        const msg = err.response?.data?.message || 'Invalid input';

        if (msg.includes('Password')) setError('Password must be at least 8 characters');
        else if (msg.includes('Email')) setError('Invalid email format');
        else if (msg.includes('exists')) setError('Email already registered');
        else setError(msg);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRedirect = () => {
    const clientId = '779733565753-0a5iejqqpo5mk0r29p750e4bjoaidb1f.apps.googleusercontent.com';
    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=http://localhost:3000/oauth2/callback` +
      `&response_type=token id_token` +
      `&scope=openid email profile` +
      `&nonce=${Date.now()}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>

      <div className="hide-mobile" style={{
        flex: 1,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '2rem',
        color: 'white'
      }}>
        <h1>Join CareerMate</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          <h2>Create account</h2>

          {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <input name="username" placeholder="Full name" required onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" required onChange={handleChange} />

            <select name="role" onChange={handleChange} value={formData.role}>
              <option value="CANDIDATE">Job Seeker</option>
              <option value="RECRUITER">Recruiter</option>
            </select>

            <input name="password" type="password" placeholder="Password (min 8 chars)" required onChange={handleChange} />
            <input name="confirmPassword" type="password" placeholder="Confirm password" required onChange={handleChange} />

            <button disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            <button type="button" onClick={handleGoogleRedirect}>
              Sign up with Google
            </button>

          </form>

          <div style={{ marginTop: 15 }}>
            Have account? <Link to="/login">Sign in</Link>
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

export default Register;
