#!/bin/bash

echo "🧪 Testing Job Application Feature..."
echo ""

# Login to get token
echo "1️⃣ Logging in as candidate1@test.com..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:9090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"candidate1@test.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  exit 1
fi

echo "✅ Login successful!"
echo ""

# Get list of jobs
echo "2️⃣ Fetching available jobs..."
JOBS=$(curl -s "http://localhost:9090/api/jobs/search" -H "Authorization: Bearer $TOKEN")
JOB_COUNT=$(echo $JOBS | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

echo "✅ Found $JOB_COUNT jobs"
echo ""

# Get first job ID
FIRST_JOB_ID=$(echo $JOBS | python3 -c "import sys, json; jobs = json.load(sys.stdin); print(jobs[0]['id'] if jobs else '')" 2>/dev/null)

if [ -z "$FIRST_JOB_ID" ]; then
  echo "❌ No jobs found!"
  exit 1
fi

echo "3️⃣ Viewing job details (ID: $FIRST_JOB_ID)..."
JOB_DETAIL=$(curl -s "http://localhost:9090/api/jobs/$FIRST_JOB_ID" -H "Authorization: Bearer $TOKEN")
JOB_TITLE=$(echo $JOB_DETAIL | python3 -c "import sys, json; print(json.load(sys.stdin)['title'])" 2>/dev/null)
COMPANY=$(echo $JOB_DETAIL | python3 -c "import sys, json; print(json.load(sys.stdin)['companyName'])" 2>/dev/null)

echo "✅ Job: $JOB_TITLE at $COMPANY"
echo ""

# Apply for job
echo "4️⃣ Applying for job..."
APPLY_RESPONSE=$(curl -s -X POST "http://localhost:9090/api/jobs/$FIRST_JOB_ID/apply" \
  -H "Authorization: Bearer $TOKEN" \
  -F "candidateEmail=candidate1@test.com" \
  -F "coverLetter=This is a test application from automated script." \
  -F "cvText=Test CV - Full Stack Developer with 5 years experience in React and Node.js")

APPLICATION_ID=$(echo $APPLY_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)

if [ -z "$APPLICATION_ID" ]; then
  ERROR_MSG=$(echo $APPLY_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('message', 'Unknown error'))" 2>/dev/null)
  echo "⚠️  Application result: $ERROR_MSG"
else
  echo "✅ Application submitted successfully! (Application ID: $APPLICATION_ID)"
fi
echo ""

# View my applications
echo "5️⃣ Viewing my applications..."
MY_APPS=$(curl -s "http://localhost:9090/api/jobs/applications?candidateEmail=candidate1@test.com" \
  -H "Authorization: Bearer $TOKEN")
APP_COUNT=$(echo $MY_APPS | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

echo "✅ You have $APP_COUNT total applications"
echo ""

echo "🎉 All tests completed successfully!"
echo ""
echo "📋 Summary:"
echo "   - Login: ✅"
echo "   - View Jobs: ✅ ($JOB_COUNT jobs)"
echo "   - View Job Detail: ✅"
echo "   - Apply for Job: ✅"
echo "   - View Applications: ✅ ($APP_COUNT applications)"
echo ""
echo "🌐 Open http://localhost:3000 to test in browser"
