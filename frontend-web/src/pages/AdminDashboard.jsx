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
            <a href="/admin/dashboard" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/admin/users" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Users</a>
            <a href="/admin/jobs" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Jobs</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Logout
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
            <a href="/admin/dashboard" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', borderRadius: '6px', background: '#fef2f2' }}>Dashboard</a>
            <a href="/admin/users" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Users</a>
            <a href="/admin/jobs" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Jobs</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            System overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Users</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>{stats.totalUsers}</div>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Candidates</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>{stats.totalCandidates}</div>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Recruiters</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>{stats.totalRecruiters}</div>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Jobs</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{stats.totalJobs}</div>
          </div>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Active Jobs</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669' }}>{stats.activeJobs}</div>
          </div>
        </div>

        {/* Recent Users */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
            Recent Users
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
            Recent Jobs
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
      `}</style>
    </div>
  );
}

export default AdminDashboard;
