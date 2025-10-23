# Google Maps Setup Instructions

## Current Status

The map is currently using a demo API key that may have restrictions. For production use, you'll need your own Google Maps API key.

**Current API Key**: `AIzaSyBFw0Qbyq9zTFTd-tUY6dHBTTHiDdOTsAc` (Demo - Limited Usage)

## Getting Your Own API Key

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - **Maps JavaScript API** (Required)
     - **Places API** (Optional - for enhanced location features)
   - Create credentials (API Key)
   - **Important**: Set up billing (Google Maps requires a billing account)

2. **Update the HTML file:**
   - Open `property-map.html`
   - Find the line: `<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dHBTTHiDdOTsAc&libraries=places&callback=initGoogleMaps"></script>`
   - Replace `AIzaSyBFw0Qbyq9zTFTd-tUY6dHBTTHiDdOTsAc` with your actual API key

3. **API Key Restrictions (Recommended):**
   - In Google Cloud Console, restrict your API key to your domain
   - Enable only the APIs you need (Maps JavaScript API, Places API)

## Features Enabled:

✅ **Bahrain-Only Map View**: Map is restricted to show only Bahrain territory  
✅ **Property Markers**: Real estate listings with price and area information  
✅ **Amenity Markers**: Hospitals, schools, and mosques with detailed info  
✅ **Custom Controls**: Zoom controls and map type selection  
✅ **Info Windows**: Click markers for detailed property/amenity information  
✅ **Area-Based Privacy**: Property locations show general area, not exact address  

## Map Boundaries:
- **North**: 26.6°N
- **South**: 25.7°N  
- **West**: 50.3°E
- **East**: 50.8°E
- **Default Center**: Manama (26.2285°N, 50.5860°E)
- **Zoom Range**: 10-19 (prevents zooming too far out from Bahrain)

## Cost Considerations:
- Google Maps API usage may incur costs after free tier limits
- Monitor your API usage in Google Cloud Console
- Consider implementing usage quotas and restrictions

## Common Error Messages:

### "This page didn't load Google Maps correctly"
**Causes:**
- Invalid or missing API key
- API key doesn't have Maps JavaScript API enabled
- Billing not set up on Google Cloud account
- Domain restrictions preventing local testing

**Solutions:**
1. Check browser console for specific error messages
2. Verify API key is correct in `property-map.html`
3. Ensure Maps JavaScript API is enabled in Google Cloud Console
4. Set up billing in Google Cloud Console
5. For local testing, don't set domain restrictions on API key

### "For development purposes only" watermark
**Cause:** Using demo API key or missing billing setup
**Solution:** Set up your own API key with proper billing

### Map shows but no markers appear
**Cause:** JavaScript errors in marker creation
**Solution:** Check browser console for errors and verify Carlton API is working

## Testing Locally:
- Use `http://localhost` or `http://127.0.0.1` for local testing
- Don't set domain restrictions on API key during development
- Use browser developer tools to check for console errors

## Troubleshooting Steps:
1. **Check Browser Console**: Press F12 and look for error messages
2. **Verify API Key**: Ensure it's correctly placed in the HTML file
3. **Check API Permissions**: Verify Maps JavaScript API is enabled
4. **Test API Key**: Try the key in a simple Google Maps example
5. **Check Billing**: Ensure billing is set up in Google Cloud Console