-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USERS (extends Supabase auth.users) ───────────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  name        text,
  weight_unit text default 'kg' check (weight_unit in ('kg','lbs')),
  surf_level  text,
  skate_level text,
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- ─── EXERCISES ────────────────────────────────────────────────────────────
create table public.exercises (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  muscle_group text not null,
  equipment    text not null,
  instructions text,
  is_custom    boolean default false,
  user_id      uuid references auth.users on delete cascade,
  created_at   timestamptz default now()
);
alter table public.exercises enable row level security;
create policy "Anyone can read preset exercises"   on public.exercises for select using (is_custom = false);
create policy "Users can read own custom exercises" on public.exercises for select using (auth.uid() = user_id);
create policy "Users can insert custom exercises"  on public.exercises for insert with check (auth.uid() = user_id and is_custom = true);

-- ─── ROUTINES ─────────────────────────────────────────────────────────────
create table public.routines (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users on delete cascade not null,
  name        text not null,
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.routines enable row level security;
create policy "Users can CRUD own routines" on public.routines using (auth.uid() = user_id);

create table public.routine_exercises (
  id             uuid primary key default uuid_generate_v4(),
  routine_id     uuid references public.routines on delete cascade not null,
  exercise_id    uuid references public.exercises on delete set null,
  exercise_name  text not null,
  position       integer not null default 0,
  default_sets   integer not null default 3,
  default_reps   integer,
  default_weight numeric(6,2)
);
alter table public.routine_exercises enable row level security;
create policy "Users can CRUD routine exercises via routine"
  on public.routine_exercises using (
    exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid())
  );

-- ─── WORKOUT SESSIONS ─────────────────────────────────────────────────────
create table public.workout_sessions (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references auth.users on delete cascade not null,
  routine_id       uuid references public.routines on delete set null,
  name             text not null,
  started_at       timestamptz not null,
  finished_at      timestamptz,
  duration_minutes integer,
  total_volume     numeric(10,2) default 0,
  total_sets       integer default 0,
  notes            text,
  created_at       timestamptz default now()
);
alter table public.workout_sessions enable row level security;
create policy "Users can CRUD own sessions" on public.workout_sessions using (auth.uid() = user_id);

-- ─── WORKOUT EXERCISES ────────────────────────────────────────────────────
create table public.workout_exercises (
  id            uuid primary key default uuid_generate_v4(),
  session_id    uuid references public.workout_sessions on delete cascade not null,
  exercise_id   uuid references public.exercises on delete set null,
  exercise_name text not null,
  position      integer not null default 0,
  notes         text
);
alter table public.workout_exercises enable row level security;
create policy "Users can CRUD workout exercises via session"
  on public.workout_exercises using (
    exists (select 1 from public.workout_sessions ws where ws.id = session_id and ws.user_id = auth.uid())
  );

-- ─── EXERCISE SETS ────────────────────────────────────────────────────────
create table public.exercise_sets (
  id                  uuid primary key default uuid_generate_v4(),
  workout_exercise_id uuid references public.workout_exercises on delete cascade not null,
  set_number          integer not null,
  weight              numeric(6,2),
  reps                integer,
  set_type            text default 'normal' check (set_type in ('normal','warmup','dropset','failure')),
  completed           boolean default false,
  created_at          timestamptz default now()
);
alter table public.exercise_sets enable row level security;
create policy "Users can CRUD sets via workout exercise"
  on public.exercise_sets using (
    exists (
      select 1
      from public.workout_exercises we
      join public.workout_sessions ws on ws.id = we.session_id
      where we.id = workout_exercise_id and ws.user_id = auth.uid()
    )
  );

-- ─── SURF SESSIONS ────────────────────────────────────────────────────────
create table public.surf_sessions (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references auth.users on delete cascade not null,
  location       text not null,
  logged_at      timestamptz not null default now(),
  duration_min   integer,
  wave_height    text,
  wind_condition text,
  energy_rating  integer check (energy_rating between 1 and 10),
  notes          text
);
alter table public.surf_sessions enable row level security;
create policy "Users can CRUD own surf sessions" on public.surf_sessions using (auth.uid() = user_id);
