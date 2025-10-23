/**
 * Search Persistence Utility
 * Saves and restores search queries and filters between pages
 * Allows users to navigate between index and map while maintaining their search context
 */

class SearchPersistence {
    constructor() {
        this.storageKey = 'carlton_search_state';
        this.expirationTime = 30 * 60 * 1000; // 30 minutes
    }

    /**
     * Save current search state to localStorage
     */
    saveSearchState(state) {
        const searchState = {
            ...state,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(searchState));
            console.log('Search state saved:', searchState);
        } catch (error) {
            console.error('Failed to save search state:', error);
        }
    }

    /**
     * Get saved search state from localStorage
     */
    getSearchState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) return null;

            const searchState = JSON.parse(saved);
            
            // Check if expired
            if (Date.now() - searchState.timestamp > this.expirationTime) {
                this.clearSearchState();
                return null;
            }

            console.log('Search state restored:', searchState);
            return searchState;
        } catch (error) {
            console.error('Failed to get search state:', error);
            return null;
        }
    }

    /**
     * Clear search state
     */
    clearSearchState() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Search state cleared');
        } catch (error) {
            console.error('Failed to clear search state:', error);
        }
    }

    /**
     * Update specific field in search state
     */
    updateField(fieldName, value) {
        const currentState = this.getSearchState() || {};
        currentState[fieldName] = value;
        this.saveSearchState(currentState);
    }

    /**
     * Capture current search state from form elements
     */
    captureCurrentState() {
        const state = {};

        // Property search text
        const searchInput = document.getElementById('property-search');
        if (searchInput) {
            state.searchText = searchInput.value;
        }

        // Location
        const locationSelect = document.getElementById('map-location');
        if (locationSelect) {
            state.location = locationSelect.value;
        }

        // Category
        const categorySelect = document.getElementById('category-filter');
        if (categorySelect) {
            state.category = categorySelect.value;
        }

        // Property Type
        const typeSelect = document.getElementById('property-type-filter');
        if (typeSelect) {
            state.propertyType = typeSelect.value;
        }

        // Listing Type (Rent/Sale)
        const listingTypeSelect = document.getElementById('listing-type-filter');
        if (listingTypeSelect) {
            state.listingType = listingTypeSelect.value;
        }

        // Price Range
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');
        if (minPrice && maxPrice) {
            state.priceRange = {
                min: minPrice.value,
                max: maxPrice.value
            };
        }

        // Bedrooms
        const bedroomsSelect = document.getElementById('bedrooms-filter');
        if (bedroomsSelect) {
            state.bedrooms = bedroomsSelect.value;
        }

        // Bathrooms
        const bathroomsSelect = document.getElementById('bathrooms-filter');
        if (bathroomsSelect) {
            state.bathrooms = bathroomsSelect.value;
        }

        // Advanced Features
        const furnished = document.getElementById('furnished');
        const parking = document.getElementById('parking');
        const balcony = document.getElementById('balcony');
        const garden = document.getElementById('garden');
        const pool = document.getElementById('pool');
        const gym = document.getElementById('gym');

        state.features = {
            furnished: furnished?.checked || false,
            parking: parking?.checked || false,
            balcony: balcony?.checked || false,
            garden: garden?.checked || false,
            pool: pool?.checked || false,
            gym: gym?.checked || false
        };

        // Area Size
        const minArea = document.getElementById('min-area');
        const maxArea = document.getElementById('max-area');
        if (minArea && maxArea) {
            state.areaSize = {
                min: minArea.value,
                max: maxArea.value
            };
        }

        // Map Display Options
        const showHospitals = document.getElementById('show-hospitals');
        const showSchools = document.getElementById('show-schools');
        state.mapOptions = {
            showHospitals: showHospitals?.checked || false,
            showSchools: showSchools?.checked || false
        };

        // Save the page user was on
        state.fromPage = window.location.pathname;

        this.saveSearchState(state);
        return state;
    }

    /**
     * Restore search state to form elements
     */
    restoreToForm() {
        const state = this.getSearchState();
        if (!state) return false;

        // Property search text
        const searchInput = document.getElementById('property-search');
        if (searchInput && state.searchText) {
            searchInput.value = state.searchText;
        }

        // Location
        const locationSelect = document.getElementById('map-location');
        if (locationSelect && state.location) {
            locationSelect.value = state.location;
        }

        // Category
        const categorySelect = document.getElementById('category-filter');
        if (categorySelect && state.category) {
            categorySelect.value = state.category;
        }

        // Property Type
        const typeSelect = document.getElementById('property-type-filter');
        if (typeSelect && state.propertyType) {
            typeSelect.value = state.propertyType;
        }

        // Listing Type
        const listingTypeSelect = document.getElementById('listing-type-filter');
        if (listingTypeSelect && state.listingType) {
            listingTypeSelect.value = state.listingType;
        }

        // Price Range
        if (state.priceRange) {
            const minPrice = document.getElementById('min-price');
            const maxPrice = document.getElementById('max-price');
            if (minPrice) minPrice.value = state.priceRange.min;
            if (maxPrice) maxPrice.value = state.priceRange.max;
        }

        // Bedrooms
        const bedroomsSelect = document.getElementById('bedrooms-filter');
        if (bedroomsSelect && state.bedrooms) {
            bedroomsSelect.value = state.bedrooms;
        }

        // Bathrooms
        const bathroomsSelect = document.getElementById('bathrooms-filter');
        if (bathroomsSelect && state.bathrooms) {
            bathroomsSelect.value = state.bathrooms;
        }

        // Advanced Features
        if (state.features) {
            const furnished = document.getElementById('furnished');
            const parking = document.getElementById('parking');
            const balcony = document.getElementById('balcony');
            const garden = document.getElementById('garden');
            const pool = document.getElementById('pool');
            const gym = document.getElementById('gym');

            if (furnished) furnished.checked = state.features.furnished;
            if (parking) parking.checked = state.features.parking;
            if (balcony) balcony.checked = state.features.balcony;
            if (garden) garden.checked = state.features.garden;
            if (pool) pool.checked = state.features.pool;
            if (gym) gym.checked = state.features.gym;
        }

        // Area Size
        if (state.areaSize) {
            const minArea = document.getElementById('min-area');
            const maxArea = document.getElementById('max-area');
            if (minArea) minArea.value = state.areaSize.min;
            if (maxArea) maxArea.value = state.areaSize.max;
        }

        // Map Display Options
        if (state.mapOptions) {
            const showHospitals = document.getElementById('show-hospitals');
            const showSchools = document.getElementById('show-schools');
            if (showHospitals) showHospitals.checked = state.mapOptions.showHospitals;
            if (showSchools) showSchools.checked = state.mapOptions.showSchools;
        }

        console.log('Search state restored to form');
        return true;
    }

    /**
     * Show notification that search was restored
     */
    showRestoredNotification() {
        const state = this.getSearchState();
        if (!state || !state.fromPage) return;

        const notification = document.createElement('div');
        notification.className = 'search-restored-notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Your previous search filters have been restored</span>
            <button onclick="searchPersistence.clearSearchState(); this.parentElement.remove();">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);

        // Add styles if not already present
        if (!document.getElementById('search-persistence-styles')) {
            const style = document.createElement('style');
            style.id = 'search-persistence-styles';
            style.textContent = `
                .search-restored-notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: linear-gradient(135deg, #0F1A2E 0%, #1A2A45 100%);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10001;
                    animation: slideInRight 0.3s ease-out;
                    border: 1px solid rgba(255, 224, 0, 0.2);
                }
                
                .search-restored-notification i.fa-info-circle {
                    color: #FFE000;
                    font-size: 18px;
                }
                
                .search-restored-notification button {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    transition: color 0.2s;
                }
                
                .search-restored-notification button:hover {
                    color: white;
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
                
                @media (max-width: 768px) {
                    .search-restored-notification {
                        top: 80px;
                        right: 10px;
                        left: 10px;
                        font-size: 13px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Create global instance
const searchPersistence = new SearchPersistence();

// Auto-restore on page load
window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are loaded
    setTimeout(() => {
        const restored = searchPersistence.restoreToForm();
        if (restored) {
            searchPersistence.showRestoredNotification();
            
            // Trigger search/filter if on map page
            if (window.location.pathname.includes('property-map')) {
                const applyButton = document.getElementById('apply-filters');
                if (applyButton) {
                    applyButton.click();
                }
            }
        }
    }, 500);
});

// Save state when navigating away
window.addEventListener('beforeunload', () => {
    searchPersistence.captureCurrentState();
});

// Make available globally
window.searchPersistence = searchPersistence;
