import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Analytics({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    applicationsByJob: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      
      // Fetch recruiter's jobs
      const jobsResponse = await fetch('/api/jobs/my-jobs', {
        headers: {
          'X-User-Email': userEmail
        }
      });
      const jobs = await jobsResponse.json();

      // Fetch applications for each job
      let allApplications = [];
      const jobStats = [];

      for (const job of jobs) {
        const appResponse = await fetch(`/api/jobs/${job.id}/applications`);
        const apps = await appResponse.json();
        
        allApplications = [...allApplications, ...apps];
        
        jobStats.push({
          jobId: job.id,
          jobTitle: job.title,
          totalApps: apps.length,
          pending: apps.filter(a => a.status === 'PENDING').length,
          approved: apps.filter(a => a.status === 'APPROVED').length,
          rejected: apps.filter(a => a.status === 'REJECTED').length
        });
      }

      setStats({
        totalJobs: jobs.length,
        totalApplications: allApplications.length,
        pendingApplications: allApplications.filter(a => a.status === 'PENDING').length,
        approvedApplications: allApplications.filter(a => a.status === 'APPROVED').length,
        rejectedApplications: allApplications.filter(a => a.status === 'REJECTED').length,
        applicationsByJob: jobStats
      });
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
            <a href="/recruiter/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/recruiter/applications" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Applications</a>
            <a href="/recruiter/analytics" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Analytics</a>
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
            <a href="/recruiter/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Dashboard</a>
            <a href="/recruiter/applications" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Applications</a>
            <a href="/recruiter/analytics" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#f0f9ff', borderRadius: '6px' }}>Analytics</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Logout</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Recruitment Analytics 📊
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Track your recruitment performance and metrics
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading analytics...</div>
        ) : (
          <>
            {/* Overview Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💼</div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>{stats.totalJobs}</div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Active Jobs</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📝</div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>{stats.totalApplications}</div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Applications</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>⏳</div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>{stats.pendingApplications}</div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Pending Review</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>✅</div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>{stats.approvedApplications}</div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Approved</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>❌</div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>{stats.rejectedApplications}</div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Rejected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications by Job */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem' }}>
                Applications by Job Position
              </h3>
              
              {stats.applicationsByJob.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                  <div>No jobs posted yet</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {stats.applicationsByJob.map((job) => (
                    <div key={job.jobId} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>
                            {job.jobTitle}
                          </h4>
                          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                            Total Applications: {job.totalApps}
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/recruiter/applications')}
                          style={{ padding: '0.5rem 1rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
                        >
                          View Details
                        </button>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.25rem' }}>
                            {job.pending}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Pending</div>
                        </div>
                        <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.25rem' }}>
                            {job.approved}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Approved</div>
                        </div>
                        <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.25rem' }}>
                            {job.rejected}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Rejected</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          h2 { font-size: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}

export default Analytics;
