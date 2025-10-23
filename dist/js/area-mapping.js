/**
 * Bahrain Area Mapping Configuration
 * Maps database area names to Google Maps names with coordinates
 * 
 * Usage:
 * 1. Fill in coordinates by searching each area in Google Maps
 * 2. Copy lat/lng from URL when you click the area
 * 3. Update google_maps_name to match exactly what Google Maps shows
 * 4. Add any alternative spellings people might search for
 */

const BAHRAIN_AREA_MAPPING = {
    // Capital Governorate - Manama
    "manama": {
        google_maps_name: "Manama",
        alternative_names: ["Al Manama", "Manamah"],
        coordinates: { lat: 26.2235, lng: 50.5876 },
        governorate: "Capital",
        zoom: 13
    },
    
    "juffair": {
        google_maps_name: "Juffair",
        alternative_names: ["Al Juffair", "Jufair"],
        coordinates: { lat: 26.2172, lng: 50.6064 },
        governorate: "Capital",
        zoom: 14
    },
    
    "seef": {
        google_maps_name: "Seef",
        alternative_names: ["Al Seef", "Seef District"],
        coordinates: { lat: 26.2361, lng: 50.5333 },
        governorate: "Capital",
        zoom: 14
    },
    
    "adliya": {
        google_maps_name: "Adliya",
        alternative_names: ["Al Adliya", "Adliyah"],
        coordinates: { lat: 26.2169, lng: 50.5786 },
        governorate: "Capital",
        zoom: 15
    },
    
    "hoora": {
        google_maps_name: "Hoora",
        alternative_names: ["Al Hoora", "Hura"],
        coordinates: { lat: 26.2228, lng: 50.5717 },
        governorate: "Capital",
        zoom: 15
    },
    
    "sanabis": {
        google_maps_name: "Sanabis",
        alternative_names: ["Al Sanabis"],
        coordinates: { lat: 26.2289, lng: 50.5611 },
        governorate: "Capital",
        zoom: 15
    },
    
    "salmaniya": {
        google_maps_name: "Salmaniya",
        alternative_names: ["Al Salmaniya", "Salmaniyah"],
        coordinates: { lat: 26.2067, lng: 50.5778 },
        governorate: "Capital",
        zoom: 15
    },
    
    "mahooz": {
        google_maps_name: "Mahooz",
        alternative_names: ["Al Mahooz", "Ma'hooz"],
        coordinates: { lat: 26.2289, lng: 50.6000 },
        governorate: "Capital",
        zoom: 15
    },
    
    "zinj": {
        google_maps_name: "Zinj",
        alternative_names: ["Al Zinj"],
        coordinates: { lat: 26.2017, lng: 50.5633 },
        governorate: "Capital",
        zoom: 15
    },
    
    "qudaibiya": {
        google_maps_name: "Gudaibiya",
        alternative_names: ["Qudaibiya", "Al Gudaibiya", "Al Qudaibiya"],
        coordinates: { lat: 26.2128, lng: 50.5678 },
        governorate: "Capital",
        zoom: 15
    },
    
    "diplomatic-area": {
        google_maps_name: "Diplomatic Area",
        alternative_names: ["Diplomatic District", "Manama Diplomatic Area", "Diplomatic"],
        coordinates: { lat: 26.2306, lng: 50.5889 },
        governorate: "Capital",
        zoom: 15
    },
    
    "umm-al-hassam": {
        google_maps_name: "Umm Al Hassam",
        alternative_names: ["Um Al Hassam", "Umm Alhassam"],
        coordinates: { lat: 26.1950, lng: 50.5467 },
        governorate: "Capital",
        zoom: 15
    },
    
    "naeem": {
        google_maps_name: "Naim",
        alternative_names: ["Naeem", "Al Naim", "Al Naeem"],
        coordinates: { lat: 26.1992, lng: 50.5889 },
        governorate: "Capital",
        zoom: 15
    },
    
    "exhibition-road": {
        google_maps_name: "Exhibition Road",
        alternative_names: ["Exhibition Avenue", "Exhibition Ave"],
        coordinates: { lat: 26.2078, lng: 50.5944 },
        governorate: "Capital",
        zoom: 15
    },
    
    "sehla": {
        google_maps_name: "Sehla",
        alternative_names: ["Al Sehla"],
        coordinates: { lat: 26.1956, lng: 50.5556 },
        governorate: "Capital",
        zoom: 15
    },
    
    // Muharraq Governorate
    "muharraq": {
        google_maps_name: "Muharraq",
        alternative_names: ["Al Muharraq", "Muharaq"],
        coordinates: { lat: 26.2575, lng: 50.6119 },
        governorate: "Muharraq",
        zoom: 13
    },
    
    "busaiteen": {
        google_maps_name: "Busaiteen",
        alternative_names: ["Bu Saiteen", "Al Busaiteen"],
        coordinates: { lat: 26.2458, lng: 50.5906 },
        governorate: "Muharraq",
        zoom: 15
    },
    
    "arad": {
        google_maps_name: "Arad",
        alternative_names: ["Al Arad"],
        coordinates: { lat: 26.2461, lng: 50.6344 },
        governorate: "Muharraq",
        zoom: 15
    },
    
    "hidd": {
        google_maps_name: "Hidd",
        alternative_names: ["Al Hidd"],
        coordinates: { lat: 26.2731, lng: 50.6506 },
        governorate: "Muharraq",
        zoom: 14
    },
    
    "qalali": {
        google_maps_name: "Galali",
        alternative_names: ["Qalali", "Al Galali", "Al Qalali"],
        coordinates: { lat: 26.2672, lng: 50.6278 },
        governorate: "Muharraq",
        zoom: 15
    },
    
    "amwaj": {
        google_maps_name: "Amwaj Islands",
        alternative_names: ["Amwaj", "Amwaj Island"],
        coordinates: { lat: 26.2894, lng: 50.6606 },
        governorate: "Muharraq",
        zoom: 14
    },
    
    "diyar-al-muharraq": {
        google_maps_name: "Diyar Al Muharraq",
        alternative_names: ["Diyar Muharraq", "Diyar", "Diyar Al-Muharraq"],
        coordinates: { lat: 26.2700, lng: 50.6700 },
        governorate: "Muharraq",
        zoom: 14
    },
    
    "samaheej": {
        google_maps_name: "Samaheej",
        alternative_names: ["Al Samaheej"],
        coordinates: { lat: 26.2833, lng: 50.6444 },
        governorate: "Muharraq",
        zoom: 15
    },
    
    "shahrakkan": {
        google_maps_name: "Shahrakkan",
        alternative_names: ["Al Shahrakkan"],
        coordinates: { lat: 26.2617, lng: 50.6731 },
        governorate: "Muharraq",
        zoom: 15
    },
    
    // Northern Governorate
    "budaiya": {
        google_maps_name: "Budaiya",
        alternative_names: ["Al Budaiya", "Budaya"],
        coordinates: { lat: 26.1444, lng: 50.4500 },
        governorate: "Northern",
        zoom: 14
    },
    
    "saar": {
        google_maps_name: "Saar",
        alternative_names: ["Al Saar"],
        coordinates: { lat: 26.1867, lng: 50.4850 },
        governorate: "Northern",
        zoom: 15
    },
    
    "janabiya": {
        google_maps_name: "Janabiya",
        alternative_names: ["Al Janabiya", "Janabiyah"],
        coordinates: { lat: 26.1650, lng: 50.4817 },
        governorate: "Northern",
        zoom: 15
    },
    
    "barbar": {
        google_maps_name: "Barbar",
        alternative_names: ["Al Barbar"],
        coordinates: { lat: 26.1917, lng: 50.4989 },
        governorate: "Northern",
        zoom: 15
    },
    
    "diraz": {
        google_maps_name: "Diraz",
        alternative_names: ["Al Diraz"],
        coordinates: { lat: 26.2197, lng: 50.5064 },
        governorate: "Northern",
        zoom: 15
    },
    
    "bani-jamra": {
        google_maps_name: "Bani Jamra",
        alternative_names: ["Bani Jamrah"],
        coordinates: { lat: 26.2056, lng: 50.4919 },
        governorate: "Northern",
        zoom: 15
    },
    
    "malkiya": {
        google_maps_name: "Malkiya",
        alternative_names: ["Al Malkiya", "Malkiyah"],
        coordinates: { lat: 26.2244, lng: 50.5239 },
        governorate: "Northern",
        zoom: 15
    },
    
    "hamalah": {
        google_maps_name: "Hamala",
        alternative_names: ["Hamalah", "Al Hamala", "Al Hamalah"],
        coordinates: { lat: 26.1708, lng: 50.4922 },
        governorate: "Northern",
        zoom: 15
    },
    
    "al-buhair": {
        google_maps_name: "Al Buhair",
        alternative_names: ["Buhair"],
        coordinates: { lat: 26.1481, lng: 50.4569 },
        governorate: "Northern",
        zoom: 15
    },
    
    // Southern Governorate
    "riffa": {
        google_maps_name: "Riffa",
        alternative_names: ["Al Riffa", "Ar Riffa"],
        coordinates: { lat: 26.1300, lng: 50.5550 },
        governorate: "Southern",
        zoom: 13
    },
    
    "east-riffa": {
        google_maps_name: "East Riffa",
        alternative_names: ["Eastern Riffa", "Riffa East"],
        coordinates: { lat: 26.1417, lng: 50.5733 },
        governorate: "Southern",
        zoom: 14
    },
    
    "west-riffa": {
        google_maps_name: "West Riffa",
        alternative_names: ["Western Riffa", "Riffa West"],
        coordinates: { lat: 26.1192, lng: 50.5442 },
        governorate: "Southern",
        zoom: 14
    },
    
    "riffa-views": {
        google_maps_name: "Riffa Views",
        alternative_names: ["Riffa View"],
        coordinates: { lat: 26.1150, lng: 50.5583 },
        governorate: "Southern",
        zoom: 15
    },
    
    "zallaq": {
        google_maps_name: "Zallaq",
        alternative_names: ["Al Zallaq"],
        coordinates: { lat: 26.0508, lng: 50.4594 },
        governorate: "Southern",
        zoom: 14
    },
    
    "durrat-al-bahrain": {
        google_maps_name: "Durrat Al Bahrain",
        alternative_names: ["Durrat Bahrain", "Durrat"],
        coordinates: { lat: 25.8483, lng: 50.5394 },
        governorate: "Southern",
        zoom: 13
    },
    
    "al-areen": {
        google_maps_name: "Al Areen",
        alternative_names: ["Areen", "Al Aren"],
        coordinates: { lat: 26.0367, lng: 50.4867 },
        governorate: "Southern",
        zoom: 14
    },
    
    "shakhoora": {
        google_maps_name: "Shakhoora",
        alternative_names: ["Al Shakhoora", "Shakhurah"],
        coordinates: { lat: 26.0833, lng: 50.5167 },
        governorate: "Southern",
        zoom: 15
    },
    
    "jaw": {
        google_maps_name: "Jaw",
        alternative_names: ["Al Jaw"],
        coordinates: { lat: 26.0167, lng: 50.6000 },
        governorate: "Southern",
        zoom: 14
    },
    
    "al-guful": {
        google_maps_name: "Al Guful",
        alternative_names: ["Guful"],
        coordinates: { lat: 25.9833, lng: 50.5667 },
        governorate: "Southern",
        zoom: 15
    },
    
    // Central Governorate
    "isa-town": {
        google_maps_name: "Isa Town",
        alternative_names: ["Isa", "Town Isa", "Madina Isa"],
        coordinates: { lat: 26.1736, lng: 50.5478 },
        governorate: "Central",
        zoom: 14
    },
    
    "hamad-town": {
        google_maps_name: "Hamad Town",
        alternative_names: ["Hamad", "Madina Hamad"],
        coordinates: { lat: 26.1153, lng: 50.5092 },
        governorate: "Central",
        zoom: 13
    },
    
    "jidhafs": {
        google_maps_name: "Jidhafs",
        alternative_names: ["Jid Hafs", "Al Jidhafs"],
        coordinates: { lat: 26.2047, lng: 50.5472 },
        governorate: "Central",
        zoom: 15
    },
    
    "bilad-al-qadeem": {
        google_maps_name: "Bilad Al Qadeem",
        alternative_names: ["Bilad Al Qadim", "Bilad Qadeem"],
        coordinates: { lat: 26.1864, lng: 50.5511 },
        governorate: "Central",
        zoom: 15
    },
    
    "salmabad": {
        google_maps_name: "Salmabad",
        alternative_names: ["Al Salmabad"],
        coordinates: { lat: 26.1669, lng: 50.5806 },
        governorate: "Central",
        zoom: 15
    },
    
    "aali": {
        google_maps_name: "A'ali",
        alternative_names: ["Aali", "Al Aali"],
        coordinates: { lat: 26.1589, lng: 50.5217 },
        governorate: "Central",
        zoom: 15
    },
    
    "sanad": {
        google_maps_name: "Sanad",
        alternative_names: ["Al Sanad"],
        coordinates: { lat: 26.1467, lng: 50.5983 },
        governorate: "Central",
        zoom: 15
    },
    
    "eker": {
        google_maps_name: "Eker",
        alternative_names: ["Al Eker", "Akr"],
        coordinates: { lat: 26.0953, lng: 50.5117 },
        governorate: "Central",
        zoom: 15
    },
    
    "maameer": {
        google_maps_name: "Ma'ameer",
        alternative_names: ["Maameer", "Al Maameer"],
        coordinates: { lat: 26.1578, lng: 50.6506 },
        governorate: "Central",
        zoom: 15
    },
    
    "nuwaidrat": {
        google_maps_name: "Nuwaidrat",
        alternative_names: ["Al Nuwaidrat", "Nuwaidrat"],
        coordinates: { lat: 26.2239, lng: 50.5994 },
        governorate: "Central",
        zoom: 15
    },
    
    "sitra": {
        google_maps_name: "Sitra",
        alternative_names: ["Al Sitra", "Sitrah"],
        coordinates: { lat: 26.1522, lng: 50.6253 },
        governorate: "Central",
        zoom: 14
    },
    
    "tubli": {
        google_maps_name: "Tubli",
        alternative_names: ["Al Tubli"],
        coordinates: { lat: 26.2000, lng: 50.6167 },
        governorate: "Central",
        zoom: 15
    },
    
    "jurdab": {
        google_maps_name: "Jurdab",
        alternative_names: ["Al Jurdab"],
        coordinates: { lat: 26.1583, lng: 50.5458 },
        governorate: "Central",
        zoom: 15
    },
    
    "karzakan": {
        google_maps_name: "Karzakan",
        alternative_names: ["Al Karzakan"],
        coordinates: { lat: 26.0858, lng: 50.4989 },
        governorate: "Central",
        zoom: 15
    },
    
    "adhari": {
        google_maps_name: "Adhari",
        alternative_names: ["Al Adhari"],
        coordinates: { lat: 26.1489, lng: 50.5522 },
        governorate: "Central",
        zoom: 15
    },
    
    "buquwa": {
        google_maps_name: "Buquwa",
        alternative_names: ["Al Buquwa", "Boqua"],
        coordinates: { lat: 26.1803, lng: 50.5011 },
        governorate: "Central",
        zoom: 15
    },
    
    "jeblat-hebshi": {
        google_maps_name: "Jeblat Hebshi",
        alternative_names: ["Jiblat Habshi", "Jeblet Habshi"],
        coordinates: { lat: 26.1833, lng: 50.5000 },
        governorate: "Central",
        zoom: 15
    },
    
    "buri": {
        google_maps_name: "Buri",
        alternative_names: ["Al Buri"],
        coordinates: { lat: 26.1906, lng: 50.5136 },
        governorate: "Central",
        zoom: 15
    },
    
    "damistan": {
        google_maps_name: "Damistan",
        alternative_names: ["Al Damistan"],
        coordinates: { lat: 26.2244, lng: 50.5506 },
        governorate: "Central",
        zoom: 15
    },
    
    "ras-zuwaid": {
        google_maps_name: "Ras Zuwaid",
        alternative_names: ["Ras Zwayd"],
        coordinates: { lat: 26.2500, lng: 50.6300 },
        governorate: "Central",
        zoom: 15
    },
    
    "kawarah": {
        google_maps_name: "Kawarah",
        alternative_names: ["Al Kawarah"],
        coordinates: { lat: 26.1472, lng: 50.6186 },
        governorate: "Central",
        zoom: 15
    },
    
    "al-danah": {
        google_maps_name: "Al Danah",
        alternative_names: ["Danah"],
        coordinates: { lat: 26.1333, lng: 50.6167 },
        governorate: "Central",
        zoom: 15
    },
    
    "al-qurayyah": {
        google_maps_name: "Al Qurayyah",
        alternative_names: ["Qurayyah"],
        coordinates: { lat: 26.1444, lng: 50.6389 },
        governorate: "Central",
        zoom: 15
    },
    
    "karranah": {
        google_maps_name: "Karranah",
        alternative_names: ["Al Karranah"],
        coordinates: { lat: 26.1583, lng: 50.6444 },
        governorate: "Central",
        zoom: 15
    },
    
    "sadad": {
        google_maps_name: "Sadad",
        alternative_names: ["Al Sadad"],
        coordinates: { lat: 26.1667, lng: 50.6333 },
        governorate: "Central",
        zoom: 15
    },
    
    "maqabah": {
        google_maps_name: "Maqabah",
        alternative_names: ["Al Maqabah", "Maqaba"],
        coordinates: { lat: 26.1750, lng: 50.6417 },
        governorate: "Central",
        zoom: 15
    },
    
    "karbabad": {
        google_maps_name: "Karbabad",
        alternative_names: ["Al Karbabad"],
        coordinates: { lat: 26.1972, lng: 50.5472 },
        governorate: "Central",
        zoom: 15
    },
    
    "abu-saibaa": {
        google_maps_name: "Abu Saiba'a",
        alternative_names: ["Abu Saiba", "Abu Sayba"],
        coordinates: { lat: 26.0667, lng: 50.5333 },
        governorate: "Central",
        zoom: 15
    },
    
    "hillat-abdulsaleh": {
        google_maps_name: "Hillat Abdulsaleh",
        alternative_names: ["Hillat Abdul Saleh"],
        coordinates: { lat: 26.0833, lng: 50.5500 },
        governorate: "Central",
        zoom: 15
    },
    
    "musala": {
        google_maps_name: "Musala",
        alternative_names: ["Al Musala"],
        coordinates: { lat: 26.1167, lng: 50.5500 },
        governorate: "Central",
        zoom: 15
    },
    
    "al-jasrah": {
        google_maps_name: "Al Jasrah",
        alternative_names: ["Jasrah"],
        coordinates: { lat: 26.0333, lng: 50.5667 },
        governorate: "Central",
        zoom: 15
    },
    
    "al-dair": {
        google_maps_name: "Al Dair",
        alternative_names: ["Dair"],
        coordinates: { lat: 26.2667, lng: 50.6500 },
        governorate: "Central",
        zoom: 15
    },
    
    "jid-al-haj": {
        google_maps_name: "Jid Al Haj",
        alternative_names: ["Jid Al Hajj"],
        coordinates: { lat: 26.1500, lng: 50.5167 },
        governorate: "Central",
        zoom: 15
    },
    
    "maqsha": {
        google_maps_name: "Maqsha",
        alternative_names: ["Al Maqsha"],
        coordinates: { lat: 26.0583, lng: 50.4833 },
        governorate: "Central",
        zoom: 15
    },
    
    "dar-kulaib": {
        google_maps_name: "Dar Kulaib",
        alternative_names: ["Dar Kulayb"],
        coordinates: { lat: 26.0750, lng: 50.5583 },
        governorate: "Central",
        zoom: 15
    },
    
    "al-daih": {
        google_maps_name: "Al Daih",
        alternative_names: ["Daih"],
        coordinates: { lat: 26.1667, lng: 50.4833 },
        governorate: "Central",
        zoom: 15
    },
    
    "nabih-saleh": {
        google_maps_name: "Nabih Saleh",
        alternative_names: ["Nabi Saleh"],
        coordinates: { lat: 26.0333, lng: 50.5333 },
        governorate: "Central",
        zoom: 15
    },
    
    "al-qadam": {
        google_maps_name: "Al Qadam",
        alternative_names: ["Qadam"],
        coordinates: { lat: 26.1833, lng: 50.5167 },
        governorate: "Central",
        zoom: 15
    },
    
    "jannusan": {
        google_maps_name: "Jannusan",
        alternative_names: ["Al Jannusan"],
        coordinates: { lat: 26.2000, lng: 50.5333 },
        governorate: "Central",
        zoom: 15
    },
    
    "asker": {
        google_maps_name: "Asker",
        alternative_names: ["Al Asker"],
        coordinates: { lat: 26.1167, lng: 50.4833 },
        governorate: "Central",
        zoom: 15
    },
    
    "lhassay": {
        google_maps_name: "Lhassay",
        alternative_names: ["Al Lhassay"],
        coordinates: { lat: 26.1333, lng: 50.5333 },
        governorate: "Central",
        zoom: 15
    },
    
    "tashan": {
        google_maps_name: "Tashan",
        alternative_names: ["Al Tashan"],
        coordinates: { lat: 26.1500, lng: 50.5333 },
        governorate: "Central",
        zoom: 15
    },
    
    "al-khamis": {
        google_maps_name: "Al Khamis",
        alternative_names: ["Khamis"],
        coordinates: { lat: 26.1667, lng: 50.5167 },
        governorate: "Central",
        zoom: 15
    },
    
    "al-lawzi": {
        google_maps_name: "Al Lawzi",
        alternative_names: ["Lawzi"],
        coordinates: { lat: 26.1500, lng: 50.5500 },
        governorate: "Central",
        zoom: 15
    },
    
    "al-hajar": {
        google_maps_name: "Al Hajar",
        alternative_names: ["Hajar"],
        coordinates: { lat: 26.2167, lng: 50.5333 },
        governorate: "Central",
        zoom: 15
    },
    
    "wadiyan": {
        google_maps_name: "Wadiyan",
        alternative_names: ["Al Wadiyan"],
        coordinates: { lat: 26.1833, lng: 50.5333 },
        governorate: "Central",
        zoom: 15
    },
    
    "saraya-1": {
        google_maps_name: "Saraya 1",
        alternative_names: ["Saraya One", "Seef Saraya 1"],
        coordinates: { lat: 26.2389, lng: 50.5278 },
        governorate: "Capital",
        zoom: 16
    },
    
    "saraya-2": {
        google_maps_name: "Saraya 2",
        alternative_names: ["Saraya Two", "Seef Saraya 2"],
        coordinates: { lat: 26.2367, lng: 50.5303 },
        governorate: "Capital",
        zoom: 16
    },
    
    "district-one": {
        google_maps_name: "District One",
        alternative_names: ["District 1"],
        coordinates: { lat: 26.2400, lng: 50.5850 },
        governorate: "Capital",
        zoom: 15
    },
    
    "marasi-al-bahrain": {
        google_maps_name: "Marasi Al Bahrain",
        alternative_names: ["Marasi Bahrain", "Marasi", "Marasi Al bahrain"],
        coordinates: { lat: 26.2333, lng: 50.5917 },
        governorate: "Capital",
        zoom: 15
    },
    
    // Additional Areas
    "segaiya": {
        google_maps_name: "Segaya",
        alternative_names: ["Segaiya", "Al Segaya", "Siqaya"],
        coordinates: { lat: 26.2117, lng: 50.5594 },
        governorate: "Capital",
        zoom: 15
    },
    
    "burhama": {
        google_maps_name: "Burhamah",
        alternative_names: ["Burhama", "Al Burhamah"],
        coordinates: { lat: 26.1972, lng: 50.4650 },
        governorate: "Northern",
        zoom: 15
    },
    
    "jid-ali": {
        google_maps_name: "Jid Ali",
        alternative_names: ["Jid'Ali", "Jid'ali"],
        coordinates: { lat: 26.1667, lng: 50.5667 },
        governorate: "Central",
        zoom: 15
    },
    
    "al-markh": {
        google_maps_name: "Al Markh",
        alternative_names: ["Markh"],
        coordinates: { lat: 26.2008, lng: 50.4497 },
        governorate: "Northern",
        zoom: 15
    },
    
    "bahrain-bay": {
        google_maps_name: "Bahrain Bay",
        alternative_names: ["Bahrain Financial Harbour"],
        coordinates: { lat: 26.2444, lng: 50.5833 },
        governorate: "Capital",
        zoom: 15
    },
    
    "reef-island": {
        google_maps_name: "Reef Island",
        alternative_names: ["The Reef", "Reef"],
        coordinates: { lat: 26.2500, lng: 50.6050 },
        governorate: "Capital",
        zoom: 15
    },
    
    "dilmunia": {
        google_maps_name: "Dilmunia Island",
        alternative_names: ["Dilmunia", "Dil Munia"],
        coordinates: { lat: 26.2800, lng: 50.6650 },
        governorate: "Muharraq",
        zoom: 14
    }
};

/**
 * Search for area by name (handles variations and typos)
 */
function findAreaByName(searchTerm) {
    if (!searchTerm) return null;
    
    const normalized = searchTerm.toLowerCase().trim();
    
    // Direct match with mapping key
    if (BAHRAIN_AREA_MAPPING[normalized]) {
        return { key: normalized, ...BAHRAIN_AREA_MAPPING[normalized] };
    }
    
    // Search in google_maps_name and alternative names
    for (const [key, area] of Object.entries(BAHRAIN_AREA_MAPPING)) {
        // Match google_maps_name
        if (area.google_maps_name.toLowerCase() === normalized) {
            return { key, ...area };
        }
        
        // Match alternative names
        if (area.alternative_names && area.alternative_names.some(alt => 
            alt.toLowerCase() === normalized
        )) {
            return { key, ...area };
        }
    }
    
    // Partial match (starts with)
    for (const [key, area] of Object.entries(BAHRAIN_AREA_MAPPING)) {
        if (key.startsWith(normalized) || 
            area.google_maps_name.toLowerCase().startsWith(normalized)) {
            return { key, ...area };
        }
        
        // Check alternative names for partial match
        if (area.alternative_names && area.alternative_names.some(alt => 
            alt.toLowerCase().startsWith(normalized)
        )) {
            return { key, ...area };
        }
    }
    
    return null;
}

/**
 * Get coordinates for area
 */
function getAreaCoordinates(areaKey) {
    const area = BAHRAIN_AREA_MAPPING[areaKey];
    return area?.coordinates || null;
}

/**
 * Get all areas as array for dropdown population
 */
function getAllAreas() {
    return Object.entries(BAHRAIN_AREA_MAPPING).map(([key, area]) => ({
        key,
        name: area.google_maps_name,
        governorate: area.governorate,
        hasCoordinates: area.coordinates !== null
    })).sort((a, b) => a.name.localeCompare(b.name));
}

// Make available globally
window.BAHRAIN_AREA_MAPPING = BAHRAIN_AREA_MAPPING;
window.findAreaByName = findAreaByName;
window.getAreaCoordinates = getAreaCoordinates;
window.getAllAreas = getAllAreas;
