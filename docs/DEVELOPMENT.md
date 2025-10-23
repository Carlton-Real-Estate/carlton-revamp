# Carlton Real Estate - Development Setup Guide

## 🏗️ Project Architecture

### Current Architecture (Backend-Only Approach)
- **Backend API**: Node.js Express server (port 8000) with all Carlton API endpoints
- **Frontend**: Static files served by HTTP server (port 8082)
- **Mock Data Fallback**: Automatic fallback to mock-properties.json when backend unavailable

## 🚀 Quick Start

```bash
# Single command to start everything:
./start-all-servers.sh
```

This will start:
- Backend API server on port 8000
- Frontend HTTP server on port 8082

## � Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend servers |
| `./start-all-servers.sh` | Start backend and frontend servers |
| `npm run backend` | Start only the backend API server |
| `npm run frontend` | Start only the frontend server |
| `npm start` | Start both servers |

## 🌐 Server URLs

- **🤖 Backend API**: http://localhost:8000
- **🌐 Frontend Server**: http://localhost:8082  
- **🏠 Application**: http://localhost:8082
- **�️ Property Map**: http://localhost:8082/property-map.html

## 🔧 Dependencies Installation

```bash
# Install backend dependencies
cd backend && npm install
```

## 🏗️ Architecture Details

1. **Backend API Server** (Port 8000):
   - Handles Carlton API requests
   - Provides /api/properties, /api/essentials, /api/attachments endpoints
   - Includes automatic fallback to mock data

2. **Frontend Server** (Port 8082):
   - Serves static HTML, CSS, JS files
   - Includes mock-properties.json for fallback

## 🐛 Troubleshooting

### Server Connection Issues
- Check if both servers are running
- Verify port numbers (8000 for backend, 8082 for frontend)
- Ensure no other services are using these ports

### API Issues
- Check console for detailed error messages
- Backend automatically falls back to mock data if Carlton API unavailable
- Test backend directly: http://localhost:8000/api/properties

### File Loading Issues
- Ensure frontend server is running (not file:// protocol)
- Check browser developer tools for specific errors
- Verify file paths are correct

### Backend Connectivity Issues
**If backend is unavailable:**
1. Properties will automatically load from mock-properties.json
2. Check browser console for fallback notifications
3. Restart backend server if needed

## ✅ Success Indicators

- ✅ Both servers start without errors
- ✅ Property map loads at http://localhost:8082/property-map.html
- ✅ Properties display on the map (from backend or mock fallback)
- ✅ Index page shows properties at http://localhost:8082
- ✅ Graceful fallback to mock data when backend unavailable

## 📁 Project Structure

The project uses a clean backend-only architecture:
- All API logic consolidated in `backend/index.js`
- Frontend uses `mock-properties.json` for fallback when backend unavailable
- No CORS proxy or api-config.js dependencies

Your development environment provides a robust experience with automatic fallbacks and comprehensive error handling.