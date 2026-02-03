import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RecruiterApplications() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch('/api/jobs/my-jobs', {
        headers: {
          'X-User-Email': userEmail
        }
      });
      const data = await response.json();
      setJobs(data);
      if (data.length > 0) {
        selectJob(data[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectJob = async (job) => {
    setSelectedJob(job);
    setSelectedApplication(null);
    try {
      const response = await fetch(`/api/jobs/${job.id}/applications`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/jobs/applications/${applicationId}/status?status=${status}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Update local state
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, status } : app
        ));
        setSelectedApplication({ ...selectedApplication, status });
        alert(`Đơn ứng tuyển đã được ${status === 'APPROVED' ? 'chấp nhận' : 'từ chối'} thành công!`);
      } else {
        const error = await response.json();
        alert(error.message || 'Không thể cập nhật trạng thái đơn ứng tuyển');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể cập nhật trạng thái đơn ứng tuyển');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>CareerMate Nhà tuyển dụng</h1>
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/recruiter/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Bảng điều khiển</a>
            <a href="/recruiter/applications" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Đơn ứng tuyển</a>
            <a href="/recruiter/analytics" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Phân tích</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Đăng xuất
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
            <a href="/recruiter/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Bảng điều khiển</a>
            <a href="/recruiter/applications" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#f0f9ff', borderRadius: '6px' }}>Đơn ứng tuyển</a>
            <a href="/recruiter/analytics" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Phân tích</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Đăng xuất</button>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '2rem' }}>
          Quản lý đơn ứng tuyển
        </h2>

        <div className="applications-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          {/* Jobs List */}
          <div>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Việc làm của bạn</h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Đang tải...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {jobs.map(job => (
                    <div
                      key={job.id}
                      onClick={() => selectJob(job)}
                      style={{
                        padding: '1rem',
                        background: selectedJob?.id === job.id ? '#dbeafe' : '#f8fafc',
                        border: selectedJob?.id === job.id ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                        {job.title}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{job.companyName}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Applications List & Detail */}
          <div className="applications-detail-grid" style={{ display: 'grid', gridTemplateColumns: selectedApplication ? '400px 1fr' : '1fr', gap: '2rem' }}>
            {/* Applications List */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
                Đơn ứng tuyển {selectedJob && `(${applications.length})`}
              </h3>
              {!selectedJob ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <div>Chọn một công việc để xem đơn ứng tuyển</div>
                </div>
              ) : applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                  <div>Chưa có đơn ứng tuyển nào</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto' }}>
                  {applications.map(app => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApplication(app)}
                      style={{
                        padding: '1rem',
                        background: selectedApplication?.id === app.id ? '#dbeafe' : 'white',
                        border: selectedApplication?.id === app.id ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.95rem' }}>
                          {app.candidateEmail}
                        </div>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: app.status === 'PENDING' ? '#fef3c7' : app.status === 'APPROVED' ? '#d1fae5' : '#fee2e2',
                          color: app.status === 'PENDING' ? '#92400e' : app.status === 'APPROVED' ? '#065f46' : '#991b1b',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {app.status === 'PENDING' ? 'Chờ duyệt' : app.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
                        </span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        Ứng tuyển: {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
                      </div>
                      {app.cvFileName && (
                        <div style={{ color: '#0ea5e9', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          📄 {app.cvFileName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Application Detail */}
            {selectedApplication && (
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2rem', maxHeight: '700px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                      {selectedApplication.candidateEmail}
                    </h3>
                    <div style={{ color: '#64748b' }}>
                      Ứng tuyển vào {new Date(selectedApplication.appliedAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.5rem' }}
                  >
                    ×
                  </button>
                </div>

                {/* Cover Letter */}
                {selectedApplication.coverLetter && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.75rem' }}>
                      Thư xin việc
                    </h4>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', lineHeight: '1.7' }}>
                      {selectedApplication.coverLetter}
                    </div>
                  </div>
                )}

                {/* CV Content */}
                {selectedApplication.cvContent && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.75rem' }}>
                      Nội dung CV
                      {selectedApplication.cvFileName && (
                        <span style={{ color: '#64748b', fontWeight: '400', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                          ({selectedApplication.cvFileName})
                        </span>
                      )}
                    </h4>
                    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {selectedApplication.cvContent}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedApplication.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication.id, 'APPROVED')}
                      style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}
                    >
                      Chấp nhận
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication.id, 'REJECTED')}
                      style={{ flex: 1, padding: '1rem', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}
                    >
                      Từ chối
                    </button>
                  </div>
                )}
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
          
          /* Single column layout on mobile */
          .applications-grid {
            grid-template-columns: 1fr !important;
          }
          
          /* Applications detail also single column on mobile */
          .applications-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default RecruiterApplications;
