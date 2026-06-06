'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface RestTimerProps {
  defaultSeconds: number
  onDismiss: () => void
  onChangeDefault: (s: number) => void
}

export default function RestTimer({ defaultSeconds, onDismiss, onChangeDefault }: RestTimerProps) {
  const [total, setTotal] = useState(defaultSeconds)
  const [remaining, setRemaining] = useState(defaultSeconds)
  const [running, setRunning] = useState(true)
  const [editingTime, setEditingTime] = useState(false)
  const [editInput, setEditInput] = useState(String(defaultSeconds))
  const [done, setDone] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const tick = useCallback(() => {
    setRemaining(r => {
      if (r <= 1) {
        setRunning(false)
        setDone(true)
        return 0
      }
      return r - 1
    })
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, tick])

  // Auto-dismiss 2s after done
  useEffect(() => {
    if (done) {
      const t = setTimeout(onDismiss, 2000)
      return () => clearTimeout(t)
    }
  }, [done, onDismiss])

  const adjust = (delta: number) => {
    setRemaining(r => Math.max(5, r + delta))
    setTotal(t => Math.max(5, t + delta))
  }

  const applyEdit = () => {
    const n = parseInt(editInput)
    if (n >= 5 && n <= 600) {
      setTotal(n)
      setRemaining(n)
      setRunning(true)
      setDone(false)
      onChangeDefault(n)
    }
    setEditingTime(false)
  }

  const pct = total > 0 ? remaining / total : 0
  const r = 36
  const C = 2 * Math.PI * r
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`

  const ringColor = done ? '#22D68A' : pct > 0.5 ? '#06D6E8' : pct > 0.25 ? '#F5C518' : '#FF6B6B'

  return (
    <div
      className="fixed bottom-[88px] left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm z-50"
      style={{
        background: 'rgba(8,11,20,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '1.25rem',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      <div className="px-4 py-3 flex items-center gap-4">
        {/* Ring */}
        <div className="relative flex-shrink-0">
          <svg width="88" height="88" className="-rotate-90">
            <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <circle cx="44" cy="44" r={r} fill="none" stroke={ringColor} strokeWidth="5"
              strokeDasharray={`${pct * C} ${C}`} strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.9s linear, stroke 0.3s', filter: `drop-shadow(0 0 6px ${ringColor}80)` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {done ? (
              <span className="text-green text-xl font-bold">✓</span>
            ) : (
              <span className="font-mono font-bold text-base" style={{ color: ringColor }}>{timeStr}</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-t3 uppercase tracking-widest font-semibold">
              {done ? '🎉 Descanso completo!' : '⏱ Descanso'}
            </p>
            <button onClick={onDismiss} className="text-t3 hover:text-coral text-sm px-1">✕</button>
          </div>

          {!done && (
            <>
              {/* Adjust buttons */}
              <div className="flex items-center gap-2">
                <button onClick={() => adjust(-15)}
                  className="flex-1 py-1.5 bg-card2 border border-white/[0.07] rounded-lg text-t2 text-xs font-bold hover:border-coral/40 transition-all">
                  −15s
                </button>
                <button onClick={() => setRunning(r => !r)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{ background: running ? 'rgba(245,197,24,0.15)' : 'rgba(34,214,138,0.15)', color: running ? '#F5C518' : '#22D68A', border: `1px solid ${running ? 'rgba(245,197,24,0.3)' : 'rgba(34,214,138,0.3)'}` }}>
                  {running ? '⏸ Pausa' : '▶ Retomar'}
                </button>
                <button onClick={() => adjust(15)}
                  className="flex-1 py-1.5 bg-card2 border border-white/[0.07] rounded-lg text-t2 text-xs font-bold hover:border-cyan/40 transition-all">
                  +15s
                </button>
              </div>

              {/* Edit default time */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-t3">Padrão:</span>
                {editingTime ? (
                  <>
                    <input
                      type="number"
                      value={editInput}
                      onChange={e => setEditInput(e.target.value)}
                      onBlur={applyEdit}
                      onKeyDown={e => { if (e.key === 'Enter') applyEdit() }}
                      className="w-14 bg-bg/60 border border-cyan rounded px-1.5 py-0.5 text-cyan text-xs font-mono outline-none [appearance:textfield]"
                      autoFocus
                    />
                    <span className="text-[10px] text-t3">s</span>
                  </>
                ) : (
                  <button onClick={() => { setEditInput(String(defaultSeconds)); setEditingTime(true) }}
                    className="text-[10px] text-cyan font-semibold hover:underline">
                    {defaultSeconds}s ✏️
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
