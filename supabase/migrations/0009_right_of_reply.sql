-- Right of Reply System
create table if not exists public.right_of_reply_claims (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  claim_id uuid references public.claims(id) on delete cascade,
  entity_name text not null,
  entity_contact_email text not null,
  official_statement text not null,
  clarification_text text,
  supporting_evidence_urls text[] default '{}',
  verification_status text check (verification_status in ('pending','verified_official','rejected')) default 'pending',
  reviewer_notes text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_right_of_reply_article on public.right_of_reply_claims(article_id);

alter table public.right_of_reply_claims enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public read approved right_of_reply') then
    create policy "Public read approved right_of_reply" on public.right_of_reply_claims for select using (verification_status = 'verified_official');
  end if;
end
$$;
