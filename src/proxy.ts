import { NextResponse, type NextRequest } from 'next/server';

// Public routes that don't require auth
const publicRoutes = new Set([
  '/',
  '/how-it-works',
  '/pricing',
  '/tutors',
  '/login',
  '/signup',
  '/onboarding',
]);

// Role → dashboard path mapping
const roleDashboard: Record<string, string> = {
  student: '/student',
  parent: '/parent',
  tutor: '/tutor',
  admin: '/admin',
};

// Route prefix → required role
const protectedPrefixes: Record<string, string> = {
  '/student': 'student',
  '/parent': 'parent',
  '/tutor': 'tutor',
  '/admin': 'admin',
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // No Supabase configured → pass through everything
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  // Public routes, assets, API, tutors detail → refresh session only
  if (
    publicRoutes.has(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/tutors/') ||
    pathname.match(/\.(ico|svg|png|jpg|jpeg|webp|gif|css|js|woff2?)$/)
  ) {
    try {
      const { updateSession } = await import('@/lib/supabase/middleware');
      const { supabaseResponse } = await updateSession(request);
      return supabaseResponse;
    } catch {
      return NextResponse.next();
    }
  }

  // Protected routes — lazy-import supabase to avoid edge crashes
  try {
    const { updateSession } = await import('@/lib/supabase/middleware');
    const { user, supabase, supabaseResponse } = await updateSession(request);

    // No session → redirect to login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Fetch user role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role;

    // Check protected routes
    for (const [prefix, requiredRole] of Object.entries(protectedPrefixes)) {
      if (pathname.startsWith(prefix)) {
        if (userRole !== requiredRole) {
          const correctPath = roleDashboard[userRole] ?? '/login';
          const url = request.nextUrl.clone();
          url.pathname = correctPath;
          return NextResponse.redirect(url);
        }
        break;
      }
    }

    return supabaseResponse;
  } catch {
    // Supabase not available → pass through
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
