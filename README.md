# 🚀 CareerMate Platform - Microservices Architecture

AI-powered career companion platform for final-year students, built with Spring Boot microservices and Python AI services.

## 🆕 Latest Update: AI CV Analyzer for Recruiters

Đã triển khai thành công **AI CV Analyzer** cho nhà tuyển dụng, học từ dự án "AE SUONG MAU 2":
- ✅ Parse PDF/DOCX CVs tự động
- ✅ Extract thông tin với Groq AI (Llama 3.3)
- ✅ Tính điểm matching với Job Description
- ✅ Support 40+ industries, 200+ skills
- ✅ Ranking ứng viên tự động

👉 **Xem chi tiết:** [AI_CV_ANALYZER_GUIDE.md](./AI_CV_ANALYZER_GUIDE.md) và [RECRUITER_AI_IMPLEMENTATION.md](./RECRUITER_AI_IMPLEMENTATION.md)

## ⚡ Quick Start

```bash
# Start everything with one command
./quick-start.sh

# Stop everything
./stop-all.sh
```

## ✅ Current Status

- ✅ **Infrastructure**: Eureka, Config Server, API Gateway - COMPLETE
- ✅ **Auth Service**: Full authentication system - COMPLETE
- ✅ **AI CV Analyzer**: AI-powered CV analysis for recruiters - COMPLETE ✨ NEW!
- ✅ **Recruiter Service**: Job posting & CV analysis integration - COMPLETE ✨ NEW!
- ⏳ **Other Services**: In development

## 🎯 What's Working Now

The **Auth Service** is fully functional with:
- User registration
- Email/Password login
- JWT token generation & validation
- Refresh token mechanism
- Role-based access control (CANDIDATE, RECRUITER, ADMIN)
- Swagger documentation at http://localhost:8081/swagger-ui.html

## Architecture Overview

CareerMate follows a microservices architecture with the following services:

### Core Services (Spring Boot)
- **Eureka Server** (Port 8761) - Service Discovery
- **Config Server** (Port 8888) - Centralized Configuration
- **API Gateway** (Port 8080) - Single entry point for all clients
- **Auth Service** (Port 8081) - Authentication & Authorization
- **Candidate Service** (Port 8082) - Candidate profile & CV management
- **Recruiter Service** (Port 8083) - Recruiter & organization management
- **Job Service** (Port 8085) - Job posting & application management
- **Admin Service** (Port 8084) - Admin operations & analytics
- **Notification Service** (Port 8086) - Notification delivery

### AI Services (Python/FastAPI)
- **AI CV Analyzer** (Port 8000) - CV parsing & analysis with Groq AI ✅ COMPLETE
- **Career Coach** (Port 8092) - AI career coaching chatbot (Coming soon)
- **Job Matcher** (Port 8093) - Semantic job matching (Coming soon)

### Infrastructure
- **PostgreSQL** - Separate databases per service
- **Redis** - Caching & session management
- **RabbitMQ** - Message queue for async communication
- **Weaviate** - Vector database for semantic search
- **MinIO** - Object storage for files

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.x, Spring Cloud
- **AI Services**: Python 3.11, FastAPI
- **Databases**: PostgreSQL 15, Redis 7, Weaviate
- **Message Queue**: RabbitMQ
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Docker & Docker Compose
- Java 17+
- Maven 3.8+
- Python 3.11+
- Node.js 18+ (for frontend)

## Quick Start

### 1. Start Infrastructure Services

```bash
# Start all infrastructure services
docker-compose up -d postgres-auth postgres-candidate postgres-recruiter postgres-job postgres-admin redis rabbitmq weaviate minio

# Wait for services to be healthy
docker-compose ps
```

### 2. Start Eureka Server

```bash
cd eureka-server
mvn spring-boot:run
```

Wait for Eureka to start at http://localhost:8761

### 3. Start Config Server

```bash
cd config-server
mvn spring-boot:run
```

### 4. Start API Gateway

```bash
cd api-gateway
mvn spring-boot:run
```

### 5. Start Microservices

```bash
# Auth Service
cd auth-service
mvn spring-boot:run

# Candidate Service
cd candidate-service
mvn spring-boot:run

# Job Service
cd job-service
mvn spring-boot:run

# Recruiter Service
cd recruiter-service
mvn spring-boot:run

# Admin Service
cd admin-service
mvn spring-boot:run

# Notification Service
cd notification-service
mvn spring-boot:run
```

### 6. Start AI Services

```bash
# CV Analyzer
cd ai-services/cv-analyzer
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8091

# Career Coach
cd ai-services/career-coach
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8092

# Job Matcher
cd ai-services/job-matcher
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8093
```

## API Documentation

Once all services are running:

- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)

### Service-Specific Swagger UI

- Auth Service: http://localhost:8081/swagger-ui.html
- Candidate Service: http://localhost:8082/swagger-ui.html
- Job Service: http://localhost:8085/swagger-ui.html
- Recruiter Service: http://localhost:8083/swagger-ui.html
- Admin Service: http://localhost:8084/swagger-ui.html

## Project Structure

```
careermate-platform/
├── eureka-server/          # Service discovery
├── config-server/          # Configuration management
├── api-gateway/            # API Gateway
├── auth-service/           # Authentication service
├── candidate-service/      # Candidate management
├── recruiter-service/      # Recruiter management
├── job-service/            # Job & application management
├── admin-service/          # Admin operations
├── notification-service/   # Notification delivery
├── ai-services/
│   ├── cv-analyzer/        # CV analysis
│   ├── career-coach/       # Career coaching
│   └── job-matcher/        # Job matching
├── frontend/
│   ├── web-app/            # React web application
│   └── mobile-app/         # React Native mobile app
├── docker-compose.yml      # Infrastructure services
└── README.md
```

## Development

### Running Tests

```bash
# Run all tests for a service
cd <service-name>
mvn test

# Run property-based tests
mvn test -Dtest=*PropertyTest

# Run integration tests
mvn test -Dtest=*IntegrationTest
```

### Building Docker Images

```bash
# Build all services
./build-all.sh

# Build specific service
cd <service-name>
mvn clean package
docker build -t careermate/<service-name>:latest .
```

## Environment Variables

Each service requires specific environment variables. See individual service README files for details.

### Common Environment Variables

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/db_name
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# Redis
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379

# RabbitMQ
SPRING_RABBITMQ_HOST=localhost
SPRING_RABBITMQ_PORT=5672
SPRING_RABBITMQ_USERNAME=admin
SPRING_RABBITMQ_PASSWORD=admin

# Eureka
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://localhost:8761/eureka/

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000
```

## Monitoring & Observability

- **Distributed Tracing**: Spring Cloud Sleuth + Zipkin
- **Metrics**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Contact

For questions or support, please contact the development team.
