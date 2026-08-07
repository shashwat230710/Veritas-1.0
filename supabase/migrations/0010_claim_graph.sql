-- Internal Claim Graph Schema
create table if not exists public.graph_nodes (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  node_type text check (node_type in ('claim','evidence','source','organization','person','event','location')) not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.graph_edges (
  id uuid primary key default gen_random_uuid(),
  source_node_id uuid not null references public.graph_nodes(id) on delete cascade,
  target_node_id uuid not null references public.graph_nodes(id) on delete cascade,
  relation_type text check (relation_type in ('supports','contradicts','mentions','originated_from','related_to','updated_by')) not null,
  weight numeric default 1.0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (source_node_id, target_node_id, relation_type)
);

create index if not exists idx_graph_edges_source on public.graph_edges(source_node_id);
create index if not exists idx_graph_edges_target on public.graph_edges(target_node_id);

alter table public.graph_nodes enable row level security;
alter table public.graph_edges enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public read graph_nodes') then
    create policy "Public read graph_nodes" on public.graph_nodes for select using (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Public read graph_edges') then
    create policy "Public read graph_edges" on public.graph_edges for select using (true);
  end if;
end
$$;
