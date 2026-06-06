import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
      <p className="text-5xl mb-4">🌊</p>
      <h1 className="font-syne font-bold text-t1 text-xl mb-2">Página não encontrada</h1>
      <p className="text-t2 text-sm mb-6">Essa onda já passou...</p>
      <Link href="/" className="px-6 py-3 bg-cyan text-bg rounded-xl font-syne font-bold text-sm">
        Voltar ao início
      </Link>
    </div>
  )
}
