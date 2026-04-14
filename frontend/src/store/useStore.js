import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const BIKES = [
  { id: 1, name: 'Royal Enfield Meteor 350', model: '2023 · Fireball Red', type: 'cruiser', defaultMode: 'eco', emoji: '🏍️', fuelTank: 15, mileage: 35 },
  { id: 2, name: 'KTM Duke 390', model: '2022 · Orange', type: 'sport', defaultMode: 'sport', emoji: '🔥', fuelTank: 13.4, mileage: 28 },
  { id: 3, name: 'Honda CB350', model: '2024 · Pearl Blue', type: 'standard', defaultMode: 'balanced', emoji: '⚡', fuelTank: 15, mileage: 40 },
]

export const useStore = create(
  persist(
    (set, get) => ({
      // Navigation
      activeScreen: 'map',
      setScreen: (screen) => set({ activeScreen: screen }),

      // Bikes
      bikes: BIKES,
      activeBikeId: 1,
      setActiveBike: (id) => {
        const bike = get().bikes.find(b => b.id === id)
        if (bike) set({ activeBikeId: id, activeMode: bike.defaultMode })
      },
      addBike: (bike) => set(s => ({ bikes: [...s.bikes, { ...bike, id: Date.now() }] })),
      removeBike: (id) => set(s => ({ bikes: s.bikes.filter(b => b.id !== id) })),
      getActiveBike: () => {
        const { bikes, activeBikeId } = get()
        return bikes.find(b => b.id === activeBikeId) || bikes[0]
      },

      // Routing
      activeMode: 'eco',
      setMode: (mode) => set({ activeMode: mode }),
      origin: null,
      destination: null,
      setOrigin: (origin) => set({ origin }),
      setDestination: (dest) => set({ destination: dest }),
      originText: '',
      destText: '',
      setOriginText: (t) => set({ originText: t }),
      setDestText: (t) => set({ destText: t }),

      // Route result
      routeResult: null,
      setRouteResult: (r) => set({ routeResult: r }),
      isCalculating: false,
      setCalculating: (v) => set({ isCalculating: v }),

      // History
      routeHistory: [],
      saveToHistory: (route) => set(s => ({
        routeHistory: [{ ...route, savedAt: new Date().toISOString(), id: Date.now() }, ...s.routeHistory].slice(0, 20)
      })),
    }),
    { name: 'motoroute-storage', partialize: (s) => ({ bikes: s.bikes, activeBikeId: s.activeBikeId, routeHistory: s.routeHistory }) }
  )
)
