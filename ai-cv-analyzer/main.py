from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from pathlib import Path
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from pydantic import BaseModel

load_dotenv()

from services.document_parser import DocumentParser
from services.llm_service import LLMService
from services.scoring_service import ScoringService
from database.db import Database
from models.schemas import CVAnalysisResponse

db = Database()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.init_db()
    yield

app = FastAPI(title="CareerMate AI CV Analyzer", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

parser = DocumentParser()
llm_service = LLMService()
scoring_service = ScoringService(db)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/api/ai/upload-jd")
async def upload_jd(text: str = Form(...), industry: str = Form(...)):
    """Upload Job Description"""
    if not text or not text.strip():
        raise HTTPException(400, "JD content is required")
    
    jd_id = await db.save_jd(text.strip(), industry)
    return {"jd_id": jd_id, "message": "JD uploaded successfully"}

@app.post("/api/ai/analyze-cvs", response_model=List[CVAnalysisResponse])
async def analyze_cvs(jd_id: int = Form(...), files: List[UploadFile] = File(...)):
    """Analyze multiple CVs against a JD"""
    results = []
    
    jd = await db.get_jd(jd_id)
    if not jd:
        raise HTTPException(404, "JD not found")
    
    criteria = await db.get_criteria(jd["industry"])
    
    for file in files:
        cv_content = await parser.parse_file(file)
        cv_data = await llm_service.extract_cv_info(cv_content)
        jd_data = await llm_service.extract_jd_requirements(jd["content"])
        
        score_result = await scoring_service.calculate_score(cv_data, jd_data, criteria)
        
        cv_id = await db.save_cv_analysis(jd_id, file.filename, cv_content, cv_data, score_result)
        
        results.append({
            "cv_id": cv_id,
            "filename": file.filename,
            "overall_score": score_result["overall_score"],
            "category_scores": score_result["category_scores"],
            "matched_skills": score_result["matched_skills"],
            "missing_skills": score_result["missing_skills"],
            "strengths": score_result["strengths"],
            "weaknesses": score_result["weaknesses"]
        })
    
    results.sort(key=lambda x: x["overall_score"], reverse=True)
    return results

@app.get("/api/ai/rankings/{jd_id}")
async def get_rankings(jd_id: int):
    """Get ranked CVs for a JD"""
    rankings = await db.get_cv_rankings(jd_id)
    return rankings

@app.get("/api/ai/industries")
async def get_industries():
    """Get all industries"""
    industries = await db.get_all_industries()
    return industries

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat with AI assistant for recruitment"""
    response = llm_service.client.chat.completions.create(
        model=llm_service.model,
        messages=[
            {"role": "system", "content": "You are an AI recruitment assistant. Help recruiters with CV analysis, job descriptions, and hiring advice."},
            *[{"role": m["role"], "content": m["content"]} for m in request.history[-5:]],
            {"role": "user", "content": request.message}
        ],
        temperature=0.7,
        max_tokens=500
    )
    
    return {"response": response.choices[0].message.content}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
