-- ============================================================
-- LearnUp — Phase 3 Full Database Schema
-- Run this in your Supabase SQL Editor to bootstrap the DB.
-- ============================================================

-- Drop existing tables if re-running
drop table if exists public.exercise_attempts cascade;
drop table if exists public.payments cascade;
drop table if exists public.reviews cascade;
drop table if exists public.bookings cascade;
drop table if exists public.lesson_bookings cascade;
drop table if exists public.availability_slots cascade;
drop table if exists public.student_interests cascade;
drop table if exists public.interest_tags cascade;
drop table if exists public.student_identity_snapshots cascade;
drop table if exists public.tutor_topic_strengths cascade;
drop table if exists public.tutor_subjects cascade;
drop table if exists public.tutor_interests cascade;
drop table if exists public.tutor_profiles cascade;
drop table if exists public.student_profiles cascade;
drop table if exists public.parent_profiles cascade;
drop table if exists public.profiles cascade;

-- ============================================================
-- CORE IDENTITY
-- ============================================================

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null check (role in ('student', 'parent', 'tutor', 'admin')),
  avatar_url text,
  city text,
  created_at timestamptz default now()
);

create table public.parent_profiles (
  id uuid references public.profiles on delete cascade primary key,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  stripe_customer_id text,
  stripe_subscription_id text
);

-- ============================================================
-- STUDENT IDENTITY ENGINE
-- ============================================================

create table public.student_profiles (
  id uuid references public.profiles on delete cascade primary key,
  parent_id uuid references public.parent_profiles,
  grade smallint not null check (grade between 1 and 6),
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  subjects text[] default '{}',
  learning_style text check (learning_style in ('visual', 'practice', 'step_by_step', 'fast_paced')),
  struggle_topics jsonb default '{}',
  subject_levels jsonb default '{}',
  goals text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.student_identity_snapshots (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.student_profiles on delete cascade not null,
  version integer not null default 1,
  snapshot jsonb not null,
  created_at timestamptz default now()
);

create table public.interest_tags (
  id uuid default gen_random_uuid() primary key,
  name_he text not null unique,
  name_en text not null,
  category text not null check (category in ('sport', 'art', 'tech', 'nature', 'social', 'academic')),
  icon text
);

create table public.student_interests (
  student_id uuid references public.student_profiles on delete cascade,
  tag_id uuid references public.interest_tags on delete cascade,
  primary key (student_id, tag_id)
);

-- ============================================================
-- TUTOR PROFILE ENGINE
-- ============================================================

create table public.tutor_profiles (
  id uuid references public.profiles on delete cascade primary key,
  bio text,
  cover_image_url text,
  display_name text,
  hourly_rate integer not null default 100,
  trial_rate integer,
  rating_avg numeric(3,2) default 0,
  review_count integer default 0,
  experience integer default 0,
  is_approved boolean default false,
  is_available boolean default true,
  video_intro_url text,
  zoom_link text,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.tutor_subjects (
  id uuid default gen_random_uuid() primary key,
  tutor_id uuid references public.tutor_profiles on delete cascade not null,
  subject text not null,
  grades smallint[] not null default '{}',
  unique (tutor_id, subject)
);

create table public.tutor_topic_strengths (
  id uuid default gen_random_uuid() primary key,
  tutor_id uuid references public.tutor_profiles on delete cascade not null,
  subject text not null,
  topic_name text not null,
  strength smallint not null check (strength between 1 and 5),
  is_weak boolean default false,
  unique (tutor_id, subject, topic_name)
);

create table public.tutor_interests (
  tutor_id uuid references public.tutor_profiles on delete cascade,
  tag_id uuid references public.interest_tags on delete cascade,
  primary key (tutor_id, tag_id)
);

-- ============================================================
-- AVAILABILITY
-- ============================================================

create table public.availability_slots (
  id uuid default gen_random_uuid() primary key,
  tutor_id uuid references public.tutor_profiles on delete cascade not null,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- BOOKINGS
-- ============================================================

create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.student_profiles on delete cascade not null,
  tutor_id uuid references public.tutor_profiles on delete cascade not null,
  subject text not null,
  status text not null default 'requested'
    check (status in ('requested', 'accepted', 'scheduled', 'completed', 'cancelled')),
  proposed_start timestamptz not null,
  confirmed_start timestamptz,
  meeting_url text,
  price integer not null,
  platform_fee integer not null default 0,
  payment_status text default 'pending'
    check (payment_status in ('pending', 'paid', 'refunded')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- REVIEWS (VERIFIED)
-- ============================================================

create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  tutor_id uuid references public.tutor_profiles on delete cascade not null,
  booking_id uuid references public.bookings on delete cascade not null unique,
  author_id uuid references public.profiles on delete cascade not null,
  rating smallint not null check (rating between 1 and 5),
  text text,
  is_deleted boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- PAYMENTS
-- ============================================================

create table public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  booking_id uuid references public.bookings on delete set null,
  type text not null check (type in ('subscription', 'lesson', 'withdrawal')),
  amount integer not null,
  currency text default 'ILS',
  status text default 'pending'
    check (status in ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_id text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- EXERCISE ATTEMPTS
-- ============================================================

create table public.exercise_attempts (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.student_profiles on delete cascade not null,
  subject text not null,
  grade smallint not null,
  total_questions integer not null,
  correct_answers integer not null,
  xp_earned integer not null,
  duration_minutes integer,
  weak_topics text[] default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_student_onboarding on public.student_profiles(onboarding_completed);
create index idx_student_grade on public.student_profiles(grade);
create index idx_tutor_approved on public.tutor_profiles(is_approved, is_available);
create index idx_tutor_rating on public.tutor_profiles(rating_avg desc);
create index idx_tutor_subjects on public.tutor_subjects(subject);
create index idx_tutor_strengths on public.tutor_topic_strengths(tutor_id, subject);
create index idx_slots_tutor on public.availability_slots(tutor_id, day_of_week);
create index idx_bookings_student on public.bookings(student_id);
create index idx_bookings_tutor on public.bookings(tutor_id);
create index idx_bookings_status on public.bookings(status);
create index idx_reviews_tutor on public.reviews(tutor_id) where is_deleted = false;
create index idx_attempts_student on public.exercise_attempts(student_id);
create index idx_payments_user on public.payments(user_id);
create index idx_snapshots_student on public.student_identity_snapshots(student_id);

-- ============================================================
-- MATERIALIZED VIEW: Tutor rating aggregates
-- ============================================================

create materialized view public.tutor_rating_stats as
select
  tutor_id,
  round(avg(rating)::numeric, 2) as avg_rating,
  count(*) as total_reviews
from public.reviews
where is_deleted = false
group by tutor_id;

create unique index idx_rating_stats_tutor on public.tutor_rating_stats(tutor_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.parent_profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.student_identity_snapshots enable row level security;
alter table public.interest_tags enable row level security;
alter table public.student_interests enable row level security;
alter table public.tutor_profiles enable row level security;
alter table public.tutor_subjects enable row level security;
alter table public.tutor_topic_strengths enable row level security;
alter table public.tutor_interests enable row level security;
alter table public.availability_slots enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.payments enable row level security;
alter table public.exercise_attempts enable row level security;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Profiles
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Public read tutor names" on public.profiles for select using (role = 'tutor');

-- Parent profiles
create policy "Parents manage own" on public.parent_profiles for all using (auth.uid() = id);

-- Student profiles
create policy "Students manage own" on public.student_profiles for all using (auth.uid() = id);
create policy "Parents see children" on public.student_profiles for select using (auth.uid() = parent_id);

-- Student snapshots
create policy "Students manage own snapshots" on public.student_identity_snapshots for all using (auth.uid() = student_id);

-- Interest tags: public read
create policy "Public read tags" on public.interest_tags for select using (true);

-- Student interests
create policy "Students manage own interests" on public.student_interests for all using (auth.uid() = student_id);

-- Tutor profiles: public read, owner write
create policy "Public read tutors" on public.tutor_profiles for select using (true);
create policy "Tutors manage own" on public.tutor_profiles for all using (auth.uid() = id);

-- Tutor subjects: public read, owner write
create policy "Public read tutor subjects" on public.tutor_subjects for select using (true);
create policy "Tutors manage own subjects" on public.tutor_subjects for all using (
  auth.uid() = tutor_id
);

-- Tutor topic strengths: public read, owner write
create policy "Public read strengths" on public.tutor_topic_strengths for select using (true);
create policy "Tutors manage own strengths" on public.tutor_topic_strengths for all using (
  auth.uid() = tutor_id
);

-- Tutor interests: public read, owner write
create policy "Public read tutor interests" on public.tutor_interests for select using (true);
create policy "Tutors manage own interests" on public.tutor_interests for all using (
  auth.uid() = tutor_id
);

-- Availability: public read, tutor write
create policy "Public read slots" on public.availability_slots for select using (true);
create policy "Tutors manage own slots" on public.availability_slots for all using (
  auth.uid() = tutor_id
);

-- Bookings
create policy "Students see own bookings" on public.bookings for select using (auth.uid() = student_id);
create policy "Tutors see own bookings" on public.bookings for select using (auth.uid() = tutor_id);
create policy "Students create bookings" on public.bookings for insert with check (auth.uid() = student_id);
create policy "Tutors update bookings" on public.bookings for update using (auth.uid() = tutor_id);

-- Reviews: public read, author create
create policy "Public read reviews" on public.reviews for select using (is_deleted = false);
create policy "Authors create reviews" on public.reviews for insert with check (auth.uid() = author_id);
create policy "Authors soft delete reviews" on public.reviews for update using (auth.uid() = author_id);

-- Payments
create policy "Users see own payments" on public.payments for select using (auth.uid() = user_id);

-- Exercise attempts
create policy "Students manage attempts" on public.exercise_attempts for all using (auth.uid() = student_id);

-- ============================================================
-- FUNCTION: Refresh tutor rating after review
-- ============================================================

create or replace function public.refresh_tutor_rating()
returns trigger as $$
begin
  update public.tutor_profiles
  set
    rating_avg = coalesce((
      select round(avg(rating)::numeric, 2)
      from public.reviews
      where tutor_id = coalesce(new.tutor_id, old.tutor_id) and is_deleted = false
    ), 0),
    review_count = coalesce((
      select count(*)
      from public.reviews
      where tutor_id = coalesce(new.tutor_id, old.tutor_id) and is_deleted = false
    ), 0)
  where id = coalesce(new.tutor_id, old.tutor_id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_review_change
after insert or update or delete on public.reviews
for each row execute function public.refresh_tutor_rating();
