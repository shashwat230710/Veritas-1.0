// Deno Edge Function: POST /functions/v1/ingest-news
//
// Phase 1/4 News Collector agent (implementation plan §7) — MVP version.
// Pulls from free, no-API-key-required BBC RSS feeds and upserts into
// `sources` / `articles`. Designed to be re-run on a schedule (pg_cron)
// without creating duplicates: both sources and articles are upserted on
// a unique key (domain, url respectively).
//
// This intentionally does NOT set any verdict/truth_score — ingested
// articles start unanalyzed (feed_items.verdict = null, rendered as
// "Not yet analyzed" in the UI). Only the Truth Analyzer or a future
// automated fact-check pass should ever write to fact_checks.
//
// Swap in NewsAPI/GNews later for broader coverage — see the implementation
// plan §9 (APIs) for those integrations; this RSS-based collector is the
// zero-signup default so the Feed isn't empty on day one.

import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const FEEDS: { url: string; category: string; sourceName: string; domain: string }[] = [
  { url: "https://feeds.bbci.co.uk/news/rss.xml", category: "World", sourceName: "BBC News", domain: "bbc.com" },
  { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", category: "Technology", sourceName: "BBC News", domain: "bbc.com" },
  { url: "https://feeds.bbci.co.uk/news/business/rss.xml", category: "Business", sourceName: "BBC News", domain: "bbc.com" },
  { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", category: "Science", sourceName: "BBC News", domain: "bbc.com" },
  { url: "https://feeds.bbci.co.uk/news/health/rss.xml", category: "Health", sourceName: "BBC News", domain: "bbc.com" },
  { url: "https://feeds.bbci.co.uk/news/politics/rss.xml", category: "Politics", sourceName: "BBC News", domain: "bbc.com" },
];

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string | null;
}

function decodeEntities(str: string): string {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match) return "";
  const raw = match[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return decodeEntities((cdata ? cdata[1] : raw).trim());
}

function parseRss(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  for (const block of blocks) {
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const description = extractTag(block, "description")
      .replace(/<[^>]+>/g, "")
      .slice(0, 500);
    const pubDate = extractTag(block, "pubDate") || null;
    if (title && link) items.push({ title, link, description, pubDate });
  }
  return items;
}

async function ingestFeed(feed: (typeof FEEDS)[number]) {
  const res = await fetch(feed.url, {
    headers: { "user-agent": "VeritasNewsCollector/1.0" },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const xml = await res.text();
  const items = parseRss(xml);

  const { data: source, error: sourceErr } = await supabase
    .from("sources")
    .upsert(
      { name: feed.sourceName, domain: feed.domain, verified: true, credibility_score: 80 },
      { onConflict: "domain" },
    )
    .select()
    .single();
  if (sourceErr) throw sourceErr;

  let upserted = 0;
  for (const item of items) {
    const { error } = await supabase.from("articles").upsert(
      {
        title: item.title,
        body: item.description,
        url: item.link,
        source_id: source.id,
        category: feed.category,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      },
      { onConflict: "url" },
    );
    if (!error) upserted++;
  }
  return { category: feed.category, found: items.length, upserted };
}

Deno.serve(async () => {
  const results = [];
  for (const feed of FEEDS) {
    try {
      results.push(await ingestFeed(feed));
    } catch (err) {
      // One dead/rate-limited feed shouldn't take down the whole run.
      results.push({ category: feed.category, error: String(err) });
    }
  }
  return new Response(JSON.stringify({ ranAt: new Date().toISOString(), results }), {
    headers: { "content-type": "application/json" },
  });
});