# CareerMate Platform - Complete Documentation

## Test Accounts

### Candidate Account
- **Email**: candidate1@test.com
- **Password**: password123
- **Role**: CANDIDATE

### Recruiter Account
- **Email**: recruiter1@test.com
- **Password**: password123
- **Role**: RECRUITER

### Admin Account
- **Email**: admin1@test.com
- **Password**: password123
- **Role**: ADMIN

---

## ✅ Implemented Features

### For Candidates
1. **Dashboard** - View profile stats and recommendations
2. **Job Search** - Browse and search available positions
3. **Job Detail & Apply** - View job details and submit applications with CV upload
4. **My Applications** - Track application status (PENDING, APPROVED, REJECTED)
5. **Career Coach** - AI-powered career guidance chatbot using Groq AI
6. **CV Upload & Analysis** - Upload CV (.txt, .docx) and get AI feedback
7. **Profile Management** - Update skills and experience

### For Recruiters
1. **Dashboard** - View recruitment metrics
2. **Post Jobs** - Create new job postings with available slots
3. **View Applications** - Review candidate applications with CV content
4. **CV Screening** - AI-powered CV analysis
5. **Analytics** - Track recruitment performance
6. **Manage Applications** - Approve/Reject applications (auto-reject when slots full)

### For Admins
1. **Dashboard** - System overview and statistics
2. **User Management** - Manage all users
3. **Job Management** - Oversee all job postings
4. **System Settings** - Configure platform settings

---

## Sample Data

### Jobs
- **8 sample jobs** in database
- Positions: Full Stack, Frontend, Backend, DevOps, UI/UX, Data Scientist
- Various companies and locations
- Jobs have available slots (1-3 positions)

### Applications
- Sample applications with different statuses
- CV content stored in database
- Cover letters included
- Auto-reject feature when job slots are full

### Candidate Profile
- Sample profile for candidate1@test.com
- Skills, experience, and badges

### Sample CVs
- `sample-cvs/CV_01_NGUYEN_VAN_MINH.txt` - Professional Full Stack Developer CV
- Multiple CV formats supported: .txt, .docx

---

## Service URLs

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:9090
- **Eureka Server**: http://localhost:8761
- **Auth Service**: http://localhost:8081
- **Job Service**: http://localhost:8085
- **Candidate Service**: http://localhost:8082
- **Recruiter Service**: http://localhost:8083
- **AI Career Coach**: http://localhost:8090

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh access token

### Jobs
- `GET /api/jobs/search?keyword=` - Search jobs
- `GET /api/jobs/{id}` - Get job details
- `POST /api/jobs` - Create new job (Recruiter only)
- `POST /api/jobs/{id}/apply` - Apply for job (with CV upload)
- `GET /api/jobs/applications?candidateEmail=` - Get candidate applications
- `GET /api/jobs/{id}/applications` - Get job applications (Recruiter only)
- `PUT /api/jobs/applications/{id}/status` - Update application status (APPROVED/REJECTED/PENDING)

### AI Services
- `POST /api/ai/coach/chat` - Chat with AI career coach
- `POST /api/ai/cv/analyze` - Analyze CV with AI
- `POST /api/ai/coach/roadmap` - Generate career roadmap

### Candidate
- `GET /api/candidates/profile?email=` - Get profile
- `POST /api/candidates/profile` - Create profile
- `PUT /api/candidates/profile?email=` - Update profile

---

## Quick Start

### 1. Start All Services
```bash
./START-ALL.sh
```

This will start:
- Docker containers (PostgreSQL, Redis)
- Eureka Server (port 8761)
- Config Server (port 8888)
- API Gateway (port 9090)
- Auth Service (port 8081)
- Job Service (port 8085)
- Candidate Service (port 8082)
- AI Career Coach (port 8090)
- Frontend (port 3000)

### 2. Open Browser
Navigate to: http://localhost:3000

### 3. Login
Use any test account above (password: `password123`)

### 4. Test Features
- Browse jobs
- View job details
- Apply for jobs with CV upload
- Chat with AI career coach
- Upload and analyze CV
- Track your applications

### 5. Stop All Services
```bash
./STOP-ALL.sh
```

---

## Testing

### Automated Test Script
```bash
./test-apply-job.sh
```

This will test:
- ✅ Login functionality
- ✅ Job listing
- ✅ Job detail view
- ✅ Job application with CV
- ✅ Application tracking

### Manual Testing
1. **Login**: http://localhost:3000
2. **Browse Jobs**: Click "Browse Jobs" or navigate to Jobs page
3. **View Job Detail**: Click on any job card or "View Details" button
4. **Apply for Job**: 
   - Click "Apply Now" button
   - Upload CV file (.txt or .docx) OR paste CV text
   - Write cover letter (optional)
   - Submit application
5. **View Applications**: Navigate to "My Applications" page
6. **AI Career Coach**: Click "Career Coach" to chat with AI
7. **CV Analysis**: Upload CV to get AI feedback

---

## Application Status Flow

1. **PENDING** - Initial status when application is submitted
2. **APPROVED** - Recruiter approves the application
3. **REJECTED** - Recruiter rejects OR auto-rejected when job slots are full

### Auto-Reject Feature
When a job's available slots are filled with APPROVED applications, all remaining PENDING applications are automatically rejected.

Example:
- Job has 2 available slots
- 5 candidates apply (all PENDING)
- Recruiter approves 2 applications
- System automatically rejects the remaining 3 applications

---

## AI Integration

### Groq AI Configuration
- **API Key**: `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`
- **Model**: `llama-3.3-70b-versatile`
- **Service**: AI Career Coach (port 8090)

### AI Features
1. **Career Coaching Chatbot** - Real-time conversation for career guidance
2. **CV Analysis** - Detailed feedback on CV quality and improvements
3. **Career Roadmap** - Personalized career path recommendations

---

## File Upload Support

### Supported CV Formats
- `.txt` - Plain text files
- `.docx` - Microsoft Word documents

### Document Parser
The system uses Apache POI to extract text from DOCX files and stores the content in the database for recruiter review.

---

## Important Notes

### Prerequisites
- **Stop local PostgreSQL**: `brew services stop postgresql@16`
  - Required to avoid port conflicts with Docker PostgreSQL
- **Java 17+** installed
- **Node.js 18+** installed
- **Maven** installed
- **Docker** installed and running

### Security
- All passwords in test accounts: `password123`
- JWT tokens used for authentication
- Token expiry: 24 hours (access token), 7 days (refresh token)

### Database
- PostgreSQL databases: auth_db (5432), candidate_db (5433), job_db (5435)
- Redis cache: localhost:6379
- JPA auto-creates tables on startup (`ddl-auto: update`)

### Architecture
- **Microservices** architecture
- **Service Discovery** with Eureka
- **API Gateway** for routing
- **JWT Authentication** across services
- **Docker Compose** for infrastructure

---

## Troubleshooting

### Auth Service Issues
If Auth Service fails to start:
1. Check if local PostgreSQL is stopped: `brew services list`
2. Stop it: `brew services stop postgresql@16`
3. Restart Auth Service

### Port Conflicts
If any port is already in use:
- Check running processes: `lsof -i :PORT_NUMBER`
- Kill the process: `kill -9 PID`

### Database Connection Issues
- Ensure Docker containers are running: `docker ps`
- Restart Docker containers: `docker-compose restart`

### Frontend Not Loading
- Check if frontend is running: `ps aux | grep vite`
- Check browser console for errors
- Verify API Gateway is accessible: `curl http://localhost:9090/actuator/health`

---

## Project Structure

```
careermate-platform/
├── eureka-server/          # Service discovery
├── config-server/          # Configuration management
├── api-gateway/            # API routing and load balancing
├── auth-service/           # Authentication and authorization
├── job-service/            # Job postings and applications
├── candidate-service/      # Candidate profiles and badges
├── recruiter-service/      # Recruiter management
├── ai-career-coach/        # AI chatbot (Node.js + Groq)
├── frontend-web/           # React frontend
├── sample-cvs/             # Sample CV files
├── docker-compose.yml      # Infrastructure setup
├── START-ALL.sh            # Start all services
├── STOP-ALL.sh             # Stop all services
├── test-apply-job.sh       # Automated testing
└── ACCOUNTS.md             # This file
```

---

## Next Steps for Production

1. **Security Enhancements**
   - Change default passwords
   - Use environment variables for secrets
   - Implement rate limiting
   - Add HTTPS/SSL

2. **Scalability**
   - Add load balancing
   - Implement caching strategies
   - Database optimization
   - CDN for static assets

3. **Monitoring**
   - Add logging aggregation
   - Implement metrics collection
   - Set up alerting
   - Health check dashboards

4. **Additional Features**
   - Email notifications
   - Real-time chat
   - Video interviews
   - Advanced search filters
   - Job recommendations algorithm

---

## Support

For issues or questions:
1. Check service logs in respective directories
2. Verify all services are running: `ps aux | grep java`
3. Check Eureka dashboard: http://localhost:8761
4. Review API Gateway routes: http://localhost:9090/actuator/gateway/routes

---

**Last Updated**: January 7, 2026
**Version**: 1.0.0
**Status**: ✅ All core features implemented and tested
