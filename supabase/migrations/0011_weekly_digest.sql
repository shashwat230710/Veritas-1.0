-- Weekly Intelligence Digest & User Preferences
create table if not exists public.user_digest_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  delivery_email boolean default true,
  delivery_in_app boolean default true,
  delivery_pdf boolean default false,
  frequency text check (frequency in ('weekly','biweekly')) default 'weekly',
  preferred_categories text[] default '{"Tech","Politics","Health","Science"}',
  created_at timestamptz not null default now()
);

create table if not exists public.weekly_digests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  digest_week_start date not null,
  title text not null,
  summary_md text not null,
  keep_an_eye_updates jsonb default '[]'::jsonb,
  promise_progress jsonb default '[]'::jsonb,
  major_verdict_changes jsonb default '[]'::jsonb,
  top_needs_attention jsonb default '[]'::jsonb,
  pdf_download_url text,
  read boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_weekly_digests_user on public.weekly_digests(user_id, created_at desc);

alter table public.user_digest_preferences enable row level security;
alter table public.weekly_digests enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users manage own digest prefs') then
    create policy "Users manage own digest prefs" on public.user_digest_preferences for all using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Users view own weekly digests') then
    create policy "Users view own weekly digests" on public.weekly_digests for select using (auth.uid() = user_id);
  end if;
end
$$;
