import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateMatchScore, type StudentMatchProfile, type TutorMatchProfile } from '@/lib/matching';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  // Filters from query
  const subject = searchParams.get('subject');
  const gradeFilter = searchParams.get('grade');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minRating = searchParams.get('minRating');
  const city = searchParams.get('city');
  const availableOnly = searchParams.get('available') !== 'false';
  const sortBy = searchParams.get('sort') ?? 'match';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
  const offset = parseInt(searchParams.get('offset') ?? '0');

  // Fetch all approved tutors with their data
  let tutorQuery = supabase
    .from('tutor_profiles')
    .select(`
      id,
      bio,
      display_name,
      hourly_rate,
      trial_rate,
      rating_avg,
      review_count,
      is_available,
      profiles!inner ( avatar_url, city, full_name )
    `)
    .eq('is_approved', true);

  if (availableOnly) {
    tutorQuery = tutorQuery.eq('is_available', true);
  }
  if (minPrice) {
    tutorQuery = tutorQuery.gte('hourly_rate', parseInt(minPrice));
  }
  if (maxPrice) {
    tutorQuery = tutorQuery.lte('hourly_rate', parseInt(maxPrice));
  }
  if (minRating) {
    tutorQuery = tutorQuery.gte('rating_avg', parseFloat(minRating));
  }

  const { data: tutors, error: tutorError } = await tutorQuery;

  if (tutorError) {
    return NextResponse.json({ error: tutorError.message }, { status: 500 });
  }

  if (!tutors || tutors.length === 0) {
    return NextResponse.json({ tutors: [], total: 0 });
  }

  const tutorIds = tutors.map((t) => t.id);

  // Fetch subjects, strengths, interests, slots in parallel
  const [subjectsRes, strengthsRes, interestsRes, slotsRes] = await Promise.all([
    supabase.from('tutor_subjects').select('*').in('tutor_id', tutorIds),
    supabase.from('tutor_topic_strengths').select('*').in('tutor_id', tutorIds),
    supabase.from('tutor_interests').select('*').in('tutor_id', tutorIds),
    supabase
      .from('availability_slots')
      .select('tutor_id')
      .in('tutor_id', tutorIds)
      .eq('is_active', true),
  ]);

  // Group by tutor_id
  const subjectsByTutor = groupBy(subjectsRes.data ?? [], 'tutor_id');
  const strengthsByTutor = groupBy(strengthsRes.data ?? [], 'tutor_id');
  const interestsByTutor = groupBy(interestsRes.data ?? [], 'tutor_id');
  const slotCountByTutor: Record<string, number> = {};
  for (const s of slotsRes.data ?? []) {
    slotCountByTutor[s.tutor_id] = (slotCountByTutor[s.tutor_id] ?? 0) + 1;
  }

  // Build TutorMatchProfile list
  let tutorProfiles: TutorMatchProfile[] = tutors.map((t) => {
    const profile = t.profiles as unknown as { avatar_url: string | null; city: string | null; full_name: string };
    return {
      id: t.id,
      display_name: t.display_name ?? profile.full_name,
      avatar_url: profile.avatar_url,
      bio: t.bio,
      hourly_rate: t.hourly_rate,
      trial_rate: t.trial_rate,
      rating_avg: Number(t.rating_avg),
      review_count: t.review_count,
      city: profile.city,
      is_available: t.is_available,
      subjects: (subjectsByTutor[t.id] ?? []).map((s) => ({
        subject: s.subject,
        grades: s.grades,
      })),
      strengths: (strengthsByTutor[t.id] ?? []).map((s) => ({
        subject: s.subject,
        topic_name: s.topic_name,
        strength: s.strength,
        is_weak: s.is_weak,
      })),
      interest_tag_ids: (interestsByTutor[t.id] ?? []).map((i) => i.tag_id),
      slot_count: slotCountByTutor[t.id] ?? 0,
    };
  });

  // Apply subject filter
  if (subject) {
    tutorProfiles = tutorProfiles.filter((t) =>
      t.subjects.some((s) => s.subject === subject)
    );
  }

  // Apply grade filter
  if (gradeFilter) {
    const g = parseInt(gradeFilter);
    tutorProfiles = tutorProfiles.filter((t) =>
      t.subjects.some((s) => s.grades.includes(g))
    );
  }

  // Apply city filter
  if (city) {
    tutorProfiles = tutorProfiles.filter((t) => t.city === city);
  }

  // Try to get student profile for matching
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let studentProfile: StudentMatchProfile | null = null;

  if (user) {
    const { data: student } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (student) {
      const { data: studentInterests } = await supabase
        .from('student_interests')
        .select('tag_id')
        .eq('student_id', user.id);

      studentProfile = {
        grade: student.grade,
        subjects: student.subjects ?? [],
        subject_levels: student.subject_levels ?? {},
        struggle_topics: student.struggle_topics ?? {},
        learning_style: student.learning_style,
        city: null,
        interest_tag_ids: studentInterests?.map((i) => i.tag_id) ?? [],
      };

      // Get city from profiles
      const { data: prof } = await supabase
        .from('profiles')
        .select('city')
        .eq('id', user.id)
        .single();
      if (prof) studentProfile.city = prof.city;
    }
  }

  // Score and sort
  const results = tutorProfiles.map((tutor) => {
    if (studentProfile) {
      return calculateMatchScore(studentProfile, tutor);
    }
    // No student context — default scoring by rating
    return {
      tutor,
      matchScore: Math.round(tutor.rating_avg * 20),
      compatibilityReasons: [] as string[],
    };
  });

  // Sort
  switch (sortBy) {
    case 'rating':
      results.sort((a, b) => b.tutor.rating_avg - a.tutor.rating_avg);
      break;
    case 'price_low':
      results.sort((a, b) => a.tutor.hourly_rate - b.tutor.hourly_rate);
      break;
    case 'price_high':
      results.sort((a, b) => b.tutor.hourly_rate - a.tutor.hourly_rate);
      break;
    case 'match':
    default:
      results.sort((a, b) => b.matchScore - a.matchScore);
      break;
  }

  const total = results.length;
  const paged = results.slice(offset, offset + limit);

  return NextResponse.json({
    tutors: paged,
    total,
    hasMore: offset + limit < total,
  });
}

function groupBy<T extends Record<string, unknown>>(
  arr: T[],
  key: string
): Record<string, T[]> {
  const map: Record<string, T[]> = {};
  for (const item of arr) {
    const k = item[key] as string;
    if (!map[k]) map[k] = [];
    map[k].push(item);
  }
  return map;
}
