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
  mobility: 'Mobilidade',
}

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: 'Barra', dumbbell: 'Haltere', cable: 'Cabo',
  machine: 'Máquina', bodyweight: 'Peso Corporal',
  kettlebell: 'Kettlebell', resistance_band: 'Elástico', other: 'Outro',
}

const MUSCLE_COLORS: Record<string, string> = {
  chest: 'text-cyan', back: 'text-green', shoulders: 'text-purple',
  biceps: 'text-gold', triceps: 'text-gold', legs: 'text-coral',
  glutes: 'text-coral', core: 'text-[#4FC3F7]', cardio: 'text-green',
  full_body: 'text-t2', mobility: 'text-[#34D399]',
}

function uid() { return Math.random().toString(36).slice(2) }

export default function ExercisesPage() {
  const { exercises, search, filterMuscle, setSearch, setFilter, getFiltered, addCustomExercise } = useExerciseStore()
  const [filtered, setFiltered] = useState<Exercise[]>([])
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', muscleGroup: 'chest' as MuscleGroup, equipment: 'bodyweight' as Equipment, instructions: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setFiltered(getFiltered())
  }, [search, filterMuscle, exercises, getFiltered])

  const saveCustom = () => {
    if (!form.name.trim()) return
    const ex: Exercise = {
      id: `custom-${uid()}`,
      name: form.name.trim(),
      muscleGroup: form.muscleGroup,
      equipment: form.equipment,
      instructions: form.instructions.trim() || undefined,
    }
    addCustomExercise(ex)
    setForm({ name: '', muscleGroup: 'chest', equipment: 'bodyweight', instructions: '' })
    setCreating(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const customExercises = exercises.filter(e => e.id.startsWith('custom-'))

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-10 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-syne font-extrabold text-2xl text-t1">Exercícios</h1>
          <p className="text-t2 text-sm mt-1">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          className="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: creating ? 'rgba(255,107,107,0.15)' : 'rgba(6,214,232,0.1)', color: creating ? '#FF6B6B' : '#06D6E8', border: `1px solid ${creating ? 'rgba(255,107,107,0.3)' : 'rgba(6,214,232,0.2)'}` }}
        >
          {creating ? '✕ Fechar' : '+ Criar'}
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="mx-5 mb-4 bg-card border border-cyan/20 rounded-2xl p-4 flex flex-col gap-4">
          <p className="font-syne font-bold text-t1 text-sm">Novo exercício personalizado</p>

          <div>
            <label className="text-[10px] text-t3 uppercase tracking-widest mb-1.5 block">Nome</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Rotação de ombro com elástico"
              className="w-full bg-bg/60 border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-t1 outline-none focus:border-cyan placeholder:text-t3"
              autoFocus
            />
          </div>

          <div>
            <label className="text-[10px] text-t3 uppercase tracking-widest mb-2 block">Grupo muscular</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(MUSCLE_LABELS).filter(([k]) => k !== 'all') as [MuscleGroup, string][]).map(([k, l]) => (
                <button key={k} onClick={() => setForm(f => ({ ...f, muscleGroup: k }))}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${form.muscleGroup === k ? 'bg-cyan text-bg' : 'bg-card2 border border-white/[0.07] text-t2'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-t3 uppercase tracking-widest mb-2 block">Equipamento</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(EQUIPMENT_LABELS) as [Equipment, string][]).map(([k, l]) => (
                <button key={k} onClick={() => setForm(f => ({ ...f, equipment: k }))}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${form.equipment === k ? 'bg-cyan text-bg' : 'bg-card2 border border-white/[0.07] text-t2'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-t3 uppercase tracking-widest mb-1.5 block">Instruções (opcional)</label>
            <textarea
              value={form.instructions}
              onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
              placeholder="Descreva como executar o exercício..."
              rows={2}
              className="w-full bg-bg/60 border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-t1 outline-none focus:border-cyan placeholder:text-t3 resize-none"
            />
          </div>

          <button onClick={saveCustom}
            className="w-full py-3 rounded-xl font-syne font-bold text-sm text-bg"
            style={{ background: 'linear-gradient(135deg, #06D6E8, #00AACC)' }}>
            Salvar exercício
          </button>
        </div>
      )}

      {saved && (
        <div className="mx-5 mb-3 py-2.5 px-4 bg-green/10 border border-green/30 rounded-xl">
          <p className="text-green text-sm font-semibold">✓ Exercício criado com sucesso!</p>
        </div>
      )}

      {/* Search */}
      <div className="px-5 mb-3">
        <input
          className="w-full bg-card border border-white/[0.07] rounded-xl px-4 py-3 text-t1 text-sm outline-none focus:border-cyan placeholder:text-t3 transition-colors"
          placeholder="Buscar exercício..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Muscle filter chips */}
      <div className="flex gap-2 px-5 pb-3 overflow-x-auto scrollbar-none">
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

      {/* Custom exercises badge */}
      {customExercises.length > 0 && filterMuscle === 'all' && !search && (
        <div className="px-5 mb-2">
          <p className="text-[10px] text-cyan uppercase tracking-widest font-semibold">
            ✨ {customExercises.length} exercício{customExercises.length !== 1 ? 's' : ''} criado{customExercises.length !== 1 ? 's' : ''} por você
          </p>
        </div>
      )}

      {/* Exercise list */}
      <div className="px-5 pb-nav flex flex-col gap-2">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="bg-card border border-white/[0.07] rounded-2xl px-4 py-3 flex items-center gap-3"
            style={ex.id.startsWith('custom-') ? { borderColor: 'rgba(6,214,232,0.15)' } : {}}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-t1 truncate">{ex.name}</p>
                {ex.id.startsWith('custom-') && (
                  <span className="text-[9px] text-cyan bg-cyan/10 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">Meu</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs font-semibold ${MUSCLE_COLORS[ex.muscleGroup] ?? 'text-t2'}`}>
                  {MUSCLE_LABELS[ex.muscleGroup] ?? ex.muscleGroup}
                </span>
                <span className="text-t3 text-xs">·</span>
                <span className="text-xs text-t3">{EQUIPMENT_LABELS[ex.equipment] ?? ex.equipment}</span>
              </div>
              {ex.instructions && (
                <p className="text-[10px] text-t3 mt-1 italic line-clamp-2">{ex.instructions}</p>
              )}
            </div>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' como fazer')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-coral/70 hover:text-coral bg-coral/10 px-2 py-1 rounded-full flex-shrink-0"
            >
              ▶
            </a>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-t2 text-sm">Nenhum exercício encontrado</p>
            <button onClick={() => setCreating(true)} className="mt-3 text-cyan text-sm font-semibold">Criar exercício personalizado →</button>
          </div>
        )}
      </div>
    </div>
  )
}
