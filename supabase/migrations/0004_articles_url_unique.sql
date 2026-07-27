-- Needed for `ingest-news`'s upsert(..., { onConflict: "url" }) to work —
-- without this, re-running ingestion on a schedule would create duplicate
-- article rows every time instead of refreshing existing ones.
-- Postgres allows multiple NULLs under a unique constraint, so this is safe
-- for any future rows without a url.

alter table articles add constraint articles_url_key unique (url);
