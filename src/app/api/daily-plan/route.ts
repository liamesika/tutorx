import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDailyPlan } from '@/lib/daily-plan';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];

  // Get today's plan
  const { data: plan } = await supabase
    .from('student_daily_plans')
    .select('*, items:student_daily_plan_items(*)')
    .eq('student_id', user.id)
    .eq('plan_date', today)
    .single();

  // Get goal settings
  const { data: goal } = await supabase
    .from('student_daily_goals')
    .select('*')
    .eq('student_id', user.id)
    .single();

  // Get streak
  const { data: streak } = await supabase
    .from('student_streaks')
    .select('*')
    .eq('student_id', user.id)
    .single();

  // Get recent history (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data: recentPlans } = await supabase
    .from('student_daily_plans')
    .select('plan_date, completed_minutes, total_minutes, status')
    .eq('student_id', user.id)
    .gte('plan_date', weekAgo.toISOString().split('T')[0])
    .order('plan_date', { ascending: false });

  return NextResponse.json({
    plan: plan || null,
    goal: goal || { minutes_per_day: 30, auto_plan_enabled: true },
    streak: streak || { current_streak: 0, longest_streak: 0, last_completed_date: null },
    history: recentPlans || [],
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { minutesPerDay, autoPlanEnabled } = body;

  // Upsert goal
  if (minutesPerDay !== undefined) {
    await supabase
      .from('student_daily_goals')
      .upsert({
        student_id: user.id,
        minutes_per_day: minutesPerDay,
        auto_plan_enabled: autoPlanEnabled ?? true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'student_id' });
  }

  // Get current goal
  const { data: goal } = await supabase
    .from('student_daily_goals')
    .select('*')
    .eq('student_id', user.id)
    .single();

  const targetMinutes = goal?.minutes_per_day || minutesPerDay || 30;

  // Get student profile
  const { data: studentProfile } = await supabase
    .from('student_profiles')
    .select('subjects, struggle_topics, subject_levels')
    .eq('id', user.id)
    .single();

  // Get recent exercise attempts (last 30 days)
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const { data: attempts } = await supabase
    .from('exercise_attempts')
    .select('subject, total_questions, correct_answers, weak_topics, duration_minutes, created_at')
    .eq('student_id', user.id)
    .gte('created_at', monthAgo.toISOString())
    .order('created_at', { ascending: false });

  // Generate plan
  const { items, totalMinutes } = generateDailyPlan(
    targetMinutes,
    attempts || [],
    studentProfile?.subjects || [],
    studentProfile?.struggle_topics || {},
    studentProfile?.subject_levels || {}
  );

  const today = new Date().toISOString().split('T')[0];

  // Delete existing plan for today if regenerating
  await supabase
    .from('student_daily_plans')
    .delete()
    .eq('student_id', user.id)
    .eq('plan_date', today);

  // Create plan
  const { data: plan, error: planError } = await supabase
    .from('student_daily_plans')
    .insert({
      student_id: user.id,
      plan_date: today,
      total_minutes: totalMinutes,
      completed_minutes: 0,
      status: 'active',
    })
    .select()
    .single();

  if (planError || !plan) {
    return NextResponse.json({ error: planError?.message || 'Failed to create plan' }, { status: 500 });
  }

  // Insert plan items
  const planItems = items.map(item => ({
    plan_id: plan.id,
    subject: item.subject,
    topic: item.topic,
    target_minutes: item.targetMinutes,
    completed_minutes: 0,
    priority_score: item.priorityScore,
    status: 'pending',
    difficulty: item.difficulty,
    reason: item.reason,
    reason_type: item.reasonType,
    sort_order: item.sortOrder,
  }));

  const { data: insertedItems } = await supabase
    .from('student_daily_plan_items')
    .insert(planItems)
    .select();

  // Init streak if needed
  await supabase
    .from('student_streaks')
    .upsert({
      student_id: user.id,
      current_streak: 0,
      longest_streak: 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'student_id' });

  return NextResponse.json({
    plan: { ...plan, items: insertedItems },
    goal: goal || { minutes_per_day: targetMinutes, auto_plan_enabled: true },
  });
}
