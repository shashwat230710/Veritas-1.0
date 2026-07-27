import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database, FeedItem } from "@/lib/database.types";

export type FeedTab = "for-you" | "trending" | "breaking" | "needs-attention" | "live";

const BREAKING_WINDOW_HOURS = 24;
const NEEDS_ATTENTION_MAX_AGE_DAYS = 30;

type FeedRow = Database["public"]["Views"]["feed_items"]["Row"];

async function fetchWatchedIds(userId: string | undefined): Promise<Set<string>> {
  if (!userId) return new Set();
  const { data } = await supabase.from("watchlists").select("subject_ref").eq("user_id", userId);
  return new Set((data ?? []).map((w) => w.subject_ref));
}

function toFeedItems(rows: FeedRow[], watchedIds: Set<string>): FeedItem[] {
  return rows.map((a) => ({
    id: a.id,
    category: a.category,
    title: a.title,
    summary: a.summary,
    truthScore: a.truth_score,
    confidence: a.confidence,
    verdict: a.verdict,
    isWatched: watchedIds.has(a.id),
  }));
}

export function useFeed(tab: FeedTab, userId: string | undefined) {
  const queryClient = useQueryClient();

  // "Live" gets a Realtime subscription so newly-ingested articles stream
  // in without a manual refresh — the one tab where that behavior actually
  // matters. Requires `articles` to be added to the supabase_realtime
  // publication (see supabase/migrations/0005_realtime.sql).
  useEffect(() => {
    if (tab !== "live") return;
    const channel = supabase
      .channel("live-articles")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "articles" },
        () => queryClient.invalidateQueries({ queryKey: ["feed", "live", userId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tab, userId, queryClient]);

  return useQuery({
    queryKey: ["feed", tab, userId],
    queryFn: async (): Promise<FeedItem[]> => {
      const now = Date.now();
      const watchedIds = await fetchWatchedIds(userId);

      if (tab === "for-you") {
        const { data: profile } = userId
          ? await supabase.from("profiles").select("interests").eq("id", userId).single()
          : { data: null };

        let query = supabase
          .from("feed_items")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(30);
        if (profile?.interests?.length) {
          query = query.in("category", profile.interests);
        }
        const { data, error } = await query;
        if (error) throw error;
        return toFeedItems(data ?? [], watchedIds);
      }

      if (tab === "breaking" || tab === "live") {
        const cutoff = new Date(now - BREAKING_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
        const { data, error } = await supabase
          .from("feed_items")
          .select("*")
          .gte("published_at", cutoff)
          .order("published_at", { ascending: false })
          .limit(30);
        if (error) throw error;
        return toFeedItems(data ?? [], watchedIds);
      }

      if (tab === "needs-attention") {
        // Importance-ranked, not popularity-ranked: surfaces stories that
        // have been sitting for a while, oldest first, rather than the
        // freshest ones. This is a recency-based PROXY for "importance"
        // until the real ranking model exists (implementation plan §12,
        // Phase 4) — a genuine importance score needs signals this MVP
        // doesn't have yet (coverage breadth, population affected, etc).
        const cutoff = new Date(
          now - NEEDS_ATTENTION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
        ).toISOString();
        const { data, error } = await supabase
          .from("feed_items")
          .select("*")
          .gte("published_at", cutoff)
          .order("published_at", { ascending: true })
          .limit(30);
        if (error) throw error;
        return toFeedItems(data ?? [], watchedIds);
      }

      // "trending" — real cross-source velocity scoring is a Phase 4
      // Recommendation Agent job (implementation plan §7). Until then this
      // is the same recency feed as the default view, kept as its own tab
      // so routing/UI don't need to change shape once real ranking lands.
      const { data, error } = await supabase
        .from("feed_items")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return toFeedItems(data ?? [], watchedIds);
    },
  });
}
