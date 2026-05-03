# Leaflet Map Setup for Food Bridge

The Food Bridge now uses **Leaflet** with OpenStreetMap tiles for free mapping - no API key required! 🗺️

## What the Maps Show

- 🟢 **Green circles**: Food donation businesses (restaurants, hotels, etc.)
- 🟠 **Orange circles**: NGOs needing food

Both markers are clickable and show the location name. The map auto-zooms to fit all visible markers.

## Seeing It Live

1. Start the backend and frontend:
   ```bash
   npm run dev:full
   ```

2. Navigate to the app and scroll to the "Live Tracking" section

3. The map will display all active food listings and NGO locations in real-time

## Database Locations

The database already seeds three locations in India:
- Delhi: Sunrise Restaurant, Hope Foundation
- Mumbai: Grand Hotel, Seva Samiti
- Bangalore: Cloud Kitchen Pro, Rising Stars

## Why Leaflet?

- **Free**: No API keys or usage limits
- **Fast**: Lightweight and quick to load
- **Open Source**: Community maintained
- **Customizable**: Easy to style and extend
