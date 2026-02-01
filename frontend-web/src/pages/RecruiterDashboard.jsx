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
            <a href="/recruiter/dashboard" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/recruiter/applications" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Applications</a>
            <a href="/recruiter/analytics" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Analytics</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Logout
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
            <a href="/recruiter/dashboard" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#f0f9ff', borderRadius: '6px' }}>Dashboard</a>
            <a href="/recruiter/applications" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Applications</a>
            <a href="/recruiter/analytics" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Analytics</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Logout</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Welcome back! 👋
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Here's an overview of your recruitment activities
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💼</div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.totalJobs}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Active Job Postings</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📝</div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.totalApplications}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Total Applications</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>⏳</div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.pendingApplications}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Pending Review</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>✅</div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{stats.approvedApplications}</div>
            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Approved Candidates</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/recruiter/applications')}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Review Applications</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>View and manage candidate applications</div>
              <button style={{ padding: '0.625rem 1.25rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}>
                View Applications
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/recruiter/post-job')}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>➕</div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Post New Job</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1rem' }}>Create a new job posting</div>
              <button style={{ padding: '0.625rem 1.25rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', width: '100%' }}>
                Create Job
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/recruiter/cv-screening')}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
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
            Recent Applications
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
      `}</style>
    </div>
  );
}

export default RecruiterDashboard;
