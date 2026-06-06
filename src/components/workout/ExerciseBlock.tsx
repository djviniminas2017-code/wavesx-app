'use client'

import { useState } from 'react'
import type { WorkoutExercise, WorkoutSet } from '@/types/workout'
import SetRow from './SetRow'

const MUSCLE_COLORS: Record<string, string> = {
  chest: '#06D6E8',
  back: '#22D68A',
  shoulders: '#A78BFA',
  biceps: '#F5C518',
  triceps: '#F5C518',
  legs: '#FF6B6B',
  glutes: '#FF6B6B',
  core: '#4FC3F7',
  cardio: '#22D68A',
  full_body: '#06D6E8',
  mobility: '#34D399',
}

interface ExerciseBlockProps {
  we: WorkoutExercise
  unit: string
  onAddSet: (weId: string) => void
  onRemoveSet: (weId: string, setId: string) => void
  onUpdateSet: (weId: string, setId: string, patch: Partial<WorkoutSet>) => void
  onCompleteSet: (weId: string, setId: string) => void
  onRemoveExercise: (weId: string) => void
  bestRecord?: { weight: number; reps: number }
}

export default function ExerciseBlock({
  we,
  unit,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onCompleteSet,
  onRemoveExercise,
  bestRecord,
}: ExerciseBlockProps) {
  const [expanded, setExpanded] = useState(true)
  const completedSets = we.sets.filter((s) => s.completed).length
  const color = MUSCLE_COLORS[we.exercise.muscleGroup] ?? '#06D6E8'

  const allDone = we.sets.length > 0 && completedSets === we.sets.length

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: allDone
          ? `linear-gradient(145deg, ${color}10, #111827)`
          : 'linear-gradient(145deg, #161F34, #111827)',
        border: allDone
          ? `1px solid ${color}30`
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: allDone
          ? `0 4px 20px ${color}15, inset 0 1px 0 ${color}15`
          : '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Color indicator — 3D pill */}
        <div
          className="flex-shrink-0 w-1 h-10 rounded-full"
          style={{
            background: `linear-gradient(180deg, ${color}, ${color}60)`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-syne font-bold text-sm text-t1 truncate">{we.exercise.name}</div>
          <div className="flex items-center gap-2 mt-1">
            {/* Progress pills */}
            <div className="flex gap-0.5">
              {we.sets.map((s, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: 12,
                    background: s.completed ? color : 'rgba(255,255,255,0.1)',
                    boxShadow: s.completed ? `0 0 4px ${color}` : 'none',
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-t3">{completedSets}/{we.sets.length}</span>
            {bestRecord && (
              <span className="text-[10px] text-t3 hidden sm:inline">PR: {bestRecord.weight}{unit}×{bestRecord.reps}</span>
            )}
            <a
              href={`https://www.youtube.com/results?search_query=como+fazer+${encodeURIComponent(we.exercise.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] font-bold transition-all"
              style={{
                color: 'rgba(255,107,107,0.8)',
                background: 'rgba(255,107,107,0.1)',
                border: '1px solid rgba(255,107,107,0.15)',
                padding: '2px 8px',
                borderRadius: 999,
              }}
            >
              ▶ Vídeo
            </a>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-t3 hover:text-t1 transition-colors px-1 text-xs"
        >
          {expanded ? '▲' : '▼'}
        </button>
        <button
          onClick={() => onRemoveExercise(we.id)}
          className="text-t3 hover:text-coral transition-colors text-xs px-1"
        >
          ✕
        </button>
      </div>

      {expanded && (
        <div className="pb-3">
          {/* Set header */}
          <div className="grid grid-cols-[28px_1fr_1fr_36px_32px] gap-2 px-3 pb-2 border-t border-white/[0.05] pt-2">
            <span className="text-[10px] font-bold text-t3 uppercase tracking-widest text-center">#</span>
            <span className="text-[10px] font-bold text-t3 uppercase tracking-widest text-center">{unit}</span>
            <span className="text-[10px] font-bold text-t3 uppercase tracking-widest text-center">Reps</span>
            <span className="text-[10px] font-bold text-t3 uppercase tracking-widest text-center">✓</span>
          </div>

          {/* Sets */}
          <div className="flex flex-col gap-1">
            {we.sets.map((set, idx) => (
              <SetRow
                key={set.id}
                index={idx}
                set={set}
                weId={we.id}
                onUpdate={onUpdateSet}
                onComplete={onCompleteSet}
                onRemove={onRemoveSet}
                unit={unit}
              />
            ))}
          </div>

          <button
            onClick={() => onAddSet(we.id)}
            className="mx-3 mt-2 w-[calc(100%-24px)] py-2 rounded-xl text-t3 text-xs font-semibold transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.1)',
            }}
          >
            + Série
          </button>
        </div>
      )}
    </div>
  )
}
