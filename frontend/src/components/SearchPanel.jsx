import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Search, X, ChevronDown } from 'lucide-react'
import { useStore } from '../store/useStore'
import { geocode, calculateRoute } from '../services/api'
import { debounce } from '../utils/helpers'

const MODES = [
  { id: 'eco', label: 'Eco', color: '#22c55e', desc: 'Fuel saver' },
  { id: 'sport', label: 'Sport', color: '#f97316', desc: 'Fast & fun' },
  { id: 'safe', label: 'Safe', color: '#60a5fa', desc: 'Cautious' },
  { id: 'balanced', label: 'Balanced', color: '#a78bfa', desc: 'All-round' },
]

export default function SearchPanel() {
  const {
    originText, destText, setOriginText, setDestText,
    origin, destination, setOrigin, setDestination,
    activeMode, setMode, getActiveBike,
    setRouteResult, setCalculating, isCalculating,
    saveToHistory, setScreen,
  } = useStore()

  const [suggestions, setSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)
  const [showModes, setShowModes] = useState(false)

  const bike = getActiveBike()

  const fetchSuggestions = useCallback(
    debounce(async (q) => {
      if (q.length < 3) { setSuggestions([]); return }
      try {
        const results = await geocode(q)
        setSuggestions(results)
      } catch { setSuggestions([]) }
    }, 400),
    []
  )

  const selectSuggestion = (place) => {
    if (activeField === 'origin') {
      setOrigin(place)
      setOriginText(place.shortName)
    } else {
      setDestination(place)
      setDestText(place.shortName)
    }
    setSuggestions([])
    setActiveField(null)
  }

  const handleGo = async () => {
    if (!origin || !destination) return
    setCalculating(true)
    try {
      const result = await calculateRoute({ origin, destination, mode: activeMode, bike })
      setRouteResult(result)
      saveToHistory({
        origin: { ...origin },
        destination: { ...destination },
        mode: activeMode,
        bike: bike?.name,
        bikeId: bike?.id,
        ...result,
      })
      setScreen('result')
    } catch (e) {
      console.error(e)
    } finally {
      setCalculating(false)
    }
  }

  const canGo = origin && destination && !isCalculating

  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-safe">
      {/* Bike badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-3"
      >
        <div className="glass flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer"
          onClick={() => setScreen('garage')}>
          <span className="text-sm">{bike?.emoji}</span>
          <span className="text-xs font-display font-600 text-white/80">{bike?.name}</span>
          <ChevronDown size={12} className="text-white/40" />
        </div>
        <div className="glass flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          onClick={() => setShowModes(v => !v)}
          style={{ cursor: 'pointer' }}>
          <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: MODES.find(m => m.id === activeMode)?.color }} />
          <span className="text-xs text-white/70 capitalize">{activeMode}</span>
        </div>
      </motion.div>

      {/* Mode selector */}
      <AnimatePresence>
        {showModes && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="glass rounded-2xl p-3 mb-3 grid grid-cols-4 gap-2"
          >
            {MODES.map(m => (
              <button key={m.id}
                onClick={() => { setMode(m.id); setShowModes(false) }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
                style={{
                  background: activeMode === m.id ? `${m.color}22` : 'transparent',
                  border: activeMode === m.id ? `1px solid ${m.color}66` : '1px solid transparent',
                }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                <span className="text-xs font-display font-500 text-white">{m.label}</span>
                <span className="text-[10px] text-white/40">{m.desc}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden"
      >
        {/* Origin */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <div className="w-3 h-3 rounded-full bg-brand-500 flex-shrink-0 ring-2 ring-brand-500/30" />
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 font-body"
            placeholder="Starting point — tap map or type"
            value={originText}
            onFocus={() => setActiveField('origin')}
            onChange={e => { setOriginText(e.target.value); fetchSuggestions(e.target.value) }}
          />
          {originText && <button onClick={() => { setOriginText(''); setOrigin(null) }}><X size={14} className="text-white/30" /></button>}
        </div>

        {/* Destination */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 ring-2 ring-red-500/30" />
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 font-body"
            placeholder="Where to? Type or tap map"
            value={destText}
            onFocus={() => setActiveField('destination')}
            onChange={e => { setDestText(e.target.value); fetchSuggestions(e.target.value) }}
          />
          {destText && <button onClick={() => { setDestText(''); setDestination(null) }}><X size={14} className="text-white/30" /></button>}
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && activeField && (
            <motion.div
              initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              className="overflow-hidden border-t border-white/[0.06]"
            >
              {suggestions.slice(0, 4).map((s, i) => (
                <button key={i} onClick={() => selectSuggestion(s)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors text-left border-b border-white/[0.03] last:border-none">
                  <MapPin size={13} className="text-white/30 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-white/85">{s.shortName}</div>
                    <div className="text-[11px] text-white/35 truncate max-w-[240px]">{s.name}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Go button */}
      <AnimatePresence>
        {canGo && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleGo}
            disabled={isCalculating}
            className="absolute top-4 right-4 w-14 h-14 rounded-2xl flex items-center justify-center font-display font-600 text-white shadow-lg z-30"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f8eff)', boxShadow: '0 8px 32px rgba(37,99,235,0.5)' }}
            whileTap={{ scale: 0.92 }}
          >
            {isCalculating
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spin" />
              : <Navigation size={20} />
            }
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
