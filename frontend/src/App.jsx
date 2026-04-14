import { AnimatePresence } from 'framer-motion'
import { useStore } from './store/useStore'
import MapView from './components/MapView'
import SearchPanel from './components/SearchPanel'
import ResultSheet from './components/ResultSheet'
import GarageScreen from './components/GarageScreen'
import HistoryScreen from './components/HistoryScreen'
import BottomNav from './components/BottomNav'

export default function App() {
  const { activeScreen } = useStore()
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#050810' }}>
      <MapView />
      {activeScreen === 'map' && <SearchPanel />}
      <AnimatePresence>
        {activeScreen === 'result' && <ResultSheet key="result" />}
      </AnimatePresence>
      <AnimatePresence>
        {activeScreen === 'garage' && <GarageScreen key="garage" />}
        {activeScreen === 'history' && <HistoryScreen key="history" />}
      </AnimatePresence>
      <BottomNav />
    </div>
  )
}
