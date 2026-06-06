'use client'

import { useState, useEffect } from 'react'
import { useUserStore } from '@/store/userStore'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function PasswordInput({ value, onChange, placeholder, onEnter }: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  onEnter?: () => void
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg/60 border border-white/[0.07] rounded-xl px-3 py-3 pr-10 text-sm text-t1 outline-none focus:border-cyan placeholder:text-t3 transition-colors"
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-t3 hover:text-t1 transition-colors"
        tabIndex={-1}
      >
        <EyeIcon open={show} />
      </button>
    </div>
  )
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, login, setPlan } = useUserStore()
  const [hydrated, setHydrated] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const existing = localStorage.getItem('wsx-accounts')
    const accounts: Record<string, string> = existing ? JSON.parse(existing) : {}
    if (!accounts['djviniminas2017@gmail.com']) {
      accounts['djviniminas2017@gmail.com'] = 'wavesx2024'
      localStorage.setItem('wsx-accounts', JSON.stringify(accounts))
    }
    setHydrated(true)
  }, [])

  if (!hydrated) return null
  if (isLoggedIn) return <>{children}</>

  const DEV_EMAILS = ['djviniminas2017@gmail.com']

  const getAccounts = (): Record<string, string> => {
    const existing = localStorage.getItem('wsx-accounts')
    const accounts: Record<string, string> = existing ? JSON.parse(existing) : {}
    if (!accounts['djviniminas2017@gmail.com']) {
      accounts['djviniminas2017@gmail.com'] = 'wavesx2024'
      localStorage.setItem('wsx-accounts', JSON.stringify(accounts))
    }
    return accounts
  }

  const handleSubmit = () => {
    setError('')
    const emailNorm = email.trim().toLowerCase()
    if (!emailNorm.includes('@') || !emailNorm.includes('.')) { setError('Email inválido'); return }
    if (password.length < 6) { setError('Senha mínima de 6 caracteres'); return }

    const accounts = getAccounts()

    if (mode === 'register') {
      if (emailNorm !== emailConfirm.trim().toLowerCase()) { setError('Os emails não conferem'); return }
      if (password !== confirm) { setError('As senhas não conferem'); return }
      if (accounts[emailNorm]) { setError('Email já cadastrado'); return }
      accounts[emailNorm] = password
      localStorage.setItem('wsx-accounts', JSON.stringify(accounts))
    } else {
      if (!accounts[emailNorm] || accounts[emailNorm] !== password) {
        setError('Email ou senha incorretos')
        return
      }
    }
    login(emailNorm)
    if (DEV_EMAILS.includes(emailNorm)) {
      setPlan('premium')
    }
  }

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login')
    setError('')
    setEmail('')
    setEmailConfirm('')
    setPassword('')
    setConfirm('')
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#060810] aurora-bg grain z-50 overflow-y-auto">
      <div className="w-full max-w-sm px-6 py-8 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="text-center mb-2">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #06D6E8, #A78BFA)' }}>
            🌊
          </div>
          <h1 className="font-syne font-extrabold text-2xl text-t1 tracking-tight">waveSX</h1>
          <p className="text-t3 text-sm mt-1">surf &amp; treino</p>
        </div>

        {/* Card */}
        <div className="w-full bg-card border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-4">
          <h2 className="font-syne font-bold text-t1 text-lg">
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </h2>

          <div className="flex flex-col gap-3">
            {/* Email */}
            <div>
              <label className="text-[10px] text-t3 uppercase tracking-widest mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-bg/60 border border-white/[0.07] rounded-xl px-3 py-3 text-sm text-t1 outline-none focus:border-cyan placeholder:text-t3 transition-colors"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {/* Email confirmation — only on register */}
            {mode === 'register' && (
              <div>
                <label className="text-[10px] text-t3 uppercase tracking-widest mb-1 block">Confirmar email</label>
                <input
                  type="email"
                  value={emailConfirm}
                  onChange={e => setEmailConfirm(e.target.value)}
                  placeholder="seu@email.com"
                  className={`w-full bg-bg/60 border rounded-xl px-3 py-3 text-sm text-t1 outline-none focus:border-cyan placeholder:text-t3 transition-colors ${
                    emailConfirm && email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase()
                      ? 'border-coral/60'
                      : emailConfirm && email.trim().toLowerCase() === emailConfirm.trim().toLowerCase()
                      ? 'border-green/50'
                      : 'border-white/[0.07]'
                  }`}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                {emailConfirm && email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase() && (
                  <p className="text-coral text-[10px] mt-1">Os emails não conferem</p>
                )}
                {emailConfirm && email.trim().toLowerCase() === emailConfirm.trim().toLowerCase() && (
                  <p className="text-green text-[10px] mt-1">✓ Emails conferem</p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="text-[10px] text-t3 uppercase tracking-widest mb-1 block">Senha</label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="mínimo 6 caracteres"
                onEnter={mode === 'login' ? handleSubmit : undefined}
              />
            </div>

            {/* Password confirmation — only on register */}
            {mode === 'register' && (
              <div>
                <label className="text-[10px] text-t3 uppercase tracking-widest mb-1 block">Confirmar senha</label>
                <PasswordInput
                  value={confirm}
                  onChange={setConfirm}
                  placeholder="repita a senha"
                  onEnter={handleSubmit}
                />
                {confirm && password !== confirm && (
                  <p className="text-coral text-[10px] mt-1">As senhas não conferem</p>
                )}
                {confirm && password === confirm && confirm.length >= 6 && (
                  <p className="text-green text-[10px] mt-1">✓ Senhas conferem</p>
                )}
              </div>
            )}
          </div>

          {error && <p className="text-coral text-xs text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl font-syne font-bold text-sm text-bg transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #06D6E8, #00AACC)' }}
          >
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </div>

        <button
          onClick={switchMode}
          className="text-t3 text-sm hover:text-cyan transition-colors"
        >
          {mode === 'login' ? 'Não tem conta? Criar agora' : 'Já tenho conta — Entrar'}
        </button>
      </div>
    </div>
  )
}
