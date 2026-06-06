'use client'

import { useState } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { usePreferencesStore } from '@/store/preferencesStore'
import dynamic from 'next/dynamic'

const VolumeChart = dynamic(() => import('@/components/charts/VolumeChart'), { ssr: false })
const StrengthChart = dynamic(() => import('@/components/charts/StrengthChart'), { ssr: false })
const FrequencyChart = dynamic(() => import('@/components/charts/FrequencyChart'), { ssr: false })
const MuscleGroupChart = dynamic(() => import('@/components/charts/MuscleGroupChart'), { ssr: false })

export default function ProgressPage() {
  const { history } = useWorkoutStore()
  const { weightUnit } = usePreferencesStore()

  const allExerciseNames = Array.from(
    new Set(history.flatMap((s) => s.exercises.map((e) => e.exercise.name)))
  ).sort()

  const [selectedExercise, setSelectedExercise] = useState(allExerciseNames[0] ?? '')

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
        <p className="text-5xl mb-4">📈</p>
        <h1 className="font-syne font-bold text-t1 text-xl mb-2">Sem dados ainda</h1>
        <p className="text-t2 text-sm">Complete pelo menos um treino para ver seus gráficos de evolução.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-10 pb-4">
        <h1 className="font-syne font-extrabold text-2xl text-t1">Progresso</h1>
        <p className="text-t2 text-sm mt-1">Baseado em {history.length} treino{history.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Volume chart */}
      <div className="mx-5 bg-card border border-white/[0.07] rounded-2xl p-4 mb-3">
        <h2 className="font-syne font-bold text-t1 text-sm mb-3">Volume por treino (kg)</h2>
        <VolumeChart sessions={history} />
      </div>

      {/* Frequency chart */}
      <div className="mx-5 bg-card border border-white/[0.07] rounded-2xl p-4 mb-3">
        <h2 className="font-syne font-bold text-t1 text-sm mb-3">Treinos por semana</h2>
        <FrequencyChart sessions={history} />
      </div>

      {/* Strength chart */}
      <div className="mx-5 bg-card border border-white/[0.07] rounded-2xl p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-syne font-bold text-t1 text-sm">Evolução de força</h2>
        </div>
        {allExerciseNames.length > 0 ? (
          <>
            <select
              className="w-full bg-card2 border border-white/[0.07] rounded-xl px-3 py-2 text-t1 text-sm outline-none mb-3 focus:border-cyan"
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              {allExerciseNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <StrengthChart
              sessions={history}
              exerciseName={selectedExercise}
              unit={weightUnit}
            />
          </>
        ) : (
          <p className="text-t3 text-sm text-center py-4">Nenhum exercício com dados</p>
        )}
      </div>

      {/* Muscle group distribution */}
      <div className="mx-5 bg-card border border-white/[0.07] rounded-2xl p-4 mb-3">
        <h2 className="font-syne font-bold text-t1 text-sm mb-3">Grupos musculares treinados</h2>
        <MuscleGroupChart sessions={history} />
      </div>

      {/* Personal records */}
      <div className="mx-5 bg-card border border-white/[0.07] rounded-2xl p-4 mb-3">
        <h2 className="font-syne font-bold text-t1 text-sm mb-3">Records pessoais (PRs)</h2>
        <div className="flex flex-col gap-2">
          {allExerciseNames.slice(0, 8).map((name) => {
            const allSets = history
              .flatMap((s) => s.exercises.filter((e) => e.exercise.name === name))
              .flatMap((we) => we.sets.filter((st) => st.completed && st.weight && st.reps))
            if (allSets.length === 0) return null
            const pr = allSets.reduce((best, st) =>
              (st.weight ?? 0) > (best.weight ?? 0) ? st : best
            )
            return (
              <div key={name} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <p className="text-sm text-t1 truncate flex-1 mr-3">{name}</p>
                <p className="font-mono font-bold text-sm text-gold">
                  {pr.weight}{weightUnit} × {pr.reps}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
