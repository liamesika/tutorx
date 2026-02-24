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

  const { booking_id, rating, text } = await request.json();

  if (!booking_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: 'booking_id and rating (1-5) required' },
      { status: 400 }
    );
  }

  // Verify booking belongs to user and is completed
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, tutor_id, student_id, status')
    .eq('id', booking_id)
    .single();

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  if (booking.status !== 'completed') {
    return NextResponse.json(
      { error: 'Can only review completed lessons' },
      { status: 400 }
    );
  }

  if (booking.student_id !== user.id) {
    return NextResponse.json({ error: 'Not your booking' }, { status: 403 });
  }

  // Check for existing review
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', booking_id)
    .eq('is_deleted', false)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: 'Already reviewed this lesson' },
      { status: 409 }
    );
  }

  const { data: review, error } = await supabase
    .from('reviews')
    .insert({
      tutor_id: booking.tutor_id,
      booking_id,
      author_id: user.id,
      rating,
      text: text || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ review });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;
  const tutorId = searchParams.get('tutor_id');

  if (!tutorId) {
    return NextResponse.json(
      { error: 'tutor_id required' },
      { status: 400 }
    );
  }

  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
  const offset = parseInt(searchParams.get('offset') ?? '0');

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      text,
      created_at,
      profiles!author_id ( full_name, avatar_url )
    `)
    .eq('tutor_id', tutorId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('tutor_id', tutorId)
    .eq('is_deleted', false);

  return NextResponse.json({
    reviews: reviews ?? [],
    total: count ?? 0,
  });
}
