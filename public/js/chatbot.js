/**
 * Carlton Real Estate Chatbot
 * Advanced AI-powered chatbot for property inquiries
 */

class CarltonChatbot {
    constructor() {
        this.sessionId = null;
        this.isOpen = false;
        this.isInitialized = false;
        this.carltonAPI = null;
        this.properties = [];
        this.API_BASE = 'http://localhost:8000/api';
        
        // Initialize chatbot when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        this.setupElements();
        this.setupEventListeners();
        await this.initializeCarltonAPI();
        this.isInitialized = true;
        console.log('🤖 Carlton Chatbot initialized');
        
        // Load initial property data
        await this.loadProperties();
    }

    async initializeCarltonAPI() {
        if (window.carltonAPI) {
            this.carltonAPI = window.carltonAPI;
            console.log('✅ Carlton API connected to chatbot');
        } else {
            console.warn('⚠️ Carlton API not available for chatbot');
        }
    }

    async loadProperties() {
        try {
            // Check if properties are already loaded from the main page
            if (window.carltonProperties?.properties && window.carltonProperties.properties.length > 0) {
                this.properties = window.carltonProperties.properties;
                console.log(`✅ Chatbot using ${this.properties.length} properties from main page`);
                return;
            }
            
            console.log('📁 Loading properties from backend for chatbot...');
            
            // Set a timeout for the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
            
            const response = await fetch(`${this.API_BASE}/properties?limit=20`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Check for rate limiting
            if (response.status === 429) {
                console.warn('⚠️ API rate limit reached for chatbot, using empty property list');
                this.properties = window.carltonProperties?.properties || [];
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.data) {
                this.properties = data.data;
                console.log(`✅ Chatbot loaded ${this.properties.length} properties from backend`);
            } else {
                console.warn('⚠️ Backend did not return valid property data');
                this.properties = window.carltonProperties?.properties || [];
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('⚠️ Chatbot property load timeout, using fallback');
            } else {
                console.log('⚠️ Chatbot failed to load properties, using fallback');
            }
            this.properties = window.carltonProperties?.properties || [];
        }
    }

    setupElements() {
        this.elements = {
            toggle: document.getElementById('chatbot-toggle'),
            window: document.getElementById('chatbot-window'),
            minimize: document.getElementById('chatbot-minimize'),
            messages: document.getElementById('chatbot-messages'),
            actions: document.getElementById('chatbot-actions'),
            properties: document.getElementById('chatbot-properties'),
            input: document.getElementById('chatbot-input'),
            send: document.getElementById('chatbot-send'),
            statusText: document.getElementById('chatbot-status-text')
        };
    }

    setupEventListeners() {
        // Toggle chatbot window
        this.elements.toggle?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleChat();
            return false;
        });
        this.elements.minimize?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeChat();
            return false;
        });

        // Send message functionality
        this.elements.send?.addEventListener('click', () => this.sendMessage());
        this.elements.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Suggestion buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const text = e.target.getAttribute('data-text');
                if (text) {
                    this.elements.input.value = text;
                    this.sendMessage();
                }
            }
        });

        // Action buttons (dynamic)
        this.elements.actions?.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                this.handleActionButton(e.target);
            }
        });

        // Property action buttons (dynamic)
        this.elements.properties?.addEventListener('click', (e) => {
            if (e.target.classList.contains('property-action-btn')) {
                this.handlePropertyAction(e.target);
            }
        });
    }

    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.API_BASE}/../health`);
            if (response.ok) {
                this.updateStatus('Online', true);
                console.log('✅ Backend is healthy');
            } else {
                throw new Error('Backend unhealthy');
            }
        } catch (error) {
            console.warn('⚠️ Backend health check failed:', error.message);
            this.updateStatus('Offline', false);
        }
    }

    updateStatus(text, isOnline) {
        if (this.elements.statusText) {
            this.elements.statusText.textContent = text;
            const statusDot = document.querySelector('.status-dot');
            if (statusDot) {
                statusDot.style.background = isOnline ? '#25d366' : '#ef4444';
            }
        }
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
        return false; // Prevent any default action
    }

    async openChat() {
        if (!this.elements.window) {
            console.warn('⚠️ Chatbot window element not found');
            return;
        }
        
        this.elements.window.classList.add('active');
        this.isOpen = true;

        // Initialize session if not already done
        if (!this.sessionId) {
            await this.initializeSession();
        }

        // Focus input
        setTimeout(() => {
            this.elements.input?.focus();
        }, 300);
    }

    closeChat() {
        if (!this.elements.window) return;
        
        this.elements.window.classList.remove('active');
        this.isOpen = false;
    }

    async initializeSession() {
        // Check if required elements exist before initializing session
        if (!this.elements.messages || !this.elements.actions) {
            console.warn('⚠️ Chatbot elements not found, skipping session initialization');
            return;
        }
        
        try {
            const response = await fetch(`${this.API_BASE}/greeting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Hello'
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.sessionId = data.sessionId;
                console.log('🔑 Session initialized:', this.sessionId);
                
                // Clear welcome message and show AI greeting
                this.clearMessages();
                this.addBotMessage(data.message);
                this.displayActionButtons(data.nextActions);
            } else {
                throw new Error('Failed to initialize session');
            }
        } catch (error) {
            console.error('❌ Session initialization failed:', error);
            this.addBotMessage('Sorry, I\'m having trouble connecting. Please try again later or contact us directly at +973 1755 3300.');
        }
    }

    async sendMessage() {
        const message = this.elements.input.value.trim();
        if (!message) return;

        // Clear input
        this.elements.input.value = '';

        // Add user message to chat
        this.addUserMessage(message);

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await fetch(`${this.API_BASE}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    message: message,
                    language: 'auto'
                })
            });

            this.hideTypingIndicator();

            if (response.ok) {  
                const data = await response.json();
                
                // Update session ID if provided
                if (data.sessionId) {
                    this.sessionId = data.sessionId;
                }

                // Add bot response
                this.addBotMessage(data.message);

                // Display action buttons if provided
                if (data.actionButtons && data.actionButtons.length > 0) {
                    this.displayActionButtons(data.actionButtons);
                }

                // Display properties if provided
                if (data.properties && data.properties.length > 0) {
                    this.displayProperties(data.properties);
                }

            } else {
                throw new Error('Failed to send message');
            }

        } catch (error) {
            this.hideTypingIndicator();
            console.error('❌ Send message failed:', error);
            this.addBotMessage('Sorry, I encountered an error. Please try again or contact us at +973 1755 3300.');
        }
    }

    addUserMessage(message) {
        if (!this.elements.messages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        
        this.elements.messages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        if (!this.elements.messages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        // Process message for better formatting
        const formattedMessage = this.formatBotMessage(message);
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                ${formattedMessage}
            </div>
        `;
        
        this.elements.messages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatBotMessage(message) {
        // Convert line breaks to paragraphs
        const paragraphs = message.split('\n').filter(p => p.trim());
        return paragraphs.map(p => `<p>${this.escapeHtml(p)}</p>`).join('');
    }

    displayActionButtons(buttons) {
        if (!buttons || buttons.length === 0) {
            this.elements.actions.innerHTML = '';
            return;
        }

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'action-buttons';

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = `action-btn${button.isExternal ? ' external' : ''}`;
            btn.innerHTML = button.text;
            btn.setAttribute('data-action', button.action);
            btn.setAttribute('data-value', button.value || '');
            
            if (button.url) {
                btn.setAttribute('data-url', button.url);
            }

            buttonsContainer.appendChild(btn);
        });

        if (this.elements.actions) {
            this.elements.actions.innerHTML = '';
            this.elements.actions.appendChild(buttonsContainer);
        }
    }

    displayProperties(properties) {
        if (!properties || properties.length === 0) {
            if (this.elements.properties) {
                this.elements.properties.innerHTML = '';
            }
            return;
        }

        const propertiesContainer = document.createElement('div');
        propertiesContainer.className = 'chat-properties-container';

        properties.forEach(property => {
            const propertyCard = this.createPropertyCard(property);
            propertiesContainer.appendChild(propertyCard);
        });

        if (this.elements.properties) {
            this.elements.properties.innerHTML = '';
            this.elements.properties.appendChild(propertiesContainer);
        }
    }

    createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'chat-property-card';
        
        // Get the first image or use placeholder
        const imageUrl = (property.images && property.images.length > 0) 
            ? property.images[0] 
            : `https://via.placeholder.com/400x300?text=Property+${property.id}`;

        // Get title based on language or use English fallback
        const title = property.title?.en || property.title || 'Property';
        
        // Get price - use buy price by default, or rental price
        const price = property.price?.buy || property.price?.rent || property.price || 0;
        const priceLabel = property.price?.rent ? '/month' : '';

        card.innerHTML = `
            <div class="chat-property-image">
                <img src="${imageUrl}" alt="${title}" loading="lazy">
                <div class="property-price-tag">
                    BHD ${price.toLocaleString()} ${priceLabel}
                </div>
            </div>
            <div class="chat-property-details">
                <h4 class="chat-property-title">${title}</h4>
                <div class="chat-property-info">
                    <span><i class="fas fa-ruler-combined"></i> ${property.size}</span>
                    ${property.bedrooms > 0 ? `<span><i class="fas fa-bed"></i> ${property.bedrooms} beds</span>` : ''}
                    <span><i class="fas fa-bath"></i> ${property.bathrooms} baths</span>
                </div>
                <p class="chat-property-description">
                    ${property.description?.en || property.description || 'Beautiful property in Bahrain'}
                </p>
                <div class="chat-property-actions">
                    <button class="property-action-btn primary" data-property-id="${property.id}" data-action="whatsapp">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    <button class="property-action-btn secondary" data-property-id="${property.id}" data-action="details">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    handleActionButton(button) {
        const action = button.getAttribute('data-action');
        const value = button.getAttribute('data-value');
        const url = button.getAttribute('data-url');

        console.log('🔘 Action button clicked:', { action, value, url });

        if (url) {
            // External link - open in new tab
            window.open(url, '_blank');
            return;
        }

        switch (action) {
            case 'search_location':
                this.elements.input.value = `Properties in ${value}`;
                this.sendMessage();
                break;
            
            case 'type_apartment':
            case 'type_villa':
            case 'type_townhouse':
            case 'type_penthouse':
            case 'type_commercial':
                this.elements.input.value = `Show me ${value}s`;
                this.sendMessage();
                break;
            
            case 'purpose_buy':
            case 'purpose_rent':
            case 'purpose_investment':
                this.elements.input.value = `Properties for ${value}`;
                this.sendMessage();
                break;
            
            case 'phone_contact':
                window.location.href = `tel:${value}`;
                break;
            
            case 'email_contact':
                window.location.href = `mailto:${value}`;
                break;
            
            default:
                console.warn('Unknown action:', action);
        }
    }

    handlePropertyAction(button) {
        const propertyId = button.getAttribute('data-property-id');
        const action = button.getAttribute('data-action');

        console.log('🏠 Property action:', { propertyId, action });

        switch (action) {
            case 'whatsapp':
                // Generate WhatsApp URL with property details
                this.openWhatsApp(propertyId);
                break;
            
            case 'details':
                // Open property details page
                this.openPropertyDetails(propertyId);
                break;
        }
    }

    openWhatsApp(propertyId) {
        const message = `Hello, I'm interested in property ID ${propertyId} from Carlton Real Estate. Can you provide more information?`;
        const whatsappUrl = `https://wa.me/97317553300?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    openPropertyDetails(propertyId) {
        const detailsUrl = `https://listings.icarlton.com/en/property/${propertyId}`;
        window.open(detailsUrl, '_blank');
    }

    showTypingIndicator() {
        if (!this.elements.messages) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        this.elements.messages.appendChild(indicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        if (!this.elements.messages) return;
        
        const indicator = this.elements.messages.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    clearMessages() {
        if (this.elements.messages) {
            this.elements.messages.innerHTML = '';
        }
    }

    scrollToBottom() {
        if (this.elements.messages) {
            setTimeout(() => {
                this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
            }, 100);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chatbot when page loads
window.carltonChatbot = new CarltonChatbot();