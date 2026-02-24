// ============================================================
// Database Types — Matches Supabase schema
// ============================================================

export interface DbProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'parent' | 'tutor' | 'admin';
  avatar_url: string | null;
  city: string | null;
  created_at: string;
}

export interface DbStudentProfile {
  id: string;
  parent_id: string | null;
  grade: number;
  xp: number;
  level: number;
  streak: number;
  subjects: string[];
  learning_style: string | null;
  struggle_topics: Record<string, string[]>;
  subject_levels: Record<string, number>;
  goals: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbTutorProfile {
  id: string;
  bio: string | null;
  cover_image_url: string | null;
  display_name: string | null;
  hourly_rate: number;
  trial_rate: number | null;
  rating_avg: number;
  review_count: number;
  experience: number;
  is_approved: boolean;
  is_available: boolean;
  video_intro_url: string | null;
  zoom_link: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbTutorSubject {
  id: string;
  tutor_id: string;
  subject: string;
  grades: number[];
}

export interface DbTutorTopicStrength {
  id: string;
  tutor_id: string;
  subject: string;
  topic_name: string;
  strength: number;
  is_weak: boolean;
}

export interface DbInterestTag {
  id: string;
  name_he: string;
  name_en: string;
  category: string;
  icon: string | null;
}

export interface DbAvailabilitySlot {
  id: string;
  tutor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface DbBooking {
  id: string;
  student_id: string;
  tutor_id: string;
  subject: string;
  status: 'requested' | 'accepted' | 'scheduled' | 'completed' | 'cancelled';
  proposed_start: string;
  confirmed_start: string | null;
  meeting_url: string | null;
  price: number;
  platform_fee: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbReview {
  id: string;
  tutor_id: string;
  booking_id: string;
  author_id: string;
  rating: number;
  text: string | null;
  is_deleted: boolean;
  created_at: string;
}

// Joined types for feed/profile
export interface TutorFeedItem {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  hourly_rate: number;
  trial_rate: number | null;
  rating_avg: number;
  review_count: number;
  is_available: boolean;
  subjects: DbTutorSubject[];
  strengths: DbTutorTopicStrength[];
  interest_tag_ids: string[];
  slot_count: number;
}

export interface TutorPublicProfile extends TutorFeedItem {
  cover_image_url: string | null;
  video_intro_url: string | null;
  zoom_link: string | null;
  experience: number;
  reviews: DbReview[];
  interests: DbInterestTag[];
}
