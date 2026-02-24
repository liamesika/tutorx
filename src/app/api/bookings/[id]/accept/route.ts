import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { confirmed_start } = await request.json();

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, tutor_id, status')
    .eq('id', id)
    .single();

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  if (booking.tutor_id !== user.id) {
    return NextResponse.json({ error: 'Not your booking' }, { status: 403 });
  }

  if (booking.status !== 'requested') {
    return NextResponse.json(
      { error: 'Booking is not in requested state' },
      { status: 400 }
    );
  }

  const { data: updated, error } = await supabase
    .from('bookings')
    .update({
      status: 'accepted',
      confirmed_start: confirmed_start || null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: updated });
}
