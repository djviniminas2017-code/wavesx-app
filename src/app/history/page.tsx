'use client'

import { useState } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { format, parseISO, isThisWeek, isThisMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

const MUSCLE_EMOJI: Record<string, string> = {
  chest: '🫁', back: '🔙', shoulders: '🏔️', biceps: '💪',
  triceps: '💪', legs: '🦵', glutes: '🍑', core: '🎯',
  cardio: '🏃', full_body: '⚡',
}

export default function HistoryPage() {
  const { history } = useWorkoutStore()
  const [expanded, setExpanded] = useState<string | null>(null)

  const thisWeek = history.filter((s) => isThisWeek(parseISO(s.startedAt), { weekStartsOn: 1 }))
  const thisMonth = history.filter((s) => isThisMonth(parseISO(s.startedAt)))

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-10 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-syne font-extrabold text-2xl text-t1">Histórico</h1>
          <p className="text-t2 text-sm mt-1">
            {history.length} sessão{history.length !== 1 ? 'ões' : ''} registrada{history.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/progress" className="text-xs text-cyan font-semibold">
          📈 Progresso
        </Link>
      </div>

      {/* Stats summary */}
      <div className="px-5 grid grid-cols-3 gap-2 mb-4">
        <div className="bg-card border border-white/[0.07] rounded-2xl p-3 text-center">
          <p className="font-mono font-bold text-xl text-cyan">{thisWeek.length}</p>
          <p className="text-[10px] text-t3 uppercase tracking-widest mt-1">Esta sem.</p>
        </div>
        <div className="bg-card border border-white/[0.07] rounded-2xl p-3 text-center">
          <p className="font-mono font-bold text-xl text-gold">{thisMonth.length}</p>
          <p className="text-[10px] text-t3 uppercase tracking-widest mt-1">Este mês</p>
        </div>
        <div className="bg-card border border-white/[0.07] rounded-2xl p-3 text-center">
          <p className="font-mono font-bold text-xl text-t1">{history.length}</p>
          <p className="text-[10px] text-t3 uppercase tracking-widest mt-1">Total</p>
        </div>
      </div>

      {/* Session list */}
      <div className="px-5 flex flex-col gap-2">
        {history.length === 0 && (
          <div className="bg-card border border-white/[0.07] rounded-2xl p-10 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-t2 text-sm">Nenhum treino registrado ainda</p>
            <p className="text-t3 text-xs mt-1">Complete seu primeiro treino para ver aqui</p>
            <Link href="/workout" className="inline-block mt-4 px-4 py-2 bg-cyan text-bg rounded-xl font-syne font-bold text-sm">
              Iniciar treino
            </Link>
          </div>
        )}

        {history.map((s) => {
          const isExp = expanded === s.id
          const totalVol = Math.round(s.totalVolume)
          const muscleGroups = Array.from(new Set(s.exercises.map((e) => e.exercise.muscleGroup)))

          return (
            <div
              key={s.id}
              className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden"
            >
              <button
                className="w-full px-4 py-3 text-left"
                onClick={() => setExpanded(isExp ? null : s.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-t1 truncate">{s.name}</p>
                    <p className="text-xs text-t3 mt-0.5">
                      {format(parseISO(s.startedAt), "EEE, dd MMM · HH:mm", { locale: ptBR })}
                    </p>
                    <div className="flex gap-1 mt-1.5">
                      {muscleGroups.slice(0, 4).map((m) => (
                        <span key={m} className="text-xs">{MUSCLE_EMOJI[m]}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="font-mono font-bold text-sm text-t1">{s.durationMinutes}min</p>
                    <p className="text-xs text-t3">{totalVol > 0 ? `${totalVol} kg` : '—'}</p>
                    <p className="text-xs text-cyan mt-0.5">{s.totalSets} séries</p>
                  </div>
                </div>
                <div className="flex justify-end mt-1">
                  <span className="text-t3 text-xs">{isExp ? '▲' : '▼'}</span>
                </div>
              </button>

              {isExp && (
                <div className="border-t border-white/[0.07] px-4 pb-4 pt-3">
                  <div className="flex flex-col gap-2">
                    {s.exercises.map((we) => {
                      const maxSet = we.sets
                        .filter((st) => st.completed && st.weight && st.reps)
                        .sort((a, b) => (b.weight ?? 0) * (b.reps ?? 0) - (a.weight ?? 0) * (a.reps ?? 0))[0]
                      const completedCount = we.sets.filter((st) => st.completed).length

                      return (
                        <div key={we.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                          <div>
                            <p className="text-sm font-medium text-t1">{we.exercise.name}</p>
                            <p className="text-xs text-t3">{completedCount} série{completedCount !== 1 ? 's' : ''}</p>
                          </div>
                          {maxSet && (
                            <p className="font-mono text-xs text-t2">
                              {maxSet.weight}kg × {maxSet.reps}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
