from fastapi import UploadFile
import PyPDF2
from docx import Document
import io

class DocumentParser:
    async def parse_file(self, file: UploadFile) -> str:
        """Parse PDF or DOCX file to text"""
        content = await file.read()
        
        if file.filename.endswith('.pdf'):
            return self._parse_pdf(content)
        elif file.filename.endswith('.docx'):
            return self._parse_docx(content)
        else:
            raise ValueError("Unsupported file format. Only PDF and DOCX are supported.")
    
    def _parse_pdf(self, content: bytes) -> str:
        pdf_file = io.BytesIO(content)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    
    def _parse_docx(self, content: bytes) -> str:
        doc_file = io.BytesIO(content)
        doc = Document(doc_file)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
