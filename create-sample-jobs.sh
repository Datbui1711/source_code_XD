#!/bin/bash

# Create sample jobs via API

TOKEN=$(curl -s -X POST http://localhost:9090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"techcorp@company.com","password":"password123"}' | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token. Creating recruiter account first..."
  curl -X POST http://localhost:9090/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email":"techcorp@company.com",
      "password":"password123",
      "fullName":"Tech Corp Recruiter",
      "role":"RECRUITER"
    }'
  
  TOKEN=$(curl -s -X POST http://localhost:9090/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"techcorp@company.com","password":"password123"}' | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
fi

echo "Token: $TOKEN"

# Job 1
curl -X POST http://localhost:9090/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Senior Full Stack Developer",
    "companyName": "Tech Corp",
    "location": "Ho Chi Minh City",
    "salaryRange": "$2000-3000",
    "employmentType": "FULL_TIME",
    "experienceRequired": "3+ years",
    "description": "We are looking for an experienced Full Stack Developer to join our team.",
    "requirements": "- 3+ years experience with React and Node.js\n- Strong knowledge of databases\n- Good communication skills"
  }'

# Job 2
curl -X POST http://localhost:9090/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Frontend Developer",
    "companyName": "Startup Inc",
    "location": "Hanoi",
    "salaryRange": "$1500-2500",
    "employmentType": "FULL_TIME",
    "experienceRequired": "2+ years",
    "description": "Join our dynamic startup team as a Frontend Developer.",
    "requirements": "- 2+ years with React/Vue\n- Experience with modern CSS\n- Responsive design skills"
  }'

# Job 3
curl -X POST http://localhost:9090/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Backend Developer",
    "companyName": "Enterprise Solutions",
    "location": "Da Nang",
    "salaryRange": "$1800-2800",
    "employmentType": "FULL_TIME",
    "experienceRequired": "3+ years",
    "description": "Looking for a Backend Developer with strong Java/Spring Boot experience.",
    "requirements": "- 3+ years Java/Spring Boot\n- Microservices architecture\n- Database design"
  }'

# Job 4
curl -X POST http://localhost:9090/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "DevOps Engineer",
    "companyName": "Cloud Systems",
    "location": "Remote",
    "salaryRange": "$2500-3500",
    "employmentType": "REMOTE",
    "experienceRequired": "4+ years",
    "description": "Seeking an experienced DevOps Engineer for our cloud infrastructure.",
    "requirements": "- 4+ years DevOps experience\n- AWS/Azure/GCP\n- Docker, Kubernetes\n- CI/CD pipelines"
  }'

# Job 5
curl -X POST http://localhost:9090/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "UI/UX Designer",
    "companyName": "Design Studio",
    "location": "Hanoi",
    "salaryRange": "$1200-2000",
    "employmentType": "FULL_TIME",
    "experienceRequired": "2+ years",
    "description": "Creative UI/UX Designer needed for exciting projects.",
    "requirements": "- 2+ years UI/UX design\n- Figma, Adobe XD\n- User research skills\n- Portfolio required"
  }'

# Job 6
curl -X POST http://localhost:9090/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Data Scientist",
    "companyName": "AI Labs",
    "location": "Ho Chi Minh City",
    "salaryRange": "$2200-3200",
    "employmentType": "FULL_TIME",
    "experienceRequired": "3+ years",
    "description": "Join our AI team as a Data Scientist working on cutting-edge projects.",
    "requirements": "- 3+ years in Data Science\n- Python, TensorFlow/PyTorch\n- Machine Learning algorithms\n- Statistical analysis"
  }'

echo ""
echo "Sample jobs created successfully!"
