# Carlton Real Estate AI Chatbot

A comprehensive AI-powered chatbot for Carlton Real Estate Bahrain that handles complete property transactions from search to contract signing, enhanced with intelligent property matching, market insights, and smart conversation management.

## 🤖 AI Features

- **Intelligent Property Analysis** - Smart understanding of user requirements using NLP
- **AI-Powered Property Matching** - Advanced relevance scoring and ranking
- **Smart Conversation Management** - Automatically redirects off-topic conversations back to Bahrain real estate
- **Market Insights Generation** - Real-time market analysis and recommendations
- **Bilingual AI Processing** - Natural language understanding in English and Arabic
- **Smart Location Extraction** - Automatic detection of Bahraini locations and preferences
- **Personalized Recommendations** - AI-generated property suggestions based on user profile
- **Context-Aware Responses** - Maintains conversation flow while educating about Bahrain's benefits

## 🏠 Core Features

- **9-Step Transaction Workflow** - Complete property transaction process
- **Real-Time Latency Tracking** - Performance monitoring with visual indicators
- **Interactive Property Cards** - Clickable property selection with full details
- **Invoice Generation** - Automated invoice creation with detailed breakdowns
- **Payment Processing** - Secure IBAN sharing and payment instructions
- **Contract Generation** - Digital contract creation and signing options
- **Session Management** - Maintains transaction state throughout the process
- **Professional UI** - Modern, responsive design with animations

## 💬 Conversation Intelligence

The chatbot now features advanced conversation management that:
- **Detects Off-Topic Queries** - Recognizes when users ask about non-real estate topics
- **Smart Redirection** - Naturally guides conversations back to Bahrain real estate
- **Educational Responses** - Highlights benefits of living and investing in Bahrain
- **Location Promotion** - Showcases premium areas like Juffair, Amwaj Islands, Seef District
- **Cultural Awareness** - Responds appropriately in English and Arabic contexts

### Example Conversation Flow:
```
User: "What's the weather like?"
AI: "That reminds me of the amazing opportunities in Bahrain's real estate market! 

🌟 Bahrain offers year-round sunshine - perfect for waterfront properties in Amwaj Islands!

🏠 We serve these fantastic areas:
Juffair • Amwaj • Seef • Diplomatic • Manama • Muharraq

What type of property interests you most in Bahrain? 🏡"
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python 3.x
- Hugging Face account (optional, for advanced AI features)

### Backend Setup
```bash
cd backend
npm install

# SECURITY: Configure API keys securely
cp .env.template .env
# Edit .env file with your actual API keys (NEVER commit this file)

npm start
```
Backend will run on `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
python3 -m http.server 3000
```
Frontend will be available at `http://localhost:3000`

## 🔒 Security Configuration

### API Key Security (IMPORTANT!)
The chatbot uses secure environment variables for all API keys:

1. **Copy template**: `cp backend/.env.template backend/.env`
2. **Add your keys**: Edit `.env` with actual API keys
3. **Never commit**: `.env` files are excluded from git
4. **Production**: Use secure secret management systems

```bash
# .env file example (NEVER commit this file)
HUGGINGFACE_API_KEY=your_actual_key_here
CARLTON_API_KEY=contact_carlton_it_department
NODE_ENV=development
```

**🛡️ Security Features:**
- ✅ API keys stored in environment variables only
- ✅ Rate limiting to prevent abuse
- ✅ Security headers for XSS protection
- ✅ Input validation and sanitization
- ✅ Error messages don't expose internal details
- ✅ `.gitignore` prevents accidental key exposure

For detailed security information, see [SECURITY.md](./SECURITY.md)

## 📊 Workflow Steps

1. **Greeting & Qualification** (~500ms) - Initial property requirements
2. **Property Scan** (~1s) - Search and display available properties
3. **Shortlisting** (~400ms) - Property selection confirmation
4. **Client Details** (~600ms) - Customer information collection
5. **Invoice Creation** (~1.5s) - Automated invoice generation
6. **IBAN Sharing** (~300ms) - Secure payment details
7. **Payment Confirmation** (Variable) - Payment verification
8. **Contract & Signing** (~1.8s) - Digital contract creation
9. **Follow-Up** (~500ms) - Agent assignment and additional services

## 🎯 Usage Examples

### Basic Property Search
- "I want a villa for sale in Juffair"
- "Show me apartments for rent in Amwaj"
- "Properties under 100k in Seef"
- "Looking for 3-bedroom house in Muharraq"

### AI-Enhanced Queries
- "I need a family home near good schools"
- "Investment property with high rental yield"
- "Luxury apartment with sea view"
- "شقة في المنامة للإيجار" (Arabic: Apartment in Manama for rent)

### Market Insights
- "What's the market like in Bahrain?"
- "Best areas for investment"
- "Average prices in Juffair"
- "Rental yields in Amwaj Islands"

### 🔄 Testing Conversation Redirection
Try these off-topic queries to see the intelligent redirection in action:
- "What's the weather like?" → Redirected to Bahrain property benefits
- "Where can I find good food?" → Redirected to lifestyle benefits in Juffair
- "How's the traffic today?" → Redirected to strategic location advantages
- "What sports are popular here?" → Redirected to family-friendly communities
- "Tell me about local culture" → Redirected to heritage areas like Muharraq

**What happens:** The AI acknowledges your question, then smoothly transitions to highlight Bahrain's real estate benefits and specific locations that match the context of your original question.

## 💡 Key Components

### Backend (`/backend/index.js`)
- Express.js API with 9 workflow endpoints
- Carlton API integration for real property data
- Session management and latency tracking
- Invoice and contract generation
- **AI Integration**: Real estate query analysis and property matching

### AI Service (`/backend/realEstateAI.js`)
- **Natural Language Processing**: Smart query understanding
- **Property Matching Algorithm**: AI-powered relevance scoring
- **Market Analysis**: Intelligent insights generation
- **Bilingual Support**: English and Arabic language processing
- **Location Intelligence**: Bahraini geography and area expertise

### Frontend (`/frontend/index.html`)
- React-based interactive UI
- Real-time performance monitoring
- Step-by-step progress tracking
- Responsive property card design
- **AI Features UI**: Smart recommendations and insights display

## 🔧 Technology Stack

- **Backend**: Node.js, Express.js, Axios
- **AI/ML**: Hugging Face Inference API, Custom NLP algorithms
- **Frontend**: React, HTML5, CSS3
- **API**: Carlton Real Estate API integration
- **Performance**: Real-time latency tracking
- **UI**: Modern responsive design with animations
- **Languages**: Bilingual support (English/Arabic)

## 📱 Production Deployment Options

- Website Plugin (embed on Carlton's homepage)
- WhatsApp Business Bot (via Twilio)
- Kiosk Mode (for real estate offices)
- Mobile App Integration

## 🏗️ Architecture

```
Frontend (Port 3000)           Backend (Port 8000)           Carlton API
┌─────────────────┐           ┌─────────────────┐           ┌─────────────┐
│ React UI        │◄─────────►│ 9-Step Workflow │◄─────────►│ Property DB │
│ - Progress Bar  │           │ - Latency Track │           │ - Real Data │
│ - Property Cards│           │ - Session Mgmt  │           │ - Agent Info│
│ - Invoice Display│          │ - Payment Flow  │           └─────────────┘
└─────────────────┘           └─────────────────┘
```

## 📈 Performance Targets

All workflow steps meet or exceed target latency requirements:
- ✅ Greeting: ~500ms
- ✅ Property Scan: ~1s  
- ✅ Shortlisting: ~400ms
- ✅ Client Details: ~600ms
- ✅ Invoice Creation: ~1.5s
- ✅ IBAN Sharing: ~300ms
- ✅ Contract Generation: ~1.8s
- ✅ Follow-Up: ~500ms

## 🔐 Security Features

- Secure session management
- Encrypted payment details
- Activity logging
- Document upload support

---

**Carlton Real Estate Bahrain** - Professional Property Transaction Assistant
