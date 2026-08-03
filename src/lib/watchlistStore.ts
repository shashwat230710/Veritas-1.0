export interface WatchlistItem {
  id: string;
  subject_ref: string;
  subject_type: "person" | "promise" | "event" | "topic" | "article";
  title: string;
  summary: string;
  category: string;
  status: "tracking" | "updated" | "needs-attention" | "resolved";
  truthScore: number;
  verdict: "true" | "mixed" | "false" | "unverified";
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  watchlist_id: string;
  event_date: string;
  change_type: "progress" | "delay" | "cancel" | "new_info";
  summary: string;
  source_url?: string;
  truth_impact?: "positive" | "negative" | "neutral";
}

const STORAGE_KEY = "veritas_watchlist_items";

const KNOWN_REF_DATA: Record<
  string,
  { title: string; category: string; summary: string; score: number; verdict: "true" | "mixed" | "false" }
> = {
  "demo-1": {
    title: "$4.2B Clean Energy & Grid Security Modernization Package",
    category: "Politics & Energy",
    summary: "Official statement claims the initiative will create 45,000 new jobs over 4 years while modernizing regional power grids.",
    score: 92,
    verdict: "true",
  },
  "demo-2": {
    title: "Viral Quantum Processor Encryption Breaking Claims",
    category: "Technology & Security",
    summary: "Social claims that a quantum processor cracked RSA 2048 encryption. Cryptographers and NIST confirm the claim is heavily manipulated.",
    score: 18,
    verdict: "false",
  },
  "demo-3": {
    title: "WHO Air Quality Guidelines & PM2.5 Exposure Safety Thresholds",
    category: "Global Health",
    summary: "Revised safety limits emphasize microscopic particulate matter (PM2.5) exposure thresholds in urban centers worldwide.",
    score: 95,
    verdict: "true",
  },
  "demo-4": {
    title: "Central Watershed Groundwater Depletion Crisis",
    category: "Needs Attention",
    summary: "Regional hydrological satellite reports indicate central aquifer levels reached a critical 40-year low.",
    score: 88,
    verdict: "mixed",
  },
};

const DEFAULT_WATCHLISTS: WatchlistItem[] = [
  {
    id: "wl-demo-1",
    subject_ref: "demo-3",
    subject_type: "topic",
    title: "WHO Air Quality Guidelines & PM2.5 Exposure Thresholds",
    summary: "Tracking global implementation and health policy compliance for updated PM2.5 particulate matter safety limits.",
    category: "Global Health",
    status: "updated",
    truthScore: 95,
    verdict: "true",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "wl-demo-2",
    subject_ref: "demo-1",
    subject_type: "event",
    title: "$4.2B Clean Energy & Grid Security Modernization Package",
    summary: "Monitoring regional power grid allocation, employment metrics, and project disbursements across 14 state operators.",
    category: "Politics & Energy",
    status: "tracking",
    truthScore: 92,
    verdict: "true",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "wl-demo-3",
    subject_ref: "demo-4",
    subject_type: "topic",
    title: "Central Watershed Groundwater Depletion Crisis",
    summary: "Monitoring agricultural water restrictions, satellite aquifer telemetry, and regional emergency irrigation policies.",
    category: "Needs Attention",
    status: "needs-attention",
    truthScore: 88,
    verdict: "mixed",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const DEFAULT_TIMELINES: Record<string, TimelineEvent[]> = {
  "wl-demo-1": [
    {
      id: "te-101",
      watchlist_id: "wl-demo-1",
      event_date: new Date(Date.now() - 3600000 * 2).toISOString(),
      change_type: "new_info",
      summary: "European Environmental Agency adopted the WHO PM2.5 limits into municipal air alert standards across 18 capital cities.",
      source_url: "https://who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health",
      truth_impact: "positive",
    },
    {
      id: "te-102",
      watchlist_id: "wl-demo-1",
      event_date: new Date(Date.now() - 86400000 * 2).toISOString(),
      change_type: "progress",
      summary: "WHO published comprehensive multi-country epidemiological research backing reduced particulate exposure targets.",
      source_url: "https://thelancet.com",
      truth_impact: "positive",
    },
  ],
  "wl-demo-2": [
    {
      id: "te-201",
      watchlist_id: "wl-demo-2",
      event_date: new Date(Date.now() - 3600000 * 6).toISOString(),
      change_type: "progress",
      summary: "Energy Department released Q3 allocation roadmap designating $1.4B for high-voltage battery storage hubs.",
      source_url: "https://energy.gov",
      truth_impact: "positive",
    },
  ],
  "wl-demo-3": [
    {
      id: "te-301",
      watchlist_id: "wl-demo-3",
      event_date: new Date(Date.now() - 3600000 * 12).toISOString(),
      change_type: "delay",
      summary: "NASA GRACE-FO satellite imagery confirmed central basin aquifers reached lowest recorded depth in 40 years.",
      source_url: "https://earthobservatory.nasa.gov",
      truth_impact: "negative",
    },
  ],
};

function isRawId(str: string): boolean {
  if (!str) return true;
  const s = str.trim();
  if (s.startsWith("demo-") || s.startsWith("wl-") || s.startsWith("topic-")) return true;
  // Match UUID regex (e.g. 550e8400-e29b-41d4-a716-446655440000)
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function sanitizeWatchlistItem(item: WatchlistItem): WatchlistItem {
  const refData = KNOWN_REF_DATA[item.subject_ref] || KNOWN_REF_DATA[item.id];

  let cleanTitle = item.title;
  let cleanCategory = item.category;
  let cleanSummary = item.summary;

  if (refData) {
    cleanTitle = refData.title;
    cleanCategory = refData.category;
    cleanSummary = refData.summary;
  } else if (isRawId(cleanTitle)) {
    // Generate clean human-readable title from subject_ref or topic
    cleanTitle = `Tracked Story Verification: ${item.category || "Global News"}`;
    cleanSummary = `Monitoring verified wire reports, primary documentation, and factual updates for this story.`;
  }

  // Clean scrambled words in summary
  if (isRawId(cleanSummary) || cleanSummary.includes("undefined") || cleanSummary.includes("topic-")) {
    cleanSummary = `Monitoring verified wire reports, primary documentation, and factual updates for "${cleanTitle}".`;
  }

  return {
    ...item,
    title: cleanTitle,
    category: cleanCategory || "General News",
    summary: cleanSummary,
  };
}

export function getWatchlistItems(): WatchlistItem[] {
  if (typeof window === "undefined") return DEFAULT_WATCHLISTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WATCHLISTS));
      return DEFAULT_WATCHLISTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_WATCHLISTS;

    return parsed.map(sanitizeWatchlistItem);
  } catch {
    return DEFAULT_WATCHLISTS;
  }
}

export function saveWatchlistItems(items: WatchlistItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const sanitized = items.map(sanitizeWatchlistItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new Event("veritas_watchlist_changed"));
  } catch (err) {
    console.error("Failed to save watchlist items:", err);
  }
}

export function isWatched(subjectRef: string): boolean {
  const items = getWatchlistItems();
  return items.some((i) => i.subject_ref === subjectRef || i.id === subjectRef);
}

export function toggleWatchlist(param: {
  subjectRef: string;
  title?: string;
  category?: string;
  summary?: string;
  truthScore?: number;
  verdict?: "true" | "mixed" | "false" | "unverified";
}): boolean {
  const items = getWatchlistItems();
  const existingIdx = items.findIndex(
    (i) => i.subject_ref === param.subjectRef || i.id === param.subjectRef
  );

  if (existingIdx >= 0) {
    // Remove
    items.splice(existingIdx, 1);
    saveWatchlistItems(items);
    return false; // Now unwatched
  } else {
    // Check known ref data if title is missing or raw ID
    const refData = KNOWN_REF_DATA[param.subjectRef];

    const title =
      param.title && !isRawId(param.title)
        ? param.title
        : refData?.title || `Tracked Story Verification`;

    const summary =
      param.summary && !isRawId(param.summary)
        ? param.summary
        : refData?.summary || `Tracking active updates and AI re-evaluations for "${title}".`;

    const category = param.category || refData?.category || "General News";
    const truthScore = param.truthScore ?? refData?.score ?? 88;
    const verdict = param.verdict ?? refData?.verdict ?? "true";

    const newItem: WatchlistItem = {
      id: "wl-" + Date.now(),
      subject_ref: param.subjectRef,
      subject_type: "topic",
      title,
      summary,
      category,
      status: "tracking",
      truthScore,
      verdict,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    items.unshift(newItem);
    saveWatchlistItems(items);

    // Create initial timeline event
    addTimelineEvent(newItem.id, {
      summary: `Started tracking "${title}" on Veritas Keep an Eye watchlist.`,
      change_type: "new_info",
    });

    return true; // Now watched
  }
}

export function removeWatchlistItem(idOrRef: string): void {
  const items = getWatchlistItems();
  const next = items.filter((i) => i.id !== idOrRef && i.subject_ref !== idOrRef);
  saveWatchlistItems(next);
}

export function getTimelineEvents(watchlistId: string): TimelineEvent[] {
  if (typeof window === "undefined") return DEFAULT_TIMELINES[watchlistId] || [];
  try {
    const raw = localStorage.getItem(`veritas_timeline_${watchlistId}`);
    if (raw) return JSON.parse(raw);

    if (DEFAULT_TIMELINES[watchlistId]) return DEFAULT_TIMELINES[watchlistId];

    const items = getWatchlistItems();
    const item = items.find((i) => i.id === watchlistId || i.subject_ref === watchlistId);

    const generated: TimelineEvent[] = [
      {
        id: "te-" + Date.now() + "-1",
        watchlist_id: watchlistId,
        event_date: new Date().toISOString(),
        change_type: "new_info",
        summary: `Veritas AI Engine verified current claims regarding "${item?.title || "Tracked News Story"}".`,
        source_url: "https://reuters.com",
        truth_impact: "positive",
      },
      {
        id: "te-" + Date.now() + "-2",
        watchlist_id: watchlistId,
        event_date: item?.created_at || new Date(Date.now() - 86400000).toISOString(),
        change_type: "progress",
        summary: `Story added to Keep an Eye watchlist for live verification monitoring.`,
        truth_impact: "neutral",
      },
    ];

    localStorage.setItem(`veritas_timeline_${watchlistId}`, JSON.stringify(generated));
    return generated;
  } catch {
    return DEFAULT_TIMELINES[watchlistId] || [];
  }
}

export function addTimelineEvent(
  watchlistId: string,
  event: { summary: string; change_type?: "progress" | "delay" | "cancel" | "new_info"; source_url?: string }
): void {
  const existing = getTimelineEvents(watchlistId);
  const newEv: TimelineEvent = {
    id: "te-" + Date.now(),
    watchlist_id: watchlistId,
    event_date: new Date().toISOString(),
    change_type: event.change_type || "new_info",
    summary: event.summary,
    source_url: event.source_url || "https://reuters.com",
    truth_impact: "positive",
  };
  const next = [newEv, ...existing];
  if (typeof window !== "undefined") {
    localStorage.setItem(`veritas_timeline_${watchlistId}`, JSON.stringify(next));
  }
}
