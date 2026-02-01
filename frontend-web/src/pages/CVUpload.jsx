import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker (fixed version to avoid mismatch)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

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
      throw new Error(
        'Không thể đọc file PDF. Vui lòng thử:\n1. Chuyển sang file Word (.docx)\n2. Copy nội dung CV vào ô text\n3. Dùng file PDF khác'
      );
    }
  };

  const extractTextFromDOCX = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error('Error extracting DOCX:', error);
      throw new Error('Không thể đọc file DOCX.');
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setParsing(true);

    try {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      let extractedText = '';

      if (ext === 'pdf') extractedText = await extractTextFromPDF(selectedFile);
      else if (ext === 'docx') extractedText = await extractTextFromDOCX(selectedFile);
      else if (ext === 'txt') extractedText = await selectedFile.text();
      else {
        alert('Chỉ hỗ trợ .txt .pdf .docx');
        setParsing(false);
        return;
      }

      setCvText(extractedText.trim());
    } catch (err) {
      alert(err.message);
    }

    setParsing(false);
  };

  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      alert('Vui lòng nhập CV');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv_text: cvText })
      });

      const data = await response.json();
      setAnalysis(data);
    } catch {
      alert('Không thể phân tích CV');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const score = analysis?.overall_score || analysis?.score || 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem' }}>
        <h1>CareerMate</h1>
        <button onClick={handleLogout}>Đăng xuất</button>
      </div>

      <div style={{ maxWidth: '1100px', margin: 'auto', padding: '1rem' }}>
        <h2>Phân tích CV bằng AI</h2>

        {/* Upload */}
        <input type="file" accept=".txt,.pdf,.docx" onChange={handleFileChange} disabled={parsing} />

        <textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Dán CV..."
          style={{ width: '100%', minHeight: 200 }}
        />

        <button onClick={handleAnalyze} disabled={loading || parsing}>
          {loading ? 'Đang phân tích...' : 'Phân tích'}
        </button>

        {/* Result */}
        {analysis && (
          <div style={{ marginTop: 30 }}>
            <h3>Điểm: {score}/100</h3>

            <p>{analysis.analysis}</p>

            <h4>Strengths</h4>
            <ul>
              {analysis?.strengths?.map((s, i) => <li key={i}>{s}</li>) || <li>—</li>}
            </ul>

            <h4>Improvements</h4>
            <ul>
              {analysis?.improvements?.map((s, i) => <li key={i}>{s}</li>) || <li>—</li>}
            </ul>

            <h4>Skills</h4>
            <div>
              {analysis?.recommendedSkills?.map((s, i) => (
                <span key={i} style={{ marginRight: 8 }}>{s}</span>
              )) || '—'}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 767px) {
          h2 { font-size: 1.4rem }
        }
      `}</style>
    </div>
  );
}

export default CVUpload;
