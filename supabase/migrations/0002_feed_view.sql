-- Read-only convenience view for the Feed: each article joined with the
-- most recent fact-check on its most recent claim (if any). Kept as a view
-- rather than denormalized columns so fact-checks can be re-run over time
-- without ever losing history in the underlying tables.

create or replace view feed_items as
select
  a.id,
  a.category,
  a.title,
  a.body as summary,
  a.published_at,
  fc.truth_score,
  fc.confidence,
  fc.verdict
from articles a
left join lateral (
  select c.id
  from claims c
  where c.article_id = a.id
  order by c.created_at desc
  limit 1
) latest_claim on true
left join lateral (
  select f.truth_score, f.confidence, f.verdict
  from fact_checks f
  where f.claim_id = latest_claim.id
  order by f.created_at desc
  limit 1
) fc on true
order by a.published_at desc nulls last;

-- Views inherit RLS from their underlying tables in Postgres 15+; articles/
-- claims/fact_checks already have public-read policies (0001_init.sql), so
-- no additional policy is needed here.
