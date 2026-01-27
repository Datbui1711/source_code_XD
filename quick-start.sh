#!/bin/bash

# CareerMate Platform - Quick Start Script
# This script will start all necessary services

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}CareerMate Platform - Quick Start${NC}"
echo -e "${BLUE}=========================================${NC}\n"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is installed${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java is installed${NC}"

if ! command -v mvn &> /dev/null; then
    echo -e "${RED}✗ Maven is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Maven is installed${NC}"

# Start infrastructure services
echo -e "\n${YELLOW}Starting infrastructure services...${NC}"
docker-compose up -d postgres-auth postgres-candidate postgres-recruiter postgres-job postgres-admin redis rabbitmq weaviate minio

echo -e "${GREEN}✓ Infrastructure services started${NC}"
echo -e "${BLUE}Waiting for services to be ready (30 seconds)...${NC}"
sleep 30

# Start Eureka Server
echo -e "\n${YELLOW}Starting Eureka Server...${NC}"
cd eureka-server
mvn spring-boot:run > ../logs/eureka.log 2>&1 &
EUREKA_PID=$!
cd ..
echo -e "${GREEN}✓ Eureka Server started (PID: $EUREKA_PID)${NC}"
echo -e "${BLUE}Waiting for Eureka to be ready (30 seconds)...${NC}"
sleep 30

# Start Config Server
echo -e "\n${YELLOW}Starting Config Server...${NC}"
cd config-server
mvn spring-boot:run > ../logs/config.log 2>&1 &
CONFIG_PID=$!
cd ..
echo -e "${GREEN}✓ Config Server started (PID: $CONFIG_PID)${NC}"
echo -e "${BLUE}Waiting for Config Server to be ready (20 seconds)...${NC}"
sleep 20

# Start API Gateway
echo -e "\n${YELLOW}Starting API Gateway...${NC}"
cd api-gateway
mvn spring-boot:run > ../logs/gateway.log 2>&1 &
GATEWAY_PID=$!
cd ..
echo -e "${GREEN}✓ API Gateway started (PID: $GATEWAY_PID)${NC}"
echo -e "${BLUE}Waiting for API Gateway to be ready (20 seconds)...${NC}"
sleep 20

# Start Auth Service
echo -e "\n${YELLOW}Starting Auth Service...${NC}"
cd auth-service
mvn spring-boot:run > ../logs/auth.log 2>&1 &
AUTH_PID=$!
cd ..
echo -e "${GREEN}✓ Auth Service started (PID: $AUTH_PID)${NC}"

# Save PIDs
mkdir -p logs
echo $EUREKA_PID > logs/eureka.pid
echo $CONFIG_PID > logs/config.pid
echo $GATEWAY_PID > logs/gateway.pid
echo $AUTH_PID > logs/auth.pid

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}All services started successfully!${NC}"
echo -e "${GREEN}=========================================${NC}\n"

echo -e "${BLUE}Service URLs:${NC}"
echo -e "  • Eureka Dashboard: ${GREEN}http://localhost:8761${NC}"
echo -e "  • API Gateway: ${GREEN}http://localhost:8080${NC}"
echo -e "  • Auth Service: ${GREEN}http://localhost:8081${NC}"
echo -e "  • Auth Swagger UI: ${GREEN}http://localhost:8081/swagger-ui.html${NC}"
echo -e "  • RabbitMQ Management: ${GREEN}http://localhost:15672${NC} (admin/admin)"
echo -e "  • MinIO Console: ${GREEN}http://localhost:9001${NC} (minioadmin/minioadmin)"

echo -e "\n${BLUE}Infrastructure Services:${NC}"
docker-compose ps

echo -e "\n${YELLOW}To stop all services, run:${NC} ./stop-all.sh"
echo -e "${YELLOW}To view logs:${NC} tail -f logs/<service>.log"

echo -e "\n${BLUE}Testing Auth Service:${NC}"
echo -e "Register a user:"
echo -e "${GREEN}curl -X POST http://localhost:8080/api/auth/register \\
  -H 'Content-Type: application/json' \\
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"CANDIDATE\"}'${NC}"

echo -e "\nLogin:"
echo -e "${GREEN}curl -X POST http://localhost:8080/api/auth/login \\
  -H 'Content-Type: application/json' \\
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'${NC}"
