import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OAuth2Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');

    if (!idToken) {
      navigate('/login?error=no_token');
      return;
    }

    axios.post('/api/auth/oauth2/google', { idToken })
      .then(async (response) => {
        const { accessToken, refreshToken, role, email } = response.data;

        const userRole = role || 'CANDIDATE';

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', email);

        // Auto-create candidate profile if needed
        if (userRole === 'CANDIDATE') {
          try {
            await axios.post(
              '/api/candidates/profile',
              {
                email,
                fullName: email.split('@')[0],
                phone: '',
                address: '',
                skills: [],
                experience: [],
                education: []
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              }
            );
          } catch (profileError) {
            console.log('Profile may already exist:', profileError?.response?.status);
          }
        }

        if (userRole === 'ADMIN') navigate('/admin/dashboard');
        else if (userRole === 'RECRUITER') navigate('/recruiter/dashboard');
        else navigate('/dashboard');
      })
      .catch(err => {
        console.error('OAuth error:', err);
        alert('Đăng nhập Google thất bại. Vui lòng thử lại.');
        navigate('/login');
      });

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
        }} />
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>
          Đang xử lý đăng nhập...
        </h2>
        <p style={{ color: '#64748b' }}>
          Vui lòng đợi trong giây lát
        </p>
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
