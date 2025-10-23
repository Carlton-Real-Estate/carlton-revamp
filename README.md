# Carlton Real Estate - Full Stack Web Application

A complete real estate website with backend API, dynamic property data, AI chatbot, and interactive maps.

## 📁 Structure

```
Carlton/Listings style/
├── .gitignore                          # Git ignore rules
├── start-servers.sh                    # Startup script for both servers
├── backend/                            # Node.js API server
│   ├── index.js                        # Main server file
│   ├── package.json                    # npm dependencies
│   ├── realEstateAI.js                 # AI service
│   └── data/
│       └── mock-properties.json        # Property data (10 properties)
├── docs/                               # Documentation
│   └── *.md                           # Various documentation files
└── public/                             # Frontend application
    ├── index.html                      # Main homepage
    ├── property-map.html               # Property map page
    ├── api-config.js                   # API configuration for Carlton services
    ├── css/
    │   └── main.css                    # Complete stylesheet
    └── js/
        ├── script.js                   # Main application logic
        ├── chatbot.js                  # Chatbot functionality (connects to backend)
        ├── index-properties-mock.js    # Property display (fetches from backend)
        ├── carlton-api.js              # Carlton API integration
        └── property-map-google.js      # Google Maps integration (uses backend data)
```

## 🚀 Quick Start

### Option 1: Use Startup Script (Recommended)
```bash
./start-servers.sh
# Opens backend (port 8000) and frontend (port 8082) automatically
# Visit: http://localhost:8082
```

### Option 2: Manual Startup
```bash
# Terminal 1 - Backend API
cd backend
node index.js

# Terminal 2 - Frontend Server  
cd public
python3 -m http.server 8082
# Visit: http://localhost:8082
```

## ✨ Features

- **Full Stack Architecture**: Node.js backend with Express API + HTML/CSS/JS frontend
- **Dynamic Property Data**: 10 comprehensive property listings served via REST API
- **AI Chatbot**: Intelligent property assistance connected to backend data
- **Interactive Property Map**: Google Maps integration with backend property markers
- **Real-time API**: Properties endpoint with filtering and pagination support
- **CORS Enabled**: Frontend-backend communication configured properly
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Technical Stack

### Backend (Port 8000)
- **Runtime**: Node.js with Express server
- **API Endpoints**: 
  - `GET /api/properties` - Property listings with optional filtering
  - `POST /api/chat` - AI chatbot interactions
  - `GET /health` - Server health check
- **Data**: JSON-based mock properties (10 listings)
- **Features**: CORS support, request logging, error handling

### Frontend (Port 8082)
- **Stack**: Vanilla HTML5, CSS3, JavaScript
- **API Integration**: Fetch-based backend connectivity
- **Maps**: Google Maps JavaScript API with backend data
- **Styling**: Custom CSS with professional real estate theme

## 📱 Application Pages

1. **Homepage** (`http://localhost:8082/`) - Dynamic property listings from backend
2. **Property Map** (`http://localhost:8082/property-map.html`) - Interactive map with backend properties

## 🔧 API Endpoints

```bash
# Get all properties
curl http://localhost:8000/api/properties

# Get properties with filtering
curl "http://localhost:8000/api/properties?location=Juffair&limit=5"

# Chat with AI
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me properties in Juffair"}'

# Health check
curl http://localhost:8000/health
```

## 📝 Development Notes

- **Property Data**: 10 mock properties with Bahrain locations (Juffair, Amwaj Islands, Seef)
- **AI Integration**: Chatbot connects to backend for property-specific responses
- **Map Integration**: Google Maps displays backend properties with proper coordinates
- **CORS Configured**: Frontend (port 8082) can communicate with backend (port 8000)
- **Error Handling**: Robust error handling for API failures and network issues