'use client'

import { useEffect, useState } from 'react'
import { useExerciseStore } from '@/store/exerciseStore'
import type { Exercise, MuscleGroup, Equipment } from '@/types/workout'

const MUSCLE_LABELS: Record<string, string> = {
  all: 'Todos',
  chest: 'Peito',
  back: 'Costas',
  shoulders: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  legs: 'Pernas',
  glutes: 'Glúteos',
  core: 'Core',
  cardio: 'Cardio',
  full_body: 'Corpo Todo',
  mobility: '🌊 Mobilidade',
}

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: 'Barra', dumbbell: 'Haltere', cable: 'Cabo',
  machine: 'Máquina', bodyweight: 'Peso Corporal',
  kettlebell: 'Kettlebell', resistance_band: 'Elástico', other: 'Outro',
}

function uid() { return Math.random().toString(36).slice(2) }

interface ExercisePickerProps {
  onSelect: (ex: Exercise) => void
  onClose: () => void
}

export default function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const { search, filterMuscle, setSearch, setFilter, getFiltered, addCustomExercise } = useExerciseStore()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', muscleGroup: 'chest' as MuscleGroup, equipment: 'bodyweight' as Equipment })

  useEffect(() => {
    setExercises(getFiltered())
  }, [search, filterMuscle, getFiltered])

  const saveCustom = () => {
    if (!form.name.trim()) return
    const ex: Exercise = { id: `custom-${uid()}`, name: form.name.trim(), muscleGroup: form.muscleGroup, equipment: form.equipment }
    addCustomExercise(ex)
    onSelect(ex)
    onClose()
  }

  if (creating) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex flex-col max-w-md mx-auto left-1/2 -translate-x-1/2">
        <div className="bg-[#0D111C] flex flex-col h-full">
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.07]">
            <button onClick={() => setCreating(false)} className="text-t3 hover:text-cyan text-sm">← Voltar</button>
            <h2 className="font-syne font-bold text-t1 flex-1">Criar exercício</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="text-[10px] text-t3 uppercase tracking-widest mb-1.5 block">Nome do exercício</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Rotação de ombro no cabo"
                className="w-full bg-bg/60 border border-white/[0.07] rounded-xl px-3 py-3 text-sm text-t1 outline-none focus:border-cyan placeholder:text-t3"
                autoFocus
              />
            </div>

            {/* Muscle group */}
            <div>
              <label className="text-[10px] text-t3 uppercase tracking-widest mb-2 block">Grupo muscular</label>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(MUSCLE_LABELS).filter(([k]) => k !== 'all') as [MuscleGroup, string][]).map(([k, l]) => (
                  <button key={k} onClick={() => setForm(f => ({ ...f, muscleGroup: k }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.muscleGroup === k ? 'bg-cyan text-bg' : 'bg-card2 border border-white/[0.07] text-t2'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="text-[10px] text-t3 uppercase tracking-widest mb-2 block">Equipamento</label>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(EQUIPMENT_LABELS) as [Equipment, string][]).map(([k, l]) => (
                  <button key={k} onClick={() => setForm(f => ({ ...f, equipment: k }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.equipment === k ? 'bg-cyan text-bg' : 'bg-card2 border border-white/[0.07] text-t2'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={saveCustom}
              className="w-full py-3.5 rounded-xl font-syne font-bold text-sm text-bg mt-auto"
              style={{ background: 'linear-gradient(135deg, #06D6E8, #00AACC)' }}>
              Criar e adicionar ao treino
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex flex-col max-w-md mx-auto left-1/2 -translate-x-1/2">
      <div className="bg-[#0D111C] flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.07]">
          <h2 className="font-syne font-bold text-t1 text-lg">Adicionar Exercício</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setCreating(true)}
              className="text-xs text-cyan font-semibold px-3 py-1.5 rounded-lg bg-cyan/10 border border-cyan/20 hover:bg-cyan/20 transition-all">
              + Criar novo
            </button>
            <button onClick={onClose} className="text-t2 hover:text-t1 text-xl transition-colors">✕</button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pt-3">
          <input
            className="w-full bg-card border border-white/[0.07] rounded-xl px-4 py-3 text-t1 text-sm outline-none focus:border-cyan placeholder:text-t3 transition-colors"
            placeholder="Buscar exercício..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Muscle filter chips */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
          {Object.entries(MUSCLE_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key as MuscleGroup | 'all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filterMuscle === key
                  ? 'bg-cyan/10 border-cyan text-cyan'
                  : 'bg-transparent border-white/[0.07] text-t2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 flex flex-col gap-2">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="flex items-center gap-2 bg-card border border-white/[0.07] rounded-xl px-3 py-3 hover:border-cyan/30 hover:bg-card2 transition-all"
            >
              <button
                className="flex-1 flex items-center gap-3 text-left min-w-0"
                onClick={() => { onSelect(ex); onClose() }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-t1 truncate">{ex.name}</div>
                  <div className="text-xs text-t3 mt-0.5">
                    {MUSCLE_LABELS[ex.muscleGroup] ?? ex.muscleGroup} · {EQUIPMENT_LABELS[ex.equipment] ?? ex.equipment}
                  </div>
                </div>
              </button>
              <a
                href={`https://www.youtube.com/results?search_query=como+fazer+${encodeURIComponent(ex.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-[10px] font-bold text-coral/80 hover:text-coral bg-coral/10 px-2 py-1 rounded-full"
              >
                ▶
              </a>
              <button
                onClick={() => { onSelect(ex); onClose() }}
                className="flex-shrink-0 text-cyan text-lg font-bold px-1"
              >
                +
              </button>
            </div>
          ))}
          {exercises.length === 0 && (
            <div className="text-center text-t3 text-sm py-12">
              <p className="text-3xl mb-3">🔍</p>
              <p>Nenhum exercício encontrado</p>
              <button onClick={() => setCreating(true)} className="mt-3 text-cyan text-sm font-semibold">Criar exercício personalizado →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
