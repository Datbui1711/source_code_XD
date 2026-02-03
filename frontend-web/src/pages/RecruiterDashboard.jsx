import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RecruiterDashboard({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recruiter's jobs only
      const userEmail = localStorage.getItem('userEmail');
      const jobsResponse = await fetch('/api/jobs/my-jobs', {
        headers: {
          'X-User-Email': userEmail
        }
      });
      const jobs = await jobsResponse.json();
      
      // Fetch applications for all jobs
      let allApplications = [];
      for (const job of jobs) {
        const appResponse = await fetch(`/api/jobs/${job.id}/applications`);
        const apps = await appResponse.json();
        allApplications = [...allApplications, ...apps.map(app => ({ ...app, jobTitle: job.title }))];
      }

      // Calculate stats
      const pending = allApplications.filter(app => app.status === 'PENDING').length;
      const approved = allApplications.filter(app => app.status === 'APPROVED').length;

      setStats({
        totalJobs: jobs.length,
        totalApplications: allApplications.length,
        pendingApplications: pending,
        approvedApplications: approved
      });

      // Get recent 5 applications
      setRecentApplications(allApplications.slice(0, 5));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>
            CareerMate Recruiter
          </h1>
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/recruiter/dashboard" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Bảng điều khiển</a>
            <a href="/recruiter/applications" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Đơn ứng tuyển</a>
            <a href="/recruiter/analytics" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Phân tích</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Đăng xuất
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
            <a href="/recruiter/dashboard" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#f0f9ff', borderRadius: '6px' }}>Bảng điều khiển</a>
            <a href="/recruiter/applications" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Đơn ứng tuyển</a>
            <a href="/recruiter/analytics" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Phân tích</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Đăng xuất</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Chào mừng trở lại! 👋
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Đây là tổng quan về các hoạt động tuyển dụng của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.totalJobs}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Tin tuyển dụng đang hoạt động</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.totalApplications}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Tổng đơn ứng tuyển</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.pendingApplications}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Đang chờ xét duyệt</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.approvedApplications}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Ứng viên được chấp nhận</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
            Thao tác nhanh
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/recruiter/applications')}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"></path>
                  <rect x="9" y="7" width="6" height="6"></rect>
                </svg>
              </div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Review Applications</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>View and manage candidate applications</div>
              <button style={{ padding: '0.625rem 1.25rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}>
                View Applications
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/recruiter/post-job')}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Post New Job</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>Create a new job posting</div>
              <button style={{ padding: '0.625rem 1.25rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}>
                Create Job
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/recruiter/cv-screening')}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                  <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                  <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"></path>
                </svg>
              </div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.05rem' }}>AI CV Screening</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>Analyze and rank candidates with AI</div>
              <button style={{ padding: '0.625rem 1.25rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}>
                Screen CVs
              </button>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
            Đơn ứng tuyển gần đây
          </h3>
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading...</div>
            ) : recentApplications.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <div style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>No applications yet</div>
                <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Applications will appear here once candidates start applying</div>
              </div>
            ) : (
              <div>
                {recentApplications.map((app, idx) => (
                  <div key={app.id} style={{ padding: '1.5rem', borderBottom: idx < recentApplications.length - 1 ? '1px solid #e2e8f0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>{app.candidateEmail}</div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Applied for: {app.jobTitle}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        {new Date(app.appliedAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        background: app.status === 'PENDING' ? '#fef3c7' : app.status === 'APPROVED' ? '#d1fae5' : '#fee2e2',
                        color: app.status === 'PENDING' ? '#92400e' : app.status === 'APPROVED' ? '#065f46' : '#991b1b',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {app.status}
                      </span>
                      <button onClick={() => navigate('/recruiter/applications')} style={{ padding: '0.5rem 1rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          h2 { font-size: 1.5rem !important; }
          h3 { font-size: 1.1rem !important; }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Navigation hover effects */
        .nav-desktop a:hover {
          color: #0ea5e9 !important;
          transform: translateY(-1px);
        }
        
        .nav-mobile a:hover {
          background: #f0f9ff !important;
          transform: translateX(4px);
        }
        
        /* Stats cards hover effects */
        div[style*="background: 'white'"][style*="borderRadius: '12px'"]:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12) !important;
        }
        
        /* Quick action cards hover effects */
        div[style*="cursor: 'pointer'"]:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Button hover effects */
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        /* Page load animation */
        body {
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Stats cards stagger animation */
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
        
        /* Quick actions grid animation */
        div[style*="display: grid"][style*="minmax(280px, 1fr)"] > div:nth-child(1) {
          animation: slideInLeft 0.6s ease-out 0.2s both;
        }
        div[style*="display: grid"][style*="minmax(280px, 1fr)"] > div:nth-child(2) {
          animation: slideInLeft 0.6s ease-out 0.4s both;
        }
        div[style*="display: grid"][style*="minmax(280px, 1fr)"] > div:nth-child(3) {
          animation: slideInLeft 0.6s ease-out 0.6s both;
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
        
        /* SVG icon hover effects */
        svg {
          transition: all 0.3s ease;
        }
        
        div:hover svg {
          transform: scale(1.1);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        
        /* Icon container pulse effect */
        div[style*="borderRadius: '12px'"][style*="display: flex"]:hover {
          animation: iconPulse 0.6s ease-out;
        }
        
        @keyframes iconPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        /* Icon rotation on hover */
        div[style*="cursor: 'pointer'"]:hover svg {
          transform: scale(1.1) rotate(5deg);
        }
        
        /* Recent applications animation */
        div[style*="padding: '1.5rem'"][style*="borderBottom"] {
          animation: slideInRight 0.6s ease-out;
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default RecruiterDashboard;
