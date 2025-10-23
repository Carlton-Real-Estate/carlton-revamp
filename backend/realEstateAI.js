const { HfInference } = require('@huggingface/inference');

class RealEstateAI {
    constructor() {
        // Secure API key handling
        const apiKey = process.env.HUGGINGFACE_API_KEY;
        
        // Only initialize HF if API key is provided
        if (apiKey && apiKey !== 'your_huggingface_api_key_here' && apiKey.trim() !== '') {
            this.hf = new HfInference(apiKey);
            this.aiEnabled = true;
            console.log('✅ AI Service initialized with Hugging Face API');
        } else {
            this.hf = null;
            this.aiEnabled = false;
            console.log('⚠️  AI Service running in fallback mode (no API key provided)');
        }
        
        // Never log or expose API keys
        if (process.env.NODE_ENV !== 'production') {
            this.logSecurityInfo();
        }

        // Language detection utility
        this.detectLanguage = (text) => {
            const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
            return arabicPattern.test(text) ? 'ar' : 'en';
        };
        
        // Ensure response is in the correct language and clean
        this.validateLanguageConsistency = (text, targetLanguage) => {
            if (targetLanguage === 'ar') {
                // Remove any English sections that might have been accidentally appended
                text = text.replace(/💡 \*\*Popular searches:\*\*[\s\S]*$/i, '');
                text = text.replace(/\*\*Popular Areas for Quick Selection:\*\*[\s\S]*$/i, '');
                text = text.replace(/• Luxury apartments in[\s\S]*$/i, '');
            } else if (targetLanguage === 'en') {
                // Remove any Arabic sections that might have been accidentally appended
                text = text.replace(/💡 \*\*العقارات الأكثر طلباً:\*\*[\s\S]*$/i, '');
                text = text.replace(/\*\*المناطق الأكثر طلباً:\*\*[\s\S]*$/i, '');
                text = text.replace(/• شقق فاخرة في[\s\S]*$/i, '');
            }
            return text.trim();
        };

        // HTML cleaning utility
        this.cleanHtmlTags = (text) => {
            if (!text) return text;
            return text
                .replace(/<br\s*\/?>/gi, '\n')  // Replace <br> and <br/> with newlines
                .replace(/<[^>]*>/g, '')        // Remove all other HTML tags
                .replace(/\n\s*\n/g, '\n')      // Remove multiple consecutive newlines
                .trim();                        // Remove leading/trailing whitespace
        };

        // Property images cache for better performance
        this.propertyImagesCache = new Map();
        this.imagesCacheExpiry = 60 * 60 * 1000; // 1 hour
        
        // Global attachments cache to avoid repeated API calls
        this.allAttachmentsCache = null;
        this.attachmentsCacheExpiry = 30 * 60 * 1000; // 30 minutes
        this.attachmentsCacheTimestamp = 0;
        
        // Property images utility - now fetches from Carlton API
        this.getPropertyImages = async (propertyId) => {
            if (!propertyId) return [];
            
            const cacheKey = `images_${propertyId}`;
            const cached = this.propertyImagesCache.get(cacheKey);
            
            // Return cached images if still valid
            if (cached && (Date.now() - cached.timestamp) < this.imagesCacheExpiry) {
                return cached.images;
            }
            
            try {
                const axios = require('axios');
                const API_KEY = process.env.CARLTON_API_KEY;
                const CARLTON_API_BASE = process.env.CARLTON_API_BASE || 'https://listings.icarlton.com/wide_api';
                
                if (!API_KEY || API_KEY === 'contact_carlton_it_for_api_key') {
                    // Fallback to placeholder image
                    return [`https://via.placeholder.com/400x300?text=Property+${propertyId}`];
                }
                
                // Check if we have cached all attachments
                let allAttachments = [];
                if (this.allAttachmentsCache && 
                    (Date.now() - this.attachmentsCacheTimestamp) < this.attachmentsCacheExpiry) {
                    allAttachments = this.allAttachmentsCache;
                } else {
                    const response = await axios.get(`${CARLTON_API_BASE}/property_attachments/all_attachments`, {
                        headers: {
                            'authorization': API_KEY,
                            'User-Agent': 'Carlton-Chatbot/1.0'
                        },
                        timeout: 10000  // Increased timeout
                    });
                    
                    allAttachments = response.data || [];
                    
                    // Cache the attachments globally
                    this.allAttachmentsCache = allAttachments;
                    this.attachmentsCacheTimestamp = Date.now();
                }
                
                // Filter attachments for this property that are visible
                const propertyImages = allAttachments
                    .filter(attachment => {
                        // Convert both to strings for comparison since API returns strings
                        const attachmentPropId = String(attachment.property_id);
                        const searchPropId = String(propertyId);
                        return attachmentPropId === searchPropId && 
                               attachment.visible === '1' && 
                               attachment.fileUrl;
                    })
                    .sort((a, b) => {
                        // Prioritize default images
                        if (a.is_default === '1' && b.is_default !== '1') return -1;
                        if (b.is_default === '1' && a.is_default !== '1') return 1;
                        // Then sort by sort order
                        return (parseInt(a.sort) || 0) - (parseInt(b.sort) || 0);
                    })
                    .map(attachment => attachment.fileUrl);
                
                // Cache the results
                this.propertyImagesCache.set(cacheKey, {
                    images: propertyImages,
                    timestamp: Date.now()
                });
                
                const result = propertyImages.length > 0 ? propertyImages : [`https://via.placeholder.com/400x300?text=Property+${propertyId}`];
                return result;
                
            } catch (error) {
                console.error(`❌ Error fetching images for property ${propertyId}:`, error.message);
                // Return placeholder on error
                return [`https://via.placeholder.com/400x300?text=Property+${propertyId}`];
            }
        };

        // Bilingual message generator
        this.getBilingualMessage = (enMessage, arMessage, language) => {
            if (language === 'ar' && arMessage) {
                return arMessage;
            }
            return enMessage;
        };

        // Bahraini Arabic context and local terminology
        this.bahrainArabicContext = {
            greetings: [
                "أهلاً وسهلاً", "مرحباً بك", "حياك الله", "تسلم", "عساك بخير"
            ],
            localTerms: {
                property: ["عقار", "ملك", "بيت", "دار", "محل"],
                apartment: ["شقة", "استديو", "وحدة سكنية", "بيت شعبي"],
                villa: ["فيلا", "بيت مستقل", "قصر", "استراحة"],
                rent: ["إيجار", "أجرة", "كراء", "للإيجار"],
                buy: ["شراء", "تملك", "للبيع", "بيع"],
                location: ["منطقة", "محل", "مكان", "موقع", "حي"],
                price: ["سعر", "ثمن", "فلوس", "دينار", "ريال"],
                area: ["مساحة", "متر", "قدم"],
                rooms: ["غرف", "غرفة", "صالة", "مجلس", "ديوانية"],
                kitchen: ["مطبخ", "طبخ"],
                bathroom: ["حمام", "دورة مياه", "مرحاض"],
                parking: ["موقف", "جراج", "ركنة سيارة"],
                garden: ["حديقة", "بستان", "حوش"],
                balcony: ["شرفة", "بلكونة", "تراس"],
                furnished: ["مفروش", "مجهز", "كامل التجهيز"],
                unfurnished: ["فاضي", "بدون أثاث", "غير مفروش"],
                new: ["جديد", "حديث", "طازج"],
                old: ["قديم", "عتيق"],
                luxury: ["فاخر", "راقي", "ممتاز", "VIP"],
                cheap: ["رخيص", "مناسب", "بسعر حلو"],
                expensive: ["غالي", "مكلف"]
            },
            locations: {
                juffair: ["الجفير", "جفير", "منطقة الجفير"],
                amwaj: ["أمواج", "جزر أمواج", "امواج آيلاند"],
                seef: ["السيف", "سيف", "منطقة السيف", "سيف مول"],
                adliya: ["العدلية", "عدلية"],
                manama: ["المنامة", "منامة", "وسط البلد"],
                muharraq: ["المحرق", "محرق", "مطار المحرق"],
                riffa: ["الرفاع", "رفاع", "الرفاع الشرقي", "الرفاع الغربي"],
                isa_town: ["مدينة عيسى", "عيسى تاون", "مدينة عيسى"],
                hamad_town: ["مدينة حمد", "حمد تاون"],
                sitra: ["سترة", "جزيرة سترة"],
                tubli: ["توبلي"],
                diplomatic: ["المنطقة الدبلوماسية", "الدبلوماسية"],
                hidd: ["الحد"],
                budaiya: ["البديع", "بديع"],
                janabiya: ["الجنبية"],
                zinj: ["الزنج"],
                gudaibiya: ["القضيبية"],
                hoora: ["الحورة"],
                naim: ["النعيم"]
            },
            conversationPhrases: {
                asking: ["ودي", "أبغي", "أريد", "عندكم", "يوجد", "موجود"],
                confirmation: ["إي", "نعم", "أكيد", "صح", "زين", "طيب"],
                negation: ["لا", "ما في", "مافي", "مو موجود"],
                questioning: ["شنو", "ايش", "وين", "متى", "كيف", "ليش"],
                politeness: ["لو سمحت", "إذا ممكن", "الله يعطيك العافية", "مشكور", "تسلم"]
            },
            commonExpressions: [
                "الله يعطيك العافية",
                "مشكور على التعاون",
                "إن شاء الله",
                "بالتوفيق",
                "زين كذا",
                "ما شاء الله",
                "بارك الله فيك"
            ]
        };

        // Real estate specific prompts and context using Carlton API data
        this.realEstateContext = {
            bahrain: {
                // Real Carlton API locations
                locations: ['Juffair', 'Amwaj Islands', 'Seef', 'Diplomatic Area', 'Manama', 'Muharraq', 'Busaiteen', 'Hidd', 'Sanabis', 'Saar', 'Al Markh', 'Al Qurayyah', 'Arad', 'Barbar', 'Diyar Al-Muharraq', 'Durrat Al Bahrain', 'Qalali', 'Saraya 2', 'Zinj'],
                priceRanges: {
                    budget: 'Under BHD 50,000',
                    mid: 'BHD 50,000 - BHD 100,000',
                    premium: 'BHD 100,000 - BHD 200,000',
                    luxury: 'Above BHD 200,000'
                },
                propertyTypes: ['Apartment', 'Villa', 'Townhouse', 'Studio', 'Penthouse', 'Commercial', 'Land'],
                amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Sea View', 'City View', 'Furnished', 'Balcony', 'Elevator']
            }
        };

        // Real estate conversation templates
        this.templates = {
            propertySearch: `You are a professional real estate assistant for Carlton Real Estate in Bahrain. 
            Help clients find properties based on their requirements. Always be helpful, professional, and knowledgeable about Bahrain's real estate market.
            
            Available locations: ${this.realEstateContext.bahrain.locations.join(', ')}
            Property types: ${this.realEstateContext.bahrain.propertyTypes.join(', ')}
            
            User request: "{query}"
            
            Respond professionally with property recommendations and ask relevant follow-up questions.`,
            
            propertyAnalysis: `Analyze this property inquiry for a Bahrain real estate client:
            Query: "{query}"
            
            Extract:
            - Property type (apartment, villa, etc.)
            - Preferred location
            - Budget range
            - Purpose (rent/buy)
            - Special requirements
            
            Respond in JSON format with extracted information.`,
            
            marketInsight: `Provide market insights for Bahrain real estate based on this query:
            "{query}"
            
            Include information about:
            - Market trends
            - Price ranges
            - Investment opportunities
            - Location advantages
            
            Be specific to Bahrain's market conditions.`,

            conversationRedirect: `You are a friendly real estate assistant for Carlton Real Estate in Bahrain. The user seems to be asking about something not related to real estate. 
            
            User said: "{query}"
            
            Politely acknowledge their message, then smoothly redirect the conversation back to Bahrain real estate. Highlight the amazing benefits of living in Bahrain and mention specific locations we serve. Be conversational and engaging while staying professional.
            
            Include information about:
            - Why Bahrain is an amazing place to live/invest
            - Key locations we serve (Juffair, Amwaj Islands, Seef District, etc.)
            - Benefits of the Bahrain real estate market
            - How Carlton can help them find their perfect property
            
            Keep it friendly and natural, not pushy.`
        };

        // Bahrain real estate benefits and location highlights
        this.bahrainBenefits = {
            lifestyle: {
                en: [
                    "Tax-free income for residents",
                    "Modern infrastructure and world-class amenities", 
                    "Strategic location connecting East and West",
                    "Rich cultural heritage with modern conveniences",
                    "Safe and family-friendly environment",
                    "Excellent healthcare and education systems"
                ],
                ar: [
                    "راتب بدون ضرايب للمقيمين",
                    "بنية تحتية حديثة ومرافق عالمية",
                    "موقع استراتيجي يربط الشرق والغرب",
                    "تراث ثقافي غني مع وسائل الراحة الحديثة",
                    "بيئة آمنة ومناسبة للعائلات",
                    "أنظمة صحية وتعليمية ممتازة"
                ]
            },
            investment: {
                en: [
                    "Stable political and economic environment",
                    "Growing expatriate population driving rental demand",
                    "Major infrastructure projects boosting property values",
                    "Gateway to GCC markets",
                    "Strong rental yields (6-8% annually)",
                    "Capital appreciation potential"
                ],
                ar: [
                    "بيئة سياسية واقتصادية مستقرة",
                    "زيادة عدد الوافدين يزيد الطلب على الإيجارات",
                    "مشاريع بنية تحتية كبيرة ترفع قيمة العقارات",
                    "بوابة إلى أسواق دول الخليج",
                    "عوائد إيجارية قوية (6-8% سنوياً)",
                    "إمكانية نمو رأس المال"
                ]
            },
            locations: {
                // Using real Carlton API location names
                'Juffair': {
                    en: "Vibrant lifestyle hub with restaurants, cafes, and entertainment",
                    ar: "مركز حيوي للحياة مع مطاعم ومقاهي وترفيه"
                },
                'Amwaj Islands': {
                    en: "Luxury waterfront living with marina and beach access",
                    ar: "معيشة فاخرة على الواجهة البحرية مع مرسى وشاطئ"
                },
                'Seef': {
                    en: "Commercial heart with shopping malls and business centers",
                    ar: "القلب التجاري مع مولات وأبراج أعمال"
                },
                'Diplomatic Area': {
                    en: "Prestigious area near embassies and government buildings",
                    ar: "منطقة راقية قريبة من السفارات والمباني الحكومية"
                },
                'Manama': {
                    en: "Historic capital with modern developments",
                    ar: "العاصمة التاريخية مع تطوير حديث"
                },
                'Muharraq': {
                    en: "Cultural heritage site with authentic Bahraini charm", 
                    ar: "موقع تراث ثقافي بسحر بحريني أصيل"
                },
                'Busaiteen': {
                    en: "Peaceful residential area with family-friendly amenities",
                    ar: "منطقة سكنية هادئة مع مرافق مناسبة للعائلات"
                },
                'Sanabis': {
                    en: "Central location with easy access to main areas",
                    ar: "موقع مركزي مع سهولة الوصول للمناطق الرئيسية"
                },
                'Hidd': {
                    en: "Coastal area with traditional Bahraini atmosphere",
                    ar: "منطقة ساحلية بأجواء بحرينية تقليدية"
                },
                'Saar': {
                    en: "Quiet suburban area ideal for families",
                    ar: "منطقة سكنية هادئة مثالية للعائلات"
                }
            }
        };
    }

    // Security information logging (development only)
    logSecurityInfo() {
        console.log('\n🔒 Security Status:');
        console.log(`- AI API Key: ${this.aiEnabled ? '✅ Configured' : '❌ Not configured'}`);
        console.log(`- Carlton API: ${process.env.CARLTON_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
        console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`- Rate Limiting: ${process.env.API_RATE_LIMIT || 100} requests/15min`);
        console.log('- API keys are secured and never exposed to frontend\n');
    }

    // Secure API key validation
    validateApiAccess() {
        return {
            aiAvailable: this.aiEnabled,
            apiConfigured: !!process.env.CARLTON_API_KEY,
            securityLevel: process.env.NODE_ENV === 'production' ? 'high' : 'development'
        };
    }

    // Check if user query is related to real estate
    isRealEstateRelated(query) {
        const realEstateKeywords = [
            // English
            'property', 'apartment', 'villa', 'house', 'rent', 'buy', 'purchase', 'lease',
            'bedroom', 'bathroom', 'furnished', 'location', 'area', 'price', 'budget',
            'real estate', 'investment', 'mortgage', 'broker', 'agent',
            // Arabic transliterations
            'bayt', 'shaqqa', 'villa', 'ijar', 'shira', 'sakan', 'maskan',
            // Standard Arabic real estate terms
            'شقة', 'فيلا', 'بيت', 'منزل', 'إيجار', 'شراء', 'استئجار', 'استثمار',
            'غرفة', 'حمام', 'مفروش', 'موقع', 'منطقة', 'سعر', 'ميزانية', 'دينار',
            'عقار', 'عقارات', 'سكن', 'مسكن', 'وكيل', 'وسيط',
            // Bahraini Arabic terms
            'ملك', 'دار', 'محل', 'استديو', 'وحدة سكنية', 'بيت شعبي', 'بيت مستقل',
            'قصر', 'استراحة', 'أجرة', 'كراء', 'تملك', 'حي', 'ثمن', 'فلوس', 'ريال',
            'غرف', 'صالة', 'مجلس', 'ديوانية', 'مطبخ', 'طبخ', 'دورة مياه', 'مرحاض',
            'موقف', 'جراج', 'ركنة سيارة', 'حديقة', 'بستان', 'حوش', 'شرفة', 'بلكونة',
            'تراس', 'مجهز', 'كامل التجهيز', 'فاضي', 'بدون أثاث', 'غير مفروش',
            'جديد', 'حديث', 'طازج', 'قديم', 'عتيق', 'فاخر', 'راقي', 'ممتاز',
            'رخيص', 'مناسب', 'بسعر حلو', 'غالي', 'مكلف', 'ودي', 'أبغي', 'عندكم',
            // Arabic location terms
            'الجفير', 'أمواج', 'سيف', 'المنامة', 'المحرق', 'الدبلوماسية', 'البحرين',
            'جفير', 'امواج', 'جزر أمواج', 'السيف', 'منطقة السيف', 'سيف مول', 'العدلية',
            'عدلية', 'منامة', 'وسط البلد', 'محرق', 'مطار المحرق', 'الرفاع', 'رفاع',
            'الرفاع الشرقي', 'الرفاع الغربي', 'مدينة عيسى', 'عيسى تاون', 'مدينة حمد',
            'حمد تاون', 'سترة', 'جزيرة سترة', 'توبلي', 'المنطقة الدبلوماسية',
            'الحد', 'البديع', 'بديع', 'الجنبية', 'الزنج', 'القضيبية', 'الحورة', 'النعيم',
            // Locations in Bahrain
            'juffair', 'amwaj', 'seef', 'manama', 'muharraq', 'diplomatic', 'bahrain',
            'saar', 'riffa', 'isa town', 'hamad town', 'tubli', 'exhibition road'
        ];

        // Check both original and lowercase versions for compatibility
        const isRealEstate = realEstateKeywords.some(keyword => 
            query.includes(keyword) || query.toLowerCase().includes(keyword.toLowerCase())
        );
        
        console.log(`🏠 Real Estate Check: "${query}" -> ${isRealEstate}`);
        if (isRealEstate) {
            const found = realEstateKeywords.filter(keyword => 
                query.includes(keyword) || query.toLowerCase().includes(keyword.toLowerCase())
            );
            console.log(`✅ Found keywords: ${found.join(', ')}`);
        }
        
        return isRealEstate;
    }

    // Handle conversation redirection for off-topic queries
    async handleConversationRedirect(userQuery, language = 'en') {
        console.log('🔀 Redirecting conversation back to real estate...');
        
        try {
            let redirectResponse;
            
            if (this.aiEnabled) {
                // Use AI to generate natural redirection
                const prompt = this.templates.conversationRedirect.replace('{query}', userQuery);
                redirectResponse = await this.getAIAnalysis(userQuery, 'conversationRedirect');
            }
            
            // If AI fails or unavailable, use structured redirection
            if (!redirectResponse) {
                redirectResponse = this.generateFallbackRedirection(userQuery, language);
            }

            return {
                type: 'conversation_redirect',
                isRealEstateQuery: false,
                response: redirectResponse,
                suggested_topics: this.getBahrainRealEstateTopics(language),
                locations: Object.keys(this.bahrainBenefits.locations),
                confidence: 0.9,
                method: this.aiEnabled ? 'ai_redirect' : 'structured_redirect'
            };

        } catch (error) {
            console.error('❌ Conversation redirect error:', error);
            return {
                type: 'conversation_redirect',
                isRealEstateQuery: false,
                response: this.generateFallbackRedirection(userQuery, language),
                error: 'Redirect processing failed'
            };
        }
    }

    // Generate structured redirection response
    generateFallbackRedirection(userQuery, language) {
        const greetingsEn = [
            "I appreciate your question!",
            "Thank you for reaching out!",
            "That's interesting!",
            "I understand,"
        ];

        const greetingsAr = [
            "أهلاً وسهلاً!",
            "حياك الله!",
            "تسلم على السؤال!",
            "الله يعطيك العافية!",
            "مشكور على التواصل!",
            "عساك بخير!"
        ];

        const transitionsEn = [
            "However, I'm here to help you find the perfect property in Bahrain.",
            "But let me tell you about something even more exciting - Bahrain's amazing real estate opportunities!",
            "Speaking of great experiences, have you considered the incredible lifestyle Bahrain offers?",
            "That reminds me of the amazing opportunities available in Bahrain's real estate market!"
        ];

        const transitionsAr = [
            "بس أنا هني عشان أساعدك تلاقي العقار المناسب في البحرين.",
            "بس خليني أقولك عن شي أحلى - فرص العقارات الحلوة في البحرين!",
            "وأنا أتكلم عن الأشياء الحلوة، فكرت في أسلوب الحياة الرائع في البحرين؟",
            "هذا يذكرني بالفرص الممتازة الموجودة في سوق العقارات البحريني!"
        ];

        const greeting = this.getBilingualMessage(
            greetingsEn[Math.floor(Math.random() * greetingsEn.length)],
            greetingsAr[Math.floor(Math.random() * greetingsAr.length)],
            language
        );

        const transition = this.getBilingualMessage(
            transitionsEn[Math.floor(Math.random() * transitionsEn.length)],
            transitionsAr[Math.floor(Math.random() * transitionsAr.length)],
            language
        );

        const locations = Object.keys(this.bahrainBenefits.locations);
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const locationBenefit = this.bahrainBenefits.locations[randomLocation];

        const benefits = language === 'ar' ? 
            this.bahrainBenefits.lifestyle.ar.slice(0, 3) : 
            this.bahrainBenefits.lifestyle.en.slice(0, 3);

        const locationDescription = language === 'ar' ? 
            locationBenefit.ar : locationBenefit.en;

        // Get proper location name based on language
        const locationDisplayName = language === 'ar' ? 
            this.getArabicLocationName(randomLocation) : 
            (randomLocation.charAt(0).toUpperCase() + randomLocation.slice(1).replace('_', ' '));

        const allLocationNames = language === 'ar' ? 
            locations.map(loc => this.getArabicLocationName(loc)) : 
            locations.map(loc => loc.charAt(0).toUpperCase() + loc.slice(1).replace('_', ' '));

        if (language === 'ar') {
            return `${greeting} ${transition}

🏢 **لماذا تختار البحرين للعقارات:**
${benefits.map(benefit => `• ${benefit}`).join('\n')}

🌟 **منطقة مميزة - ${locationDisplayName}:**
${locationDescription}

🏠 **مناطق خدماتنا:**
${allLocationNames.join(' • ')}

✨ **خدمات كارلتون العقارية:**
• قوائم شقق وفلل متميزة
• تحليل فرص الاستثمار العقاري
• رؤى السوق والتقييمات المهنية
• ترتيب زيارات عقارية احترافية

أي نوع عقار تبحث عنه في البحرين؟ 🏡

💡 **العقارات الأكثر طلباً:**
• شقق فاخرة في منطقة الجفير
• فلل على الواجهة البحرية في جزر أمواج
• عقارات تجارية استثمارية في السيف
• منازل عائلية تنفيذية في المنطقة الدبلوماسية

${this.bahrainArabicContext.commonExpressions[Math.floor(Math.random() * this.bahrainArabicContext.commonExpressions.length)]}`;
        }

        return `${greeting} ${transition}

🏢 **Why Choose Bahrain for Property Investment:**
${benefits.map(benefit => `• ${benefit}`).join('\n')}

🌟 **Featured Location - ${locationDisplayName}:**
${locationDescription}

🏠 **Our Service Areas:**
${allLocationNames.join(' • ')}

✨ **Carlton Real Estate Services:**
• Premium apartment and villa listings
• Investment opportunity analysis
• Comprehensive market insights and valuations
• Professional property viewing arrangements

What type of property interests you in Bahrain? 🏡

💡 **Most Requested Properties:**
• Luxury apartments in Juffair district
• Waterfront villas in Amwaj Islands
• Commercial investment properties in Seef
• Executive family homes in Diplomatic Area`;
    }

    // Helper method to get Arabic location names using real Carlton API data
    getArabicLocationName(location) {
        const arabicNames = {
            // Real Carlton API area mappings
            'Al Markh': 'المرخ',
            'Al Qurayyah': 'القريه', 
            'Amwaj Islands': 'جزر امواج',
            'Arad': 'عراد',
            'Barbar': 'باربار',
            'Busaiteen': 'البسيتين',
            'Diplomatic Area': 'المنطقة الدبلوماسية',
            'Diyar Al-Muharraq': 'ديار المحرق',
            'Durrat Al Bahrain': 'درة البحرين',
            'Hidd': 'الحد',
            'Juffair': 'الجفير',
            'Manama': 'المنامة',
            'Muharraq': 'المحرق',
            'Qalali': 'قلالي',
            'Saar': 'سار',
            'Sanabis': 'السنابس',
            'Saraya 2': 'سرايا 2',
            'Seef': 'السيف',
            'Zinj': 'الزنج',
            
            // Legacy mappings for backwards compatibility
            'juffair': 'الجفير',
            'amwaj': 'جزر امواج',
            'seef': 'السيف',
            'diplomatic': 'المنطقة الدبلوماسية',
            'manama': 'المنامة',
            'muharraq': 'المحرق',
            'riffa': 'الرفاع',
            'isa_town': 'مدينة عيسى'
        };
        return arabicNames[location] || location;
    }

    // Get suggested real estate topics
    getBahrainRealEstateTopics(language = 'en') {
        const topics = {
            en: [
                "Luxury apartments in Juffair",
                "Waterfront villas in Amwaj Islands", 
                "Investment properties in Seef District",
                "Family homes in Diplomatic Area",
                "Modern apartments in Manama",
                "Traditional houses in Muharraq",
                "Rental yield analysis",
                "Property investment guide",
                "Market trends in Bahrain"
            ],
            ar: [
                "شقق فاخرة في الجفير",
                "فلل على الواجهة البحرية في جزر أمواج",
                "عقارات استثمارية في منطقة السيف",
                "منازل عائلية في المنطقة الدبلوماسية",
                "شقق حديثة في المنامة",
                "بيوت تقليدية في المحرق",
                "تحليل عوائد الإيجار",
                "دليل الاستثمار العقاري",
                "اتجاهات السوق في البحرين"
            ]
        };
        return topics[language] || topics.en;
    }

    // Generate location selection buttons using real Carlton API data
    getLocationButtons(language = 'en') {
        const locations = {
            en: [
                { text: "⭐ Juffair", action: "search_location", value: "Juffair" },
                { text: "⭐ Amwaj Islands", action: "search_location", value: "Amwaj Islands" },
                { text: "⭐ Seef", action: "search_location", value: "Seef" },
                { text: "⭐ Diplomatic Area", action: "search_location", value: "Diplomatic Area" },
                { text: "⭐ Manama", action: "search_location", value: "Manama" },
                { text: "⭐ Muharraq", action: "search_location", value: "Muharraq" },
                { text: "⭐ Busaiteen", action: "search_location", value: "Busaiteen" },
                { text: "⭐ Hidd", action: "search_location", value: "Hidd" },
                { text: "⭐ Sanabis", action: "search_location", value: "Sanabis" },
                { text: "⭐ Saar", action: "search_location", value: "Saar" },
                { text: "⭐ Al Markh", action: "search_location", value: "Al Markh" },
                { text: "⭐ Zinj", action: "search_location", value: "Zinj" }
            ],
            ar: [
                { text: "⭐ الجفير", action: "search_location", value: "Juffair" },
                { text: "⭐ جزر امواج", action: "search_location", value: "Amwaj Islands" },
                { text: "⭐ السيف", action: "search_location", value: "Seef" },
                { text: "⭐ المنطقة الدبلوماسية", action: "search_location", value: "Diplomatic Area" },
                { text: "⭐ المنامة", action: "search_location", value: "Manama" },
                { text: "⭐ المحرق", action: "search_location", value: "Muharraq" },
                { text: "⭐ البسيتين", action: "search_location", value: "Busaiteen" },
                { text: "⭐ الحد", action: "search_location", value: "Hidd" },
                { text: "⭐ السنابس", action: "search_location", value: "Sanabis" },
                { text: "⭐ سار", action: "search_location", value: "Saar" },
                { text: "⭐ المرخ", action: "search_location", value: "Al Markh" },
                { text: "⭐ الزنج", action: "search_location", value: "Zinj" }
            ]
        };
        return locations[language] || locations.en;
    }

    // Generate property type selection buttons
    getPropertyTypeButtons(language = 'en') {
        const types = {
            en: [
                { text: "🏠 Apartment", action: "type_apartment", value: "apartment" },
                { text: "🏡 Villa", action: "type_villa", value: "villa" },
                { text: "🏢 Townhouse", action: "type_townhouse", value: "townhouse" },
                { text: "🌟 Penthouse", action: "type_penthouse", value: "penthouse" },
                { text: "🏭 Commercial", action: "type_commercial", value: "commercial" }
            ],
            ar: [
                { text: "🏠 شقة", action: "type_apartment", value: "apartment" },
                { text: "🏡 فيلا", action: "type_villa", value: "villa" },
                { text: "🏢 تاون هاوس", action: "type_townhouse", value: "townhouse" },
                { text: "🌟 بنتهاوس", action: "type_penthouse", value: "penthouse" },
                { text: "🏭 تجاري", action: "type_commercial", value: "commercial" }
            ]
        };
        return types[language] || types.en;
    }

    // Generate purchase type selection buttons
    getPurchaseTypeButtons(language = 'en') {
        const types = {
            en: [
                { text: "💰 Buy Property", action: "purpose_buy", value: "buy" },
                { text: "🏠 Rent Property", action: "purpose_rent", value: "rent" },
                { text: "📈 Investment", action: "purpose_investment", value: "investment" }
            ],
            ar: [
                { text: "💰 شراء عقار", action: "purpose_buy", value: "buy" },
                { text: "🏠 استئجار عقار", action: "purpose_rent", value: "rent" },
                { text: "📈 استثمار", action: "purpose_investment", value: "investment" }
            ]
        };
        return types[language] || types.en;
    }

    // Get real properties from Carlton API
    async getRealProperties(location, propertyType, budget, purpose = 'buy') {
        console.error('🏠 getRealProperties called with:', { location, propertyType, budget, purpose });
        try {
            const axios = require('axios');
            const API_KEY = process.env.CARLTON_API_KEY;
            const CARLTON_API_BASE = process.env.CARLTON_API_BASE || 'https://listings.icarlton.com/wide_api';

            console.error('🔑 API Key check:', API_KEY ? 'PRESENT' : 'MISSING');
            
            if (!API_KEY || API_KEY === 'contact_carlton_it_for_api_key') {
                console.error('⚠️ No API key available, using mock data');
                return this.getMockProperties(location, propertyType, budget, purpose);
            }

            // Use the proper listings endpoint with pagination and filtering
            const searchParams = {
                page: 1,
                per_page: 1580,  // Fetch all 1580 properties from the website
                status_id: 1,   // Only active properties
                show_website: 1 // Only properties visible on website
            };

            console.log('🔍 Searching Carlton Listings API with params:', searchParams);

            const response = await axios.get(`${CARLTON_API_BASE}/properties/listings`, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,  // Fixed header format
                    'User-Agent': 'Carlton-Chatbot/1.0'
                },
                params: searchParams,
                timeout: 10000
            });

            const properties = response.data.data || [];  // Carlton API returns data in 'data' field
            console.log(`✅ Found ${properties.length} properties from Carlton Listings API`);

            // Filter for available properties only (status_id = "1")
            // Removed expiry date filtering as requested
            let availableProperties = properties.filter(property => {
                const isAvailable = property.status_id === "1" || property.status_id === 1;
                const showOnWebsite = property.show_website === "1" || property.show_website === 1;
                
                // Only check for active status and website visibility
                // No expiry date filtering as requested
                return isAvailable && showOnWebsite;
            });

            // Apply user filters
            if (location) {
                const locationLower = location.toLowerCase();
                availableProperties = availableProperties.filter(property => {
                    return (property.area_en && property.area_en.toLowerCase().includes(locationLower)) ||
                           (property.area_ar && property.area_ar.includes(location)) ||
                           (property.city_en && property.city_en.toLowerCase().includes(locationLower)) ||
                           (property.city_ar && property.city_ar.includes(location));
                });
            }

            if (propertyType) {
                const typeLower = propertyType.toLowerCase();
                availableProperties = availableProperties.filter(property => {
                    return (property.type_en && property.type_en.toLowerCase().includes(typeLower)) ||
                           (property.type_ar && property.type_ar.includes(propertyType));
                });
            }

            if (purpose) {
                const purposeMapping = purpose === 'rent' ? 'lease' : 'sale';
                availableProperties = availableProperties.filter(property => {
                    return (property.for_en && property.for_en.toLowerCase().includes(purposeMapping)) ||
                           (property.for_ar && (purpose === 'rent' ? property.for_ar.includes('إيجار') : property.for_ar.includes('بيع')));
                });
            }

            if (budget && budget > 0) {
                availableProperties = availableProperties.filter(property => {
                    const price = purpose === 'rent' ? 
                        (property.rental_price || property.total_price || 0) : 
                        (property.total_price || 0);
                    return price <= budget;
                });
            }

            console.log(`✅ Found ${availableProperties.length} available properties after filtering`);

            // Format properties for the chatbot and fetch images
            const formattedProperties = await Promise.all(
                availableProperties.slice(0, 3).map(async (property) => {
                    const images = await this.getPropertyImages(parseInt(property.id));
                    
                    return {
                        id: property.id,
                        title: {
                            en: `${property.type_en || 'Property'} for ${property.for_en || purpose} in ${property.area_en || property.city_en || 'Bahrain'}`,
                            ar: `${property.type_ar || 'عقار'} ${property.for_ar || (purpose === 'rent' ? 'للإيجار' : 'للبيع')} في ${property.area_ar || property.city_ar || 'البحرين'}`
                        },
                        price: {
                            buy: property.total_price || 0,
                            rent: property.rental_price || property.total_price || 0
                        },
                        size: `${property.size_m2 || 0} sqm`,
                        bedrooms: property.bedrooms || 0,
                        bathrooms: property.bathrooms || 0,
                        type: propertyType || property.type_en?.toLowerCase() || 'property',
                        features: {
                            en: property.facility_names_en ? property.facility_names_en.split(',').map(f => f.trim()) : [],
                            ar: property.facility_names_ar ? property.facility_names_ar.split(',').map(f => f.trim()) : []
                        },
                        description: {
                            en: this.cleanHtmlTags(property.details_en) || `Beautiful ${property.type_en || 'property'} in ${property.area_en || property.city_en || 'Bahrain'}`,
                            ar: this.cleanHtmlTags(property.details_ar) || `${property.type_ar || 'عقار'} جميل في ${property.area_ar || property.city_ar || 'البحرين'}`
                        },
                        images: images,
                        staff: {
                            name: property.contact_person || 'Carlton Team',
                            phone: property.contact_phone || '+973 1234 5678',
                            email: property.contact_email || 'info@icarlton.com'
                        },
                        viewDetailsUrl: {
                            en: property.property_url_en || `https://listings.icarlton.com/en/property/${property.id}`,
                            ar: property.property_url_ar || `https://listings.icarlton.com/ar/property/${property.id}`
                        },
                        parcel_no: property.parcel_no,
                        condition: property.condition_en,
                        furnished: property.furnished_en,
                        free_hold: property.free_hold,
                        expire_date: property.expire_date,
                        status_id: property.status_id
                    };
                })
            );

            return formattedProperties;

        } catch (error) {
            console.error('Carlton API Error:', error.message);
            console.log('📝 Falling back to mock data');
            return this.getMockProperties(location, propertyType, budget, purpose);
        }
    }

    // Mock property data for demonstration  
    getMockProperties(location, propertyType, budget, purpose = 'buy') {
        const properties = {
            juffair: [
                {
                    id: 1,
                    title: { en: "Luxury 2BR Apartment in Juffair", ar: "شقة فاخرة بغرفتي نوم في الجفير" },
                    price: { buy: 85000, rent: 650 },
                    size: "120 sqm",
                    bedrooms: 2,
                    bathrooms: 2,
                    type: "apartment",
                    features: { 
                        en: ["Sea view", "Swimming pool", "Gym", "Parking"], 
                        ar: ["إطلالة بحرية", "مسبح", "صالة رياضية", "مواقف سيارات"] 
                    },
                    description: {
                        en: "Modern apartment with stunning sea views in the heart of Juffair",
                        ar: "شقة حديثة مع إطلالات بحرية خلابة في قلب الجفير"
                    },
                    viewDetailsUrl: {
                        en: "https://listings.icarlton.com/en/property/apartment-for-sale-in-juffair-1.html",
                        ar: "https://listings.icarlton.com/ar/property/شقة-للبيع-في-الجفير-1.html"
                    }
                },
                {
                    id: 2,
                    title: { en: "Executive 3BR Villa in Juffair", ar: "فيلا تنفيذية بثلاث غرف نوم في الجفير" },
                    price: { buy: 175000, rent: 1200 },
                    size: "250 sqm",
                    bedrooms: 3,
                    bathrooms: 3,
                    type: "villa",
                    features: { 
                        en: ["Private garden", "Maid's room", "2 parking spaces", "Beach access"], 
                        ar: ["حديقة خاصة", "غرفة خادمة", "موقفين سيارات", "وصول للشاطئ"] 
                    },
                    description: {
                        en: "Spacious villa with private amenities near the beach",
                        ar: "فيلا واسعة مع مرافق خاصة بالقرب من الشاطئ"
                    },
                    viewDetailsUrl: {
                        en: "https://listings.icarlton.com/en/property/villa-for-sale-in-juffair-2.html",
                        ar: "https://listings.icarlton.com/ar/property/فيلا-للبيع-في-الجفير-2.html"
                    }
                }
            ],
            amwaj: [
                {
                    id: 3,
                    title: { en: "Waterfront 4BR Villa in Amwaj", ar: "فيلا واجهة بحرية بأربع غرف في أمواج" },
                    price: { buy: 295000, rent: 1800 },
                    size: "350 sqm",
                    bedrooms: 4,
                    bathrooms: 4,
                    type: "villa",
                    features: { 
                        en: ["Private beach", "Marina access", "Swimming pool", "Landscaped garden"], 
                        ar: ["شاطئ خاص", "وصول للمارينا", "مسبح", "حديقة منسقة"] 
                    },
                    description: {
                        en: "Exclusive waterfront villa with direct beach access",
                        ar: "فيلا حصرية على الواجهة البحرية مع وصول مباشر للشاطئ"
                    },
                    viewDetailsUrl: {
                        en: "https://listings.icarlton.com/en/property/villa-for-sale-in-amwaj-3.html",
                        ar: "https://listings.icarlton.com/ar/property/فيلا-للبيع-في-أمواج-3.html"
                    }
                }
            ],
            seef: [
                {
                    id: 4,
                    title: { en: "Commercial Office in Seef District", ar: "مكتب تجاري في منطقة السيف" },
                    price: { buy: 120000, rent: 800 },
                    size: "180 sqm",
                    bedrooms: 0,
                    bathrooms: 2,
                    type: "commercial",
                    features: { 
                        en: ["Central location", "Business center", "Conference room", "High-speed internet"], 
                        ar: ["موقع مركزي", "مركز أعمال", "قاعة اجتماعات", "إنترنت عالي السرعة"] 
                    },
                    description: {
                        en: "Prime commercial space in Bahrain's business district",
                        ar: "مساحة تجارية ممتازة في المنطقة التجارية بالبحرين"
                    },
                    viewDetailsUrl: {
                        en: "https://listings.icarlton.com/en/property/office-for-sale-in-seef-4.html",
                        ar: "https://listings.icarlton.com/ar/property/مكتب-للبيع-في-السيف-4.html"
                    }
                }
            ]
        };

        let filteredProperties = [];
        
        // Filter by location
        if (location && properties[location]) {
            filteredProperties = properties[location];
        } else {
            // If no specific location, combine all properties
            filteredProperties = Object.values(properties).flat();
        }

        // Filter by property type
        if (propertyType && propertyType !== 'any') {
            filteredProperties = filteredProperties.filter(prop => prop.type === propertyType);
        }

        // Filter by budget
        if (budget && budget > 0) {
            filteredProperties = filteredProperties.filter(prop => {
                const price = prop.price[purpose] || prop.price.buy;
                return price <= budget;
            });
        }

        return filteredProperties.slice(0, 3); // Return max 3 properties
    }

    // Format property display for chatbot response
    formatPropertiesForDisplay(properties, language = 'en', purpose = 'buy') {
        if (!properties || properties.length === 0) {
            return language === 'ar' 
                ? "عذراً، لم نجد عقارات تطابق معاييرك. يرجى تجربة معايير أخرى أو الاتصال بنا للمساعدة."
                : "Sorry, no properties found matching your criteria. Please try different criteria or contact us for assistance.";
        }

        const currency = language === 'ar' ? 'د.ب' : 'BHD';
        const priceLabel = purpose === 'rent' 
            ? (language === 'ar' ? 'شهرياً' : '/month')
            : (language === 'ar' ? '' : '');

        let display = language === 'ar' 
            ? `🏠 وجدت ${properties.length} عقار مناسب:\n\n`
            : `🏠 Found ${properties.length} matching properties:\n\n`;

        properties.forEach((property, index) => {
            const price = property.price[purpose] || property.price.buy;
            const title = property.title[language] || property.title.en;
            const description = property.description[language] || property.description.en;
            const features = property.features[language] || property.features.en;

            display += `${index + 1}. **${title}**\n`;
            display += `💰 ${currency} ${price.toLocaleString()} ${priceLabel}\n`;
            display += `📐 ${property.size}`;
            
            if (property.bedrooms > 0) {
                display += ` | 🛏️ ${property.bedrooms} ${language === 'ar' ? 'غرف نوم' : 'bedrooms'}`;
            }
            
            display += ` | 🚿 ${property.bathrooms} ${language === 'ar' ? 'حمامات' : 'bathrooms'}\n`;
            display += `📝 ${description}\n`;
            display += `✨ ${features.join(' • ')}\n\n`;
        });

        display += language === 'ar'
            ? "للمزيد من التفاصيل أو لترتيب زيارة، يرجى الاتصال بنا:\n📞 +973 1234 5678\n📧 info@icarlton.com"
            : "For more details or to arrange a viewing, please contact us:\n📞 +973 1234 5678\n📧 info@icarlton.com";

        return display;
    }

    async analyzePropertyQuery(userQuery, language = 'en') {
        try {
            // Auto-detect language if not specified or if auto
            const detectedLanguage = this.detectLanguage(userQuery);
            const actualLanguage = (language === 'auto' || language === 'en') ? detectedLanguage : language;
            
            console.log(`🔍 Language Analysis: input="${language}", detected="${detectedLanguage}", actual="${actualLanguage}"`);
            
            // Check if this is a real estate query first
            const isRealEstate = this.isRealEstateRelated(userQuery);
            
            if (!isRealEstate) {
                return await this.handleConversationRedirect(userQuery, actualLanguage);
            }

            // Only use AI API if properly configured
            if (this.aiEnabled && this.hf) {
                const prompt = this.templates.propertyAnalysis.replace('{query}', userQuery);
                
                const response = await this.hf.textGeneration({
                    model: 'microsoft/DialoGPT-medium',
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 150,
                        temperature: 0.7,
                        return_full_text: false
                    }
                });

                const analysis = this.parsePropertyRequirements(userQuery, actualLanguage);
                return {
                    ...analysis,
                    aiSuggestion: response.generated_text || '',
                    confidence: this.calculateConfidence(analysis),
                    aiEnhanced: true,
                    language: actualLanguage
                };
            } else {
                // Fallback to local analysis without external API
                return {
                    ...this.parsePropertyRequirements(userQuery, actualLanguage),
                    aiEnhanced: false,
                    fallbackMode: true,
                    language: actualLanguage
                };
            }

        } catch (error) {
            console.log('AI analysis failed, using fallback:', error.message);
            return {
                ...this.parsePropertyRequirements(userQuery, language),
                aiEnhanced: false,
                error: 'AI temporarily unavailable',
                language: language
            };
        }
    }

    parsePropertyRequirements(query, language = 'en') {
        const queryLower = query.toLowerCase();
        
        // Extract property type
        const propertyType = this.extractPropertyType(queryLower, language);
        
        // Extract location
        const location = this.extractLocation(queryLower, language);
        
        // Extract purpose (rent/buy)
        const purpose = this.extractPurpose(queryLower, language);
        
        // Extract budget
        const budget = this.extractBudget(queryLower);
        
        // Extract amenities
        const amenities = this.extractAmenities(queryLower, language);

        return {
            propertyType,
            location,
            purpose,
            budget,
            amenities,
            language,
            originalQuery: query
        };
    }

    extractPropertyType(query, language) {
        const types = {
            en: {
                apartment: ['apartment', 'flat', 'unit', 'studio'],
                villa: ['villa', 'house', 'home'],
                townhouse: ['townhouse', 'town house'],
                penthouse: ['penthouse'],
                commercial: ['office', 'shop', 'retail', 'commercial', 'warehouse']
            },
            ar: {
                apartment: ['شقة', 'استديو', 'وحدة', 'وحدة سكنية', 'بيت شعبي'],
                villa: ['فيلا', 'بيت', 'منزل', 'دار', 'بيت مستقل', 'قصر', 'استراحة'],
                townhouse: ['تاون هاوس', 'بيت صف'],
                penthouse: ['بنتهاوس', 'دور علوي'],
                commercial: ['مكتب', 'محل', 'تجاري', 'مستودع', 'معرض']
            }
        };

        const langTypes = types[language] || types.en;
        
        // Also check Bahraini Arabic terms regardless of language parameter
        const bahrainTerms = this.bahrainArabicContext.localTerms;
        
        for (const [type, keywords] of Object.entries(langTypes)) {
            if (keywords.some(keyword => query.includes(keyword))) {
                return type;
            }
        }
        
        // Check specific Bahraini terms
        if (bahrainTerms.apartment.some(term => query.includes(term))) return 'apartment';
        if (bahrainTerms.villa.some(term => query.includes(term))) return 'villa';
        if (bahrainTerms.property.some(term => query.includes(term))) return 'apartment'; // default to apartment when property terms found
        
        return null; // return null if no property type found
    }

    extractLocation(query, language) {
        const queryLower = query.toLowerCase();
        const locations = {
            en: {
                // Real Carlton API locations
                'Al Markh': ['al markh', 'markh', 'المرخ'],
                'Al Qurayyah': ['al qurayyah', 'qurayyah', 'القريه'],
                'Amwaj Islands': ['amwaj', 'amwaj islands', 'أمواج', 'جزر امواج'],
                'Arad': ['arad', 'عراد'],
                'Barbar': ['barbar', 'باربار'],
                'Busaiteen': ['busaiteen', 'البسيتين'],
                'Diplomatic Area': ['diplomatic', 'diplomatic area', 'المنطقة الدبلوماسية'],
                'Diyar Al-Muharraq': ['diyar', 'diyar al-muharraq', 'ديار المحرق'],
                'Durrat Al Bahrain': ['durrat', 'durrat al bahrain', 'درة البحرين'],
                'Hidd': ['hidd', 'الحد'],
                'Juffair': ['juffair', 'jufair', 'الجفير'],
                'Manama': ['manama', 'المنامة'],
                'Muharraq': ['muharraq', 'المحرق'],
                'Qalali': ['qalali', 'قلالي'],
                'Saar': ['saar', 'سار'],
                'Sanabis': ['sanabis', 'السنابس'],
                'Saraya 2': ['saraya', 'saraya 2', 'سرايا 2'],
                'Seef': ['seef', 'seef district', 'السيف'],
                'Zinj': ['zinj', 'الزنج'],
                
                // Legacy locations for backwards compatibility
                juffair: ['juffair', 'jufair'],
                amwaj: ['amwaj', 'amwaj islands'],
                seef: ['seef', 'seef district'],
                adliya: ['adliya'],
                manama: ['manama'],
                muharraq: ['muharraq'],
                riffa: ['riffa'],
                isa_town: ['isa town'],
                hamad_town: ['hamad town'],
                sitra: ['sitra'],
                tubli: ['tubli'],
                zallag: ['zallag'],
                diplomatic: ['diplomatic area'],
                hidd: ['hidd'],
                budaiya: ['budaiya'],
                janabiya: ['janabiya'],
                zinj: ['zinj'],
                gudaibiya: ['gudaibiya'],
                hoora: ['hoora'],
                naim: ['naim']
            },
            ar: {
                // Real Carlton API Arabic locations
                'Al Markh': ['المرخ', 'مرخ'],
                'Al Qurayyah': ['القريه', 'قريه'],
                'Amwaj Islands': ['جزر امواج', 'امواج', 'أمواج'],
                'Arad': ['عراد'],
                'Barbar': ['باربار'],
                'Busaiteen': ['البسيتين', 'بسيتين'],
                'Diplomatic Area': ['المنطقة الدبلوماسية', 'الدبلوماسية'],
                'Diyar Al-Muharraq': ['ديار المحرق', 'ديار'],
                'Durrat Al Bahrain': ['درة البحرين', 'درة', 'الدرة'],
                'Hidd': ['الحد', 'حد'],
                'Juffair': ['الجفير', 'جفير', 'منطقة الجفير'],
                'Manama': ['المنامة', 'منامة', 'وسط البلد'],
                'Muharraq': ['المحرق', 'محرق', 'مطار المحرق'],
                'Qalali': ['قلالي'],
                'Saar': ['سار'],
                'Sanabis': ['السنابس', 'سنابس'],
                'Saraya 2': ['سرايا 2', 'سرايا'],
                'Seef': ['السيف', 'سيف', 'منطقة السيف', 'سيف مول'],
                'Zinj': ['الزنج', 'زنج'],
                
                // Legacy Arabic mappings
                juffair: ['الجفير', 'جفير', 'منطقة الجفير'],
                amwaj: ['أمواج', 'جزر أمواج', 'امواج آيلاند'],
                seef: ['السيف', 'سيف', 'منطقة السيف', 'سيف مول'],
                adliya: ['العدلية', 'عدلية'],
                manama: ['المنامة', 'منامة', 'وسط البلد'],
                muharraq: ['المحرق', 'محرق', 'مطار المحرق'],
                riffa: ['الرفاع', 'رفاع', 'الرفاع الشرقي', 'الرفاع الغربي'],
                isa_town: ['مدينة عيسى', 'عيسى تاون', 'مدينة عيسى'],
                hamad_town: ['مدينة حمد', 'حمد تاون'],
                sitra: ['سترة', 'جزيرة سترة'],
                tubli: ['توبلي'],
                zallag: ['الزلاق', 'زلاق'],
                diplomatic: ['المنطقة الدبلوماسية', 'الدبلوماسية'],
                hidd: ['الحد'],
                budaiya: ['البديع', 'بديع'],
                janabiya: ['الجنبية'],
                zinj: ['الزنج'],
                gudaibiya: ['القضيبية'],
                hoora: ['الحورة'],
                naim: ['النعيم']
            }
        };

        const langLocations = locations[language] || locations.en;
        
        // Check standard locations - prioritize exact Carlton API location names
        for (const [location, keywords] of Object.entries(langLocations)) {
            if (keywords.some(keyword => queryLower.includes(keyword.toLowerCase()))) {
                return location;
            }
        }
        
        // Also check Bahraini Arabic location terms for backwards compatibility
        const bahrainLocations = this.bahrainArabicContext.locations;
        for (const [location, terms] of Object.entries(bahrainLocations)) {
            if (terms.some(term => queryLower.includes(term))) {
                // Map legacy locations to Carlton API names where possible
                const locationMapping = {
                    'juffair': 'Juffair',
                    'amwaj': 'Amwaj Islands', 
                    'seef': 'Seef',
                    'manama': 'Manama',
                    'muharraq': 'Muharraq',
                    'diplomatic': 'Diplomatic Area',
                    'hidd': 'Hidd',
                    'zinj': 'Zinj'
                };
                return locationMapping[location] || location;
            }
        }
        
        return null;
    }

    extractPurpose(query, language) {
        const purposes = {
            en: {
                rent: ['rent', 'rental', 'lease', 'renting'],
                buy: ['buy', 'purchase', 'sale', 'buying', 'own']
            },
            ar: {
                rent: ['إيجار', 'للإيجار', 'استئجار', 'أجر', 'أجرة', 'كراء'],
                buy: ['شراء', 'للبيع', 'بيع', 'شراي', 'تملك']
            }
        };

        const langPurposes = purposes[language] || purposes.en;
        
        for (const [purpose, keywords] of Object.entries(langPurposes)) {
            if (keywords.some(keyword => query.includes(keyword))) {
                return purpose;
            }
        }
        
        // Check Bahraini Arabic terms
        if (this.bahrainArabicContext.localTerms.rent.some(term => query.includes(term))) return 'rent';
        if (this.bahrainArabicContext.localTerms.buy.some(term => query.includes(term))) return 'buy';
        
        return null; // return null if no purpose found
    }

    extractBudget(query) {
        // Look for various budget patterns
        const patterns = [
            /(\d+)\s*ألف\s*(دينار|د\.ب)?/i,  // Arabic thousands
            /(\d+)k\s*(bhd|bd|dinar|دينار)?/i,  // 100k format
            /(\d+)\s*(thousand|ألف)\s*(bhd|bd|dinar|دينار)?/i,  // thousand format
            /(\d+)\s*(bhd|bd|dinar|دينار)/i,  // direct currency amount
            /(\d+)\s*-\s*(\d+)\s*(bhd|bd|dinar|دينار|ألف)/i  // range format
        ];
        
        for (const pattern of patterns) {
            const match = query.match(pattern);
            if (match) {
                let amount = parseInt(match[1]);
                
                // If it mentions thousands (ألف) or 'k', multiply by 1000
                if (match[0].includes('ألف') || match[0].includes('k') || match[0].includes('thousand')) {
                    amount *= 1000;
                }
                
                return amount;
            }
        }
        
        return null;
    }

    extractAmenities(query, language) {
        const amenities = {
            en: {
                pool: ['pool', 'swimming'],
                gym: ['gym', 'fitness'],
                parking: ['parking', 'garage'],
                security: ['security', 'guard'],
                garden: ['garden', 'landscape'],
                view: ['view', 'sea view', 'city view'],
                furnished: ['furnished', 'furniture']
            },
            ar: {
                pool: ['مسبح', 'حمام سباحة', 'بركة سباحة'],
                gym: ['رياضة', 'جيم', 'صالة رياضية', 'نادي صحي'],
                parking: ['موقف', 'جراج', 'ركنة سيارة', 'ركن'],
                security: ['أمن', 'حراسة', 'حارس'],
                garden: ['حديقة', 'بستان', 'حوش'],
                view: ['إطلالة', 'منظر', 'إطلالة بحرية', 'منظر البحر'],
                furnished: ['مفروش', 'مجهز', 'كامل التجهيز']
            }
        };

        const langAmenities = amenities[language] || amenities.en;
        const found = [];
        
        // Check standard amenities
        for (const [amenity, keywords] of Object.entries(langAmenities)) {
            if (keywords.some(keyword => query.includes(keyword))) {
                found.push(amenity);
            }
        }
        
        // Check Bahraini Arabic terms
        const bahrainTerms = this.bahrainArabicContext.localTerms;
        if (bahrainTerms.furnished.some(term => query.includes(term))) {
            if (!found.includes('furnished')) found.push('furnished');
        }
        if (bahrainTerms.unfurnished.some(term => query.includes(term))) {
            if (!found.includes('unfurnished')) found.push('unfurnished');
        }
        if (bahrainTerms.parking.some(term => query.includes(term))) {
            if (!found.includes('parking')) found.push('parking');
        }
        if (bahrainTerms.garden.some(term => query.includes(term))) {
            if (!found.includes('garden')) found.push('garden');
        }
        if (bahrainTerms.balcony.some(term => query.includes(term))) {
            if (!found.includes('balcony')) found.push('balcony');
        }
        
        // Check for luxury indicators
        if (bahrainTerms.luxury.some(term => query.includes(term))) {
            if (!found.includes('luxury')) found.push('luxury');
        }
        if (bahrainTerms.new.some(term => query.includes(term))) {
            if (!found.includes('new')) found.push('new');
        }
        
        return found;
    }

    calculateConfidence(analysis) {
        let confidence = 0.5; // base confidence
        
        if (analysis.propertyType) confidence += 0.2;
        if (analysis.location) confidence += 0.2;
        if (analysis.purpose) confidence += 0.1;
        
        return Math.min(confidence, 1.0);
    }

    async generatePropertyRecommendation(userQuery, properties, language = 'en') {
        try {
            // Only use AI API if securely configured
            if (this.aiEnabled && this.hf) {
                const context = `You are a Carlton Real Estate assistant in Bahrain. Based on the user's query "${userQuery}", recommend the best properties from this list:

${properties.map((p, i) => `${i+1}. ${p.title} - ${p.price} in ${p.location}`).join('\n')}

Provide a personalized recommendation explaining why these properties match their needs.`;

                const response = await this.hf.textGeneration({
                    model: 'microsoft/DialoGPT-medium',
                    inputs: context,
                    parameters: {
                        max_new_tokens: 200,
                        temperature: 0.8,
                        return_full_text: false
                    }
                });

                return response.generated_text || this.generateFallbackRecommendation(properties, language);
            } else {
                // Use local recommendation logic
                return this.generateFallbackRecommendation(properties, language);
            }

        } catch (error) {
            console.log('AI recommendation failed, using fallback:', error.message);
            return this.generateFallbackRecommendation(properties, language);
        }
    }

    generateFallbackRecommendation(properties, language) {
        if (language === 'ar') {
            const expressions = this.bahrainArabicContext.commonExpressions;
            const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
            
            return `لقيتلك ${properties.length} عقارات حلوة تناسب اللي تدور عنه. هذي العقارات في مواقع ممتازة وبأسعار مناسبة في السوق البحريني. ${randomExpression}`;
        }
        
        return `I found ${properties.length} excellent properties that match your requirements. These properties are in prime locations with competitive pricing in the Bahrain market.`;
    }

    async getMarketInsights(query, language = 'en') {
        const insights = {
            en: {
                juffair: "Juffair is one of Bahrain's most popular residential areas, known for its vibrant lifestyle and excellent amenities. Average prices range from BHD 600-900 per sqm.",
                amwaj: "Amwaj Islands offers luxury waterfront living with premium amenities. Properties here typically range from BHD 800-1200 per sqm.",
                seef: "Seef District is the commercial heart of Manama, perfect for business professionals. Rental yields are typically 6-8% annually.",
                general: "Bahrain's real estate market shows steady growth with excellent rental yields and capital appreciation potential."
            },
            ar: {
                juffair: "الجفير من أشهر المناطق السكنية في البحرين، معروفة بأسلوب الحياة الحلو والمرافق الممتازة. متوسط الأسعار من 600-900 دينار للمتر المربع.",
                amwaj: "جزر أمواج توفر معيشة فاخرة على البحر مع مرافق راقية. العقارات هناك عادة من 800-1200 دينار للمتر المربع.",
                seef: "منطقة السيف هي قلب المنامة التجاري، مثالية للموظفين. العوائد الإيجارية عادة 6-8% في السنة.",
                general: "سوق العقارات البحريني يطلع بنمو مستقر مع عوائد إيجارية حلوة وإمكانية نمو رأس المال."
            }
        };

        const queryLower = query.toLowerCase();
        const langInsights = insights[language] || insights.en;
        
        // Check for Bahraini Arabic location terms
        if (language === 'ar') {
            const bahrainLocations = this.bahrainArabicContext.locations;
            for (const [location, terms] of Object.entries(bahrainLocations)) {
                if (terms.some(term => queryLower.includes(term))) {
                    return langInsights[location] || langInsights.general;
                }
            }
        }
        
        for (const [location, insight] of Object.entries(langInsights)) {
            if (queryLower.includes(location)) {
                return insight;
            }
        }
        
        return langInsights.general;
    }

    async rankPropertiesByRelevance(properties, analysis) {
        // AI-powered ranking based on user preferences
        return properties.map(property => {
            let relevanceScore = 0.5; // base score
            
            // Location matching
            if (analysis.location && property.area_en) {
                const locationMatch = property.area_en.toLowerCase().includes(analysis.location.toLowerCase());
                if (locationMatch) relevanceScore += 0.3;
            }
            
            // Property type matching
            if (analysis.propertyType && property.type_en) {
                const typeMatch = property.type_en.toLowerCase().includes(analysis.propertyType.toLowerCase());
                if (typeMatch) relevanceScore += 0.2;
            }
            
            // Budget matching
            if (analysis.budget && property.total_price) {
                const priceDiff = Math.abs(property.total_price - analysis.budget) / analysis.budget;
                if (priceDiff < 0.2) relevanceScore += 0.2; // within 20% of budget
                else if (priceDiff < 0.5) relevanceScore += 0.1; // within 50% of budget
            }
            
            // Amenity matching
            if (analysis.amenities && analysis.amenities.length > 0) {
                const facilityMatch = analysis.amenities.some(amenity => 
                    property.facility_names_en && property.facility_names_en.toLowerCase().includes(amenity)
                );
                if (facilityMatch) relevanceScore += 0.1;
            }
            
            return {
                ...property,
                aiMatchScore: Math.min(relevanceScore, 1.0)
            };
        }).sort((a, b) => b.aiMatchScore - a.aiMatchScore);
    }

    // Main method to process user messages and return comprehensive responses
    async processMessage(message, conversationHistory = []) {
        console.log('🚀 === PROCESSING MESSAGE ===');
        console.log('📝 Message:', message);
        console.log('===========================');
        
        const detectedLanguage = this.detectLanguage(message);
        
        // Extract property search criteria
        const location = this.extractLocation(message, detectedLanguage);
        const propertyType = this.extractPropertyType(message);
        const budget = this.extractBudget(message);
        const purpose = this.extractPurpose(message);
        
        console.error('🔍 Search criteria extracted:', { location, propertyType, budget, purpose });
        
        // Check if user is asking for properties or has search criteria
        const isPropertySearch = location || propertyType || budget || purpose || 
                               this.isPropertyQuery(message);
                               
        console.error('🤔 Is property search?', isPropertySearch, 'for message:', message);

        let responseText = '';
        let properties = [];
        
        if (isPropertySearch) {
            console.error('🏠 Calling getRealProperties...');
            // Get real properties from Carlton API
            properties = await this.getRealProperties(location, propertyType || 'apartment', budget, purpose || 'buy');
            
            if (properties.length > 0) {
                if (detectedLanguage === 'ar') {
                    responseText = `تأكيد، لدي ${properties.length} عقار مدرج 🔄 للبيع.\n` +
                                 `�️ أين تريد أن يكون موقع العقار؟`;
                } else {
                    responseText = `Sure, I have ${properties.length} properties listed 🔄 for ${purpose === 'rent' ? 'Rent' : 'Sale'}.\n` +
                                 `�️ Where would you like the property located?`;
                }
            } else {
                if (detectedLanguage === 'ar') {
                    responseText = `🏠 مرحباً بك في كارلتون العقارية!\n\n` +
                                 `عذراً، لم أجد عقارات تطابق معاييرك الحالية تماماً. ` +
                                 `لكن لا تقلق، لدينا ${this.totalAvailableProperties || '1580+'} عقار متاح!\n\n` +
                                 `💡 جرب البحث في المناطق الشعبية أدناه أو تواصل معنا مباشرة:\n\n` +
                                 `📞 الوساطة: +973 1755 3300\n📞 التقييم: +973 1729 2827\n📧 info@icarlton.com`;
                } else {
                    responseText = `🏠 Welcome to Carlton Real Estate!\n\n` +
                                 `Sorry, I couldn't find properties matching your exact criteria. ` +
                                 `But don't worry, we have ${this.totalAvailableProperties || '1580+'} properties available!\n\n` +
                                 `💡 Try searching in popular areas below or contact us directly:\n\n` +
                                 `📞 Brokerage: +973 1755 3300\n📞 Valuation: +973 1729 2827\n📧 info@icarlton.com`;
                }
            }
        } else {
            // For general inquiries, provide a friendly welcome and show location buttons
            if (detectedLanguage === 'ar') {
                responseText = `🏠 أهلاً وسهلاً بك في كارلتون العقارية!\n\n` +
                             `نحن خبراء العقارات في البحرين منذ عام 1996. لدينا أكثر من 1580 عقار متاح للبيع والإيجار.\n\n` +
                             `🌟 **المناطق الأكثر طلباً:**\n` +
                             `⭐ الجفير - مركز حيوي للحياة والترفيه\n` +
                             `⭐ جزر أمواج - معيشة فاخرة على الواجهة البحرية\n` +
                             `⭐ السيف - قلب المنامة التجاري والتسوق\n` +
                             `⭐ الدبلوماسية - منطقة راقية وحصرية\n\n` +
                             `💡 اختر منطقتك المفضلة للبدء:`;
            } else {
                responseText = `🏠 Welcome to Carlton Real Estate!\n\n` +
                             `We're Bahrain's property experts since 1996. We have over 1580 properties available for sale and rent.\n\n` +
                             `🌟 **Most Requested Areas:**\n` +
                             `⭐ Juffair - Vibrant lifestyle & entertainment hub\n` +
                             `⭐ Amwaj Islands - Luxury waterfront living\n` +
                             `⭐ Seef - Commercial heart & shopping district\n` +
                             `⭐ Diplomatic Area - Premium exclusive location\n\n` +
                             `💡 Choose your preferred area to get started:`;
            }
        }

        // Generate appropriate action buttons based on context
        let actionButtons = [];
        
        if (isPropertySearch && properties.length > 0) {
            // Show contact buttons with WhatsApp integration for property results
            const contactButtons = this.getContactButtons(properties[0], detectedLanguage);
            
            if (detectedLanguage === 'ar') {
                actionButtons = [
                    ...contactButtons,
                    { text: "🔍 بحث جديد", action: "new_search" },
                    { text: "� طلب معلومات إضافية", action: "request_info" }
                ];
            } else {
                actionButtons = [
                    ...contactButtons,
                    { text: "🔍 New Search", action: "new_search" },
                    { text: "� Request More Info", action: "request_info" }
                ];
            }
        } else {
            // For general inquiries or first-time visitors, prioritize location selection
            const locationButtons = this.getLocationButtons(detectedLanguage);
            
            // Just focus on location buttons for a cleaner, easier experience
            actionButtons = [...locationButtons];
        }

        // Ensure language consistency in the response
        responseText = this.validateLanguageConsistency(responseText, detectedLanguage);

        return {
            message: responseText,
            language: detectedLanguage,
            actionButtons: actionButtons,
            properties: properties,
            searchCriteria: {
                location,
                propertyType,
                budget,
                purpose
            }
        };
    }

    // Build prompt for AI conversation
    buildPrompt(message, conversationHistory, language) {
        const context = language === 'ar' ? 
            'أنت مساعد ذكي لشركة كارلتون العقارية في البحرين. ساعد العملاء في العثور على العقارات المناسبة.' :
            'You are an AI assistant for Carlton Real Estate in Bahrain. Help customers find suitable properties.';
        
        let prompt = `${context}\n\nUser: ${message}\nAssistant:`;
        
        // Add conversation history if available
        if (conversationHistory && conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-3); // Last 3 exchanges
            const historyText = recentHistory.map(h => `User: ${h.user}\nAssistant: ${h.assistant}`).join('\n');
            prompt = `${context}\n\nConversation History:\n${historyText}\n\nUser: ${message}\nAssistant:`;
        }
        
        return prompt;
    }

    // Call Hugging Face API for AI responses
    async callHuggingFaceAPI(prompt) {
        if (!this.aiEnabled || !this.hf) {
            throw new Error('AI service not available');
        }
        
        try {
            const response = await this.hf.textGeneration({
                model: 'microsoft/DialoGPT-medium',
                inputs: prompt,
                parameters: {
                    max_new_tokens: 150,
                    temperature: 0.7,
                    do_sample: true,
                    return_full_text: false
                }
            });
            
            return response.generated_text || 'I apologize, but I cannot provide a response at the moment. Please contact our team directly.';
        } catch (error) {
            console.error('Hugging Face API Error:', error);
            throw error;
        }
    }

    // Helper method to check if message is a property query
    isPropertyQuery(message) {
        const propertyKeywords = {
            en: ['property', 'house', 'apartment', 'villa', 'buy', 'rent', 'search', 'looking for', 'find'],
            ar: ['عقار', 'بيت', 'شقة', 'فيلا', 'شراء', 'إيجار', 'بحث', 'أبحث', 'أريد', 'ودي', 'أدور']
        };
        
        const lowerMessage = message.toLowerCase();
        const allKeywords = [...propertyKeywords.en, ...propertyKeywords.ar];
        
        return allKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
    }

    // Generate WhatsApp contact URL with property details
    generateWhatsAppURL(property, language = 'en', staffNumber = '97317553300') {
        const baseUrl = `https://wa.me/${staffNumber}`;
        
        // Create property details message
        let message = '';
        
        if (language === 'ar') {
            message = `مرحباً، أنا مهتم بهذا العقار:\n\n`;
            message += `🏠 ${property.title?.[language] || property.title?.en || 'عقار'}\n`;
            message += `💰 السعر: ${property.price?.buy || property.price} د.ب\n`;
            message += `📍 الموقع: ${property.location || property.area_ar || property.area_en || 'البحرين'}\n`;
            message += `📐 المساحة: ${property.size}\n`;
            if (property.bedrooms > 0) message += `🛏️ غرف النوم: ${property.bedrooms}\n`;
            message += `🚿 الحمامات: ${property.bathrooms}\n`;
            message += `\n🔗 رابط العقار: ${property.viewDetailsUrl?.[language] || property.viewDetailsUrl?.en || ''}\n`;
            message += `\nيرجى تزويدي بمزيد من المعلومات حول هذا العقار.`;
        } else {
            message = `Hello, I am interested in this property:\n\n`;
            message += `🏠 ${property.title?.[language] || property.title?.ar || 'Property'}\n`;
            message += `💰 Price: BHD ${property.price?.buy || property.price}\n`;
            message += `📍 Location: ${property.location || property.area_en || property.area_ar || 'Bahrain'}\n`;
            message += `📐 Size: ${property.size}\n`;
            if (property.bedrooms > 0) message += `🛏️ Bedrooms: ${property.bedrooms}\n`;
            message += `🚿 Bathrooms: ${property.bathrooms}\n`;
            message += `\n🔗 Property URL: ${property.viewDetailsUrl?.[language] || property.viewDetailsUrl?.ar || ''}\n`;
            message += `\nPlease provide me with more information about this property.`;
        }
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        return `${baseUrl}?text=${encodedMessage}`;
    }

    // Generate enhanced contact buttons with WhatsApp integration
    getContactButtons(property = null, language = 'en') {
        const staffNumber = process.env.CARLTON_WHATSAPP_NUMBER || '97317553300'; // Default Carlton number
        
        if (property) {
            // Property-specific contact buttons
            const whatsappUrl = this.generateWhatsAppURL(property, language, staffNumber);
            
            return language === 'ar' ? [
                { 
                    text: "📱 WhatsApp مع تفاصيل العقار", 
                    action: "whatsapp_contact", 
                    url: whatsappUrl,
                    isExternal: true 
                },
                { text: "📞 اتصال مباشر", action: "phone_contact", value: "+973 1755 3300" },
                { text: "📧 إرسال إيميل", action: "email_contact", value: "info@icarlton.com" }
            ] : [
                { 
                    text: "📱 WhatsApp with Property Details", 
                    action: "whatsapp_contact", 
                    url: whatsappUrl,
                    isExternal: true 
                },
                { text: "📞 Call Directly", action: "phone_contact", value: "+973 1755 3300" },
                { text: "📧 Send Email", action: "email_contact", value: "info@icarlton.com" }
            ];
        } else {
            // General contact buttons
            const generalMessage = language === 'ar' ? 
                'مرحباً، أود الاستفسار عن خدمات كارلتون العقارية.' :
                'Hello, I would like to inquire about Carlton Real Estate services.';
            
            const whatsappUrl = `https://wa.me/${staffNumber}?text=${encodeURIComponent(generalMessage)}`;
            
            return language === 'ar' ? [
                { 
                    text: "📱 WhatsApp", 
                    action: "whatsapp_contact", 
                    url: whatsappUrl,
                    isExternal: true 
                },
                { text: "📞 اتصال", action: "phone_contact", value: "+973 1755 3300" },
                { text: "📧 إيميل", action: "email_contact", value: "info@icarlton.com" }
            ] : [
                { 
                    text: "📱 WhatsApp", 
                    action: "whatsapp_contact", 
                    url: whatsappUrl,
                    isExternal: true 
                },
                { text: "📞 Call", action: "phone_contact", value: "+973 1755 3300" },
                { text: "📧 Email", action: "email_contact", value: "info@icarlton.com" }
            ];
        }
    }
}

module.exports = RealEstateAI;
