import aiosqlite
import json
from typing import Dict, List, Optional

class Database:
    def __init__(self, db_path: str = "careermate_cv_analyzer.db"):
        self.db_path = db_path
    
    async def init_db(self):
        """Initialize database tables"""
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS job_descriptions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL,
                    industry TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            await db.execute("""
                CREATE TABLE IF NOT EXISTS cvs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    jd_id INTEGER NOT NULL,
                    filename TEXT NOT NULL,
                    content TEXT NOT NULL,
                    extracted_data TEXT,
                    overall_score REAL,
                    category_scores TEXT,
                    matched_skills TEXT,
                    missing_skills TEXT,
                    strengths TEXT,
                    weaknesses TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (jd_id) REFERENCES job_descriptions(id)
                )
            """)
            
            await db.execute("""
                CREATE TABLE IF NOT EXISTS criteria (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    industry TEXT UNIQUE NOT NULL,
                    weights TEXT NOT NULL,
                    criteria_list TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            await db.commit()
            await self._insert_default_criteria(db)
    
    async def _insert_default_criteria(self, db):
        """Insert default criteria"""
        default_criteria = {
            "IT": {"weights": {"skills": 0.45, "experience": 0.30, "education": 0.15, "certifications": 0.10}, "criteria_list": ["skills", "experience", "education", "certifications"]},
            "Marketing": {"weights": {"skills": 0.40, "experience": 0.35, "education": 0.15, "certifications": 0.10}, "criteria_list": ["skills", "experience", "education", "certifications"]},
            "Finance": {"weights": {"skills": 0.35, "experience": 0.25, "education": 0.20, "certifications": 0.20}, "criteria_list": ["skills", "experience", "education", "certifications"]}
        }
        
        for industry, data in default_criteria.items():
            await db.execute(
                "INSERT OR IGNORE INTO criteria (industry, weights, criteria_list) VALUES (?, ?, ?)",
                (industry, json.dumps(data["weights"]), json.dumps(data["criteria_list"]))
            )
        await db.commit()
    
    async def save_jd(self, content: str, industry: str) -> int:
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute("INSERT INTO job_descriptions (content, industry) VALUES (?, ?)", (content, industry))
            await db.commit()
            return cursor.lastrowid
    
    async def get_jd(self, jd_id: int) -> Optional[Dict]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("SELECT * FROM job_descriptions WHERE id = ?", (jd_id,))
            row = await cursor.fetchone()
            return dict(row) if row else None
    
    async def save_cv_analysis(self, jd_id: int, filename: str, content: str, cv_data: Dict, score_result: Dict) -> int:
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute("""
                INSERT INTO cvs (jd_id, filename, content, extracted_data, overall_score, category_scores, matched_skills, missing_skills, strengths, weaknesses)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (jd_id, filename, content, json.dumps(cv_data if isinstance(cv_data, dict) else cv_data.dict()), score_result["overall_score"],
                  json.dumps(score_result["category_scores"]), json.dumps(score_result["matched_skills"]), json.dumps(score_result["missing_skills"]),
                  json.dumps(score_result["strengths"]), json.dumps(score_result["weaknesses"])))
            await db.commit()
            return cursor.lastrowid
    
    async def get_all_industries(self) -> List[str]:
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute("SELECT industry FROM criteria")
            rows = await cursor.fetchall()
            return [row[0] for row in rows]
    
    async def get_criteria(self, industry: str) -> Dict:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("SELECT weights, criteria_list FROM criteria WHERE industry = ?", (industry,))
            row = await cursor.fetchone()
            if row:
                return {"weights": json.loads(row["weights"]), "criteria_list": json.loads(row["criteria_list"]) if row["criteria_list"] else list(json.loads(row["weights"]).keys())}
            return {"weights": {}, "criteria_list": []}
    
    async def get_cv_rankings(self, jd_id: int) -> List[Dict]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("""
                SELECT id, filename, overall_score, category_scores, matched_skills, missing_skills, strengths, weaknesses
                FROM cvs WHERE jd_id = ? ORDER BY overall_score DESC
            """, (jd_id,))
            rows = await cursor.fetchall()
            
            results = []
            for row in rows:
                results.append({
                    "cv_id": row["id"], "filename": row["filename"], "overall_score": row["overall_score"],
                    "category_scores": json.loads(row["category_scores"]), "matched_skills": json.loads(row["matched_skills"]),
                    "missing_skills": json.loads(row["missing_skills"]), "strengths": json.loads(row["strengths"]),
                    "weaknesses": json.loads(row["weaknesses"])
                })
            return results
