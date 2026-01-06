import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function CVUpload() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const navigate = useNavigate();

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return fullText;
    } catch (error) {
      console.error('Error extracting PDF:', error);
      throw new Error('Không thể đọc file PDF. Vui lòng thử file khác.');
    }
  };

  const extractTextFromDOCX = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('Error extracting DOCX:', error);
      throw new Error('Không thể đọc file DOCX. Vui lòng thử file khác.');
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setParsing(true);

    try {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      let extractedText = '';

      if (fileExtension === 'pdf') {
        extractedText = await extractTextFromPDF(selectedFile);
      } else if (fileExtension === 'docx') {
        extractedText = await extractTextFromDOCX(selectedFile);
      } else if (fileExtension === 'txt') {
        // Read as text for .txt files
        extractedText = await selectedFile.text();
      } else {
        alert('Định dạng file không được hỗ trợ. Vui lòng chọn file .txt, .pdf hoặc .docx');
        setFile(null);
        setParsing(false);
        return;
      }

      setCvText(extractedText.trim());
      setParsing(false);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert(error.message || 'Không thể đọc file. Vui lòng thử lại.');
      setFile(null);
      setParsing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      alert('Vui lòng upload file CV hoặc dán nội dung CV');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8091/api/ai/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText })
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể phân tích CV. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>
            CareerMate
          </h1>
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Jobs</a>
            <a href="/cv-upload" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Phân tích CV</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Đăng xuất
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
            <a href="/jobs" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem' }}>Jobs</a>
            <a href="/cv-upload" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', background: '#f0f9ff', borderRadius: '6px' }}>Phân tích CV</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>Đăng xuất</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Phân tích CV bằng AI 📄
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Upload CV của bạn và nhận phản hồi ngay lập tức từ AI
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: analysis ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          {/* Upload Section */}
          <div>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1.5rem' }}>
                Upload CV của bạn
              </h3>
              
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', marginBottom: '1.5rem', background: '#f8fafc' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {parsing ? '⏳' : '📄'}
                </div>
                <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {parsing ? 'Đang đọc file...' : file ? file.name : 'Kéo thả CV vào đây hoặc click để chọn'}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Hỗ trợ file .txt, .pdf, .docx
                </div>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="cv-upload"
                  disabled={parsing}
                />
                <label htmlFor="cv-upload" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: parsing ? '#cbd5e1' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white', borderRadius: '8px', cursor: parsing ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                  {parsing ? 'Đang xử lý...' : 'Chọn File'}
                </label>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Hoặc dán nội dung CV:
                </div>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Dán nội dung CV vào đây..."
                  disabled={parsing}
                  style={{ width: '100%', minHeight: '200px', padding: '1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'monospace', resize: 'vertical', background: parsing ? '#f1f5f9' : 'white' }}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || parsing || !cvText.trim()}
                style={{ width: '100%', padding: '1rem', background: (loading || parsing || !cvText.trim()) ? '#cbd5e1' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: (loading || parsing || !cvText.trim()) ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '1rem', transition: 'all 0.2s' }}
              >
                {loading ? '🔍 Đang phân tích...' : parsing ? '⏳ Đang đọc file...' : '🤖 Phân tích CV với AI'}
              </button>
            </div>

            {/* Tips */}
            <div style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ color: '#0369a1', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                💡 Mẹo để có kết quả phân tích tốt hơn:
              </div>
              <ul style={{ color: '#0c4a6e', fontSize: '0.9rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                <li>Bao gồm các phần rõ ràng (Kinh nghiệm, Học vấn, Kỹ năng)</li>
                <li>Sử dụng động từ hành động và thành tích có thể đo lường</li>
                <li>Giữ định dạng đơn giản và nhất quán</li>
                <li>Làm nổi bật các kỹ năng kỹ thuật liên quan</li>
                <li>File PDF và DOCX sẽ được tự động chuyển đổi sang text</li>
              </ul>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div>
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1.5rem' }}>
                  Kết quả phân tích
                </h3>

                {/* Score */}
                <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <div style={{ color: '#065f46', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Điểm tổng thể
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '700', color: '#047857' }}>
                    {analysis.score}/100
                  </div>
                  <div style={{ color: '#059669', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {analysis.score >= 80 ? 'Xuất sắc!' : analysis.score >= 70 ? 'Tốt!' : 'Cần cải thiện'}
                  </div>
                </div>

                {/* AI Analysis */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                    Phản hồi từ AI:
                  </div>
                  <div style={{ color: '#475569', lineHeight: '1.7', fontSize: '0.95rem', whiteSpace: 'pre-wrap', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    {analysis.analysis}
                  </div>
                </div>

                {/* Strengths */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                    ✅ Điểm mạnh:
                  </div>
                  <ul style={{ color: '#475569', lineHeight: '1.8', fontSize: '0.95rem', paddingLeft: '1.5rem' }}>
                    {analysis.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                    🎯 Cần cải thiện:
                  </div>
                  <ul style={{ color: '#475569', lineHeight: '1.8', fontSize: '0.95rem', paddingLeft: '1.5rem' }}>
                    {analysis.improvements.map((improvement, idx) => (
                      <li key={idx}>{improvement}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Skills */}
                <div>
                  <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                    📚 Kỹ năng nên bổ sung:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {analysis.recommendedSkills.map((skill, idx) => (
                      <span key={idx} style={{ background: '#dbeafe', color: '#0369a1', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CVUpload;

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          h2 { font-size: 1.5rem !important; }
        }
      `}</style>