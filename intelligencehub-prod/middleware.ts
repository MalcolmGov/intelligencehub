import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn  = !!req.auth
  const { pathname } = req.nextUrl
  const isLoginPage = pathname.startsWith('/login')
  const isApiAuth   = pathname.startsWith('/api/auth')

  // Root always serves the HTML landing page — rewrite keeps URL as "/"
  if (pathname === '/') {
    return NextResponse.rewrite(new URL('/hub.html', req.nextUrl.origin))
  }

  const isPublic = isLoginPage || isApiAuth

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
  // Exclude static assets and public files; root "/" is handled above via rewrite
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|prototypes|docs|screenshots|hub\\.html).*)'],
}
