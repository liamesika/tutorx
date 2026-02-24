import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Public routes that don't require auth
const publicRoutes = [
  '/',
  '/how-it-works',
  '/pricing',
  '/tutors',
  '/login',
  '/signup',
  '/onboarding',
  '/api/auth/callback',
  '/api/stripe/webhook',
];

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

  // Skip Supabase entirely when env vars aren't configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  // Allow public routes, static assets, and Next internals
  if (
    publicRoutes.some((r) => pathname === r) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/tutors/') ||
    pathname.match(/\.(ico|svg|png|jpg|jpeg|webp|gif|css|js|woff2?)$/)
  ) {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  }

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
        // Wrong role → redirect to correct dashboard
        const correctPath = roleDashboard[userRole] ?? '/login';
        const url = request.nextUrl.clone();
        url.pathname = correctPath;
        return NextResponse.redirect(url);
      }
      break;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
