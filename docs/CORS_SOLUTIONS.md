# Carlton Real Estate - Backend API Architecture

## 🏗️ Current Architecture

Carlton Real Estate now uses a streamlined backend-only approach that eliminates CORS issues entirely.

## ✅ Backend-First Solution

We've implemented a consolidated Node.js backend that handles all Carlton API communication.

### How it works:
1. Frontend makes requests to `http://localhost:8000/api/*`
2. Backend server handles Carlton API integration
3. Automatic fallback to mock data if Carlton API unavailable
4. No CORS issues as all API calls are server-side

### Setup:
```bash
# Start the complete development environment
./start-all-servers.sh

# Or start backend and frontend separately
npm run backend  # Port 8000
npm run frontend # Port 8082
```

## 🔧 Backend API Endpoints

The consolidated backend provides these endpoints:

```javascript
// Properties
GET http://localhost:8000/api/properties

// Property essentials by type
GET http://localhost:8000/api/essentials/:type

// Property attachments
GET http://localhost:8000/api/attachments
```

## 📋 Mock Data Fallback

When the Carlton API is unavailable, the system automatically falls back to `mock-properties.json`:

```javascript
// Frontend automatically handles fallback
try {
    const response = await fetch('http://localhost:8000/api/properties');
    const properties = await response.json();
} catch (error) {
    // Automatically falls back to mock-properties.json
    const response = await fetch('./mock-properties.json');
    const properties = await response.json();
}
```

## 🌐 Development Servers

| Server | Port | Purpose |
|--------|------|---------|
| Backend API | 8000 | Carlton API integration |
| Frontend | 8082 | Static file serving |

## ✅ Benefits of This Architecture

### ✅ No CORS Issues
- All API calls are server-side
- No browser security restrictions
- No need for proxy servers or extensions

### ✅ Robust Fallback System
- Automatic mock data when API unavailable
- Graceful error handling
- Continuous development even offline

### ✅ Simplified Development
- Single command startup: `./start-all-servers.sh`
- No complex proxy configuration
- Clean separation of concerns

## 🚫 Deprecated Solutions

The following are no longer needed:

### ❌ CORS Proxy Server
- `cors-proxy-server.js` - Removed
- No longer needed with backend approach

### ❌ api-config.js
- Configuration file - Removed  
- All API logic now in `backend/index.js`

### ❌ Browser Extensions
- No longer needed for development

## 🏆 Best Practice: Backend Integration

The backend handles all external API communication:

1. **Start the development environment:**
   ```bash
   ./start-all-servers.sh
   ```

2. **Access your application:**
   ```
   http://localhost:8082
   http://localhost:8082/property-map.html
   ```

3. **All API calls work automatically** with fallback to mock data.

## 📁 File Structure

```
backend/
├── index.js          # Consolidated API server
├── package.json      # Backend dependencies
mock-properties.json   # Fallback data
js/
├── index-properties.js # Frontend property loading
├── live-map.js        # Map functionality
```

## 📋 Quick Reference

| Need | Solution |
|------|----------|
| Start development | `./start-all-servers.sh` |
| Backend only | `npm run backend` |
| Frontend only | `npm run frontend` |
| API testing | `http://localhost:8000/api/properties` |

The backend-first architecture provides a robust, CORS-free development experience with automatic fallbacks and comprehensive error handling.

## ✅ Solutions

### 1. 🖥️ Local Proxy Server (Recommended)

The easiest solution for development:

```bash
# Install dependencies
npm install

# Start the proxy server
npm start
```

The proxy server will run on `http://localhost:3001` and forward requests to Carlton API.

**Update your API configuration:**
```javascript
// In api-config.js, enable proxy mode:
corsWorkarounds: {
    localProxy: {
        enabled: true,
        proxyUrl: 'http://localhost:3001/api/proxy'
    }
}
```

### 2. 🔧 Browser Extension (Development Only)

For quick testing without setting up a server:

1. Install a CORS browser extension:
   - Chrome: "CORS Unblock" or "CORS Everywhere"
   - Firefox: "CORS Everywhere"

2. Enable the extension
3. Refresh your page

⚠️ **Warning**: Never use CORS extensions in production!

### 3. 🏗️ Server-Side Implementation (Production)

For production applications:

1. Move API calls to your backend server
2. Create your own API endpoints that call Carlton API
3. Serve data to your frontend via your own API

Example Node.js/Express backend:
```javascript
app.get('/api/properties', async (req, res) => {
    const response = await fetch('https://listings.icarlton.com/wide_api/properties/listings', {
        headers: {
            'authorization': 'YOUR_TOKEN'
        }
    });
    const data = await response.json();
    res.json(data);
});
```

### 4. 📱 Mock Data (Development)

For frontend development without API dependency:

```javascript
// In api-config.js:
debug: {
    mockDataFallback: true
}
```

## 🚀 Quick Start with Proxy Server

1. **Install dependencies:**
   ```bash
   npm install express cors http-proxy-middleware
   ```

2. **Start proxy server:**
   ```bash
   node cors-proxy-server.js
   ```

3. **Update your frontend:**
   - The proxy automatically handles CORS headers
   - Your existing code will work without changes
   - All requests go through `http://localhost:3001/api/proxy/`

## 📋 API Endpoints Through Proxy

| Original Carlton API | Through Proxy |
|---------------------|---------------|
| `https://listings.icarlton.com/wide_api/properties/listings` | `http://localhost:3001/api/proxy/wide_api/properties/listings` |
| `https://listings.icarlton.com/wide_api/property_essentials/created_at/types` | `http://localhost:3001/api/proxy/wide_api/property_essentials/created_at/types` |
| `https://listings.icarlton.com/wide_api/property_attachments/all_attachments` | `http://localhost:3001/api/proxy/wide_api/property_attachments/all_attachments` |

## 🔍 Testing the Proxy

1. **Health check:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Test API call:**
   ```bash
   curl "http://localhost:3001/api/proxy/wide_api/properties/listings?batch_size=5"
   ```

## 🐛 Troubleshooting

### Proxy Server Won't Start
- Check if port 3001 is available
- Install missing dependencies: `npm install`
- Check Node.js version (requires Node 14+)

### Still Getting CORS Errors
- Ensure proxy server is running
- Check browser developer tools for actual error
- Verify the proxy URL in your API config

### API Returns 401/403 Errors
- Check your Carlton API token is valid
- Ensure token is properly set in cors-proxy-server.js
- Contact Carlton Real Estate for API access

## 📞 Support

- Carlton API Issues: Contact Carlton Real Estate
- CORS/Proxy Issues: Check browser developer tools
- Server Issues: Ensure Node.js and dependencies are installed

## 🔒 Security Notes

- The proxy server is for development only
- Never expose proxy server to the internet
- Use server-side implementation for production
- Keep your Carlton API token secure