# Veritas — Truth Platform

Signal over noise, verified over viral.

Built with TanStack Start, Supabase, and Claude. See `docs/implementation-plan.md`
for the full product + engineering plan this build follows.

## Stack
- **Frontend**: TanStack Start (Vite + React 19 + TanStack Router/Query), Tailwind v4, shadcn/ui
- **Backend**: Supabase (Postgres + pgvector, Auth, Storage, Edge Functions)
- **AI**: Anthropic Claude API, called from Edge Functions

## Getting started

```sh
npm install --legacy-peer-deps   # required: @hookform/resolvers' optional
                                  # valibot peer conflicts with another
                                  # transitive dependency as of the pinned
                                  # versions in package.json
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

### Supabase setup
1. Create a project at supabase.com (or use your existing Lovable Cloud project).
2. Enable the `vector` extension (done automatically by the first migration).
3. Run the migrations in `supabase/migrations/` in order, either via the
   Supabase SQL editor or the CLI:
   ```sh
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
4. Deploy the Edge Functions:
   ```sh
   supabase functions deploy analyze
   supabase functions deploy chat
   supabase functions deploy ingest-news
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   ```
5. Enable Google as an OAuth provider under Authentication → Providers.

### Populating the Feed (news ingestion)
`ingest-news` pulls real, live articles from BBC RSS feeds — no API key
required, so the Feed doesn't start empty. Run it once manually to populate:
```sh
curl -X POST https://<project-ref>.supabase.co/functions/v1/ingest-news \
  -H "Authorization: Bearer <your-anon-or-service-key>"
```
(or click "Invoke" on the function in the Supabase dashboard). For it to
behave like a genuinely live feed, schedule it to re-run periodically —
in the SQL editor:
```sql
select cron.schedule(
  'ingest-news-every-15-min',
  '*/15 * * * *',
  $$ select net.http_post(
    url := 'https://<project-ref>.supabase.co/functions/v1/ingest-news',
    headers := '{"Authorization": "Bearer <service-role-key>"}'::jsonb
  ) $$
);
```
(Requires the `pg_cron` and `pg_net` extensions, enabled under
Database → Extensions.)

### AI features
Both the Truth Analyzer (`analyze`) and Assistant (`chat`) functions use
Claude's real-time web_search tool, so they're grounded in current
information rather than only Claude's training data — this matters
especially for verifying anything recent or freshly viral. Both just need
`ANTHROPIC_API_KEY` set as a function secret (step 4 above).

## Project status

See `PHASES.md` for what's built vs. what's next.
