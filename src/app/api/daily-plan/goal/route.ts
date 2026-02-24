import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { minutesPerDay, autoPlanEnabled } = await request.json();

  const { data, error } = await supabase
    .from('student_daily_goals')
    .upsert({
      student_id: user.id,
      minutes_per_day: minutesPerDay,
      auto_plan_enabled: autoPlanEnabled,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'student_id' })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ goal: data });
}
