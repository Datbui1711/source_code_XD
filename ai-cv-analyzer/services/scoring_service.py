from typing import Dict, List
from models.schemas import CVData, JDData
import re

class ScoringService:
    def __init__(self, db):
        self.db = db
        
        # Skill synonyms and variations for better matching - ALL INDUSTRIES
        self.skill_synonyms = {
            # IT/CNTT
            'python': ['python', 'python3', 'py'],
            'javascript': ['javascript', 'js', 'ecmascript'],
            'typescript': ['typescript', 'ts'],
            'django': ['django', 'django rest framework', 'drf'],
            'fastapi': ['fastapi', 'fast api'],
            'flask': ['flask'],
            'react': ['react', 'reactjs', 'react.js'],
            'vue': ['vue', 'vuejs', 'vue.js'],
            'angular': ['angular', 'angularjs'],
            'node': ['node', 'nodejs', 'node.js'],
            'postgresql': ['postgresql', 'postgres', 'psql'],
            'mysql': ['mysql'],
            'mongodb': ['mongodb', 'mongo'],
            'redis': ['redis'],
            'docker': ['docker', 'containerization'],
            'kubernetes': ['kubernetes', 'k8s'],
            'aws': ['aws', 'amazon web services', 'ec2', 'ecs', 's3', 'rds', 'lambda'],
            'azure': ['azure', 'microsoft azure'],
            'gcp': ['gcp', 'google cloud', 'google cloud platform'],
            'git': ['git', 'github', 'gitlab', 'bitbucket'],
            'ci/cd': ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment', 'jenkins', 'gitlab ci', 'github actions'],
            'restful': ['restful', 'rest api', 'rest', 'api'],
            'graphql': ['graphql', 'graph ql'],
            'microservices': ['microservices', 'microservice', 'micro services'],
            'rabbitmq': ['rabbitmq', 'rabbit mq', 'message queue'],
            'kafka': ['kafka', 'apache kafka'],
            'elasticsearch': ['elasticsearch', 'elastic search', 'es'],
            
            # Marketing
            'seo': ['seo', 'search engine optimization', 'tối ưu công cụ tìm kiếm'],
            'sem': ['sem', 'search engine marketing'],
            'google ads': ['google ads', 'google adwords', 'adwords'],
            'facebook ads': ['facebook ads', 'fb ads', 'meta ads'],
            'content marketing': ['content marketing', 'nội dung marketing', 'viết content'],
            'social media': ['social media', 'mạng xã hội', 'social media marketing', 'smm'],
            'email marketing': ['email marketing', 'email campaign'],
            'analytics': ['analytics', 'google analytics', 'phân tích dữ liệu'],
            'photoshop': ['photoshop', 'ps', 'adobe photoshop'],
            'illustrator': ['illustrator', 'ai', 'adobe illustrator'],
            'canva': ['canva'],
            'video editing': ['video editing', 'chỉnh sửa video', 'premiere', 'after effects'],
            
            # Kế toán
            'excel': ['excel', 'microsoft excel', 'ms excel', 'bảng tính'],
            'accounting': ['accounting', 'kế toán', 'accountant'],
            'financial reporting': ['financial reporting', 'báo cáo tài chính'],
            'tax': ['tax', 'thuế', 'taxation'],
            'audit': ['audit', 'kiểm toán', 'auditing'],
            'erp': ['erp', 'sap', 'oracle', 'enterprise resource planning'],
            'quickbooks': ['quickbooks', 'quick books'],
            'misa': ['misa', 'misa sme', 'misa accounting'],
            'fast': ['fast', 'fast accounting'],
            'gaap': ['gaap', 'generally accepted accounting principles'],
            'ifrs': ['ifrs', 'international financial reporting standards'],
            'cpa': ['cpa', 'certified public accountant', 'kế toán viên'],
            'acca': ['acca', 'association of chartered certified accountants'],
            
            # Nhân sự (HR)
            'recruitment': ['recruitment', 'tuyển dụng', 'hiring'],
            'hr': ['hr', 'human resources', 'nhân sự'],
            'payroll': ['payroll', 'tính lương', 'bảng lương'],
            'labor law': ['labor law', 'luật lao động', 'labour law'],
            'training': ['training', 'đào tạo', 'training & development'],
            'performance management': ['performance management', 'quản lý hiệu suất'],
            'hrm': ['hrm', 'human resource management'],
            
            # Kinh doanh (Sales)
            'sales': ['sales', 'bán hàng', 'kinh doanh'],
            'b2b': ['b2b', 'business to business'],
            'b2c': ['b2c', 'business to consumer'],
            'crm': ['crm', 'customer relationship management', 'salesforce'],
            'negotiation': ['negotiation', 'đàm phán', 'thương lượng'],
            'business development': ['business development', 'phát triển kinh doanh', 'bd'],
            'account management': ['account management', 'quản lý khách hàng'],
            
            # Thiết kế (Design)
            'ui/ux': ['ui/ux', 'ui', 'ux', 'user interface', 'user experience'],
            'figma': ['figma'],
            'sketch': ['sketch'],
            'adobe xd': ['adobe xd', 'xd'],
            'graphic design': ['graphic design', 'thiết kế đồ họa'],
            'branding': ['branding', 'thương hiệu'],
            '3d': ['3d', '3d modeling', 'blender', '3ds max'],
            
            # Tài chính (Finance)
            'financial analysis': ['financial analysis', 'phân tích tài chính'],
            'investment': ['investment', 'đầu tư'],
            'banking': ['banking', 'ngân hàng'],
            'risk management': ['risk management', 'quản lý rủi ro'],
            'treasury': ['treasury', 'kho bạc'],
            'forex': ['forex', 'foreign exchange', 'ngoại hối'],
            
            # Logistics
            'supply chain': ['supply chain', 'chuỗi cung ứng'],
            'warehouse': ['warehouse', 'kho bãi', 'warehousing'],
            'inventory': ['inventory', 'quản lý tồn kho'],
            'shipping': ['shipping', 'vận chuyển', 'logistics'],
            'procurement': ['procurement', 'mua hàng', 'purchasing'],
            
            # Sản xuất (Manufacturing)
            'lean': ['lean', 'lean manufacturing'],
            'six sigma': ['six sigma', '6 sigma'],
            'quality control': ['quality control', 'qc', 'kiểm soát chất lượng'],
            'production': ['production', 'sản xuất'],
            'iso': ['iso', 'iso 9001', 'iso certification'],
            
            # Y tế (Healthcare)
            'nursing': ['nursing', 'điều dưỡng'],
            'medical': ['medical', 'y khoa'],
            'pharmacy': ['pharmacy', 'dược'],
            'healthcare': ['healthcare', 'chăm sóc sức khỏe'],
            
            # Giáo dục (Education)
            'teaching': ['teaching', 'giảng dạy'],
            'curriculum': ['curriculum', 'chương trình giảng dạy'],
            'pedagogy': ['pedagogy', 'sư phạm'],
            
            # Xây dựng (Construction)
            'autocad': ['autocad', 'cad'],
            'revit': ['revit'],
            'civil engineering': ['civil engineering', 'kỹ thuật xây dựng'],
            'project management': ['project management', 'quản lý dự án', 'pmp'],
            
            # Bất động sản (Real Estate)
            'real estate': ['real estate', 'bất động sản'],
            'property': ['property', 'tài sản'],
            'valuation': ['valuation', 'định giá'],
            
            # Dịch vụ khách hàng (Customer Service)
            'customer service': ['customer service', 'chăm sóc khách hàng', 'cskh'],
            'call center': ['call center', 'tổng đài'],
            'support': ['support', 'hỗ trợ'],
            
            # Pháp lý (Legal)
            'legal': ['legal', 'pháp lý'],
            'contract': ['contract', 'hợp đồng'],
            'compliance': ['compliance', 'tuân thủ'],
            'lawyer': ['lawyer', 'luật sư', 'attorney'],
            
            # Truyền thông (Media)
            'journalism': ['journalism', 'báo chí'],
            'pr': ['pr', 'public relations', 'quan hệ công chúng'],
            'copywriting': ['copywriting', 'viết quảng cáo'],
            'broadcasting': ['broadcasting', 'phát thanh truyền hình'],
            
            # Du lịch & Khách sạn (Tourism & Hospitality)
            'tourism': ['tourism', 'du lịch'],
            'hospitality': ['hospitality', 'khách sạn'],
            'tour guide': ['tour guide', 'hướng dẫn viên'],
            'hotel management': ['hotel management', 'quản lý khách sạn'],
            
            # Nông nghiệp & Thủy sản
            'agriculture': ['agriculture', 'nông nghiệp'],
            'farming': ['farming', 'canh tác'],
            'aquaculture': ['aquaculture', 'nuôi trồng thủy sản'],
            'fishing': ['fishing', 'đánh bắt'],
            'irrigation': ['irrigation', 'tưới tiêu'],
            
            # Dệt may & Da giày
            'sewing': ['sewing', 'may', 'stitching'],
            'pattern making': ['pattern making', 'cắt rập'],
            'textile': ['textile', 'dệt'],
            'leather': ['leather', 'da'],
            'footwear': ['footwear', 'giày dép'],
            
            # Điện tử & Cơ khí
            'electronics': ['electronics', 'điện tử'],
            'pcb': ['pcb', 'printed circuit board'],
            'mechanical': ['mechanical', 'cơ khí'],
            'cnc': ['cnc', 'computer numerical control'],
            'welding': ['welding', 'hàn'],
            'machining': ['machining', 'gia công'],
            
            # Ô tô
            'automotive': ['automotive', 'ô tô'],
            'mechanic': ['mechanic', 'thợ máy'],
            'car repair': ['car repair', 'sửa chữa ô tô'],
            
            # Năng lượng & Môi trường
            'renewable energy': ['renewable energy', 'năng lượng tái tạo'],
            'solar': ['solar', 'năng lượng mặt trời'],
            'wind': ['wind', 'năng lượng gió'],
            'environmental': ['environmental', 'môi trường'],
            'waste management': ['waste management', 'quản lý chất thải'],
            'recycling': ['recycling', 'tái chế'],
            
            # Hóa chất & Dược phẩm
            'chemistry': ['chemistry', 'hóa học'],
            'pharmaceutical': ['pharmaceutical', 'dược phẩm'],
            'gmp': ['gmp', 'good manufacturing practice'],
            'quality assurance': ['quality assurance', 'qa', 'đảm bảo chất lượng'],
            
            # Thực phẩm & Đồ uống
            'food safety': ['food safety', 'an toàn thực phẩm'],
            'haccp': ['haccp', 'hazard analysis critical control point'],
            'beverage': ['beverage', 'đồ uống'],
            'f&b': ['f&b', 'food and beverage'],
            
            # Bảo hiểm & Chứng khoán
            'insurance': ['insurance', 'bảo hiểm'],
            'underwriting': ['underwriting', 'thẩm định'],
            'claims': ['claims', 'bồi thường'],
            'securities': ['securities', 'chứng khoán'],
            'trading': ['trading', 'giao dịch'],
            'stock': ['stock', 'cổ phiếu'],
            
            # Viễn thông
            'telecommunications': ['telecommunications', 'viễn thông', 'telecom'],
            'network': ['network', 'mạng'],
            '5g': ['5g', '4g', '3g'],
            
            # In ấn & Quảng cáo
            'printing': ['printing', 'in ấn'],
            'advertising': ['advertising', 'quảng cáo'],
            'billboard': ['billboard', 'biển quảng cáo'],
            
            # Sự kiện & Giải trí
            'event planning': ['event planning', 'tổ chức sự kiện'],
            'entertainment': ['entertainment', 'giải trí'],
            'mc': ['mc', 'master of ceremonies', 'dẫn chương trình'],
            
            # Thể thao & Nghệ thuật
            'sports': ['sports', 'thể thao'],
            'fitness': ['fitness', 'thể hình'],
            'coaching': ['coaching', 'huấn luyện'],
            'art': ['art', 'nghệ thuật'],
            'painting': ['painting', 'hội họa'],
            'music': ['music', 'âm nhạc'],
            
            # Thời trang & Làm đẹp
            'fashion': ['fashion', 'thời trang'],
            'styling': ['styling', 'tạo mẫu'],
            'beauty': ['beauty', 'làm đẹp'],
            'makeup': ['makeup', 'trang điểm'],
            'hairdressing': ['hairdressing', 'làm tóc'],
            'spa': ['spa', 'massage'],
            
            # Nhà hàng & Cafe
            'cooking': ['cooking', 'nấu ăn'],
            'chef': ['chef', 'đầu bếp'],
            'barista': ['barista', 'pha chế'],
            'bartender': ['bartender', 'pha chế đồ uống'],
            'waiter': ['waiter', 'phục vụ'],
            
            # Bán lẻ & Siêu thị
            'retail': ['retail', 'bán lẻ'],
            'merchandising': ['merchandising', 'trưng bày hàng hóa'],
            'cashier': ['cashier', 'thu ngân'],
            'pos': ['pos', 'point of sale'],
            
            # Thương mại điện tử
            'ecommerce': ['ecommerce', 'e-commerce', 'thương mại điện tử'],
            'shopee': ['shopee'],
            'lazada': ['lazada'],
            'tiki': ['tiki'],
            
            # Vận tải & Hàng không/Hàng hải
            'transportation': ['transportation', 'vận tải'],
            'driver': ['driver', 'lái xe'],
            'aviation': ['aviation', 'hàng không'],
            'pilot': ['pilot', 'phi công'],
            'maritime': ['maritime', 'hàng hải'],
            'captain': ['captain', 'thuyền trưởng'],
            
            # An ninh & Bảo vệ
            'security': ['security', 'an ninh', 'bảo vệ'],
            'guard': ['guard', 'bảo vệ'],
            'surveillance': ['surveillance', 'giám sát'],
            
            # Vệ sinh
            'cleaning': ['cleaning', 'vệ sinh'],
            'housekeeping': ['housekeeping', 'dọn phòng'],
            'janitor': ['janitor', 'nhân viên vệ sinh'],
        }
    
    async def calculate_score(self, cv_data: CVData, jd_data: JDData, criteria: Dict) -> Dict:
        """Calculate matching score based on weighted criteria"""
        category_scores = {}
        
        # Convert to dict if needed
        cv = cv_data if isinstance(cv_data, dict) else cv_data.dict()
        jd = jd_data if isinstance(jd_data, dict) else jd_data.dict()
        
        # 1. Skills matching (40% default weight) - IMPROVED
        skills_result = self._calculate_skills_match_advanced(
            cv.get("skills", []), 
            jd.get("required_skills", []),
            jd.get("preferred_skills", [])
        )
        category_scores["skills"] = skills_result["score"]
        matched_skills = skills_result["matched"]
        missing_skills = skills_result["missing"]
        
        # 2. Experience matching (30% default weight)
        exp_score = self._calculate_experience_match(
            cv.get("experience_years", 0),
            jd.get("min_experience", 0)
        )
        category_scores["experience"] = exp_score
        
        # 3. Education matching (20% default weight)
        edu_score = self._calculate_education_match(
            cv.get("education", []),
            jd.get("required_education", [])
        )
        category_scores["education"] = edu_score
        
        # 4. Certifications matching (10% default weight)
        cert_score = self._calculate_certification_match(
            cv.get("certifications", []),
            jd.get("required_certifications", [])
        )
        category_scores["certifications"] = cert_score
        
        # Apply custom weights from criteria
        weights = criteria.get("weights", {
            "skills": 0.4,
            "experience": 0.3,
            "education": 0.2,
            "certifications": 0.1
        })
        
        overall_score = sum(
            category_scores[cat] * weights.get(cat, 0)
            for cat in category_scores
        ) * 100  # Convert to percentage
        
        # Generate strengths and weaknesses
        strengths = self._generate_strengths(cv, jd, category_scores)
        weaknesses = self._generate_weaknesses(cv, jd, category_scores)
        
        return {
            "overall_score": round(overall_score, 2),
            "category_scores": {k: round(v * 100, 2) for k, v in category_scores.items()},
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "strengths": strengths,
            "weaknesses": weaknesses
        }
    
    def _normalize_skill(self, skill: str) -> str:
        """Normalize skill name for better matching"""
        skill = skill.lower().strip()
        # Remove special characters
        skill = re.sub(r'[^\w\s]', ' ', skill)
        # Remove extra spaces
        skill = ' '.join(skill.split())
        return skill
    
    def _skills_match(self, cv_skill: str, jd_skill: str) -> bool:
        """Check if two skills match using synonyms and fuzzy matching"""
        cv_norm = self._normalize_skill(cv_skill)
        jd_norm = self._normalize_skill(jd_skill)
        
        # Exact match
        if cv_norm == jd_norm:
            return True
        
        # Check if one contains the other
        if cv_norm in jd_norm or jd_norm in cv_norm:
            return True
        
        # Check synonyms
        for key, synonyms in self.skill_synonyms.items():
            cv_in_synonyms = any(syn in cv_norm for syn in synonyms)
            jd_in_synonyms = any(syn in jd_norm for syn in synonyms)
            if cv_in_synonyms and jd_in_synonyms:
                return True
        
        return False
    
    def _calculate_skills_match_advanced(self, cv_skills: List[str], required: List[str], preferred: List[str]) -> Dict:
        """Advanced skills matching with synonyms and fuzzy matching"""
        if not required:
            return {"score": 1.0, "matched": [], "missing": []}
        
        matched_skills = []
        missing_skills = []
        
        # Check each required skill
        for jd_skill in required:
            found = False
            for cv_skill in cv_skills:
                if self._skills_match(cv_skill, jd_skill):
                    matched_skills.append(jd_skill)
                    found = True
                    break
            if not found:
                missing_skills.append(jd_skill)
        
        # Required skills score (70% weight)
        required_score = len(matched_skills) / len(required) if required else 0
        
        # Preferred skills score (30% weight)
        preferred_matches = 0
        if preferred:
            for jd_skill in preferred:
                for cv_skill in cv_skills:
                    if self._skills_match(cv_skill, jd_skill):
                        preferred_matches += 1
                        break
            preferred_score = preferred_matches / len(preferred)
        else:
            preferred_score = 0
        
        final_score = required_score * 0.7 + preferred_score * 0.3
        
        return {
            "score": final_score,
            "matched": matched_skills,
            "missing": missing_skills
        }
    
    def _calculate_experience_match(self, cv_exp: float, required_exp: float) -> float:
        """Calculate experience matching score"""
        if cv_exp >= required_exp:
            return 1.0
        elif cv_exp >= required_exp * 0.7:
            return 0.8
        elif cv_exp >= required_exp * 0.5:
            return 0.6
        else:
            return 0.4
    
    def _calculate_education_match(self, cv_edu: List[str], required_edu: List[str]) -> float:
        """Calculate education matching score"""
        if not required_edu:
            return 1.0
        
        cv_edu_lower = [e.lower() for e in cv_edu]
        required_lower = [e.lower() for e in required_edu]
        
        matches = sum(1 for edu in required_lower if any(edu in cv for cv in cv_edu_lower))
        return matches / len(required_lower)
    
    def _calculate_certification_match(self, cv_certs: List[str], required_certs: List[str]) -> float:
        """Calculate certification matching score"""
        if not required_certs:
            return 1.0
        
        cv_certs_lower = [c.lower() for c in cv_certs]
        required_lower = [c.lower() for c in required_certs]
        
        matches = sum(1 for cert in required_lower if any(cert in cv for cv in cv_certs_lower))
        return matches / len(required_lower)
    
    def _generate_strengths(self, cv_data: Dict, jd_data: Dict, scores: Dict) -> List[str]:
        """Generate list of candidate strengths"""
        strengths = []
        
        if scores["skills"] >= 0.7:
            strengths.append("Có kỹ năng phù hợp cao với yêu cầu công việc")
        
        if cv_data.get("experience_years", 0) > jd_data.get("min_experience", 0):
            strengths.append(f"Kinh nghiệm {cv_data.get('experience_years', 0)} năm vượt yêu cầu")
        
        if scores["education"] >= 0.8:
            strengths.append("Trình độ học vấn đáp ứng tốt yêu cầu")
        
        if scores["certifications"] >= 0.8:
            strengths.append("Có đầy đủ chứng chỉ cần thiết")
        
        return strengths
    
    def _generate_weaknesses(self, cv_data: Dict, jd_data: Dict, scores: Dict) -> List[str]:
        """Generate list of candidate weaknesses"""
        weaknesses = []
        
        if scores["skills"] < 0.5:
            weaknesses.append("Thiếu nhiều kỹ năng quan trọng")
        
        if cv_data.get("experience_years", 0) < jd_data.get("min_experience", 0) * 0.7:
            weaknesses.append("Kinh nghiệm chưa đủ yêu cầu")
        
        if scores["education"] < 0.5:
            weaknesses.append("Trình độ học vấn chưa phù hợp")
        
        if scores["certifications"] < 0.5:
            weaknesses.append("Thiếu chứng chỉ cần thiết")
        
        return weaknesses
