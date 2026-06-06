'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/',        icon: '🏠', label: 'Home' },
  { href: '/workout', icon: '🏋️', label: 'Treino' },
  { href: '/diet',    icon: '🍽️', label: 'Dieta' },
  { href: '/surf',    icon: '🌊', label: 'Surf' },
  { href: '/profile', icon: '👤', label: 'Perfil' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50"
      style={{ filter: 'drop-shadow(0 -8px 32px rgba(0,0,0,0.5))' }}
    >
      {/* top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div
        className="flex items-center justify-around px-2 pb-safe"
        style={{
          background: 'rgba(8,11,20,0.88)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          height: 68,
        }}
      >
        {tabs.map((tab) => {
          const active =
            tab.href === '/'
              ? pathname === '/'
              : pathname === tab.href || pathname.startsWith(tab.href + '/')

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center gap-0.5 py-2 flex-1 group"
            >
              {/* active background pill */}
              {active && (
                <span
                  className="absolute top-1 left-1/2 -translate-x-1/2 rounded-2xl"
                  style={{
                    width: 44,
                    height: 36,
                    background: 'radial-gradient(ellipse at 50% 40%, rgba(6,214,232,0.18), rgba(6,214,232,0.04))',
                    border: '1px solid rgba(6,214,232,0.2)',
                    boxShadow: '0 0 16px rgba(6,214,232,0.2), inset 0 1px 0 rgba(6,214,232,0.2)',
                  }}
                />
              )}

              {/* icon */}
              <span
                className="relative z-10 leading-none transition-all duration-200"
                style={{
                  fontSize: 20,
                  filter: active
                    ? 'drop-shadow(0 0 8px rgba(6,214,232,0.8)) drop-shadow(0 0 16px rgba(6,214,232,0.4))'
                    : 'none',
                  transform: active ? 'scale(1.15) translateY(-1px)' : 'scale(1)',
                  display: 'block',
                  transition: 'transform 0.2s ease, filter 0.2s ease',
                }}
              >
                {tab.icon}
              </span>

              {/* label */}
              <span
                className="relative z-10 text-[9px] font-bold tracking-widest uppercase leading-none transition-all duration-200"
                style={{
                  color: active ? '#06D6E8' : 'rgba(74,85,104,0.8)',
                  textShadow: active ? '0 0 10px rgba(6,214,232,0.5)' : 'none',
                }}
              >
                {tab.label}
              </span>

              {/* active dot pip */}
              {active && (
                <span
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    width: 20,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, #06D6E8, transparent)',
                    boxShadow: '0 0 6px rgba(6,214,232,0.8)',
                  }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
