import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Fetch users from auth service
      const usersResponse = await axios.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch jobs
      const jobsResponse = await axios.get('/api/jobs/search', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allUsers = usersResponse.data || [];
      const allJobs = jobsResponse.data || [];

      setUsers(allUsers);
      setJobs(allJobs);

      // Calculate stats
      setStats({
        totalUsers: allUsers.length,
        totalCandidates: allUsers.filter(u => u.role === 'CANDIDATE').length,
        totalRecruiters: allUsers.filter(u => u.role === 'RECRUITER').length,
        totalJobs: allJobs.length,
        activeJobs: allJobs.filter(j => j.isActive !== false).length,
        totalApplications: 0 // Will be calculated from applications API
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`/api/auth/users/${userId}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User deactivated successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Failed to deactivate user');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job deleted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navigation */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
            CareerMate Admin
          </div>
          
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/admin/dashboard" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Bảng điều khiển</a>
            <a href="/admin/users" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Người dùng</a>
            <a href="/admin/jobs" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Việc làm</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Đăng xuất
            </button>
          </div>

          <button 
            className="nav-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', flexDirection: 'column', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
          >
            <div style={{ width: '24px', height: '2px', background: '#dc2626' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#dc2626' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#dc2626' }}></div>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="nav-mobile" style={{ display: 'none', flexDirection: 'column', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
            <a href="/admin/dashboard" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', borderRadius: '6px', background: '#fef2f2' }}>Bảng điều khiển</a>
            <a href="/admin/users" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Người dùng</a>
            <a href="/admin/jobs" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Việc làm</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>
              Đăng xuất
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Bảng điều khiển quản trị
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Tổng quan hệ thống và quản lý
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Tổng người dùng</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>{stats.totalUsers}</div>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Ứng viên</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>{stats.totalCandidates}</div>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Nhà tuyển dụng</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>{stats.totalRecruiters}</div>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Tổng việc làm</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{stats.totalJobs}</div>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9,11 12,14 22,4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Việc làm đang hoạt động</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669' }}>{stats.activeJobs}</div>
          </div>
        </div>

        {/* Recent Users */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
            Người dùng gần đây
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Role</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Created</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a' }}>{user.id}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a' }}>{user.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        background: user.role === 'ADMIN' ? '#fee2e2' : user.role === 'RECRUITER' ? '#ede9fe' : '#dbeafe',
                        color: user.role === 'ADMIN' ? '#dc2626' : user.role === 'RECRUITER' ? '#7c3aed' : '#2563eb'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        background: user.isActive ? '#d1fae5' : '#fee2e2',
                        color: user.isActive ? '#059669' : '#dc2626'
                      }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {user.role !== 'ADMIN' && user.isActive && (
                        <button
                          onClick={() => handleDeactivateUser(user.id)}
                          style={{ padding: '0.375rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Jobs */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
            Việc làm gần đây
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Title</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Location</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Experience</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Created</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 10).map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a' }}>{job.id}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a', fontWeight: '600' }}>{job.title}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>{job.location}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>{job.experienceRequired}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        style={{ padding: '0.375rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
        
        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Navigation hover effects */
        .nav-desktop a:hover {
          color: #dc2626 !important;
          transform: translateY(-1px);
        }
        
        .nav-mobile a:hover {
          background: #fef2f2 !important;
          transform: translateX(4px);
        }
        
        /* Stats cards hover effects */
        div[style*="background: 'white'"][style*="padding: '1.5rem'"]:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* SVG icon hover effects */
        div[style*="background: 'white'"][style*="padding: '1.5rem'"]:hover svg {
          transform: scale(1.1) rotate(5deg);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        
        /* Icon container hover effects */
        div[style*="background: linear-gradient"] {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        div[style*="background: 'white'"][style*="padding: '1.5rem'"]:hover div[style*="background: linear-gradient"] {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        /* Table row hover effects */
        tr:hover {
          background: #f8fafc !important;
          transform: scale(1.01);
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
        div[style*="display: grid"][style*="gridTemplateColumns"] > div:nth-child(5) {
          animation: slideInUp 0.6s ease-out 0.5s both;
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
        
        /* Table animation */
        table {
          animation: slideInUp 0.8s ease-out 0.6s both;
        }
        
        /* Status badges pulse */
        span[style*="borderRadius: '9999px'"] {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
