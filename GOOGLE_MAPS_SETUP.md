# Google Maps Setup for Food Bridge

## Getting a Google Maps API Key

To use live tracking of NGO and business locations, you need a Google Maps API key.

### Steps:

1. **Go to Google Cloud Console**: https://console.cloud.google.com

2. **Create a new project**
   - Click "Select a Project" > "New Project"
   - Enter project name: `Food Bridge Tracking`
   - Click "Create"

3. **Enable Google Maps APIs**
   - Search for `Maps JavaScript API` and click it
   - Click "Enable"
   - Search for `Geocoding API` and click it
   - Click "Enable"

4. **Create an API Key**
   - Click "Credentials" in the left menu
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

5. **Restrict your API Key (Recommended for security)**
   - In the Credentials page, click your API key
   - Under "Key restrictions", select "HTTP referrers (web sites)"
   - Add your domain or `localhost:3000` for development

6. **Add to `.env` file**
   - Open `food-bridge/.env`
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:
     ```
     VITE_GOOGLE_MAPS_KEY=AIzaSyD_YOUR_API_KEY_HERE
     ```

7. **Restart the development server**
   ```bash
   npm run dev
   ```

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
