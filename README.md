# CareerMate - Nền tảng Tuyển dụng Thông minh

Hệ thống tuyển dụng và quản lý sự nghiệp được xây dựng bằng kiến trúc Microservices với Spring Boot, React và AI.

## 🚀 Tính năng chính

- **Tìm việc thông minh** với gợi ý AI
- **Tư vấn nghề nghiệp** bằng chatbot AI
- **Phân tích CV** tự động
- **Quản lý ứng tuyển** theo thời gian thực
- **Dashboard** cho ứng viên, nhà tuyển dụng và admin
- **Giao diện tiếng Việt** hoàn chỉnh

## 📋 Yêu cầu hệ thống

- **Java 17+**
- **Node.js 18+**
- **Python 3.11+**
- **Maven 3.8+**
- **Docker & Docker Compose**
- **Git**

## 🛠️ Cài đặt và Chạy

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd careermate-platform
```

### Bước 2: Khởi động Infrastructure Services
```bash
# Khởi động các database và services hạ tầng
docker-compose up -d postgres-auth postgres-candidate postgres-recruiter postgres-job postgres-admin redis rabbitmq weaviate minio

# Kiểm tra trạng thái
docker-compose ps
```

### Bước 3: Chạy các Microservices (theo thứ tự)

**⚠️ Quan trọng:** Phải chạy theo đúng thứ tự và đợi mỗi service khởi động xong trước khi chạy service tiếp theo.

#### Terminal 1 - Eureka Server (Service Discovery)
```bash
cd eureka-server
mvn spring-boot:run
```
**Port:** 8761 | **URL:** http://localhost:8761

#### Terminal 2 - Config Server (Quản lý cấu hình)
```bash
cd config-server
mvn spring-boot:run
```
**Port:** 8888

#### Terminal 3 - API Gateway (Cổng API)
```bash
cd api-gateway
mvn spring-boot:run
```
**Port:** 8080

#### Terminal 4 - Auth Service (Xác thực)
```bash
cd auth-service
mvn spring-boot:run
```
**Port:** 8081

#### Terminal 5 - Job Service (Quản lý việc làm)
```bash
cd job-service
mvn spring-boot:run
```
**Port:** 8085

#### Terminal 6 - Candidate Service (Quản lý ứng viên)
```bash
cd candidate-service
mvn spring-boot:run
```
**Port:** 8082

#### Terminal 7 - Recruiter Service (Quản lý nhà tuyển dụng)
```bash
cd recruiter-service
mvn spring-boot:run
```
**Port:** 8083

#### Terminal 8 - AI Career Coach (Tư vấn nghề nghiệp AI)
```bash
cd ai-career-coach
npm install
npm start
```
**Port:** 8091

#### Terminal 9 - AI CV Analyzer (Phân tích CV AI)
```bash
cd ai-cv-analyzer
pip install -r requirements.txt
python main.py
```
**Port:** 8000

#### Terminal 10 - Frontend (Giao diện người dùng)
```bash
cd frontend-web
npm install
npm run dev
```
**Port:** 5173 | **URL:** http://localhost:5173

## 🌐 Truy cập ứng dụng

### Giao diện chính
- **Ứng dụng web:** http://localhost:5173
- **Eureka Dashboard:** http://localhost:8761 (xem trạng thái services)

### Tài khoản test

| Loại tài khoản | Email | Mật khẩu | Quyền |
|----------------|-------|----------|-------|
| Ứng viên | candidate1@test.com | password123 | CANDIDATE |
| Nhà tuyển dụng | recruiter1@test.com | password123 | RECRUITER |
| Quản trị viên | admin1@test.com | password123 | ADMIN |

## 🔍 Kiểm tra hệ thống

### 1. Kiểm tra Infrastructure
```bash
docker ps
```
Phải thấy 9 containers đang chạy (PostgreSQL, Redis, RabbitMQ, Weaviate, MinIO).

### 2. Kiểm tra Services
- Truy cập **Eureka Dashboard** tại http://localhost:8761
- Tất cả services phải xuất hiện trong danh sách đã đăng ký

### 3. Kiểm tra API Gateway
```bash
curl http://localhost:8080/actuator/health
```

### 4. Test đăng nhập
- Mở http://localhost:5173
- Đăng nhập bằng tài khoản test
- Kiểm tra các tính năng cơ bản

## 📁 Cấu trúc dự án

```
careermate-platform/
├── eureka-server/          # Service Discovery
├── config-server/          # Configuration Management  
├── api-gateway/            # API Gateway & Routing
├── auth-service/           # Authentication & Authorization
├── job-service/            # Job Management
├── candidate-service/      # Candidate Profiles
├── recruiter-service/      # Recruiter Management
├── ai-career-coach/        # AI Career Coaching (Node.js)
├── ai-cv-analyzer/         # AI CV Analysis (Python)
├── frontend-web/           # React Frontend
├── sample-cvs/             # Sample CV files
├── docker-compose.yml      # Infrastructure setup
└── README.md               # Hướng dẫn này
```

## 🎯 Tính năng theo vai trò

### Ứng viên (Candidate)
- ✅ Tìm kiếm việc làm
- ✅ Xem chi tiết công việc và ứng tuyển
- ✅ Tải lên CV và nhận phản hồi AI
- ✅ Chat với AI Career Coach
- ✅ Theo dõi trạng thái ứng tuyển
- ✅ Quản lý hồ sơ cá nhân

### Nhà tuyển dụng (Recruiter)
- ✅ Đăng tin tuyển dụng
- ✅ Xem và quản lý ứng viên
- ✅ Phân tích CV bằng AI
- ✅ Phê duyệt/từ chối ứng tuyển
- ✅ Dashboard thống kê
- ✅ Quản lý quy trình tuyển dụng

### Quản trị viên (Admin)
- ✅ Quản lý người dùng
- ✅ Quản lý việc làm
- ✅ Thống kê hệ thống
- ✅ Cấu hình hệ thống

## 🔧 Xử lý sự cố

### Lỗi kết nối database
```bash
# Kiểm tra containers
docker ps

# Restart infrastructure nếu cần
docker-compose restart postgres-auth postgres-candidate postgres-recruiter postgres-job postgres-admin
```

### Lỗi port đã được sử dụng
```bash
# Kiểm tra port đang sử dụng
netstat -ano | findstr :8761

# Kill process nếu cần
taskkill /PID <PID_NUMBER> /F
```

### Service không đăng ký với Eureka
1. Kiểm tra Eureka Server đã chạy chưa (http://localhost:8761)
2. Đợi 30-60 giây để service tự đăng ký
3. Restart service nếu cần

### Frontend không kết nối được API
1. Kiểm tra API Gateway đang chạy (port 8080)
2. Kiểm tra tất cả backend services đã khởi động
3. Xóa cache trình duyệt và reload

## 🛑 Dừng hệ thống

### Dừng tất cả services
```bash
# Dừng infrastructure
docker-compose down

# Dừng các Java services (Ctrl+C trong mỗi terminal)
# Hoặc kill tất cả Java processes
taskkill /F /IM java.exe

# Dừng Node.js và Python services
taskkill /F /IM node.exe
taskkill /F /IM python.exe
```

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong terminal của từng service
2. Xem Eureka Dashboard để kiểm tra service registration
3. Kiểm tra kết nối database và infrastructure services
4. Đảm bảo chạy đúng thứ tự và đợi mỗi service khởi động hoàn tất

## 🔄 Phiên bản

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** ✅ Production Ready

---

**Chúc bạn sử dụng CareerMate thành công! 🚀**