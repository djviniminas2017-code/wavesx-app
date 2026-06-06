'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { WorkoutSession } from '@/types/workout'

interface StrengthChartProps {
  sessions: WorkoutSession[]
  exerciseName: string
  unit: string
}

export default function StrengthChart({ sessions, exerciseName, unit }: StrengthChartProps) {
  const data = sessions
    .filter((s) => s.exercises.some((e) => e.exercise.name === exerciseName))
    .slice(0, 12)
    .reverse()
    .map((s) => {
      const ex = s.exercises.find((e) => e.exercise.name === exerciseName)
      const maxWeight = ex
        ? Math.max(...ex.sets.filter((st) => st.weight).map((st) => st.weight!))
        : 0
      return {
        date: format(parseISO(s.startedAt), 'dd/MM', { locale: ptBR }),
        weight: maxWeight,
      }
    })

  const pr = Math.max(...data.map((d) => d.weight), 0)

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#4A5568', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#4A5568', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={['auto', 'auto']}
        />
        <Tooltip
          contentStyle={{
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8,
            fontSize: 12,
            color: '#EDF1FA',
          }}
          formatter={(v: number) => [`${v} ${unit}`, 'Carga máx.']}
        />
        {pr > 0 && (
          <ReferenceLine
            y={pr}
            stroke="#F5C518"
            strokeDasharray="4 4"
            label={{ value: `PR ${pr}${unit}`, position: 'insideTopRight', fill: '#F5C518', fontSize: 10 }}
          />
        )}
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#22D68A"
          strokeWidth={2}
          dot={{ fill: '#22D68A', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
