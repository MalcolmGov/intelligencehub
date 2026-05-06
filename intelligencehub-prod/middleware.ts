import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn  = !!req.auth
  const { pathname } = req.nextUrl
  const isLoginPage = pathname.startsWith('/login')
  const isApiAuth   = pathname.startsWith('/api/auth')
  const isPublic    = isLoginPage || isApiAuth

  // Unauthenticated users on protected routes → login
  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Logged-in users hitting /login → dashboard
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  // Exclude static assets, public files, and the hub HTML prototype from middleware
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|prototypes|docs|screenshots|hub\\.html|$).*)'],
}
