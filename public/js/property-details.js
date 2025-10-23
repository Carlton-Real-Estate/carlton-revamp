// Property Details Modal Manager
class PropertyDetailsModal {
    constructor() {
        this.modal = null;
        this.currentProperty = null;
        this.staffMembers = [];
        this.init();
    }

    init() {
        // Load staff members
        this.loadStaffMembers();
        
        // Setup modal if it exists
        if (document.getElementById('propertyModal')) {
            this.setupModal();
        }
    }

    loadStaffMembers() {
        // Sample staff members - in production, fetch from API
        this.staffMembers = [
            {
                name: 'Abdulla Hasan',
                role: 'Property Consultant',
                phone: '+97332319900',
                image: 'https://listings.icarlton.com/uploads/team_members/abdulla-hasan.jpg'
            },
            {
                name: 'Ahmed Al-A\'ali',
                role: 'Property Consultant',
                phone: '+97336943000',
                image: 'https://listings.icarlton.com/uploads/team_members/ahmed-al-aali.jpg'
            },
            {
                name: 'Hanaa Adel',
                role: 'Property Advisor',
                phone: '+97336504411',
                image: 'https://listings.icarlton.com/uploads/team_members/hanaa-adel.jpg'
            },
            {
                name: 'Mirna Kamal',
                role: 'Property Advisor',
                phone: '+97336960222',
                image: 'https://listings.icarlton.com/uploads/team_members/mirna-kamal.jpg'
            }
        ];
    }

    setupModal() {
        this.modal = document.getElementById('propertyModal');
        
        // Close button
        const closeBtn = document.getElementById('closeModal');
        const overlay = this.modal.querySelector('.modal-overlay');
        
        if (closeBtn) {
            closeBtn.onclick = () => this.closeModal();
        }
        
        if (overlay) {
            overlay.onclick = () => this.closeModal();
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal && this.modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeModal();
                } else if (e.key === 'ArrowRight') {
                    this.nextImage();
                } else if (e.key === 'ArrowLeft') {
                    this.previousImage();
                }
            }
        });
    }

    openModal(property) {
        this.currentProperty = property;
        
        if (!this.modal) {
            this.createModal();
        }
        
        this.populateModal(property);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    createModal() {
        // If modal doesn't exist in DOM, we'll create it dynamically
        const modalHTML = `
            <div id="propertyModal" class="property-modal">
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <div class="modal-content">
                        <button class="modal-close" id="closeModal">
                            <i class="fas fa-times"></i>
                        </button>
                        
                        <div class="property-details-grid">
                            <div class="details-left">
                                <section class="property-section">
                                    <h2>Description</h2>
                                    <p class="property-description" id="propertyDescription"></p>
                                </section>
                                
                                <section class="property-section">
                                    <h2>Facilities & Amenities</h2>
                                    <div class="facilities-list" id="facilitiesList"></div>
                                </section>
                                
                                <section class="property-section">
                                    <h2>Gallery</h2>
                                    <div class="property-gallery" id="propertyGallery"></div>
                                </section>
                                
                                <section class="property-section similar-section">
                                    <h2>Similar Properties</h2>
                                    <div class="similar-properties-grid" id="similarPropertiesGrid"></div>
                                </section>
                            </div>
                            
                            <div class="details-right">
                                <div class="property-hero">
                                    <div class="property-hero-image" id="propertyHeroImage">
                                    </div>
                                    
                                <div class="property-info-card" id="propertyInfoCard">
                                    <div class="info-row">
                                        <span class="info-label">Title</span>
                                        <h3 class="info-value" id="propertyTitle"></h3>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Price</span>
                                        <div class="info-value" id="propertyPrice"></div>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Location</span>
                                        <div class="info-value" id="propertyLocation"></div>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Type</span>
                                        <div class="info-value" id="propertyType"></div>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Reference</span>
                                        <div class="info-value" id="propertyReference"></div>
                                    </div>
                                    
                                    <!-- Share Button -->
                                    <button class="share-btn" id="shareBtn">
                                        <i class="fas fa-share-alt"></i>
                                        Share
                                    </button>
                                </div>                                    <!-- Agent Card -->
                                    <div class="agent-card">
                                        <div class="agent-photo" id="agentPhoto"></div>
                                        <div class="agent-info">
                                            <div class="agent-header">
                                                <h3 id="agentName">Ahmed Al-Mahmood</h3>
                                                <p class="agent-title">Property Consultant</p>
                                            </div>
                                            <div class="agent-buttons">
                                                <a href="#" class="agent-btn call-btn" id="agentCallBtn">
                                                    <i class="fas fa-phone"></i>
                                                    Call
                                                </a>
                                                <a href="#" class="agent-btn whatsapp-btn" id="agentWhatsappBtn">
                                                    <i class="fab fa-whatsapp"></i>
                                                    WhatsApp
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Property Details Card -->
                                    <div class="property-details-card">
                                        <div class="details-grid" id="propertyDetailsGrid">
                                            <div class="detail-item">
                                                <span class="detail-value" id="propertyId">----</span>
                                                <span class="detail-label">ID</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-value" id="propertyFor">----</span>
                                                <span class="detail-label">Property For</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-value" id="propertySizeSqf">----</span>
                                                <span class="detail-label">Size SQF</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-value" id="propertySizeSqm">----</span>
                                                <span class="detail-label">Size SQM</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-value" id="propertyFloors">----</span>
                                                <span class="detail-label">No. of Floors</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-value" id="propertyRooms">----</span>
                                                <span class="detail-label">No. Rooms</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-value" id="propertyBaths">----</span>
                                                <span class="detail-label">No. Baths</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-value" id="propertyKitchens">----</span>
                                                <span class="detail-label">No. of Kitchens</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-value" id="propertyHalls">----</span>
                                                <span class="detail-label">No. of Halls</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-value" id="propertyFurnished">----</span>
                                                <span class="detail-label">Status</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Share Popup -->
            <div class="share-popup" id="sharePopup">
                <div class="share-popup-overlay"></div>
                <div class="share-popup-content">
                    <button class="share-popup-close" id="sharePopupClose">
                        <i class="fas fa-times"></i>
                    </button>
                    <h3>Share Property</h3>
                    <div class="share-options">
                        <button class="share-option" id="printProperty">
                            <i class="fas fa-print"></i>
                            <span>Print</span>
                        </button>
                        <button class="share-option" id="shareWhatsapp">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </button>
                        <button class="share-option" id="copyLink">
                            <i class="fas fa-link"></i>
                            <span>Copy Link</span>
                        </button>
                        <button class="share-option" id="exportPdf">
                            <i class="fas fa-file-pdf"></i>
                            <span>Export PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('propertyModal');
        this.setupModal();
    }

    populateModal(property) {
        // Hero Image
        const heroImage = document.getElementById('propertyHeroImage');
        if (heroImage) {
            heroImage.style.backgroundImage = `url(${property.image_url || property.main_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'})`;
        }
        
        // Generate Reference Number (using property ID with prefix)
        const refNumber = `AJ${String(property.id).padStart(5, '0')}`;
        
        // Reference Number
        const ref = document.getElementById('propertyReference');
        if (ref) {
            ref.textContent = refNumber;
        }
        
        // Assign random agent to property
        const randomAgent = this.staffMembers[property.id % this.staffMembers.length];
        
        // Agent Photo
        const agentPhoto = document.getElementById('agentPhoto');
        if (agentPhoto) {
            agentPhoto.style.backgroundImage = `url(${randomAgent.image})`;
        }
        
        // Agent Name
        const agentName = document.getElementById('agentName');
        if (agentName) {
            agentName.textContent = randomAgent.name;
        }
        
        // Agent Call Button
        const agentCallBtn = document.getElementById('agentCallBtn');
        if (agentCallBtn) {
            agentCallBtn.href = `tel:${randomAgent.phone.replace(/\s/g, '')}`;
        }
        
        // Agent WhatsApp Button
        const agentWhatsappBtn = document.getElementById('agentWhatsappBtn');
        if (agentWhatsappBtn) {
            const message = `Hello, I'm interested in property ${refNumber}: ${property.title}`;
            agentWhatsappBtn.href = `https://wa.me/${randomAgent.phone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
        }
        
        // Title
        const title = document.getElementById('propertyTitle');
        if (title) {
            title.textContent = property.title || 'Property Title';
        }
        
        // Price
        const price = document.getElementById('propertyPrice');
        if (price) {
            const priceValue = property.price ? property.price.toLocaleString() : 'Price on request';
            price.textContent = `${priceValue} BHD`;
        }
        
        // Location
        const location = document.getElementById('propertyLocation');
        if (location) {
            location.textContent = property.location || property.area_name || 'Bahrain';
        }
        
        // Property Type
        const type = document.getElementById('propertyType');
        if (type) {
            type.textContent = property.for_name || (property.for === 1 ? 'For Sale' : 'For Rent');
        }
        
        // Description
        const description = document.getElementById('propertyDescription');
        if (description) {
            description.textContent = property.description || 'We don\'t just rent apartments. From the moment you walk through the front door you\'ll feel the comfort and security that makes our residents happy to call us the best. This property offers exceptional living standards with modern amenities and prime location.';
        }
        
        // Property Details
        this.populatePropertyDetails(property);
        
        // Facilities
        this.populateFacilities(property);
        
        // Gallery
        this.populateGallery(property);
        
        // Similar Properties
        this.populateSimilarProperties(property);
        
        // Share Button
        this.setupShareButton(property, refNumber);
    }

    populatePropertyDetails(property) {
        // Check if property is a building
        const isBuilding = property.type_name === 'Building' || property.type === 'Building' || 
                          property.type_name === 'building' || property.type === 'building';
        
        const detailsGrid = document.getElementById('propertyDetailsGrid');
        
        if (isBuilding) {
            // Building-specific details layout
            detailsGrid.innerHTML = `
                <div class="detail-item">
                    <span class="detail-value" id="propertyId">${property.id || '----'}</span>
                    <span class="detail-label">ID</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyFor">${property.for === 1 ? 'Sale' : 'Rent'}</span>
                    <span class="detail-label">Property For</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertySizeSqf">${((property.size || property.area || 0) * 10.764).toFixed(1).toLocaleString()}</span>
                    <span class="detail-label">Size SQF</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertySizeSqm">${property.size || property.area || '----'}</span>
                    <span class="detail-label">Size SQM</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyMonthlyIncome">${property.monthly_income ? property.monthly_income.toLocaleString() + ' BHD' : '----'}</span>
                    <span class="detail-label">Monthly Income</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyAnnualIncome">${property.annual_income ? property.annual_income.toLocaleString() + ' BHD' : (property.monthly_income ? (property.monthly_income * 12).toLocaleString() + ' BHD' : '----')}</span>
                    <span class="detail-label">Annual Income</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyRoads">${property.roads || property.no_of_roads || '----'}</span>
                    <span class="detail-label">No. of Roads</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyFlats">${property.flats || property.no_of_flats || property.units || '----'}</span>
                    <span class="detail-label">No. of Flats</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyElevators">${property.elevators || property.no_of_elevators || '----'}</span>
                    <span class="detail-label">No. of Elevators</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyStatus">${property.status || property.condition || 'N/A'}</span>
                    <span class="detail-label">Status</span>
                </div>
            `;
        } else {
            // Standard property details layout
            detailsGrid.innerHTML = `
                <div class="detail-item">
                    <span class="detail-value" id="propertyId">${property.id || '----'}</span>
                    <span class="detail-label">ID</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyFor">${property.for === 1 ? 'Sale' : 'Rent'}</span>
                    <span class="detail-label">Property For</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertySizeSqf">${((property.size || property.area || 0) * 10.764).toFixed(1).toLocaleString()}</span>
                    <span class="detail-label">Size SQF</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertySizeSqm">${property.size || property.area || '----'}</span>
                    <span class="detail-label">Size SQM</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyFloors">${property.floors || '----'}</span>
                    <span class="detail-label">No. of Floors</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyRooms">${property.bedrooms || property.rooms || '----'}</span>
                    <span class="detail-label">No. Rooms</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyBaths">${property.bathrooms || '----'}</span>
                    <span class="detail-label">No. Baths</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyKitchens">${property.kitchens || 1}</span>
                    <span class="detail-label">No. of Kitchens</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyHalls">${property.halls || '----'}</span>
                    <span class="detail-label">No. of Halls</span>
                </div>
                <div class="detail-item">
                    <span class="detail-value" id="propertyFurnished">${property.furnished || property.furnishing_status || 'Unfurnished'}</span>
                    <span class="detail-label">Status</span>
                </div>
            `;
        }
    }

    setupShareButton(property, refNumber) {
        const shareBtn = document.getElementById('shareBtn');
        const sharePopup = document.getElementById('sharePopup');
        const sharePopupClose = document.getElementById('sharePopupClose');
        const sharePopupOverlay = sharePopup?.querySelector('.share-popup-overlay');
        
        console.log('Setting up share button...', { shareBtn, sharePopup, sharePopupClose });
        
        if (shareBtn && sharePopup) {
            // Remove any existing event listeners by cloning and replacing
            const newShareBtn = shareBtn.cloneNode(true);
            shareBtn.parentNode.replaceChild(newShareBtn, shareBtn);
            
            newShareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Share button clicked!');
                sharePopup.classList.add('active');
            });
            
            if (sharePopupClose) {
                const newCloseBtn = sharePopupClose.cloneNode(true);
                sharePopupClose.parentNode.replaceChild(newCloseBtn, sharePopupClose);
                
                newCloseBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Close button clicked!');
                    sharePopup.classList.remove('active');
                });
            }
            
            if (sharePopupOverlay) {
                const newOverlay = sharePopupOverlay.cloneNode(true);
                sharePopupOverlay.parentNode.replaceChild(newOverlay, sharePopupOverlay);
                
                newOverlay.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Overlay clicked!');
                    sharePopup.classList.remove('active');
                });
            }
            
            // Print
            const printBtn = document.getElementById('printProperty');
            if (printBtn) {
                const newPrintBtn = printBtn.cloneNode(true);
                printBtn.parentNode.replaceChild(newPrintBtn, printBtn);
                
                newPrintBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Print clicked!');
                    window.print();
                    sharePopup.classList.remove('active');
                });
            }
            
            // WhatsApp
            const whatsappBtn = document.getElementById('shareWhatsapp');
            if (whatsappBtn) {
                const newWhatsappBtn = whatsappBtn.cloneNode(true);
                whatsappBtn.parentNode.replaceChild(newWhatsappBtn, whatsappBtn);
                
                newWhatsappBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('WhatsApp clicked!');
                    const message = `Check out this property: ${property.title} (Ref: ${refNumber})\nPrice: ${property.price?.toLocaleString()} BHD\nLocation: ${property.location || property.area_name}\n${window.location.href}`;
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                    sharePopup.classList.remove('active');
                });
            }
            
            // Copy Link
            const copyLinkBtn = document.getElementById('copyLink');
            if (copyLinkBtn) {
                const newCopyLinkBtn = copyLinkBtn.cloneNode(true);
                copyLinkBtn.parentNode.replaceChild(newCopyLinkBtn, copyLinkBtn);
                
                newCopyLinkBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Copy link clicked!');
                    try {
                        await navigator.clipboard.writeText(window.location.href);
                        const originalText = newCopyLinkBtn.innerHTML;
                        newCopyLinkBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
                        setTimeout(() => {
                            newCopyLinkBtn.innerHTML = originalText;
                            sharePopup.classList.remove('active');
                        }, 1500);
                    } catch (err) {
                        console.error('Failed to copy link:', err);
                        alert('Failed to copy link');
                    }
                });
            }
            
            // Export PDF
            const exportPdfBtn = document.getElementById('exportPdf');
            if (exportPdfBtn) {
                const newExportPdfBtn = exportPdfBtn.cloneNode(true);
                exportPdfBtn.parentNode.replaceChild(newExportPdfBtn, exportPdfBtn);
                
                newExportPdfBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Export PDF clicked!');
                    window.print();
                    sharePopup.classList.remove('active');
                });
            }
            
            console.log('Share button setup complete!');
        } else {
            console.error('Share button or popup not found!', { shareBtn, sharePopup });
        }
    }

    populateFacilities(property) {
        const facilitiesList = document.getElementById('facilitiesList');
        if (!facilitiesList) return;
        
        // Define all available facilities with icons
        const allFacilities = [
            { name: 'Pool', icon: 'fa-swimming-pool', key: 'pool' },
            { name: 'Garden', icon: 'fa-tree', key: 'garden' },
            { name: 'Balcony', icon: 'fa-building', key: 'balcony' },
            { name: 'Central air conditioning', icon: 'fa-snowflake', key: 'ac' },
            { name: 'Fully fitted kitchen', icon: 'fa-utensils', key: 'kitchen' },
            { name: 'Security', icon: 'fa-shield-alt', key: 'security' },
            { name: 'Sea/Water view', icon: 'fa-water', key: 'sea_view' },
            { name: 'Kitchen Appliances', icon: 'fa-blender', key: 'appliances' },
            { name: 'Private Garden', icon: 'fa-leaf', key: 'private_garden' },
            { name: 'Storage room', icon: 'fa-box', key: 'storage' },
            { name: 'BBQ area', icon: 'fa-fire', key: 'bbq' },
            { name: 'Garden view', icon: 'fa-eye', key: 'garden_view' },
            { name: 'Parking', icon: 'fa-car', key: 'parking' },
            { name: 'Gym', icon: 'fa-dumbbell', key: 'gym' },
            { name: 'Elevator', icon: 'fa-elevator', key: 'elevator' },
            { name: 'Maid\'s room', icon: 'fa-user', key: 'maids_room' }
        ];
        
        // Show all facilities by default or filter based on property data
        const facilitiesToShow = property.facilities || allFacilities.slice(0, 12);
        
        facilitiesList.innerHTML = facilitiesToShow.map(facility => {
            const facilityData = typeof facility === 'string' 
                ? allFacilities.find(f => f.name.toLowerCase() === facility.toLowerCase()) || { name: facility, icon: 'fa-check-circle' }
                : facility;
            
            return `
                <div class="facility-tag">
                    <i class="fas ${facilityData.icon}"></i>
                    <span>${facilityData.name}</span>
                </div>
            `;
        }).join('');
    }

    populateGallery(property) {
        const gallery = document.getElementById('propertyGallery');
        const heroImage = document.getElementById('propertyHeroImage');
        
        // Use main image multiple times as placeholder
        const mainImage = property.image_url || property.main_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa';
        
        this.galleryImages = [
            mainImage,
            'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800',
            'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800',
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800'
        ];
        
        this.currentImageIndex = 0;
        
        // Populate main gallery (in description area)
        if (gallery) {
            gallery.innerHTML = this.galleryImages.map((img, index) => `
                <div class="gallery-item" style="background-image: url(${img})" 
                     onclick="propertyModal.setHeroImage(${index})"></div>
            `).join('');
        }
        
        // Add navigation arrows to hero image
        if (heroImage && !heroImage.querySelector('.nav-btn')) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'nav-btn prev';
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.onclick = (e) => {
                e.stopPropagation();
                this.previousImage();
            };
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'nav-btn next';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.onclick = (e) => {
                e.stopPropagation();
                this.nextImage();
            };
            
            heroImage.appendChild(prevBtn);
            heroImage.appendChild(nextBtn);
        }
    }
    
    setHeroImage(index) {
        this.currentImageIndex = index;
        const heroImage = document.getElementById('propertyHeroImage');
        if (heroImage) {
            heroImage.style.backgroundImage = `url(${this.galleryImages[index]})`;
        }
    }
    
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
        this.setHeroImage(this.currentImageIndex);
    }
    
    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        this.setHeroImage(this.currentImageIndex);
    }

    populateSimilarProperties(currentProperty) {
        const similarGrid = document.getElementById('similarPropertiesGrid');
        if (!similarGrid) return;
        
        // Get all properties from the global property list
        let allProperties = window.carltonProperties?.properties || 
                           window.propertiesPageManager?.properties || [];
        
        if (!allProperties || allProperties.length === 0) {
            similarGrid.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No similar properties available</p>';
            return;
        }
        
        // Filter similar properties based on:
        // 1. Same property type (Apartment, Villa, etc.)
        // 2. Same transaction type (Sale/Rent)
        // 3. Similar price range (±30%)
        // 4. Exclude current property
        const similarProperties = allProperties.filter(prop => {
            if (prop.id === currentProperty.id) return false;
            
            // Same property type
            const sameType = prop.property_type === currentProperty.property_type || 
                           prop.type_name === currentProperty.type_name;
            
            // Same transaction type (Sale/Rent)
            const sameTransaction = prop.for === currentProperty.for;
            
            // Similar price (±30%)
            const priceDiff = Math.abs(prop.price - currentProperty.price) / currentProperty.price;
            const similarPrice = priceDiff <= 0.3;
            
            return sameType && sameTransaction && similarPrice;
        });
        
        // If no similar properties found, show random properties of same type
        let propertiesToShow = similarProperties.length > 0 
            ? similarProperties.slice(0, 4)
            : allProperties.filter(p => p.id !== currentProperty.id).slice(0, 4);
        
        if (propertiesToShow.length === 0) {
            similarGrid.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No similar properties available</p>';
            return;
        }
        
        similarGrid.innerHTML = propertiesToShow.map(property => {
            const price = property.price ? property.price.toLocaleString() : 'Price on request';
            const image = property.image_url || property.main_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa';
            const location = property.location || property.area_name || 'Bahrain';
            const type = property.for_name || (property.for === 1 ? 'Sale' : 'Rent');
            
            return `
                <div class="similar-property-card" onclick="window.showPropertyDetails(${property.id})">
                    <div class="similar-property-image" style="background-image: url(${image})">
                        <span class="similar-property-badge">${type}</span>
                    </div>
                    <div class="similar-property-info">
                        <h4>${property.title}</h4>
                        <p class="similar-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${location}
                        </p>
                        <div class="similar-property-footer">
                            <span class="similar-price">${price} BHD</span>
                            ${property.bedrooms ? `<span class="similar-beds"><i class="fas fa-bed"></i> ${property.bedrooms}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Initialize modal manager
const propertyModal = new PropertyDetailsModal();

// Make it globally accessible
window.showPropertyDetails = function(propertyId) {
    // Find property from current properties list
    const property = window.carltonProperties?.properties?.find(p => p.id === propertyId) ||
                     window.propertiesPageManager?.properties?.find(p => p.id === propertyId);
    
    if (property) {
        propertyModal.openModal(property);
    }
};
