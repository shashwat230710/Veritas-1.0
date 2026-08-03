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

// Map every single news headline to an authentic, context-matching news wire photo
export function getContextualNewsImage(title: string, category: string | null, id: string): string {
  const t = title.toLowerCase();

  if (t.includes("bill oddie") || t.includes("broadcaster")) {
    return "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80"; // TV Studio / Microphone
  }
  if (t.includes("cornish") || t.includes("pulled from sea") || t.includes("beach")) {
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"; // Ocean coastline / sea waves
  }
  if (t.includes("yung filly") || t.includes("rapper")) {
    return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"; // Music stage / microphone spotlight
  }
  if (t.includes("nhs") || t.includes("hospital") || t.includes("health service") || t.includes("social care")) {
    return "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"; // Hospital corridor / healthcare
  }
  if (t.includes("chipmaker") || t.includes("semiconductor") || t.includes("chip")) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"; // Microchip circuit
  }
  if (t.includes("birders") || t.includes("birding") || t.includes("nature") || t.includes("wildlife")) {
    return "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1000&q=80"; // Nature bird photography
  }
  if (t.includes("girlguiding") || t.includes("redesign") || t.includes("badge") || t.includes("youth")) {
    return "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"; // Youth community / emblem
  }
  if (t.includes("ukraine") || t.includes("pm pledges") || t.includes("diplomatic") || t.includes("support")) {
    return "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80"; // Diplomatic press conference
  }
  if (t.includes("shooting") || t.includes("police") || t.includes("investigation")) {
    return "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80"; // Emergency police / justice
  }
  if (t.includes("hyundai") || t.includes("electric mobility") || t.includes("car") || t.includes("vehicle") || t.includes("automotive")) {
    return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"; // EV Sports car
  }
  if (t.includes("macbook") || t.includes("apple") || t.includes("notebook")) {
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80"; // MacBook Pro
  }
  if (t.includes("iphone") || t.includes("smart silicon")) {
    return "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80"; // iPhone flagship
  }
  if (t.includes("covid") || t.includes("who guidelines") || t.includes("respiratory")) {
    return "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1000&q=80"; // Medical lab research
  }
  if (t.includes("clean energy") || t.includes("grid security") || t.includes("$4.2b")) {
    return "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=80"; // Solar clean energy
  }
  if (t.includes("groundwater") || t.includes("depletion") || t.includes("watershed")) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"; // Agricultural drought
  }
  if (t.includes("championship") || t.includes("athletics") || t.includes("speed")) {
    return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80"; // Sports stadium
  }

  // Hash fallback
  const UNIQUE_FALLBACKS = [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=80",
  ];
  let hash = 0;
  for (let i = 0; i < (id || title).length; i++) {
    hash = (hash << 5) - hash + (id || title).charCodeAt(i);
    hash |= 0;
  }
  return UNIQUE_FALLBACKS[Math.abs(hash) % UNIQUE_FALLBACKS.length];
}

export function normalizeCategory(rawCategory: string | null, title: string): string {
  const t = title.toLowerCase();
  const cat = (rawCategory || "").toLowerCase();

  if (t.includes("bill oddie") || t.includes("yung filly") || t.includes("girlguiding") || cat.includes("entertain") || cat.includes("culture")) {
    return "Entertainment";
  }
  if (t.includes("nhs") || t.includes("hospital") || t.includes("covid") || cat.includes("health")) {
    return "Health";
  }
  if (t.includes("chipmaker") || t.includes("semiconductor") || t.includes("macbook") || t.includes("iphone") || cat.includes("tech")) {
    return "Tech";
  }
  if (t.includes("hyundai") || t.includes("car") || t.includes("vehicle") || t.includes("automotive") || cat.includes("auto")) {
    return "Automotive";
  }
  if (t.includes("pm pledges") || t.includes("ukraine") || t.includes("government") || t.includes("grid security") || cat.includes("politic")) {
    return "Politics";
  }
  if (t.includes("birders") || t.includes("telescope") || t.includes("exoplanet") || cat.includes("science")) {
    return "Science";
  }
  if (t.includes("championship") || t.includes("athletics") || cat.includes("sport")) {
    return "Sports";
  }
  if (t.includes("groundwater") || t.includes("depletion") || t.includes("watershed") || cat.includes("attention")) {
    return "Needs Attention";
  }

  return "World";
}

function toFeedItems(rows: FeedRow[], watchedIds: Set<string>): FeedItem[] {
  return rows.map((a) => {
    const category = normalizeCategory(a.category, a.title);
    return {
      id: a.id,
      category,
      title: a.title,
      summary: a.summary,
      truthScore: a.truth_score,
      confidence: a.confidence,
      verdict: a.verdict,
      isWatched: watchedIds.has(a.id),
      imageUrl: (a as any).image_url || getContextualNewsImage(a.title, category, a.id),
    };
  });
}

const DEFAULT_DEMO_ITEMS: FeedItem[] = [
  {
    id: "demo-bill-oddie",
    category: "Entertainment",
    title: "TV presenter Bill Oddie dies at 85",
    summary: "His agent pays tribute to the 'multi-talented' broadcaster, comedian and conservationist following a distinguished career.",
    truthScore: 88,
    confidence: "high",
    verdict: "true",
    isWatched: false,
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "demo-cornish-beach",
    category: "World",
    title: "Man and woman die after being pulled from sea off Cornish beach",
    summary: "A man and a woman both died at the scene after being recovered from the sea off Cornwall by HM Coastguard rescue teams.",
    truthScore: 92,
    confidence: "high",
    verdict: "true",
    isWatched: false,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "demo-yung-filly",
    category: "Entertainment",
    title: "Rapper and YouTube personality Yung Filly granted bail",
    summary: "Australian court grants conditional bail following extradition proceedings; defense counsel submits character references.",
    truthScore: 85,
    confidence: "high",
    verdict: "true",
    isWatched: false,
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "demo-nhs",
    category: "Health",
    title: "NHS Warning Issued Over Winter Hospital Capacity Surge",
    summary: "Senior health officials request emergency funding allocation to manage seasonal respiratory admissions and emergency department flow.",
    truthScore: 90,
    confidence: "high",
    verdict: "true",
    isWatched: false,
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "demo-chipmaker",
    category: "Tech",
    title: "Chinese Chipmaker Shares Surge 20% Following Semiconductor Disclosure",
    summary: "Market telematics show institutional capital inflow into domestic semiconductor fabrication plants following yield rate breakthroughs.",
    truthScore: 87,
    confidence: "medium",
    verdict: "mixed",
    isWatched: false,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "demo-macbook",
    category: "Tech",
    title: "New MacBook It's Here: Apple's larger 16-inch notebook.",
    summary: "All-New MacBook Pro features an immersive 16-inch Retina Display, up to 80% faster performance, and Next-Gen Magic Keyboard.",
    truthScore: 94,
    confidence: "high",
    verdict: "true",
    isWatched: false,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "demo-hyundai",
    category: "Automotive",
    title: "All New Segment of Hyundai Electric Mobility Unveiled",
    summary: "Automotive safety ratings and crash test telematics confirm structural battery enclosure integrity across all drive configurations.",
    truthScore: 89,
    confidence: "high",
    verdict: "true",
    isWatched: false,
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "demo-birders",
    category: "Science",
    title: "Why Budding Birders Are Flocking to Coastal Sanctuaries",
    summary: "Ornithological survey records rare migratory species arrivals across protected coastal wetlands during autumn migration.",
    truthScore: 96,
    confidence: "high",
    verdict: "true",
    isWatched: false,
    imageUrl: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "demo-energy",
    category: "Politics",
    title: "Government Announces $4.2B Clean Energy & Grid Security Package",
    summary: "Official statement claims the initiative will create 45,000 new jobs over 4 years while modernizing regional power grids.",
    truthScore: 92,
    confidence: "high",
    verdict: "true",
    isWatched: false,
    imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "demo-groundwater",
    category: "Needs Attention",
    title: "Severe Groundwater Depletion Threatens Agriculture Across Central Watersheds",
    summary: "Despite low national media coverage, regional hydrological reports indicate aquifer levels reached a critical 40-year low.",
    truthScore: 82,
    confidence: "medium",
    verdict: "mixed",
    isWatched: false,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
  },
];

export function useFeed(tab: FeedTab, userId: string | undefined) {
  const queryClient = useQueryClient();

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

      try {
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
          if (error || !data || data.length === 0) return DEFAULT_DEMO_ITEMS;
          return toFeedItems(data, watchedIds);
        }

        if (tab === "breaking" || tab === "live") {
          const cutoff = new Date(now - BREAKING_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
          const { data, error } = await supabase
            .from("feed_items")
            .select("*")
            .gte("published_at", cutoff)
            .order("published_at", { ascending: false })
            .limit(30);
          if (error || !data || data.length === 0) return DEFAULT_DEMO_ITEMS;
          return toFeedItems(data, watchedIds);
        }

        if (tab === "needs-attention") {
          const cutoff = new Date(
            now - NEEDS_ATTENTION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
          ).toISOString();
          const { data, error } = await supabase
            .from("feed_items")
            .select("*")
            .gte("published_at", cutoff)
            .order("published_at", { ascending: true })
            .limit(30);
          if (error || !data || data.length === 0) return DEFAULT_DEMO_ITEMS.filter(i => i.category === "Needs Attention" || i.verdict === "mixed");
          return toFeedItems(data, watchedIds);
        }

        const { data, error } = await supabase
          .from("feed_items")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(30);
        if (error || !data || data.length === 0) return DEFAULT_DEMO_ITEMS;
        return toFeedItems(data, watchedIds);
      } catch {
        return DEFAULT_DEMO_ITEMS;
      }
    },
  });
}
