import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (keyword = '') => {
    try {
      setLoading(true);
      const url = keyword 
        ? `/api/jobs/search?keyword=${encodeURIComponent(keyword)}`
        : '/api/jobs/search';
      const response = await fetch(url);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchKeyword);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Jobs</a>
            <a href="/applications" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>My Applications</a>
            <a href="/profile" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Profile</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="nav-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', flexDirection: 'column', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
          >
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9' }}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="nav-mobile" style={{ display: 'none', flexDirection: 'column', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', borderRadius: '6px', background: '#f0f9ff' }}>Jobs</a>
            <a href="/applications" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>My Applications</a>
            <a href="/profile" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Profile</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Discover Your Next Opportunity
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Browse {jobs.length} available positions matching your profile
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', background: 'white', padding: '0.5rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <input
              type="text"
              placeholder="Search by job title, company, skills, or location..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ flex: 1, padding: '0.875rem 1rem', border: 'none', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: 'transparent' }}
            />
            <button type="submit" style={{ padding: '0.875rem 2rem', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)' }} onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
              Search Jobs
            </button>
          </div>
        </form>

        {/* Jobs List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', fontSize: '1.1rem' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#0ea5e9', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }}></div>
            Loading opportunities...
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {jobs.map(job => (
              <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} style={{ background: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)', e.currentTarget.style.transform = 'translateY(-2px)')} onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none', e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.25rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
                      {job.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#0ea5e9', fontWeight: '600', fontSize: '1.05rem' }}>
                        {job.companyName}
                      </span>
                      <span style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></span>
                      <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Posted recently</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', color: '#64748b', fontSize: '0.95rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.375rem 0.875rem', borderRadius: '6px' }}>
                        <span>📍</span>
                        <span>{job.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.375rem 0.875rem', borderRadius: '6px' }}>
                        <span>💰</span>
                        <span>{job.salaryRange}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.375rem 0.875rem', borderRadius: '6px' }}>
                        <span>⏰</span>
                        <span>{job.employmentType}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.375rem 0.875rem', borderRadius: '6px' }}>
                        <span>📊</span>
                        <span>{job.experienceRequired}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }} style={{ padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', whiteSpace: 'nowrap' }} onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
                    View Details
                  </button>
                </div>
                
                <p style={{ color: '#475569', marginBottom: '1.25rem', lineHeight: '1.7', fontSize: '0.975rem' }}>
                  {job.description}
                </p>
                
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: '#0f172a', fontWeight: '600', fontSize: '0.95rem' }}>Requirements: </span>
                    <span style={{ color: '#64748b', fontSize: '0.95rem' }}>{job.requirements}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {job.requirements.split(',').slice(0, 5).map((skill, idx) => (
                      <span key={idx} style={{ background: '#dbeafe', color: '#0369a1', padding: '0.375rem 0.875rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500' }}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '4rem 2rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>🔍</div>
            <div style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No jobs found</div>
            <div style={{ color: '#64748b', fontSize: '1rem' }}>Try adjusting your search criteria or browse all available positions</div>
          </div>
        )}
      </div>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          
          h2 { font-size: 1.5rem !important; }
          
          div[style*="padding: 1.5rem 1rem"] {
            padding: 1rem !important;
          }
          
          /* Stack search button on mobile */
          form > div {
            flex-direction: column !important;
          }
          
          form button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Jobs;
