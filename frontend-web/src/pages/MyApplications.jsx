import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyApplications({ onLogout }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get(`/api/jobs/applications?candidateEmail=${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setApplications(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPROVED': return { bg: '#d1fae5', color: '#059669' };
      case 'REJECTED': return { bg: '#fee2e2', color: '#dc2626' };
      default: return { bg: '#fef3c7', color: '#d97706' };
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navigation */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e40af' }}>
            CareerMate
          </div>
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Bảng điều khiển</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Việc làm</a>
            <a href="/applications" style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Đơn ứng tuyển</a>
            <a href="/profile" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Hồ sơ</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Đăng xuất
            </button>
          </div>
          <button className="nav-mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ flexDirection: 'column', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#1e40af' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#1e40af' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#1e40af' }}></div>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="nav-mobile" style={{ flexDirection: 'column', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Bảng điều khiển</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Việc làm</a>
            <a href="/applications" style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#eff6ff', borderRadius: '6px' }}>Đơn ứng tuyển</a>
            <a href="/profile" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Hồ sơ</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Đăng xuất</button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Đơn ứng tuyển của tôi
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Theo dõi trạng thái các đơn ứng tuyển của bạn
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }} onClick={() => navigate('/applications')}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Tổng số đơn</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>{applications.length}</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }} onClick={() => navigate('/applications')}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Được chấp nhận</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#059669' }}>
              {applications.filter(a => a.status === 'APPROVED').length}
            </div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }} onClick={() => navigate('/applications')}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Đang chờ</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#d97706' }}>
              {applications.filter(a => a.status === 'PENDING').length}
            </div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }} onClick={() => navigate('/applications')}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Bị từ chối</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#dc2626' }}>
              {applications.filter(a => a.status === 'REJECTED').length}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {applications.map((app) => {
            const statusStyle = getStatusColor(app.status);
            return (
              <div key={app.id} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                      {app.jobTitle}
                    </h3>
                    <div style={{ fontSize: '0.95rem', color: '#3b82f6', fontWeight: '600', marginBottom: '0.5rem' }}>
                      🏢 {app.companyName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      Ứng tuyển vào {new Date(app.appliedAt).toLocaleDateString('vi-VN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <span style={{ 
                    padding: '0.5rem 1rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.875rem', 
                    fontWeight: '600',
                    background: statusStyle.bg,
                    color: statusStyle.color
                  }}>
                    {app.status}
                  </span>
                </div>

                {app.coverLetter && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a', fontSize: '0.875rem' }}>Thư xin việc:</div>
                    <div style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.6' }}>
                      {app.coverLetter}
                    </div>
                  </div>
                )}

                {app.status === 'APPROVED' && (
                  <div style={{ background: '#d1fae5', padding: '1rem', borderRadius: '6px', border: '1px solid #6ee7b7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Chúc mừng!
                    </div>
                    <div style={{ color: '#047857', fontSize: '0.875rem' }}>
                      Đơn ứng tuyển của bạn đã được chấp nhận. Nhà tuyển dụng sẽ liên hệ với bạn sớm để thực hiện các bước tiếp theo.
                    </div>
                  </div>
                )}

                {app.status === 'REJECTED' && (
                  <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Đơn ứng tuyển không được chọn
                    </div>
                    <div style={{ color: '#b91c1c', fontSize: '0.875rem' }}>
                      Rất tiếc, đơn ứng tuyển của bạn không được chọn cho vị trí này. Hãy tiếp tục ứng tuyển các cơ hội khác!
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {applications.length === 0 && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '3rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              Chưa có đơn ứng tuyển nào
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Bắt đầu ứng tuyển việc làm để xem các đơn ứng tuyển tại đây
            </p>
            <button
              onClick={() => navigate('/jobs')}
              style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Tìm việc làm
            </button>
          </div>
        )}
      </div>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          h1 { font-size: 1.5rem !important; }
          h2 { font-size: 1.25rem !important; }
        }
        
        /* Smooth transitions for all elements */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Navigation hover effects */
        .nav-desktop a:hover {
          color: #1e40af !important;
          transform: translateY(-1px);
        }
        
        .nav-mobile a:hover {
          background: #f0f9ff !important;
          transform: translateX(4px);
        }
        
        /* Button hover effects */
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        /* Stats cards animation */
        div[style*="background: 'white'"][style*="padding: '1.25rem'"]:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* SVG icon hover effects */
        div[style*="background: 'white'"][style*="padding: '3rem'"]:hover svg {
          transform: scale(1.1) rotate(5deg);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
          stroke: #1e40af;
        }
        
        /* Empty state icon container hover */
        div[style*="background: linear-gradient"][style*="borderRadius: '50%'"]:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
        }
        
        /* Application cards hover effect */
        div[style*="background: 'white'"][style*="borderRadius: '8px'"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08) !important;
        }
        
        /* Page load animation */
        body {
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Stagger animation for stats cards */
        div[style*="display: grid"][style*="gridTemplateColumns"] > div:nth-child(1) {
          animation: slideInUp 0.6s ease-out 0.1s both;
        }
        div[style*="display: grid"][style*="gridTemplateColumns"] > div:nth-child(2) {
          animation: slideInUp 0.6s ease-out 0.2s both;
        }
        div[style*="display: grid"][style*="gridTemplateColumns"] > div:nth-child(3) {
          animation: slideInUp 0.6s ease-out 0.3s both;
        }
        div[style*="display: grid"][style*="gridTemplateColumns"] > div:nth-child(4) {
          animation: slideInUp 0.6s ease-out 0.4s both;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Status badge pulse animation */
        span[style*="borderRadius: '9999px'"] {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        /* Success/Error message animations */
        div[style*="background: '#d1fae5'"] {
          animation: bounceIn 0.6s ease-out;
        }
        
        div[style*="background: '#fee2e2'"] {
          animation: shakeIn 0.6s ease-out;
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shakeIn {
          0% { transform: translateX(-10px); opacity: 0; }
          25% { transform: translateX(10px); }
          50% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        /* Mobile menu slide animation */
        .nav-mobile[style*="display: flex"] {
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default MyApplications;
