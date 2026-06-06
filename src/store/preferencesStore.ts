'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WeightUnit } from '@/types/workout'

interface PreferencesStore {
  name: string
  weightUnit: WeightUnit
  surfLevel: string
  skateLevel: string
  setName: (name: string) => void
  setWeightUnit: (unit: WeightUnit) => void
  setSurfLevel: (level: string) => void
  setSkateLevel: (level: string) => void
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      name: 'Atleta',
      weightUnit: 'kg',
      surfLevel: 'Intermediário',
      skateLevel: 'Iniciante',
      setName: (name) => set({ name }),
      setWeightUnit: (weightUnit) => set({ weightUnit }),
      setSurfLevel: (surfLevel) => set({ surfLevel }),
      setSkateLevel: (skateLevel) => set({ skateLevel }),
    }),
    { name: 'waveform-prefs', skipHydration: true }
  )
)
