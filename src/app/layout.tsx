import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans, Space_Mono } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/layout/BottomNav'
import StoreHydration from './StoreHydration'
import AuthGate from '@/components/AuthGate'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'waveSX — surf & treino',
  description: 'Treine como atleta. Surfe como profissional.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'waveSX',
    startupImage: [{ url: '/icons/apple-touch-icon.png' }],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#060810',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${syne.variable} ${dmSans.variable} ${spaceMono.variable} font-dm bg-[#060810] min-h-screen flex justify-center aurora-bg grain`}
      >
        <StoreHydration />
        <AuthGate>
          <div className="relative z-10 w-full max-w-md bg-bg h-screen flex flex-col" style={{boxShadow:'0 0 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)'}}>
            <main className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pb-nav">
              {children}
            </main>
            <BottomNav />
          </div>
        </AuthGate>
      </body>
    </html>
  )
}
