import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile({ onLogout }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    experience: '',
    education: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`/api/candidates/profile?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setFormData({
        fullName: response.data.fullName || '',
        phone: response.data.phone || '',
        location: response.data.location || '',
        bio: response.data.bio || '',
        skills: response.data.skills || '',
        experience: response.data.experience || '',
        education: response.data.education || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Automatically show edit form if no profile exists
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('userEmail');
      const token = localStorage.getItem('accessToken');
      
      if (profile) {
        await axios.put(`/api/candidates/profile?email=${email}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/candidates/profile', {
          ...formData,
          email
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navigation */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e40af' }}>
            CareerMate
          </div>
          
          {/* Desktop Navigation */}
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Jobs</a>
            <a href="/applications" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>My Applications</a>
            <a href="/profile" style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Profile</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Logout
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
            <div style={{ width: '24px', height: '2px', background: '#1e40af' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#1e40af' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#1e40af' }}></div>
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
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Jobs</a>
            <a href="/applications" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>My Applications</a>
            <a href="/profile" style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#eff6ff', borderRadius: '6px' }}>Profile</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '2.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              My Profile
            </h1>
            {!isEditing && profile && (
              <button 
                onClick={() => setIsEditing(true)}
                style={{ padding: '0.625rem 1.25rem', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows="4"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Skills</label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    rows="3"
                    placeholder="e.g., JavaScript, React, Node.js"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Experience</label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    rows="4"
                    placeholder="Describe your work experience"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Education</label>
                  <textarea
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    rows="3"
                    placeholder="Your educational background"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    type="submit"
                    style={{ flex: 1, padding: '0.75rem', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9375rem' }}
                  >
                    Save Profile
                  </button>
                  {profile && (
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{ flex: 1, padding: '0.75rem', background: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9375rem' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          ) : profile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Full Name</h3>
                <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>{profile.fullName || 'Not provided'}</p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Email</h3>
                <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>{profile.email}</p>
              </div>

              {profile.phone && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Phone</h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>{profile.phone}</p>
                </div>
              )}

              {profile.location && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Location</h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>{profile.location}</p>
                </div>
              )}

              {profile.bio && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Bio</h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0, lineHeight: '1.6' }}>{profile.bio}</p>
                </div>
              )}

              {profile.skills && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Skills</h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0, lineHeight: '1.6' }}>{profile.skills}</p>
                </div>
              )}

              {profile.experience && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Experience</h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{profile.experience}</p>
                </div>
              )}

              {profile.education && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Education</h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{profile.education}</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>No profile found. Create your profile to get started!</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          h1 { font-size: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}

export default Profile;