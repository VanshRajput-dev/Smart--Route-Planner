import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Check, Trash2, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'

const MODE_COLORS = { eco: '#22c55e', sport: '#f97316', safe: '#60a5fa', balanced: '#a78bfa' }
const MODE_BG = { eco: 'rgba(34,197,94,0.12)', sport: 'rgba(249,115,22,0.12)', safe: 'rgba(96,165,250,0.12)', balanced: 'rgba(167,139,250,0.12)' }

const BIKE_TYPES = [
  { id: 'cruiser', label: 'Cruiser', emoji: '🏍️', defaultMode: 'eco' },
  { id: 'sport', label: 'Sport', emoji: '🔥', defaultMode: 'sport' },
  { id: 'standard', label: 'Standard', emoji: '⚡', defaultMode: 'balanced' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️', defaultMode: 'safe' },
]

function AddBikeModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', model: '', type: 'standard', fuelTank: 15, mileage: 35 })
  const selectedType = BIKE_TYPES.find(t => t.id === form.type)

  const handleAdd = () => {
    if (!form.name.trim()) return
    onAdd({
      ...form,
      defaultMode: selectedType?.defaultMode || 'balanced',
      emoji: selectedType?.emoji || '🏍️',
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="w-full rounded-t-3xl p-6 pb-10"
        style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-600 text-white">Add New Bike</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60">✕</button>
        </div>

        {/* Bike type */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {BIKE_TYPES.map(t => (
            <button key={t.id}
              onClick={() => setForm(f => ({ ...f, type: t.id }))}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
              style={{
                background: form.type === t.id ? 'rgba(79,142,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: form.type === t.id ? '1px solid rgba(79,142,255,0.5)' : '1px solid rgba(255,255,255,0.07)',
              }}>
              <span className="text-2xl">{t.emoji}</span>
              <span className="text-xs text-white/60">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Fields */}
        {[
          { key: 'name', label: 'Bike name', placeholder: 'Royal Enfield Classic 350' },
          { key: 'model', label: 'Year & color', placeholder: '2024 · Gunmetal Grey' },
        ].map(f => (
          <div key={f.key} className="mb-4">
            <label className="text-xs text-white/40 mb-1.5 block">{f.label}</label>
            <input
              value={form[f.key]}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 font-body"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { key: 'fuelTank', label: 'Fuel tank (L)', min: 5, max: 30 },
            { key: 'mileage', label: 'Mileage (km/L)', min: 15, max: 60 },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-white/40 mb-1.5 flex justify-between">
                <span>{f.label}</span><span className="text-white/70">{form[f.key]}</span>
              </label>
              <input type="range" min={f.min} max={f.max} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: +e.target.value }))} />
            </div>
          ))}
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={handleAdd}
          className="w-full py-4 rounded-2xl font-display font-600 text-white text-base"
          style={{ background: 'linear-gradient(135deg, #2563eb, #4f8eff)', boxShadow: '0 8px 32px rgba(37,99,235,0.4)' }}>
          Add to Garage
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default function GarageScreen() {
  const { bikes, activeBikeId, setActiveBike, removeBike, addBike, setScreen, setMode } = useStore()
  const [showAdd, setShowAdd] = useState(false)

  const handleSelect = (bike) => {
    setActiveBike(bike.id)
    setMode(bike.defaultMode)
    setScreen('map')
  }

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="absolute inset-0 z-40 flex flex-col"
      style={{ background: '#07101f' }}
    >
      {/* Header */}
      <div className="px-5 pt-14 pb-5 border-b border-white/[0.06]">
        <button onClick={() => setScreen('map')} className="flex items-center gap-2 text-white/40 mb-4 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="font-display text-2xl font-700 text-gradient">My Garage</h1>
        <p className="text-sm text-white/35 mt-1">{bikes.length} bike{bikes.length !== 1 ? 's' : ''} · tap to make active</p>
      </div>

      {/* Bike list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <AnimatePresence>
          {bikes.map((bike, i) => {
            const isActive = bike.id === activeBikeId
            const mc = MODE_COLORS[bike.defaultMode]
            const mb = MODE_BG[bike.defaultMode]

            return (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(bike)}
                className="relative rounded-2xl p-4 cursor-pointer transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(79,142,255,0.1)' : 'rgba(255,255,255,0.04)',
                  border: isActive ? '1.5px solid rgba(79,142,255,0.4)' : '1px solid rgba(255,255,255,0.07)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: mb || 'rgba(255,255,255,0.06)' }}>
                    {bike.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-600 text-white text-base truncate">{bike.name}</div>
                    <div className="text-xs text-white/40 mt-0.5">{bike.model}</div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: mc }} />
                      <span className="text-xs capitalize" style={{ color: mc }}>{bike.defaultMode} mode</span>
                      <span className="text-white/20 text-xs">·</span>
                      <span className="text-xs text-white/30">{bike.fuelTank}L tank</span>
                      <span className="text-white/20 text-xs">·</span>
                      <span className="text-xs text-white/30">{bike.mileage}km/L</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#2563eb' }}>
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    {bikes.length > 1 && (
                      <button onClick={e => { e.stopPropagation(); removeBike(bike.id) }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <Trash2 size={13} className="text-white/25 hover:text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Add bike */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAdd(true)}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-display text-sm font-500"
          style={{ border: '1.5px dashed rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.3)', background: 'transparent' }}
        >
          <Plus size={16} /> Add a new bike
        </motion.button>
      </div>

      <AnimatePresence>
        {showAdd && <AddBikeModal onClose={() => setShowAdd(false)} onAdd={addBike} />}
      </AnimatePresence>
    </motion.div>
  )
}
