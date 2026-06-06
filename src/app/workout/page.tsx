'use client'

import { useState } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { usePreferencesStore } from '@/store/preferencesStore'
import ExerciseBlock from '@/components/workout/ExerciseBlock'
import ExercisePicker from '@/components/workout/ExercisePicker'
import WorkoutTimer from '@/components/workout/WorkoutTimer'
import RestTimer from '@/components/workout/RestTimer'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Exercise, WorkoutSet } from '@/types/workout'

// ── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ onStart }: { onStart: () => void }) {
  const { routines, startWorkout } = useWorkoutStore()

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-11 pb-5 fade-up">
        <h1 className="font-syne font-extrabold text-2xl text-t1">Treino</h1>
        <p className="text-t3 text-sm mt-1">Comece rápido ou use uma rotina</p>
      </div>

      {/* Big CTA */}
      <div className="px-5 fade-up-1">
        <button
          onClick={onStart}
          className="relative w-full py-5 rounded-2xl font-syne font-bold text-base text-bg flex items-center justify-center gap-2 overflow-hidden transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #06D6E8 0%, #00AACC 100%)',
            boxShadow: '0 8px 28px rgba(6,214,232,0.45), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          {/* shimmer overlay */}
          <span className="absolute inset-0 shimmer opacity-40" />
          <span className="relative text-xl" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' }}>🏋️</span>
          <span className="relative">Treino rápido</span>
        </button>
      </div>

      {/* Routines */}
      {routines.length > 0 && (
        <div className="px-5 mt-6 fade-up-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-t3 uppercase tracking-widest font-semibold">Minhas rotinas</p>
            <Link href="/routines" className="text-xs text-cyan font-semibold">Gerenciar →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {routines.map((r) => (
              <button
                key={r.id}
                onClick={() => startWorkout(r.name, r)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all active:scale-[0.98] group"
                style={{
                  background: 'linear-gradient(145deg, #161F34, #111827)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: 'linear-gradient(145deg, rgba(6,214,232,0.15), rgba(6,214,232,0.05))',
                    border: '1px solid rgba(6,214,232,0.2)',
                  }}
                >
                  ⚡
                </div>
                <div className="flex-1">
                  <p className="font-syne font-bold text-sm text-t1">{r.name}</p>
                  <p className="text-xs text-t3 mt-0.5">{r.exercises.length} exercícios</p>
                </div>
                <span className="text-cyan text-sm transition-transform group-active:translate-x-1">▶</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {routines.length === 0 && (
        <div className="px-5 mt-3 fade-up-2">
          <Link
            href="/routines"
            className="flex items-center justify-center w-full py-3.5 rounded-2xl text-cyan text-sm font-semibold gap-2 transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(6,214,232,0.06)',
              border: '1px dashed rgba(6,214,232,0.25)',
            }}
          >
            + Criar rotina personalizada
          </Link>
        </div>
      )}

      <RecentHistory />
    </div>
  )
}

// ── Recent History ─────────────────────────────────────────────────────────

function RecentHistory() {
  const { history } = useWorkoutStore()
  const recent = history.slice(0, 5)
  if (recent.length === 0) return null

  return (
    <div className="px-5 mt-6 fade-up-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] text-t3 uppercase tracking-widest font-semibold">Histórico recente</p>
        <Link href="/history" className="text-xs text-cyan font-semibold">Ver todos →</Link>
      </div>
      <div className="flex flex-col gap-2">
        {recent.map((s, i) => (
          <div
            key={s.id}
            className="rounded-2xl px-4 py-3.5 transition-all"
            style={{
              background: 'linear-gradient(145deg, #161F34, #111827)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              animationDelay: `${i * 40}ms`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-syne font-semibold text-sm text-t1">{s.name}</p>
                <p className="text-xs text-t3 mt-0.5">
                  {format(parseISO(s.startedAt), 'EEE dd MMM · HH:mm', { locale: ptBR })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm" style={{ color: '#06D6E8', textShadow: '0 0 8px rgba(6,214,232,0.4)' }}>
                  {s.durationMinutes}min
                </p>
                <p className="text-xs text-t3">{Math.round(s.totalVolume)} kg</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Active Workout ─────────────────────────────────────────────────────────

function useRestSeconds() {
  const [v, setV] = useState(60)
  useEffect(() => {
    const s = localStorage.getItem('wsx-rest-seconds')
    if (s) setV(Number(s))
  }, [])
  const save = (n: number) => { setV(n); localStorage.setItem('wsx-rest-seconds', String(n)) }
  return [v, save] as const
}

function ActiveWorkoutView() {
  const {
    activeWorkout, cancelWorkout, finishWorkout, renameWorkout,
    addExercise, removeExercise, addSet, removeSet, updateSet, completeSet,
  } = useWorkoutStore()
  const { weightUnit } = usePreferencesStore()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [restActive, setRestActive] = useState(false)
  const [restKey, setRestKey] = useState(0)
  const [restSeconds, setRestSeconds] = useRestSeconds()

  if (!activeWorkout) return null

  const totalCompleted = activeWorkout.exercises.reduce(
    (n, we) => n + we.sets.filter((s) => s.completed).length, 0
  )
  const totalSets = activeWorkout.exercises.reduce((n, we) => n + we.sets.length, 0)
  const pct = totalSets > 0 ? (totalCompleted / totalSets) * 100 : 0

  const handleFinish = () => {
    if (totalCompleted === 0 && !confirm('Nenhuma série concluída. Finalizar mesmo assim?')) return
    finishWorkout()
  }

  const handleCompleteSet = (weId: string, setId: string) => {
    const we = activeWorkout.exercises.find(w => w.id === weId)
    const set = we?.sets.find(s => s.id === setId)
    const wasCompleted = set?.completed ?? false
    completeSet(weId, setId)
    if (!wasCompleted) {
      setRestActive(true)
      setRestKey(k => k + 1)
    }
  }

  return (
    <>
      {/* Sticky header */}
      <div
        className="sticky top-0 z-40 px-4 py-3"
        style={{
          background: 'rgba(8,11,20,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          {editingName ? (
            <input
              className="bg-transparent font-syne font-bold text-t1 text-lg outline-none border-b border-cyan flex-1 mr-4"
              value={activeWorkout.name}
              onChange={(e) => renameWorkout(e.target.value)}
              onBlur={() => setEditingName(false)}
              autoFocus
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="font-syne font-bold text-t1 text-lg text-left flex-1 mr-4 truncate"
            >
              {activeWorkout.name}
            </button>
          )}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="px-3 py-1 rounded-xl font-mono text-sm font-bold"
              style={{
                background: 'rgba(6,214,232,0.1)',
                border: '1px solid rgba(6,214,232,0.2)',
                color: '#06D6E8',
                textShadow: '0 0 8px rgba(6,214,232,0.5)',
              }}
            >
              <WorkoutTimer startedAt={activeWorkout.startedAt} />
            </div>
            <button
              onClick={() => { if (confirm('Cancelar treino?')) cancelWorkout() }}
              className="text-t3 hover:text-coral text-xs px-2 py-1 rounded-lg hover:bg-coral/10 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct === 100
                  ? 'linear-gradient(90deg, #22D68A, #16B870)'
                  : 'linear-gradient(90deg, #06D6E8, #00AACC)',
                boxShadow: pct > 0 ? '0 0 8px rgba(6,214,232,0.6)' : 'none',
              }}
            />
          </div>
          <span className="text-xs text-t3 font-mono">{totalCompleted}/{totalSets}</span>
        </div>
      </div>

      {/* Exercises */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {activeWorkout.exercises.length === 0 && (
          <div className="text-center py-12 text-t3">
            <p className="text-5xl mb-4" style={{ filter: 'drop-shadow(0 0 16px rgba(6,214,232,0.3))' }}>🏋️</p>
            <p className="text-sm font-semibold text-t2">Adicione o primeiro exercício</p>
            <p className="text-xs mt-1">Toque em + abaixo para começar</p>
          </div>
        )}

        {activeWorkout.exercises.map((we) => (
          <ExerciseBlock
            key={we.id}
            we={we}
            unit={weightUnit}
            onAddSet={addSet}
            onRemoveSet={removeSet}
            onUpdateSet={(weId, setId, patch) => updateSet(weId, setId, patch as Partial<WorkoutSet>)}
            onCompleteSet={handleCompleteSet}
            onRemoveExercise={removeExercise}
          />
        ))}

        {/* Add exercise */}
        <button
          onClick={() => setPickerOpen(true)}
          className="w-full py-3.5 rounded-2xl text-cyan text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background: 'rgba(6,214,232,0.05)',
            border: '1px dashed rgba(6,214,232,0.25)',
          }}
        >
          + Adicionar exercício
        </button>

        {/* Finish */}
        <button
          onClick={handleFinish}
          className="w-full py-4 rounded-2xl font-syne font-bold text-base text-bg flex items-center justify-center gap-2 mt-1 transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #22D68A, #16B870)',
            boxShadow: '0 6px 24px rgba(34,214,138,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
        >
          ✓ Finalizar treino
        </button>
      </div>

      {pickerOpen && (
        <ExercisePicker
          onSelect={(ex: Exercise) => addExercise(ex)}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {restActive && (
        <RestTimer
          key={restKey}
          defaultSeconds={restSeconds}
          onDismiss={() => setRestActive(false)}
          onChangeDefault={setRestSeconds}
        />
      )}
    </>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function WorkoutPage() {
  const { activeWorkout, startWorkout } = useWorkoutStore()
  if (activeWorkout) return <ActiveWorkoutView />
  return <EmptyState onStart={() => startWorkout()} />
}
