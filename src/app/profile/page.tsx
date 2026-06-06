'use client'

import { useState } from 'react'
import { usePreferencesStore } from '@/store/preferencesStore'
import { useWorkoutStore } from '@/store/workoutStore'
import { useUserStore, calculateMacros, PROMO_CODES, type Gender, type ActivityLevel, type FitnessGoal } from '@/store/userStore'
import Link from 'next/link'

// ── helpers ───────────────────────────────────────────────────────────────────

const SURF_LEVELS = ['Iniciante', 'Intermediário', 'Avançado', 'Pro']

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentário',
  light: 'Levemente ativo',
  moderate: 'Moderado',
  active: 'Muito ativo',
  very_active: 'Atleta',
}

const GOAL_LABELS: Record<FitnessGoal, { label: string; color: string; desc: string }> = {
  cutting:  { label: 'Cutting',    color: '#FF6B6B', desc: '−400 kcal/dia' },
  maintain: { label: 'Manutenção', color: '#06D6E8', desc: 'TDEE normal' },
  bulking:  { label: 'Bulking',    color: '#22D68A', desc: '+400 kcal/dia' },
}

// ── Section toggle ────────────────────────────────────────────────────────────

function SectionHeader({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-3 text-left"
    >
      <h2 className="font-syne font-bold text-t1 text-sm">{label}</h2>
      <span className={`text-t3 text-xs transition-transform ${active ? 'rotate-180' : ''}`}>▼</span>
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const prefs = usePreferencesStore()
  const { history } = useWorkoutStore()
  const user = useUserStore()

  const [openSection, setOpenSection] = useState<string>('perfil')
  const toggle = (s: string) => setOpenSection(o => o === s ? '' : s)

  // Name edit
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(prefs.name)
  const saveName = () => { if (nameInput.trim()) prefs.setName(nameInput.trim()); setEditingName(false) }

  // Body data form
  const [bodyEditing, setBodyEditing] = useState(false)
  const [bodyForm, setBodyForm] = useState({
    height: user.height || '',
    weight: user.weight || '',
    age: user.age || '',
    gender: (user.gender || '') as Gender | '',
    activityLevel: user.activityLevel,
    fitnessGoal: user.fitnessGoal,
  })

  const saveBody = () => {
    user.setBodyData({
      height: Number(bodyForm.height),
      weight: Number(bodyForm.weight),
      age: Number(bodyForm.age),
      gender: bodyForm.gender as Gender || null,
      activityLevel: bodyForm.activityLevel,
      fitnessGoal: bodyForm.fitnessGoal,
    })
    setBodyEditing(false)
  }

  // Subscription
  const [promoInput, setPromoInput] = useState('')
  const [promoMsg, setPromoMsg] = useState('')

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    const plan = PROMO_CODES[code]
    if (plan) {
      user.setPlan(plan)
      user.setPromoCode(code)
      setPromoMsg('✓ Código aplicado! Acesso Premium liberado.')
      setPromoInput('')
    } else {
      setPromoMsg('Código inválido. Tente novamente.')
    }
  }

  // Stats
  const totalWorkouts = history.length
  const totalVolume = history.reduce((s, w) => s + w.totalVolume, 0)
  const totalMinutes = history.reduce((s, w) => s + w.durationMinutes, 0)
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0

  // Computed macros
  const macros = calculateMacros(
    user.weight, user.height, user.age, user.gender,
    user.activityLevel, user.fitnessGoal
  )

  const isPremium = user.plan === 'premium'

  return (
    <div className="flex flex-col pb-nav">
      {/* Header */}
      <div className="px-5 pt-10 pb-4">
        <h1 className="font-syne font-extrabold text-2xl text-t1">Perfil</h1>
        {isPremium && (
          <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 bg-gold/15 border border-gold/30 rounded-full text-[10px] text-gold font-bold uppercase tracking-widest">
            ⭐ Premium
          </span>
        )}
      </div>

      {/* ── Meu Perfil ──────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.05]">
        <SectionHeader label="👤 Meu Perfil" active={openSection === 'perfil'} onToggle={() => toggle('perfil')} />
        {openSection === 'perfil' && (
          <div className="px-5 pb-5 flex flex-col gap-4">
            {/* Avatar */}
            <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-syne font-extrabold text-bg text-2xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #06D6E8, #A78BFA)' }}>
                  {(prefs.name[0] || 'U').toUpperCase()}
                </div>
                <div className="flex-1">
                  {editingName ? (
                    <div className="flex gap-2">
                      <input value={nameInput} onChange={e => setNameInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveName() }}
                        className="flex-1 bg-card2 border border-cyan rounded-xl px-3 py-2 text-t1 text-sm outline-none"
                        autoFocus />
                      <button onClick={saveName} className="px-3 py-2 bg-cyan text-bg rounded-xl text-sm font-bold">OK</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-syne font-bold text-t1 text-lg">{prefs.name}</p>
                      <button onClick={() => { setNameInput(prefs.name); setEditingName(true) }} className="text-t3 text-xs hover:text-t1">✏️</button>
                    </div>
                  )}
                  <p className="text-t3 text-xs mt-1">{user.email}</p>
                  <p className="text-t3 text-[10px]">Atleta waveSX · {isPremium ? '⭐ Premium' : 'Gratuito'}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.07]">
                {[
                  [totalWorkouts, 'Treinos'],
                  [totalVolume > 0 ? `${Math.round(totalVolume / 1000)}k` : '0', 'Vol. kg'],
                  [avgDuration > 0 ? `${avgDuration}min` : '—', 'Duração'],
                ].map(([v, l]) => (
                  <div key={String(l)} className="text-center">
                    <p className="font-mono font-bold text-lg text-cyan">{v}</p>
                    <p className="text-[10px] text-t3 uppercase tracking-widest mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Surf level */}
            <div className="bg-card border border-white/[0.07] rounded-2xl p-4">
              <p className="text-xs text-t3 uppercase tracking-widest mb-2">Nível no Surf</p>
              <div className="flex flex-wrap gap-2">
                {SURF_LEVELS.map(l => (
                  <button key={l} onClick={() => prefs.setSurfLevel(l)}
                    className={`px-4 py-1.5 rounded-xl font-semibold text-sm transition-all ${prefs.surfLevel === l ? 'bg-cyan text-bg' : 'bg-card2 border border-white/[0.07] text-t2'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-col gap-2">
              {[
                { href: '/history', icon: '📋', label: 'Histórico de treinos', sub: `${totalWorkouts} sessões` },
                { href: '/progress', icon: '📈', label: 'Gráficos de progresso', sub: 'Volume, força, frequência' },
                { href: '/routines', icon: '⚡', label: 'Rotinas salvas', sub: isPremium ? 'Ilimitadas' : '2 rotinas (free)' },
                { href: '/exercises', icon: '🔍', label: 'Biblioteca de exercícios', sub: '40+ exercícios' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 bg-card border border-white/[0.07] rounded-2xl px-4 py-3.5 hover:border-cyan/30 transition-all">
                  <span className="text-xl w-8 text-center">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-t1">{item.label}</p>
                    <p className="text-xs text-t3 mt-0.5">{item.sub}</p>
                  </div>
                  <span className="text-t3 text-sm">›</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Dados Físicos ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.05]">
        <SectionHeader label="📏 Dados Físicos & Metas" active={openSection === 'corpo'} onToggle={() => toggle('corpo')} />
        {openSection === 'corpo' && (
          <div className="px-5 pb-5 flex flex-col gap-4">
            {/* Computed macros (if data filled) */}
            {macros && !bodyEditing && (
              <div className="bg-card border border-white/[0.07] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-t3 uppercase tracking-widest">Metas calculadas</p>
                  <span className="text-[10px] text-cyan font-semibold">{GOAL_LABELS[user.fitnessGoal].label}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Calorias', value: macros.calories, unit: 'kcal', color: '#FF8C42' },
                    { label: 'Proteína', value: macros.protein, unit: 'g', color: '#22D68A' },
                    { label: 'Carbo', value: macros.carbs, unit: 'g', color: '#F5C518' },
                    { label: 'Gordura', value: macros.fat, unit: 'g', color: '#FF6B6B' },
                  ].map(m => (
                    <div key={m.label} className="text-center bg-bg/40 rounded-xl py-2">
                      <p className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.value}</p>
                      <p className="text-[9px] text-t3">{m.unit}</p>
                      <p className="text-[9px] text-t3">{m.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-t3 text-center mt-2">Atualiza automaticamente na aba Dieta</p>
              </div>
            )}

            {/* Current data summary */}
            {!bodyEditing && (user.weight > 0 || user.height > 0) && (
              <div className="bg-card border border-white/[0.07] rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-t3 uppercase tracking-widest">Seus dados</p>
                  <button onClick={() => setBodyEditing(true)} className="text-xs text-cyan font-semibold">Editar</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    [user.height ? `${user.height}cm` : '—', 'Altura'],
                    [user.weight ? `${user.weight}kg` : '—', 'Peso'],
                    [user.age ? `${user.age}a` : '—', 'Idade'],
                  ].map(([v, l]) => (
                    <div key={String(l)} className="text-center">
                      <p className="font-mono font-bold text-t1">{v}</p>
                      <p className="text-[10px] text-t3">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] bg-card2 border border-white/[0.07] rounded-lg px-2 py-1 text-t2">{user.gender === 'M' ? 'Masculino' : user.gender === 'F' ? 'Feminino' : '—'}</span>
                  <span className="text-[10px] bg-card2 border border-white/[0.07] rounded-lg px-2 py-1 text-t2">{ACTIVITY_LABELS[user.activityLevel]}</span>
                  <span className="text-[10px] rounded-lg px-2 py-1 font-semibold" style={{ background: GOAL_LABELS[user.fitnessGoal].color + '20', color: GOAL_LABELS[user.fitnessGoal].color }}>
                    {GOAL_LABELS[user.fitnessGoal].label}
                  </span>
                </div>
              </div>
            )}

            {/* Body form */}
            {(bodyEditing || (user.weight === 0 && user.height === 0)) && (
              <div className="bg-card border border-cyan/20 rounded-2xl p-4 flex flex-col gap-4">
                <p className="text-sm font-syne font-bold text-t1">
                  {user.weight === 0 ? 'Configure seus dados' : 'Editar dados físicos'}
                </p>

                {/* Gender */}
                <div>
                  <label className="text-[10px] text-t3 uppercase tracking-widest mb-2 block">Sexo biológico</label>
                  <div className="flex gap-2">
                    {([['M', 'Masculino'], ['F', 'Feminino']] as [Gender, string][]).map(([g, l]) => (
                      <button key={g} onClick={() => setBodyForm(f => ({ ...f, gender: g }))}
                        className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${bodyForm.gender === g ? 'bg-cyan text-bg' : 'bg-card2 border border-white/[0.07] text-t2'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Height / Weight / Age */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['height', 'Altura (cm)', 'ex: 175'],
                    ['weight', 'Peso (kg)', 'ex: 75'],
                    ['age', 'Idade', 'ex: 25'],
                  ].map(([k, label, ph]) => (
                    <div key={k}>
                      <label className="text-[10px] text-t3 uppercase tracking-widest mb-1 block">{label}</label>
                      <input
                        type="number"
                        value={(bodyForm as Record<string, string | number>)[k]}
                        onChange={e => setBodyForm(f => ({ ...f, [k]: e.target.value }))}
                        placeholder={ph}
                        className="w-full bg-bg/60 border border-white/[0.07] rounded-xl px-2 py-2 text-sm text-t1 outline-none focus:border-cyan [appearance:textfield] placeholder:text-t3"
                      />
                    </div>
                  ))}
                </div>

                {/* Activity */}
                <div>
                  <label className="text-[10px] text-t3 uppercase tracking-widest mb-2 block">Nível de atividade</label>
                  <div className="flex flex-col gap-1.5">
                    {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]).map(([k, l]) => (
                      <button key={k} onClick={() => setBodyForm(f => ({ ...f, activityLevel: k }))}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${bodyForm.activityLevel === k ? 'bg-cyan/20 border border-cyan text-cyan' : 'bg-card2 border border-white/[0.07] text-t2'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal */}
                <div>
                  <label className="text-[10px] text-t3 uppercase tracking-widest mb-2 block">Objetivo</label>
                  <div className="flex flex-col gap-1.5">
                    {(Object.entries(GOAL_LABELS) as [FitnessGoal, typeof GOAL_LABELS[FitnessGoal]][]).map(([k, v]) => (
                      <button key={k} onClick={() => setBodyForm(f => ({ ...f, fitnessGoal: k }))}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between ${bodyForm.fitnessGoal === k ? 'border' : 'bg-card2 border border-white/[0.07] text-t2'}`}
                        style={bodyForm.fitnessGoal === k ? { borderColor: v.color, background: v.color + '15', color: v.color } : {}}>
                        <span>{v.label}</span>
                        <span className="opacity-70">{v.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={saveBody}
                  className="w-full py-3 rounded-xl font-syne font-bold text-sm text-bg"
                  style={{ background: 'linear-gradient(135deg, #06D6E8, #00AACC)' }}>
                  Salvar e calcular metas
                </button>
              </div>
            )}

            {/* BMI indicator */}
            {user.weight > 0 && user.height > 0 && (() => {
              const bmi = user.weight / ((user.height / 100) ** 2)
              const cat = bmi < 18.5 ? ['Abaixo do peso', '#06D6E8'] : bmi < 25 ? ['Peso normal', '#22D68A'] : bmi < 30 ? ['Sobrepeso', '#F5C518'] : ['Obesidade', '#FF6B6B']
              return (
                <div className="bg-card border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-mono font-bold text-2xl" style={{ color: cat[1] }}>{bmi.toFixed(1)}</p>
                    <p className="text-[9px] text-t3 uppercase tracking-widest">IMC</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: cat[1] }}>{cat[0]}</p>
                    <p className="text-[10px] text-t3">Índice de Massa Corporal</p>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* ── Assinatura ───────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.05]">
        <SectionHeader label="⭐ Assinatura" active={openSection === 'assinatura'} onToggle={() => toggle('assinatura')} />
        {openSection === 'assinatura' && (
          <div className="px-5 pb-5 flex flex-col gap-4">
            {isPremium ? (
              <div className="bg-gold/10 border border-gold/30 rounded-2xl p-5 text-center">
                <p className="text-3xl mb-2">⭐</p>
                <p className="font-syne font-bold text-gold text-lg">Você é Premium!</p>
                <p className="text-t3 text-sm mt-1">Todos os recursos desbloqueados</p>
              </div>
            ) : (
              <>
                {/* Plan comparison */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Free */}
                  <div className="bg-card border border-white/[0.07] rounded-2xl p-4">
                    <p className="font-syne font-bold text-t1 text-sm mb-1">Gratuito</p>
                    <p className="font-mono text-xl font-bold text-t1 mb-3">R$ 0</p>
                    {[
                      '2 rotinas de treino',
                      '10 alimentos base',
                      'Spots SC + SP',
                      '5 suplementos',
                      'Perfil básico',
                    ].map(f => (
                      <div key={f} className="flex items-start gap-1.5 mb-1.5">
                        <span className="text-[10px] text-t3 mt-0.5">✓</span>
                        <p className="text-[10px] text-t3">{f}</p>
                      </div>
                    ))}
                  </div>

                  {/* Premium */}
                  <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4 relative">
                    <div className="absolute -top-2 right-3 bg-gold text-bg text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Popular</div>
                    <p className="font-syne font-bold text-gold text-sm mb-1">Premium</p>
                    <div className="mb-3">
                      <p className="font-mono text-xl font-bold text-gold">R$ 10</p>
                      <p className="text-[9px] text-t3">/mês</p>
                    </div>
                    {[
                      'Rotinas ilimitadas',
                      '+70 alimentos',
                      '60+ spots Brasil',
                      '20 suplementos',
                      'Calculadora de macros',
                      'Gráficos avançados',
                    ].map(f => (
                      <div key={f} className="flex items-start gap-1.5 mb-1.5">
                        <span className="text-[10px] text-gold mt-0.5">✓</span>
                        <p className="text-[10px] text-t1">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscribe CTA */}
                <button className="w-full py-3.5 rounded-xl font-syne font-bold text-bg text-sm"
                  style={{ background: 'linear-gradient(135deg, #F5C518, #E6A800)' }}
                  onClick={() => alert('Em breve! Pagamento via Pix/cartão. Use um código promocional por enquanto.')}>
                  ⭐ Assinar por R$ 10/mês
                </button>

                {/* Promo code */}
                <div className="bg-card border border-white/[0.07] rounded-2xl p-4">
                  <p className="text-xs text-t3 uppercase tracking-widest mb-2">Código promocional</p>
                  <div className="flex gap-2">
                    <input
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Ex: WAVEPRO"
                      className="flex-1 bg-bg/60 border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-t1 outline-none focus:border-cyan placeholder:text-t3 font-mono uppercase"
                      onKeyDown={e => e.key === 'Enter' && applyPromo()}
                    />
                    <button onClick={applyPromo}
                      className="px-4 py-2 rounded-xl font-bold text-sm text-bg"
                      style={{ background: 'linear-gradient(135deg, #06D6E8, #00AACC)' }}>
                      Aplicar
                    </button>
                  </div>
                  {promoMsg && (
                    <p className={`text-xs mt-2 ${promoMsg.startsWith('✓') ? 'text-green' : 'text-coral'}`}>{promoMsg}</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Configurações ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.05]">
        <SectionHeader label="⚙️ Configurações" active={openSection === 'config'} onToggle={() => toggle('config')} />
        {openSection === 'config' && (
          <div className="px-5 pb-5 flex flex-col gap-3">
            {/* Weight unit */}
            <div className="bg-card border border-white/[0.07] rounded-2xl p-4">
              <p className="text-xs text-t3 uppercase tracking-widest mb-2">Unidade de peso nos treinos</p>
              <div className="flex gap-2">
                {(['kg', 'lbs'] as const).map(u => (
                  <button key={u} onClick={() => prefs.setWeightUnit(u)}
                    className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${prefs.weightUnit === u ? 'bg-cyan text-bg' : 'bg-card2 border border-white/[0.07] text-t2'}`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Skate level */}
            <div className="bg-card border border-white/[0.07] rounded-2xl p-4">
              <p className="text-xs text-t3 uppercase tracking-widest mb-2">Nível no Surfskate</p>
              <div className="flex flex-wrap gap-2">
                {['Iniciante', 'Intermediário', 'Avançado'].map(l => (
                  <button key={l} onClick={() => prefs.setSkateLevel(l)}
                    className={`px-4 py-1.5 rounded-xl font-semibold text-sm transition-all ${prefs.skateLevel === l ? 'bg-gold text-bg' : 'bg-card2 border border-white/[0.07] text-t2'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => { if (confirm('Sair da conta?')) user.logout() }}
              className="w-full py-3 border border-coral/30 text-coral rounded-xl text-sm font-semibold hover:bg-coral/10 transition-colors">
              Sair da conta
            </button>
          </div>
        )}
      </div>

      {/* ── Suporte ──────────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.05]">
        <SectionHeader label="💬 Suporte & Contato" active={openSection === 'suporte'} onToggle={() => toggle('suporte')} />
        {openSection === 'suporte' && (
          <div className="px-5 pb-5 flex flex-col gap-3">
            {[
              { icon: '📧', label: 'Reportar problema', sub: 'suporte@wavesx.app', action: () => window.open('mailto:suporte@wavesx.app?subject=Problema no waveSX') },
              { icon: '📷', label: 'Instagram', sub: '@wavesx.app', action: () => window.open('https://instagram.com/wavesx.app') },
              { icon: '⭐', label: 'Avaliar o app', sub: 'Deixe sua avaliação', action: () => alert('Em breve na App Store / Google Play!') },
              { icon: '🔒', label: 'Política de privacidade', sub: 'Seus dados, sua privacidade', action: () => alert('Seus dados ficam somente no seu dispositivo. Sem coleta de dados pessoais.') },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                className="flex items-center gap-3 bg-card border border-white/[0.07] rounded-2xl px-4 py-3.5 hover:border-cyan/30 transition-all w-full text-left">
                <span className="text-xl w-8 text-center">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-t1">{item.label}</p>
                  <p className="text-xs text-t3 mt-0.5">{item.sub}</p>
                </div>
                <span className="text-t3 text-sm">›</span>
              </button>
            ))}

            <div className="text-center pt-2">
              <p className="text-[10px] text-t3">waveSX v2.0.0 · surf &amp; treino</p>
              <p className="text-[10px] text-t3 mt-1">Feito com 🌊 para surfistas e atletas</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
