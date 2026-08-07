-- Audit Trail & Verdict Revision History
create table if not exists public.fact_check_revisions (
  id uuid primary key default gen_random_uuid(),
  fact_check_id uuid not null references public.fact_checks(id) on delete cascade,
  claim_id uuid not null references public.claims(id) on delete cascade,
  revision_number integer not null,
  old_truth_score numeric,
  new_truth_score numeric,
  old_verdict text,
  new_verdict text,
  old_confidence text,
  new_confidence text,
  added_evidence_ids uuid[] default '{}',
  removed_evidence_ids uuid[] default '{}',
  methodology_version text not null,
  reason_for_update text not null,
  ai_explanation text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_revisions_fact_check on public.fact_check_revisions(fact_check_id, revision_number desc);

alter table public.fact_check_revisions enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public read fact_check_revisions') then
    create policy "Public read fact_check_revisions" on public.fact_check_revisions for select using (true);
  end if;
end
$$;
