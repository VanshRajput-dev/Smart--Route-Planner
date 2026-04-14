import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Geocoding ─────────────────────────────────────────────────────────────────
export async function geocode(query) {
  // Using Nominatim (free, no key needed) — swap with your own if needed
  const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
    params: { q: query, format: 'json', limit: 5, countrycodes: 'in' },
    headers: { 'Accept-Language': 'en' },
  })
  return res.data.map(r => ({
    name: r.display_name,
    shortName: r.name,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    type: r.type,
  }))
}

// ── Route calculation ─────────────────────────────────────────────────────────
export async function calculateRoute({ origin, destination, mode, bike }) {
  try {
    const res = await api.post('/route', {
      origin: { lat: origin.lat, lon: origin.lon },
      destination: { lat: destination.lat, lon: destination.lon },
      mode,
      bike_type: bike?.type || 'standard',
      fuel_tank: bike?.fuelTank,
      mileage: bike?.mileage,
    })
    return res.data
  } catch (err) {
    // Fallback to OSRM for demo if backend not ready
    return fallbackRoute(origin, destination, mode, bike)
  }
}

async function fallbackRoute(origin, destination, mode, bike) {
  const res = await axios.get(
    `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}`,
    { params: { overview: 'full', geometries: 'geojson', steps: false } }
  )
  const route = res.data.routes[0]
  const distKm = route.distance / 1000
  const durationMin = route.duration / 60
  const mileage = bike?.mileage || 35
  const fuelEst = distKm / mileage

  const modeMultipliers = { eco: 1.15, sport: 0.85, safe: 1.25, balanced: 1.0 }
  const adjustedTime = durationMin * (modeMultipliers[mode] || 1.0)

  return {
    geometry: route.geometry,
    distance_km: Math.round(distKm * 10) / 10,
    duration_min: Math.round(adjustedTime),
    fuel_liters: Math.round(fuelEst * 10) / 10,
    elevation_gain: Math.round(Math.random() * 800 + 100),
    terrain_tags: detectTerrain(distKm, destination),
    road_quality: 'Good',
    waypoints: [
      { name: origin.shortName || 'Start', lat: origin.lat, lon: origin.lon },
      { name: destination.shortName || 'End', lat: destination.lat, lon: destination.lon },
    ],
  }
}

function detectTerrain(distKm, dest) {
  const name = (dest?.name || '').toLowerCase()
  const tags = []
  if (name.includes('ooty') || name.includes('kodai') || name.includes('munnar') || name.includes('coorg')) tags.push('Ghat roads')
  if (distKm > 100) tags.push('Highway')
  if (name.includes('city') || name.includes('chennai') || name.includes('bangalore')) tags.push('Urban')
  if (tags.length === 0) tags.push('Mixed')
  return tags
}

export async function reverseGeocode(lat, lon) {
  const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
    params: { lat, lon, format: 'json' },
    headers: { 'Accept-Language': 'en' },
  })
  return { name: res.data.display_name, shortName: res.data.name || res.data.address?.city || 'Selected point', lat, lon }
}
