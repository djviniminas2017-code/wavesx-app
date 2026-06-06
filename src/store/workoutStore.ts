'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ActiveWorkout,
  Exercise,
  WorkoutSession,
  WorkoutSet,
  Routine,
} from '@/types/workout'

function newSetId() {
  return Math.random().toString(36).slice(2, 9)
}

function calcVolume(session: Pick<ActiveWorkout, 'exercises'>): number {
  return session.exercises.reduce((total, we) => {
    return total + we.sets.reduce((s, set) => {
      if (set.completed && set.weight && set.reps) return s + set.weight * set.reps
      return s
    }, 0)
  }, 0)
}

interface WorkoutStore {
  activeWorkout: ActiveWorkout | null
  history: WorkoutSession[]
  routines: Routine[]

  startWorkout: (name?: string, routine?: Routine) => void
  cancelWorkout: () => void
  finishWorkout: () => WorkoutSession | null
  renameWorkout: (name: string) => void

  addExercise: (exercise: Exercise) => void
  removeExercise: (weId: string) => void

  addSet: (weId: string) => void
  removeSet: (weId: string, setId: string) => void
  updateSet: (weId: string, setId: string, patch: Partial<WorkoutSet>) => void
  completeSet: (weId: string, setId: string) => void

  saveRoutine: (routine: Routine) => void
  deleteRoutine: (routineId: string) => void
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      activeWorkout: null,
      history: [],
      routines: [],

      startWorkout: (name, routine) => {
        const exercises = routine
          ? routine.exercises.map((re) => ({
              id: newSetId(),
              exercise: {
                id: re.exerciseId,
                name: re.exerciseName,
                muscleGroup: 'full_body' as const,
                equipment: 'barbell' as const,
              },
              sets: Array.from({ length: re.defaultSets }, () => ({
                id: newSetId(),
                weight: re.defaultWeight,
                reps: re.defaultReps,
                completed: false,
                type: 'normal' as const,
              })),
            }))
          : []

        set({
          activeWorkout: {
            id: newSetId(),
            name: name ?? (routine?.name ?? 'Treino sem nome'),
            startedAt: new Date().toISOString(),
            exercises,
            routineId: routine?.id,
          },
        })
      },

      cancelWorkout: () => set({ activeWorkout: null }),

      finishWorkout: () => {
        const { activeWorkout, history } = get()
        if (!activeWorkout) return null

        const finishedAt = new Date().toISOString()
        const durationMinutes = Math.round(
          (new Date(finishedAt).getTime() - new Date(activeWorkout.startedAt).getTime()) / 60000
        )
        const totalVolume = calcVolume(activeWorkout)
        const totalSets = activeWorkout.exercises.reduce(
          (n, we) => n + we.sets.filter((s) => s.completed).length,
          0
        )

        const session: WorkoutSession = {
          id: activeWorkout.id,
          name: activeWorkout.name,
          startedAt: activeWorkout.startedAt,
          finishedAt,
          durationMinutes,
          exercises: activeWorkout.exercises,
          totalVolume,
          totalSets,
        }

        set({ activeWorkout: null, history: [session, ...history] })
        return session
      },

      renameWorkout: (name) =>
        set((s) => ({
          activeWorkout: s.activeWorkout ? { ...s.activeWorkout, name } : null,
        })),

      addExercise: (exercise) =>
        set((s) => {
          if (!s.activeWorkout) return s
          const weId = newSetId()
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: [
                ...s.activeWorkout.exercises,
                {
                  id: weId,
                  exercise,
                  sets: [
                    { id: newSetId(), weight: null, reps: null, completed: false, type: 'normal' },
                  ],
                },
              ],
            },
          }
        }),

      removeExercise: (weId) =>
        set((s) => {
          if (!s.activeWorkout) return s
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.filter((e) => e.id !== weId),
            },
          }
        }),

      addSet: (weId) =>
        set((s) => {
          if (!s.activeWorkout) return s
          const prevSet = s.activeWorkout.exercises.find((e) => e.id === weId)?.sets.at(-1)
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.map((e) =>
                e.id !== weId
                  ? e
                  : {
                      ...e,
                      sets: [
                        ...e.sets,
                        {
                          id: newSetId(),
                          weight: prevSet?.weight ?? null,
                          reps: prevSet?.reps ?? null,
                          completed: false,
                          type: 'normal' as const,
                        },
                      ],
                    }
              ),
            },
          }
        }),

      removeSet: (weId, setId) =>
        set((s) => {
          if (!s.activeWorkout) return s
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.map((e) =>
                e.id !== weId ? e : { ...e, sets: e.sets.filter((st) => st.id !== setId) }
              ),
            },
          }
        }),

      updateSet: (weId, setId, patch) =>
        set((s) => {
          if (!s.activeWorkout) return s
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.map((e) =>
                e.id !== weId
                  ? e
                  : {
                      ...e,
                      sets: e.sets.map((st) =>
                        st.id !== setId ? st : { ...st, ...patch }
                      ),
                    }
              ),
            },
          }
        }),

      completeSet: (weId, setId) =>
        set((s) => {
          if (!s.activeWorkout) return s
          return {
            activeWorkout: {
              ...s.activeWorkout,
              exercises: s.activeWorkout.exercises.map((e) =>
                e.id !== weId
                  ? e
                  : {
                      ...e,
                      sets: e.sets.map((st) =>
                        st.id !== setId ? st : { ...st, completed: !st.completed }
                      ),
                    }
              ),
            },
          }
        }),

      saveRoutine: (routine) =>
        set((s) => {
          const existing = s.routines.findIndex((r) => r.id === routine.id)
          if (existing >= 0) {
            const updated = [...s.routines]
            updated[existing] = routine
            return { routines: updated }
          }
          return { routines: [...s.routines, routine] }
        }),

      deleteRoutine: (routineId) =>
        set((s) => ({ routines: s.routines.filter((r) => r.id !== routineId) })),
    }),
    { name: 'waveform-workout', skipHydration: true }
  )
)
