-- Without this, supabase.channel(...).on('postgres_changes', ...) for
-- `articles` silently never fires — table-level changes aren't broadcast
-- until added to the realtime publication.

alter publication supabase_realtime add table articles;
