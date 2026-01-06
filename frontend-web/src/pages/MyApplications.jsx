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
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Jobs</a>
            <a href="/applications" style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>My Applications</a>
            <a href="/profile" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Profile</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Logout
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
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Jobs</a>
            <a href="/applications" style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#eff6ff', borderRadius: '6px' }}>My Applications</a>
            <a href="/profile" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Profile</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Logout</button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            My Applications
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Track the status of your job applications
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Applications</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>{applications.length}</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Approved</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#059669' }}>
              {applications.filter(a => a.status === 'APPROVED').length}
            </div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Pending</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#d97706' }}>
              {applications.filter(a => a.status === 'PENDING').length}
            </div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Rejected</div>
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
                      Applied on {new Date(app.appliedAt).toLocaleDateString('en-US', { 
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
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a', fontSize: '0.875rem' }}>Cover Letter:</div>
                    <div style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.6' }}>
                      {app.coverLetter}
                    </div>
                  </div>
                )}

                {app.status === 'APPROVED' && (
                  <div style={{ background: '#d1fae5', padding: '1rem', borderRadius: '6px', border: '1px solid #6ee7b7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: '600', marginBottom: '0.5rem' }}>
                      ✅ Congratulations!
                    </div>
                    <div style={{ color: '#047857', fontSize: '0.875rem' }}>
                      Your application has been approved. The recruiter will contact you soon for the next steps.
                    </div>
                  </div>
                )}

                {app.status === 'REJECTED' && (
                  <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: '600', marginBottom: '0.5rem' }}>
                      ❌ Application Not Selected
                    </div>
                    <div style={{ color: '#b91c1c', fontSize: '0.875rem' }}>
                      Unfortunately, your application was not selected for this position. Keep applying to other opportunities!
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {applications.length === 0 && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '3rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              No Applications Yet
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Start applying to jobs to see your applications here
            </p>
            <button
              onClick={() => navigate('/jobs')}
              style={{ padding: '0.75rem 1.5rem', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
            >
              Browse Jobs
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
      `}</style>
    </div>
  );
}

export default MyApplications;
