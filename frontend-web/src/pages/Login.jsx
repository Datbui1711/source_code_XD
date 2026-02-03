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
      
      // Redirect based on role
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
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
      {/* Left Side - Animated Branding */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(-45deg, #0ea5e9, #06b6d4, #0891b2, #0284c7)', 
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '2rem', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }} className="hide-mobile">
        {/* Floating particles */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '20px',
          height: '20px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float1 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '15px',
          height: '15px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '50%',
          animation: 'float2 8s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          left: '20%',
          width: '25px',
          height: '25px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float3 10s ease-in-out infinite'
        }}></div>
        
        <div style={{ maxWidth: '500px', position: 'relative', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem', 
            letterSpacing: '-0.02em',
            animation: 'slideInLeft 1s ease-out'
          }}>
            CareerMate
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            lineHeight: '1.8', 
            opacity: 0.95, 
            marginBottom: '2rem',
            animation: 'slideInLeft 1s ease-out 0.2s both'
          }}>
            Người bạn đồng hành thông minh trong sự nghiệp. Kết nối với cơ hội, phát triển kỹ năng và thăng tiến trong hành trình nghề nghiệp.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.25rem',
              animation: 'slideInLeft 1s ease-out 0.4s both'
            }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite',
                backdropFilter: 'blur(10px)'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 7V3C12 2.45 11.55 2 11 2H5C4.45 2 4 2.45 4 3V7H2V17C2 18.1 2.9 19 4 19H8V21C8 21.55 8.45 22 9 22H15C15.55 22 16 21.55 16 21V19H20C21.1 19 22 18.1 22 17V7H12ZM6 4H10V7H6V4ZM14 20H10V16H14V20ZM20 17H4V9H20V17Z" fill="white"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: '700', marginBottom: '0.375rem', fontSize: '1.25rem' }}>Tìm việc thông minh</div>
                <div style={{ opacity: 0.95, fontSize: '1rem', lineHeight: '1.5' }}>Gợi ý việc làm phù hợp nhờ AI</div>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.25rem',
              animation: 'slideInLeft 1s ease-out 0.6s both'
            }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.75rem',
                animation: 'pulse 2s ease-in-out infinite 0.5s',
                backdropFilter: 'blur(10px)'
              }}>🎓</div>
              <div>
                <div style={{ fontWeight: '700', marginBottom: '0.375rem', fontSize: '1.25rem' }}>Tư vấn nghề nghiệp</div>
                <div style={{ opacity: 0.95, fontSize: '1rem', lineHeight: '1.5' }}>Lời khuyên chuyên gia và lộ trình nghề nghiệp cá nhân hóa</div>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.25rem',
              animation: 'slideInLeft 1s ease-out 0.8s both'
            }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.75rem',
                animation: 'pulse 2s ease-in-out infinite 1s',
                backdropFilter: 'blur(10px)'
              }}>📈</div>
              <div>
                <div style={{ fontWeight: '700', marginBottom: '0.375rem', fontSize: '1.25rem' }}>Phát triển kỹ năng</div>
                <div style={{ opacity: 0.95, fontSize: '1rem', lineHeight: '1.5' }}>Đánh giá và lộ trình học tập để thúc đẩy sự nghiệp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', height: '100vh' }}>
        <div className="login-form-container" style={{ width: '75%', height: '75%', maxWidth: '450px', minWidth: '300px', maxHeight: '600px', minHeight: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Mobile Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="show-mobile">
            <h1 style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
              CareerMate
            </h1>
          </div>

          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              Chào mừng trở lại
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Đăng nhập để tiếp tục vào tài khoản của bạn
            </p>
          </div>

          {error && (
            <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.95rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500', fontSize: '1rem' }}>
                Địa chỉ Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500', fontSize: '1rem' }}>
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu của bạn"
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#64748b', fontSize: '0.9rem' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)', marginTop: '1rem' }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-1px)', e.target.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.4)')}
              onMouseOut={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)')}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '1rem' }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600' }}>
              Tạo tài khoản
            </Link>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Bằng cách đăng nhập, bạn đồng ý với{' '}
              <a href="#" style={{ color: '#64748b', textDecoration: 'underline' }}>Điều khoản dịch vụ</a>
              {' '}và{' '}
              <a href="#" style={{ color: '#64748b', textDecoration: 'underline' }}>Chính sách bảo mật</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes float1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-5px);
          }
        }
        
        @keyframes float2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(-10px);
          }
        }
        
        @keyframes float3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(15px);
          }
          75% {
            transform: translateY(15px) translateX(-10px);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
        }
        
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
        @media (max-width: 480px) {
          .login-form-container {
            width: 85% !important;
            height: 80% !important;
            max-width: 350px !important;
            min-width: 280px !important;
            max-height: 550px !important;
            min-height: 450px !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
