-- ============================================================
-- Daily Plan Engine Tables
-- ============================================================

-- Student daily goal settings
create table if not exists public.student_daily_goals (
  student_id uuid references public.student_profiles on delete cascade primary key,
  minutes_per_day integer not null default 30,
  auto_plan_enabled boolean not null default true,
  preferred_time text check (preferred_time in ('morning', 'afternoon', 'evening')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Daily plans (one per student per day)
create table if not exists public.student_daily_plans (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.student_profiles on delete cascade not null,
  plan_date date not null default current_date,
  generated_at timestamptz default now(),
  total_minutes integer not null default 0,
  completed_minutes integer not null default 0,
  status text not null default 'active' check (status in ('active', 'completed', 'expired')),
  unique (student_id, plan_date)
);

-- Individual plan items
create table if not exists public.student_daily_plan_items (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references public.student_daily_plans on delete cascade not null,
  subject text not null,
  topic text not null,
  target_minutes integer not null,
  completed_minutes integer not null default 0,
  priority_score numeric(5,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'skipped')),
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  reason text not null,
  reason_type text not null check (reason_type in ('weakness', 'review', 'maintenance')),
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- Student streaks
create table if not exists public.student_streaks (
  student_id uuid references public.student_profiles on delete cascade primary key,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_completed_date date,
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_daily_plans_student_date on public.student_daily_plans(student_id, plan_date desc);
create index if not exists idx_plan_items_plan on public.student_daily_plan_items(plan_id, sort_order);
create index if not exists idx_plan_items_status on public.student_daily_plan_items(status);

-- RLS
alter table public.student_daily_goals enable row level security;
alter table public.student_daily_plans enable row level security;
alter table public.student_daily_plan_items enable row level security;
alter table public.student_streaks enable row level security;

create policy "Students manage own goals" on public.student_daily_goals for all using (auth.uid() = student_id);
create policy "Students manage own plans" on public.student_daily_plans for all using (auth.uid() = student_id);
create policy "Students manage own plan items" on public.student_daily_plan_items for all using (
  plan_id in (select id from public.student_daily_plans where student_id = auth.uid())
);
create policy "Students manage own streaks" on public.student_streaks for all using (auth.uid() = student_id);
