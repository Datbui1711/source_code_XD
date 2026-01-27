from pydantic import BaseModel
from typing import List, Dict

class CVAnalysisResponse(BaseModel):
    cv_id: int
    filename: str
    overall_score: float
    category_scores: Dict[str, float]
    matched_skills: List[str]
    missing_skills: List[str]
    strengths: List[str]
    weaknesses: List[str]

class CVData(BaseModel):
    skills: List[str]
    experience_years: float
    education: List[str]
    certifications: List[str]
    job_titles: List[str]

class JDData(BaseModel):
    required_skills: List[str]
    preferred_skills: List[str]
    min_experience: float
    required_education: List[str]
    required_certifications: List[str]
