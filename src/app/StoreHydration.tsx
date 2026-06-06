'use client'

import { useEffect } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { useExerciseStore } from '@/store/exerciseStore'
import { usePreferencesStore } from '@/store/preferencesStore'
import { useUserStore } from '@/store/userStore'

export default function StoreHydration() {
  useEffect(() => {
    useWorkoutStore.persist.rehydrate()
    useExerciseStore.persist.rehydrate()
    usePreferencesStore.persist.rehydrate()
    useUserStore.persist.rehydrate()
  }, [])

  return null
}
