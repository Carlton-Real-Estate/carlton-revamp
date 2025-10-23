# Bahrain Areas Mapping Guide

This document helps you map Google Maps area names with your database records.

## How to Use This Guide

1. Search for each area in Google Maps
2. Note the exact spelling and formatting Google Maps uses
3. Match it with your database area name
4. Update the mapping in `public/js/area-mapping.js`

## Bahrain Areas - Organized by Region

### Capital Governorate (Manama)

#### Central Manama
- [ ] Manama City Center
- [ ] Diplomatic Area
- [ ] Financial Harbor
- [ ] Bahrain Bay
- [ ] Seef District
- [ ] Sanabis
- [ ] Juffair
- [ ] Adliya
- [ ] Hoora
- [ ] Gudaibiya (Qudaibiya)
- [ ] Zinj
- [ ] Salmaniya
- [ ] Naim (Naeem)

#### Eastern Manama
- [ ] Mahooz
- [ ] Reef Island
- [ ] Amwaj Islands

#### Western Manama
- [ ] Umm Al Hassam
- [ ] Sehla

### Muharraq Governorate

#### Muharraq City
- [ ] Muharraq (City Center)
- [ ] Busaiteen
- [ ] Arad
- [ ] Hidd
- [ ] Galali (Qalali)
- [ ] Samaheej

#### Islands & Developments
- [ ] Diyar Al Muharraq
- [ ] Dilmunia Island

### Northern Governorate

#### Coastal Areas
- [ ] Budaiya
- [ ] Saar
- [ ] Janabiya
- [ ] Barbar
- [ ] Diraz
- [ ] Bani Jamra
- [ ] Malkiya
- [ ] Hamala (Hamalah)

#### Inland Areas
- [ ] Karranah
- [ ] Duraz
- [ ] Shakhoora
- [ ] Abu Saiba'a (Abu Saibaa)

### Southern Governorate

#### Riffa
- [ ] Riffa (City Center)
- [ ] East Riffa
- [ ] West Riffa
- [ ] Riffa Views

#### Eastern Areas
- [ ] Zallaq
- [ ] Awali
- [ ] Al Areen
- [ ] Durrat Al Bahrain
- [ ] Sakhir

### Central Governorate

#### Isa Town Region
- [ ] Isa Town
- [ ] Jidhafs
- [ ] Maqaba (Maqabah)

#### Other Central Areas
- [ ] Salmabad
- [ ] Karbabad
- [ ] Bilad Al Qadeem
- [ ] Daih (Al Daih)
- [ ] Sanabis
- [ ] Karzakan
- [ ] Buri

### Industrial & Special Areas

#### Industrial
- [ ] Mina Salman
- [ ] Sitra Industrial Area
- [ ] Askar
- [ ] North Sitra

#### Special Developments
- [ ] Bahrain International Circuit (Sakhir)
- [ ] Bahrain Financial Harbour
- [ ] Bahrain International Investment Park

### Villages & Rural Areas

#### Northern Villages
- [ ] Sadad
- [ ] Al Markh
- [ ] Ras Ruman
- [ ] Al Jasra (Al Jasrah)
- [ ] Wadiyan

#### Central Villages
- [ ] A'ali (Aali)
- [ ] Sanad
- [ ] Hillat Abdulsaleh
- [ ] Dar Kulaib
- [ ] Jaw
- [ ] Maamer (Maameer)
- [ ] Nuwaidrat
- [ ] Eker

#### Southern Villages
- [ ] Al Qadam
- [ ] Shahrakkan
- [ ] Jannusan
- [ ] Al Hajar

### Tourist & Landmark Areas

- [ ] Tree of Life (Shajarat Al Hayat)
- [ ] Bahrain Fort (Qal'at al-Bahrain)
- [ ] Adhari Park Area
- [ ] Al Fateh Corniche
- [ ] Tubli Bay

## Mapping Template

For each area in your database, fill in this information:

```javascript
{
  "database_name": "juffair",           // Your DB area name
  "google_maps_name": "Juffair",        // Exact Google Maps spelling
  "alternative_names": [                // Other names people might use
    "Al Juffair",
    "Jufair"
  ],
  "coordinates": {
    "lat": 26.2172,                     // Center latitude
    "lng": 50.6064                      // Center longitude
  },
  "governorate": "Capital",             // Which governorate
  "type": "district"                    // district/village/island/development
}
```

## Testing Checklist

After mapping, test each area:

1. [ ] Search for area in your search box
2. [ ] Verify map centers on correct location
3. [ ] Check properties in that area display
4. [ ] Test alternative spellings
5. [ ] Verify mobile experience

## Common Spelling Variations

| Your DB | Google Maps | Alternatives |
|---------|-------------|--------------|
| mahooz | Mahooz | Al Mahooz, Ma'hooz |
| qudaibiya | Gudaibiya | Qudaibiya, Al Gudaibiya |
| segaiya | Segaya | Siqaya, Al Segaya |
| burhama | Burhamah | Al Burhamah |

## Notes

- Google Maps may use English or Arabic transliterations
- Some areas have multiple accepted spellings
- Check both with "Al" prefix and without
- Verify coordinates by searching in Google Maps and copying lat/lng from URL

## Data Collection Steps

1. Open Google Maps in browser
2. Search for area name
3. Click on the map pin
4. Copy coordinates from URL (format: @26.2172,50.6064)
5. Note the exact name shown in Google Maps
6. Record any alternative names shown
7. Add to mapping file
