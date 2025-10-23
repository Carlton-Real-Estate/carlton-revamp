// Properties Page - Load and display all properties by category
class PropertiesPageManager {
    constructor() {
        this.properties = [];
        this.init();
    }

    async init() {
        await this.loadProperties();
        this.displayAllCategories();
    }

    // Load properties from backend or fallback
    async loadProperties() {
        try {
            console.log('📁 Fetching properties from backend API...');
            const response = await fetch('http://localhost:8000/api/properties');
            const data = await response.json();
            
            if (data.success && data.data) {
                this.properties = data.data;
                console.log(`✅ Loaded ${this.properties.length} properties from backend`);
            } else {
                console.warn('⚠️ Backend returned no data, loading fallback');
                this.loadFallbackProperties();
            }
        } catch (error) {
            console.error('❌ Error fetching properties from backend:', error);
            console.log('📁 Loading fallback properties');
            this.loadFallbackProperties();
        }
    }

    // Fallback properties if backend fails
    loadFallbackProperties() {
        this.properties = [
            // Properties for SALE - Apartments
            {
                id: 1,
                title: "Luxury 2BR Apartment in Juffair",
                price: 85000,
                location: "Juffair",
                bedrooms: 2,
                bathrooms: 2,
                size: 120,
                image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Apartment",
                reference_number: "AJ45123"
            },
            {
                id: 2,
                title: "Modern 3BR Apartment in Seef",
                price: 120000,
                location: "Seef",
                bedrooms: 3,
                bathrooms: 2,
                size: 150,
                image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Apartment",
                reference_number: "SF78945"
            },
            {
                id: 3,
                title: "Spacious 4BR Penthouse in Diplomatic Area",
                price: 250000,
                location: "Diplomatic Area",
                bedrooms: 4,
                bathrooms: 3,
                size: 280,
                image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Apartment",
                reference_number: "DA12456"
            },
            {
                id: 4,
                title: "Sea View 2BR Apartment in Reef Island",
                price: 95000,
                location: "Reef Island",
                bedrooms: 2,
                bathrooms: 2,
                size: 135,
                image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Apartment",
                reference_number: "RI34567"
            },
            {
                id: 5,
                title: "Elegant 3BR Apartment in Manama",
                price: 105000,
                location: "Manama",
                bedrooms: 3,
                bathrooms: 2,
                size: 145,
                image_url: "https://images.unsplash.com/photo-1502672260066-6bc358fc623e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Apartment",
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
                size: 110,
                image_url: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Apartment",
                reference_number: "AD55678"
            },
            {
                id: 7,
                title: "Spacious 3BR Villa for Rent in Riffa",
                price: 800,
                location: "Riffa",
                bedrooms: 3,
                bathrooms: 3,
                size: 220,
                image_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Villa",
                reference_number: "RF23456"
            },
            {
                id: 8,
                title: "Modern Studio in Juffair for Rent",
                price: 300,
                location: "Juffair",
                bedrooms: 1,
                bathrooms: 1,
                size: 60,
                image_url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Apartment",
                reference_number: "JF67890"
            },
            {
                id: 9,
                title: "Luxury 4BR Villa for Rent in Saar",
                price: 1200,
                location: "Saar",
                bedrooms: 4,
                bathrooms: 4,
                size: 350,
                image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Villa",
                reference_number: "SR12345"
            },
            {
                id: 10,
                title: "2BR Apartment for Rent in Seef",
                price: 500,
                location: "Seef",
                bedrooms: 2,
                bathrooms: 2,
                size: 125,
                image_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Apartment",
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
                size: 300,
                image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Villa",
                reference_number: "AM78901"
            },
            {
                id: 12,
                title: "Contemporary Villa in Budaiya",
                price: 350000,
                location: "Budaiya",
                bedrooms: 5,
                bathrooms: 4,
                size: 380,
                image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Villa",
                reference_number: "BD56789"
            },
            {
                id: 13,
                title: "Luxury Compound Villa in Saar",
                price: 550000,
                location: "Saar",
                bedrooms: 6,
                bathrooms: 5,
                size: 450,
                image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Villa",
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
                size: 500,
                image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Land",
                reference_number: "SH66778"
            },
            {
                id: 17,
                title: "Commercial Land in Tubli",
                price: 320000,
                location: "Tubli",
                bedrooms: 0,
                bathrooms: 0,
                size: 800,
                image_url: "https://images.unsplash.com/photo-1464146072230-91cabc968266?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Land",
                reference_number: "TB88990"
            },
            {
                id: 18,
                title: "Prime Land in Hamala",
                price: 220000,
                location: "Hamala",
                bedrooms: 0,
                bathrooms: 0,
                size: 600,
                image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Land",
                reference_number: "HM12233"
            }
        ];
    }

    // Display all property categories
    displayAllCategories() {
        // Hide loading, show sections
        const loadingState = document.getElementById('loading-state');
        if (loadingState) loadingState.style.display = 'none';

        // Get categorized properties
        const saleProperties = this.properties.filter(p => p.for === 1 || p.for_name === 'Sale');
        const rentProperties = this.properties.filter(p => p.for === 2 || p.for_name === 'Rent');
        const villaProperties = this.properties.filter(p => p.type_name === 'Villa');
        const landProperties = this.properties.filter(p => p.type_name === 'Land');

        // Display each category with limited properties (5 each) and View All buttons
        this.displayCategory('sale-section', 'sale-properties', saleProperties.slice(0, 5), 'sale', saleProperties.length);
        this.displayCategory('rent-section', 'rent-properties', rentProperties.slice(0, 5), 'rent', rentProperties.length);
        this.displayCategory('villas-section', 'villa-properties', villaProperties.slice(0, 5), 'villas', villaProperties.length);
        this.displayCategory('lands-section', 'land-properties', landProperties.slice(0, 5), 'lands', landProperties.length);
    }

    // Display a category of properties
    displayCategory(sectionId, containerId, properties, category = '', totalCount = 0, showAll = false) {
        const section = document.getElementById(sectionId);
        const container = document.getElementById(containerId);

        if (!section || !container) return;

        if (properties.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        const html = properties.map(property => this.createPropertyCard(property)).join('');
        container.innerHTML = html;
        
        // Add scroll hint animation for mobile (only if not showing all and has multiple properties)
        if (!showAll && properties.length > 1 && window.innerWidth <= 768) {
            // Set up Intersection Observer to trigger animation when section is visible
            this.setupScrollHintObserver(container, section);
        }
        
        // Update View All button
        const viewAllBtn = section.querySelector('.view-all-btn');
        if (viewAllBtn) {
            // Show View All button if there are properties (even if <= 5) unless already showing all
            if (showAll) {
                viewAllBtn.style.display = 'none';
            } else if (totalCount > 0) {
                viewAllBtn.style.display = 'flex';
                viewAllBtn.innerHTML = 'View All <i class="fas fa-arrow-right"></i>';
                viewAllBtn.onclick = (e) => {
                    e.preventDefault();
                    this.viewAllCategory(category);
                };
            } else {
                viewAllBtn.style.display = 'none';
            }
        }
    }
    
    // Setup Intersection Observer for scroll hint animation
    setupScrollHintObserver(container, section) {
        // Check if already observed to avoid multiple observers
        if (section.dataset.scrollHintObserved === 'true') {
            return;
        }
        
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.3 // Trigger when 30% of section is visible
        };
        
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Section is visible, trigger animation
                    setTimeout(() => {
                        container.classList.remove('scroll-hint');
                        // Trigger reflow to restart animation
                        void container.offsetWidth;
                        container.classList.add('scroll-hint');
                        
                        // Remove class after animation completes
                        setTimeout(() => {
                            container.classList.remove('scroll-hint');
                        }, 4000);
                    }, 500); // Small delay after section becomes visible
                    
                    // Unobserve after first trigger
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(section);
        section.dataset.scrollHintObserved = 'true';
    }
    
    // View all properties in a category
    viewAllCategory(category) {
        const allSections = document.querySelectorAll('.property-category-section');
        
        let properties = [];
        let sectionId = '';
        let containerId = '';
        
        switch(category) {
            case 'sale':
                properties = this.properties.filter(p => p.for === 1 || p.for_name === 'Sale');
                sectionId = 'sale-section';
                containerId = 'sale-properties';
                break;
            case 'rent':
                properties = this.properties.filter(p => p.for === 2 || p.for_name === 'Rent');
                sectionId = 'rent-section';
                containerId = 'rent-properties';
                break;
            case 'villas':
                properties = this.properties.filter(p => p.type_name === 'Villa' || p.type === 'Villa');
                sectionId = 'villas-section';
                containerId = 'villa-properties';
                break;
            case 'lands':
                properties = this.properties.filter(p => p.type_name === 'Land' || p.type === 'Land');
                sectionId = 'lands-section';
                containerId = 'land-properties';
                break;
        }
        
        const expandedSection = document.getElementById(sectionId);
        
        // Collapse all other sections and move them to bottom
        allSections.forEach(section => {
            if (section.id === sectionId) {
                // Expanded section - show in grid view
                section.classList.add('expanded-view');
                section.classList.remove('collapsed-view');
                section.style.order = '1'; // Show first
            } else {
                // Collapsed sections - show at bottom
                section.classList.add('collapsed-view');
                section.classList.remove('expanded-view');
                section.style.order = '2'; // Show after expanded
            }
        });
        
        // Display the selected category with all properties in grid
        this.displayCategory(sectionId, containerId, properties, category, properties.length, true);
        
        // Update the property list container to grid layout
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add('grid-view');
        }
        
        // Add a "Show Less" button
        if (expandedSection) {
            const viewAllBtn = expandedSection.querySelector('.view-all-btn');
            if (viewAllBtn) {
                viewAllBtn.style.display = 'flex';
                viewAllBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Show Less';
                viewAllBtn.onclick = (e) => {
                    e.preventDefault();
                    this.showAllCategories();
                };
            }
        }
        
        // Scroll to the section
        expandedSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Show all categories with limited properties
    showAllCategories() {
        // Remove all expanded/collapsed classes and grid view
        document.querySelectorAll('.property-category-section').forEach(section => {
            section.classList.remove('expanded-view', 'collapsed-view');
            section.style.order = '';
        });
        
        document.querySelectorAll('.property-list').forEach(list => {
            list.classList.remove('grid-view');
        });
        
        this.displayAllCategories();
        
        // Scroll to properties section
        const propertiesSection = document.getElementById('properties-sections');
        propertiesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Create property card HTML
    createPropertyCard(property) {
        const price = property.price ? property.price.toLocaleString() : 'Price on request';
        const bedrooms = property.bedrooms || 0;
        const bathrooms = property.bathrooms || 0;
        const size = property.size || 0;
        const refId = property.reference_number || property.id || 'N/A';
        const location = property.location || property.area_name || 'Bahrain';
        
        // Check if property is land type (only show area/land size)
        const isLand = property.type_name === 'Land' || property.type === 'Land' || 
                       property.type === 'land' || property.type === 'land-planing';
        
        return `
            <a href="#" onclick="window.showPropertyDetails(${property.id}); return false;">
                <article class="property">
                    <header class="property__ref-info">
                        <div class="property__picture">
                            <img src="${property.image_url || property.main_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${property.title}">
                        </div>
                        <span class="property__reference">Ref: <strong>${refId}</strong></span>
                    </header>
                    
                    <section class="property__main-info">
                        <h3 class="property__title">${property.title}</h3>
                        <span class="property__price">${price} <span style="font-size: 0.75em; font-weight: 600;">BHD</span></span>
                        <span class="property__location">
                            <svg class="icon icon-location" xmlns="http://www.w3.org/2000/svg">
                                <use href="#icon-location"></use>
                            </svg>
                            ${location}
                        </span>
                    </section>
                    
                    <footer class="property__amenities">
                        ${isLand ? `
                            ${size > 0 ? `
                            <div class="property__amenity">
                                <div class="property__amenity-icon">
                                    <svg class="icon" xmlns="http://www.w3.org/2000/svg">
                                        <use href="#icon-plans"></use>
                                    </svg>
                                </div>
                                <span class="property__amenity-value">m<sup>2</sup></span>
                                <span class="property__amenity-label">${size}</span>
                            </div>
                            ` : ''}
                        ` : `
                            ${bedrooms > 0 ? `
                            <div class="property__amenity">
                                <div class="property__amenity-icon">
                                    <svg class="icon" xmlns="http://www.w3.org/2000/svg">
                                        <use href="#icon-beds"></use>
                                    </svg>
                                </div>
                                <span class="property__amenity-value">${bedrooms}</span>
                                <span class="property__amenity-label">Rooms</span>
                            </div>
                            ` : ''}
                            
                            ${bathrooms > 0 ? `
                            <div class="property__amenity">
                                <div class="property__amenity-icon">
                                    <svg class="icon" xmlns="http://www.w3.org/2000/svg">
                                        <use href="#icon-relax"></use>
                                    </svg>
                                </div>
                                <span class="property__amenity-value">${bathrooms}</span>
                                <span class="property__amenity-label">Baths</span>
                            </div>
                            ` : ''}
                            
                            ${size > 0 ? `
                            <div class="property__amenity">
                                <div class="property__amenity-icon">
                                    <svg class="icon" xmlns="http://www.w3.org/2000/svg">
                                        <use href="#icon-plans"></use>
                                    </svg>
                                </div>
                                <span class="property__amenity-value">m<sup>2</sup></span>
                                <span class="property__amenity-label">${size}</span>
                            </div>
                            ` : ''}
                        `}
                    </footer>
                </article>
            </a>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.propertiesPageManager = new PropertiesPageManager();
});
