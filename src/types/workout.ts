export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'glutes'
  | 'core'
  | 'cardio'
  | 'full_body'
  | 'mobility'

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'resistance_band'
  | 'other'

export type SetType = 'normal' | 'warmup' | 'dropset' | 'failure'

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  instructions?: string
}

export interface WorkoutSet {
  id: string
  weight: number | null
  reps: number | null
  completed: boolean
  type: SetType
}

export interface WorkoutExercise {
  id: string
  exercise: Exercise
  sets: WorkoutSet[]
  notes?: string
}

export interface ActiveWorkout {
  id: string
  name: string
  startedAt: string
  exercises: WorkoutExercise[]
  routineId?: string
}

export interface WorkoutSession {
  id: string
  name: string
  startedAt: string
  finishedAt: string
  durationMinutes: number
  exercises: WorkoutExercise[]
  totalVolume: number
  totalSets: number
  notes?: string
}

export interface RoutineExercise {
  exerciseId: string
  exerciseName: string
  defaultSets: number
  defaultReps: number | null
  defaultWeight: number | null
}

export interface Routine {
  id: string
  name: string
  description?: string
  exercises: RoutineExercise[]
  createdAt: string
}

export type WeightUnit = 'kg' | 'lbs'
