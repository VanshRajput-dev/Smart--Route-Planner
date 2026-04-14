import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Fuel, TrendingUp, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'

const MODE_COLORS = { eco: '#22c55e', sport: '#f97316', safe: '#60a5fa', balanced: '#a78bfa' }

function formatTime(mins) {
  if (!mins) return '—'
  const h = Math.floor(mins / 60), m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return `${Math.floor(days / 7)}w ago`
}

export default function HistoryScreen() {
  const { routeHistory, setScreen, setRouteResult, setOrigin, setDestination, setOriginText, setDestText, setMode } = useStore()

  const replay = (entry) => {
    setOrigin(entry.origin)
    setDestination(entry.destination)
    setOriginText(entry.origin?.shortName || '')
    setDestText(entry.destination?.shortName || '')
    setMode(entry.mode || 'eco')
    setRouteResult({
      geometry: entry.geometry,
      distance_km: entry.distance_km,
      duration_min: entry.duration_min,
      fuel_liters: entry.fuel_liters,
      elevation_gain: entry.elevation_gain,
      terrain_tags: entry.terrain_tags,
      road_quality: entry.road_quality,
    })
    setScreen('result')
  }

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="absolute inset-0 z-40 flex flex-col"
      style={{ background: '#07101f' }}
    >
      <div className="px-5 pt-14 pb-5 border-b border-white/[0.06]">
        <button onClick={() => setScreen('map')} className="flex items-center gap-2 text-white/40 mb-4 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="font-display text-2xl font-700 text-gradient">Route History</h1>
        <p className="text-sm text-white/35 mt-1">{routeHistory.length} saved route{routeHistory.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {routeHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <div className="font-display text-lg font-500 text-white/40">No routes yet</div>
            <div className="text-sm text-white/25 mt-1">Plan your first ride to see it here</div>
            <button onClick={() => setScreen('map')}
              className="mt-6 px-6 py-3 rounded-xl text-sm font-display font-500 text-white"
              style={{ background: 'rgba(37,99,235,0.3)', border: '1px solid rgba(79,142,255,0.3)' }}>
              Plan a route →
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {routeHistory.map((entry, i) => {
              const mc = MODE_COLORS[entry.mode] || '#4f8eff'
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => replay(entry)}
                  className="rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: mc }} />
                        <span className="text-[10px] uppercase tracking-widest text-white/30 font-display">{entry.mode}</span>
                        <span className="text-white/15 text-xs">·</span>
                        <span className="text-[10px] text-white/30">{timeAgo(entry.savedAt)}</span>
                      </div>
                      <div className="font-display font-600 text-white text-base leading-tight truncate">
                        {entry.origin?.shortName} → {entry.destination?.shortName}
                      </div>
                      <div className="text-xs text-white/30 mt-0.5 truncate">{entry.bike}</div>
                    </div>
                    <ChevronRight size={16} className="text-white/20 flex-shrink-0 mt-1" />
                  </div>

                  <div className="flex gap-4">
                    {[
                      { icon: MapPin, val: `${entry.distance_km} km` },
                      { icon: Clock, val: formatTime(entry.duration_min) },
                      { icon: Fuel, val: `${entry.fuel_liters} L` },
                    ].map(({ icon: Icon, val }) => (
                      <div key={val} className="flex items-center gap-1.5">
                        <Icon size={11} className="text-white/25" />
                        <span className="text-xs text-white/45">{val}</span>
                      </div>
                    ))}
                  </div>

                  {entry.terrain_tags?.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {entry.terrain_tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  )
}
