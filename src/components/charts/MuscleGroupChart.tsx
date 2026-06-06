'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { WorkoutSession } from '@/types/workout'

const COLORS: Record<string, string> = {
  chest: '#06D6E8',
  back: '#22D68A',
  shoulders: '#A78BFA',
  biceps: '#F5C518',
  triceps: '#F5C518',
  legs: '#FF6B6B',
  glutes: '#FF6B6B',
  core: '#4FC3F7',
  cardio: '#22D68A',
  full_body: '#8892A4',
}

const LABELS: Record<string, string> = {
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
}

interface MuscleGroupChartProps {
  sessions: WorkoutSession[]
}

export default function MuscleGroupChart({ sessions }: MuscleGroupChartProps) {
  const muscleCount: Record<string, number> = {}
  sessions.slice(0, 20).forEach((s) => {
    s.exercises.forEach((we) => {
      const m = we.exercise.muscleGroup
      muscleCount[m] = (muscleCount[m] ?? 0) + 1
    })
  })

  const data = Object.entries(muscleCount)
    .map(([key, value]) => ({ name: LABELS[key] ?? key, value, key }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  if (data.length === 0) return null

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          dataKey="value"
          paddingAngle={3}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={COLORS[entry.key] ?? '#8892A4'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8,
            fontSize: 12,
            color: '#EDF1FA',
          }}
          formatter={(v: number) => [v, 'exercícios']}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: '#8892A4', fontSize: 11 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
