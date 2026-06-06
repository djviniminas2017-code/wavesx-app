'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { format, parseISO, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { WorkoutSession } from '@/types/workout'

interface FrequencyChartProps {
  sessions: WorkoutSession[]
}

export default function FrequencyChart({ sessions }: FrequencyChartProps) {
  const weekMap = new Map<string, number>()
  sessions.forEach((s) => {
    const d = parseISO(s.startedAt)
    const weekStart = startOfWeek(d, { weekStartsOn: 1 })
    const key = format(weekStart, 'dd/MM', { locale: ptBR })
    weekMap.set(key, (weekMap.get(key) ?? 0) + 1)
  })

  const data = Array.from(weekMap.entries())
    .slice(-8)
    .map(([week, count]) => ({ week, count }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="freqGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="week"
          tick={{ fill: '#4A5568', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#4A5568', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8,
            fontSize: 12,
            color: '#EDF1FA',
          }}
          formatter={(v: number) => [v, 'Treinos']}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#A78BFA"
          strokeWidth={2}
          fill="url(#freqGrad)"
          dot={{ fill: '#A78BFA', r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
