import { motion } from 'framer-motion'
import { ArrowLeft, Navigation, Fuel, Clock, TrendingUp, Map, Star } from 'lucide-react'
import { useStore } from '../store/useStore'

const MODE_COLORS = { eco: '#22c55e', sport: '#f97316', safe: '#60a5fa', balanced: '#a78bfa' }

function formatTime(mins) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function ResultSheet() {
  const { routeResult, activeMode, getActiveBike, setScreen, origin, destination } = useStore()
  const bike = getActiveBike()
  if (!routeResult) return null

  const modeColor = MODE_COLORS[activeMode] || '#4f8eff'

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="absolute bottom-0 left-0 right-0 z-30 rounded-t-3xl overflow-hidden"
      style={{ background: 'rgba(10,16,32,0.96)', backdropFilter: 'blur(30px)', maxHeight: '72vh' }}
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-white/15" />
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 'calc(72vh - 20px)' }}>
        <div className="px-5 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-5 mt-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ background: modeColor }} />
                <span className="text-xs text-white/40 uppercase tracking-widest font-display">{activeMode} route</span>
              </div>
              <h2 className="font-display text-xl font-600 text-white leading-tight">
                {origin?.shortName} <span className="text-white/30">→</span> {destination?.shortName}
              </h2>
              <p className="text-sm text-white/40 mt-0.5">{bike?.name}</p>
            </div>
            <button
              onClick={() => setScreen('map')}
              className="glass-card p-2.5 rounded-xl"
            >
              <ArrowLeft size={16} className="text-white/60" />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: Map, label: 'Distance', value: `${routeResult.distance_km}`, unit: 'km', color: '#4f8eff' },
              { icon: Clock, label: 'Est. time', value: formatTime(routeResult.duration_min), unit: '', color: modeColor },
              { icon: Fuel, label: 'Fuel est.', value: `${routeResult.fuel_liters}`, unit: 'L', color: '#f97316' },
            ].map(({ icon: Icon, label, value, unit, color }) => (
              <div key={label} className="glass-card rounded-2xl p-4 flex flex-col gap-1">
                <Icon size={14} style={{ color }} />
                <div className="text-xl font-display font-600 text-white">
                  {value}<span className="text-sm text-white/40 ml-0.5">{unit}</span>
                </div>
                <div className="text-[11px] text-white/35">{label}</div>
              </div>
            ))}
          </div>

          {/* Elevation */}
          <div className="glass-card rounded-2xl p-4 mb-3 flex items-center gap-3">
            <TrendingUp size={16} className="text-white/40" />
            <div>
              <div className="text-xs text-white/40 mb-0.5">Elevation gain</div>
              <div className="text-sm font-display font-500 text-white">+{routeResult.elevation_gain} m</div>
            </div>
            <div className="ml-auto">
              <div className="flex gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => {
                  const h = Math.random() * 24 + 4
                  return <div key={i} className="w-2 rounded-sm" style={{ height: h, background: `${modeColor}66`, alignSelf: 'flex-end' }} />
                })}
              </div>
            </div>
          </div>

          {/* Terrain tags */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs text-white/30">Terrain:</span>
            {routeResult.terrain_tags?.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full font-display"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {tag}
              </span>
            ))}
            <span className="text-xs px-3 py-1 rounded-full"
              style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
              {routeResult.road_quality}
            </span>
          </div>

          {/* Start button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-display font-600 text-white text-base flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${modeColor}cc, ${modeColor})`, boxShadow: `0 8px 32px ${modeColor}44` }}
          >
            <Navigation size={18} />
            Start Navigation
          </motion.button>

          <button
            onClick={() => setScreen('map')}
            className="w-full py-3 mt-2 text-sm text-white/30 font-body"
          >
            Back to map
          </button>
        </div>
      </div>
    </motion.div>
  )
}
