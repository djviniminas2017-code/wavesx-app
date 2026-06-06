'use client'

import { useState } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { useExerciseStore } from '@/store/exerciseStore'
import { useRouter } from 'next/navigation'
import type { Routine, RoutineExercise } from '@/types/workout'

function newId() {
  return Math.random().toString(36).slice(2, 9)
}

function RoutineEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Routine
  onSave: (r: Routine) => void
  onCancel: () => void
}) {
  const { exercises } = useExerciseStore()
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [items, setItems] = useState<RoutineExercise[]>(initial?.exercises ?? [])

  const addExercise = (exerciseId: string) => {
    const ex = exercises.find((e) => e.id === exerciseId)
    if (!ex) return
    setItems((prev) => [
      ...prev,
      { exerciseId: ex.id, exerciseName: ex.name, defaultSets: 3, defaultReps: 10, defaultWeight: null },
    ])
  }

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateItem = (idx: number, patch: Partial<RoutineExercise>) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)))
  }

  const handleSave = () => {
    if (!name.trim()) return alert('Dê um nome para a rotina')
    onSave({
      id: initial?.id ?? newId(),
      name: name.trim(),
      description: description.trim() || undefined,
      exercises: items,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    })
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-6 pb-3 flex items-center gap-3">
        <button onClick={onCancel} className="text-t2 hover:text-t1 text-xl">←</button>
        <h1 className="font-syne font-bold text-t1 text-xl">
          {initial ? 'Editar rotina' : 'Nova rotina'}
        </h1>
      </div>

      <div className="px-5 flex flex-col gap-3">
        <div>
          <label className="text-xs font-semibold text-t2 uppercase tracking-widest mb-1 block">Nome</label>
          <input
            className="w-full bg-card border border-white/[0.07] rounded-xl px-4 py-3 text-t1 text-sm outline-none focus:border-cyan"
            placeholder="Ex: Push Day A"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-t2 uppercase tracking-widest mb-1 block">Descrição (opcional)</label>
          <input
            className="w-full bg-card border border-white/[0.07] rounded-xl px-4 py-3 text-t1 text-sm outline-none focus:border-cyan"
            placeholder="Peito, ombro, tríceps..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-t2 uppercase tracking-widest mb-2 block">Exercícios</label>
          <div className="flex flex-col gap-2">
            {items.map((item, idx) => (
              <div key={idx} className="bg-card border border-white/[0.07] rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-t1">{item.exerciseName}</p>
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-t3 hover:text-coral text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-t3 uppercase tracking-widest">Séries</label>
                    <input
                      className="w-full bg-card2 border border-white/[0.07] rounded-lg px-2 py-1.5 text-t1 text-sm text-center font-mono outline-none focus:border-cyan"
                      type="number" min="1" max="20"
                      value={item.defaultSets}
                      onChange={(e) => updateItem(idx, { defaultSets: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-t3 uppercase tracking-widest">Reps</label>
                    <input
                      className="w-full bg-card2 border border-white/[0.07] rounded-lg px-2 py-1.5 text-t1 text-sm text-center font-mono outline-none focus:border-cyan"
                      type="number" min="1"
                      value={item.defaultReps ?? ''}
                      onChange={(e) => updateItem(idx, { defaultReps: e.target.value ? Number(e.target.value) : null })}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-t3 uppercase tracking-widest">Carga</label>
                    <input
                      className="w-full bg-card2 border border-white/[0.07] rounded-lg px-2 py-1.5 text-t1 text-sm text-center font-mono outline-none focus:border-cyan"
                      type="number" min="0"
                      value={item.defaultWeight ?? ''}
                      onChange={(e) => updateItem(idx, { defaultWeight: e.target.value ? Number(e.target.value) : null })}
                    />
                  </div>
                </div>
              </div>
            ))}

            <select
              className="w-full bg-card border border-dashed border-white/20 rounded-xl px-4 py-3 text-t2 text-sm outline-none focus:border-cyan"
              defaultValue=""
              onChange={(e) => { addExercise(e.target.value); e.target.value = '' }}
            >
              <option value="" disabled>+ Adicionar exercício</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-cyan text-bg rounded-2xl font-syne font-bold text-base mt-2"
        >
          Salvar rotina
        </button>
      </div>
    </div>
  )
}

export default function RoutinesPage() {
  const { routines, saveRoutine, deleteRoutine, startWorkout } = useWorkoutStore()
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Routine | null>(null)

  if (creating || editing) {
    return (
      <RoutineEditor
        initial={editing ?? undefined}
        onSave={(r) => {
          saveRoutine(r)
          setCreating(false)
          setEditing(null)
        }}
        onCancel={() => { setCreating(false); setEditing(null) }}
      />
    )
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-10 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-syne font-extrabold text-2xl text-t1">Rotinas</h1>
          <p className="text-t2 text-sm mt-1">{routines.length} rotina{routines.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-cyan text-bg rounded-xl font-syne font-bold text-sm"
        >
          + Nova
        </button>
      </div>

      <div className="px-5 flex flex-col gap-2">
        {routines.length === 0 && (
          <div className="bg-card border border-white/[0.07] rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-t2 text-sm">Nenhuma rotina criada ainda</p>
            <p className="text-t3 text-xs mt-1">Crie rotinas para iniciar treinos rapidamente</p>
          </div>
        )}

        {routines.map((r) => (
          <div key={r.id} className="bg-card border border-white/[0.07] rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-syne font-bold text-t1 text-base">{r.name}</p>
                {r.description && <p className="text-t3 text-xs mt-0.5">{r.description}</p>}
                <p className="text-t3 text-xs mt-1">{r.exercises.length} exercício{r.exercises.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-3">
              {r.exercises.slice(0, 3).map((re, i) => (
                <p key={i} className="text-xs text-t2">· {re.exerciseName} — {re.defaultSets}×{re.defaultReps ?? '?'}</p>
              ))}
              {r.exercises.length > 3 && (
                <p className="text-xs text-t3">+ {r.exercises.length - 3} mais</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { startWorkout(r.name, r); router.push('/workout') }}
                className="flex-1 py-2.5 bg-cyan text-bg rounded-xl font-syne font-bold text-sm"
              >
                ▶ Iniciar
              </button>
              <button
                onClick={() => setEditing(r)}
                className="px-4 py-2.5 bg-card2 border border-white/[0.07] rounded-xl text-t2 text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => { if (confirm('Deletar rotina?')) deleteRoutine(r.id) }}
                className="px-3 py-2.5 bg-card2 border border-white/[0.07] rounded-xl text-coral text-sm hover:bg-coral/10 transition-all"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
