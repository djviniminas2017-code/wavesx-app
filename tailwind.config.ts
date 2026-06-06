import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080B14',
        bg2: '#0C1020',
        card: '#111827',
        card2: '#161F34',
        cyan: {
          DEFAULT: '#06D6E8',
          dark: '#00AACC',
        },
        gold: '#F5C518',
        green: '#22D68A',
        coral: '#FF6B6B',
        purple: '#A78BFA',
        t1: '#EDF1FA',
        t2: '#8892A4',
        t3: '#4A5568',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.07)',
      },
      boxShadow: {
        'glow-cyan':   '0 0 20px rgba(6,214,232,0.3),  0 0 60px rgba(6,214,232,0.1)',
        'glow-gold':   '0 0 20px rgba(245,197,24,0.3),  0 0 60px rgba(245,197,24,0.1)',
        'glow-green':  '0 0 20px rgba(34,214,138,0.3), 0 0 60px rgba(34,214,138,0.1)',
        'glow-coral':  '0 0 20px rgba(255,107,107,0.3), 0 0 60px rgba(255,107,107,0.1)',
        'glow-purple': '0 0 20px rgba(167,139,250,0.3), 0 0 60px rgba(167,139,250,0.1)',
        'depth':  '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
        'depth-sm': '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'card-gradient': 'linear-gradient(145deg, #161F34, #111827)',
        'cyan-gradient': 'linear-gradient(135deg, #06D6E8, #00AACC)',
        'gold-gradient': 'linear-gradient(135deg, #F5C518, #D4A800)',
        'green-gradient': 'linear-gradient(135deg, #22D68A, #16B870)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'aurora': 'aurora-drift 20s ease-in-out infinite alternate',
        'fade-up': 'fade-up 0.4s ease forwards',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
