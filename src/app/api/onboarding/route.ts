import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    grade,
    subjects,
    subject_levels,
    struggle_topics,
    learning_style,
    goals,
    interest_tag_ids,
  } = body;

  // Upsert student profile
  const { error: profileError } = await supabase
    .from('student_profiles')
    .upsert(
      {
        id: user.id,
        grade,
        subjects,
        subject_levels: subject_levels ?? {},
        struggle_topics: struggle_topics ?? {},
        learning_style: learning_style ?? null,
        goals: goals ?? null,
        onboarding_completed: true,
      },
      { onConflict: 'id' }
    );

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // Save identity snapshot
  const snapshot = {
    grade,
    subjects,
    subject_levels,
    struggle_topics,
    learning_style,
    goals,
    interest_tag_ids,
    captured_at: new Date().toISOString(),
  };

  await supabase.from('student_identity_snapshots').insert({
    student_id: user.id,
    snapshot,
  });

  // Sync interests
  if (interest_tag_ids && interest_tag_ids.length > 0) {
    await supabase
      .from('student_interests')
      .delete()
      .eq('student_id', user.id);

    await supabase.from('student_interests').insert(
      interest_tag_ids.map((tag_id: string) => ({
        student_id: user.id,
        tag_id,
      }))
    );
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: student } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: interests } = await supabase
    .from('student_interests')
    .select('tag_id')
    .eq('student_id', user.id);

  const { data: tags } = await supabase
    .from('interest_tags')
    .select('*')
    .order('category');

  return NextResponse.json({
    student,
    interest_tag_ids: interests?.map((i) => i.tag_id) ?? [],
    all_tags: tags ?? [],
  });
}
