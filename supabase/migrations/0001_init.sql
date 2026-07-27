-- Veritas — initial schema
-- Enables pgvector for evidence-retrieval embeddings and defines the core
-- content, verification, watchlist, and accountability tables.

create extension if not exists vector;

-- ---------------------------------------------------------------------
-- Sources & content
-- ---------------------------------------------------------------------
create table sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text unique,
  credibility_score numeric check (credibility_score between 0 and 100),
  bias_lean text,
  region text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  url text,
  source_id uuid references sources(id),
  category text,               -- drives the Feed eyebrow label
  published_at timestamptz,
  image_url text,
  embedding vector(1536),
  created_at timestamptz not null default now()
);
create index on articles (category);
create index on articles (published_at desc);

-- ---------------------------------------------------------------------
-- Claims, evidence, fact-checks (Truth Analyzer + Misinformation tagging)
-- ---------------------------------------------------------------------
create table claims (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references articles(id),
  submitted_by uuid references auth.users(id),
  text text not null,
  created_at timestamptz not null default now()
);

create table evidence (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references claims(id) on delete cascade,
  source_id uuid references sources(id),
  snippet text,
  stance text check (stance in ('support', 'contradict', 'context')),
  url text,
  retrieved_at timestamptz not null default now()
);
create index on evidence (claim_id);

create table fact_checks (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references claims(id) on delete cascade,
  truth_score numeric check (truth_score between 0 and 100),
  confidence text check (confidence in ('low', 'medium', 'high')),
  verdict text check (verdict in ('true', 'mixed', 'false', 'unverified')),
  explanation text,
  methodology_version text not null default 'v1',
  created_at timestamptz not null default now()
);
create index on fact_checks (claim_id);

-- ---------------------------------------------------------------------
-- Keep an Eye (watchlists + timeline)
-- ---------------------------------------------------------------------
create table watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  subject_type text check (subject_type in ('person', 'promise', 'event', 'topic')),
  subject_ref text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);
create index on watchlists (user_id);

create table timeline_events (
  id uuid primary key default gen_random_uuid(),
  watchlist_id uuid not null references watchlists(id) on delete cascade,
  event_date timestamptz not null,
  summary text not null,
  source_url text,
  change_type text check (change_type in ('progress', 'delay', 'cancel', 'new_info')),
  created_at timestamptz not null default now()
);
create index on timeline_events (watchlist_id, event_date desc);

-- ---------------------------------------------------------------------
-- Accountability engine
-- ---------------------------------------------------------------------
create table promises (
  id uuid primary key default gen_random_uuid(),
  entity_name text not null,
  entity_type text check (entity_type in ('politician', 'company', 'ngo', 'govt')),
  statement text not null,
  made_on date,
  category text,
  status text not null default 'pending',
  completion_pct numeric check (completion_pct between 0 and 100),
  created_at timestamptz not null default now()
);

create table promise_updates (
  id uuid primary key default gen_random_uuid(),
  promise_id uuid not null references promises(id) on delete cascade,
  update_text text not null,
  evidence_url text,
  new_status text,
  updated_at timestamptz not null default now()
);
create index on promise_updates (promise_id);

-- ---------------------------------------------------------------------
-- Notifications & bookmarks
-- ---------------------------------------------------------------------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  type text not null,
  payload jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index on notifications (user_id, read);

create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  article_id uuid references articles(id),
  created_at timestamptz not null default now(),
  unique (user_id, article_id)
);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table watchlists enable row level security;
alter table bookmarks enable row level security;
alter table notifications enable row level security;

create policy "Users manage their own watchlists"
  on watchlists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own bookmarks"
  on bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own notifications"
  on notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Public-read, service-role-write tables (no end-user client writes)
alter table sources enable row level security;
alter table articles enable row level security;
alter table claims enable row level security;
alter table evidence enable row level security;
alter table fact_checks enable row level security;
alter table promises enable row level security;
alter table promise_updates enable row level security;

create policy "Public read sources" on sources for select using (true);
create policy "Public read articles" on articles for select using (true);
create policy "Public read claims" on claims for select using (true);
create policy "Public read evidence" on evidence for select using (true);
create policy "Public read fact_checks" on fact_checks for select using (true);
create policy "Public read promises" on promises for select using (true);
create policy "Public read promise_updates" on promise_updates for select using (true);

-- Note: no insert/update/delete policies are defined for the public-read
-- tables above, so only the service role (used inside Edge Functions) can
-- write to them. This is intentional — see Section 17 (Security) of the
-- implementation plan.
