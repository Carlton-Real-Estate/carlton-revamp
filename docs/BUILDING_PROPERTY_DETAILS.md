# Building Property Details - Dynamic Display

## Overview
The property details modal now dynamically displays different fields based on the property type. When the property type is "Building", it shows building-specific information instead of standard residential fields.

## Implementation Date
October 20, 2025

---

## Feature Description

### Standard Properties (Apartments, Villas, etc.)
Display traditional residential property information:
- ID
- Property For (Sale/Rent)
- Size S.Q.F
- Size S.Q.M
- No. of Floors
- No. Rooms (Bedrooms)
- No. Baths
- No. of Kitchens
- No. of Halls
- Status (Furnished/Unfurnished)

### Building Properties
Display investment-focused building information:
- ID
- Property For (Sale/Rent)
- Size S.Q.F
- Size S.Q.M
- **Monthly Income** (in BHD)
- **Annual Income** (in BHD)
- **No. of Roads**
- **No. of Flats** (Units)
- **No. of Elevators**
- **Status** (Renovated/As-is/etc.)

---

## Code Implementation

### Location
**File**: `/public/js/property-details.js`
**Method**: `populatePropertyDetails(property)`
**Lines**: ~363-460

### Detection Logic
```javascript
const isBuilding = property.type_name === 'Building' || 
                   property.type === 'Building' || 
                   property.type_name === 'building' || 
                   property.type === 'building';
```

### Dynamic HTML Generation
The method now uses `innerHTML` to completely replace the details grid content based on property type, ensuring the correct fields are displayed.

---

## Building-Specific Fields

### 1. Monthly Income
- **Field**: `monthly_income`
- **Display**: "4,785 BHD"
- **Format**: Number with thousands separator + " BHD"
- **Fallback**: "----" if not available

### 2. Annual Income
- **Field**: `annual_income`
- **Display**: "57,420 BHD"
- **Format**: Number with thousands separator + " BHD"
- **Auto-Calculate**: If `annual_income` not provided, calculates as `monthly_income * 12`
- **Fallback**: "----" if neither available

### 3. No. of Roads
- **Field**: `roads` or `no_of_roads`
- **Display**: "1"
- **Description**: Number of street-facing sides
- **Fallback**: "----"

### 4. No. of Flats
- **Field**: `flats` or `no_of_flats` or `units`
- **Display**: "26"
- **Description**: Total rental units in building
- **Fallback**: "----"

### 5. No. of Elevators
- **Field**: `elevators` or `no_of_elevators`
- **Display**: "1"
- **Description**: Number of elevators in building
- **Fallback**: "----"

### 6. Status
- **Field**: `status` or `condition`
- **Display**: "Renovated", "As-is", "New", etc.
- **Description**: Building condition
- **Fallback**: "N/A"

---

## Data Structure

### Building Property Object Example
```javascript
{
    id: 4586,
    title: "Investment Building in Juffair",
    type: "Building",
    type_name: "Building",
    for: 1, // 1 = Sale, 2 = Rent
    for_name: "Sale",
    price: 450000,
    size: 369, // in sqm
    area: 369,
    location: "Juffair",
    
    // Building-specific fields
    monthly_income: 4785,
    annual_income: 57420,
    roads: 1,
    no_of_roads: 1,
    flats: 26,
    no_of_flats: 26,
    units: 26,
    elevators: 1,
    no_of_elevators: 1,
    status: "Renovated",
    condition: "Renovated",
    
    // Standard fields
    description: "Prime investment building...",
    image_url: "https://...",
    reference_number: "BJ4586"
}
```

---

## Visual Layout

### Building Details Grid (3 columns, 4 rows)

```
┌─────────────┬─────────────┬─────────────┐
│    4586     │    Sale     │  3,971.9    │
│     ID      │Property For │ Size S.Q.F  │
├─────────────┼─────────────┼─────────────┤
│     369     │  4,785 BHD  │ 57,420 BHD  │
│ Size S.Q.M  │Monthly Inc. │ Annual Inc. │
├─────────────┼─────────────┼─────────────┤
│      1      │     26      │      1      │
│No. of Roads │ No. of Flats│No. Elevators│
├─────────────┼─────────────┼─────────────┤
│ Renovated   │             │             │
│   Status    │             │             │
└─────────────┴─────────────┴─────────────┘
```

### Standard Property Grid (3 columns, 4 rows)

```
┌─────────────┬─────────────┬─────────────┐
│      1      │    Sale     │  1,291.7    │
│     ID      │Property For │ Size S.Q.F  │
├─────────────┼─────────────┼─────────────┤
│     120     │    ----     │      2      │
│ Size S.Q.M  │No. of Floors│  No. Rooms  │
├─────────────┼─────────────┼─────────────┤
│      2      │      1      │    ----     │
│  No. Baths  │No. Kitchens │ No. of Halls│
├─────────────┼─────────────┼─────────────┤
│Unfurnished  │             │             │
│   Status    │             │             │
└─────────────┴─────────────┴─────────────┘
```

---

## CSS Styling

The styling remains unchanged - both layouts use the same CSS classes:
- `.property-details-card` - Container with white background and shadow
- `.details-grid` - 3-column grid layout
- `.detail-item` - Individual field container
- `.detail-value` - Large number/text (font-size: 2rem)
- `.detail-label` - Small label text (font-size: 0.875rem, uppercase, gray)

---

## Backend Integration

### Required API Response Fields for Buildings

When the Carlton API returns a building property, ensure these fields are included:

```json
{
  "id": 4586,
  "type_name": "Building",
  "monthly_income": 4785,
  "annual_income": 57420,
  "roads": 1,
  "flats": 26,
  "elevators": 1,
  "status": "Renovated"
}
```

### Optional Auto-Calculation

If `annual_income` is not provided by the API, the system will automatically calculate it as:
```javascript
annual_income = monthly_income * 12
```

---

## Property Type Detection

### Supported Variations
The system detects building properties using case-insensitive matching:
- `type_name: "Building"`
- `type_name: "building"`
- `type: "Building"`
- `type: "building"`

### Adding More Property Types

To add custom layouts for other property types (e.g., Land, Factory), extend the `populatePropertyDetails` method:

```javascript
populatePropertyDetails(property) {
    const isBuilding = property.type_name === 'Building' || ...;
    const isLand = property.type_name === 'Land' || ...;
    const isFactory = property.type_name === 'Factory' || ...;
    
    if (isBuilding) {
        // Building layout
    } else if (isLand) {
        // Land layout (area, zoning, etc.)
    } else if (isFactory) {
        // Factory layout (machinery, power, etc.)
    } else {
        // Standard residential layout
    }
}
```

---

## Testing

### Test Cases

#### Test 1: Building Property Display
1. Open a building property details
2. Verify display shows:
   - Monthly Income (e.g., "4,785 BHD")
   - Annual Income (e.g., "57,420 BHD")
   - No. of Roads (e.g., "1")
   - No. of Flats (e.g., "26")
   - No. of Elevators (e.g., "1")
   - Status (e.g., "Renovated")

#### Test 2: Standard Property Display
1. Open apartment/villa property details
2. Verify display shows:
   - No. of Floors
   - No. Rooms (Bedrooms)
   - No. Baths
   - No. of Kitchens
   - No. of Halls
   - Status (Furnished/Unfurnished)

#### Test 3: Missing Building Data
1. Open building with missing optional fields
2. Verify "----" displays for missing fields
3. Verify annual income auto-calculates if only monthly income provided

#### Test 4: Case Insensitivity
1. Test with `type_name: "building"` (lowercase)
2. Test with `type: "Building"` (uppercase)
3. Verify both trigger building layout

---

## Browser Compatibility
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (macOS & iOS)
- ✅ Firefox (Desktop & Mobile)
- ✅ Samsung Internet

---

## Mobile Responsiveness

The grid layout automatically adapts to mobile screens:
- **Desktop**: 3 columns
- **Tablet**: 2 columns
- **Mobile Portrait**: 2 columns
- **Mobile Landscape**: 3 columns

This is handled by existing CSS media queries in `property-details.css`.

---

## Known Limitations

1. **API Dependency**: Building-specific fields must be provided by the backend API
2. **No Visual Indicator**: No icon or badge distinguishes building from other properties in the modal header
3. **Fixed Grid**: Always shows 10 fields (some may be empty with "----")

---

## Future Enhancements

### Potential Improvements
1. **Investment Calculator**: Add ROI calculator for buildings
2. **Tenant Information**: Show vacancy rate, tenant types
3. **Maintenance Costs**: Display annual maintenance expenses
4. **Age of Building**: Show construction year and age
5. **Land Registry**: Display plot number, coordinates
6. **Building Badge**: Add visual indicator for building type
7. **Income History**: Graph of historical rental income
8. **Occupancy Rate**: Visual percentage indicator
9. **Custom Icons**: Icons for each building-specific field
10. **Expandable Sections**: Collapsible groups for better organization

### Other Property Types
Consider custom layouts for:
- **Land**: Zoning, soil type, utilities, access roads
- **Factory**: Machinery, power capacity, loading docks
- **Office**: Floor plates, parking ratio, HVAC
- **Retail**: Frontage, foot traffic, signage
- **Farm**: Irrigation, crops, water sources

---

## Maintenance Notes

### When Adding New Building Fields
1. Add field to building property object in backend
2. Update `populatePropertyDetails()` HTML template
3. Update this documentation
4. Add to test cases
5. Update API documentation

### When Modifying Grid Layout
If you need to change the number of columns or items:
1. Update HTML template in `populatePropertyDetails()`
2. Update CSS in `property-details.css` (`.details-grid`)
3. Test on all screen sizes
4. Update visual layout diagram in this document

---

## Support

For questions or issues related to building property details display, contact the development team.

**Last Updated**: October 20, 2025
