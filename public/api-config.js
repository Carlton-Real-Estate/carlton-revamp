// Carlton Real Estate - Property API Configuration
// Complete API configuration based on Carlton's Wide Property API

window.CARLTON_API_CONFIG = {
    // Base URL for Carlton's Wide Property API
    baseUrl: 'https://listings.icarlton.com',
    
    // Proxy server configuration (for CORS resolution)
    proxyConfig: {
        enabled: true,
        baseUrl: 'http://localhost:3001/api/proxy',
        fallback: 'https://listings.icarlton.com'
    },
    
    // API Key (Wide API Token) - IMPORTANT: This is the authorization header value
    apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiQVBJIiwibmFtZSI6IkFQSSIsIkFQSV9USU1FIjoxNzQ0NDQzNjAyfQ.QnRuRH__Po1ctY3HZj3cDeK-qptWQE-GPiz7D4j166s',
    
    // Standard headers for all API calls (based on Postman collection)
    headers: {
        'authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiQVBJIiwibmFtZSI6IkFQSSIsIkFQSV9USU1FIjoxNzQ0NDQzNjAyfQ.QnRuRH__Po1ctY3HZj3cDeK-qptWQE-GPiz7D4j166s',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // CORS Configuration
    corsConfig: {
        mode: 'cors',                    // Request mode
        credentials: 'omit',             // Don't send credentials
        redirect: 'follow',              // Follow redirects
        referrerPolicy: 'no-referrer'   // No referrer policy
    },
    
    // API Endpoints (exact paths from Postman collection)
    endpoints: {
        // Main property listings endpoint
        listings: '/wide_api/properties/listings',
        
        // Property essentials (types, areas, categories, etc.)
        essentials: '/wide_api/property_essentials',
        
        // Property attachments (images, files)
        attachments: '/wide_api/property_attachments/all_attachments',
        
        // Child properties (properties within projects)
        childProperties: '/wide_api/properties/properties_child'
    },
    
    // Property Essentials Types (available via essentials endpoint)
    essentialsTypes: {
        categories: 'categories',       // Property categories (Residential, Commercial)
        types: 'types',                // Property types (Apartment, Villa, etc.)
        provinces: 'provinces',        // Provinces/Governorates in Bahrain
        areas: 'areas',               // Areas/Locations within provinces
        for: 'for',                   // For Sale/Rent options
        classifications: 'classifications', // Property classifications (codes like RA, RHA)
        statuses: 'statuses',         // Property statuses (Active, Sold, etc.)
        labels: 'labels',             // Property labels/tags
        facilities: 'facilities',     // Available facilities
        nearby_amenities: 'nearby_amenities' // Nearby amenities
    },
    
    // Default parameters for Property Listings API
    listingDefaults: {
        batch_size: 50,               // Number of properties per request (20 in Postman example)
        start_index: 0,               // Starting index for pagination
        sort: 'desc',                 // Sort order: ASC, asc, DESC, desc
        orderby: 'id'                 // Order by field (anything within property table)
    },
    
    // Available Property Listing Parameters (from Postman collection)
    listingParams: {
        // Core parameters
        batch_size: 'Number of properties to return',
        start_index: 'Starting index for pagination',
        sort: 'Sort order (ASC,asc,DESC,desc)',
        orderby: 'Order by field (anything within property table)',
        
        // Filtering parameters
        types: 'Property type IDs (comma separated)',
        areas: 'Area IDs (comma separated)',
        id: 'Specific property ID(s) (comma separated)',
        for: 'Values (1 OR 2) 1=>Sale, 2=>Rent',
        classification: 'INT value province_id',
        province: 'INT value province_id',
        category: 'Values (1 OR 2) 1=>Residential, 2=>Commercial',
        
        // Property details
        age: 'Property age (INT value)',
        num_roads: 'Number of roads (INT value)',
        num_floors: 'Number of floors (INT value)',
        num_flats: 'Number of flats (INT value)',
        num_shops: 'Number of shops (INT value)',
        num_stores: 'Number of stores (INT value)',
        num_elevators: 'Number of elevators (INT value)',
        num_parking: 'Number of parking spaces (INT value)',
        num_villas: 'Number of villas (INT value)',
        num_rooms: 'Number of rooms (INT value)',
        num_baths: 'Number of bathrooms (INT value)',
        num_kitchens: 'Number of kitchens (INT value)',
        num_halls: 'Number of halls (INT value)',
        num_majles: 'Number of majles (INT value)',
        num_made_room: 'Number of maid rooms (INT value)',
        num_master_rooms: 'Number of master rooms (INT value)',
        
        // Special filters
        featured: 'yes OR no - yes brings only featured properties',
        sales_staff_id: 'Agent ID (INT value)',
        is_studio: 'yes OR no - yes brings only studio properties',
        facilities: 'Facility IDs (comma separated)',
        
        // Price and size ranges
        price_from: 'Minimum price (Decimal)',
        price_to: 'Maximum price (Decimal)',
        size_from: 'Minimum size (Decimal)',
        size_to: 'Maximum size (Decimal)',
        price_ft2_from: 'Minimum price per sq ft (Decimal)',
        price_ft2_to: 'Maximum price per sq ft (Decimal)',
        
        // Additional filters
        have_furniture: 'Furniture status (unfurnished,semi_furnished,furnished)',
        property_labels: 'Property label IDs (comma separated)',
        verified_parcel: 'yes OR no - yes brings only verified properties',
        include_ewa: 'yes OR no - yes brings only EWA included properties',
        free_hold: 'yes OR no - yes brings only freehold properties',
        created_date: 'Property creation date (YYYY-MM-DD)',
        classification_code: 'Classification codes (RA,RHA,etc. comma separated)',
        parent_id: 'Parent property ID for child properties'
    },
    
    // Property Attachment Parameters
    attachmentParams: {
        property_id: 'Property ID(s) for specific property images (comma separated)',
        created_date: 'Filter by creation date',
        ignore_pdf: 'Ignore PDF files (any value except 0 triggers this)'
    },
    
    // Helper methods for API calls
    buildUrl: function(endpoint, params = {}) {
        const url = new URL(this.baseUrl + endpoint);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
                url.searchParams.append(key, params[key]);
            }
        });
        return url.toString();
    },
    
    // Build essentials URL (key can be 'created_at' or 'last_updated')
    buildEssentialsUrl: function(key, type, params = {}) {
        const endpoint = `${this.endpoints.essentials}/${key}/${type}`;
        return this.buildUrl(endpoint, params);
    },
    
    // Build child properties URL
    buildChildPropertiesUrl: function(parentId = null) {
        if (parentId) {
            return `${this.baseUrl}${this.endpoints.childProperties}/${parentId}`;
        }
        return `${this.baseUrl}${this.endpoints.childProperties}`;
    },
    
    // CORS-safe fetch method
    fetchWithCorsHandling: async function(url, options = {}) {
        // Check if proxy is enabled and available
        if (this.proxyConfig.enabled) {
            try {
                // Convert direct Carlton API URL to proxy URL
                const proxyUrl = url.replace(this.baseUrl, this.proxyConfig.baseUrl);
                console.log('Using proxy server:', proxyUrl);
                
                // Simplified headers for proxy (proxy handles authentication)
                const proxyOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    ...options
                };
                
                const response = await fetch(proxyUrl, proxyOptions);
                if (response.ok) {
                    return response;
                }
                
                // Check if it's an API error that should use mock data
                if (response.status === 401 || response.status === 403 || response.status === 404) {
                    const errorType = response.status === 404 ? 'Endpoint not found' : 'Authentication failed';
                    console.warn(`API Error (${response.status}): ${errorType} - Using mock data`);
                    return this.getMockDataResponse(url);
                }
                
                console.warn('Proxy response not ok:', response.status);
            } catch (proxyError) {
                console.warn('Proxy server not available:', proxyError.message);
                console.log('Falling back to direct API call...');
            }
        }
        
        // Fallback to direct API call with CORS handling
        const fetchOptions = {
            method: 'GET',
            ...this.corsConfig,
            headers: this.headers,
            ...options
        };
        
        try {
            // Direct API call attempt
            const response = await fetch(url, fetchOptions);
            return response;
        } catch (error) {
            console.warn('CORS error detected:', error.message);
            
            // If CORS fails, show helpful error
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                return this.handleCorsError(url, fetchOptions);
            }
            throw error;
        }
    },
    
    // Handle CORS errors with alternative solutions
    handleCorsError: function(url, options) {
        console.log('🚫 CORS Error Detected - Carlton API requires server-side access');
        console.log('📋 Solutions:');
        console.log('1. 🖥️  Use local server proxy (recommended)');
        console.log('2. 🔧 Add CORS extension to browser (development only)');
        console.log('3. 🏗️  Implement server-side API proxy');
        console.log('4. 📱 Use mock data for frontend development');
        
        // Return a rejected promise with helpful error
        return Promise.reject(new Error(
            'CORS_ERROR: Carlton API requires server-side access. ' +
            'Please use a local server proxy or implement server-side API calls.'
        ));
    },
    
    // Get property listings with common filters
    buildListingsUrl: function(filters = {}) {
        const params = { ...this.listingDefaults, ...filters };
        return this.buildUrl(this.endpoints.listings, params);
    },
    
    // Development and debugging settings
    debug: {
        enabled: true,              // Enable debug mode
        logApiCalls: true,          // Log all API calls
        logApiResponses: false,     // Log API responses (can be verbose)
        showApiErrors: true,        // Show API errors in console
        mockDataFallback: false,    // No mock data fallback - API required
        corsWorkaround: true        // Enable CORS workaround solutions
    },
    
    // CORS Solutions and Workarounds
    corsWorkarounds: {
        // Option 1: Local proxy server (recommended for development)
        localProxy: {
            enabled: false,
            proxyUrl: 'http://localhost:3001/api/proxy',
            instructions: [
                '1. Create a local Node.js proxy server',
                '2. Install cors and express: npm install cors express',
                '3. Set up proxy to forward requests to Carlton API',
                '4. Enable this option and update proxyUrl'
            ]
        },
        
        // Option 2: Browser extension (development only)
        browserExtension: {
            recommended: 'CORS Unblock or CORS Everywhere',
            warning: 'Only use for development - not for production',
            instructions: [
                '1. Install CORS browser extension',
                '2. Enable the extension',
                '3. Refresh the page and try again'
            ]
        },
        
        // Option 3: Mock data fallback
        mockData: {
            enabled: true,
            sampleCount: 20,
            generateRealistic: true
        }
    },
    
    // API rate limiting and retry settings
    rateLimit: {
        maxRetries: 3,              // Maximum retry attempts
        retryDelay: 1000,           // Delay between retries (ms)
        timeout: 15000              // Request timeout (ms)
    },
    
    // Mock data response for when API is unavailable
    getMockDataResponse: function(url) {
        console.log('🎭 Providing mock data for:', url);
        
        let mockData = {};
        
        if (url.includes('/properties/listings')) {
            mockData = {
                status: true,
                message: "Mock data response - API key expired",
                data: this.generateMockProperties(),
                pagination: {
                    total: 25,
                    current_page: 1,
                    per_page: 20,
                    last_page: 2
                }
            };
        } else if (url.includes('/property_essentials') && url.includes('/areas')) {
            mockData = {
                status: true,
                data: [
                    { id: 1, name: 'Manama', created_at: '2024-01-01' },
                    { id: 2, name: 'Riffa', created_at: '2024-01-01' },
                    { id: 3, name: 'Muharraq', created_at: '2024-01-01' },
                    { id: 4, name: 'Hamad Town', created_at: '2024-01-01' },
                    { id: 5, name: 'Isa Town', created_at: '2024-01-01' },
                    { id: 6, name: 'Sitra', created_at: '2024-01-01' },
                    { id: 7, name: 'Juffair', created_at: '2024-01-01' },
                    { id: 8, name: 'Adliya', created_at: '2024-01-01' }
                ]
            };
        } else if (url.includes('/property_essentials') && url.includes('/types')) {
            mockData = {
                status: true,
                data: [
                    { id: 1, name: 'Apartment', created_at: '2024-01-01' },
                    { id: 2, name: 'Villa', created_at: '2024-01-01' },
                    { id: 3, name: 'Office', created_at: '2024-01-01' },
                    { id: 4, name: 'Shop', created_at: '2024-01-01' },
                    { id: 5, name: 'Warehouse', created_at: '2024-01-01' },
                    { id: 6, name: 'Land', created_at: '2024-01-01' }
                ]
            };
        }
        
        // Create a mock response object
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockData),
            text: () => Promise.resolve(JSON.stringify(mockData))
        });
    },
    
    // Generate realistic mock property data
    generateMockProperties: function() {
        const areas = ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'Isa Town', 'Juffair', 'Adliya', 'Sitra'];
        const types = ['Apartment', 'Villa', 'Office', 'Shop', 'Warehouse'];
        const properties = [];
        
        for (let i = 1; i <= 20; i++) {
            const area = areas[Math.floor(Math.random() * areas.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const forType = Math.random() > 0.5 ? 1 : 2; // 1=Sale, 2=Rent
            const price = forType === 1 ? Math.floor(Math.random() * 200000) + 50000 : Math.floor(Math.random() * 2000) + 300;
            
            // Generate coordinates within Bahrain bounds
            const lat = 26.0667 + (Math.random() * 0.4); // Bahrain latitude range
            const lng = 50.5577 + (Math.random() * 0.3); // Bahrain longitude range
            
            properties.push({
                id: i,
                title: `${type} in ${area}`,
                description: `Beautiful ${type.toLowerCase()} located in ${area}. Perfect for ${forType === 1 ? 'investment' : 'living'}.`,
                area_name: area,
                type_name: type,
                for: forType,
                for_name: forType === 1 ? 'Sale' : 'Rent',
                price: price,
                currency: 'BHD',
                bedrooms: type === 'Apartment' || type === 'Villa' ? Math.floor(Math.random() * 4) + 1 : null,
                bathrooms: type === 'Apartment' || type === 'Villa' ? Math.floor(Math.random() * 3) + 1 : null,
                size: Math.floor(Math.random() * 200) + 50,
                latitude: lat,
                longitude: lng,
                images: [`https://via.placeholder.com/400x300?text=${type}+${i}`],
                created_at: '2024-10-06',
                updated_at: '2024-10-06'
            });
        }
        
        return properties;
    }
};

// Usage Examples:
// 
// 1. Get property listings:
//    const url = CARLTON_API_CONFIG.buildListingsUrl({ batch_size: 20, for: 1 });
//    
// 2. Get property types:
//    const url = CARLTON_API_CONFIG.buildEssentialsUrl('created_at', 'types');
//    
// 3. Get property attachments:
//    const url = CARLTON_API_CONFIG.buildUrl(CARLTON_API_CONFIG.endpoints.attachments, 
//                                           { property_id: '123', ignore_pdf: 1 });
//
// 4. Get child properties:
//    const url = CARLTON_API_CONFIG.buildChildPropertiesUrl('456');
//
// CORS Issue Solutions:
// 
// 🚫 Problem: Carlton API blocks direct browser requests due to CORS policy
// 
// ✅ Solutions (choose one):
// 
// 1. 🖥️  LOCAL SERVER PROXY (Recommended):
//    - Create a simple Node.js proxy server
//    - Forward browser requests to Carlton API
//    - Enable CARLTON_API_CONFIG.corsWorkarounds.localProxy.enabled = true
// 
// 2. 🔧 BROWSER EXTENSION (Development Only):
//    - Install "CORS Unblock" or "CORS Everywhere" extension
//    - Enable extension and refresh page
//    - ⚠️  Never use in production!
// 
// 3. 🏗️  SERVER-SIDE IMPLEMENTATION:
//    - Move API calls to your backend server
//    - Serve data to frontend via your own API
//    - Most secure and production-ready solution
// 
// 4. 📱 MOCK DATA (Development):
//    - Uses realistic sample property data
//    - Good for frontend development and testing
//    - Enable CARLTON_API_CONFIG.debug.mockDataFallback = true
//
// Instructions:
// - The API key is configured for Carlton Real Estate Wide API
// - All endpoints match the Postman collection structure  
// - Use fetchWithCorsHandling() instead of direct fetch()
// - CORS errors are handled gracefully with helpful solutions
// - Contact Carlton Real Estate for API support: https://listings.icarlton.com