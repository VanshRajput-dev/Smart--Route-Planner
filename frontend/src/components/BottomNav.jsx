import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

const TABS = [
  { id: 'map', label: 'Map', icon: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#4f8eff' : 'rgba(255,255,255,0.35)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  )},
  { id: 'garage', label: 'Garage', icon: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#4f8eff' : 'rgba(255,255,255,0.35)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2"/>
      <circle cx="9" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
      <path d="M13 6h-3v4h4l-1-4z"/>
    </svg>
  )},
  { id: 'history', label: 'History', icon: ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#4f8eff' : 'rgba(255,255,255,0.35)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )},
]

export default function BottomNav() {
  const { activeScreen, setScreen } = useStore()

  // Hide nav on overlay screens
  if (['garage', 'history', 'result'].includes(activeScreen)) return null

  return (
    <motion.div
      initial={{ y: 100 }} animate={{ y: 0 }}
      className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-6"
    >
      <div className="glass rounded-2xl px-2 py-3 flex justify-around"
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.5)' }}>
        {TABS.map(tab => {
          const active = activeScreen === tab.id
          return (
            <button key={tab.id}
              onClick={() => setScreen(tab.id)}
              className="flex flex-col items-center gap-1.5 px-6 py-1 relative"
            >
              <tab.icon active={active} />
              <span className="text-[10px] font-display font-500 transition-colors"
                style={{ color: active ? '#4f8eff' : 'rgba(255,255,255,0.3)' }}>
                {tab.label}
              </span>
              {active && (
                <motion.div layoutId="tab-indicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-500" />
              )}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
