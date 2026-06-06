'use client'

import type { WorkoutSet } from '@/types/workout'

interface SetRowProps {
  index: number
  set: WorkoutSet
  weId: string
  onUpdate: (weId: string, setId: string, patch: Partial<WorkoutSet>) => void
  onComplete: (weId: string, setId: string) => void
  onRemove: (weId: string, setId: string) => void
  unit: string
}

export default function SetRow({ index, set, weId, onUpdate, onComplete, onRemove, unit }: SetRowProps) {
  return (
    <div
      className="grid grid-cols-[28px_1fr_1fr_36px_32px] gap-2 items-center px-3 py-1.5 rounded-xl mx-1 transition-all duration-200"
      style={set.completed ? {
        background: 'linear-gradient(90deg, rgba(34,214,138,0.08), rgba(34,214,138,0.04))',
        border: '1px solid rgba(34,214,138,0.15)',
      } : {
        background: 'transparent',
        border: '1px solid transparent',
      }}
    >
      {/* Index */}
      <span
        className="font-mono text-[11px] text-center font-bold"
        style={{ color: set.completed ? '#22D68A' : 'rgba(74,85,104,0.8)' }}
      >
        {index + 1}
      </span>

      {/* Weight input */}
      <input
        className="rounded-lg py-2 text-center font-mono text-sm outline-none w-full transition-all"
        style={{
          background: set.completed ? 'rgba(34,214,138,0.06)' : 'rgba(255,255,255,0.04)',
          border: set.completed ? '1px solid rgba(34,214,138,0.2)' : '1px solid rgba(255,255,255,0.07)',
          color: set.completed ? '#22D68A' : '#EDF1FA',
          opacity: set.completed ? 0.7 : 1,
        }}
        type="number"
        placeholder={unit === 'kg' ? '0 kg' : '0 lbs'}
        value={set.weight ?? ''}
        onChange={(e) => onUpdate(weId, set.id, { weight: e.target.value ? Number(e.target.value) : null })}
        disabled={set.completed}
      />

      {/* Reps input */}
      <input
        className="rounded-lg py-2 text-center font-mono text-sm outline-none w-full transition-all"
        style={{
          background: set.completed ? 'rgba(34,214,138,0.06)' : 'rgba(255,255,255,0.04)',
          border: set.completed ? '1px solid rgba(34,214,138,0.2)' : '1px solid rgba(255,255,255,0.07)',
          color: set.completed ? '#22D68A' : '#EDF1FA',
          opacity: set.completed ? 0.7 : 1,
        }}
        type="number"
        placeholder="reps"
        value={set.reps ?? ''}
        onChange={(e) => onUpdate(weId, set.id, { reps: e.target.value ? Number(e.target.value) : null })}
        disabled={set.completed}
      />

      {/* Complete button */}
      <button
        onClick={() => onComplete(weId, set.id)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all active:scale-90"
        style={set.completed ? {
          background: 'linear-gradient(135deg, #22D68A, #16B870)',
          border: '1px solid rgba(34,214,138,0.5)',
          color: '#060810',
          boxShadow: '0 0 12px rgba(34,214,138,0.4)',
        } : {
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'transparent',
        }}
      >
        ✓
      </button>

      {/* Remove button */}
      <button
        onClick={() => onRemove(weId, set.id)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-t3 hover:text-coral hover:bg-coral/10 transition-all text-xs"
      >
        ✕
      </button>
    </div>
  )
}
