# Build Phases

Tracks progress against `docs/implementation-plan.md` §12. Commit after each
checkbox group, not after every file.

## Phase 1 — Foundation
- [x] Project scaffold (TanStack Start + Vite + Tailwind v4, matching the
      original design tokens exactly)
- [x] Database schema migrated (`supabase/migrations/0001`–`0005`)
- [x] Auth session wiring (`src/lib/useSession.ts`, Supabase Auth)
- [x] Feed route with real data + tabs (For you / Trending / Breaking /
      Needs attention / Live) — see below, tabs now have real distinct logic
- [x] Keep an Eye button wired to real `watchlists` inserts
- [x] **News ingestion** — `ingest-news` Edge Function pulls real, live
      articles from BBC RSS feeds (Technology/Business/Science/Health/
      Politics/World), upserts into `sources`/`articles`, safe to re-run on
      a schedule. Deploy + invoke once to populate the Feed; schedule via
      `pg_cron` for ongoing "Live" behavior (see README).
- [ ] Google OAuth actually configured in a live Supabase project (needs
      your Supabase project + Google Cloud OAuth credentials — can't be
      done from a chat sandbox)
- [ ] Broader news sources (NewsAPI/GNews) beyond the BBC RSS default

## Phase 2 — Core AI
- [x] Truth Analyzer UI (submission form + result display); icons for
      image/PDF/YouTube/voice are now honestly disabled with "coming soon"
      rather than looking clickable and doing nothing
- [x] **`analyze` Edge Function — now handles text AND URLs.** URLs are
      fetched and their readable text extracted server-side; both are fact
      -checked using Claude's real-time web_search tool (not just training
      data), and results (claim, evidence, verdict) persist to
      `claims`/`fact_checks`/`evidence`
- [x] **`chat` Edge Function — now web-search-grounded** and reads
      `profiles.meme_mode` to adjust tone without changing hedges/confidence
- [x] Meme Mode: toggle in Settings persists and now actually changes
      Assistant behavior end to end
- [ ] OCR pipeline for image submissions
- [ ] YouTube transcript analysis
- [ ] Internal corpus semantic search (pgvector over ingested `articles`) —
      real-time web search covers arbitrary external claims for now, but
      cross-referencing our own ingested corpus is still unbuilt

## Phase 3 — Memory & Alerts
- [x] Keep an Eye list + timeline detail routes (UI + queries)
- [ ] `watchlist-poll` Edge Function (stub only)
- [ ] `notify` Edge Function (stub only)
- [ ] `pg_cron` schedule wiring
- [x] Realtime wiring — done for the Feed's Live tab (new articles stream
      in); watchlist-update realtime push is still open

## Phase 4 — Depth
- [x] Needs Attention: now a real (if simple) importance PROXY — excludes
      nothing by category name (that was a bug — real ingested categories
      are topical, not "Trending"/"Breaking"), instead surfaces older,
      still-recent stories ordered oldest-first. Still not the real
      importance-ranking model (needs signals like coverage breadth/
      population affected that don't exist yet)
- [x] Trending tab: honest placeholder — same recency feed, documented in
      code as a stand-in until real cross-source velocity scoring exists
- [ ] Bias Analyzer
- [ ] Decide: dedicated Misinformation/Accountability pages, or keep as
      Feed tags (open question from the implementation plan)

## Phase 5 — Scale & Advanced AI
- [ ] Everything — not started
