import { type NextRequest, NextResponse } from 'next/server'

// Middleware simples — Supabase auth desativado (app usa localStorage)
export function middleware(request: NextRequest) {
  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
