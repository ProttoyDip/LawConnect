# Google Maps Integration Guide - LawConnect

## Overview

Users can now select crime locations interactively on a Google Map when submitting crime reports. The map includes:

- **Interactive Map Picker**: Click on the map to select the exact location
- **Autocomplete Search**: Type address or landmark to find location
- **Coordinates Storage**: Latitude and longitude stored in database
- **Location Display**: Maps embedded in case details
- **Full Address Details**: Street, city, state, country, zipcode captured

---

## Setup Instructions

### 1. Get Google Maps API Key

#### Step 1: Go to Google Cloud Console
- Visit: https://console.cloud.google.com
- Sign in with your Google account

#### Step 2: Create a New Project
- Click "Select a Project" at the top
- Click "NEW PROJECT"
- Enter project name: "LawConnect"
- Click "CREATE"

#### Step 3: Enable Required APIs
Once project is created, enable these APIs:

1. **Maps JavaScript API**
   - Search for "Maps JavaScript API"
   - Click and press "ENABLE"

2. **Geocoding API**
   - Search for "Geocoding API"
   - Click and press "ENABLE"

3. **Places API**
   - Search for "Places API"
   - Click and press "ENABLE"

#### Step 4: Create API Key
- Go to "Credentials" in left sidebar
- Click "CREATE CREDENTIALS"
- Select "API Key"
- Copy the generated API key

#### Step 5: Restrict API Key (Recommended)
- Click on your API key
- Under "Application restrictions":
  - Select "HTTP referrers (websites)"
  - Add your domain: `localhost:5173` (development) or your production domain
- Under "API restrictions":
  - Select "Restrict key"
  - Check: Maps JavaScript API, Geocoding API, Places API

---

### 2. Configure in .env File

Add to `/client/.env`:

```env
# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with your actual API key from Google Cloud Console.

---

### 3. Run Database Migration

```bash
# Navigate to project directory
cd /Users/rakeythouhid/Documents/SD/LawConnect

# Run migration to add latitude/longitude columns
docker-compose exec app php artisan migrate --force
```

This creates:
- `latitude` column (decimal 10,8)
- `longitude` column (decimal 11,8)
- `address_components` column (JSON)

---

## Usage

### For Users (Submitting Reports)

1. **Click "Submit Report"** from dashboard
2. **Fill in report details** (title, category, description)
3. **Click "📍 Select on Map"** button
4. **Map appears** with search box and interactive map
5. **Option 1**: Type address in search box and press Enter
6. **Option 2**: Click directly on map at crime location
7. **Marker appears** confirming selection
8. **Address auto-fills** in location field
9. **Complete form** and submit

### For Investigators (Viewing Reports)

1. **Open case details** from crime reports list
2. **See embedded map** with exact location marked
3. **Click "View in Google Maps"** to open full map
4. **View coordinates** in separate stats section

---

## API Endpoints

### Store Crime Report with Location
```bash
POST /api/crime-report
Content-Type: multipart/form-data

Parameters:
  title                (string, required)
  category             (string, required)
  description          (string, required)
  location             (string, required) - Address text
  latitude             (number, optional) - Decimal degrees
  longitude            (number, optional) - Decimal degrees
  address_components   (JSON, optional) - Full address breakdown
  priority             (string, optional)
  occurred_at          (datetime, optional)
  evidence[]           (files, optional)
```

### Response
```json
{
  "message": "Crime report submitted successfully.",
  "report": {
    "id": 123,
    "title": "Car stolen",
    "location": "123 Main St, New York, NY 10001",
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
}
```

---

## Database Schema

### Crime Reports Table (New Columns)
```sql
ALTER TABLE crime_reports ADD COLUMN
  latitude DECIMAL(10, 8) NULL AFTER location,
  longitude DECIMAL(11, 8) NULL AFTER latitude,
  address_components LONGTEXT NULL AFTER longitude;

CREATE INDEX idx_coords ON crime_reports(latitude, longitude);
```

---

## Frontend Components

### MapLocationPicker Component
**File**: `src/components/Dashboard/MapLocationPicker.tsx`

```tsx
import MapLocationPicker from '@/components/Dashboard/MapLocationPicker';

<MapLocationPicker 
  onLocationSelect={(location) => {
    console.log(location);
    // { latitude, longitude, address, addressComponents }
  }}
  initialLocation={existingLocation}
  apiKey="YOUR_API_KEY"
/>
```

### MapDisplay Component (Case Details)
**File**: `src/components/Dashboard/MapDisplay.tsx`

```tsx
import { CaseMapDisplay, MapStats } from '@/components/Dashboard/MapDisplay';

// Show embedded map
<CaseMapDisplay 
  latitude={40.7128}
  longitude={-74.0060}
  address="123 Main St, New York, NY"
/>

// Show coordinates
<MapStats latitude={40.7128} longitude={-74.0060} />
```

---

## Features

### Location Picker Features
✅ Google Map with zoom/pan controls
✅ Address autocomplete search
✅ Click-to-select location
✅ Real-time address lookup via reverse geocoding
✅ Full address components extraction
✅ Visual marker indicating selected location
✅ Dark mode support

### Case Display Features
✅ Embedded Google Map viewer
✅ Direct link to full Google Maps
✅ Coordinate display (latitude, longitude)
✅ Copy coordinates to clipboard
✅ Address breakdown display
✅ Responsive design

---

## Troubleshooting

### Map Not Loading
**Problem**: Map appears blank

**Solutions**:
1. Check API key in `.env` is correct
2. Verify required APIs are enabled in Google Cloud
3. Check browser console for errors
4. Clear cache and rebuild: `npm run build`
5. Check API key restrictions match your domain

### Autocomplete Not Working
**Problem**: Address search doesn't suggest locations

**Solutions**:
1. Ensure "Places API" is enabled
2. Check that API key includes Places API in restrictions
3. Type full address (e.g., "123 Main St, New York")
4. Clear browser cache
5. Check internet connection

### Coordinates Not Saving
**Problem**: Latitude/longitude fields empty in database

**Solutions**:
1. Run migration: `php artisan migrate --force`
2. Check browser sends coordinates in request
3. Verify API accepts numeric latitude/longitude
4. Check server logs for validation errors

### "Failed to Load Google Maps" Error
**Problem**: Error message when opening map

**Solutions**:
1. Check internet connection
2. Verify API key is valid and active
3. Check API key hasn't exceeded daily quota
4. Verify HTTP referrer restrictions
5. Try refreshing page

---

## Security Best Practices

1. **API Key Restrictions**: Always use HTTP referrer restrictions in production
2. **Never Expose Key in Frontend**: Use environment variables in `.env`
3. **Billing Alerts**: Set up Google Cloud billing alerts
4. **Monthly Quota**: Monitor API usage in Google Cloud Console
5. **Domain Verification**: Add domain to API key restrictions
6. **Coordinate Privacy**: Don't expose sensitive facility locations to citizens

---

## Cost Considerations

### Google Maps Pricing
- **Maps JavaScript API**: $7 per 1000 map loads (free tier: 28,000/mo)
- **Geocoding API**: $5 per 1000 requests (free tier: 5,000/mo)
- **Places API**: $7 per 1000 details requests (free tier: 25,000/mo)

**Estimate**: 
- For 1000 reports/month = ~$35/month (within free tier)
- For 10,000 reports/month = ~$350/month

---

## Advanced Features (Future)

1. **Heatmaps**: Show crime hotspots
2. **Route Planning**: Optimize police response routes
3. **Geofencing**: Alert when crimes occur near important locations
4. **Distance Calculation**: Measure distance between incidents
5. **Street View**: Show street-level view of incident location
6. **Polygon Drawing**: Define crime areas

---

## Integration Checklist

- [ ] Google Cloud account created
- [ ] Google Maps APIs enabled
- [ ] API key generated and restricted
- [ ] `.env` file updated with API key
- [ ] Database migrations run
- [ ] MapLocationPicker component working
- [ ] MapDisplay component showing in case details
- [ ] Search autocomplete functioning
- [ ] Coordinates saving to database
- [ ] Maps displaying on case details
- [ ] Mobile responsiveness tested
- [ ] Dark mode tested
- [ ] Production domain added to API restrictions

---

## Contact & Support

For issues or questions about Google Maps integration:
1. Check [Google Maps API Documentation](https://developers.google.com/maps)
2. Review [Places API Guide](https://developers.google.com/maps/documentation/places)
3. Check project logs: `docker-compose logs app`
4. Verify Google Cloud Console for quota limits
