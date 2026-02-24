import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { itemId, completedMinutes } = await request.json();

  if (!itemId) {
    return NextResponse.json({ error: 'itemId required' }, { status: 400 });
  }

  // Update the plan item
  const { data: item, error: itemError } = await supabase
    .from('student_daily_plan_items')
    .update({
      status: 'completed',
      completed_minutes: completedMinutes || 0,
    })
    .eq('id', itemId)
    .select('plan_id, target_minutes, completed_minutes')
    .single();

  if (itemError || !item) {
    return NextResponse.json({ error: itemError?.message || 'Item not found' }, { status: 404 });
  }

  // Get all items for this plan to calculate progress
  const { data: allItems } = await supabase
    .from('student_daily_plan_items')
    .select('status, target_minutes, completed_minutes')
    .eq('plan_id', item.plan_id);

  const totalCompleted = (allItems || [])
    .reduce((sum, i) => sum + (i.completed_minutes || 0), 0);
  const allDone = (allItems || [])
    .every(i => i.status === 'completed' || i.status === 'skipped');

  // Update plan progress
  await supabase
    .from('student_daily_plans')
    .update({
      completed_minutes: totalCompleted,
      status: allDone ? 'completed' : 'active',
    })
    .eq('id', item.plan_id);

  // Update streak if plan completed
  if (allDone) {
    const today = new Date().toISOString().split('T')[0];
    const { data: streak } = await supabase
      .from('student_streaks')
      .select('*')
      .eq('student_id', user.id)
      .single();

    if (streak) {
      const lastDate = streak.last_completed_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = streak.current_streak;
      if (lastDate === yesterdayStr || lastDate === today) {
        newStreak = lastDate === today ? streak.current_streak : streak.current_streak + 1;
      } else {
        newStreak = 1; // Reset streak
      }

      await supabase
        .from('student_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(streak.longest_streak, newStreak),
          last_completed_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('student_id', user.id);
    }

    // Update student profile streak
    await supabase
      .from('student_profiles')
      .update({ streak: (streak?.current_streak || 0) + 1 })
      .eq('id', user.id);
  }

  return NextResponse.json({ success: true, completedMinutes: totalCompleted, allDone });
}
