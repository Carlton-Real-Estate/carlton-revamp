// Simplified Carlton Properties - Mock Mode
class CarltonProperties {
    constructor() {
        this.properties = [];
        this.currentFilter = 'all';
        this.apiAttempted = false; // Track if API call was already attempted
        this.loadMockProperties();
    }

    // Load properties data from backend API
    async loadMockProperties() {
        // Check if API should be attempted (only try once)
        if (this.apiAttempted) {
            console.log('📁 API already attempted, using fallback data');
            this.loadFallbackProperties();
            return;
        }
        
        this.apiAttempted = true;
        
        try {
            console.log('📁 Fetching properties from backend API...');
            
            // Set a timeout for the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
            
            const response = await fetch('http://localhost:8000/api/properties', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Check for rate limiting or other errors
            if (response.status === 429) {
                console.warn('⚠️ API rate limit reached (429), using fallback data');
                this.loadFallbackProperties();
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data) {
                this.properties = data.data;
                console.log(`📁 Loaded ${this.properties.length} properties from backend`);
                this.displayProperties();
            } else {
                console.error('Failed to load properties from backend:', data.error);
                this.loadFallbackProperties();
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('📁 Backend request timeout, loading fallback properties');
            } else {
                console.log('📁 Backend unavailable, loading fallback properties');
            }
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
                garages: 1,
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
                garages: 1,
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
                garages: 2,
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
                garages: 1,
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
                garages: 1,
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
                garages: 1,
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
                garages: 2,
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
                garages: 1,
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
                garages: 2,
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
                garages: 1,
                image_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Apartment",
                reference_number: "SF44321"
            },
            {
                id: 21,
                title: "3BR Penthouse for Rent in Reef Island",
                price: 1500,
                location: "Reef Island",
                bedrooms: 3,
                bathrooms: 3,
                size: 200,
                garages: 2,
                image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Apartment",
                reference_number: "RI88899"
            },
            {
                id: 22,
                title: "Furnished 1BR Apartment in Amwaj",
                price: 550,
                location: "Amwaj Islands",
                bedrooms: 1,
                bathrooms: 1,
                size: 85,
                garages: 1,
                image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Apartment",
                reference_number: "AW77788"
            },
            {
                id: 23,
                title: "Spacious 4BR Villa for Rent in Budaiya",
                price: 1000,
                location: "Budaiya",
                bedrooms: 4,
                bathrooms: 4,
                size: 320,
                garages: 2,
                image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Villa",
                reference_number: "BD99900"
            },
            {
                id: 24,
                title: "Modern 2BR Apartment in Diplomatic Area",
                price: 650,
                location: "Diplomatic Area",
                bedrooms: 2,
                bathrooms: 2,
                size: 130,
                garages: 1,
                image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Apartment",
                reference_number: "DA22211"
            },
            {
                id: 25,
                title: "Executive 3BR Apartment in Manama",
                price: 750,
                location: "Manama",
                bedrooms: 3,
                bathrooms: 2,
                size: 155,
                garages: 1,
                image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Rent",
                for: 2,
                type_name: "Apartment",
                reference_number: "MN33344"
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
                garages: 2,
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
                garages: 3,
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
                garages: 3,
                image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Villa",
                reference_number: "SR98765"
            },
            {
                id: 14,
                title: "Modern Villa in Hamad Town",
                price: 280000,
                location: "Hamad Town",
                bedrooms: 4,
                bathrooms: 3,
                size: 320,
                garages: 2,
                image_url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Villa",
                reference_number: "HT11223"
            },
            {
                id: 15,
                title: "Elegant Villa with Pool in Janabiyah",
                price: 420000,
                location: "Janabiyah",
                bedrooms: 5,
                bathrooms: 4,
                size: 400,
                garages: 3,
                image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Villa",
                reference_number: "JN33445"
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
                garages: 0,
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
                garages: 0,
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
                garages: 0,
                image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Land",
                reference_number: "HM12233"
            },
            {
                id: 19,
                title: "Investment Land in Salmabad",
                price: 280000,
                location: "Salmabad",
                bedrooms: 0,
                bathrooms: 0,
                size: 750,
                garages: 0,
                image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Land",
                reference_number: "SB44556"
            },
            {
                id: 20,
                title: "Residential Plot in A'ali",
                price: 195000,
                location: "A'ali",
                bedrooms: 0,
                bathrooms: 0,
                size: 550,
                garages: 0,
                image_url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                for_name: "Sale",
                for: 1,
                type_name: "Land",
                reference_number: "AL77889"
            }
        ];
        this.displayProperties();
    }

    // Display properties in the UI
    displayProperties() {
        // Hide loading state
        const loadingState = document.getElementById('loading-state');
        const propertiesSections = document.getElementById('properties-sections');
        
        if (loadingState) loadingState.style.display = 'none';
        if (propertiesSections) propertiesSections.style.display = 'block';

        if (this.properties.length === 0) {
            if (propertiesSections) {
                propertiesSections.innerHTML = '<div class="no-properties" style="text-align: center; padding: 60px 20px; color: #666;">No properties found.</div>';
            }
            return;
        }

        // Categorize properties
        this.displayCategorizedProperties();
        this.updateFilterCounts();
    }

    // Display filtered properties from search
    displayFilteredProperties(filteredProperties) {
        console.log('📋 Displaying filtered properties:', filteredProperties.length);
        
        // Hide loading state
        const loadingState = document.getElementById('loading-state');
        const propertiesSections = document.getElementById('properties-sections');
        
        if (loadingState) loadingState.style.display = 'none';
        if (propertiesSections) propertiesSections.style.display = 'block';

        if (filteredProperties.length === 0) {
            if (propertiesSections) {
                propertiesSections.innerHTML = `
                    <div class="no-properties" style="text-align: center; padding: 60px 20px;">
                        <i class="fas fa-search" style="font-size: 48px; color: #cbd5e1; margin-bottom: 16px;"></i>
                        <h3 style="color: #374151; margin-bottom: 8px;">No properties found</h3>
                        <p style="color: #6b7280;">Try adjusting your search filters</p>
                        <button onclick="window.location.reload()" style="margin-top: 20px; background: var(--gradient-primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                            Clear Filters
                        </button>
                    </div>
                `;
            }
            return;
        }

        // Categorize filtered properties
        const saleProperties = filteredProperties.filter(p => p.for === 1 || p.for_name === 'Sale');
        const rentProperties = filteredProperties.filter(p => p.for === 2 || p.for_name === 'Rent');
        const villaProperties = filteredProperties.filter(p => p.type_name === 'Villa' || p.type === 'Villa');
        const landProperties = filteredProperties.filter(p => p.type_name === 'Land' || p.type === 'Land');

        // Display all filtered results (no limit)
        this.displaySection('sale-properties', saleProperties, 'sale-section', true, 'sale', saleProperties.length);
        this.displaySection('rent-properties', rentProperties, 'rent-section', true, 'rent', rentProperties.length);
        this.displaySection('villa-properties', villaProperties, 'villas-section', true, 'villas', villaProperties.length);
        this.displaySection('land-properties', landProperties, 'lands-section', true, 'lands', landProperties.length);
        
        // Update statistics
        this.updateFilterCountsWithFiltered(filteredProperties);
    }

    // Update filter counts with filtered properties
    updateFilterCountsWithFiltered(filteredProperties) {
        const totalProperties = filteredProperties.length;
        const rentProperties = filteredProperties.filter(p => p.for === 2 || p.for_name === 'Rent').length;
        const saleProperties = filteredProperties.filter(p => p.for === 1 || p.for_name === 'Sale').length;
        
        const totalEl = document.getElementById('stat-total-properties');
        const rentEl = document.getElementById('stat-rent-properties');
        const saleEl = document.getElementById('stat-sale-properties');
        
        if (totalEl) totalEl.textContent = totalProperties;
        if (rentEl) rentEl.textContent = rentProperties;
        if (saleEl) saleEl.textContent = saleProperties;
    }

    // Display properties categorized by type
    displayCategorizedProperties(showAll = false) {
        // Get properties for each category
        const saleProperties = this.properties
            .filter(p => p.for === 1 || p.for_name === 'Sale');
        
        const rentProperties = this.properties
            .filter(p => p.for === 2 || p.for_name === 'Rent');
        
        const villaProperties = this.properties
            .filter(p => p.type_name === 'Villa' || p.type === 'Villa');
        
        const landProperties = this.properties
            .filter(p => p.type_name === 'Land' || p.type === 'Land');

        console.log('📊 Property Categories:', {
            sale: saleProperties.length,
            rent: rentProperties.length,
            villas: villaProperties.length,
            lands: landProperties.length,
            total: this.properties.length
        });

        // Limit to 5 unless showing all
        const limit = showAll ? undefined : 5;

        // Display each category with total count for View All button logic
        this.displaySection('sale-properties', saleProperties.slice(0, limit), 'sale-section', showAll, 'sale', saleProperties.length);
        this.displaySection('rent-properties', rentProperties.slice(0, limit), 'rent-section', showAll, 'rent', rentProperties.length);
        this.displaySection('villa-properties', villaProperties.slice(0, limit), 'villas-section', showAll, 'villas', villaProperties.length);
        this.displaySection('land-properties', landProperties.slice(0, limit), 'lands-section', showAll, 'lands', landProperties.length);
    }

    // Display a section of properties
    displaySection(containerId, properties, sectionId, showAll = false, category = '', totalCount = 0) {
        const container = document.getElementById(containerId);
        const section = document.getElementById(sectionId);
        
        if (!container || !section) {
            console.log(`Section not found: ${sectionId}, Container: ${containerId}`);
            return;
        }

        if (properties.length === 0) {
            console.log(`No properties for section: ${sectionId}`);
            section.style.display = 'none';
            return;
        }

        console.log(`Displaying ${properties.length} properties in ${sectionId}, total in category: ${totalCount}`);
        console.log('Properties to display:', properties);
        section.style.display = 'block';
        
        const html = properties.map(property => this.createPropertyCard(property)).join('');
        console.log(`Generated HTML length for ${sectionId}:`, html.length);
        container.innerHTML = html;
        console.log(`Container ${containerId} innerHTML set. Children count:`, container.children.length);
        
        // Add scroll hint animation for mobile (only if not showing all and has multiple properties)
        if (!showAll && properties.length > 1 && window.innerWidth <= 768) {
            // Set up Intersection Observer to trigger animation when section is visible
            this.setupScrollHintObserver(container, section);
        }
        
        // Update View All button text or hide it if showing all
        const viewAllBtn = section.querySelector('.view-all-btn');
        if (viewAllBtn) {
            // Show button only if there are more than 5 properties total and not showing all
            if (showAll || totalCount <= 5) {
                viewAllBtn.style.display = 'none';
            } else {
                viewAllBtn.style.display = 'flex';
                viewAllBtn.innerHTML = 'View All <i class="fas fa-arrow-right"></i>';
                viewAllBtn.onclick = (e) => {
                    e.preventDefault();
                    this.viewAllCategory(category);
                };
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

    // Filter properties by category
    filterProperties(properties) {
        switch (this.currentFilter) {
            case 'sale':
                return properties.filter(p => p.for === 1 || p.for_name === 'Sale');
            case 'rent':
                return properties.filter(p => p.for === 2 || p.for_name === 'Rent');
            case 'apartments':
                return properties.filter(p => p.type_name === 'Apartment');
            case 'villas':
                return properties.filter(p => p.type_name === 'Villa');
            case 'lands':
                return properties.filter(p => p.type_name === 'Land');
            default:
                return properties;
        }
    }

    // Set filter and update display
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Show/hide sections based on filter
        if (filter === 'all') {
            this.displayCategorizedProperties();
        } else {
            // Hide all sections
            document.querySelectorAll('.property-category-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show only relevant section
            const filteredProperties = this.filterProperties(this.properties).slice(0, 5);
            
            if (filter === 'sale') {
                this.displaySection('sale-properties', filteredProperties, 'sale-section');
            } else if (filter === 'rent') {
                this.displaySection('rent-properties', filteredProperties, 'rent-section');
            } else if (filter === 'villas') {
                this.displaySection('villa-properties', filteredProperties, 'villas-section');
            } else if (filter === 'lands') {
                this.displaySection('land-properties', filteredProperties, 'lands-section');
            }
        }
        
        // Update active filter button
        document.querySelectorAll('.filter-btn, .search-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"], [data-tab="${filter}"]`)?.classList.add('active');
    }

    // Update filter counts
    updateFilterCounts() {
        const counts = {
            all: this.properties.length,
            sale: this.properties.filter(p => p.for === 1 || p.for_name === 'Sale').length,
            rent: this.properties.filter(p => p.for === 2 || p.for_name === 'Rent').length,
            apartments: this.properties.filter(p => p.type_name === 'Apartment').length,
            villas: this.properties.filter(p => p.type_name === 'Villa').length,
            lands: this.properties.filter(p => p.type_name === 'Land').length
        };

        Object.entries(counts).forEach(([filter, count]) => {
            const element = document.querySelector(`[data-filter="${filter}"] .count`);
            if (element) {
                element.textContent = `(${count})`;
            }
        });
        
        // Update statistics in hero section
        this.updateStatistics(counts);
    }
    
    // Update statistics display
    updateStatistics(counts) {
        const totalElement = document.getElementById('stat-total-properties');
        const rentElement = document.getElementById('stat-rent-properties');
        const saleElement = document.getElementById('stat-sale-properties');
        
        // Animate numbers rolling up
        this.animateCounter(totalElement, 0, counts.all, 1500);
        this.animateCounter(rentElement, 0, counts.rent, 1500);
        this.animateCounter(saleElement, 0, counts.sale, 1500);
    }

    // Animate counter from start to end value
    animateCounter(element, start, end, duration) {
        if (!element) return;
        
        // Add counting class for pulse animation
        element.classList.add('counting');
        
        const startTime = performance.now();
        const range = end - start;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation (easeOutCubic)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.floor(start + (range * easeProgress));
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end; // Ensure final value is exact
                element.classList.remove('counting'); // Remove animation class
            }
        };
        
        requestAnimationFrame(updateCounter);
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
        this.displaySection(containerId, properties, sectionId, true, category, properties.length);
        
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
        
        this.displayCategorizedProperties(false);
        
        // Scroll to properties section
        const propertiesSection = document.getElementById('properties-sections');
        propertiesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // View property details
    viewProperty(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (property) {
            // Show property details modal or navigate to details page
            alert(`Property Details:\n${property.title}\nPrice: BHD ${property.price?.toLocaleString()}\nLocation: ${property.location || property.area_name}`);
        }
    }

    // Contact agent
    contactAgent(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (property) {
            const message = `Hello, I'm interested in this property: ${property.title} (ID: ${property.id})`;
            const whatsappUrl = `https://wa.me/97317292827?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    // Show error message
    showError(message) {
        const container = document.getElementById('properties-container');
        if (container) {
            container.innerHTML = `<div class="error-message">❌ ${message}</div>`;
        }
    }
}

// Initialize when DOM is loaded (single initialization point)
function initializeCarltonProperties() {
    if (!window.carltonProperties) {
        window.carltonProperties = new CarltonProperties();
    }
}

// Initialize based on document state
if (document.readyState === 'loading') {
    // Document still loading, wait for DOMContentLoaded  
    document.addEventListener('DOMContentLoaded', initializeCarltonProperties);
} else {
    // Document already loaded, initialize immediately
    initializeCarltonProperties();
}

// Add filter event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            if (window.carltonProperties) {
                window.carltonProperties.setFilter(filter);
            }
        });
    });

    // Search tabs
    document.querySelectorAll('.search-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabType = e.currentTarget.dataset.tab;
            if (window.carltonProperties) {
                window.carltonProperties.setFilter(tabType);
                
                // Update tab active state
                document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Scroll to properties section
                const propertiesSection = document.getElementById('properties-sections');
                if (propertiesSection) {
                    propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Search button handler
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });
    }

    // View all buttons are now handled dynamically in displaySection method
});

// Perform search based on filters
function performSearch() {
    console.log('🔍 Performing search...');
    
    // Get filter values
    const category = document.getElementById('category-filter')?.value || 'all';
    const propertyType = document.getElementById('type-filter')?.value || 'all';
    const location = document.getElementById('location-filter')?.value || 'all';
    const listingType = document.getElementById('listing-type-filter')?.value || 'all';
    const bedrooms = document.getElementById('bedrooms-filter')?.value || '';
    const minPrice = document.getElementById('min-price')?.value || '';
    const maxPrice = document.getElementById('max-price')?.value || '';
    
    console.log('Search filters:', { category, propertyType, location, listingType, bedrooms, minPrice, maxPrice });
    
    // Get all properties
    const allProperties = window.carltonProperties?.properties || [];
    
    // Filter properties based on search criteria
    let filteredProperties = allProperties.filter(property => {
        // Category filter (residential/commercial)
        if (category !== 'all') {
            const residentialTypes = ['apartment', 'villa', 'compound'];
            const commercialTypes = ['factory', 'medical', 'building', 'office', 'shop', 'store', 'land-planing', 'farm', 'project'];
            
            const propertyTypeNormalized = property.type_name?.toLowerCase() || '';
            
            if (category === 'residential' && !residentialTypes.includes(propertyTypeNormalized)) {
                return false;
            }
            if (category === 'commercial' && !commercialTypes.includes(propertyTypeNormalized)) {
                return false;
            }
        }
        
        // Property type filter
        if (propertyType !== 'all') {
            const propertyTypeNormalized = property.type_name?.toLowerCase() || '';
            if (propertyTypeNormalized !== propertyType.toLowerCase()) {
                return false;
            }
        }
        
        // Location filter
        if (location !== 'all') {
            const propertyLocation = property.location?.toLowerCase() || '';
            if (propertyLocation !== location.toLowerCase()) {
                return false;
            }
        }
        
        // Listing type filter (rent/sale)
        if (listingType !== 'all') {
            const propertyListingType = property.for_name?.toLowerCase() || '';
            if (propertyListingType !== listingType.toLowerCase()) {
                return false;
            }
        }
        
        // Bedrooms filter
        if (bedrooms !== '') {
            const propertyBedrooms = parseInt(property.bedrooms) || 0;
            const minBedrooms = parseInt(bedrooms);
            if (propertyBedrooms < minBedrooms) {
                return false;
            }
        }
        
        // Price range filter
        if (minPrice !== '') {
            const propertyPrice = parseFloat(property.price) || 0;
            const min = parseFloat(minPrice);
            if (propertyPrice < min) {
                return false;
            }
        }
        
        if (maxPrice !== '') {
            const propertyPrice = parseFloat(property.price) || 0;
            const max = parseFloat(maxPrice);
            if (propertyPrice > max) {
                return false;
            }
        }
        
        return true;
    });
    
    console.log(`Found ${filteredProperties.length} properties matching criteria`);
    
    // Display filtered properties
    if (window.carltonProperties) {
        window.carltonProperties.properties = allProperties; // Keep original properties
        window.carltonProperties.displayFilteredProperties(filteredProperties);
        
        // Scroll to properties section
        const propertiesSection = document.getElementById('properties-sections');
        if (propertiesSection) {
            propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Show notification
        showSearchNotification(filteredProperties.length);
    }
}

// Show search notification
function showSearchNotification(count) {
    // Remove existing notification
    const existingNotification = document.querySelector('.search-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'search-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Found ${count} ${count === 1 ? 'property' : 'properties'}</span>
    `;
    
    // Add notification styles if not already added
    if (!document.getElementById('search-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'search-notification-styles';
        style.textContent = `
            .search-notification {
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
            
            .search-notification i {
                font-size: 1.25rem;
            }
            
            @media (max-width: 768px) {
                .search-notification {
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