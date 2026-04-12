# Google Maps Integration - Quick Reference

## 🚀 Quick Start (5 minutes)

### 1️⃣ Get Google Maps API Key
- Go to: https://console.cloud.google.com
- Create new project: "LawConnect"
- Enable APIs: Maps JavaScript API, Geocoding API, Places API
- Create API Key and copy it

### 2️⃣ Add to Environment
```bash
# Edit client/.env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

### 3️⃣ Run Database Migration
```bash
docker-compose exec app php artisan migrate --force
```

### 4️⃣ Test It Out
- Restart Docker containers
- Go to "Submit Report" page
- Click "📍 Select on Map"
- Select location on map or search for address
- Submit report - location will be saved!

---

## 📍 Features

### For Report Submitters
✅ Interactive Google Map picker
✅ Address autocomplete search  
✅ Click anywhere to select location
✅ Auto-fill address from coordinates
✅ Display coordinates (lat/lng)

### For Investigators
✅ View crime location on embedded map
✅ Click to open in full Google Maps
✅ See exact coordinates
✅ Copy coordinates to clipboard
✅ View formatted address

---

## 🔧 Files Modified/Created

### Backend
```
✅ server/database/migrations/2026_04_12_000005_add_coordinates_to_crime_reports_table.php
✅ server/app/Models/CrimeReport.php (updated)
✅ server/app/Http/Requests/CrimeReportStoreRequest.php (updated)
✅ server/app/Http/Resources/CrimeReportResource.php (updated)
```

### Frontend
```
✅ client/src/components/Dashboard/MapLocationPicker.tsx (new)
✅ client/src/components/Dashboard/MapDisplay.tsx (new)
✅ client/src/views/ReportCrime.tsx (updated)
✅ client/.env (updated)
✅ client/.env.example (updated)
```

### Documentation
```
✅ GOOGLE_MAPS_SETUP.md (comprehensive guide)
✅ GOOGLE_MAPS_QUICK_REF.md (this file)
```

---

## 🔌 API Changes

### Create Report Request
**NEW FIELDS:**
```json
{
  "location": "123 Main St, New York, NY",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address_components": {
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "country": "United States",
    "zipcode": "10001"
  }
}
```

### Crime Report Response
**NEW FIELDS:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address_components": {...},
  "mapsUrl": "https://maps.google.com/?q=40.7128,-74.0060"
}
```

---

## 🗺️ Component Usage

### In Report Submission
```tsx
import MapLocationPicker from '@/components/Dashboard/MapLocationPicker';

<MapLocationPicker 
  onLocationSelect={(location) => {
    // location.latitude
    // location.longitude
    // location.address
    // location.addressComponents
  }}
/>
```

### In Case Details
```tsx
import { CaseMapDisplay, MapStats } from '@/components/Dashboard/MapDisplay';

<CaseMapDisplay 
  latitude={report.latitude}
  longitude={report.longitude}
  address={report.location}
/>
```

---

## ⚙️ Configuration

### .env Variables
```env
# Required - Get from Google Cloud Console
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE

# Optional - For static map images
REACT_APP_MAPBOX_TOKEN=YOUR_TOKEN
```

### API Key Restrictions (Production)
1. Go to Google Cloud Console
2. Select API Key
3. Set "Application restrictions" to "HTTP referrers"
4. Add domains:
   - Development: `localhost:5173`
   - Production: `yourdomain.com`
5. Restrict to these APIs only:
   - Maps JavaScript API
   - Geocoding API
   - Places API

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Map won't load | Check API key in `.env` |
| Search doesn't work | Verify "Places API" is enabled |
| Coordinates not saving | Run migration: `php artisan migrate --force` |
| CORS error | Check API key domain restrictions |
| All white map | Try clearing cache/rebuilding: `npm run build` |

---

## 📊 Database Schema

### New Columns Added to `crime_reports`
```sql
latitude DECIMAL(10,8) NULL
longitude DECIMAL(11,8) NULL
address_components JSON NULL
```

### Index Created
```sql
INDEX idx_coords (latitude, longitude)
```

---

## 💡 Useful Commands

```bash
# Restart app after changing .env
docker-compose restart app

# Check migration status
docker-compose exec app php artisan migrate:status

# Run specific migration
docker-compose exec app php artisan migrate --path=database/migrations/2026_04_12_000005_add_coordinates_to_crime_reports_table.php

# Rebuild frontend
cd client && npm run build

# Clear everything and fresh start
docker-compose down -v && docker-compose up -d
```

---

## 📱 Mobile Support

✅ Fully responsive on mobile
✅ Touch-friendly map controls
✅ Mobile autocomplete search
✅ Works offline (address from previous search)

---

## 🔒 Security Notes

1. **Never commit API keys** - Use `.env` file only
2. **Restrict API key** - Use HTTP referrer restrictions
3. **Monitor usage** - Check Google Cloud Console for quota
4. **Billing alerts** - Set up payment alerts to prevent surprises
5. **Location privacy** - Consider not showing map to certain users

---

## 📈 Pricing Estimate

| Usage | Cost/Month | Status |
|-------|-----------|--------|
| 0-28k map loads | FREE | Within free tier |
| 1,000 reports | ~$35 | Small fee |
| 10,000 reports | ~$350 | Moderate |
| 100,000 reports | ~$3,500 | High volume |

---

## 🎯 Next Steps

1. ✅ Get Google Maps API key (see setup guide)
2. ✅ Add to `.env` file
3. ✅ Run database migration
4. ✅ Test in browser
5. ✅ Deploy to production
6. ✅ Update API key restrictions for production domain

---

## 📚 Resources

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [Places API](https://developers.google.com/maps/documentation/places)
- [Google Cloud Console](https://console.cloud.google.com)

---

**Last Updated:** April 12, 2026
