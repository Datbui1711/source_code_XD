import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostJob({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    location: '',
    salaryRange: '',
    employmentType: 'Full-time',
    experienceRequired: '',
    requirements: '',
    availableSlots: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      const userEmail = localStorage.getItem('userEmail');

      const jobData = {
        ...formData,
        recruiterEmail: userEmail,
        isActive: true
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        alert('Job posted successfully!');
        navigate('/recruiter/dashboard');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setSubmitting(false);
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
            <a href="/recruiter/analytics" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Analytics</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Logout
            </button>
          </div>
          <button className="nav-mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', flexDirection: 'column', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#0ea5e9' }}></div>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="nav-mobile" style={{ display: 'none', flexDirection: 'column', gap: '0.5rem', padding: '1rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
            <a href="/recruiter/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Dashboard</a>
            <a href="/recruiter/applications" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Applications</a>
            <a href="/recruiter/analytics" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Analytics</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Logout</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Post New Job
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Fill in the details to create a new job posting
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0' }}>
          {/* Job Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Senior Full Stack Developer"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
            />
          </div>

          {/* Company Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="e.g. Tech Corp"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
            />
          </div>

          {/* Location & Employment Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Ho Chi Minh City"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                Employment Type *
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Salary & Experience */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                Salary Range *
              </label>
              <input
                type="text"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                required
                placeholder="e.g. $2000-$3000"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                Experience Required *
              </label>
              <input
                type="text"
                name="experienceRequired"
                value={formData.experienceRequired}
                onChange={handleChange}
                required
                placeholder="e.g. 3-5 years"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
          </div>

          {/* Available Slots */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
              Số lượng tuyển dụng (Slots) *
            </label>
            <input
              type="number"
              name="availableSlots"
              value={formData.availableSlots}
              onChange={handleChange}
              required
              min="1"
              max="100"
              placeholder="e.g. 3"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }}
            />
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
              💡 Số lượng ứng viên cần tuyển. Khi đủ số lượng, các ứng viên còn lại sẽ tự động bị từ chối.
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          {/* Requirements */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
              Requirements *
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows="4"
              placeholder="List required skills, qualifications, and experience (comma-separated)"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1,
                padding: '1rem',
                background: submitting ? '#cbd5e1' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              {submitting ? 'Posting...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/recruiter/dashboard')}
              style={{
                padding: '1rem 2rem',
                background: 'white',
                color: '#64748b',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
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

export default PostJob;
