import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    // Fix old sessions: if no email but has token, try to decode token to get email
    let email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('accessToken');
    
    if (!email && token) {
      try {
        // Decode JWT token to get email (JWT format: header.payload.signature)
        const payload = JSON.parse(atob(token.split('.')[1]));
        email = payload.sub; // 'sub' is the subject (email) in JWT
        if (email) {
          console.log('Fixed old session: extracted email from token:', email);
          localStorage.setItem('userEmail', email);
        }
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    }
    
    // If still no email, clear and redirect
    if (!email) {
      console.warn('No email in localStorage, clearing and redirecting to login...');
      localStorage.clear();
      navigate('/login');
      return;
    }
    
    fetchUserName();
    fetchApplicationStats();
  }, []);

  const fetchUserName = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const token = localStorage.getItem('accessToken');
      
      console.log('Dashboard - Email from localStorage:', email);
      console.log('Dashboard - Token from localStorage:', token);
      
      // If no email, logout and redirect to login
      if (!email) {
        console.warn('No email found in localStorage, logging out...');
        localStorage.clear();
        // navigate('/login');
        // return;
      }
      
      // Try to get profile first
      if (email) {
        const response = await axios.get(`/api/candidates/profile?email=${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.fullName) {
          setUserName(response.data.fullName);
        } else {
          // Fallback to email name
          setUserName(email.split('@')[0]);
        }
      } else {
        setUserName('Guest');
      }
    } catch (error) {
      console.error('Dashboard - Error fetching user name:', error);
      // Fallback to email name
      const email = localStorage.getItem('userEmail');
      if (email) {
        setUserName(email.split('@')[0]);
      } else {
        setUserName('Guest');
      }
    }
  };

  const fetchApplicationStats = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get(`/api/jobs/applications?candidateEmail=${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const applications = response.data || [];
      setStats({
        total: applications.length,
        approved: applications.filter(app => app.status === 'APPROVED').length,
        pending: applications.filter(app => app.status === 'PENDING').length,
        rejected: applications.filter(app => app.status === 'REJECTED').length
      });
    } catch (error) {
      console.error('Error fetching application stats:', error);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CareerMate
          </h1>
          
          {/* Desktop Navigation */}
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/dashboard" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Bảng điều khiển</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Việc làm</a>
            <a href="/applications" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Đơn ứng tuyển</a>
            <a href="/profile" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Hồ sơ</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Đăng xuất
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <button 
            className="nav-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              display: 'none',
              flexDirection: 'column', 
              gap: '4px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9', transition: 'all 0.3s' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9', transition: 'all 0.3s' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9', transition: 'all 0.3s' }}></div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="nav-mobile" style={{ 
            display: 'none',
            flexDirection: 'column', 
            gap: '0.5rem', 
            padding: '1rem',
            borderTop: '1px solid #e2e8f0',
            background: 'white'
          }}>
            <a href="/dashboard" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', borderRadius: '6px', background: '#f0f9ff' }}>Bảng điều khiển</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Việc làm</a>
            <a href="/applications" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Đơn ứng tuyển</a>
            <a href="/profile" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Hồ sơ</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>
              Đăng xuất
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Chào mừng trở lại, {userName}! 👋
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Đây là những gì đang diễn ra với việc tìm kiếm công việc của bạn hôm nay
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => navigate('/applications')} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.total}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Đơn ứng tuyển đã gửi</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => navigate('/applications')} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#f59e0b"/>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.pending}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Đang chờ xét duyệt</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => navigate('/applications')} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#10b981"/>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.approved}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Đơn được chấp nhận</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
            Thao tác nhanh
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/cv-upload')} onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Tải lên CV</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>Nhận phân tích AI và phản hồi cá nhân hóa</div>
              <button style={{ padding: '0.625rem 1.25rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}>
                Tải lên ngay
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/jobs')} onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Tìm việc làm</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>Khám phá cơ hội phù hợp với kỹ năng của bạn</div>
              <button style={{ padding: '0.625rem 1.25rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}>
                Tìm việc làm
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/coach')} onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Tư vấn nghề nghiệp</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>Nhận hướng dẫn cá nhân hóa từ cố vấn nghề nghiệp AI</div>
              <button style={{ padding: '0.625rem 1.25rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}>
                Bắt đầu trò chuyện
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)')} onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
              </div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Làm bài đánh giá</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>Khám phá điểm mạnh và con đường nghề nghiệp của bạn</div>
              <button style={{ padding: '0.625rem 1.25rem', background: '#ec4899', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}>
                Bắt đầu bài kiểm tra
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
            Hoạt động gần đây
          </h3>
          <div style={{ background: 'white', borderRadius: '12px', padding: '3rem 2rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>📭</div>
            <div style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Chưa có hoạt động nào</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Bắt đầu bằng cách tải lên CV hoặc tìm kiếm việc làm có sẵn</div>
          </div>
        </div>
      </div>

      <style>{`
        /* Desktop navigation visible by default */
        .nav-desktop {
          display: flex !important;
        }
        
        .nav-mobile {
          display: none !important;
        }
        
        @media (max-width: 767px) {
          /* Hide desktop nav on mobile */
          .nav-desktop {
            display: none !important;
          }
          
          /* Show mobile hamburger and menu */
          .nav-mobile {
            display: flex !important;
          }
          
          /* Reduce padding on mobile */
          div[style*="padding: 2.5rem 2rem"] {
            padding: 1.5rem 1rem !important;
          }
          
          /* Smaller headings on mobile */
          h2[style*="fontSize: '2rem'"] {
            font-size: 1.5rem !important;
          }
          
          h3[style*="fontSize: '1.25rem'"] {
            font-size: 1.1rem !important;
          }
          
          /* Adjust stats card font size */
          div[style*="fontSize: '2.25rem'"] {
            font-size: 1.75rem !important;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          /* Tablet adjustments */
          div[style*="padding: 2.5rem 2rem"] {
            padding: 2rem 1.5rem !important;
          }
        }
        
        /* SVG icon hover effects */
        svg {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        div:hover svg {
          transform: scale(1.15) rotate(3deg);
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
        }
        
        /* Icon container glow effect */
        div[style*="borderRadius: '12px'"][style*="display: flex"]:hover {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3) !important;
          animation: iconGlow 0.6s ease-out;
        }
        
        @keyframes iconGlow {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        /* Card hover with icon animation */
        div[style*="cursor: 'pointer'"]:hover svg {
          transform: scale(1.2) rotate(5deg);
          animation: iconBounce 0.6s ease-out;
        }
        
        @keyframes iconBounce {
          0%, 20%, 60%, 100% { transform: scale(1.2) rotate(5deg) translateY(0); }
          40% { transform: scale(1.2) rotate(5deg) translateY(-4px); }
          80% { transform: scale(1.2) rotate(5deg) translateY(-2px); }
        }
        
        /* Gradient animation for icons */
        div[style*="background: linear-gradient"] {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
