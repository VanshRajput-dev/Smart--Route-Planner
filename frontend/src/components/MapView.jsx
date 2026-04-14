import { useEffect, useRef, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { useStore } from '../store/useStore'
import { reverseGeocode } from '../services/api'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

export default function MapView({ onMapReady }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef({ origin: null, destination: null })

  const { origin, destination, setOrigin, setDestination, setOriginText, setDestText, routeResult } = useStore()

  // Init map
  useEffect(() => {
    if (mapInstance.current) return

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: MAP_STYLE,
      center: [78.9629, 20.5937],
      zoom: 4.5,
      pitch: 30,
      bearing: 0,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'bottom-right')

    map.on('load', () => {
      // Route source & layer
      map.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        paint: { 'line-color': '#4f8eff', 'line-width': 10, 'line-opacity': 0.25, 'line-blur': 6 },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      })
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        paint: { 'line-color': '#4f8eff', 'line-width': 4, 'line-opacity': 1 },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      })
      onMapReady?.(map)
    })

    // Click to set points
    map.on('click', async (e) => {
      const { lng, lat } = e.lngLat
      const { origin: currentOrigin } = useStore.getState()

      try {
        const place = await reverseGeocode(lat, lng)
        if (!currentOrigin) {
          useStore.getState().setOrigin({ lat, lon: lng, name: place.name, shortName: place.shortName })
          useStore.getState().setOriginText(place.shortName)
        } else {
          useStore.getState().setDestination({ lat, lon: lng, name: place.name, shortName: place.shortName })
          useStore.getState().setDestText(place.shortName)
        }
      } catch {
        const fallback = { lat, lon: lng, name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, shortName: 'Selected point' }
        if (!currentOrigin) {
          useStore.getState().setOrigin(fallback)
          useStore.getState().setOriginText(fallback.shortName)
        } else {
          useStore.getState().setDestination(fallback)
          useStore.getState().setDestText(fallback.shortName)
        }
      }
    })

    mapInstance.current = map
    return () => { map.remove(); mapInstance.current = null }
  }, [])

  // Update origin marker
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !map.isStyleLoaded()) return
    if (markersRef.current.origin) markersRef.current.origin.remove()
    if (!origin) return

    const el = document.createElement('div')
    el.className = 'origin-marker'
    el.innerHTML = `<div style="width:14px;height:14px;background:#4f8eff;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(79,142,255,0.3)"></div>`
    const m = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([origin.lon, origin.lat]).addTo(map)
    markersRef.current.origin = m
    map.flyTo({ center: [origin.lon, origin.lat], zoom: 10, duration: 1500 })
  }, [origin])

  // Update destination marker
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !map.isStyleLoaded()) return
    if (markersRef.current.destination) markersRef.current.destination.remove()
    if (!destination) return

    const el = document.createElement('div')
    el.innerHTML = `<div style="width:14px;height:14px;background:#ef4444;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(239,68,68,0.3)"></div>`
    const m = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([destination.lon, destination.lat]).addTo(map)
    markersRef.current.destination = m
  }, [destination])

  // Draw route
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !map.isStyleLoaded()) return
    if (!routeResult?.geometry) {
      map.getSource('route')?.setData({ type: 'FeatureCollection', features: [] })
      return
    }
    map.getSource('route')?.setData({ type: 'Feature', geometry: routeResult.geometry })

    // Fit bounds
    const coords = routeResult.geometry.coordinates
    if (coords?.length) {
      const bounds = coords.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(coords[0], coords[0]))
      map.fitBounds(bounds, { padding: { top: 180, bottom: 250, left: 50, right: 50 }, duration: 1800 })
    }
  }, [routeResult])

  return <div ref={mapRef} className="map-container" />
}
