-- Community Evidence Layer Schema
create table if not exists public.community_evidence (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  evidence_type text check (evidence_type in ('supporting','contradicting','official_doc','research_paper','govt_source','court_order','archived_link','image','video','pdf')),
  title text not null,
  description text,
  url text,
  file_path text,
  source_type text default 'user_submission',
  reliability_score numeric check (reliability_score between 0 and 100),
  evidence_strength integer check (evidence_strength between 1 and 5),
  ai_confidence numeric check (ai_confidence between 0 and 100),
  verification_status text check (verification_status in ('pending','approved','rejected','flagged')) default 'pending',
  rejection_reason text,
  ai_summary text,
  created_at timestamptz not null default now()
);

create index if not exists idx_community_evidence_claim on public.community_evidence(claim_id);
create index if not exists idx_community_evidence_status on public.community_evidence(verification_status);

-- RLS for Community Evidence
alter table public.community_evidence enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public read approved community evidence') then
    create policy "Public read approved community evidence"
      on public.community_evidence for select
      using (verification_status = 'approved' or auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Users submit own community evidence') then
    create policy "Users submit own community evidence"
      on public.community_evidence for insert
      with check (auth.uid() = user_id);
  end if;
end
$$;
