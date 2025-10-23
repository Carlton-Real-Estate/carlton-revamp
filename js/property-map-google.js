// Initialize variables
let map;
let propertyMarkers = [];
let amenityMarkers = {
    hospitals: [],
    schools: []
};
let activePropertyId = null;

// Sample amenities data for Bahrain
const amenitiesData = {
    hospitals: [
        // Public Hospitals
        {
            name: 'Salmaniya Medical Complex (SMC)',
            coordinates: [26.2235, 50.5876],
            type: 'Public',
            description: 'Main government hospital and largest medical facility in Bahrain'
        },
        {
            name: 'King Hamad University Hospital (KHUH)',
            coordinates: [26.0667, 50.5577],
            type: 'Public',
            description: 'Modern university teaching hospital'
        },
        {
            name: 'Bahrain Defence Force Hospital (BDF)',
            coordinates: [26.1845, 50.5623],
            type: 'Public',
            description: 'Military hospital serving BDF personnel and families'
        },
        {
            name: 'Jidhafs Health Center',
            coordinates: [26.2045, 50.5445],
            type: 'Public',
            description: 'Primary healthcare center'
        },
        {
            name: 'Muharraq Health Center',
            coordinates: [26.2572, 50.6214],
            type: 'Public',
            description: 'Primary healthcare center in Muharraq'
        },
        {
            name: 'Sitra Health Center',
            coordinates: [26.1532, 50.6192],
            type: 'Public',
            description: 'Primary healthcare center in Sitra'
        },
        
        // Private Hospitals
        {
            name: 'Royal Bahrain Hospital',
            coordinates: [26.1921, 50.5501],
            type: 'Private',
            description: 'Premier private healthcare facility'
        },
        {
            name: 'American Mission Hospital (AMH)',
            coordinates: [26.2134, 50.5987],
            type: 'Private',
            description: 'Historic private hospital established 1893'
        },
        {
            name: 'Bahrain Specialist Hospital (BSH)',
            coordinates: [26.1876, 50.5512],
            type: 'Private',
            description: 'Multi-specialty private hospital'
        },
        {
            name: 'International Hospital of Bahrain',
            coordinates: [26.2045, 50.5745],
            type: 'Private',
            description: 'Modern private healthcare facility'
        },
        {
            name: 'Awali Hospital',
            coordinates: [26.0845, 50.5123],
            type: 'Private',
            description: 'Private hospital in Awali area'
        },
        {
            name: 'Ibn Al Nafees Hospital',
            coordinates: [26.2156, 50.5823],
            type: 'Private',
            description: 'Private medical center'
        },
        {
            name: 'Noor Specialist Hospital',
            coordinates: [26.1978, 50.5678],
            type: 'Private',
            description: 'Eye care specialist hospital'
        },
        {
            name: 'Al Hilal Hospital',
            coordinates: [26.2234, 50.5934],
            type: 'Private',
            description: 'Multi-specialty private hospital'
        },
        {
            name: 'Royal College of Surgeons in Ireland (RCSI) Medical University',
            coordinates: [26.2267, 50.5891],
            type: 'Private',
            description: 'Teaching hospital and medical university'
        }
    ],
    schools: [
        // Public Schools (All)
        {
            name: 'Isa Town Secondary Boys School',
            coordinates: [26.1732, 50.5492],
            type: 'Public',
            description: 'Government secondary school for boys'
        },
        {
            name: 'Isa Town Secondary Girls School',
            coordinates: [26.1745, 50.5478],
            type: 'Public',
            description: 'Government secondary school for girls'
        },
        {
            name: 'Jidhafs Secondary School',
            coordinates: [26.2078, 50.5445],
            type: 'Public',
            description: 'Government secondary school'
        },
        {
            name: 'Muharraq Secondary Boys School',
            coordinates: [26.2589, 50.6187],
            type: 'Public',
            description: 'Government secondary school in Muharraq'
        },
        {
            name: 'Riffa Secondary School',
            coordinates: [26.1332, 50.5692],
            type: 'Public',
            description: 'Government secondary school in Riffa'
        },
        {
            name: 'Saar Secondary School',
            coordinates: [26.1932, 50.4792],
            type: 'Public',
            description: 'Government secondary school in Saar'
        },
        {
            name: 'Hamad Town Secondary School',
            coordinates: [26.1123, 50.5234],
            type: 'Public',
            description: 'Government secondary school in Hamad Town'
        },
        
        // Popular Private International Schools (Top tier only)
        {
            name: 'British School of Bahrain (BSB)',
            coordinates: [26.0987, 50.5234],
            type: 'Private',
            description: 'British curriculum - IGCSE and A-Levels'
        },
        {
            name: 'St. Christopher\'s School',
            coordinates: [26.1845, 50.5623],
            type: 'Private',
            description: 'British curriculum - Primary and Secondary'
        },
        {
            name: 'Bahrain School',
            coordinates: [26.1723, 50.5512],
            type: 'Private',
            description: 'American curriculum school'
        },
        {
            name: 'Nadeen School',
            coordinates: [26.1934, 50.5578],
            type: 'Private',
            description: 'British curriculum - Early Years to A-Levels'
        },
        {
            name: 'Ibn Khuldoon National School',
            coordinates: [26.1678, 50.5389],
            type: 'Private',
            description: 'IB curriculum - PYP, MYP, DP'
        },
        {
            name: 'Sacred Heart School',
            coordinates: [26.2123, 50.5867],
            type: 'Private',
            description: 'CBSE curriculum - Indian curriculum'
        },
        {
            name: 'Indian School Bahrain',
            coordinates: [26.1889, 50.5534],
            type: 'Private',
            description: 'CBSE curriculum - K-12'
        },
        {
            name: 'Riffa Views International School',
            coordinates: [26.1234, 50.5678],
            type: 'Private',
            description: 'British curriculum - EYFS to A-Levels'
        },
        {
            name: 'Abdulrahman Kanoo International School (ARKIS)',
            coordinates: [26.0945, 50.5189],
            type: 'Private',
            description: 'British curriculum - EYFS to A-Levels'
        },
        {
            name: 'Bahrain Bayan School',
            coordinates: [26.1812, 50.5467],
            type: 'Private',
            description: 'IB curriculum - Girls school'
        }
    ]
};

// Map center coordinates for different areas in Bahrain
// Area coordinates mapping - Maps property locations to general area centers
// Properties will show at area level, not exact locations (for privacy)
// Area coordinates are loaded from area-mapping.js (BAHRAIN_AREA_MAPPING)
// This function converts BAHRAIN_AREA_MAPPING format to legacy format for backward compatibility
function getAreaCoordinatesLegacy() {
    const coords = {};
    if (typeof BAHRAIN_AREA_MAPPING !== 'undefined') {
        Object.entries(BAHRAIN_AREA_MAPPING).forEach(([key, area]) => {
            if (area.coordinates) {
                coords[key] = [area.coordinates.lat, area.coordinates.lng];
                // Also add alternative names
                if (area.alternative_names) {
                    area.alternative_names.forEach(alt => {
                        coords[alt.toLowerCase()] = [area.coordinates.lat, area.coordinates.lng];
                    });
                }
            }
        });
    }
    return coords;
}

// Get area coordinates with fallback
const areaCoordinates = typeof BAHRAIN_AREA_MAPPING !== 'undefined' ? getAreaCoordinatesLegacy() : {
    // Fallback coordinates if area-mapping.js not loaded
    'amwaj': [26.2867, 50.6527],
    'manama': [26.2285, 50.5860],
    'juffair': [26.2172, 50.6083],
    'seef': [26.2479, 50.5477]
};

// Initialize map (global function for Google Maps callback)
async function initMap() {
    const selectedLocation = document.getElementById('map-location')?.value || 'amwaj';
    const center = areaCoordinates[selectedLocation] || areaCoordinates.amwaj;
    
    // Bahrain boundaries
    const bahrainBounds = {
        north: 26.3250,  // Northern tip of Bahrain
        south: 25.7900,  // Southern tip near Zallaq
        west: 50.3500,   // Western coast
        east: 50.7500    // Eastern coast including Amwaj
    };
    
    // Create restricted bounds for Bahrain
    const strictBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(bahrainBounds.south, bahrainBounds.west),
        new google.maps.LatLng(bahrainBounds.north, bahrainBounds.east)
    );
    
    // Create Google Map with custom style and Bahrain restrictions
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10.5,  // Initial zoom to show full Bahrain country
        center: { lat: 26.0667, lng: 50.5577 }, // Geographic center of Bahrain
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapId: '14297571e8d2209a625ab170', // Custom map style ID
        
        // Restrict map to Bahrain boundaries only
        restriction: {
            latLngBounds: strictBounds,
            strictBounds: true
        },
        
        // Set zoom levels: 9.5 allows full view of Bahrain, 15 shows area details
        minZoom: 9.5,   // Allows zooming out to see entire Bahrain country fully
        maxZoom: 15,    // Allows zooming to area level (not street level for privacy)
        
        // Disable street view for privacy protection
        streetViewControl: false,
        
        // Customize map controls
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        }
    });

    // Load and display properties from Carlton API
    propertiesData = await loadMapProperties();
    displayProperties();
    
    // Add amenities to map
    displayAmenities();
    
    // Initialize event listeners after map is ready
    initializeEventListeners();
}

// Properties data - MOCK DATA (ignoring API connection)
let propertiesData = [];

// Load properties from MOCK DATA
async function loadMapProperties() {
    console.log('🔄 Loading properties for map from MOCK DATA...');
    
    // Return mock properties data (matching properties-page.js)
    const mockProperties = [
        // Properties for SALE - Apartments
        {
            id: 1,
            title: "Luxury 2BR Apartment in Juffair",
            price: 85000,
            location: "Juffair",
            bedrooms: 2,
            bathrooms: 2,
            area: 120,
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2172, 50.6083],
            description: 'Luxury 2-bedroom apartment in Juffair',
            currency: 'BHD',
            reference_number: "AJ45123"
        },
        {
            id: 2,
            title: "Modern 3BR Apartment in Seef",
            price: 120000,
            location: "Seef",
            bedrooms: 3,
            bathrooms: 2,
            area: 150,
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2479, 50.5477],
            description: 'Modern 3-bedroom apartment in Seef',
            currency: 'BHD',
            reference_number: "SF78945"
        },
        {
            id: 3,
            title: "Spacious 4BR Penthouse in Diplomatic Area",
            price: 250000,
            location: "Diplomatic Area",
            bedrooms: 4,
            bathrooms: 3,
            area: 280,
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2361, 50.5831],
            description: 'Spacious 4-bedroom penthouse in Diplomatic Area',
            currency: 'BHD',
            reference_number: "DA12456"
        },
        {
            id: 4,
            title: "Sea View 2BR Apartment in Reef Island",
            price: 95000,
            location: "Reef Island",
            bedrooms: 2,
            bathrooms: 2,
            area: 135,
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2456, 50.6234],
            description: 'Sea view 2-bedroom apartment in Reef Island',
            currency: 'BHD',
            reference_number: "RI34567"
        },
        {
            id: 5,
            title: "Elegant 3BR Apartment in Manama",
            price: 105000,
            location: "Manama",
            bedrooms: 3,
            bathrooms: 2,
            area: 145,
            image: "https://images.unsplash.com/photo-1502672260066-6bc358fc623e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2285, 50.5860],
            description: 'Elegant 3-bedroom apartment in Manama',
            currency: 'BHD',
            reference_number: "MN98765"
        },

        // Properties for RENT
        {
            id: 6,
            title: "Furnished 2BR Apartment for Rent in Adliya",
            price: 450,
            location: "Adliya",
            bedrooms: 2,
            bathrooms: 2,
            area: 110,
            image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Rent",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2154, 50.5932],
            description: 'Furnished 2-bedroom apartment for rent in Adliya',
            currency: 'BHD',
            reference_number: "AD55678"
        },
        {
            id: 7,
            title: "Spacious 3BR Villa for Rent in Riffa",
            price: 800,
            location: "Riffa",
            bedrooms: 3,
            bathrooms: 3,
            area: 220,
            image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Rent",
            type: "Villa",
            type_name: "Villa",
            coordinates: [26.1332, 50.5692],
            description: 'Spacious 3-bedroom villa for rent in Riffa',
            currency: 'BHD',
            reference_number: "RF23456"
        },
        {
            id: 8,
            title: "Modern Studio in Juffair for Rent",
            price: 300,
            location: "Juffair",
            bedrooms: 1,
            bathrooms: 1,
            area: 60,
            image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Rent",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2185, 50.6095],
            description: 'Modern studio in Juffair for rent',
            currency: 'BHD',
            reference_number: "JF67890"
        },
        {
            id: 9,
            title: "Luxury 4BR Villa for Rent in Saar",
            price: 1200,
            location: "Saar",
            bedrooms: 4,
            bathrooms: 4,
            area: 350,
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Rent",
            type: "Villa",
            type_name: "Villa",
            coordinates: [26.1789, 50.4923],
            description: 'Luxury 4-bedroom villa for rent in Saar',
            currency: 'BHD',
            reference_number: "SR12345"
        },
        {
            id: 10,
            title: "2BR Apartment for Rent in Seef",
            price: 500,
            location: "Seef",
            bedrooms: 2,
            bathrooms: 2,
            area: 125,
            image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Rent",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2492, 50.5465],
            description: '2-bedroom apartment for rent in Seef',
            currency: 'BHD',
            reference_number: "SF44321"
        },

        // VILLAS
        {
            id: 11,
            title: "Waterfront Villa in Amwaj Islands",
            price: 450000,
            location: "Amwaj Islands",
            bedrooms: 4,
            bathrooms: 3,
            area: 300,
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Villa",
            type_name: "Villa",
            coordinates: [26.2867, 50.6527],
            description: 'Waterfront villa in Amwaj Islands',
            currency: 'BHD',
            reference_number: "AM78901"
        },
        {
            id: 12,
            title: "Contemporary Villa in Budaiya",
            price: 350000,
            location: "Budaiya",
            bedrooms: 5,
            bathrooms: 4,
            area: 380,
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Villa",
            type_name: "Villa",
            coordinates: [26.1567, 50.4234],
            description: 'Contemporary villa in Budaiya',
            currency: 'BHD',
            reference_number: "BD56789"
        },
        {
            id: 13,
            title: "Luxury Compound Villa in Saar",
            price: 550000,
            location: "Saar",
            bedrooms: 6,
            bathrooms: 5,
            area: 450,
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Villa",
            type_name: "Villa",
            coordinates: [26.1795, 50.4915],
            description: 'Luxury compound villa in Saar',
            currency: 'BHD',
            reference_number: "SR98765"
        },

        // LANDS
        {
            id: 16,
            title: "Residential Land in Sehla",
            price: 180000,
            location: "Sehla",
            bedrooms: 0,
            bathrooms: 0,
            area: 500,
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Land",
            type_name: "Land",
            coordinates: [26.2285, 50.5327],
            description: 'Residential land in Sehla',
            currency: 'BHD',
            reference_number: "SH66778"
        },
        {
            id: 17,
            title: "Commercial Land in Tubli",
            price: 320000,
            location: "Tubli",
            bedrooms: 0,
            bathrooms: 0,
            area: 800,
            image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Land",
            type_name: "Land",
            coordinates: [26.1987, 50.6234],
            description: 'Commercial land in Tubli',
            currency: 'BHD',
            reference_number: "TB88990"
        },
        {
            id: 18,
            title: "Prime Land in Hamala",
            price: 220000,
            location: "Hamala",
            bedrooms: 0,
            bathrooms: 0,
            area: 600,
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Land",
            type_name: "Land",
            coordinates: [26.1456, 50.4678],
            description: 'Prime land in Hamala',
            currency: 'BHD',
            reference_number: "HM33445"
        },

        // Additional Properties
        {
            id: 14,
            title: "Family Villa in Janabiyah",
            price: 280000,
            location: "Janabiyah",
            bedrooms: 4,
            bathrooms: 3,
            area: 320,
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Villa",
            type_name: "Villa",
            coordinates: [26.1832, 50.5092],
            description: 'Family villa in Janabiyah',
            currency: 'BHD',
            reference_number: "JN12345"
        },
        {
            id: 15,
            title: "Modern Townhouse in Isa Town",
            price: 150000,
            location: "Isa Town",
            bedrooms: 3,
            bathrooms: 2,
            area: 200,
            image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Townhouse",
            type_name: "Townhouse",
            coordinates: [26.1732, 50.5492],
            description: 'Modern townhouse in Isa Town',
            currency: 'BHD',
            reference_number: "IT67890"
        },
        {
            id: 19,
            title: "Cozy 1BR Apartment for Rent in Hoora",
            price: 350,
            location: "Hoora",
            bedrooms: 1,
            bathrooms: 1,
            area: 75,
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Rent",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2185, 50.5960],
            description: 'Cozy 1-bedroom apartment for rent in Hoora',
            currency: 'BHD',
            reference_number: "HR11223"
        },
        {
            id: 20,
            title: "3BR Apartment for Rent in Gudaibiya",
            price: 550,
            location: "Gudaibiya",
            bedrooms: 3,
            bathrooms: 2,
            area: 140,
            image: "https://images.unsplash.com/photo-1502672260066-6bc358fc623e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Rent",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2085, 50.5960],
            description: '3-bedroom apartment for rent in Gudaibiya',
            currency: 'BHD',
            reference_number: "GD44556"
        },
        {
            id: 21,
            title: "Luxury Villa for Rent in Budaiya",
            price: 1500,
            location: "Budaiya",
            bedrooms: 5,
            bathrooms: 4,
            area: 400,
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Rent",
            type: "Villa",
            type_name: "Villa",
            coordinates: [26.1532, 50.4592],
            description: 'Luxury 5-bedroom villa for rent in Budaiya',
            currency: 'BHD',
            reference_number: "BD77889"
        },
        {
            id: 22,
            title: "Spacious Apartment in Sanabis",
            price: 95000,
            location: "Sanabis",
            bedrooms: 2,
            bathrooms: 2,
            area: 130,
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2379, 50.5777],
            description: 'Spacious 2-bedroom apartment in Sanabis',
            currency: 'BHD',
            reference_number: "SN22334"
        },
        {
            id: 23,
            title: "Executive 4BR Apartment in Seef",
            price: 180000,
            location: "Seef",
            bedrooms: 4,
            bathrooms: 3,
            area: 220,
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Sale",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2479, 50.5477],
            description: 'Executive 4-bedroom apartment in Seef',
            currency: 'BHD',
            reference_number: "SF55667"
        },
        {
            id: 24,
            title: "2BR Apartment for Rent in Busaiteen",
            price: 400,
            location: "Busaiteen",
            bedrooms: 2,
            bathrooms: 2,
            area: 115,
            image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Rent",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2372, 50.6214],
            description: '2-bedroom apartment for rent in Busaiteen',
            currency: 'BHD',
            reference_number: "BS88990"
        },
        {
            id: 25,
            title: "Modern Studio in Hidd",
            price: 280,
            location: "Hidd",
            bedrooms: 1,
            bathrooms: 1,
            area: 55,
            image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            for_type: "For Rent",
            type: "Apartment",
            type_name: "Apartment",
            coordinates: [26.2672, 50.6314],
            description: 'Modern studio in Hidd',
            currency: 'BHD',
            reference_number: "HD99001"
        }
    ];
    
    console.log(`✅ Loaded ${mockProperties.length} properties for map from MOCK DATA`);
    return mockProperties;
}

// Display properties on map
function displayProperties(propertiesToShow = null) {
    // Use filtered properties if provided, otherwise show all
    const properties = propertiesToShow || propertiesData;
    
    // Clear existing markers
    propertyMarkers.forEach(marker => marker.setMap(null));
    propertyMarkers = [];
    
    // Update sidebar with properties
    updatePropertySidebar(properties);
    
    // Explicitly update property count to ensure it's correct
    updatePropertyCount(properties.length);

    // Add property markers using area coordinates (for privacy)
    properties.forEach(property => {
        // Map property location to area coordinates
        const locationKey = property.location.toLowerCase().trim();
        
        // Try to find area using the comprehensive area mapping
        let areaCoords = null;
        
        // First try direct lookup
        if (areaCoordinates[locationKey]) {
            areaCoords = areaCoordinates[locationKey];
        } else if (typeof findAreaByName !== 'undefined') {
            // Use the smart search from area-mapping.js
            const foundArea = findAreaByName(property.location);
            if (foundArea && foundArea.coordinates) {
                areaCoords = [foundArea.coordinates.lat, foundArea.coordinates.lng];
            }
        }
        
        // Skip if area not found in mapping
        if (!areaCoords) {
            console.warn(`⚠️ Area not found in mapping: ${property.location}`);
            return;
        }
        
        // Add small random offset to prevent overlapping markers in same area (±0.005 degrees ~ 500m)
        const randomOffsetLat = (Math.random() - 0.5) * 0.01;
        const randomOffsetLng = (Math.random() - 0.5) * 0.01;
        
        // Format price for marker display
        const priceDisplay = property.price < 1000 
            ? property.price.toString() 
            : `${Math.round(property.price / 1000)}K`;
        
        const marker = new google.maps.Marker({
            position: { 
                lat: areaCoords[0] + randomOffsetLat, 
                lng: areaCoords[1] + randomOffsetLng 
            },
            map: map,
            title: property.title,
            icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="gradient-${property.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#FFE000;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#FFC700;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <path d="M20 0C8.954 0 0 8.954 0 20c0 11.046 20 30 20 30s20-18.954 20-30C40 8.954 31.046 0 20 0z" fill="url(#gradient-${property.id})" stroke="#0F1A2E" stroke-width="2"/>
                        <circle cx="20" cy="20" r="10" fill="white"/>
                        <text x="20" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" fill="#0F1A2E" font-weight="bold">${priceDisplay}</text>
                    </svg>
                `)}`,
                scaledSize: new google.maps.Size(40, 50),
                anchor: new google.maps.Point(20, 50)
            }
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: createInfoWindowContent(property)
        });

        marker.addListener('click', () => {
            // Close other info windows
            propertyMarkers.forEach(m => {
                if (m.infoWindow) m.infoWindow.close();
            });
            
            infoWindow.open(map, marker);
            marker.infoWindow = infoWindow;
        });

        // Store reference to info window
        marker.infoWindow = infoWindow;
        propertyMarkers.push(marker);
    });
    
    console.log(`✅ Displayed ${properties.length} property markers on map`);
}

// Create info window content
function createInfoWindowContent(property) {
    return `
        <div style="max-width: 280px; font-family: 'Inter', sans-serif;">
            <div style="position: relative; margin-bottom: 12px; border-radius: 8px; overflow: hidden;">
                <img src="${property.image}" alt="${property.title}" 
                     style="width: 100%; height: 140px; object-fit: cover; display: block;">
                <div style="position: absolute; top: 8px; right: 8px; background: rgba(15, 26, 46, 0.9); backdrop-filter: blur(10px); color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;">
                    ${property.for_type}
                </div>
            </div>
            
            <h4 style="margin: 0 0 8px 0; color: #0F1A2E; font-size: 16px; font-weight: 700; line-height: 1.3;">${property.title}</h4>
            
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span style="color: #6b7280; font-size: 13px; font-weight: 500;">${property.location}</span>
            </div>
            
            <div style="display: flex; gap: 12px; margin-bottom: 12px; padding: 10px; background: #f8fafc; border-radius: 8px;">
                ${property.bedrooms ? `
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F1A2E" stroke-width="2">
                            <path d="M3 9v12h18V9"></path>
                            <path d="M3 9l2-7h14l2 7"></path>
                            <rect x="3" y="9" width="18" height="4"></rect>
                        </svg>
                        <span style="font-size: 12px; color: #374151; font-weight: 600;">${property.bedrooms} Bed</span>
                    </div>
                ` : ''}
                ${property.bathrooms ? `
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F1A2E" stroke-width="2">
                            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                            <path d="M3 12h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z"></path>
                        </svg>
                        <span style="font-size: 12px; color: #374151; font-weight: 600;">${property.bathrooms} Bath</span>
                    </div>
                ` : ''}
                <div style="display: flex; align-items: center; gap: 5px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F1A2E" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                        <path d="M9 3v18"></path>
                        <path d="M3 9h18"></path>
                    </svg>
                    <span style="font-size: 12px; color: #374151; font-weight: 600;">${property.area} m²</span>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding: 12px; background: linear-gradient(135deg, #FFE000 0%, #FFC700 100%); border-radius: 8px;">
                <div>
                    <div style="font-size: 11px; color: #0F1A2E; font-weight: 600; opacity: 0.8; margin-bottom: 2px;">PRICE</div>
                    <div style="font-weight: 800; color: #0F1A2E; font-size: 20px;">
                        ${property.price.toLocaleString()} 
                        <span style="font-size: 13px; font-weight: 700;">BHD</span>
                    </div>
                    ${property.for_type.toLowerCase().includes('rent') ? '<div style="font-size: 10px; color: #0F1A2E; font-weight: 600; opacity: 0.7;">per month</div>' : ''}
                </div>
            </div>
            
            <button onclick="viewPropertyDetails(${property.id})" 
                    style="width: 100%; background: linear-gradient(135deg, #0F1A2E 0%, #1A2A45 100%); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(15, 26, 46, 0.2);"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(15, 26, 46, 0.3)';"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(15, 26, 46, 0.2)';">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View Property
            </button>
        </div>
    `;
}

// View property details - navigates to property-details.html
function viewPropertyDetails(propertyId) {
    const property = propertiesData.find(p => p.id === propertyId);
    if (property) {
        try {
            // Expose current properties list so the property-details modal helper can find it
            window.carltonProperties = window.carltonProperties || {};
            window.carltonProperties.properties = propertiesData;

            // If the property details modal helper is available, open the modal
            if (typeof window.showPropertyDetails === 'function') {
                window.showPropertyDetails(propertyId);
                return;
            }
        } catch (err) {
            console.warn('Could not open property details modal, falling back to navigation', err);
        }

        // Fallback: navigate to property-details page with ID
        window.location.href = `property-details.html?id=${propertyId}`;
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Category and Property Type Management
    const categoryFilter = document.getElementById('category-filter');
    const typeFilter = document.getElementById('property-type-filter');
    const bedroomsGroup = document.getElementById('bedrooms-filter-group');
    
    // Define property types by category
    const residentialTypes = ['apartment', 'villa', 'compound'];
    const commercialTypes = ['factory', 'medical', 'building', 'office', 'shop', 'store', 'land-planing', 'farm', 'project'];
    const neutralTypes = ['land']; // Can be both residential or commercial
    
    // Category filter - update property type options
    if (categoryFilter && typeFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const currentType = typeFilter.value;
            
            // Get all type options
            const allOptions = typeFilter.querySelectorAll('option');
            
            if (selectedCategory === 'residential') {
                // Show only residential types
                allOptions.forEach(option => {
                    if (option.value === 'all' || residentialTypes.includes(option.value) || neutralTypes.includes(option.value)) {
                        option.style.display = 'block';
                    } else {
                        option.style.display = 'none';
                    }
                });
                
                // Reset type if current selection is not residential
                if (currentType && currentType !== 'all' && !residentialTypes.includes(currentType) && !neutralTypes.includes(currentType)) {
                    typeFilter.value = 'all';
                }
            } else if (selectedCategory === 'commercial') {
                // Show only commercial types
                allOptions.forEach(option => {
                    if (option.value === 'all' || commercialTypes.includes(option.value) || neutralTypes.includes(option.value)) {
                        option.style.display = 'block';
                    } else {
                        option.style.display = 'none';
                    }
                });
                
                // Reset type if current selection is not commercial
                if (currentType && currentType !== 'all' && !commercialTypes.includes(currentType) && !neutralTypes.includes(currentType)) {
                    typeFilter.value = 'all';
                }
            } else {
                // Show all types
                allOptions.forEach(option => {
                    option.style.display = 'block';
                });
            }
        });
    }
    
    // Property type filter - hide bedrooms for non-residential properties
    const nonResidentialTypes = ['factory', 'land', 'medical', 'building', 'office', 'shop', 'store', 'compound', 'land-planing', 'farm', 'project'];
    
    if (typeFilter && bedroomsGroup) {
        typeFilter.addEventListener('change', function() {
            const selectedType = this.value;
            
            if (selectedType !== 'all' && nonResidentialTypes.includes(selectedType)) {
                // Hide bedrooms filter for non-residential properties
                bedroomsGroup.style.display = 'none';
            } else {
                // Show bedrooms filter for residential properties
                bedroomsGroup.style.display = 'flex';
            }
        });
    }
    
    // Location dropdown change
    const locationSelect = document.getElementById('map-location');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            const selectedLocation = this.value;
            const center = areaCoordinates[selectedLocation] || areaCoordinates.amwaj;
            map.setCenter({ lat: center[0], lng: center[1] });
            map.setZoom(15);
            performSearch(); // Filter properties by location
        });
    }
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', performSearch);
    }
    
    // Property type filter
    if (typeFilter) {
        const originalListener = typeFilter.onchange;
        typeFilter.addEventListener('change', performSearch);
    }
    
    // Listing type filter
    const listingTypeFilter = document.getElementById('listing-type-filter');
    if (listingTypeFilter) {
        listingTypeFilter.addEventListener('change', performSearch);
    }
    
    // Bedrooms filter
    const bedroomsFilter = document.getElementById('bedrooms-filter');
    if (bedroomsFilter) {
        bedroomsFilter.addEventListener('change', performSearch);
    }
    
    // Bathrooms filter
    const bathroomsFilter = document.getElementById('bathrooms-filter');
    if (bathroomsFilter) {
        bathroomsFilter.addEventListener('change', performSearch);
    }

    // Search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }
    
    // Property search input - trigger on Enter key
    const propertySearch = document.getElementById('property-search');
    if (propertySearch) {
        propertySearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearAllFilters();
        });
    }

    // Size unit toggle (m² <-> ft²)
    const sizeFtToggle = document.getElementById('size-ft-toggle');
    const sizeFromLabel = document.getElementById('size-from-label');
    const sizeToLabel = document.getElementById('size-to-label');
    const sizeFromInput = document.getElementById('adv-size-from');
    const sizeToInput = document.getElementById('adv-size-to');
    
    if (sizeFtToggle && sizeFromLabel && sizeToLabel) {
        sizeFtToggle.addEventListener('change', function() {
            const isSquareFeet = this.checked;
            
            if (isSquareFeet) {
                // Convert to square feet
                sizeFromLabel.textContent = 'Size From (ft²)';
                sizeToLabel.textContent = 'Size To (ft²)';
                
                // Convert existing values from m² to ft² (1 m² = 10.764 ft²)
                if (sizeFromInput && sizeFromInput.value) {
                    const m2Value = parseFloat(sizeFromInput.value);
                    sizeFromInput.value = Math.round(m2Value * 10.764);
                }
                if (sizeToInput && sizeToInput.value) {
                    const m2Value = parseFloat(sizeToInput.value);
                    sizeToInput.value = Math.round(m2Value * 10.764);
                }
            } else {
                // Convert to square meters
                sizeFromLabel.textContent = 'Size From (m²)';
                sizeToLabel.textContent = 'Size To (m²)';
                
                // Convert existing values from ft² to m² (1 ft² = 0.0929 m²)
                if (sizeFromInput && sizeFromInput.value) {
                    const ft2Value = parseFloat(sizeFromInput.value);
                    sizeFromInput.value = Math.round(ft2Value * 0.0929);
                }
                if (sizeToInput && sizeToInput.value) {
                    const ft2Value = parseFloat(sizeToInput.value);
                    sizeToInput.value = Math.round(ft2Value * 0.0929);
                }
            }
        });
    }

    // Price range inputs - trigger search on change
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (minPriceInput) {
        minPriceInput.addEventListener('change', performSearch);
    }
    if (maxPriceInput) {
        maxPriceInput.addEventListener('change', performSearch);
    }
    
    // Advanced size inputs - trigger search on change
    const advSizeFromInput = document.getElementById('adv-size-from');
    const advSizeToInput = document.getElementById('adv-size-to');
    
    if (advSizeFromInput) {
        advSizeFromInput.addEventListener('change', performSearch);
    }
    if (advSizeToInput) {
        advSizeToInput.addEventListener('change', performSearch);
    }

    // Property type selector
    const propertyTypeSelect = document.getElementById('property-type');
    if (propertyTypeSelect) {
        propertyTypeSelect.addEventListener('change', filterProperties);
    }
    
    // Amenity checkboxes
    const hospitalCheckbox = document.getElementById('show-hospitals');
    const schoolCheckbox = document.getElementById('show-schools');
    
    if (hospitalCheckbox) {
        hospitalCheckbox.addEventListener('change', () => toggleAmenityDisplay('hospitals'));
    }
    
    if (schoolCheckbox) {
        schoolCheckbox.addEventListener('change', () => toggleAmenityDisplay('schools'));
    }
    
    // Sort dropdown
    const sortOptions = document.getElementById('sort-options');
    if (sortOptions) {
        sortOptions.addEventListener('change', function() {
            console.log('Sort changed to:', this.value);
            performSearch(); // Re-run search with new sort
        });
    }
    
    // Amenity tab switching
    const amenityTabs = document.querySelectorAll('.amenity-tab');
    amenityTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all tabs and contents
            amenityTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.amenity-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const content = document.getElementById(`${category}-content`);
            if (content) {
                content.classList.add('active');
            }
        });
    });
    
    // Collapsible sections
    const toggleButtons = document.querySelectorAll('.section-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.id.replace('-toggle', '-content');
            const content = document.getElementById(targetId);
            
            if (content) {
                const isActive = content.classList.contains('active');
                
                if (isActive) {
                    content.classList.remove('active');
                    this.classList.remove('active');
                } else {
                    content.classList.add('active');
                    this.classList.add('active');
                }
            }
        });
    });
}

// Perform search based on filters
function performSearch() {
    console.log('🔍 Performing map search...');
    
    // Get all filter values
    const searchTerm = document.getElementById('property-search')?.value.toLowerCase() || '';
    const location = document.getElementById('map-location')?.value || 'all';
    const category = document.getElementById('category-filter')?.value || 'all';
    const propertyType = document.getElementById('property-type-filter')?.value || 'all';
    const listingType = document.getElementById('listing-type-filter')?.value || 'all';
    const bedroomsValue = document.getElementById('bedrooms-filter')?.value || 'all';
    const bathroomsValue = document.getElementById('bathrooms-filter')?.value || 'all';
    const bedrooms = bedroomsValue === 'all' ? '' : bedroomsValue;
    const bathrooms = bathroomsValue === 'all' ? '' : bathroomsValue;
    const minPrice = parseInt(document.getElementById('min-price')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price')?.value) || Infinity;
    
    // Advanced filters - Size (check if in ft² or m²)
    const sizeFtToggle = document.getElementById('size-ft-toggle');
    const isSquareFeet = sizeFtToggle ? sizeFtToggle.checked : false;
    let minAreaInput = parseInt(document.getElementById('adv-size-from')?.value) || 0;
    let maxAreaInput = parseInt(document.getElementById('adv-size-to')?.value) || Infinity;
    
    // Convert to m² if input is in ft²
    const minArea = isSquareFeet ? Math.round(minAreaInput * 0.0929) : minAreaInput;
    const maxArea = isSquareFeet && maxAreaInput !== Infinity ? Math.round(maxAreaInput * 0.0929) : maxAreaInput;
    
    console.log('Search filters:', { 
        searchTerm, location, category, propertyType, listingType, 
        bedrooms, bathrooms, minPrice, maxPrice, minArea, maxArea, isSquareFeet 
    });

    // Filter properties based on criteria
    const filteredProperties = propertiesData.filter(property => {
        // Search term filter
        const matchesSearch = !searchTerm || 
            property.title.toLowerCase().includes(searchTerm) ||
            property.location.toLowerCase().includes(searchTerm) ||
            (property.description && property.description.toLowerCase().includes(searchTerm));
        
        // Location filter
        const matchesLocation = location === 'all' || 
            property.location.toLowerCase() === location.toLowerCase();
        
        // Category filter (residential/commercial)
        let matchesCategory = true;
        if (category !== 'all') {
            const residentialTypes = ['apartment', 'villa', 'compound'];
            const commercialTypes = ['factory', 'medical', 'building', 'office', 'shop', 'store', 'land-planing', 'farm', 'project'];
            const propertyTypeNormalized = property.type?.toLowerCase() || '';
            
            if (category === 'residential') {
                matchesCategory = residentialTypes.includes(propertyTypeNormalized);
            } else if (category === 'commercial') {
                matchesCategory = commercialTypes.includes(propertyTypeNormalized);
            }
        }
        
        // Property type filter
        const matchesType = propertyType === 'all' || 
            property.type.toLowerCase() === propertyType.toLowerCase();
        
        // Listing type filter (rent/sale)
        const matchesListingType = listingType === 'all' || 
            (listingType === 'sale' && property.for_type.toLowerCase().includes('sale')) ||
            (listingType === 'rent' && property.for_type.toLowerCase().includes('rent'));
        
        // Bedrooms filter
        const matchesBedrooms = !bedrooms || 
            (property.bedrooms && property.bedrooms >= parseInt(bedrooms));
        
        // Bathrooms filter
        const matchesBathrooms = !bathrooms || 
            (property.bathrooms && property.bathrooms >= parseInt(bathrooms));
        
        // Price filter
        const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
        
        // Area filter (property.area is in m²)
        const matchesArea = (!property.area || (property.area >= minArea && property.area <= maxArea));

        return matchesSearch && matchesLocation && matchesCategory && 
               matchesType && matchesListingType && matchesBedrooms && 
               matchesBathrooms && matchesPrice && matchesArea;
    });

    console.log(`Found ${filteredProperties.length} properties matching criteria`);
    
    // Apply sorting
    const sortedProperties = sortProperties(filteredProperties);
    
    // Update map and sidebar with filtered and sorted properties
    displayProperties(sortedProperties);
    
    // Update property count
    updatePropertyCount(sortedProperties.length);
    
    // Show notification
    showMapSearchNotification(sortedProperties.length);
}

// Display filtered properties
// Render property card HTML
function renderPropertyCard(property) {
    return `
        <div class="property-card" data-property-id="${property.id}" onclick="highlightPropertyOnMap(${property.id})">
            <div class="property__image-container">
                <img src="${property.image}" alt="${property.title}" class="property__image">
                <div class="property__type-badge">${property.for_type}</div>
            </div>
            <div class="property__content">
                <h3 class="property__title">${property.title}</h3>
                <div class="property__location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
                <div class="property__details">
                    ${property.bedrooms ? `<span><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>` : ''}
                    ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>` : ''}
                    <span><i class="fas fa-ruler-combined"></i> ${property.area} sqm</span>
                </div>
                <div class="property__footer">
                    <span class="property__price">${property.price.toLocaleString()} <span style="font-size: 0.75em; font-weight: 600;">${property.currency || 'BHD'}</span>${property.for_type.toLowerCase().includes('rent') ? '/month' : ''}</span>
                    <button class="btn-view-details" onclick="event.stopPropagation(); viewPropertyDetails(${property.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Update property sidebar list
function updatePropertySidebar(properties) {
    const propertyListContainer = document.getElementById('property-list');
    const propertyCount = document.getElementById('property-count');
    
    if (!propertyListContainer) return;
    
    // Update property count
    if (propertyCount) {
        propertyCount.textContent = `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} found`;
    }
    
    if (properties.length === 0) {
        propertyListContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 48px; color: #cbd5e1; margin-bottom: 16px;"></i>
                <h4 style="color: #64748b; margin-bottom: 8px;">No Properties Found</h4>
                <p style="color: #94a3b8; font-size: 14px;">Try adjusting your search filters</p>
            </div>
        `;
        return;
    }
    
    propertyListContainer.innerHTML = properties.map(property => renderPropertyCard(property)).join('');
}

// Highlight property on map when clicked in sidebar
function highlightPropertyOnMap(propertyId) {
    const property = propertiesData.find(p => p.id === propertyId);
    if (!property) return;
    
    // Get area coordinates for the property location
    const locationKey = property.location.toLowerCase().trim();
    const areaCoords = areaCoordinates[locationKey];
    
    if (areaCoords && map) {
        // Smoothly center map on the area (not exact property location)
        map.panTo({ lat: areaCoords[0], lng: areaCoords[1] });
        
        // Set zoom level to show area context (13-14 is good for area view)
        map.setZoom(13.5);
        
        // Wait for map to pan, then open marker info window
        setTimeout(() => {
            // Find the corresponding marker and trigger its click event
            const marker = propertyMarkers.find(m => m.title === property.title);
            if (marker) {
                google.maps.event.trigger(marker, 'click');
            }
        }, 500); // Small delay to allow smooth pan animation
    } else {
        // If map not loaded, just try to open marker
        const marker = propertyMarkers.find(m => m.title === property.title);
        if (marker) {
            google.maps.event.trigger(marker, 'click');
        }
    }
}

// Filter properties (called on input change)
function filterProperties() {
    performSearch();
}

// Sort properties based on selected criteria
function sortProperties(properties) {
    const sortOption = document.getElementById('sort-options')?.value || 'relevance';
    
    // Create a copy to avoid mutating original array
    const sorted = [...properties];
    
    switch(sortOption) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'newest':
            // Assuming newer properties have higher IDs
            return sorted.sort((a, b) => b.id - a.id);
        case 'relevance':
        default:
            return sorted;
    }
}

// Display amenities on map
function displayAmenities() {
    // Display hospitals if checkbox is checked
    const showHospitals = document.getElementById('show-hospitals')?.checked;
    if (showHospitals) {
        displayAmenityType('hospitals');
    }
    
    // Display schools if checkbox is checked
    const showSchools = document.getElementById('show-schools')?.checked;
    if (showSchools) {
        displayAmenityType('schools');
    }
}

// Display specific amenity type
function displayAmenityType(type) {
    if (!amenitiesData[type]) {
        console.warn(`⚠️ No amenity data for type: ${type}`);
        return;
    }
    
    // Check if map is initialized
    if (!map) {
        console.warn(`⚠️ Map not initialized yet, cannot display ${type}`);
        return;
    }
    
    // Clear existing markers for this type
    if (amenityMarkers[type]) {
        amenityMarkers[type].forEach(marker => marker.setMap(null));
        amenityMarkers[type] = [];
    }
    
    console.log(`📍 Displaying ${amenitiesData[type].length} ${type} on map`);
    
    // Add new markers for this type
    amenitiesData[type].forEach(amenity => {
        const icon = createAmenityIcon(type);
        
        const marker = new google.maps.Marker({
            position: { lat: amenity.coordinates[0], lng: amenity.coordinates[1] },
            map: map,
            title: amenity.name,
            icon: icon,
            zIndex: 100 // Make sure amenities appear above properties
        });
        
        // Create info window for amenity
        const infoWindow = new google.maps.InfoWindow({
            content: createAmenityInfoWindow(amenity, type)
        });
        
        marker.addListener('click', () => {
            // Close other info windows
            if (amenityMarkers[type]) {
                amenityMarkers[type].forEach(m => {
                    if (m.infoWindow) m.infoWindow.close();
                });
            }
            propertyMarkers.forEach(m => {
                if (m.infoWindow) m.infoWindow.close();
            });
            
            infoWindow.open(map, marker);
            marker.infoWindow = infoWindow;
        });
        
        amenityMarkers[type].push(marker);
    });
    
    console.log(`✅ Displayed ${amenityMarkers[type].length} ${type} markers`);
}

// Create amenity icon
function createAmenityIcon(type) {
    const colors = {
        hospitals: '#ef4444', // Red
        schools: '#3b82f6'    // Blue
    };
    
    const icons = {
        hospitals: '🏥',
        schools: '🏫'
    };
    
    return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="${colors[type]}" stroke="white" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" font-size="16" fill="white">${icons[type]}</text>
            </svg>
        `)}`,
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
    };
}

// Create amenity info window content
function createAmenityInfoWindow(amenity, type) {
    const typeColors = {
        hospitals: '#ef4444',
        schools: '#3b82f6'
    };
    
    return `
        <div style="max-width: 200px; padding: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="background: ${typeColors[type]}; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                    ${type === 'hospitals' ? '🏥' : '🏫'}
                </div>
                <h4 style="margin: 0; color: #1f2937; font-size: 14px;">${amenity.name}</h4>
            </div>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; line-height: 1.4;">${amenity.description}</p>
            <div style="display: flex; align-items: center; gap: 4px;">
                <span style="background: ${amenity.type === 'Public' ? '#10b981' : '#f59e0b'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
                    ${amenity.type}
                </span>
                <span style="color: #6b7280; font-size: 11px; text-transform: capitalize;">${type.slice(0, -1)}</span>
            </div>
        </div>
    `;
}

// Toggle amenity display
function toggleAmenityDisplay(type) {
    const checkbox = document.getElementById(`show-${type}`);
    if (!checkbox) {
        console.warn(`⚠️ Checkbox not found for: show-${type}`);
        return;
    }
    
    console.log(`🔄 Toggle ${type}: ${checkbox.checked ? 'ON' : 'OFF'}`);
    
    if (checkbox.checked) {
        displayAmenityType(type);
    } else {
        // Hide markers for this type
        if (amenityMarkers[type]) {
            console.log(`🗑️ Hiding ${amenityMarkers[type].length} ${type} markers`);
            amenityMarkers[type].forEach(marker => marker.setMap(null));
            amenityMarkers[type] = [];
        }
    }
}

// Make functions globally accessible
window.initMap = initMap;
window.viewPropertyDetails = viewPropertyDetails;
window.toggleAmenityDisplay = toggleAmenityDisplay;

// Clear all filters
function clearAllFilters() {
    // Clear text inputs
    const propertySearch = document.getElementById('property-search');
    if (propertySearch) propertySearch.value = '';
    
    // Reset dropdowns to "all" or first option
    const mapLocation = document.getElementById('map-location');
    const categoryFilter = document.getElementById('category-filter');
    const propertyTypeFilter = document.getElementById('property-type-filter');
    const listingTypeFilter = document.getElementById('listing-type-filter');
    const bedroomsFilter = document.getElementById('bedrooms-filter');
    const bathroomsFilter = document.getElementById('bathrooms-filter');
    
    if (mapLocation) mapLocation.value = 'all';
    if (categoryFilter) categoryFilter.value = 'all';
    if (propertyTypeFilter) propertyTypeFilter.value = 'all';
    if (listingTypeFilter) listingTypeFilter.value = 'all';
    if (bedroomsFilter) bedroomsFilter.value = 'all';
    if (bathroomsFilter) bathroomsFilter.value = 'all';
    
    // Clear price inputs
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    
    // Clear advanced size inputs
    const advSizeFrom = document.getElementById('adv-size-from');
    const advSizeTo = document.getElementById('adv-size-to');
    if (advSizeFrom) advSizeFrom.value = '';
    if (advSizeTo) advSizeTo.value = '';
    
    // Reset size unit toggle to m²
    const sizeFtToggle = document.getElementById('size-ft-toggle');
    if (sizeFtToggle) sizeFtToggle.checked = false;
    
    // Clear facility checkboxes
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    // Reset map center to Bahrain
    if (map) {
        map.setCenter({ lat: 26.0667, lng: 50.5577 });
        map.setZoom(10.5);
    }
    
    // Reset and display all properties
    displayProperties(propertiesData);
    
    // Update property count
    updatePropertyCount(propertiesData.length);
    
    // Show notification
    showMapSearchNotification(propertiesData.length, true);
}

// Display all properties (reset)
function displayAllProperties() {
    if (typeof propertiesData !== 'undefined') {
        displayProperties(propertiesData);
        updatePropertyCount(propertiesData.length);
    }
}

// Update property count display
function updatePropertyCount(count) {
    const propertyCount = document.getElementById('property-count');
    if (propertyCount) {
        propertyCount.textContent = `${count} ${count === 1 ? 'property' : 'properties'} found`;
    }
    
    // Update location display
    const resultsLocation = document.getElementById('results-location');
    const locationSelect = document.getElementById('map-location');
    if (resultsLocation && locationSelect) {
        const selectedLocation = locationSelect.value;
        if (selectedLocation === 'all') {
            resultsLocation.textContent = 'All Areas';
        } else {
            // Capitalize location name properly
            const locationText = locationSelect.options[locationSelect.selectedIndex].text;
            resultsLocation.textContent = locationText;
        }
    }
}

// Show map search notification
function showMapSearchNotification(count, isReset = false) {
    // Remove existing notification
    const existingNotification = document.querySelector('.map-search-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'map-search-notification';
    notification.innerHTML = `
        <i class="fas ${isReset ? 'fa-redo' : 'fa-check-circle'}"></i>
        <span>${isReset ? 'Filters cleared' : `Found ${count} ${count === 1 ? 'property' : 'properties'}`}</span>
    `;
    
    // Add notification styles if not already added
    if (!document.getElementById('map-search-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'map-search-notification-styles';
        style.textContent = `
            .map-search-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 600;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .map-search-notification i {
                font-size: 1.25rem;
            }
            
            @media (max-width: 768px) {
                .map-search-notification {
                    top: 80px;
                    right: 10px;
                    left: 10px;
                    padding: 0.875rem 1rem;
                    font-size: 0.9rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Load properties immediately when page loads (don't wait for Google Maps)
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Page loaded, loading properties...');
    
    // Load properties data immediately
    propertiesData = await loadMapProperties();
    console.log(`✅ Loaded ${propertiesData.length} properties`);
    
    // Update sidebar with properties
    updatePropertySidebar(propertiesData);
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Wait for Google Maps to load (with timeout)
    setTimeout(() => {
        if (!map) {
            console.warn('⚠️ Google Maps failed to load, but properties are still displayed in sidebar');
            
            // Show fallback message in map container
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                mapContainer.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f1f5f9; padding: 40px; text-align: center;">
                        <i class="fas fa-map-marked-alt" style="font-size: 64px; color: #cbd5e1; margin-bottom: 20px;"></i>
                        <h3 style="color: #64748b; margin-bottom: 10px;">Map Unavailable</h3>
                        <p style="color: #94a3b8;">The map could not be loaded. You can still browse properties in the sidebar.</p>
                    </div>
                `;
            }
        }
    }, 3000); // Wait 3 seconds for Google Maps to load
});