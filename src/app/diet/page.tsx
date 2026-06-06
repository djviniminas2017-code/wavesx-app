'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { FOODS, FOOD_CATEGORIES, calcFoodMacros, type FoodDef, type FoodCategory } from '@/data/foods'
import { SUPPLEMENTS, type SuppDef } from '@/data/supplements'
import { useUserStore, calculateMacros } from '@/store/userStore'

// ── Types ─────────────────────────────────────────────────────────────────────

interface FoodEntry {
  id: string
  foodId: string
  name: string
  qty: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface Meal {
  id: string
  name: string
  time: string
  foods: FoodEntry[]
}

interface SuppEntry {
  id: string
  suppId: string
  name: string
  dose: string
  timing: string
  taken: boolean
  emoji: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2) }

function useLS<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init)
  useEffect(() => {
    try { const s = localStorage.getItem(key); if (s) setV(JSON.parse(s)) } catch {}
  }, [key])
  const save = useCallback((val: T) => { setV(val); localStorage.setItem(key, JSON.stringify(val)) }, [key])
  return [v, save] as const
}

const DEFAULT_MEALS: Meal[] = [
  { id: 'm1', name: 'Café da Manhã', time: '07:00', foods: [] },
  { id: 'm2', name: 'Pré-Treino', time: '11:30', foods: [] },
  { id: 'm3', name: 'Pós-Treino', time: '14:00', foods: [] },
  { id: 'm4', name: 'Jantar', time: '19:30', foods: [] },
]

const DEFAULT_SUPPS: SuppEntry[] = [
  { id: 's1', suppId: 'creatina', name: 'Creatina Monohidratada', dose: '5g', timing: 'Pós-treino', taken: false, emoji: '💪' },
  { id: 's2', suppId: 'vitd3', name: 'Vitamina D3', dose: '2000 UI', timing: 'Manhã', taken: false, emoji: '☀️' },
  { id: 's3', suppId: 'omega3', name: 'Ômega 3', dose: '1g', timing: 'Jantar', taken: false, emoji: '🐟' },
]

// ── MacroRing ─────────────────────────────────────────────────────────────────

function MacroRing({ value, goal, color, label, unit = 'g' }: {
  value: number; goal: number; color: string; label: string; unit?: string
}) {
  const pct = Math.min(value / Math.max(goal, 1), 1)
  const r = 22, C = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="56" height="56" className="-rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${pct*C} ${C}`} strokeLinecap="round"/>
      </svg>
      <p className="font-mono font-bold text-sm" style={{color}}>{Math.round(value)}{unit}</p>
      <p className="text-[9px] text-t3 uppercase tracking-widest">{label}</p>
      <p className="text-[9px] text-t3">/{goal}{unit}</p>
    </div>
  )
}

// ── FoodPicker modal ──────────────────────────────────────────────────────────

function FoodPicker({ isPremium, onAdd, onClose }: {
  isPremium: boolean
  onAdd: (entry: FoodEntry) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState<FoodCategory | 'all'>('all')
  const [selected, setSelected] = useState<FoodDef | null>(null)
  const [qty, setQty] = useState(1)
  const [mode, setMode] = useState<'pick' | 'qty'>('pick')

  const visibleFoods = useMemo(() => {
    return FOODS.filter(f => {
      if (!isPremium && f.premium) return false
      if (cat !== 'all' && f.category !== cat) return false
      if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [isPremium, cat, search])

  const selectFood = (food: FoodDef) => {
    setSelected(food)
    setQty(food.defaultQty)
    setMode('qty')
  }

  const confirm = () => {
    if (!selected) return
    const macros = calcFoodMacros(selected, qty)
    onAdd({
      id: uid(),
      foodId: selected.id,
      name: selected.name,
      qty,
      unit: selected.defaultUnit === 'un' ? 'un' : selected.defaultUnit,
      calories: macros.calories,
      protein: macros.protein,
      carbs: macros.carb,
      fat: macros.fat,
    })
    onClose()
  }

  const macrosPreview = selected ? calcFoodMacros(selected, qty) : null

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto bg-[#0D111C] border border-white/[0.08] rounded-t-3xl overflow-hidden z-10" style={{ maxHeight: '88vh' }}>

        {mode === 'pick' ? (
          <>
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-syne font-bold text-t1">Adicionar alimento</h3>
                <button onClick={onClose} className="text-t3 hover:text-t1 text-xl leading-none">×</button>
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar alimento..."
                autoFocus
                className="w-full bg-bg/60 border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-t1 outline-none focus:border-cyan placeholder:text-t3"
              />
            </div>

            {/* Category chips */}
            <div className="flex gap-2 px-5 pb-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setCat('all')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${cat === 'all' ? 'bg-cyan text-bg' : 'bg-card2 border border-white/[0.07] text-t2'}`}
              >
                Todos
              </button>
              {FOOD_CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${cat === c.id ? 'bg-cyan text-bg' : 'bg-card2 border border-white/[0.07] text-t2'}`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>

            {/* Food list */}
            <div className="overflow-y-auto scrollbar-thin px-5 pb-8" style={{ maxHeight: '55vh' }}>
              {!isPremium && (
                <div className="mb-3 p-3 bg-gold/10 border border-gold/30 rounded-xl">
                  <p className="text-xs text-gold font-semibold">🔒 Premium: +60 alimentos desbloqueados</p>
                </div>
              )}
              {visibleFoods.length === 0 && (
                <p className="text-t3 text-sm text-center py-8">Nenhum alimento encontrado</p>
              )}
              {visibleFoods.map(food => {
                const preview = calcFoodMacros(food, food.defaultQty)
                return (
                  <button
                    key={food.id}
                    onClick={() => selectFood(food)}
                    className="w-full flex items-center gap-3 py-3 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] transition-colors text-left"
                  >
                    <span className="text-xl w-8 text-center flex-shrink-0">{food.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-t1 font-medium truncate">{food.name}</p>
                      <p className="text-[10px] text-t3">
                        {food.defaultQty}{food.defaultUnit === 'un' ? 'un' : food.defaultUnit} · {preview.calories}kcal · P{preview.protein}g · C{preview.carb}g · G{preview.fat}g
                      </p>
                    </div>
                    <span className="text-t3 text-sm">›</span>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <>
            {/* Qty picker */}
            <div className="px-5 pt-5 pb-8 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <button onClick={() => setMode('pick')} className="text-t3 hover:text-cyan text-sm">← Voltar</button>
                <h3 className="font-syne font-bold text-t1 flex-1">{selected?.emoji} {selected?.name}</h3>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-[10px] text-t3 uppercase tracking-widest mb-2 block">
                  Quantidade ({selected?.defaultUnit === 'un' ? 'unidades' : selected?.defaultUnit})
                </label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(q => Math.max(0.5, q - (selected?.defaultUnit === 'un' ? 1 : 10)))}
                    className="w-10 h-10 bg-card2 border border-white/[0.07] rounded-xl text-t1 text-lg font-bold">−</button>
                  <input
                    type="number"
                    value={qty}
                    onChange={e => setQty(Math.max(0.5, Number(e.target.value)))}
                    className="flex-1 bg-bg/60 border border-white/[0.07] rounded-xl px-3 py-2 text-center text-t1 font-mono text-lg outline-none focus:border-cyan [appearance:textfield]"
                  />
                  <button onClick={() => setQty(q => q + (selected?.defaultUnit === 'un' ? 1 : 10))}
                    className="w-10 h-10 rounded-xl text-bg text-lg font-bold" style={{ background: 'linear-gradient(135deg, #06D6E8, #00AACC)' }}>+</button>
                </div>
              </div>

              {/* Macro preview */}
              {macrosPreview && (
                <div className="bg-card border border-white/[0.07] rounded-2xl p-4 grid grid-cols-4 gap-2">
                  {[
                    { label: 'Calorias', value: macrosPreview.calories, unit: 'kcal', color: '#FF8C42' },
                    { label: 'Proteína', value: macrosPreview.protein, unit: 'g', color: '#22D68A' },
                    { label: 'Carbo', value: macrosPreview.carb, unit: 'g', color: '#F5C518' },
                    { label: 'Gordura', value: macrosPreview.fat, unit: 'g', color: '#FF6B6B' },
                  ].map(m => (
                    <div key={m.label} className="text-center">
                      <p className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.value}</p>
                      <p className="text-[9px] text-t3">{m.unit}</p>
                      <p className="text-[9px] text-t3 mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={confirm}
                className="w-full py-3 rounded-xl font-syne font-bold text-sm text-bg"
                style={{ background: 'linear-gradient(135deg, #06D6E8, #00AACC)' }}
              >
                Adicionar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── SuppPicker modal ──────────────────────────────────────────────────────────

function SuppPicker({ existingIds, isPremium, onAdd, onClose }: {
  existingIds: string[]
  isPremium: boolean
  onAdd: (entry: SuppEntry) => void
  onClose: () => void
}) {
  const available = SUPPLEMENTS.filter(s => {
    if (!isPremium && s.premium) return false
    if (existingIds.includes(s.id)) return false
    return true
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto bg-[#0D111C] border border-white/[0.08] rounded-t-3xl z-10 overflow-hidden" style={{ maxHeight: '75vh' }}>
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <h3 className="font-syne font-bold text-t1">Adicionar suplemento</h3>
          <button onClick={onClose} className="text-t3 hover:text-t1 text-xl">×</button>
        </div>
        {!isPremium && (
          <div className="mx-5 mb-3 p-3 bg-gold/10 border border-gold/30 rounded-xl">
            <p className="text-xs text-gold font-semibold">🔒 Premium: +15 suplementos desbloqueados</p>
          </div>
        )}
        <div className="overflow-y-auto scrollbar-thin px-5 pb-8" style={{ maxHeight: '60vh' }}>
          {available.map(s => (
            <button
              key={s.id}
              onClick={() => {
                onAdd({ id: uid(), suppId: s.id, name: s.name, dose: s.suggestedDose, timing: s.timing, taken: false, emoji: s.emoji })
                onClose()
              }}
              className="w-full flex items-center gap-3 py-3 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] transition-colors text-left"
            >
              <span className="text-xl w-8 text-center">{s.emoji}</span>
              <div className="flex-1">
                <p className="text-sm text-t1 font-medium">{s.name}</p>
                <p className="text-[10px] text-t3">{s.suggestedDose} · {s.timing}</p>
                <p className="text-[10px] text-t3 mt-0.5 italic">{s.benefit}</p>
              </div>
              <span className="text-t3">+</span>
            </button>
          ))}
          {available.length === 0 && (
            <p className="text-t3 text-sm text-center py-8">Todos os suplementos já adicionados</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── MealCard ──────────────────────────────────────────────────────────────────

function MealCard({ meal, isPremium, onUpdate, onRemove }: {
  meal: Meal
  isPremium: boolean
  onUpdate: (m: Meal) => void
  onRemove: () => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [picking, setPicking] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [mealName, setMealName] = useState(meal.name)
  const [mealTime, setMealTime] = useState(meal.time)
  const [editDoseId, setEditDoseId] = useState<string | null>(null)

  const totalCal = meal.foods.reduce((s, f) => s + f.calories, 0)

  const addFood = (entry: FoodEntry) => onUpdate({ ...meal, foods: [...meal.foods, entry] })
  const removeFood = (id: string) => onUpdate({ ...meal, foods: meal.foods.filter(f => f.id !== id) })
  const saveMeta = () => { onUpdate({ ...meal, name: mealName.trim() || meal.name, time: mealTime }); setEditingName(false) }

  return (
    <>
      {picking && <FoodPicker isPremium={isPremium} onAdd={addFood} onClose={() => setPicking(false)} />}

      <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-syne font-bold text-t1 text-sm">{meal.name}</p>
              <span className="text-[10px] text-t3">{meal.time}</span>
            </div>
            <p className="text-xs text-t3 mt-0.5">{meal.foods.length} itens · {totalCal} kcal</p>
          </div>
          <button onClick={e => { e.stopPropagation(); setEditingName(v => !v) }} className="text-t3 text-xs hover:text-cyan px-1">✏️</button>
          <button onClick={e => { e.stopPropagation(); if (confirm('Remover refeição?')) onRemove() }} className="text-t3 text-xs hover:text-coral px-1">🗑</button>
          <span className={`text-t3 text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
        </div>

        {editingName && (
          <div className="px-4 pb-3 flex gap-2">
            <input value={mealName} onChange={e => setMealName(e.target.value)}
              className="flex-1 bg-card2 border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-t1 outline-none focus:border-cyan"
              placeholder="Nome" />
            <input type="time" value={mealTime} onChange={e => setMealTime(e.target.value)}
              className="w-24 bg-card2 border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-t1 outline-none focus:border-cyan" />
            <button onClick={saveMeta} className="px-3 bg-cyan text-bg rounded-xl text-sm font-bold">OK</button>
          </div>
        )}

        {expanded && (
          <div className="px-4 pb-3">
            {meal.foods.map(f => (
              <div key={f.id} className="flex items-center gap-2 py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-t1">{f.name}</p>
                  <p className="text-[10px] text-t3">{f.qty}{f.unit} · P{f.protein}g · C{f.carbs}g · G{f.fat}g</p>
                </div>
                <span className="font-mono text-xs text-t2">{f.calories}kcal</span>
                <button onClick={() => removeFood(f.id)} className="text-t3 hover:text-coral text-xs px-1">✕</button>
              </div>
            ))}
            <button
              onClick={() => setPicking(true)}
              className="w-full mt-2 py-2 border border-dashed border-white/[0.12] rounded-xl text-t3 text-xs hover:border-cyan/40 hover:text-cyan transition-all"
            >
              + Adicionar alimento
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ── Daily reset at 02:00 ─────────────────────────────────────────────────────

function useDailyReset(
  setWaterMl: (v: number) => void,
  setSupplements: (v: SuppEntry[]) => void,
  supplements: SuppEntry[],
) {
  useEffect(() => {
    const check = () => {
      const now = new Date()
      const today2am = new Date(now)
      today2am.setHours(2, 0, 0, 0)

      const lastKey = 'wsx-diet-last-reset'
      const last = localStorage.getItem(lastKey)
      const lastDate = last ? new Date(last) : null

      if (now >= today2am && (!lastDate || lastDate < today2am)) {
        setWaterMl(0)
        setSupplements(supplements.map(s => ({ ...s, taken: false })))
        localStorage.setItem(lastKey, now.toISOString())
      }
    }
    check()
    // Check every minute
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DietPage() {
  const { plan, weight, height, age, gender, activityLevel, fitnessGoal } = useUserStore()
  const isPremium = plan === 'premium'

  const [meals, setMeals] = useLS<Meal[]>('wsx-diet-meals', DEFAULT_MEALS)
  const [supplements, setSupplements] = useLS<SuppEntry[]>('wsx-diet-supps', DEFAULT_SUPPS)
  const [waterMl, setWaterMl] = useLS<number>('wsx-diet-water-ml', 0)
  const [waterGoalMl, setWaterGoalMl] = useLS<number>('wsx-diet-water-goal-ml', 2000)

  useDailyReset(setWaterMl, setSupplements, supplements)
  const [editingWaterGoal, setEditingWaterGoal] = useState(false)
  const [waterGoalInput, setWaterGoalInput] = useState('')
  const [addingMeal, setAddingMeal] = useState(false)
  const [newMealName, setNewMealName] = useState('')
  const [newMealTime, setNewMealTime] = useState('08:00')
  const [showSuppPicker, setShowSuppPicker] = useState(false)
  const [editingSuppDose, setEditingSuppDose] = useState<string | null>(null)
  const [suppDoseInput, setSuppDoseInput] = useState('')
  const [activeTab, setActiveTab] = useState<'refeicoes' | 'suplementos'>('refeicoes')

  const computedGoals = useMemo(() =>
    calculateMacros(weight, height, age, gender, activityLevel, fitnessGoal) ??
    { calories: 2400, protein: 160, carbs: 250, fat: 70 },
    [weight, height, age, gender, activityLevel, fitnessGoal]
  )

  const totals = useMemo(() =>
    meals.reduce((acc, meal) => {
      meal.foods.forEach(f => {
        acc.calories += f.calories
        acc.protein += f.protein
        acc.carbs += f.carbs
        acc.fat += f.fat
      })
      return acc
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 }),
    [meals]
  )

  const addMeal = () => {
    if (!newMealName.trim()) return
    setMeals([...meals, { id: uid(), name: newMealName.trim(), time: newMealTime, foods: [] }])
    setNewMealName(''); setAddingMeal(false)
  }

  const toggleSupp = (id: string) => setSupplements(supplements.map(s => s.id === id ? { ...s, taken: !s.taken } : s))
  const removeSupp = (id: string) => setSupplements(supplements.filter(s => s.id !== id))
  const saveSuppDose = (id: string, dose: string) => {
    setSupplements(supplements.map(s => s.id === id ? { ...s, dose } : s))
    setEditingSuppDose(null)
  }

  const suppsDone = supplements.filter(s => s.taken).length

  return (
    <>
      {showSuppPicker && (
        <SuppPicker
          existingIds={supplements.map(s => s.suppId)}
          isPremium={isPremium}
          onAdd={s => setSupplements([...supplements, s])}
          onClose={() => setShowSuppPicker(false)}
        />
      )}

      <div className="flex flex-col gap-4 pb-nav">
        {/* Header */}
        <div className="px-5 pt-10 pb-2">
          <h1 className="font-syne font-extrabold text-2xl text-t1">Dieta</h1>
          <p className="text-t2 text-sm mt-1">
            {computedGoals.calories > 0 ? `Meta: ${computedGoals.calories} kcal · ${fitnessGoal === 'cutting' ? 'Cutting' : fitnessGoal === 'bulking' ? 'Bulking' : 'Manutenção'}` : 'Configure seu perfil para metas personalizadas'}
          </p>
        </div>

        {/* Macro rings */}
        <div className="mx-5 bg-card border border-white/[0.07] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-bold text-sm text-t1">Macros do dia</h2>
            <span className="font-mono font-bold text-sm" style={{ color: '#FF8C42' }}>{Math.round(totals.calories)} kcal</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <MacroRing value={totals.calories} goal={computedGoals.calories} color="#FF8C42" label="Cal" unit="" />
            <MacroRing value={totals.protein} goal={computedGoals.protein} color="#22D68A" label="Prot" />
            <MacroRing value={totals.carbs} goal={computedGoals.carbs} color="#F5C518" label="Carbo" />
            <MacroRing value={totals.fat} goal={computedGoals.fat} color="#FF6B6B" label="Gord" />
          </div>
          {!weight && (
            <p className="text-center text-[10px] text-t3 mt-3">
              💡 Configure altura/peso no <span className="text-cyan">Perfil</span> para metas automáticas
            </p>
          )}
        </div>

        {/* Water */}
        <div className="mx-5 bg-card border border-white/[0.07] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-syne font-bold text-sm text-t1">💧 Água</h2>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm text-cyan">{waterMl}ml</span>
              <span className="text-t3 text-xs">/</span>
              {editingWaterGoal ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={waterGoalInput}
                    onChange={e => setWaterGoalInput(e.target.value)}
                    onBlur={() => {
                      const n = parseInt(waterGoalInput)
                      if (n >= 250 && n <= 10000) { setWaterGoalMl(n); if (waterMl > n) setWaterMl(n) }
                      setEditingWaterGoal(false)
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                      if (e.key === 'Escape') setEditingWaterGoal(false)
                    }}
                    className="w-16 bg-card2 border border-cyan rounded-lg px-1.5 py-0.5 text-cyan text-xs font-mono text-center outline-none [appearance:textfield]"
                    autoFocus
                  />
                  <span className="text-t3 text-xs">ml</span>
                </div>
              ) : (
                <button
                  onClick={() => { setWaterGoalInput(String(waterGoalMl)); setEditingWaterGoal(true) }}
                  className="flex items-center gap-1 text-t3 text-xs hover:text-cyan transition-colors group"
                >
                  <span>{waterGoalMl}ml</span>
                  <span className="opacity-0 group-hover:opacity-60 transition-opacity text-[10px]">✏️</span>
                </button>
              )}
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{
              width: `${Math.min(waterMl / waterGoalMl, 1) * 100}%`,
              background: 'linear-gradient(90deg, #06D6E8, #00AACC)',
              boxShadow: waterMl > 0 ? '0 0 8px rgba(6,214,232,0.5)' : 'none',
            }} />
          </div>
          {(() => {
            const glasses = Math.round(waterGoalMl / 250)
            const filled = Math.floor(waterMl / 250)
            return (
              <div className="flex gap-1.5 mb-3">
                {Array.from({ length: glasses }).map((_, i) => (
                  <button key={i}
                    onClick={() => { const ml = (i + 1) * 250; setWaterMl(waterMl === ml ? ml - 250 : ml) }}
                    className="h-7 rounded-lg transition-all flex-1"
                    style={{ background: i < filled ? '#06D6E8' : 'rgba(255,255,255,0.07)', boxShadow: i < filled ? '0 0 6px rgba(6,214,232,0.4)' : 'none' }}
                  />
                ))}
              </div>
            )
          })()}
          <div className="flex gap-2">
            <button onClick={() => setWaterMl(Math.max(0, waterMl - 250))}
              className="flex-1 py-2 bg-card2 border border-white/[0.07] rounded-xl text-t2 text-sm hover:border-cyan/30 transition-all">− 250ml</button>
            <button onClick={() => setWaterMl(Math.min(waterGoalMl, waterMl + 250))}
              className="flex-1 py-2 rounded-xl font-bold text-sm text-bg"
              style={{ background: 'linear-gradient(135deg, #06D6E8, #00AACC)' }}>+ 250ml</button>
          </div>
          {waterMl >= waterGoalMl && (
            <p className="text-center text-xs text-green font-bold mt-2" style={{ textShadow: '0 0 8px rgba(34,214,138,0.4)' }}>🎉 Meta atingida!</p>
          )}
        </div>

        {/* Tabs: Refeições / Suplementos */}
        <div className="px-5">
          <div className="flex gap-1 bg-card border border-white/[0.07] rounded-xl p-1 mb-4">
            {(['refeicoes', 'suplementos'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t ? 'bg-cyan text-bg' : 'text-t3'}`}>
                {t === 'refeicoes' ? '🍽 Refeições' : `💊 Suplementos${suppsDone > 0 ? ` (${suppsDone}/${supplements.length})` : ''}`}
              </button>
            ))}
          </div>

          {/* Refeições */}
          {activeTab === 'refeicoes' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-t3">{meals.reduce((s, m) => s + m.foods.length, 0)} alimentos registrados</p>
                <button onClick={() => setAddingMeal(v => !v)} className="text-xs text-cyan font-bold">+ Nova refeição</button>
              </div>

              {addingMeal && (
                <div className="bg-card border border-cyan/30 rounded-2xl p-3 flex flex-col gap-2">
                  <input value={newMealName} onChange={e => setNewMealName(e.target.value)}
                    placeholder="Nome (ex: Lanche da tarde)"
                    className="w-full bg-card2 border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-t1 outline-none focus:border-cyan placeholder:text-t3" />
                  <input type="time" value={newMealTime} onChange={e => setNewMealTime(e.target.value)}
                    className="w-full bg-card2 border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-t1 outline-none focus:border-cyan" />
                  <div className="flex gap-2">
                    <button onClick={addMeal} className="flex-1 py-2 bg-cyan text-bg rounded-xl font-bold text-sm">Criar</button>
                    <button onClick={() => setAddingMeal(false)} className="flex-1 py-2 bg-card border border-white/[0.07] text-t2 rounded-xl font-bold text-sm">Cancelar</button>
                  </div>
                </div>
              )}

              {meals.map(meal => (
                <MealCard key={meal.id} meal={meal} isPremium={isPremium}
                  onUpdate={updated => setMeals(meals.map(m => m.id === updated.id ? updated : m))}
                  onRemove={() => setMeals(meals.filter(m => m.id !== meal.id))}
                />
              ))}
            </div>
          )}

          {/* Suplementos */}
          {activeTab === 'suplementos' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-t3">{suppsDone}/{supplements.length} tomados hoje</p>
                <button onClick={() => setShowSuppPicker(true)} className="text-xs text-cyan font-bold">+ Adicionar</button>
              </div>

              {/* Progress */}
              {supplements.length > 0 && (
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{
                    width: `${(suppsDone / supplements.length) * 100}%`,
                    background: 'linear-gradient(90deg, #22D68A, #06D6E8)',
                  }} />
                </div>
              )}

              <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
                {supplements.length === 0 && (
                  <p className="text-t3 text-sm text-center py-8">Nenhum suplemento adicionado</p>
                )}
                {supplements.map((s, i) => (
                  <div key={s.id} className={`flex items-center gap-3 px-4 py-3 ${i < supplements.length - 1 ? 'border-b border-white/[0.07]' : ''}`}>
                    <button onClick={() => toggleSupp(s.id)}
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${s.taken ? 'bg-green border-green text-bg' : 'border-white/[0.12]'}`}>
                      {s.taken ? '✓' : ''}
                    </button>
                    <span className="text-lg flex-shrink-0">{s.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${s.taken ? 'text-t3 line-through' : 'text-t1'}`}>{s.name}</p>
                      {editingSuppDose === s.id ? (
                        <input
                          value={suppDoseInput}
                          onChange={e => setSuppDoseInput(e.target.value)}
                          onBlur={() => saveSuppDose(s.id, suppDoseInput || s.dose)}
                          onKeyDown={e => { if (e.key === 'Enter') saveSuppDose(s.id, suppDoseInput || s.dose) }}
                          className="text-xs bg-bg/40 border border-cyan rounded px-1 py-0.5 text-cyan outline-none w-20"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => { setSuppDoseInput(s.dose); setEditingSuppDose(s.id) }}
                          className="text-xs text-t3 hover:text-cyan transition-colors"
                        >
                          {s.dose} · {s.timing} <span className="opacity-50">✏️</span>
                        </button>
                      )}
                    </div>
                    <button onClick={() => removeSupp(s.id)} className="text-t3 hover:text-coral text-xs px-1">✕</button>
                  </div>
                ))}
              </div>

              {suppsDone === supplements.length && supplements.length > 0 && (
                <p className="text-center text-xs text-green font-bold" style={{ textShadow: '0 0 8px rgba(34,214,138,0.4)' }}>
                  🎉 Todos os suplementos tomados!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
