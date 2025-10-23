/**
 * Carlton Real Estate API Service
 * Centralized API management for property listings, essentials, attachments, and child properties
 */

class CarltonAPI {
    constructor() {
        // Use configuration from api-config.js if available
        this.config = window.CARLTON_API_CONFIG || {};
        this.baseUrl = this.config.baseUrl || 'https://listings.icarlton.com';
        this.endpoints = this.config.endpoints || {
            listings: '/wide_api/properties/listings',
            essentials: '/wide_api/property_essentials',
            attachments: '/wide_api/property_attachments/all_attachments',
            childProperties: '/wide_api/properties/properties_child'
        };
        
        // Authentication headers from config
        this.headers = this.config.headers || {
            'authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiQVBJIiwibmFtZSI6IkFQSSIsIkFQSV9USU1FIjoxNzQ0NDQzNjAyfQ.QnRuRH__Po1ctY3HZj3cDeK-qptWQE-GPiz7D4j166s',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        // CORS configuration
        this.corsConfig = this.config.corsConfig || {
            mode: 'cors',
            credentials: 'omit',
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        };
        
        // Cache for better performance
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Get property listings with pagination
     * @param {Object} options - Options for fetching listings
     * @param {number} options.batchSize - Number of properties to fetch (default: 20)
     * @param {number} options.startIndex - Starting index for pagination (default: 0)
     * @param {string} options.sortBy - Sort field (optional)
     * @param {string} options.order - Sort order (optional)
     * @returns {Promise<Object>} Property listings response
     */
    async getPropertyListings(options = {}) {
        const params = new URLSearchParams({
            batch_size: options.batchSize || 20,
            start_index: options.startIndex || 0,
            ...(options.sortBy && { sort_by: options.sortBy }),
            ...(options.order && { order: options.order })
        });

        const url = `${this.baseUrl}${this.endpoints.listings}?${params}`;
        const cacheKey = `listings_${params.toString()}`;

        try {
            // Check cache first
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                console.log('📦 Using cached property listings');
                return cached;
            }

            console.log('🌐 Fetching property listings from:', url);
            const response = await this.fetchWithCorsHandling(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Transform data to standardized format
            const transformedData = this.transformPropertyListings(data);
            
            // Cache the result
            this.setCache(cacheKey, transformedData);
            
            console.log(`✅ Successfully loaded ${transformedData.properties.length} properties`);
            return transformedData;

        } catch (error) {
            console.error('❌ Failed to fetch property listings:', error);
            throw error;
        }
    }

    /**
     * Get property essentials (types, areas, categories, etc.)
     * @param {string} key - The essential key ('created_at' or 'last_updated')
     * @param {string} type - The essential type ('categories', 'types', 'provinces', 'areas', etc.)
     * @returns {Promise<Object>} Property essentials response
     */
    async getPropertyEssentials(key, type) {
        const url = `${this.baseUrl}${this.endpoints.essentials}/${key}/${type}`;
        const cacheKey = `essentials_${key}_${type}`;

        try {
            // Check cache first
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                console.log('📦 Using cached property essentials');
                return cached;
            }

            console.log('🌐 Fetching property essentials from:', url);
            const response = await this.fetchWithCorsHandling(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the result
            this.setCache(cacheKey, data);
            
            console.log(`✅ Successfully loaded property essentials for ${key}/${type}`);
            return data;

        } catch (error) {
            console.error('❌ Failed to fetch property essentials:', error);
            throw error;
        }
    }

    /**
     * Get property categories (helper method)
     * @returns {Promise<Object>} Categories response
     */
    async getPropertyCategories() {
        return this.getPropertyEssentials('created_at', 'categories');
    }

    /**
     * Get property types (helper method)
     * @returns {Promise<Object>} Types response
     */
    async getPropertyTypes() {
        return this.getPropertyEssentials('created_at', 'types');
    }

    /**
     * Get property areas (helper method)
     * @returns {Promise<Object>} Areas response
     */
    async getPropertyAreas() {
        return this.getPropertyEssentials('created_at', 'areas');
    }

    /**
     * Get property provinces (helper method)
     * @returns {Promise<Object>} Provinces response
     */
    async getPropertyProvinces() {
        return this.getPropertyEssentials('created_at', 'provinces');
    }

    /**
     * Get property facilities (helper method)
     * @returns {Promise<Object>} Facilities response
     */
    async getPropertyFacilities() {
        return this.getPropertyEssentials('created_at', 'facilities');
    }

    /**
     * Get all property attachments
     * @returns {Promise<Object>} All attachments response
     */
    async getAllAttachments() {
        const url = `${this.baseUrl}${this.endpoints.attachments}`;
        const cacheKey = 'all_attachments';

        try {
            // Check cache first
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                console.log('📦 Using cached attachments');
                return cached;
            }

            console.log('🌐 Fetching all attachments from:', url);
            const response = await this.fetchWithCorsHandling(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the result
            this.setCache(cacheKey, data);
            
            console.log('✅ Successfully loaded all attachments');
            return data;

        } catch (error) {
            console.error('❌ Failed to fetch attachments:', error);
            throw error;
        }
    }

    /**
     * Get property images from attachments endpoint
     * @param {string|number} propertyId - Property ID to get images for
     * @param {number} limit - Maximum number of images to return (default: 10)
     * @returns {Promise<Array>} Array of image URLs for the property
     */
    async getPropertyImages(propertyId, limit = 10) {
        try {
            // Use the specific property_id parameter in the attachments endpoint
            const params = new URLSearchParams({
                property_id: propertyId,
                ignore_pdf: '1' // Only get images, not PDFs
            });
            
            const url = `${this.baseUrl}${this.endpoints.attachments}?${params}`;
            const cacheKey = `attachments_${propertyId}`;

            // Check cache first
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                console.log(`📦 Using cached attachments for property ${propertyId}`);
                return this.extractImageUrls(cached, limit);
            }

            console.log(`🌐 Fetching attachments for property ${propertyId} from:`, url);
            const response = await this.fetchWithCorsHandling(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const attachments = await response.json();
            
            // Cache the result
            this.setCache(cacheKey, attachments);
            
            return this.extractImageUrls(attachments, limit);
            
        } catch (error) {
            console.error(`❌ Failed to get images for property ${propertyId}:`, error);
            return [];
        }
    }

    /**
     * Extract image URLs from attachments response
     * @param {Object|Array} attachments - Attachments response data
     * @param {number} limit - Maximum number of images to return
     * @returns {Array} Array of image URLs
     */
    extractImageUrls(attachments, limit = 10) {
        let attachmentArray = [];
        
        // Handle different response structures
        if (Array.isArray(attachments)) {
            attachmentArray = attachments;
        } else if (attachments.data && Array.isArray(attachments.data)) {
            attachmentArray = attachments.data;
        } else if (attachments.attachments && Array.isArray(attachments.attachments)) {
            attachmentArray = attachments.attachments;
        }
        
        // Filter and extract image URLs
        const imageUrls = attachmentArray
            .filter(attachment => {
                // Check if it's an image type
                const isImage = attachment.image_type && 
                               attachment.image_type.toLowerCase().includes('image');
                // Also check if visible
                const isVisible = attachment.visible === '1' || attachment.visible === 1;
                return isImage && isVisible;
            })
            .map(attachment => attachment.fileUrl || attachment.file_url || attachment.url)
            .filter(url => url && url.trim() !== '')
            .slice(0, limit);
        
        console.log(`📸 Extracted ${imageUrls.length} images from attachments`);
        return imageUrls;
    }

    /**
     * Get primary property image with attachments API fallback
     * @param {Object} property - Property object with id
     * @returns {Promise<string>} Primary image URL or fallback
     */
    async getPropertyImageUrl(property) {
        if (!property) {
            return this.getRandomPropertyImages('default', 1)[0];
        }
        
        // First try images from property listing data
        const listingImages = this.extractImagesArray(property);
        if (listingImages.length > 0) {
            return listingImages[0];
        }
        
        // If no images in listing, try attachments API
        if (property.id || property.property_id) {
            const propertyId = property.id || property.property_id;
            const attachmentImages = await this.getPropertyImages(propertyId, 1);
            if (attachmentImages.length > 0) {
                return attachmentImages[0];
            }
        }
        
        // Final fallback to type-specific placeholder
        const propertyType = (property.property_type_en || property.type || 'default').toLowerCase();
        return this.getRandomPropertyImages(propertyType, 1)[0];
    }

    /**
     * Get child properties
     * @param {Object} options - Options for fetching child properties
     * @returns {Promise<Object>} Child properties response
     */
    async getChildProperties(options = {}) {
        const params = new URLSearchParams(options);
        const url = `${this.baseUrl}${this.endpoints.childProperties}?${params}`;
        const cacheKey = `child_properties_${params.toString()}`;

        try {
            // Check cache first
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                console.log('📦 Using cached child properties');
                return cached;
            }

            console.log('🌐 Fetching child properties from:', url);
            const response = await this.fetchWithCorsHandling(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the result
            this.setCache(cacheKey, data);
            
            console.log('✅ Successfully loaded child properties');
            return data;

        } catch (error) {
            console.error('❌ Failed to fetch child properties:', error);
            throw error;
        }
    }

    /**
     * Transform property listings to standardized format
     * @param {Object} rawData - Raw API response
     * @returns {Object} Transformed data
     */
    transformPropertyListings(rawData) {
        if (!rawData) return { properties: [], total: 0 };

        let properties = [];
        
        // Handle different response structures
        if (Array.isArray(rawData)) {
            properties = rawData;
        } else if (rawData.data && Array.isArray(rawData.data)) {
            properties = rawData.data;
        } else if (rawData.properties && Array.isArray(rawData.properties)) {
            properties = rawData.properties;
        }

        // Transform each property to standardized format
        const transformedProperties = properties.map(property => this.transformProperty(property));

        return {
            properties: transformedProperties,
            total: rawData.total || rawData.count || transformedProperties.length,
            page: rawData.page || 1,
            hasMore: rawData.hasMore || false
        };
    }

    /**
     * Transform individual property to standardized format
     * @param {Object} property - Raw property data
     * @returns {Object} Transformed property
     */
    transformProperty(property) {
        return {
            // Basic property information
            id: property.id,
            name_en: property.name_en || property.title || property.property_title,
            name_ar: property.name_ar || property.title_ar,
            slug_en: property.slug_en || this.generateSlug(property.name_en || property.title),
            slug_ar: property.slug_ar || this.generateSlug(property.name_ar || property.title_ar),

            // Staff information
            staff_name_en: property.staff_name_en || property.agent_name || property.sales_staff_name,
            staff_name_ar: property.staff_name_ar || property.agent_name_ar,
            staff_email: property.staff_email || property.agent_email || property.sales_staff_email,
            staff_phonenumber: property.staff_phonenumber || property.agent_phone || property.sales_staff_phone,
            staff_designation_en: property.staff_designation_en || property.agent_designation,
            staff_designation_ar: property.staff_designation_ar || property.agent_designation_ar,
            staff_img_url: property.staff_img_url || property.agent_avatar || property.sales_staff_avatar,

            // Property categories and types
            category_en: property.category_en || property.category || property.property_category,
            category_ar: property.category_ar || property.category_ar,
            type_en: property.type_en || property.type || property.property_type || property.type_name,
            type_ar: property.type_ar || property.type_ar,

            // Location information
            area_en: property.area_en || property.area || property.location || property.area_name,
            area_ar: property.area_ar || property.area_ar,

            // Property status
            for_en: property.for_en || property.for_name || (property.for === 1 ? 'Sale' : property.for === 2 ? 'Rent' : 'Sale'),
            for_ar: property.for_ar || property.for_name_ar,

            // Property details
            classification_en: property.classification_en || property.classification,
            classification_ar: property.classification_ar || property.classification_ar,
            condition_en: property.condition_en || property.condition,
            condition_ar: property.condition_ar || property.condition_ar,
            furnished_en: property.furnished_en || property.furnished,
            furnished_ar: property.furnished_ar || property.furnished_ar,

            // Labels and facilities
            labels: property.labels || property.tags || [],
            label_names_en: property.label_names_en || property.tag_names || [],
            label_names_ar: property.label_names_ar || property.tag_names_ar || [],
            facilities: property.facilities || property.amenities || [],
            facility_names_en: property.facility_names_en || property.amenity_names || [],
            facility_names_ar: property.facility_names_ar || property.amenity_names_ar || [],

            // Nearby amenities
            nearby_amenities: property.nearby_amenities || [],
            nearby_amenities_en: property.nearby_amenities_en || [],
            nearby_amenities_ar: property.nearby_amenities_ar || [],

            // URLs and images
            property_url_en: property.property_url_en || property.url || property.permalink,
            property_url_ar: property.property_url_ar || property.url_ar,
            imagesUrl: this.extractImagesArray(property),

            // Additional useful fields for compatibility
            price: property.price || property.property_price,
            currency: property.currency || 'BHD',
            bedrooms: property.bedrooms || property.num_rooms || property.rooms,
            bathrooms: property.bathrooms || property.num_baths || property.baths,
            area_size: property.area_size || property.size || property.carpet_area || property.property_size,
            description: property.description || property.property_description || property.short_description,
            coordinates: property.coordinates || [property.latitude, property.longitude].filter(Boolean),
            created_date: property.created_date || property.date_created || property.created_at,
            updated_date: property.updated_date || property.date_updated || property.updated_at
        };
    }

    /**
     * Extract images array from various possible property image fields
     * @param {Object} property - Raw property data
     * @returns {Array} Array of image URLs
     */
    extractImagesArray(property) {
        let images = [];
        
        // Check for existing imagesUrl array
        if (property.imagesUrl && Array.isArray(property.imagesUrl)) {
            images = property.imagesUrl.filter(Boolean);
        }
        
        // Check for images array
        if (images.length === 0 && property.images && Array.isArray(property.images)) {
            images = property.images.filter(Boolean);
        }
        
        // Check for image_urls array
        if (images.length === 0 && property.image_urls && Array.isArray(property.image_urls)) {
            images = property.image_urls.filter(Boolean);
        }
        
        // Check for single image fields
        if (images.length === 0) {
            const singleImages = [
                property.main_image,
                property.featured_image,
                property.image_url,
                property.image,
                property.property_image
            ].filter(Boolean);
            
            if (singleImages.length > 0) {
                images = singleImages;
            }
        }
        
        // If still no images, return empty array (will trigger fallback in getPropertyImage)
        return images;
    }

    /**
     * Generate URL-friendly slug from text
     * @param {string} text - Text to convert to slug
     * @returns {string} URL-friendly slug
     */
    generateSlug(text) {
        if (!text) return '';
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    /**
     * Cache management methods
     */
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    clearCache() {
        this.cache.clear();
        console.log('🧹 API cache cleared');
    }

    /**
     * CORS-aware fetch method that handles authentication and fallbacks
     * @param {string} url - API endpoint URL
     * @param {Object} options - Fetch options
     * @returns {Promise<Response>} Fetch response
     */
    async fetchWithCorsHandling(url, options = {}) {
        // Check if config's fetchWithCorsHandling method is available
        if (this.config && typeof this.config.fetchWithCorsHandling === 'function') {
            try {
                return await this.config.fetchWithCorsHandling(url, options);
            } catch (error) {
                console.warn('Config fetch method failed, using fallback:', error.message);
            }
        }

        // Fallback: direct fetch with authentication headers
        const fetchOptions = {
            method: 'GET',
            ...this.corsConfig,
            headers: {
                ...this.headers,
                ...options.headers
            },
            ...options
        };

        try {
            console.log('🔐 Making authenticated API call to:', url);
            const response = await fetch(url, fetchOptions);
            
            if (!response.ok) {
                // Handle specific error cases
                if (response.status === 404) {
                    const errorData = await response.json().catch(() => ({ message: 'Endpoint not found' }));
                    if (errorData.message && errorData.message.includes('Token is not defined')) {
                        console.error('❌ API Authentication Error: Token is not defined or expired');
                        throw new Error('API Authentication required - no mock data available');
                    }
                } else if (response.status === 401 || response.status === 403) {
                    console.error('❌ API Authentication Error:', response.status);
                    throw new Error('API Authentication required - no mock data available');
                }
                
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            // Handle CORS and network errors
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                console.warn('🚫 CORS or Network Error:', error.message);
                throw new Error('Network or CORS error - API required');
            }
            
            throw error;
        }
    }

    /**
     * Generate mock data response when API is unavailable
     * @param {string} url - Original API URL
     * @returns {Promise<Response>} Mock response
     */
    // Mock data methods removed - API required

    /**
     * Get random property images based on type
     * @param {string} type - Property type (Apartment, Villa, etc.)
     * @param {number} index - Property index for variation
     * @returns {Array} Array of image URLs
     */
    getRandomPropertyImages(type, index) {
        const imageCollections = {
            'Apartment': [
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
            ],
            'Villa': [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
            ],
            'Office': [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
            ],
            'Shop': [
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
                'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
                'https://images.unsplash.com/photo-1555529771-835f59fc5efe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
            ],
            'Warehouse': [
                'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
                'https://images.unsplash.com/photo-1562113530-57ba4cea0c6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
                'https://images.unsplash.com/photo-1555796478-0c6aa19ccce4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
            ]
        };
        
        const typeImages = imageCollections[type] || imageCollections['Apartment'];
        const primaryIndex = index % typeImages.length;
        const secondaryIndex = (index + 1) % typeImages.length;
        
        return [
            typeImages[primaryIndex],
            typeImages[secondaryIndex]
        ];
    }

    /**
     * Generate realistic mock property data
     * @returns {Array} Mock properties array
     */
    // Mock property generation removed - API required

    /**
     * Batch fetch multiple property data types
     * @param {Object} options - Batch fetch options
     * @returns {Promise<Object>} Combined data response
     */
    async batchFetch(options = {}) {
        try {
            console.log('🔄 Starting batch fetch for property data...');
            
            const promises = [];
            const results = {};

            // Fetch listings if requested
            if (options.listings !== false) {
                promises.push(
                    this.getPropertyListings(options.listingsOptions || {})
                        .then(data => results.listings = data)
                        .catch(error => {
                            console.warn('⚠️ Listings fetch failed:', error.message);
                            results.listings = { properties: [], total: 0 };
                        })
                );
            }

            // Fetch attachments if requested
            if (options.attachments) {
                promises.push(
                    this.getAllAttachments()
                        .then(data => results.attachments = data)
                        .catch(error => {
                            console.warn('⚠️ Attachments fetch failed:', error.message);
                            results.attachments = [];
                        })
                );
            }

            // Fetch child properties if requested
            if (options.childProperties) {
                promises.push(
                    this.getChildProperties(options.childPropertiesOptions || {})
                        .then(data => results.childProperties = data)
                        .catch(error => {
                            console.warn('⚠️ Child properties fetch failed:', error.message);
                            results.childProperties = [];
                        })
                );
            }

            // Fetch essentials if requested
            if (options.essentials && Array.isArray(options.essentials)) {
                options.essentials.forEach(essential => {
                    if (essential.key && essential.type) {
                        promises.push(
                            this.getPropertyEssentials(essential.key, essential.type)
                                .then(data => {
                                    if (!results.essentials) results.essentials = {};
                                    results.essentials[`${essential.key}_${essential.type}`] = data;
                                })
                                .catch(error => {
                                    console.warn(`⚠️ Essentials fetch failed for ${essential.key}/${essential.type}:`, error.message);
                                })
                        );
                    }
                });
            }

            await Promise.all(promises);
            
            console.log('✅ Batch fetch completed successfully');
            return results;

        } catch (error) {
            console.error('❌ Batch fetch failed:', error);
            throw error;
        }
    }
}

// Create global instance
window.carltonAPI = new CarltonAPI();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarltonAPI;
}