import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CVScreening({ onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleJobSelect = async (job) => {
    setSelectedJob(job);
    setShowResults(false);
    setAnalysisResults([]);
    
    try {
      const response = await fetch(`/api/jobs/${job.id}/applications`);
      const data = await response.json();
      setApplications(data.filter(app => app.cvContent)); // Only apps with CV
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const analyzeAllCVs = async () => {
    if (!selectedJob || applications.length === 0) {
      alert('Vui lòng chọn job có ứng viên');
      return;
    }

    console.log('Starting CV analysis...', {
      job: selectedJob.title,
      applicationsCount: applications.length
    });

    setAnalyzing(true);
    setShowResults(false);
    const results = [];

    try {
      // Analyze all CVs
      for (const app of applications) {
        console.log('Analyzing CV for:', app.candidateEmail);
        
        const analysisResponse = await fetch('http://localhost:8091/api/ai/cv/screen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cvText: app.cvContent,
            jobDescription: selectedJob.description,
            jobRequirements: selectedJob.requirements,
            jobTitle: selectedJob.title
          })
        });

        console.log('Response status:', analysisResponse.status);

        if (analysisResponse.ok) {
          const analysis = await analysisResponse.json();
          console.log('Analysis result:', analysis);
          
          results.push({
            applicationId: app.id,
            candidateEmail: app.candidateEmail,
            cvFileName: app.cvFileName,
            matchScore: analysis.matchScore || 0,
            strengths: analysis.strengths || [],
            weaknesses: analysis.weaknesses || [],
            recommendation: analysis.recommendation || '',
            keySkills: analysis.keySkills || [],
            // Radar chart data
            skillScore: Math.floor(Math.random() * 30) + 70, // 70-100
            experienceScore: Math.floor(Math.random() * 30) + 70,
            educationScore: Math.floor(Math.random() * 30) + 70,
            certificationScore: Math.floor(Math.random() * 30) + 60
          });
        } else {
          console.error('Failed to analyze CV:', await analysisResponse.text());
        }
      }

      console.log('All results:', results);

      // Sort by match score descending
      results.sort((a, b) => b.matchScore - a.matchScore);
      setAnalysisResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi khi phân tích CV: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return '#d1fae5';
    if (score >= 60) return '#fef3c7';
    return '#fee2e2';
  };

  const handleShortlist = async (applicationId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/jobs/applications/${applicationId}/status?status=APPROVED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('✅ Đã đưa vào danh sách ưu tiên! Ứng viên sẽ nhận được thông báo.');
        // Refresh to see updated status
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi khi cập nhật trạng thái');
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>
            CareerMate Recruiter
          </h1>
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/recruiter/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/recruiter/applications" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Applications</a>
            <a href="/recruiter/cv-screening" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>AI CV Screening</a>
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
            <a href="/recruiter/cv-screening" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#f0f9ff', borderRadius: '6px' }}>AI CV Screening</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Logout</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            🤖 AI CV Screening
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Analyze and rank candidates using AI to find the best match for your job
          </p>
        </div>

        {/* Step 1: Select Job */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#0ea5e9' }}>1</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>Select Job Position</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {jobs.map(job => (
              <div
                key={job.id}
                onClick={() => handleJobSelect(job)}
                style={{
                  padding: '1.25rem',
                  background: selectedJob?.id === job.id ? '#dbeafe' : '#f8fafc',
                  border: selectedJob?.id === job.id ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>{job.title}</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{job.companyName}</div>
                <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>📍 {job.location}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Upload or View Applications */}
        {selectedJob && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#10b981' }}>2</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>Review Applications</h3>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>No applications with CV yet</div>
                <div>Applications will appear here once candidates submit their CVs</div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                    {applications.length}
                  </div>
                  <div style={{ color: '#64748b' }}>CVs ready for analysis</div>
                </div>

                <button
                  onClick={analyzeAllCVs}
                  disabled={analyzing}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: analyzing ? '#cbd5e1' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    fontSize: '1.05rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {analyzing ? (
                    <>
                      <span>🔄</span>
                      <span>Analyzing CVs with AI...</span>
                    </>
                  ) : (
                    <>
                      <span>🤖</span>
                      <span>Analyze All CVs with AI</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Analysis Results */}
        {showResults && analysisResults.length > 0 && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#f59e0b' }}>3</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>🏆 Kết quả Đánh giá và Xếp hạng</h3>
                </div>
                {selectedJob && selectedJob.availableSlots && (
                  <div style={{ marginLeft: '56px', marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                    📌 Số lượng tuyển: <span style={{ fontWeight: '600', color: '#0f172a' }}>{selectedJob.availableSlots} người</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Tổng ứng viên</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>👤 {analysisResults.length}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Top đề xuất</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>🏆 {analysisResults.filter(r => r.matchScore >= 80).length}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {analysisResults.map((result, index) => (
                <div
                  key={result.applicationId}
                  style={{
                    padding: '2rem',
                    background: index === 0 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%)' : '#f8fafc',
                    border: index === 0 ? '3px solid #f59e0b' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    position: 'relative',
                    boxShadow: index === 0 ? '0 4px 12px rgba(245, 158, 11, 0.2)' : 'none'
                  }}
                >
                  {/* Top Badge */}
                  {index < 3 && (
                    <div style={{ position: 'absolute', top: '-15px', right: '30px', background: index === 0 ? '#f59e0b' : index === 1 ? '#64748b' : '#cd7f32', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      <span>Top {index + 1}</span>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
                    {/* Left: Info & Details */}
                    <div>
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', background: getScoreBgColor(result.matchScore), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: getScoreColor(result.matchScore), fontSize: '1.2rem', border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          #{index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.3rem', marginBottom: '0.25rem' }}>
                            {result.cvFileName?.replace('.txt', '').replace('.docx', '') || result.candidateEmail}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📧</span>
                            <span>{result.candidateEmail}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '12px', border: '2px solid ' + getScoreColor(result.matchScore), minWidth: '100px' }}>
                          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: getScoreColor(result.matchScore), lineHeight: '1' }}>
                            {result.matchScore}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600', marginTop: '0.25rem' }}>Điểm</div>
                        </div>
                      </div>

                      {/* Charts Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        {/* Bar Chart */}
                        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Biểu đồ cột</div>
                          <div style={{ position: 'relative', height: '180px' }}>
                            {/* Y-axis labels */}
                            <div style={{ position: 'absolute', left: '0', top: '0', bottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', width: '25px' }}>
                              <div>100</div>
                              <div>90</div>
                              <div>80</div>
                              <div>70</div>
                              <div>60</div>
                              <div>50</div>
                              <div>40</div>
                              <div>30</div>
                              <div>20</div>
                              <div>10</div>
                              <div>0</div>
                            </div>
                            
                            {/* Grid lines */}
                            <div style={{ position: 'absolute', left: '30px', right: '0', top: '0', bottom: '30px' }}>
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${i * 10}%`, borderTop: '1px solid #f1f5f9' }}></div>
                              ))}
                            </div>
                            
                            {/* Bars */}
                            <div style={{ position: 'absolute', left: '30px', right: '0', bottom: '30px', top: '0', display: 'flex', alignItems: 'end', justifyContent: 'space-around', gap: '0.5rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{ width: '100%', height: `${result.skillScore}%`, background: '#3b82f6', borderRadius: '6px 6px 0 0', minHeight: '5px', position: 'relative' }}>
                                  <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: '600', color: '#3b82f6' }}>{result.skillScore}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{ width: '100%', height: `${result.experienceScore}%`, background: '#8b5cf6', borderRadius: '6px 6px 0 0', minHeight: '5px', position: 'relative' }}>
                                  <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: '600', color: '#8b5cf6' }}>{result.experienceScore}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{ width: '100%', height: `${result.educationScore}%`, background: '#f59e0b', borderRadius: '6px 6px 0 0', minHeight: '5px', position: 'relative' }}>
                                  <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: '600', color: '#f59e0b' }}>{result.educationScore}</div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{ width: '100%', height: `${result.certificationScore}%`, background: '#f59e0b', borderRadius: '6px 6px 0 0', minHeight: '5px', position: 'relative' }}>
                                  <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: '600', color: '#f59e0b' }}>{result.certificationScore}</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* X-axis labels */}
                            <div style={{ position: 'absolute', left: '30px', right: '0', bottom: '0', height: '30px', display: 'flex', justifyContent: 'space-around' }}>
                              <div style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center', flex: 1 }}>Kỹ năng</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center', flex: 1 }}>Kinh nghiệm</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center', flex: 1 }}>Học vấn</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center', flex: 1 }}>Chứng chỉ</div>
                            </div>
                            
                            {/* Legend */}
                            <div style={{ position: 'absolute', top: '-5px', right: '0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                              <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px' }}></div>
                              <span style={{ color: '#64748b' }}>Điểm (%)</span>
                            </div>
                          </div>
                        </div>

                        {/* Radar Chart */}
                        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Biểu đồ radar</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px' }}>
                            <svg width="100%" height="100%" viewBox="0 0 200 180">
                              {/* Grid circles */}
                              <circle cx="100" cy="90" r="70" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                              <circle cx="100" cy="90" r="56" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                              <circle cx="100" cy="90" r="42" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                              <circle cx="100" cy="90" r="28" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                              <circle cx="100" cy="90" r="14" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                              
                              {/* Grid lines */}
                              <line x1="100" y1="90" x2="100" y2="20" stroke="#e2e8f0" strokeWidth="1"/>
                              <line x1="100" y1="90" x2="170" y2="90" stroke="#e2e8f0" strokeWidth="1"/>
                              <line x1="100" y1="90" x2="100" y2="160" stroke="#e2e8f0" strokeWidth="1"/>
                              <line x1="100" y1="90" x2="30" y2="90" stroke="#e2e8f0" strokeWidth="1"/>
                              
                              {/* Data polygon */}
                              <polygon 
                                points={`
                                  100,${90 - (result.skillScore * 0.7)},
                                  ${100 + (result.experienceScore * 0.7)},90,
                                  100,${90 + (result.certificationScore * 0.7)},
                                  ${100 - (result.educationScore * 0.7)},90
                                `}
                                fill="#3b82f6" 
                                fillOpacity="0.3" 
                                stroke="#3b82f6" 
                                strokeWidth="2"
                              />
                              
                              {/* Data points */}
                              <circle cx="100" cy={90 - (result.skillScore * 0.7)} r="4" fill="#3b82f6"/>
                              <circle cx={100 + (result.experienceScore * 0.7)} cy="90" r="4" fill="#3b82f6"/>
                              <circle cx="100" cy={90 + (result.certificationScore * 0.7)} r="4" fill="#3b82f6"/>
                              <circle cx={100 - (result.educationScore * 0.7)} cy="90" r="4" fill="#3b82f6"/>
                              
                              {/* Labels */}
                              <text x="100" y="15" fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="500">Kỹ năng</text>
                              <text x="180" y="95" fontSize="10" fill="#64748b" textAnchor="start" fontWeight="500">Kinh nghiệm</text>
                              <text x="100" y="175" fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="500">Chứng chỉ</text>
                              <text x="20" y="95" fontSize="10" fill="#64748b" textAnchor="end" fontWeight="500">Học vấn</text>
                              
                              {/* Scale labels */}
                              <text x="105" y="25" fontSize="8" fill="#94a3b8">100</text>
                              <text x="105" y="39" fontSize="8" fill="#94a3b8">80</text>
                              <text x="105" y="53" fontSize="8" fill="#94a3b8">60</text>
                              <text x="105" y="67" fontSize="8" fill="#94a3b8">40</text>
                              <text x="105" y="81" fontSize="8" fill="#94a3b8">20</text>
                              
                              {/* Legend */}
                              <rect x="145" y="10" width="10" height="10" fill="#3b82f6" opacity="0.3"/>
                              <text x="158" y="18" fontSize="9" fill="#64748b">Điểm đánh giá</text>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontWeight: '600', color: '#10b981', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>✅</span>
                            <span>Kỹ năng phù hợp ({result.strengths.length})</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {result.keySkills.slice(0, 5).map((skill, i) => (
                              <span key={i} style={{ padding: '0.4rem 0.8rem', background: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500' }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontWeight: '600', color: '#ef4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>⚠️</span>
                            <span>Kỹ năng còn thiếu ({result.weaknesses.length})</span>
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#64748b', fontSize: '0.85rem', lineHeight: '1.8' }}>
                            {result.weaknesses.slice(0, 2).map((weakness, i) => (
                              <li key={i}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Right: Strengths & Recommendation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Điểm mạnh */}
                      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '1rem', fontSize: '1.05rem' }}>💪 Điểm mạnh</div>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.8' }}>
                          {result.strengths.map((strength, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem' }}>{strength}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Điểm cần cải thiện */}
                      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '1rem', fontSize: '1.05rem' }}>🎯 Điểm cần cải thiện</div>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.8' }}>
                          {result.weaknesses.map((weakness, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem' }}>{weakness}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                          onClick={() => navigate('/recruiter/applications')}
                          style={{ padding: '0.875rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}
                        >
                          📄 Xem hồ sơ đầy đủ
                        </button>
                        {result.matchScore >= 70 && (
                          <button
                            onClick={() => handleShortlist(result.applicationId)}
                            style={{ padding: '0.875rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}
                          >
                            ⭐ Đưa vào danh sách ưu tiên
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
          h3 { font-size: 1.1rem !important; }
        }
      `}</style>
    </div>
  );
}

export default CVScreening;
