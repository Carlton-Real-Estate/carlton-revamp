// Carlton Listings Clone - JavaScript

// Single DOMContentLoaded listener to prevent multiple initializations
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Initializing Carlton Real Estate scripts...');
    
    // Category and Property Type Management
    const categoryFilter = document.getElementById('category-filter');
    const typeFilter = document.getElementById('type-filter');
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
                    if (option.value === '' || residentialTypes.includes(option.value) || neutralTypes.includes(option.value)) {
                        option.style.display = 'block';
                    } else {
                        option.style.display = 'none';
                    }
                });
                
                // Reset type if current selection is not residential
                if (currentType && !residentialTypes.includes(currentType) && !neutralTypes.includes(currentType)) {
                    typeFilter.value = '';
                }
            } else if (selectedCategory === 'commercial') {
                // Show only commercial types
                allOptions.forEach(option => {
                    if (option.value === '' || commercialTypes.includes(option.value) || neutralTypes.includes(option.value)) {
                        option.style.display = 'block';
                    } else {
                        option.style.display = 'none';
                    }
                });
                
                // Reset type if current selection is not commercial
                if (currentType && !commercialTypes.includes(currentType) && !neutralTypes.includes(currentType)) {
                    typeFilter.value = '';
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
            
            if (nonResidentialTypes.includes(selectedType)) {
                // Hide bedrooms filter for non-residential properties
                bedroomsGroup.style.display = 'none';
            } else {
                // Show bedrooms filter for residential properties
                bedroomsGroup.style.display = 'flex';
            }
        });
    }
    
    // Search tab functionality
    const searchTabs = document.querySelectorAll('.search-tab');
    searchTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            searchTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
        });
    });

    // Mobile hamburger menu toggle functionality
    const hamburger = document.getElementById('navbar-hamburger');
    const navbarMenu = document.getElementById('navbar-menu');
    
    if (hamburger && navbarMenu) {
        hamburger.addEventListener('click', function() {
            // Toggle active class on hamburger (for X animation)
            hamburger.classList.toggle('active');
            // Toggle active class on menu (to show/hide)
            navbarMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav item
        const navItems = navbarMenu.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navbarMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navbarMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnHamburger && navbarMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navbarMenu.classList.remove('active');
            }
        });
    }
    
    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotMinimize = document.getElementById('chatbot-minimize');
    
    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', function() {
            if (chatbotWindow.style.display === 'none' || !chatbotWindow.style.display) {
                chatbotWindow.style.display = 'flex';
            } else {
                chatbotWindow.style.display = 'none';
            }
        });
    }
    
    if (chatbotMinimize && chatbotWindow) {
        chatbotMinimize.addEventListener('click', function() {
            chatbotWindow.style.display = 'none';
        });
    }
    
    // Property card hover effects for new design
    const propertyCards = document.querySelectorAll('.card');
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-7px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Old mobile menu toggle functionality (legacy code - can be removed)
    const navbarToggler = document.querySelector('#mobile-menu-toggle');
    const oldNavbarMenu = document.querySelector('#navbarNav');
    
    if (navbarToggler && oldNavbarMenu) {
        navbarToggler.addEventListener('click', function() {
            oldNavbarMenu.classList.toggle('show');
            console.log('Mobile menu toggled');
        });
    }
    
    // Search form submission
    const searchForm = document.querySelector('.search-form-wrapper');
    if (searchForm) {
        const searchButton = searchForm.querySelector('.btn-primary');
        if (searchButton) {
            searchButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Here you would typically handle the search functionality
                console.log('Search initiated');
                
                // For testing purposes, show an alert
                alert('Search functionality - This is a clone for testing purposes!');
            });
        }
    }
    
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('show');
            }
        });
    }
    
    // Search Tab Functionality
    const searchTabs = document.querySelectorAll('.search-tab');
    
    searchTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            searchTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
        });
    });
    
    console.log('✅ Carlton Real Estate scripts initialized');
});

// Hover effects for cards (outside DOMContentLoaded as they use event delegation)
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Heart button functionality
document.querySelectorAll('.icons-img button:first-of-type').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-heart')) {
            icon.classList.remove('fa-heart');
            icon.classList.add('fa-heart-o');
            this.style.color = '#ff3232';
        } else {
            icon.classList.remove('fa-heart-o');
            icon.classList.add('fa-heart');
            this.style.color = '#ff3232';
        }
    });
});

// Share button functionality
document.querySelectorAll('.icons-img button:last-of-type').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: 'Property Listing',
                text: 'Check out this amazing property!',
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                alert('Property link copied to clipboard!');
            }).catch(() => {
                alert('Share functionality - Link: ' + url);
            });
        }
    });
});

// Property Map Integration
let map;
let propertyMarkers = [];
let activePropertyId = null;

// Property data from index page cards
const propertyData = [
    {
        id: 1,
        title: 'Residential Land in Sehla',
        price: 146114,
        type: 'land',
        location: 'Sehla',
        coordinates: [26.2285, 50.5327], // Sehla coordinates
        description: 'Prime residential land for sale in Sehla with excellent access to amenities and infrastructure...',
        bedrooms: '-',
        bathrooms: '-',
        area: 484.8,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        agent: {
            name: 'Abdulla Hasan',
            phone: '32319900',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=50&h=50&fit=crop&crop=face'
        },
        category: 'latest'
    },
    {
        id: 2,
        title: 'Luxury Villa in Juffair',
        price: 890000,
        type: 'villa',
        location: 'Juffair',
        coordinates: [26.2172, 50.6083], // Juffair coordinates
        description: 'Stunning luxury villa in prime Juffair location with modern amenities and spacious layout...',
        bedrooms: 4,
        bathrooms: 5,
        area: 380.5,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        agent: {
            name: 'Sarah Ahmed',
            phone: '33445566',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616c9ff4c34?ixlib=rb-4.0.3&w=50&h=50&fit=crop&crop=face'
        },
        category: 'villa'
    },
    {
        id: 3,
        title: 'Commercial Office in Diplomatic Area',
        price: 1850000,
        type: 'office',
        location: 'Diplomatic Area',
        coordinates: [26.2361, 50.5831], // Diplomatic Area coordinates
        description: 'Premium commercial office space in the heart of Diplomatic Area with excellent connectivity...',
        bedrooms: '-',
        bathrooms: 4,
        area: 425.2,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        agent: {
            name: 'Mohammed Ali',
            phone: '36789012',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=50&h=50&fit=crop&crop=face'
        },
        category: 'featured'
    },
    {
        id: 4,
        title: 'Modern Apartment in Amwaj Islands',
        price: 675000,
        type: 'apartment',
        location: 'Amwaj Islands',
        coordinates: [26.2867, 50.6527], // Amwaj Islands coordinates
        description: 'Contemporary apartment with stunning sea views and resort-style amenities in Amwaj Islands...',
        bedrooms: 2,
        bathrooms: 3,
        area: 195.8,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        agent: {
            name: 'Fatima Al-Zahra',
            phone: '34567890',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=50&h=50&fit=crop&crop=face'
        },
        category: 'latest'
    },
    {
        id: 5,
        title: 'Family House in Seef',
        price: 1200000,
        type: 'house',
        location: 'Seef',
        coordinates: [26.2479, 50.5477], // Seef coordinates
        description: 'Spacious family house in prestigious Seef district with garden and modern facilities...',
        bedrooms: 5,
        bathrooms: 4,
        area: 456.7,
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        agent: {
            name: 'Ahmed Hassan',
            phone: '37890123',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&w=50&h=50&fit=crop&crop=face'
        },
        category: 'villa'
    },
    {
        id: 6,
        title: 'Luxury Penthouse in Riffa',
        price: 2100000,
        type: 'penthouse',
        location: 'Riffa',
        coordinates: [26.1332, 50.5692], // Riffa coordinates
        description: 'Exclusive penthouse with panoramic views and premium finishes in upscale Riffa location...',
        bedrooms: 4,
        bathrooms: 5,
        area: 567.3,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        agent: {
            name: 'Khalid Al-Mahmood',
            phone: '38901234',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=50&h=50&fit=crop&crop=face'
        },
        category: 'hot'
    }
];

// View Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const gridViewBtn = document.getElementById('grid-view-btn');
    const mapViewBtn = document.getElementById('map-view-btn');
    const gridViewSection = document.querySelector('.main-content .container');
    const mapViewSection = document.getElementById('map-view-section');

    // Grid View Button
    gridViewBtn?.addEventListener('click', function() {
        gridViewBtn.classList.add('active');
        mapViewBtn.classList.remove('active');
        gridViewSection.style.display = 'grid';
        mapViewSection.style.display = 'none';
    });

    // Map View Button
    mapViewBtn?.addEventListener('click', function() {
        mapViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        gridViewSection.style.display = 'none';
        mapViewSection.style.display = 'block';
        
        // Initialize map when switching to map view
        setTimeout(() => {
            initPropertyMap();
        }, 100);
    });
});

// Initialize Property Map
function initPropertyMap() {
    // Don't initialize if map already exists
    if (map) {
        map.invalidateSize();
        return;
    }

    // Create map centered on Bahrain
    map = L.map('property-map', {
        zoomControl: false,
        tap: true,
        touchZoom: true,
        dragging: true,
        trackResize: true
    }).setView([26.2285, 50.5577], 12); // Center of Bahrain

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Clear existing markers
    propertyMarkers = [];

    // Add property markers
    addPropertyMarkers();

    // Update sidebar with properties
    displayPropertiesInMapSidebar();

    // Force map resize
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
        }
    }, 200);
}

// Add property markers to map
function addPropertyMarkers() {
    propertyData.forEach(property => {
        // Create price marker
        const markerIcon = L.divIcon({
            className: 'price-marker',
            html: `${property.price > 1000000 ? (property.price/1000000).toFixed(1) + 'M' : (property.price/1000).toFixed(0) + 'K'} BHD`,
            iconSize: [100, 35],
            iconAnchor: [50, 17]
        });

        // Create marker
        const marker = L.marker(property.coordinates, { icon: markerIcon })
            .addTo(map);

        // Add click event
        marker.on('click', () => {
            setActiveProperty(property.id);
            showPropertyPopup(property);
        });

        // Store marker reference
        propertyMarkers.push({ marker, propertyId: property.id });
    });
}

// Display properties in map sidebar
function displayPropertiesInMapSidebar() {
    const propertyList = document.getElementById('map-property-list');
    const propertyCount = document.getElementById('map-property-count');

    if (!propertyList) return;

    // Update count
    propertyCount.textContent = `${propertyData.length} properties`;

    // Clear existing content
    propertyList.innerHTML = '';

    // Add each property to sidebar
    propertyData.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        propertyCard.dataset.propertyId = property.id;

        propertyCard.innerHTML = `
            <div class="property-card-image">
                <img src="${property.image}" alt="${property.title}">
            </div>
            <div class="property-card-details">
                <div class="property-card-header">
                    <h3 class="property-card-title">${property.title}</h3>
                </div>
                <div class="property-card-location">${property.location}</div>
                <div class="property-card-specs">
                    <span>${property.bedrooms !== '-' ? property.bedrooms + ' bed' : 'N/A'}</span>
                    <span>${property.bathrooms !== '-' ? property.bathrooms + ' bath' : 'N/A'}</span>
                    <span>${property.area} sqm</span>
                </div>
                <div class="property-card-footer">
                    <div class="availability-info">Available</div>
                    <div class="property-card-price">
                        <span class="price-amount">${property.price > 1000000 ? (property.price/1000000).toFixed(2) + 'M' : (property.price/1000).toFixed(0) + 'K'} BHD</span>
                    </div>
                </div>
            </div>
        `;

        // Add click event
        propertyCard.addEventListener('click', () => {
            setActiveProperty(property.id);
            showPropertyPopup(property);
            map.setView(property.coordinates, 16);
        });

        propertyList.appendChild(propertyCard);
    });
}

// Set active property
function setActiveProperty(propertyId) {
    // Remove previous active states
    document.querySelectorAll('.property-card.active').forEach(card => {
        card.classList.remove('active');
    });

    document.querySelectorAll('.price-marker.active').forEach(marker => {
        marker.classList.remove('active');
    });

    // Set new active property
    activePropertyId = propertyId;

    // Highlight sidebar card
    const activeCard = document.querySelector(`[data-property-id="${propertyId}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
    }

    // Highlight map marker
    const activeMarkerData = propertyMarkers.find(m => m.propertyId === propertyId);
    if (activeMarkerData) {
        const markerElement = activeMarkerData.marker.getElement();
        if (markerElement) {
            markerElement.classList.add('active');
        }
    }
}

// Show property popup
function showPropertyPopup(property) {
    const popup = document.getElementById('property-popup');
    if (!popup) return;

    // Populate popup content
    document.getElementById('popup-image').src = property.image;
    document.getElementById('popup-title').textContent = property.title;
    document.getElementById('popup-price').textContent = `${property.price > 1000000 ? (property.price/1000000).toFixed(2) + ' Million' : (property.price/1000).toFixed(0) + 'K'} BHD`;
    document.getElementById('popup-specs').textContent = 
        `${property.bedrooms !== '-' ? property.bedrooms + ' bed' : 'N/A'} • ${property.bathrooms !== '-' ? property.bathrooms + ' bath' : 'N/A'} • ${property.area} sqm`;
    document.getElementById('popup-description').textContent = property.description;

    // Add agent info
    const agentDiv = document.getElementById('popup-agent');
    if (agentDiv && property.agent) {
        agentDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <img src="${property.agent.avatar}" alt="${property.agent.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                <div>
                    <div style="font-weight: 600; color: #1a1a1a;">${property.agent.name}</div>
                    <div style="font-size: 12px; color: #6b7280;">Property Agent</div>
                </div>
            </div>
        `;
    }

    // Update action buttons
    document.getElementById('popup-contact-btn').onclick = () => {
        if (property.agent) {
            window.open(`https://wa.me/${property.agent.phone}`, '_blank');
        }
    };

    document.getElementById('popup-details-btn').onclick = () => {
        // Scroll to the corresponding grid card
        mapViewBtn.classList.remove('active');
        gridViewBtn.classList.add('active');
        document.querySelector('.main-content .container').style.display = 'grid';
        document.getElementById('map-view-section').style.display = 'none';
        popup.style.display = 'none';

        // Scroll to the specific card
        setTimeout(() => {
            const targetCard = document.querySelector(`.card:nth-child(${property.id})`);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCard.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    targetCard.style.transform = '';
                }, 1000);
            }
        }, 100);
    };

    // Show popup
    popup.style.display = 'block';
}

// Map control listeners
document.addEventListener('click', function(e) {
    if (e.target.id === 'zoom-in' && map) {
        map.zoomIn();
    } else if (e.target.id === 'zoom-out' && map) {
        map.zoomOut();
    } else if (e.target.id === 'popup-close') {
        document.getElementById('property-popup').style.display = 'none';
    }
});

// Handle window resize for map
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (map) {
            map.invalidateSize();
        }
        if (searchMap) {
            searchMap.invalidateSize();
        }
    }, 100);
});

// Search Map Functionality
let searchMap;
let searchMapMarkers = [];

// Bahrain area coordinates
const bahrainAreas = {
    manama: { coords: [26.2285, 50.5860], zoom: 14, name: 'Manama' },
    juffair: { coords: [26.2172, 50.6083], zoom: 15, name: 'Juffair' },
    seef: { coords: [26.2479, 50.5477], zoom: 15, name: 'Seef' },
    amwaj: { coords: [26.2867, 50.6527], zoom: 14, name: 'Amwaj Islands' },
    riffa: { coords: [26.1332, 50.5692], zoom: 14, name: 'Riffa' },
    diplomatic: { coords: [26.2361, 50.5831], zoom: 15, name: 'Diplomatic Area' },
    sehla: { coords: [26.2285, 50.5327], zoom: 15, name: 'Sehla' },
    'hamad-town': { coords: [26.1951, 50.5144], zoom: 14, name: 'Hamad Town' }
};

// Search Map functionality removed - now using direct link to property-map.html

// Initialize Search Map
function initSearchMap() {
    if (searchMap) {
        searchMap.invalidateSize();
        return;
    }

    // Create search map centered on Bahrain
    searchMap = L.map('search-map', {
        zoomControl: true,
        tap: true,
        touchZoom: true,
        dragging: true,
        trackResize: true
    }).setView([26.2285, 50.5577], 11); // Center of Bahrain

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(searchMap);

    // Add property markers from our data
    addSearchMapMarkers();

    // Add area markers
    addAreaMarkers();

    // Force map resize
    setTimeout(() => {
        if (searchMap) {
            searchMap.invalidateSize();
        }
    }, 200);
}

// Add property markers to search map
function addSearchMapMarkers() {
    propertyData.forEach(property => {
        // Create category-based marker
        let markerClass = 'search-marker';
        if (property.type === 'villa' || property.category === 'villa') {
            markerClass += ' villa';
        } else if (property.type === 'apartment' || property.category === 'apartment') {
            markerClass += ' apartment';
        } else if (property.price > 1000000) {
            markerClass += ' sale';
        } else {
            markerClass += ' rent';
        }

        const markerIcon = L.divIcon({
            className: markerClass,
            html: `<div class="marker-content">
                <span class="marker-price">${property.price > 1000000 ? (property.price/1000000).toFixed(1) + 'M' : (property.price/1000).toFixed(0) + 'K'}</span>
                <span class="marker-type">${property.type}</span>
            </div>`,
            iconSize: [80, 40],
            iconAnchor: [40, 40]
        });

        const marker = L.marker(property.coordinates, { icon: markerIcon })
            .addTo(searchMap)
            .bindPopup(`
                <div class="search-popup">
                    <img src="${property.image}" alt="${property.title}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 8px;">
                    <h4 style="margin: 10px 0 5px 0;">${property.title}</h4>
                    <p style="color: #2fa89e; font-weight: 600; font-size: 16px;">${property.price > 1000000 ? (property.price/1000000).toFixed(2) + ' Million' : (property.price/1000).toFixed(0) + 'K'} BHD</p>
                    <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">${property.location}</p>
                    <p style="color: #374151; font-size: 13px;">${property.bedrooms !== '-' ? property.bedrooms + ' bed' : 'N/A'} • ${property.bathrooms !== '-' ? property.bathrooms + ' bath' : 'N/A'} • ${property.area} sqm</p>
                </div>
            `);

        searchMapMarkers.push(marker);
    });
}

// Add area markers to search map
function addAreaMarkers() {
    Object.entries(bahrainAreas).forEach(([key, area]) => {
        // Create area marker
        const areaIcon = L.divIcon({
            className: 'area-marker',
            html: `<div class="area-marker-content">
                <i class="fas fa-map-pin"></i>
                <span>${area.name}</span>
            </div>`,
            iconSize: [120, 30],
            iconAnchor: [60, 30]
        });

        L.marker(area.coords, { icon: areaIcon })
            .addTo(searchMap)
            .bindPopup(`
                <div style="text-align: center; padding: 10px;">
                    <h5 style="margin: 0 0 5px 0; color: #141a3c;">${area.name}</h5>
                    <p style="margin: 0; color: #6b7280; font-size: 13px;">Click area button to zoom</p>
                </div>
            `);
    });
}    // View property overlay functionality
    const overlayLinks = document.querySelectorAll('.overlay a');
    overlayLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('View property clicked');
            alert('Property details - This is a clone for testing purposes!');
        });
    });
    
    // Add loading effect for images
    const propertyImages = document.querySelectorAll('.img-overlay img');
    propertyImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            // Fallback for broken images
            this.src = 'https://via.placeholder.com/400x250?text=Property+Image';
        });
    });
    
});

// Utility function for number formatting (similar to original site)
function formatNumber(number) {
    if (typeof number === 'string') {
        const parts = number.split('.');
        if (parts[1] && parts[1] !== 'undefined') {
            return `<b>${parts[0]}</b>.<span class="decimal">${parts[1]}</span>`;
        }
    }
    return number;
}

// Initialize number formatting
document.addEventListener('DOMContentLoaded', function() {
    const numberElements = document.querySelectorAll('.price span:last-of-type');
    numberElements.forEach(element => {
        const formattedNumber = formatNumber(element.textContent);
        if (formattedNumber !== element.textContent) {
            element.innerHTML = formattedNumber;
        }
    });
    
    // Search map toggle functionality removed - now using direct link
});