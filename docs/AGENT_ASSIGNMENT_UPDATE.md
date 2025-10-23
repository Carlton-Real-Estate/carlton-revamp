# Agent Assignment & Reference Number Update

## Summary
Added agent information cards to property details modal and moved reference number from photo overlay to property info card.

## Changes Made

### 1. HTML Structure (`property-details.html`)
- **Removed**: Reference number from hero image overlay
- **Added**: Reference number in third `info-row` within `property-info-card`
- **Added**: Agent card below property-info-card with:
  - Agent photo (circular)
  - Agent name
  - Agent title (Property Consultant)
  - Agent contact (phone with WhatsApp link)

### 2. CSS Styling (`css/property-details.css`)
Added new `.agent-card` styles:
- White background with rounded corners
- Flexbox layout with photo on left, info on right
- 60px circular agent photo
- Hover effects on contact link
- Responsive design included

### 3. JavaScript Logic (`js/property-details.js`)
**Agent Assignment**:
- Each property is randomly assigned an agent using: `property.id % this.staffMembers.length`
- Ensures consistent agent assignment per property ID

**Reference Number Generation**:
- Format: `AJ` + 5-digit zero-padded ID (e.g., `AJ00001`, `AJ00002`)
- Formula: `AJ${String(property.id).padStart(5, '0')}`

**Agent Data Population**:
- Agent photo background image
- Agent name
- Agent phone number
- WhatsApp contact link with pre-filled message

**Existing Staff Members**:
1. Abdulla Hasan - +97332319900
2. Ahmed Al-A'ali - +97336943000
3. Hanaa Adel - +97336504411
4. Mirna Kamal - +97336960222

### 4. Modal Structure Updates
Updated both:
- Static HTML template (`property-details.html`)
- Dynamic modal creation in JavaScript

## Features
✅ Reference number displays in property info card (not on photo)
✅ Each property assigned to specific agent consistently
✅ Agent photo, name, and contact displayed
✅ WhatsApp integration with pre-filled message
✅ Responsive design for mobile devices
✅ Professional styling matching Carlton branding

## Testing
1. Open any property details
2. Reference number should appear below location in dark info card
3. Agent card should appear below info card with photo and contact
4. Click agent phone to open WhatsApp with pre-filled message
5. Each property ID maps to same agent consistently

## Property-Agent Mapping
- Property ID 1, 5, 9, 13... → Abdulla Hasan
- Property ID 2, 6, 10, 14... → Ahmed Al-A'ali
- Property ID 3, 7, 11, 15... → Hanaa Adel
- Property ID 4, 8, 12, 16... → Mirna Kamal
