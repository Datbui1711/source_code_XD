# CareerMate AI CV Analyzer

AI-powered CV analysis service for CareerMate platform using Groq AI (Llama 3.3).

## Features
- Parse PDF/DOCX CV files
- Extract structured information using LLM
- Calculate matching scores with weighted criteria
- Skill synonyms and fuzzy matching
- Support multiple industries

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file:
```
GROQ_API_KEY=your_groq_api_key_here
```

3. Run the service:
```bash
python main.py
```

Service will run on http://localhost:8000

## API Endpoints

- `POST /api/ai/upload-jd` - Upload job description
- `POST /api/ai/analyze-cvs` - Analyze CVs against JD
- `GET /api/ai/rankings/{jd_id}` - Get ranked CVs
- `GET /api/ai/industries` - Get all industries
- `POST /api/ai/chat` - Chat with AI assistant

## Get Groq API Key

1. Go to https://console.groq.com
2. Sign up for free account
3. Create API key
4. Copy to `.env` file
