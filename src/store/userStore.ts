'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Gender = 'M' | 'F'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type FitnessGoal = 'cutting' | 'maintain' | 'bulking'
export type Plan = 'free' | 'premium'

export interface MacroGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface UserStore {
  // Auth
  email: string
  isLoggedIn: boolean

  // Body data
  height: number   // cm
  weight: number   // kg
  age: number
  gender: Gender | null
  activityLevel: ActivityLevel
  fitnessGoal: FitnessGoal

  // Subscription
  plan: Plan
  promoCode: string   // internal — set once when unlocking

  // Actions
  login: (email: string) => void
  logout: () => void
  setBodyData: (data: Partial<Pick<UserStore, 'height' | 'weight' | 'age' | 'gender' | 'activityLevel' | 'fitnessGoal'>>) => void
  setPlan: (plan: Plan) => void
  setPromoCode: (code: string) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      email: '',
      isLoggedIn: false,
      height: 0,
      weight: 0,
      age: 0,
      gender: null,
      activityLevel: 'moderate',
      fitnessGoal: 'maintain',
      plan: 'free',
      promoCode: '',

      login: (email) => set({ email, isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
      setBodyData: (data) => set((s) => ({ ...s, ...data })),
      setPlan: (plan) => set({ plan }),
      setPromoCode: (code) => set({ promoCode: code }),
    }),
    { name: 'wsx-user', skipHydration: true }
  )
)

// ── Macro calculator ──────────────────────────────────────────────────────────

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export function calculateMacros(
  weight: number,
  height: number,
  age: number,
  gender: Gender | null,
  activityLevel: ActivityLevel,
  goal: FitnessGoal,
): MacroGoals | null {
  if (!weight || !height || !age || !gender) return null

  const bmr = gender === 'M'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161

  let tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel]
  if (goal === 'cutting') tdee -= 400
  else if (goal === 'bulking') tdee += 400

  const protein = Math.round(weight * 2.2)
  const fat = Math.round((tdee * 0.25) / 9)
  const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4)

  return {
    calories: Math.round(tdee),
    protein,
    carbs: Math.max(carbs, 50),
    fat,
  }
}

export const PROMO_CODES: Record<string, Plan> = {
  'WAVEPRO': 'premium',
  'WAVESURF': 'premium',
}
