#!/bin/bash

echo "🚀 Starting CareerMate Platform..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Start Docker containers
echo -e "${BLUE}📦 Step 1: Starting Docker containers...${NC}"
docker-compose up -d postgres-auth postgres-candidate postgres-job redis
sleep 5
echo -e "${GREEN}✅ Docker containers started${NC}"
echo ""

# Step 2: Start Eureka Server
echo -e "${BLUE}🔍 Step 2: Starting Eureka Server...${NC}"
cd eureka-server
mvn spring-boot:run > /dev/null 2>&1 &
EUREKA_PID=$!
cd ..
echo -e "${YELLOW}⏳ Waiting for Eureka to start (30 seconds)...${NC}"
sleep 30
echo -e "${GREEN}✅ Eureka Server started (PID: $EUREKA_PID)${NC}"
echo ""

# Step 3: Start Config Server
echo -e "${BLUE}⚙️  Step 3: Starting Config Server...${NC}"
cd config-server
mvn spring-boot:run > /dev/null 2>&1 &
CONFIG_PID=$!
cd ..
sleep 15
echo -e "${GREEN}✅ Config Server started (PID: $CONFIG_PID)${NC}"
echo ""

# Step 4: Start API Gateway
echo -e "${BLUE}🌐 Step 4: Starting API Gateway...${NC}"
cd api-gateway
mvn spring-boot:run > /dev/null 2>&1 &
GATEWAY_PID=$!
cd ..
sleep 15
echo -e "${GREEN}✅ API Gateway started (PID: $GATEWAY_PID)${NC}"
echo ""

# Step 5: Start Auth Service
echo -e "${BLUE}🔐 Step 5: Starting Auth Service...${NC}"
cd auth-service
mvn spring-boot:run > /dev/null 2>&1 &
AUTH_PID=$!
cd ..
sleep 15
echo -e "${GREEN}✅ Auth Service started (PID: $AUTH_PID)${NC}"
echo ""

# Step 6: Start Job Service
echo -e "${BLUE}💼 Step 6: Starting Job Service...${NC}"
cd job-service
mvn spring-boot:run > /dev/null 2>&1 &
JOB_PID=$!
cd ..
sleep 15
echo -e "${GREEN}✅ Job Service started (PID: $JOB_PID)${NC}"
echo ""

# Step 7: Start Candidate Service
echo -e "${BLUE}👤 Step 7: Starting Candidate Service...${NC}"
cd candidate-service
mvn spring-boot:run > /dev/null 2>&1 &
CANDIDATE_PID=$!
cd ..
sleep 15
echo -e "${GREEN}✅ Candidate Service started (PID: $CANDIDATE_PID)${NC}"
echo ""

# Step 8: Start AI Career Coach
echo -e "${BLUE}🤖 Step 8: Starting AI Career Coach...${NC}"
cd ai-career-coach
npm start > /dev/null 2>&1 &
AI_PID=$!
cd ..
sleep 5
echo -e "${GREEN}✅ AI Career Coach started (PID: $AI_PID)${NC}"
echo ""

# Step 9: Start Frontend
echo -e "${BLUE}🎨 Step 9: Starting Frontend...${NC}"
cd frontend-web
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..
sleep 5
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo ""

# Save PIDs to file
echo "$EUREKA_PID" > .pids
echo "$CONFIG_PID" >> .pids
echo "$GATEWAY_PID" >> .pids
echo "$AUTH_PID" >> .pids
echo "$JOB_PID" >> .pids
echo "$CANDIDATE_PID" >> .pids
echo "$AI_PID" >> .pids
echo "$FRONTEND_PID" >> .pids

echo ""
echo -e "${GREEN}✨ All services started successfully!${NC}"
echo ""
echo "📋 Service URLs:"
echo "   Frontend:        http://localhost:3000"
echo "   API Gateway:     http://localhost:9090"
echo "   Eureka Server:   http://localhost:8761"
echo "   Auth Service:    http://localhost:8081"
echo "   Job Service:     http://localhost:8085"
echo "   Candidate:       http://localhost:8082"
echo "   AI Coach:        http://localhost:8090"
echo ""
echo "👤 Test Accounts:"
echo "   Candidate: candidate1@test.com / password123"
echo "   Recruiter: recruiter1@test.com / password123"
echo "   Admin:     admin1@test.com / password123"
echo ""
echo "⚠️  To stop all services, run: ./STOP-ALL.sh"
echo ""
