import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OAuth2Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');

    if (idToken) {
      axios.post('/api/auth/oauth2/google', { idToken })
        .then(response => {
          const { accessToken, refreshToken, role, email } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userRole', role);
          localStorage.setItem('userEmail', email);
          
          if (role === 'ADMIN') navigate('/admin/dashboard');
          else if (role === 'RECRUITER') navigate('/recruiter/dashboard');
          else navigate('/dashboard');
        })
        .catch(err => {
          console.error('OAuth error:', err);
          alert('Đăng nhập Google thất bại. Vui lòng thử lại.');
          navigate('/login');
        });
    } else {
      navigate('/login?error=no_token');
    }
  }, [navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          border: '4px solid #e2e8f0',
          borderTopColor: '#0ea5e9',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1.5rem'
        }}></div>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>
          Đang xử lý đăng nhập...
        </h2>
        <p style={{ color: '#64748b' }}>Vui lòng đợi trong giây lát</p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default OAuth2Callback;
