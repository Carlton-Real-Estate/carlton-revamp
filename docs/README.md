# Carlton Real Estate - Property Listings Platform

A comprehensive property listings platform featuring live Carlton Real Estate API integration with backend-first architecture and mock data fallback system.

## 🚀 Current Architecture - Backend-First Approach

The platform now uses a streamlined backend-only architecture:
- **Backend API**: Node.js Express server handling Carlton API integration
- **Frontend**: Static files with automatic fallback to mock data
- **No CORS Issues**: All API calls handled server-side
- **Robust Fallback**: Automatic mock data when API unavailable

## Project Structure

```
Carlton/Listings style/
├── index.html          # Main property listings page
├── property-map.html   # Interactive property map
├── mock-properties.json # Fallback data for offline/API issues
├── backend/
│   ├── index.js        # Consolidated API server
│   └── package.json    # Backend dependencies
├── js/
│   ├── index-properties.js # Property loading with fallback
│   ├── live-map.js     # Interactive map functionality
│   └── chatbot.js      # AI chatbot integration
├── css/
│   └── style.css       # Modern styling
└── start-all-servers.sh # Development startup script
```

## Features Implemented

### ✅ Backend Integration
- **Carlton API**: Live integration with Carlton Real Estate API
- **Backend Server**: Node.js Express server on port 8000
- **API Endpoints**: /api/properties, /api/essentials, /api/attachments
- **Mock Fallback**: Automatic fallback to mock-properties.json
- **Error Handling**: Comprehensive error handling and logging

### ✅ Frontend Features
- **Property Listings**: Dynamic property loading from backend/API
- **Interactive Map**: Google Maps integration with property markers
- **Modern UI**: Grid-based responsive property cards
- **Search & Filters**: Property search and filtering capabilities
- **Fallback System**: Graceful handling of API unavailability

### 🎨 Visual Elements
- **Color Scheme**: 
  - Header: Dark blue (#141a3c) 
  - Hot Labels: Red (#dd3333)
  - Featured Badge: Orange (#ea723d)
  - Price Text: Teal (#2fa89e)
  - Overlay: Teal green (#3b9f93)
- **Typography**: Open Sans font family
- **Layout**: CSS Grid-based responsive layout (12-column grid)
- **Cards**: Modern cards with image overlays and hover effects
- **Interactive Elements**: Heart/share buttons, view property overlays
- **Responsive**: 3-column desktop, 2-column tablet, 1-column mobile

## How to Use

### 1. Quick Start
Start the complete development environment:
```bash
./start-all-servers.sh
```

### 2. Access the Application
- **Main Application**: http://localhost:8082
- **Property Map**: http://localhost:8082/property-map.html
- **Backend API**: http://localhost:8000/api/properties

### 3. Development
- Backend changes: Edit `backend/index.js` and restart backend
- Frontend changes: Edit HTML/CSS/JS files, refresh browser
- Mock data: Modify `mock-properties.json` for fallback testing

## Customization Guide

### Changing Colors
Edit the CSS variables and classes in `css/style.css`:
```css
/* Header background */
.navbar-custom {
    background-color: #141a3c !important; /* Change this */
}

/* Primary buttons */
.btn-primary {
    background-color: #141a3c; /* Change this */
    border-color: #141a3c;     /* Change this */
}
```

### Modifying Layout
- Bootstrap 5 classes are used throughout
- Grid system: `col-lg-6 col-md-12` etc.
- Spacing: `mb-4`, `py-5`, `px-3` etc.

### Adding Content
- Property cards follow a consistent structure
- Contact information can be updated in HTML
- Images use placeholder service (can be replaced with real images)

## Technical Details

### Backend Stack
- **Node.js**: Express server for API integration
- **Carlton API**: Live real estate data integration
- **Mock Data**: JSON fallback for offline development
- **CORS Handling**: Server-side API calls eliminate CORS issues

### Frontend Stack
- **Vanilla JavaScript**: No framework dependencies
- **Google Maps API**: Interactive property mapping
- **CSS Grid**: Modern responsive layout
- **Font Awesome**: Icons and UI elements

### Architecture Benefits
- **No CORS Issues**: All API calls handled server-side
- **Robust Fallback**: Automatic mock data when API unavailable
- **Simple Deployment**: Single command startup
- **Development Friendly**: Comprehensive error logging

## Testing Checklist

Before making changes, test these features:
- [ ] Navigation menu (desktop and mobile)
- [ ] Search form interactions
- [ ] Property card hover effects
- [ ] Contact buttons (phone/WhatsApp links)
- [ ] Responsive layout on different screen sizes
- [ ] Footer links

## Platform Capabilities

### Live Data Integration
- **Real Properties**: Live Carlton Real Estate API data
- **Dynamic Loading**: Properties loaded from backend API
- **Fallback Data**: Mock data when API unavailable
- **Interactive Maps**: Real property locations on Google Maps

### Development Features
- **Hot Reload**: Changes reflected immediately
- **Error Logging**: Comprehensive debugging information
- **Offline Development**: Works with mock data when offline
- **Port Flexibility**: Configurable development ports

## Notes for Developers

### Adding New Property Cards
Copy the new card structure and modify the content:
```html
<section class="card">
    <figure>
        <div class="img-overlay hot-home"> <!-- Remove 'hot-home' for regular properties -->
            <img src="property-image.jpg" alt="Property">
            <div class="overlay"><a href="#">view property</a></div>
            <div class="cont">
                <div class="icons-img">
                    <button><i class="fas fa-heart"></i></button>
                    <button><i class="fas fa-share"></i></button>
                </div>
            </div>
        </div>
        <figcaption>property title</figcaption>
    </figure>
    <div class="card-content">
        <p>Property description...</p>
        <section class="icons-home">
            <!-- Property details -->
        </section>
        <section class="price">
            <span>for sale/rent</span>
            <span>Price</span>
        </section>
    </div>
</section>
```

### Styling Tips
- Use browser developer tools to inspect original site
- Test changes in multiple browsers
- Check mobile responsiveness
- Validate HTML and CSS

## Support

This clone is designed for testing and development purposes. For questions about the original Carlton Listings website, please contact Carlton Real Estate directly.

---

**Created for**: Style testing and development  
**Based on**: https://listings.icarlton.com  
**Last Updated**: October 2024