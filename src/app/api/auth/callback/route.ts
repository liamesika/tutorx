import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if profile exists — if not, create one (OAuth first login)
      const { data: existing } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (existing) {
        // Redirect to role dashboard
        const dashboard =
          existing.role === 'student'
            ? '/student'
            : existing.role === 'parent'
              ? '/parent'
              : existing.role === 'tutor'
                ? '/tutor'
                : existing.role === 'admin'
                  ? '/admin'
                  : next;
        return NextResponse.redirect(`${origin}${dashboard}`);
      }

      // New OAuth user — create profile as parent by default, redirect to signup to complete
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        full_name:
          data.user.user_metadata?.full_name ??
          data.user.email?.split('@')[0] ??
          'User',
        role: 'parent',
      });
      await supabase.from('parent_profiles').insert({ id: data.user.id });

      return NextResponse.redirect(`${origin}/parent`);
    }
  }

  // Auth error — redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
