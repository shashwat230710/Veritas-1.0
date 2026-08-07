-- Dynamic Source Credibility Schema Extension
create table if not exists public.source_credibility_history (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete cascade,
  previous_score numeric check (previous_score between 0 and 100),
  new_score numeric check (new_score between 0 and 100),
  accuracy_rate numeric,
  verified_claims_count integer default 0,
  false_claims_count integer default 0,
  partially_correct_count integer default 0,
  evidence_quality_avg numeric,
  bias_trend text,
  transparency_rating numeric,
  retraction_count integer default 0,
  confidence_interval_low numeric,
  confidence_interval_high numeric,
  change_reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_source_cred_history on public.source_credibility_history(source_id, created_at desc);

-- Add missing dynamic metric fields to sources table
alter table public.sources 
  add column if not exists verified_claims integer default 0,
  add column if not exists false_claims integer default 0,
  add column if not exists partially_correct_claims integer default 0,
  add column if not exists evidence_quality_avg numeric default 80.0,
  add column if not exists bias_trend text default 'Center',
  add column if not exists transparency_rating numeric default 85.0,
  add column if not exists update_frequency text default 'Daily',
  add column if not exists retraction_history_count integer default 0,
  add column if not exists last_reviewed_at timestamptz default now(),
  add column if not exists ci_lower numeric default 75.0,
  add column if not exists ci_upper numeric default 95.0;
