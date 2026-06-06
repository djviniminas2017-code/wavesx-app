'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { WorkoutSession } from '@/types/workout'

interface VolumeChartProps {
  sessions: WorkoutSession[]
  height?: number
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(17,24,39,0.95)',
      border: '1px solid rgba(6,214,232,0.2)',
      borderRadius: 10,
      padding: '8px 12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(12px)',
    }}>
      <p style={{ color: '#4A5568', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</p>
      <p style={{ color: '#06D6E8', fontFamily: 'monospace', fontWeight: 700, fontSize: 14, marginTop: 2, textShadow: '0 0 8px rgba(6,214,232,0.5)' }}>
        {payload[0].value} kg
      </p>
    </div>
  )
}

export default function VolumeChart({ sessions, height = 140 }: VolumeChartProps) {
  const data = sessions.slice(0, 10).reverse().map((s) => ({
    date: format(parseISO(s.startedAt), 'dd/MM', { locale: ptBR }),
    volume: Math.round(s.totalVolume),
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barCategoryGap="30%">
        <XAxis
          dataKey="date"
          tick={{ fill: 'rgba(74,85,104,0.7)', fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(74,85,104,0.7)', fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }} />
        <Bar dataKey="volume" radius={[4, 4, 0, 0]} isAnimationActive>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === data.length - 1 ? '#06D6E8' : '#06D6E860'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
