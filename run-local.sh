#!/bin/bash
# run-local.sh - A helper script to start the local server unsandboxed

# Clear terminal screen
clear

echo "======================================================"
echo "          🚀 STARTING BRAINSTY LOCAL SERVER 🚀        "
echo "======================================================"
echo ""

# Navigate to project directory
cd "/Users/mfelix/projects/website_firebase/brainstywebsite" || exit

# Kill any existing processes on port 9002
echo "🧹 [1/3] Clearing any processes on port 9002..."
PID=$(lsof -t -sTCP:LISTEN -i:9002 2>/dev/null)
if [ -n "$PID" ]; then
    echo "Found process $PID listening on 9002. Terminating it..."
    kill -9 $PID 2>/dev/null
    sleep 2
else
    echo "Port 9002 is clean."
fi

# Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
    echo "📦 [2/3] Installing dependencies..."
    npm install
else
    echo "📦 [2/3] Dependencies already installed."
fi

# Start Next.js server
echo "🔥 [3/3] Launching Next.js dev server on port 9002..."
echo ""
echo "------------------------------------------------------"
echo "👉 CLICK OR COPY THIS URL TO OPEN IN CHROME:"
echo "   http://localhost:9002"
echo "------------------------------------------------------"
echo ""

# Start dev server on port 9002
npm run dev
