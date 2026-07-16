import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — do not remove this
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isDashboardRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/work-orders') ||
    pathname.startsWith('/customers') ||
    pathname.startsWith('/vehicles') ||
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/payments') ||
    pathname.startsWith('/technicians') ||
    pathname.startsWith('/estimates') ||
    pathname.startsWith('/inspections') ||
    pathname.startsWith('/calendar') ||
    pathname.startsWith('/purchase-orders') ||
    pathname.startsWith('/reports') ||
    pathname.startsWith('/communications') ||
    pathname.startsWith('/marketing') ||
    pathname.startsWith('/settings')

  const isAdminRoute = pathname.startsWith('/admin')

  // Must be logged in to access any protected route
  if ((isDashboardRoute || isAdminRoute) && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Admin routes require platform_admin role
  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'platform_admin') {
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = '/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // Redirect logged-in users away from login — send to correct home based on role
  if (pathname === '/login' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const dest = request.nextUrl.clone()
    dest.pathname = profile?.role === 'platform_admin' ? '/admin' : '/dashboard'
    return NextResponse.redirect(dest)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
