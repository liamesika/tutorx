import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get base profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get student profile
  const { data: studentProfile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get interests
  const { data: interests } = await supabase
    .from('student_interests')
    .select('tag_id, interest_tags(name_he, name_en, category, icon)')
    .eq('student_id', user.id);

  // Get daily goal
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

  return NextResponse.json({
    profile: {
      ...profile,
      ...studentProfile,
      interests: interests?.map(i => i.interest_tags) || [],
      dailyGoal: goal || { minutes_per_day: 30, auto_plan_enabled: true },
      streak: streak || { current_streak: 0, longest_streak: 0 },
    },
  });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { fullName, city, grade, subjects, learningStyle, goals, struggleTopics, subjectLevels } = body;

  // Update base profile
  if (fullName || city) {
    await supabase
      .from('profiles')
      .update({
        ...(fullName && { full_name: fullName }),
        ...(city !== undefined && { city }),
      })
      .eq('id', user.id);
  }

  // Update student profile
  const studentUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (grade) studentUpdate.grade = grade;
  if (subjects) studentUpdate.subjects = subjects;
  if (learningStyle) studentUpdate.learning_style = learningStyle;
  if (goals !== undefined) studentUpdate.goals = goals;
  if (struggleTopics) studentUpdate.struggle_topics = struggleTopics;
  if (subjectLevels) studentUpdate.subject_levels = subjectLevels;

  const { error } = await supabase
    .from('student_profiles')
    .update(studentUpdate)
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
