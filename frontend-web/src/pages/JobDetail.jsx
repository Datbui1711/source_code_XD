import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JobDetail() {
  const { id } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}`);
      const data = await response.json();
      setJob(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      
      // Only read text files in browser, .docx will be read on server
      if (file.name.toLowerCase().endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCvText(event.target.result);
        };
        reader.readAsText(file);
      } else {
        // For .docx, just note that file is selected
        setCvText(''); // Clear text area when docx is selected
      }
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const token = localStorage.getItem('accessToken');
      const email = localStorage.getItem('userEmail') || 'candidate1@test.com';
      
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      formData.append('candidateEmail', email);
      if (cvFile) {
        formData.append('cvFile', cvFile);
      }
      formData.append('cvText', cvText);
      
      const response = await fetch(`/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        setShowApplyModal(false);
        setCoverLetter('');
        setCvFile(null);
        setCvText('');
      } else {
        let errorMessage = 'Failed to submit application. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          const errorText = await response.text();
          if (errorText.includes('already applied')) {
            errorMessage = 'You have already applied for this job!';
          }
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#0ea5e9', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ color: '#64748b' }}>Loading job details...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <div style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Job not found</div>
          <button onClick={() => navigate('/jobs')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>CareerMate</h1>
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Jobs</a>
            <button onClick={() => navigate('/jobs')} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              ← Back
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
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#f0f9ff', borderRadius: '6px' }}>Jobs</a>
            <button onClick={() => navigate('/jobs')} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>← Back</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
        {/* Job Header */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
                {job.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem', color: '#0ea5e9', fontWeight: '600' }}>
                  {job.companyName}
                </span>
                <span style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></span>
                <span style={{ color: '#64748b' }}>Posted recently</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <span>📍</span>
                  <span style={{ color: '#475569', fontWeight: '500' }}>{job.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <span>💰</span>
                  <span style={{ color: '#475569', fontWeight: '500' }}>{job.salaryRange}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <span>⏰</span>
                  <span style={{ color: '#475569', fontWeight: '500' }}>{job.employmentType}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <span>📊</span>
                  <span style={{ color: '#475569', fontWeight: '500' }}>{job.experienceRequired}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowApplyModal(true)}
              style={{ padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1.05rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', whiteSpace: 'nowrap' }}
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Job Description */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem' }}>
            About the Role
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '2rem' }}>
            {job.description}
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
            Requirements
          </h3>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            {job.requirements}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {job.requirements.split(',').map((skill, idx) => (
              <span key={idx} style={{ background: '#dbeafe', color: '#0369a1', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem' }}>
            About {job.companyName}
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.05rem' }}>
            {job.companyName} is a leading company in the tech industry, committed to innovation and excellence. 
            We offer a dynamic work environment, competitive compensation, and opportunities for professional growth.
          </p>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowApplyModal(false)}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
              Apply for {job.title}
            </h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              at {job.companyName}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#0f172a', fontWeight: '600', marginBottom: '0.75rem' }}>
                Upload Your CV *
              </label>
              <div style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '2rem', textAlign: 'center', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#0ea5e9'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>
                <input
                  type="file"
                  accept=".txt,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📄</div>
                  {cvFile ? (
                    <div>
                      <div style={{ color: '#0ea5e9', fontWeight: '600', marginBottom: '0.25rem' }}>{cvFile.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Click to change file</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '0.25rem' }}>Click to upload your CV</div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Supports TXT and DOCX files</div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#0f172a', fontWeight: '600', marginBottom: '0.75rem' }}>
                Or Paste Your CV Text
              </label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV content here..."
                style={{ width: '100%', minHeight: '120px', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#0f172a', fontWeight: '600', marginBottom: '0.75rem' }}>
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're a great fit for this role..."
                style={{ width: '100%', minHeight: '100px', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowApplyModal(false)}
                style={{ flex: 1, padding: '1rem', background: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying || (!cvFile && !cvText)}
                style={{ flex: 1, padding: '1rem', background: (applying || (!cvFile && !cvText)) ? '#cbd5e1' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: (applying || (!cvFile && !cvText)) ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '1rem' }}
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          h1 { font-size: 1.75rem !important; }
          h2 { font-size: 1.25rem !important; }
        }
      `}</style>
    </div>
  );
}

export default JobDetail;
