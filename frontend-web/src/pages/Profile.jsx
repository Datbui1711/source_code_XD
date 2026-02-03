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
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Bảng điều khiển</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Việc làm</a>
            <a href="/applications" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Đơn ứng tuyển</a>
            <a href="/profile" style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Hồ sơ</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Đăng xuất
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
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Bảng điều khiển</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Việc làm</a>
            <a href="/applications" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Đơn ứng tuyển</a>
            <a href="/profile" style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#eff6ff', borderRadius: '6px' }}>Hồ sơ</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>
              Đăng xuất
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid #e2e8f0', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#0f172a', margin: 0, background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Hồ sơ của tôi
            </h1>
            {!isEditing && profile && (
              <button 
                onClick={() => setIsEditing(true)}
                style={{ padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)' }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Chỉnh sửa hồ sơ
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Họ và tên</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', transition: 'all 0.3s ease' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', transition: 'all 0.3s ease' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Địa chỉ</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', transition: 'all 0.3s ease' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Giới thiệu bản thân</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows="4"
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', transition: 'all 0.3s ease' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Kỹ năng</label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    rows="3"
                    placeholder="vd: JavaScript, React, Node.js"
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', transition: 'all 0.3s ease' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Kinh nghiệm làm việc</label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    rows="4"
                    placeholder="Describe your work experience"
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', transition: 'all 0.3s ease' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Học vấn</label>
                  <textarea
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    rows="3"
                    placeholder="Your educational background"
                    style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', transition: 'all 0.3s ease' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    type="submit"
                    style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9375rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)' }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    Lưu hồ sơ
                  </button>
                  {profile && (
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{ flex: 1, padding: '0.75rem', background: 'white', color: '#64748b', border: '2px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9375rem', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.borderColor = '#94a3b8';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      Hủy bỏ
                    </button>
                  )}
                </div>
              </div>
            </form>
          ) : profile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Full Name
                </h3>
                <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>{profile.fullName || 'Not provided'}</p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email
                </h3>
                <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>{profile.email}</p>
              </div>

              {profile.phone && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Phone
                  </h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>{profile.phone}</p>
                </div>
              )}

              {profile.location && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Location
                  </h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>{profile.location}</p>
                </div>
              )}

              {profile.bio && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    Bio
                  </h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0, lineHeight: '1.6' }}>{profile.bio}</p>
                </div>
              )}

              {profile.skills && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                    Skills
                  </h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0, lineHeight: '1.6' }}>{profile.skills}</p>
                </div>
              )}

              {profile.experience && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    Experience
                  </h3>
                  <p style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{profile.experience}</p>
                </div>
              )}

              {profile.education && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                    Education
                  </h3>
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
        /* Desktop navigation visible by default */
        .nav-desktop {
          display: flex !important;
        }
        
        .nav-mobile {
          display: none !important;
        }
        
        @media (max-width: 767px) {
          /* Hide desktop nav on mobile */
          .nav-desktop {
            display: none !important;
          }
          
          /* Show mobile hamburger and menu */
          .nav-mobile {
            display: flex !important;
          }
          
          /* Reduce padding on mobile */
          div[style*="padding: 2.5rem 2rem"] {
            padding: 1.5rem 1rem !important;
          }
          
          /* Smaller headings on mobile */
          h2[style*="fontSize: '2rem'"] {
            font-size: 1.5rem !important;
          }
          
          h3[style*="fontSize: '1.25rem'"] {
            font-size: 1.1rem !important;
          }
          
          /* Adjust stats card font size */
          div[style*="fontSize: '2.25rem'"] {
            font-size: 1.75rem !important;
          }
        }
        
        /* Smooth transitions for all interactive elements */
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
        
        button:active {
          transform: translateY(0);
        }
        
        /* Card hover effects */
        div[style*="background: 'white'"][style*="border"]:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* SVG icon hover effects */
        h3:hover svg {
          transform: scale(1.2) rotate(10deg);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          stroke: #1e40af;
        }
        
        /* Profile section hover effects */
        div[style*="display: flex"][style*="flexDirection: column"] > div:hover {
          transform: translateX(4px);
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 1rem;
          border-radius: 8px;
          margin: 0 -1rem;
        }
        
        /* Input focus effects */
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          transform: scale(1.02);
        }
        
        /* Form animations */
        form > div {
          animation: slideInUp 0.6s ease-out;
        }
        
        form > div:nth-child(1) { animation-delay: 0.1s; }
        form > div:nth-child(2) { animation-delay: 0.2s; }
        form > div:nth-child(3) { animation-delay: 0.3s; }
        form > div:nth-child(4) { animation-delay: 0.4s; }
        form > div:nth-child(5) { animation-delay: 0.5s; }
        form > div:nth-child(6) { animation-delay: 0.6s; }
        form > div:nth-child(7) { animation-delay: 0.7s; }
        form > div:nth-child(8) { animation-delay: 0.8s; }
        
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
        
        /* Page load animation */
        body {
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Loading spinner for buttons */
        .loading {
          position: relative;
          pointer-events: none;
        }
        
        .loading::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          margin: auto;
          border: 2px solid transparent;
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Pulse animation for important elements */
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
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

export default Profile;