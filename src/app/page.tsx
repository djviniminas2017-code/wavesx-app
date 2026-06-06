'use client'

import { useWorkoutStore } from '@/store/workoutStore'
import { usePreferencesStore } from '@/store/preferencesStore'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { format, parseISO, isThisWeek, subDays, isToday, isYesterday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { WorkoutSession } from '@/types/workout'

const VolumeChart = dynamic(() => import('@/components/charts/VolumeChart'), { ssr: false })

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function calcStreak(history: WorkoutSession[]): number {
  if (history.length === 0) return 0
  const days = new Set(history.map((s) => format(parseISO(s.startedAt), 'yyyy-MM-dd')))
  let d = new Date()
  if (!days.has(format(d, 'yyyy-MM-dd'))) {
    if (!days.has(format(subDays(d, 1), 'yyyy-MM-dd'))) return 0
    d = subDays(d, 1)
  }
  let streak = 0
  while (days.has(format(d, 'yyyy-MM-dd'))) {
    streak++
    d = subDays(d, 1)
  }
  return streak
}

function formatDate(iso: string) {
  const d = parseISO(iso)
  if (isToday(d)) return 'Hoje'
  if (isYesterday(d)) return 'Ontem'
  return format(d, 'EEE, dd MMM', { locale: ptBR })
}

// ── 3D Stat Ring ─────────────────────────────────────────────────────────

function StatOrb({
  value, label, color, pct, delay = 0
}: { value: string | number; label: string; color: string; pct: number; delay?: number }) {
  const r = 24, C = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center gap-2" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative flex items-center justify-center" style={{ width: 64, height: 64 }}>
        {/* outer glow ring */}
        <div className="absolute inset-0 rounded-full opacity-20 blur-md" style={{ background: color }} />
        {/* SVG ring */}
        <svg width="64" height="64" className="-rotate-90 absolute inset-0">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle
            cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${Math.min(pct, 1) * C} ${C}`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        {/* inner glass orb */}
        <div
          className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.08), rgba(0,0,0,0.3))`,
            border: `1px solid ${color}30`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)`,
          }}
        >
          <span className="font-mono font-bold text-xs" style={{ color, textShadow: `0 0 10px ${color}80` }}>
            {value}
          </span>
        </div>
      </div>
      <span className="text-[9px] text-t3 uppercase tracking-widest font-semibold">{label}</span>
    </div>
  )
}

// ── Quick action button ────────────────────────────────────────────────────

function QuickAction({ href, icon, label, color }: { href: string; icon: string; label: string; color: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 group-active:scale-95"
        style={{
          background: `linear-gradient(145deg, ${color}18, ${color}08)`,
          border: `1px solid ${color}25`,
          boxShadow: `0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 0 ${color}40`,
        }}
      >
        {icon}
      </div>
      <span className="text-[10px] text-t3 font-semibold uppercase tracking-wider">{label}</span>
    </Link>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { name } = usePreferencesStore()
  const { history, activeWorkout } = useWorkoutStore()

  const thisWeek = history.filter((s) => isThisWeek(parseISO(s.startedAt), { weekStartsOn: 1 }))
  const weekVolume = thisWeek.reduce((t, s) => t + s.totalVolume, 0)
  const streak = calcStreak(history)
  const lastWorkout = history[0] ?? null
  const weekWorkouts = thisWeek.length

  return (
    <div className="flex flex-col gap-5 pb-2">

      {/* ── Header ── */}
      <div className="px-5 pt-11 pb-1 fade-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-t3 text-xs uppercase tracking-widest font-semibold mb-0.5">{greeting()}</p>
            <h1 className="font-syne font-extrabold text-2xl text-t1">{name} <span style={{ filter: 'drop-shadow(0 0 8px rgba(245,197,24,0.8))' }}>👋</span></h1>
          </div>
          <Link href="/profile">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center font-syne font-extrabold text-bg text-base transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #06D6E8, #A78BFA)',
                boxShadow: '0 4px 16px rgba(6,214,232,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              {name[0]?.toUpperCase()}
            </div>
          </Link>
        </div>
      </div>

      {/* ── Streak banner ── */}
      {streak > 0 && (
        <div
          className="mx-5 rounded-2xl px-4 py-3.5 flex items-center gap-3 fade-up-1"
          style={{
            background: 'linear-gradient(135deg, rgba(245,197,24,0.14) 0%, rgba(245,197,24,0.05) 100%)',
            border: '1px solid rgba(245,197,24,0.25)',
            boxShadow: '0 4px 20px rgba(245,197,24,0.1), inset 0 1px 0 rgba(245,197,24,0.15)',
          }}
        >
          <span className="text-3xl float" style={{ filter: 'drop-shadow(0 0 10px rgba(245,197,24,0.8))' }}>🔥</span>
          <div className="flex-1">
            <p className="font-syne font-extrabold text-gold text-base text-glow-gold">
              {streak} dia{streak !== 1 ? 's' : ''} seguidos!
            </p>
            <p className="text-t3 text-xs mt-0.5">Não quebre a sequência agora 💪</p>
          </div>
          <div
            className="flex items-center justify-center rounded-xl px-3 py-1.5"
            style={{ background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.2)' }}
          >
            <span className="font-mono font-bold text-gold text-sm">{streak}🔥</span>
          </div>
        </div>
      )}

      {/* ── Active workout banner ── */}
      {activeWorkout && (
        <div
          className="mx-5 rounded-2xl px-4 py-3.5 fade-up-1"
          style={{
            background: 'linear-gradient(135deg, rgba(6,214,232,0.12), rgba(6,214,232,0.04))',
            border: '1px solid rgba(6,214,232,0.25)',
            boxShadow: '0 4px 20px rgba(6,214,232,0.1), inset 0 1px 0 rgba(6,214,232,0.15)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan pulse-glow" />
            <span className="text-xs font-bold text-cyan uppercase tracking-widest">Treino ativo</span>
          </div>
          <p className="font-syne font-bold text-t1 mb-2">{activeWorkout.name}</p>
          <Link
            href="/workout"
            className="flex items-center justify-center w-full py-2.5 rounded-xl font-syne font-bold text-sm text-bg transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #06D6E8, #00AACC)',
              boxShadow: '0 4px 16px rgba(6,214,232,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            Continuar treino →
          </Link>
        </div>
      )}

      {/* ── CTA start workout ── */}
      {!activeWorkout && (
        <div className="mx-5 fade-up-2">
          <Link
            href="/workout"
            className="flex items-center justify-center w-full py-4 rounded-2xl font-syne font-bold text-base text-bg gap-2 transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #06D6E8 0%, #00AACC 100%)',
              boxShadow: '0 6px 24px rgba(6,214,232,0.45), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            🏋️ Iniciar treino
          </Link>
        </div>
      )}

      {/* ── Quick access ── */}
      <div className="px-5 fade-up-3">
        <p className="text-[10px] text-t3 uppercase tracking-widest font-semibold mb-3">Acesso rápido</p>
        <div className="flex justify-between px-2">
          <QuickAction href="/routines" icon="⚡" label="Rotinas" color="#06D6E8" />
          <QuickAction href="/history" icon="📋" label="Histórico" color="#22D68A" />
          <QuickAction href="/progress" icon="📈" label="Progresso" color="#A78BFA" />
          <QuickAction href="/surf" icon="🌊" label="Surf" color="#F5C518" />
        </div>
      </div>

      {/* ── Weekly summary ── */}
      <div className="px-5 fade-up-4">
        <p className="text-[10px] text-t3 uppercase tracking-widest font-semibold mb-3">Esta semana</p>
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(145deg, #161F34, #111827)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* 3D Stat orbs */}
          <div className="flex justify-around mb-5">
            <StatOrb value={weekWorkouts} label="Treinos" color="#06D6E8" pct={weekWorkouts / 5} delay={0} />
            <StatOrb
              value={weekVolume > 1000 ? `${Math.round(weekVolume / 1000 * 10) / 10}k` : Math.round(weekVolume)}
              label="Vol. kg" color="#22D68A" pct={Math.min(weekVolume / 50000, 1)} delay={60}
            />
            <StatOrb value={`${streak}🔥`} label="Streak" color="#F5C518" pct={Math.min(streak / 7, 1)} delay={120} />
          </div>

          {/* Mini chart */}
          {history.length >= 2 ? (
            <div>
              <p className="text-[10px] text-t3 uppercase tracking-widest mb-2">Volume por sessão (kg)</p>
              <VolumeChart sessions={history} />
            </div>
          ) : (
            <div className="py-3 text-center">
              <p className="text-t3 text-xs">Complete 2+ treinos para ver o gráfico</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Último treino ── */}
      <div className="px-5 pb-2 fade-up-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-t3 uppercase tracking-widest font-semibold">Último treino</p>
          <Link href="/history" className="text-xs text-cyan font-semibold" style={{ textShadow: '0 0 10px rgba(6,214,232,0.4)' }}>
            Ver todos →
          </Link>
        </div>

        {!lastWorkout ? (
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: 'linear-gradient(145deg, #161F34, #111827)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            <p className="text-4xl mb-3" style={{ filter: 'drop-shadow(0 0 12px rgba(6,214,232,0.3))' }}>🏋️</p>
            <p className="text-t2 text-sm font-semibold">Nenhum treino ainda</p>
            <p className="text-t3 text-xs mt-1">Conclua seu primeiro treino para ver aqui.</p>
          </div>
        ) : (
          <div
            className="rounded-2xl p-4 transition-all active:scale-[0.99]"
            style={{
              background: 'linear-gradient(145deg, #161F34, #111827)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-syne font-bold text-t1 text-base">{lastWorkout.name}</p>
                <p className="text-t3 text-xs mt-0.5">
                  {formatDate(lastWorkout.startedAt)} · {lastWorkout.durationMinutes}min
                </p>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  color: '#22D68A',
                  background: 'rgba(34,214,138,0.12)',
                  border: '1px solid rgba(34,214,138,0.2)',
                  textShadow: '0 0 8px rgba(34,214,138,0.5)',
                }}
              >
                ✓ Feito
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { v: `${Math.round(lastWorkout.totalVolume)} kg`, l: 'Volume', c: '#06D6E8' },
                { v: lastWorkout.totalSets, l: 'Séries', c: '#A78BFA' },
                { v: lastWorkout.exercises.length, l: 'Exercícios', c: '#22D68A' },
              ].map(({ v, l, c }) => (
                <div
                  key={l}
                  className="rounded-xl p-2.5 text-center"
                  style={{
                    background: `linear-gradient(145deg, ${c}12, ${c}06)`,
                    border: `1px solid ${c}20`,
                  }}
                >
                  <p className="font-mono font-bold text-sm" style={{ color: c, textShadow: `0 0 8px ${c}60` }}>{v}</p>
                  <p className="text-[9px] text-t3 uppercase tracking-widest mt-0.5">{l}</p>
                </div>
              ))}
            </div>

            {/* Exercise list */}
            <div className="flex flex-col gap-1">
              {lastWorkout.exercises.slice(0, 3).map((we) => {
                const best = we.sets
                  .filter((s) => s.completed && s.weight && s.reps)
                  .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))[0]
                return (
                  <div key={we.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-t2">{we.exercise.name}</span>
                    {best && (
                      <span className="font-mono text-xs text-t3">{best.weight}kg × {best.reps}</span>
                    )}
                  </div>
                )
              })}
              {lastWorkout.exercises.length > 3 && (
                <p className="text-xs text-t3 mt-1">+ {lastWorkout.exercises.length - 3} exercícios</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
