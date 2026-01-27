#!/bin/bash

echo "🛑 Stopping CareerMate Platform..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Stop processes from PID file
if [ -f .pids ]; then
    echo -e "${RED}Stopping all services...${NC}"
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            kill $pid 2>/dev/null
            echo "  Stopped process $pid"
        fi
    done < .pids
    rm .pids
    echo -e "${GREEN}✅ All services stopped${NC}"
else
    echo "No PID file found. Stopping by port..."
    
    # Kill by port
    lsof -ti:8761 | xargs kill -9 2>/dev/null  # Eureka
    lsof -ti:8888 | xargs kill -9 2>/dev/null  # Config
    lsof -ti:9090 | xargs kill -9 2>/dev/null  # Gateway
    lsof -ti:8081 | xargs kill -9 2>/dev/null  # Auth
    lsof -ti:8085 | xargs kill -9 2>/dev/null  # Job
    lsof -ti:8082 | xargs kill -9 2>/dev/null  # Candidate
    lsof -ti:8090 | xargs kill -9 2>/dev/null  # AI
    lsof -ti:3000 | xargs kill -9 2>/dev/null  # Frontend
    
    echo -e "${GREEN}✅ Services stopped by port${NC}"
fi

# Stop Docker containers
echo ""
echo "Stopping Docker containers..."
docker-compose down
echo -e "${GREEN}✅ Docker containers stopped${NC}"

echo ""
echo -e "${GREEN}✨ All services stopped successfully!${NC}"
