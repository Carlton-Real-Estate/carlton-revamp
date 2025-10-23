# Carlton Real Estate - Server Setup Guide

## 🚀 Backend-First Architecture

The application now uses a consolidated backend approach that eliminates all CORS issues.

## 🚀 Quick Start (Recommended Method)

1. **Open Terminal** and navigate to the project directory:
   ```bash
   cd "/Users/hussaindahi/Downloads/Carlton/Listings style"
   ```

2. **Run the startup script**:
   ```bash
   ./start-all-servers.sh
   ```

3. **Open your browser** to:
   ```
   http://localhost:8082              # Main application
   http://localhost:8082/property-map.html  # Property map
   ```

## 📋 Manual Start (Alternative Method)

1. **Start Backend API Server**:
   ```bash
   cd backend
   node index.js
   ```

2. **Start Frontend Server** (in new terminal):
   ```bash
   cd "/Users/hussaindahi/Downloads/Carlton/Listings style"
   python3 -m http.server 8082
   ```

3. **Open your browser** and go to:
   ```
   http://localhost:8082/property-map.html
   ```

## 🏗️ Server Architecture

### Backend API Server (Port 8000)
- Handles all Carlton API integration
- Provides /api/properties, /api/essentials, /api/attachments
- Automatic fallback to mock data

### Frontend Server (Port 8082)
- Serves static HTML, CSS, JS files
- Includes mock-properties.json for fallback

## Issues Fixed

- ✅ **CORS Errors**: Eliminated with backend-first approach
- ✅ **Google Maps Loading**: Fixed async loading and callback issues  
- ✅ **API Integration**: Consolidated in backend/index.js
- ✅ **Mock Data Fallback**: Automatic fallback when API unavailable

## Troubleshooting

### If port 8082 is busy:
```bash
python3 -m http.server 8083
# Then visit http://localhost:8083/property-map.html
```

### If backend port 8000 is busy:
Edit `backend/index.js` and change the port, then update frontend API calls.

### If Python 3 is not available:
```bash
python -m http.server 8082
# Or use Node.js:
npx http-server -p 8082
```

### If backend is unavailable:
- Frontend automatically falls back to mock-properties.json
- Check browser console for fallback notifications
- Properties will still display with mock data

## API Status

The Carlton Real Estate API integration:
- ✅ Handled server-side (no CORS issues)
- ✅ Automatic fallback to mock data
- ✅ Graceful error handling
- ✅ Works offline with mock data

## Google Maps

- Uses Google Maps JavaScript API v3
- Configured for Bahrain region
- Includes Places library for enhanced functionality
- Works with both live and mock property data