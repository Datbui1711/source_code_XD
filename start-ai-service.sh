#!/bin/bash

echo "🚀 Starting AI CV Analyzer Service..."

cd ai-cv-analyzer

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "❗ Please add your GROQ_API_KEY to ai-cv-analyzer/.env file"
    echo "   Get free API key from: https://console.groq.com"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Run the service
echo "✅ Starting AI CV Analyzer on http://localhost:8000"
python main.py
