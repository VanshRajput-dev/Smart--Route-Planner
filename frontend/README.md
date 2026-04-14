# 🏍️ MotoRoute — Smart Bike Navigation

A beautiful React + MapLibre motorcycle route planning app.

## Stack
- **React 18 + Vite** — blazing fast dev server
- **MapLibre GL** — dark map with route rendering
- **Framer Motion** — silky smooth screen transitions
- **Zustand** — global state with localStorage persistence
- **Tailwind CSS v3** — utility styling
- **Axios** — API calls to your FastAPI backend

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Connect to your backend

Edit `.env`:
```
VITE_API_URL=http://localhost:8000
```

The app auto-falls back to OSRM (free routing) if backend is not running — so you can develop the UI independently.

## Backend API contract

### POST /route
```json
{
  "origin": { "lat": 9.9252, "lon": 78.1198 },
  "destination": { "lat": 10.2381, "lon": 77.4892 },
  "mode": "eco",
  "bike_type": "cruiser",
  "fuel_tank": 15,
  "mileage": 35
}
```

Response:
```json
{
  "geometry": { "type": "LineString", "coordinates": [[78.11, 9.92], ...] },
  "distance_km": 82.4,
  "duration_min": 134,
  "fuel_liters": 2.8,
  "elevation_gain": 2133,
  "terrain_tags": ["Ghat roads", "Highway"],
  "road_quality": "Good"
}
```

## File Structure

```
src/
├── components/
│   ├── MapView.jsx       ← MapLibre map, click-to-pin, route drawing
│   ├── SearchPanel.jsx   ← Origin/dest inputs, mode selector, Go button
│   ├── ResultSheet.jsx   ← Route result bottom sheet
│   ├── GarageScreen.jsx  ← Bike management + add bike modal
│   ├── HistoryScreen.jsx ← Saved route history
│   └── BottomNav.jsx     ← Tab navigation
├── store/
│   └── useStore.js       ← Zustand global state
├── services/
│   └── api.js            ← Backend + geocoding API calls
└── utils/
    └── helpers.js        ← debounce etc
```

## Features
- 🗺️ Click map to set origin/destination
- 🔍 Type to search places (Nominatim geocoding)
- ⚡ Eco / Sport / Safe / Balanced routing modes
- 🏍️ Garage — add/remove bikes, set defaults
- 📅 Route history with replay
- 💾 Persistent state via localStorage
- 🌙 Full dark theme
