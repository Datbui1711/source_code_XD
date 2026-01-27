import os
import json
from groq import Groq

class LLMService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY", "")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"
    
    async def extract_cv_info(self, cv_text: str):
        """Extract structured info from CV using Groq AI"""
        prompt = f"""You are an expert CV analyzer. Read the CV CAREFULLY and extract ALL information.

IMPORTANT:
- Read EVERY LINE and SECTION of the CV
- Extract ALL skills (programming languages, frameworks, databases, tools, DevOps, soft skills...)
- Calculate accurate years of experience from work timeline
- List all education and certifications

CV:
{cv_text}

Return JSON in this format (ONLY JSON, NO OTHER TEXT):
{{
    "skills": ["list ALL skills found - programming languages, frameworks, databases, tools, cloud, DevOps, soft skills..."],
    "experience_years": total years of experience (integer),
    "education": ["all degrees"],
    "certifications": ["all certifications"],
    "job_titles": ["all positions held"]
}}"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a CV analysis expert with 10 years of experience. Task: read CAREFULLY and extract COMPLETE, ACCURATE information. DO NOT MISS any skill or technology. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=3000
        )
        
        result_text = response.choices[0].message.content.strip()
        result_text = result_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(result_text)
        return data
    
    async def extract_jd_requirements(self, jd_text: str):
        """Extract requirements from JD using Groq AI"""
        prompt = f"""You are a Job Description analysis expert. Read CAREFULLY and extract ALL requirements.

IMPORTANT:
- Distinguish clearly between required (must-have) vs preferred (nice-to-have)
- List ALL required skills
- Identify minimum years of experience accurately

JD:
{jd_text}

Return JSON in this format (ONLY JSON, NO OTHER TEXT):
{{
    "required_skills": ["ALL REQUIRED skills - languages, frameworks, databases, tools..."],
    "preferred_skills": ["PREFERRED skills but not required"],
    "min_experience": minimum years of experience (integer),
    "required_education": ["education requirements"],
    "required_certifications": ["required certifications if any"]
}}"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a recruitment expert with 10 years of experience. Task: analyze JD and extract COMPLETE, ACCURATE requirements. Distinguish clearly between required vs preferred. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=3000
        )
        
        result_text = response.choices[0].message.content.strip()
        result_text = result_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(result_text)
        return data
