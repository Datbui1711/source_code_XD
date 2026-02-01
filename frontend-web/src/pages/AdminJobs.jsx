import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminJobs({ onLogout }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/jobs/search', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
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
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <a href="/admin/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/admin/users" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Users</a>
            <a href="/admin/jobs" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Jobs</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Logout
            </button>
          </div>
          <button className="nav-mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ flexDirection: 'column', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#dc2626' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#dc2626' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#dc2626' }}></div>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="nav-mobile" style={{ flexDirection: 'column', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
            <a href="/admin/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Dashboard</a>
            <a href="/admin/users" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Users</a>
            <a href="/admin/jobs" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#fef2f2', borderRadius: '6px' }}>Jobs</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Logout</button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Job Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Manage all job postings in the system
          </p>
        </div>

        {/* Search */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.95rem' }}
          />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Jobs</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>{jobs.length}</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Active Jobs</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>{jobs.filter(j => j.isActive !== false).length}</div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredJobs.map((job) => (
            <div key={job.id} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                    {job.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#64748b' }}>
                    {job.location && (
                      <span>📍 {job.location}</span>
                    )}
                    {job.experienceRequired && (
                      <span>💼 {job.experienceRequired}</span>
                    )}
                    {job.createdAt && (
                      <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    style={{ padding: '0.5rem 1rem', background: '#dbeafe', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    style={{ padding: '0.5rem 1rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {job.description && (
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {job.description.length > 200 ? job.description.substring(0, 200) + '...' : job.description}
                </p>
              )}

              {job.requirements && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', fontSize: '0.875rem', color: '#64748b' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>Requirements:</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {job.requirements.length > 150 ? job.requirements.substring(0, 150) + '...' : job.requirements}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '3rem', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
            No jobs found
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

export default AdminJobs;
