-- ╔══════════════════════════════════════════════════════════════╗
-- ║  FitBot — Supabase Schema                                    ║
-- ║  Выполни весь этот SQL в Supabase → SQL Editor               ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ─── Users ───────────────────────────────────────────────────────────────────
create table if not exists users (
  id            bigint primary key,        -- telegram user id
  name          text,
  age           int,
  sex           text default 'm',
  weight        numeric(5,1),
  height        int,
  goal          text default 'mass',       -- 'mass' | 'cut'
  level         text default 'amateur',    -- 'beginner' | 'amateur' | 'pro'
  days_per_week int default 4,
  goal_weight   numeric(5,1),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── Programs ────────────────────────────────────────────────────────────────
create table if not exists programs (
  id            bigserial primary key,
  user_id       bigint references users(id) on delete cascade,
  name          text,
  goal          text,
  level         text,
  days_per_week int,
  days          jsonb not null,            -- full program structure
  created_at    timestamptz default now()
);

-- ─── Workout sessions ─────────────────────────────────────────────────────────
create table if not exists workout_sessions (
  id            bigserial primary key,
  user_id       bigint references users(id) on delete cascade,
  program_id    bigint references programs(id),
  day_name      text,
  day_groups    text[],
  start_time    timestamptz,
  end_time      timestamptz,
  cycle_day     int default 0,
  created_at    timestamptz default now()
);

-- ─── Exercise logs ────────────────────────────────────────────────────────────
create table if not exists exercise_logs (
  id            bigserial primary key,
  session_id    bigint references workout_sessions(id) on delete cascade,
  user_id       bigint references users(id) on delete cascade,
  exercise_id   text not null,
  weight        numeric(6,2) default 0,
  reps          int default 0,
  set_number    int default 1,
  logged_at     timestamptz default now()
);

-- ─── Body weight log ─────────────────────────────────────────────────────────
create table if not exists body_weight_logs (
  id            bigserial primary key,
  user_id       bigint references users(id) on delete cascade,
  weight        numeric(5,1) not null,
  logged_at     timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table users              enable row level security;
alter table programs           enable row level security;
alter table workout_sessions   enable row level security;
alter table exercise_logs      enable row level security;
alter table body_weight_logs   enable row level security;

-- Users can only see/edit their own row
create policy "users: own row" on users
  for all using (id = current_setting('app.telegram_id', true)::bigint);

-- Programs: own only
create policy "programs: own" on programs
  for all using (user_id = current_setting('app.telegram_id', true)::bigint);

-- Sessions: own only
create policy "sessions: own" on workout_sessions
  for all using (user_id = current_setting('app.telegram_id', true)::bigint);

-- Logs: own only
create policy "logs: own" on exercise_logs
  for all using (user_id = current_setting('app.telegram_id', true)::bigint);

-- Body weight: own only
create policy "body_weight: own" on body_weight_logs
  for all using (user_id = current_setting('app.telegram_id', true)::bigint);

-- ─── Helper: auto-update updated_at ──────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on users
  for each row execute function update_updated_at();
