# Carlton Bahrain Map Styles

This directory contains Google Maps styling configurations for the Carlton Real Estate property map.

## Files

### 1. `bahrain-map-style.json`
**Complete configuration** including map settings (zoom, bounds, restrictions) and visual styles.
- Use this for reference and documentation
- Contains all settings from your JavaScript implementation

### 2. `google-cloud-style.json`
**Google Cloud Console compatible** - Upload this to Google Cloud Platform
- Visual styles only (for Cloud Console Map Styles)
- Upload at: https://console.cloud.google.com/google/maps-apis/studio/maps

## Map Configuration Summary

### Bahrain Boundaries
- **North**: 26.3250° (Northern tip)
- **South**: 25.7900° (Southern tip near Zallaq)
- **West**: 50.3500° (Western coast)
- **East**: 50.7500° (Eastern coast including Amwaj)

### Zoom Settings
- **Initial Zoom**: 10.5 (Shows full Bahrain)
- **Min Zoom**: 9.5 (Allows full view of entire Bahrain country)
- **Max Zoom**: 15 (Area level - privacy protection)

### Map Center
- **Latitude**: 26.0667
- **Longitude**: 50.5577
- (Geographic center of Bahrain)

### Restrictions
- **Strict Bounds**: Enabled
- Users cannot pan outside Bahrain boundaries

## Style Features

### Points of Interest (POI)
- **Hospitals**: Red pins (#ff2600) - highly visible
- **Schools**: Silver pins (#c0c0c0) - visible
- **Shopping**: Visible
- **Restaurants**: Hidden
- **Places of Worship**: Hidden
- **Cemeteries**: Hidden
- **Theme Parks**: Hidden

### Infrastructure
- **Visible**: Roads and infrastructure shown
- **Business Corridors**: Hidden

### Political Boundaries
- **Visible**: Political areas shown
- **Fill Color**: #929292 (gray)
- **Country/Region Labels**: Hidden

## How to Upload to Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to: **APIs & Services** → **Google Maps Platform** → **Map Styles**
3. Click **Create Map Style**
4. Choose **Import JSON**
5. Upload `google-cloud-style.json`
6. Save and get your **Map Style ID**
7. Update your code to use the new Map Style ID

## Current Map Style ID

Your current map style ID in the code:
```
14297571e8d2209a625ab170
```

## Integration with JavaScript

The map settings (zoom, bounds, restrictions) are applied in your JavaScript code at:
```
/public/js/property-map-google.js
```

In the `initMap()` function around line 380.

## Features Summary

✅ Bahrain-only map view (strict boundaries)
✅ Privacy protection (max zoom 15 - area level only)
✅ Custom POI colors (hospitals red, schools silver)
✅ Hidden irrelevant POIs (restaurants, worship places)
✅ Optimal zoom levels for full country view
✅ Gray political boundaries
✅ Light background (#d6d6d6)

## Notes

- The map style focuses on real estate relevant information
- Hospitals and schools are prominently displayed (important for property buyers)
- Max zoom of 15 prevents street-level viewing (privacy protection)
- Strict bounds keep map focused on Bahrain only
