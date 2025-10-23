#!/bin/bash

# Carlton Real Estate - Server Startup Script
echo "🚀 Starting Carlton Real Estate Servers..."

# Kill any existing servers
echo "🔄 Stopping existing servers..."
pkill -f "node index.js" 2>/dev/null
pkill -f "python3.*8082" 2>/dev/null

# Change to project root
cd "$(dirname "$0")"

# Start backend API server
echo "🔧 Starting backend API server on port 8000..."
cd backend
nohup node index.js > server.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Start frontend server  
echo "🌐 Starting frontend server on port 8082..."
cd ../public
python3 -m http.server 8082 > /dev/null 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
sleep 2

echo ""
echo "✅ Carlton Real Estate servers are running!"
echo ""
echo "📊 Backend API:  http://localhost:8000"
echo "   Health check: http://localhost:8000/health"
echo "   Properties:   http://localhost:8000/api/properties"
echo "   Chat API:     http://localhost:8000/api/chat"
echo ""
echo "🌐 Frontend:     http://localhost:8082"
echo "   Main page:    http://localhost:8082/"
echo "   Property map: http://localhost:8082/property-map.html"
echo ""
echo "🔧 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   or run: pkill -f 'node index.js'; pkill -f 'python3.*8082'"
echo ""

# Test if servers are responding
echo "🧪 Testing server connectivity..."
sleep 1

if curl -s http://localhost:8000/health > /dev/null; then
    echo "   ✅ Backend API: Online"
else
    echo "   ❌ Backend API: Failed to start"
fi

if curl -s http://localhost:8082/ > /dev/null; then
    echo "   ✅ Frontend: Online"  
else
    echo "   ❌ Frontend: Failed to start"
fi

echo ""
echo "🎉 Ready to serve properties! Open http://localhost:8082/ in your browser"