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

  const { tutor_id, subject, proposed_start, notes } = await request.json();

  if (!tutor_id || !subject || !proposed_start) {
    return NextResponse.json(
      { error: 'tutor_id, subject, and proposed_start required' },
      { status: 400 }
    );
  }

  // Get tutor rate
  const { data: tutor } = await supabase
    .from('tutor_profiles')
    .select('hourly_rate, zoom_link')
    .eq('id', tutor_id)
    .single();

  if (!tutor) {
    return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
  }

  const price = tutor.hourly_rate;
  const platformFee = Math.round(price * 0.15);

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      student_id: user.id,
      tutor_id,
      subject,
      proposed_start,
      price,
      platform_fee: platformFee,
      meeting_url: tutor.zoom_link,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const role = searchParams.get('role') ?? 'student';
  const status = searchParams.get('status');

  let query = supabase
    .from('bookings')
    .select(`
      *,
      tutor:tutor_profiles!tutor_id (
        display_name,
        hourly_rate,
        profiles!inner ( full_name, avatar_url )
      ),
      student:profiles!student_id (
        full_name, avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (role === 'tutor') {
    query = query.eq('tutor_id', user.id);
  } else {
    query = query.eq('student_id', user.id);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data: bookings, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: bookings ?? [] });
}
