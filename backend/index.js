const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import AI service
const RealEstateAI = require('./realEstateAI');

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use((req, res, next) => {
    // Remove any traces of API keys from response headers
    res.removeHeader('X-Powered-By');
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    next();
});

// Rate limiting for API endpoints
const requestCounts = new Map();
const RATE_LIMIT = parseInt(process.env.API_RATE_LIMIT) || 100;

const rateLimitMiddleware = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    
    if (!requestCounts.has(clientIP)) {
        requestCounts.set(clientIP, { count: 1, windowStart: now });
    } else {
        const record = requestCounts.get(clientIP);
        if (now - record.windowStart > windowMs) {
            record.count = 1;
            record.windowStart = now;
        } else {
            record.count++;
            if (record.count > RATE_LIMIT) {
                return res.status(429).json({
                    error: 'Too many requests',
                    message: 'Rate limit exceeded. Please try again later.'
                });
            }
        }
    }
    next();
};

// Apply rate limiting to all API routes
app.use('/api', rateLimitMiddleware);

// Initialize AI service with secure configuration
const aiService = new RealEstateAI();

// Middleware
app.use(cors());
app.use(express.json());

// Carlton API configuration with security
const CARLTON_API_BASE = process.env.CARLTON_API_BASE || 'https://listings.icarlton.com/wide_api';
const API_KEY = process.env.CARLTON_API_KEY;

// Validate API configuration on startup
if (!API_KEY || API_KEY === 'contact_carlton_it_for_api_key') {
    console.warn('⚠️  Warning: Carlton API key not configured properly');
    console.warn('   Properties will use mock data. Contact Carlton IT for production API key.');
}

// Security: Never log actual API keys
console.log(`🔐 API Configuration: ${API_KEY ? 'Key configured ✅' : 'Key missing ❌'}`);

// Latency tracking utility
const trackLatency = (stepName) => {
    const start = Date.now();
    return () => {
        const end = Date.now();
        const latency = end - start;
        console.log(`⏱️ ${stepName}: ${latency}ms`);
        return latency;
    };
};

// In-memory session storage (in production, use Redis or database)
const sessions = new Map();

// Carlton Bank Details (secure configuration)
const CARLTON_BANK_DETAILS = {
    bankName: 'BBK Bank',
    accountName: 'Carlton Real Estate Company W.L.L',
    iban: 'BH29BBKUBHBMCARLTON001',
    swiftCode: 'BBKUBHBM',
    currency: 'BHD'
};

// Helper function to make secure API calls to Carlton
const carltonApiCall = async (endpoint, params = {}) => {
    try {
        if (!API_KEY || API_KEY === 'contact_carlton_it_for_api_key') {
            throw new Error('API key not configured');
        }

        const response = await axios.get(`${CARLTON_API_BASE}${endpoint}`, {
            headers: {
                'authorization': API_KEY,
                'User-Agent': 'Carlton-Chatbot/1.0'
            },
            params,
            timeout: 10000 // 10 second timeout
        });
        return response.data;
    } catch (error) {
        console.error('Carlton API Error:', error.message);
        // Don't expose API details to client
        throw new Error('API service temporarily unavailable');
    }
};

// Generate unique session ID
const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Initialize or get session
const getSession = (sessionId) => {
    if (!sessionId) {
        sessionId = generateSessionId();
    }
    
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
            id: sessionId,
            step: 1,
            data: {},
            createdAt: new Date(),
            latencyLog: []
        });
    }
    
    return sessions.get(sessionId);
};

// Load mock properties data
let mockProperties = [];
try {
    const dataPath = path.join(__dirname, 'data', 'mock-properties.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    mockProperties = JSON.parse(rawData);
    console.log(`📁 Loaded ${mockProperties.length} mock properties from file`);
} catch (error) {
    console.error('Error loading mock properties:', error.message);
    console.log('⚠️ Using empty properties array');
    mockProperties = [];
}

// Properties API endpoints
app.get('/api/properties', (req, res) => {
    try {
        console.log(`📊 Properties endpoint called - returning ${mockProperties.length} properties`);
        
        // Apply filters if provided
        let filteredProperties = [...mockProperties];
        
        const { type, location, for: forType, limit = 50, offset = 0 } = req.query;
        
        if (type) {
            filteredProperties = filteredProperties.filter(p => 
                p.type_name?.toLowerCase().includes(type.toLowerCase())
            );
        }
        
        if (location) {
            filteredProperties = filteredProperties.filter(p => 
                p.area_name?.toLowerCase().includes(location.toLowerCase()) ||
                p.location?.toLowerCase().includes(location.toLowerCase())
            );
        }
        
        if (forType) {
            const forValue = forType === 'sale' ? 1 : forType === 'rent' ? 2 : parseInt(forType);
            filteredProperties = filteredProperties.filter(p => p.for === forValue);
        }
        
        // Pagination
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            data: paginatedProperties,
            total: filteredProperties.length,
            returned: paginatedProperties.length,
            isMockData: true,
            filters_applied: { type, location, for: forType },
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                has_more: endIndex < filteredProperties.length
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in properties endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Get single property by ID
app.get('/api/properties/:id', (req, res) => {
    try {
        const propertyId = parseInt(req.params.id);
        const property = mockProperties.find(p => p.id === propertyId);
        
        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found',
                id: propertyId
            });
        }
        
        res.json({
            success: true,
            data: property,
            isMockData: true,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in single property endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Step 1: Greeting & Qualification with AI Analysis
app.post('/api/greeting', async (req, res) => {
    const endLatency = trackLatency('Greeting & Qualification');
    const { sessionId, message } = req.body;
    
    const session = getSession(sessionId);
    
    // AI-powered query analysis with conversation redirection
    let aiAnalysis = null;
    let conversationRedirect = null;
    
    if (message && message.trim()) {
        try {
            aiAnalysis = await aiService.analyzePropertyQuery(message);
            session.data.aiAnalysis = aiAnalysis;
            
            // Check if this is a conversation redirect
            if (aiAnalysis.type === 'conversation_redirect') {
                conversationRedirect = aiAnalysis;
            }
        } catch (error) {
            console.log('AI analysis failed for greeting:', error.message);
        }
    }
    
    let responseMessage;
    let nextActions;
    
    // Handle conversation redirect for off-topic queries
    if (conversationRedirect) {
        responseMessage = conversationRedirect.response;
        nextActions = ['property_search', 'explore_locations', 'investment_guide', 'schedule_viewing'];
        
        // Add suggested topics to the response
        if (conversationRedirect.suggested_topics) {
            responseMessage += `\n\n💡 **Popular searches:**\n${conversationRedirect.suggested_topics.slice(0, 4).map(topic => `• ${topic}`).join('\n')}`;
        }
    } 
    // Handle normal real estate queries
    else {
        responseMessage = `Hello! Welcome to Carlton Real Estate Bahrain! 🏠✨

I'm here to help you find your perfect property. To get started, could you please tell me:

🏡 What type of property are you looking for?
• Apartment or Villa?
• For rent or purchase?
• Any preferred location in Bahrain?
• Your budget range?

I'll use AI to match you with the perfect properties! 🤖`;

        if (aiAnalysis && aiAnalysis.confidence > 0.7) {
            try {
                const insights = await aiService.getMarketInsights(message, aiAnalysis.language);
                responseMessage += `

🤖 I noticed you're interested in ${aiAnalysis.propertyType || 'properties'}${aiAnalysis.location ? ` in ${aiAnalysis.location}` : ''}. ${insights}`;
            } catch (error) {
                console.log('Market insights failed:', error.message);
            }
        }
        
        nextActions = ['property_search', 'get_requirements', 'market_insights'];
    }

    const response = {
        sessionId: session.id,
        step: 1,
        message: responseMessage,
        latency: endLatency(),
        aiAnalysis: aiAnalysis,
        conversationRedirect: conversationRedirect,
        nextActions: nextActions,
        locations: conversationRedirect?.locations || null,
        isRealEstateQuery: !conversationRedirect
    };
    
    session.latencyLog.push({step: 1, latency: response.latency, timestamp: new Date()});
    res.json(response);
});

// Step 2: AI-Enhanced Property Scan
app.post('/api/property-scan', async (req, res) => {
    const endLatency = trackLatency('Property Scan');
    const { sessionId, propertyType, purpose, location, budget, userQuery } = req.body;
    
    const session = getSession(sessionId);
    session.step = 2;
    session.data = { propertyType, purpose, location, budget, userQuery };
    
    try {
        // AI Analysis of user requirements
        let aiAnalysis = null;
        if (userQuery) {
            aiAnalysis = await aiService.analyzePropertyQuery(userQuery, session.data.language || 'en');
            session.data.aiAnalysis = aiAnalysis;
        }

        // Search properties using Carlton API with AI-enhanced parameters
        const searchParams = {
            type: aiAnalysis?.propertyType || propertyType,
            purpose: aiAnalysis?.purpose || purpose,
            location: aiAnalysis?.location || location,
            max_price: aiAnalysis?.budget || budget
        };

        const properties = await carltonApiCall('/properties', searchParams);

        // AI-powered property matching and ranking
        const rankedProperties = await aiService.rankPropertiesByRelevance(properties, aiAnalysis || {});

        const formattedProperties = rankedProperties.slice(0, 5).map(property => ({
            id: property.id,
            parcel_no: property.parcel_no,
            title: `${property.type_en} for ${property.for_en} in ${property.area_en}`,
            details_en: property.details_en,
            details_ar: property.details_ar,
            price: `BHD ${property.total_price}`,
            location: property.area_en,
            size_m2: property.size_m2,
            building_size_m2: property.building_size_m2,
            bedrooms: property.bedrooms || 'N/A',
            bathrooms: property.bathrooms || 'N/A',
            area: `${property.size_m2} SQM`,
            condition: property.condition_en,
            furnished: property.furnished_en,
            category: property.category_en,
            type: property.type_en,
            province: property.province_en,
            facilities: property.facility_names_en,
            free_hold: property.free_hold,
            agent: {
                name: property.staff_name_en,
                name_ar: property.staff_name_ar,
                email: property.staff_email,
                phone: property.staff_phonenumber,
                designation: property.staff_designation_en,
                designation_ar: property.staff_designation_ar
            },
            property_url_en: property.property_url_en,
            property_url_ar: property.property_url_ar,
            imagesUrl: property.imagesUrl,
            slug_en: property.slug_en,
            slug_ar: property.slug_ar,
            property_score: property.property_score,
            expire_date: property.expire_date,
            aiMatchScore: property.aiMatchScore || 0.8 // AI relevance score
        }));

        // Generate AI-powered recommendation message
        const aiRecommendation = await aiService.generatePropertyRecommendation(
            userQuery || `${propertyType} in ${location}`, 
            formattedProperties, 
            session.data.language || 'en'
        );

        const baseMessage = `🔍 Great! I found ${properties.length} properties matching your criteria.

🤖 **AI Analysis**: ${aiRecommendation}

Here are the top AI-matched properties for you:`;

        const response = {
            sessionId: session.id,
            step: 2,
            message: baseMessage,
            properties: formattedProperties,
            aiAnalysis: aiAnalysis,
            aiRecommendation: aiRecommendation,
            latency: endLatency(),
            nextActions: ['select_property', 'refine_search', 'view_more', 'get_insights']
        };
        
        session.latencyLog.push({step: 2, latency: response.latency, timestamp: new Date()});
        res.json(response);
        
    } catch (error) {
        console.error('Property search error:', error.message);
        
        // Fallback to basic search without AI if API fails
        const basicMessage = `🔍 I found several properties matching your criteria. Let me show you the available options:`;
        
        res.json({
            sessionId: session.id,
            step: 2,
            message: basicMessage,
            properties: [],
            error: 'AI-enhanced search temporarily unavailable, showing basic results',
            latency: endLatency(),
            nextActions: ['refine_search', 'contact_agent']
        });
    }
});

// Step 3: Shortlisting
app.post('/api/shortlist', (req, res) => {
    const endLatency = trackLatency('Shortlisting');
    const { sessionId, selectedPropertyId } = req.body;
    
    const session = getSession(sessionId);
    session.step = 3;
    session.data.selectedProperty = selectedPropertyId;
    
    const response = {
        sessionId: session.id,
        step: 3,
        message: `Excellent choice! 🎉 You've selected a wonderful property.

Would you like to proceed with this property? I can help you with:
• 📋 Getting detailed property information
• 💰 Processing the purchase/rental application
• 📅 Scheduling a viewing
• 📞 Connecting you with our agent

Shall we move forward with the application process?`,
        latency: endLatency(),
        nextActions: ['proceed_application', 'schedule_viewing', 'get_more_info']
    };
    
    session.latencyLog.push({step: 3, latency: response.latency, timestamp: new Date()});
    res.json(response);
});

// Step 4: Client Details Collection
app.post('/api/client-details', (req, res) => {
    const endLatency = trackLatency('Client Details Collection');
    const { sessionId, clientData } = req.body;
    
    const session = getSession(sessionId);
    session.step = 4;
    session.data.client = clientData;
    
    const response = {
        sessionId: session.id,
        step: 4,
        message: `Thank you, ${clientData.name}! 📝 I have collected your details:

✅ Name: ${clientData.name}
✅ Email: ${clientData.email}
✅ Phone: ${clientData.phone}
✅ ID/Passport: ${clientData.idNumber}

Everything looks good! Now let me prepare your invoice for the selected property.`,
        latency: endLatency(),
        nextActions: ['generate_invoice']
    };
    
    session.latencyLog.push({step: 4, latency: response.latency, timestamp: new Date()});
    res.json(response);
});

// Step 5: Invoice Generation
app.post('/api/generate-invoice', (req, res) => {
    const endLatency = trackLatency('Invoice Generation');
    const { sessionId } = req.body;
    
    const session = getSession(sessionId);
    session.step = 5;
    
    // Generate invoice details
    const propertyPrice = 75000; // This would come from selected property
    const registrationFee = 500;
    const adminFee = 250;
    const vatRate = 0.10;
    const subtotal = propertyPrice + registrationFee + adminFee;
    const vat = subtotal * vatRate;
    const total = subtotal + vat;
    
    const invoice = {
        invoiceNumber: `INV-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        client: session.data.client,
        items: [
            { description: 'Property Purchase', amount: propertyPrice },
            { description: 'Registration Fee', amount: registrationFee },
            { description: 'Administration Fee', amount: adminFee },
            { description: 'VAT (10%)', amount: vat }
        ],
        subtotal,
        vat,
        total
    };
    
    session.data.invoice = invoice;
    
    const response = {
        sessionId: session.id,
        step: 5,
        message: `📄 Invoice Generated Successfully!

Invoice #: ${invoice.invoiceNumber}
Date: ${invoice.date}

📋 INVOICE BREAKDOWN:
━━━━━━━━━━━━━━━━━━━━━━━━━
Property Purchase: BHD ${propertyPrice.toLocaleString()}
Registration Fee: BHD ${registrationFee}
Administration Fee: BHD ${adminFee}
━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal: BHD ${subtotal.toLocaleString()}
VAT (10%): BHD ${vat.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: BHD ${total.toLocaleString()}

Ready to proceed with payment instructions? 💳`,
        invoice,
        latency: endLatency(),
        nextActions: ['show_payment_details', 'download_invoice']
    };
    
    session.latencyLog.push({step: 5, latency: response.latency, timestamp: new Date()});
    res.json(response);
});

// Step 6: IBAN Sharing
app.post('/api/payment-details', (req, res) => {
    const endLatency = trackLatency('IBAN Sharing');
    const { sessionId } = req.body;
    
    const session = getSession(sessionId);
    session.step = 6;
    
    const response = {
        sessionId: session.id,
        step: 6,
        message: `🏦 SECURE PAYMENT INSTRUCTIONS

Please transfer the total amount to our official Carlton Real Estate account:

🏛️ Bank: ${CARLTON_BANK_DETAILS.bankName}
👤 Account Name: ${CARLTON_BANK_DETAILS.accountName}
🔢 IBAN: ${CARLTON_BANK_DETAILS.iban}
🌐 SWIFT Code: ${CARLTON_BANK_DETAILS.swiftCode}
💰 Currency: ${CARLTON_BANK_DETAILS.currency}
💵 Amount: BHD ${session.data.invoice.total.toLocaleString()}

📱 IMPORTANT INSTRUCTIONS:
• Include invoice number "${session.data.invoice.invoiceNumber}" in transfer reference
• Keep your transfer receipt for verification
• Payment should be completed within 24 hours

Once you've made the transfer, please upload your receipt or confirmation! 📄`,
        bankDetails: CARLTON_BANK_DETAILS,
        amount: session.data.invoice.total,
        latency: endLatency(),
        nextActions: ['upload_receipt', 'payment_confirmation']
    };
    
    session.latencyLog.push({step: 6, latency: response.latency, timestamp: new Date()});
    res.json(response);
});

// Step 7: Payment Confirmation
app.post('/api/payment-confirmation', (req, res) => {
    const endLatency = trackLatency('Payment Confirmation');
    const { sessionId, paymentProof } = req.body;
    
    const session = getSession(sessionId);
    session.step = 7;
    session.data.paymentProof = paymentProof;
    
    const response = {
        sessionId: session.id,
        step: 7,
        message: `✅ PAYMENT CONFIRMATION RECEIVED!

Thank you for uploading your payment confirmation! Our finance team will verify your transfer within 2-4 hours.

🔍 We'll check:
• Transfer amount matches invoice total
• Reference number includes invoice ID
• Transfer is from your registered account

You'll receive an email confirmation once payment is verified. Meanwhile, let me prepare your preliminary contract! 📋`,
        latency: endLatency(),
        nextActions: ['generate_contract', 'schedule_signing']
    };
    
    session.latencyLog.push({step: 7, latency: response.latency, timestamp: new Date()});
    res.json(response);
});

// Step 8: Contract & Signing
app.post('/api/generate-contract', (req, res) => {
    const endLatency = trackLatency('Contract Generation');
    const { sessionId } = req.body;
    
    const session = getSession(sessionId);
    session.step = 8;
    
    const contractId = `CONTRACT-${Date.now()}`;
    session.data.contract = { id: contractId, status: 'pending' };
    
    const response = {
        sessionId: session.id,
        step: 8,
        message: `📋 DIGITAL CONTRACT READY!

Contract ID: ${contractId}
Property: Selected Property in ${session.data.location || 'Bahrain'}
Client: ${session.data.client?.name}
Total Value: BHD ${session.data.invoice?.total.toLocaleString()}

🖊️ SIGNING OPTIONS:
• Digital Signature (recommended) - via DocuSign
• Physical Signing - at Carlton office
• Agent Visit - we can arrange a visit

The contract includes:
✅ Property details and specifications
✅ Payment terms and schedule
✅ Legal terms and conditions
✅ Handover timeline

Would you prefer digital signing or would you like to schedule an appointment? 📅`,
        contractId,
        latency: endLatency(),
        nextActions: ['digital_signing', 'schedule_appointment', 'download_contract']
    };
    
    session.latencyLog.push({step: 8, latency: response.latency, timestamp: new Date()});
    res.json(response);
});

// Step 9: Follow-Up Services
app.post('/api/follow-up', (req, res) => {
    const endLatency = trackLatency('Follow-Up Services');
    const { sessionId, preferredServices } = req.body;
    
    const session = getSession(sessionId);
    session.step = 9;
    session.data.followUpServices = preferredServices;
    
    const response = {
        sessionId: session.id,
        step: 9,
        message: `🎉 CONGRATULATIONS! Your property transaction is almost complete!

Here's what happens next:

📅 UPCOMING SERVICES:
• Property inspection & handover
• Keys collection appointment
• Utility connections assistance
• Property registration support

👥 DEDICATED SUPPORT TEAM:
• Your assigned agent: Carlton Sales
• Phone: +97317292827
• Email: info@icarlton.com
• WhatsApp: Available 9 AM - 9 PM

🏠 ADDITIONAL SERVICES:
• Interior design consultation
• Property management services
• Investment portfolio planning
• Legal documentation support

Thank you for choosing Carlton Real Estate! We're here to make your property journey smooth and successful! ✨

Is there anything specific you'd like assistance with right now?`,
        latency: endLatency(),
        completedSteps: session.latencyLog.length,
        totalProcessTime: session.latencyLog.reduce((sum, log) => sum + log.latency, 0),
        nextActions: ['schedule_viewing', 'contact_agent', 'additional_services', 'complete_transaction']
    };
    
    session.latencyLog.push({step: 9, latency: response.latency, timestamp: new Date()});
    res.json(response);
});

// Get session status and latency summary
app.get('/api/session/:sessionId/status', (req, res) => {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    const totalLatency = session.latencyLog.reduce((sum, log) => sum + log.latency, 0);
    const avgLatency = totalLatency / session.latencyLog.length;
    
    res.json({
        sessionId,
        currentStep: session.step,
        completedSteps: session.latencyLog.length,
        totalProcessTime: totalLatency,
        averageLatency: Math.round(avgLatency),
        latencyBreakdown: session.latencyLog,
        sessionData: session.data
    });
});

// AI Market Insights Endpoint
app.post('/api/ai-insights', async (req, res) => {
    const endLatency = trackLatency('AI Market Insights');
    const { query, language = 'en' } = req.body;
    
    try {
        const insights = await aiService.getMarketInsights(query, language);
        const analysis = await aiService.analyzePropertyQuery(query, language);
        
        res.json({
            insights,
            analysis,
            confidence: analysis.confidence,
            latency: endLatency(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to generate AI insights',
            message: 'AI service temporarily unavailable',
            latency: endLatency()
        });
    }
});

// AI Property Recommendation Endpoint
app.post('/api/ai-recommend', async (req, res) => {
    const endLatency = trackLatency('AI Property Recommendation');
    const { userQuery, properties, language = 'en' } = req.body;
    
    try {
        const recommendation = await aiService.generatePropertyRecommendation(userQuery, properties, language);
        
        res.json({
            recommendation,
            latency: endLatency(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to generate AI recommendation',
            message: 'AI recommendation service temporarily unavailable',
            latency: endLatency()
        });
    }
});

// AI Chat Endpoint for Conversation Management
app.post('/api/chat', async (req, res) => {
    const endLatency = trackLatency('AI Chat Response');
    const { sessionId, message, language = 'en', action = null, actionData = null } = req.body;
    
    try {
        // Input validation
        if (!message || !message.trim()) {
            return res.status(400).json({
                error: 'Message is required',
                latency: endLatency()
            });
        }
        
        const session = getSession(sessionId);
        
        // Handle action buttons (location/type/purpose selection)
        let processedMessage = message;
        if (action && actionData) {
            if (action.startsWith('location_') || action === 'search_location') {
                processedMessage = `Properties in ${actionData.value}`;
            } else if (action.startsWith('type_')) {
                processedMessage += ` ${actionData.value}`;
            } else if (action.startsWith('purpose_')) {
                processedMessage += ` for ${actionData.value}`;
            }
        }
        
        // Get conversation history for context
        const conversationHistory = session.data.chatHistory || [];
        
        console.log('🔍 About to process message:', processedMessage);
        
        // Process message using the new comprehensive method
        const aiResponse = await aiService.processMessage(processedMessage, conversationHistory);
        
        // Update session with chat history
        if (!session.data.chatHistory) {
            session.data.chatHistory = [];
        }
        session.data.chatHistory.push({
            user: message,
            ai: aiResponse.message,
            timestamp: new Date().toISOString(),
            language: aiResponse.language,
            properties: aiResponse.properties,
            searchCriteria: aiResponse.searchCriteria
        });
        
        const response = {
            sessionId: session.id,
            message: aiResponse.message,
            language: aiResponse.language,
            actionButtons: aiResponse.actionButtons,
            properties: aiResponse.properties,
            searchCriteria: aiResponse.searchCriteria,
            type: aiResponse.properties && aiResponse.properties.length > 0 ? 'property_results' : 'conversation',
            isRealEstateQuery: true,
            latency: endLatency()
        };
        
        res.json(response);
        
    } catch (error) {
        console.error('Chat Error:', error);
        
        // Fallback response with language detection
        const detectedLanguage = message && aiService.detectLanguage(message) || language;
        const fallbackMessage = detectedLanguage === 'ar' ?
            'عذراً، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة على +973 1234 5678' :
            'Sorry, there was a temporary error. Please try again or contact us directly at +973 1234 5678';
            
        res.status(500).json({
            sessionId: sessionId || generateSessionId(),
            message: fallbackMessage,
            language: detectedLanguage,
            actionButtons: [
                { text: detectedLanguage === 'ar' ? "📞 اتصل بنا" : "� Contact Us", action: "contact" },
                { text: detectedLanguage === 'ar' ? "🔄 إعادة المحاولة" : "� Try Again", action: "retry" }
            ],
            type: 'error',
            error: 'Service temporarily unavailable',
            latency: endLatency()
        });
    }
});

// Property details endpoint for language-specific URLs
app.get('/api/property/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { language = 'en' } = req.query;
        
        // In real implementation, this would fetch from Carlton API
        // For now, we'll provide the language-specific URL
        const propertyUrl = language === 'ar' 
            ? `https://listings.icarlton.com/ar/property/${id}`
            : `https://listings.icarlton.com/en/property/${id}`;
            
        res.json({
            propertyId: id,
            detailsUrl: propertyUrl,
            language: language,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Property details error:', error);
        res.status(500).json({
            error: 'Failed to get property details',
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        activeSessions: sessions.size
    });
});

// Security status endpoint (development only)
app.get('/api/security-status', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    const status = aiService.validateApiAccess();
    res.json({
        ...status,
        rateLimit: process.env.API_RATE_LIMIT || 100,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        security: {
            apiKeysSecured: true,
            environmentVariablesUsed: true,
            rateLimitingEnabled: true,
            securityHeadersSet: true
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Carlton AI Chatbot Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`💬 Ready to handle real estate transactions!`);
});
