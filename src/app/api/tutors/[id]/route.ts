import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch tutor profile with joined profile data
  const { data: tutor, error } = await supabase
    .from('tutor_profiles')
    .select(`
      id,
      bio,
      cover_image_url,
      display_name,
      hourly_rate,
      trial_rate,
      rating_avg,
      review_count,
      experience,
      is_available,
      video_intro_url,
      zoom_link,
      profiles!inner ( full_name, avatar_url, city )
    `)
    .eq('id', id)
    .eq('is_approved', true)
    .single();

  if (error || !tutor) {
    return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
  }

  // Fetch subjects, strengths, interests, slots, reviews in parallel
  const [subjectsRes, strengthsRes, interestsRes, slotsRes, reviewsRes] =
    await Promise.all([
      supabase.from('tutor_subjects').select('*').eq('tutor_id', id),
      supabase.from('tutor_topic_strengths').select('*').eq('tutor_id', id),
      supabase
        .from('tutor_interests')
        .select('tag_id, interest_tags ( id, name_he, name_en, category, icon )')
        .eq('tutor_id', id),
      supabase
        .from('availability_slots')
        .select('*')
        .eq('tutor_id', id)
        .eq('is_active', true),
      supabase
        .from('reviews')
        .select(`
          id,
          rating,
          text,
          created_at,
          profiles!author_id ( full_name, avatar_url )
        `)
        .eq('tutor_id', id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

  const profile = tutor.profiles as unknown as {
    full_name: string;
    avatar_url: string | null;
    city: string | null;
  };

  return NextResponse.json({
    tutor: {
      id: tutor.id,
      display_name: tutor.display_name ?? profile.full_name,
      avatar_url: profile.avatar_url,
      cover_image_url: tutor.cover_image_url,
      bio: tutor.bio,
      city: profile.city,
      hourly_rate: tutor.hourly_rate,
      trial_rate: tutor.trial_rate,
      rating_avg: Number(tutor.rating_avg),
      review_count: tutor.review_count,
      experience: tutor.experience,
      is_available: tutor.is_available,
      video_intro_url: tutor.video_intro_url,
      subjects: subjectsRes.data ?? [],
      strengths: strengthsRes.data ?? [],
      interests: (interestsRes.data ?? []).map((i) => i.interest_tags).filter(Boolean),
      slots: slotsRes.data ?? [],
      reviews: reviewsRes.data ?? [],
    },
  });
}
