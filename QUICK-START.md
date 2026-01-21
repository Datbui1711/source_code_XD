# 🚀 CareerMate - Quick Start Guide

## Prerequisites

Đảm bảo máy đã cài đặt:
- ✅ Java 17+
- ✅ Maven 3.6+
- ✅ Node.js 16+
- ✅ Docker & Docker Compose
- ✅ PostgreSQL local đã STOP (để tránh conflict port 5432)

## 🎯 Cách 1: Start Tất Cả (Recommended)

### Bước 1: Chuẩn bị
```bash
# Stop PostgreSQL local nếu đang chạy
brew services stop postgresql@16

# Đảm bảo các port sau đang trống:
# 3000 (Frontend), 8761 (Eureka), 8888 (Config), 9090 (Gateway)
# 8081 (Auth), 8085 (Job), 8082 (Candidate), 8090 (AI)
# 5432, 5433, 5435 (PostgreSQL), 6379 (Redis)
```

### Bước 2: Start Everything
```bash
chmod +x START-ALL.sh
./START-ALL.sh
```

Đợi khoảng **2-3 phút** để tất cả services khởi động.

### Bước 3: Truy cập
- 🌐 Frontend: http://localhost:3000
- 📊 Eureka Dashboard: http://localhost:8761

### Bước 4: Login
```
Email: candidate1@test.com
Password: password123
```

### Bước 5: Stop Everything
```bash
chmod +x STOP-ALL.sh
./STOP-ALL.sh
```

---

## 🔧 Cách 2: Start Từng Service (Manual)

### 1. Start Docker
```bash
docker-compose up -d postgres-auth postgres-candidate postgres-job redis
```

### 2. Start Backend Services (mở 6 terminal riêng)

**Terminal 1 - Eureka:**
```bash
cd eureka-server
mvn spring-boot:run
```

**Terminal 2 - Config Server:**
```bash
cd config-server
mvn spring-boot:run
```

**Terminal 3 - API Gateway:**
```bash
cd api-gateway
mvn spring-boot:run
```

**Terminal 4 - Auth Service:**
```bash
cd auth-service
mvn spring-boot:run
```

**Terminal 5 - Job Service:**
```bash
cd job-service
mvn spring-boot:run
```

**Terminal 6 - Candidate Service:**
```bash
cd candidate-service
mvn spring-boot:run
```

### 3. Start AI Service

**Terminal 7:**
```bash
cd ai-career-coach
npm install  # chỉ cần chạy lần đầu
npm start
```

### 4. Start Frontend

**Terminal 8:**
```bash
cd frontend-web
npm install  # chỉ cần chạy lần đầu
npm run dev
```

---

## 📋 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Candidate | candidate1@test.com | password123 |
| Recruiter | recruiter1@test.com | password123 |
| Admin | admin1@test.com | password123 |

---

## 🎯 Features Available

### ✅ Candidate Features
- ✅ Register/Login
- ✅ Browse & Search Jobs (6 sample jobs)
- ✅ View Job Details
- ✅ Apply for Jobs
- ✅ Upload CV & AI Analysis
- ✅ Career Coach Chatbot
- ✅ Profile Management
- ✅ View Applications

### ✅ AI Features
- ✅ Career Coach Chat (Groq AI)
- ✅ CV Analysis with AI
- ✅ Career Roadmap Generation

### 🚧 Coming Soon
- Recruiter Dashboard
- Admin Panel
- Job Recommendations
- Mock Interviews

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :PORT_NUMBER

# Kill the process
kill -9 PID
```

### PostgreSQL Connection Error
```bash
# Make sure local PostgreSQL is stopped
brew services stop postgresql@16

# Restart Docker containers
docker-compose restart postgres-auth
```

### Maven Build Error
```bash
# Clean and rebuild
cd SERVICE_NAME
mvn clean install -DskipTests
```

### Frontend Not Loading
```bash
# Clear cache and reinstall
cd frontend-web
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 Service Health Check

```bash
# Check Eureka (should show all services)
curl http://localhost:8761/eureka/apps

# Check API Gateway
curl http://localhost:9090/actuator/health

# Check Auth Service
curl http://localhost:8081/actuator/health

# Check AI Service
curl http://localhost:8090/health
```

---

## 🔗 Service URLs

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| API Gateway | http://localhost:9090 | 9090 |
| Eureka Server | http://localhost:8761 | 8761 |
| Config Server | http://localhost:8888 | 8888 |
| Auth Service | http://localhost:8081 | 8081 |
| Job Service | http://localhost:8085 | 8085 |
| Candidate Service | http://localhost:8082 | 8082 |
| AI Career Coach | http://localhost:8090 | 8090 |

---

## 📝 Notes

- Lần đầu chạy sẽ mất thời gian vì Maven phải download dependencies
- Đảm bảo có kết nối internet để AI features hoạt động
- Groq API key đã được cấu hình sẵn trong `ai-career-coach/.env`
- Sample jobs và user accounts đã được tạo sẵn

---

## 💡 Tips

1. **Chạy lần đầu**: Dùng `START-ALL.sh` để tự động
2. **Development**: Chạy manual để dễ debug
3. **Stop nhanh**: Dùng `STOP-ALL.sh`
4. **Check logs**: Xem terminal output của từng service
5. **Restart service**: Stop và start lại service đó

---

## 🆘 Support

Nếu gặp vấn đề, check:
1. Logs trong terminal
2. Eureka Dashboard (http://localhost:8761)
3. Docker containers: `docker ps`
4. Port conflicts: `lsof -i :PORT`

---

**Happy Coding! 🚀**
