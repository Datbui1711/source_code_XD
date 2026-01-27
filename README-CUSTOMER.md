# 🚀 CareerMate Platform - Hướng Dẫn Sử Dụng

## Khởi Động Nhanh

### 1. Chuẩn Bị
```bash
# Dừng PostgreSQL local (nếu đang chạy)
brew services stop postgresql@16

# Đảm bảo Docker đang chạy
docker ps
```

### 2. Khởi Động Hệ Thống
```bash
./START-ALL.sh
```

Đợi khoảng 30 giây để tất cả services khởi động.

### 3. Mở Trình Duyệt
Truy cập: **http://localhost:3000**

### 4. Đăng Nhập
- **Email**: candidate1@test.com
- **Password**: password123

---

## ✅ Tính Năng Đã Hoàn Thành

### Cho Ứng Viên
- ✅ Tìm kiếm và xem danh sách công việc
- ✅ Xem chi tiết công việc
- ✅ **Nộp đơn ứng tuyển với CV** (upload file .txt hoặc .docx)
- ✅ Theo dõi trạng thái đơn ứng tuyển
- ✅ Chat với AI Career Coach (tư vấn nghề nghiệp)
- ✅ Phân tích CV bằng AI

### Cho Nhà Tuyển Dụng
- ✅ Đăng tin tuyển dụng
- ✅ Xem danh sách ứng viên
- ✅ Duyệt/Từ chối đơn ứng tuyển
- ✅ Xem CV của ứng viên

---

## 🧪 Kiểm Tra Hệ Thống

Chạy script test tự động:
```bash
./test-apply-job.sh
```

Script này sẽ test:
- Đăng nhập
- Xem danh sách công việc
- Xem chi tiết công việc
- Nộp đơn ứng tuyển
- Xem danh sách đơn đã nộp

---

## 📊 Dữ Liệu Mẫu

### Công Việc
- 8 công việc mẫu đã được tạo
- Các vị trí: Full Stack, Frontend, Backend, DevOps, UI/UX, Data Scientist

### Tài Khoản Test
- **Ứng viên**: candidate1@test.com / password123
- **Nhà tuyển dụng**: recruiter1@test.com / password123
- **Admin**: admin1@test.com / password123

---

## 🛑 Dừng Hệ Thống

```bash
./STOP-ALL.sh
```

---

## 📝 Hướng Dẫn Sử Dụng Chi Tiết

### Nộp Đơn Ứng Tuyển

1. **Đăng nhập** với tài khoản candidate1@test.com
2. **Vào trang Jobs** (Browse Jobs)
3. **Click vào công việc** bạn quan tâm
4. **Click "Apply Now"**
5. **Upload CV**:
   - Chọn file CV (.txt hoặc .docx)
   - HOẶC paste nội dung CV vào ô text
6. **Viết cover letter** (tùy chọn)
7. **Click "Submit Application"**

### Xem Đơn Đã Nộp

1. Vào trang **"My Applications"**
2. Xem danh sách tất cả đơn đã nộp
3. Trạng thái:
   - **PENDING**: Đang chờ duyệt
   - **APPROVED**: Đã được chấp nhận
   - **REJECTED**: Bị từ chối

### Chat với AI Career Coach

1. Click vào **"Career Coach"**
2. Nhập câu hỏi về nghề nghiệp
3. AI sẽ tư vấn cho bạn

### Phân Tích CV

1. Vào trang **"CV Upload"**
2. Upload file CV hoặc paste text
3. Click **"Analyze CV"**
4. Xem kết quả phân tích từ AI

---

## 🔧 Xử Lý Lỗi

### Auth Service Không Khởi Động
```bash
# Kiểm tra PostgreSQL local
brew services list

# Dừng PostgreSQL local
brew services stop postgresql@16

# Khởi động lại
./STOP-ALL.sh
./START-ALL.sh
```

### Port Bị Chiếm
```bash
# Kiểm tra port đang sử dụng
lsof -i :8081  # hoặc port khác

# Kill process
kill -9 PID
```

### Frontend Không Load
```bash
# Kiểm tra API Gateway
curl http://localhost:9090/actuator/health

# Kiểm tra frontend
ps aux | grep vite
```

---

## 📱 URLs Quan Trọng

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:9090
- **Eureka Dashboard**: http://localhost:8761
- **Auth Service**: http://localhost:8081
- **Job Service**: http://localhost:8085

---

## 📚 Tài Liệu Chi Tiết

Xem file **ACCOUNTS.md** để biết thêm chi tiết về:
- API endpoints
- Cấu trúc dự án
- Cấu hình AI
- Troubleshooting

---

## ⚠️ Lưu Ý Quan Trọng

1. **Phải dừng PostgreSQL local** trước khi chạy: `brew services stop postgresql@16`
2. **Docker phải đang chạy**
3. **Đợi 30 giây** sau khi chạy START-ALL.sh
4. Tất cả mật khẩu test: **password123**

---

## 🎯 Tính Năng Nổi Bật

### 1. Apply Job với CV Upload
- Upload file CV (.txt, .docx)
- Hoặc paste text CV
- Viết cover letter
- Hệ thống lưu CV vào database

### 2. Auto-Reject Applications
- Mỗi job có số lượng slot (vị trí tuyển)
- Khi đủ slot được APPROVED
- Các đơn PENDING còn lại tự động bị REJECTED

### 3. AI Career Coach
- Sử dụng Groq AI (llama-3.3-70b-versatile)
- Chat real-time
- Tư vấn nghề nghiệp
- Phân tích CV

### 4. Microservices Architecture
- Service Discovery (Eureka)
- API Gateway
- JWT Authentication
- Docker Compose

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong terminal
2. Xem Eureka dashboard: http://localhost:8761
3. Chạy test script: `./test-apply-job.sh`
4. Đọc file ACCOUNTS.md

---

**Phiên bản**: 1.0.0  
**Ngày cập nhật**: 7/1/2026  
**Trạng thái**: ✅ Hoàn thành và đã test
