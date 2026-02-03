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

    // Validate password length
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
      // Only send the fields that the backend expects
      const registerData = {
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      console.log('Sending registration request:', registerData);
      
      const registerResponse = await axios.post('/api/auth/register', registerData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      });
      
      console.log('Registration successful:', registerResponse.data);
      
      console.log('Attempting login...');
      const loginResponse = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      });
      
      console.log('Login successful:', loginResponse.data);
      
      const { accessToken, refreshToken, role } = loginResponse.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userRole', role || 'CANDIDATE');
      
      // Create candidate profile for new users
      try {
        await axios.post('/api/candidates/profile', {
          email: formData.email,
          fullName: formData.username || 'New User',
          phone: '',
          location: '',
          skills: '',
          experience: '',
          education: '',
          points: 0
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginResponse.data.accessToken}`
          },
          withCredentials: false
        });
      } catch (profileError) {
        console.log('Profile creation failed (non-critical):', profileError);
        // Continue even if profile creation fails
      }
      
      onRegister(accessToken);
      
      // Redirect based on role
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.status === 400) {
        // Handle validation errors
        const errorMessage = err.response?.data?.message || 'Registration failed. Please check your input.';
        if (errorMessage.includes('Password must be at least 8 characters')) {
          setError('Password must be at least 8 characters long');
        } else if (errorMessage.includes('Email should be valid')) {
          setError('Please enter a valid email address');
        } else if (errorMessage.includes('already exists')) {
          setError('An account with this email already exists');
        } else {
          setError(errorMessage);
        }
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
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
        background: 'linear-gradient(-45deg, #10b981, #059669, #047857, #065f46)', 
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
          top: '15%',
          left: '15%',
          width: '18px',
          height: '18px',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '50%',
          animation: 'float1 7s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '20%',
          width: '22px',
          height: '22px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float2 9s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '35%',
          left: '25%',
          width: '16px',
          height: '16px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '50%',
          animation: 'float3 11s ease-in-out infinite'
        }}></div>
        
        <div style={{ maxWidth: '500px', position: 'relative', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem', 
            letterSpacing: '-0.02em',
            animation: 'slideInLeft 1s ease-out'
          }}>
            Tham gia CareerMate
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            lineHeight: '1.8', 
            opacity: 0.95, 
            marginBottom: '2rem',
            animation: 'slideInLeft 1s ease-out 0.2s both'
          }}>
            Bắt đầu hành trình thành công trong sự nghiệp. Nhận gợi ý việc làm cá nhân hóa, hướng dẫn chuyên gia và khai phá tiềm năng của bạn.
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
                fontSize: '1.75rem',
                animation: 'pulse 2s ease-in-out infinite',
                backdropFilter: 'blur(10px)'
              }}>✨</div>
              <div>
                <div style={{ fontWeight: '700', marginBottom: '0.375rem', fontSize: '1.25rem' }}>Miễn phí tham gia</div>
                <div style={{ opacity: 0.95, fontSize: '1rem', lineHeight: '1.5' }}>Tạo tài khoản chỉ trong vài phút</div>
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
              }}>⚡</div>
              <div>
                <div style={{ fontWeight: '700', marginBottom: '0.375rem', fontSize: '1.25rem' }}>Truy cập ngay lập tức</div>
                <div style={{ opacity: 0.95, fontSize: '1rem', lineHeight: '1.5' }}>Bắt đầu khám phá cơ hội ngay lập tức</div>
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
              }}>🛡️</div>
              <div>
                <div style={{ fontWeight: '700', marginBottom: '0.375rem', fontSize: '1.25rem' }}>An toàn & Bảo mật</div>
                <div style={{ opacity: 0.95, fontSize: '1rem', lineHeight: '1.5' }}>Dữ liệu của bạn được bảo vệ và bảo mật</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', height: '100vh' }}>
        <div className="register-form-container" style={{ width: '75%', height: '85%', maxWidth: '450px', minWidth: '300px', maxHeight: '650px', minHeight: '550px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Mobile Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="show-mobile">
            <h1 style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
              CareerMate
            </h1>
          </div>

          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              Tạo tài khoản của bạn
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Bắt đầu với tài khoản miễn phí
            </p>
          </div>

          {error && (
            <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.95rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500', fontSize: '1rem' }}>
                Họ và tên
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Nguyễn Văn A"
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

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
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500', fontSize: '1rem' }}>
                Tôi là
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none', cursor: 'pointer', background: 'white' }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="CANDIDATE">Người tìm việc</option>
                <option value="RECRUITER">Nhà tuyển dụng</option>
              </select>
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
                minLength="8"
                placeholder="Tạo mật khẩu mạnh (tối thiểu 8 ký tự)"
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: '500', fontSize: '1rem' }}>
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Nhập lại mật khẩu"
                style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', marginTop: '1rem' }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-1px)', e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)')}
              onMouseOut={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)')}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>

          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '1rem' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '600' }}>
              Đăng nhập
            </Link>
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
            transform: translateY(-25px) translateX(15px);
          }
          66% {
            transform: translateY(12px) translateX(-8px);
          }
        }
        
        @keyframes float2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(-12px);
          }
        }
        
        @keyframes float3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-12px) translateX(18px);
          }
          75% {
            transform: translateY(18px) translateX(-12px);
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
          .register-form-container {
            width: 85% !important;
            height: 90% !important;
            max-width: 350px !important;
            min-width: 280px !important;
            max-height: 600px !important;
            min-height: 500px !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;
