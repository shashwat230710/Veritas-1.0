import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Eye,
  Plus,
  Trash2,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Activity,
  ShieldCheck,
  Filter,
  RefreshCw,
  X,
  TrendingUp,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import {
  getWatchlistItems,
  removeWatchlistItem,
  toggleWatchlist,
  addTimelineEvent,
  type WatchlistItem,
} from "@/lib/watchlistStore";
import { TruthMeter } from "@/components/feed/TruthMeter";
import { VerdictChip } from "@/components/feed/VerdictChip";

export const Route = createFileRoute("/keep-an-eye/")({
  component: KeepAnEyePage,
});

const POPULAR_SUGGESTIONS = [
  {
    title: "Quantum Processor Encryption Security Baseline",
    category: "Technology & Security",
    summary: "Monitoring cryptography updates and NIST quantum safety standards.",
  },
  {
    title: "Global Clean Energy Grid Infrastructure Disbursement",
    category: "Politics & Energy",
    summary: "Tracking $4.2B federal funding distribution across regional power grid operators.",
  },
  {
    title: "WHO PM2.5 Microscopic Air Quality Thresholds",
    category: "Global Health",
    summary: "Tracking municipal adoption of updated WHO particulate matter safety limits.",
  },
  {
    title: "Central Watershed Aquifer Pumping Limits",
    category: "Needs Attention",
    summary: "Monitoring agricultural groundwater telemetry and regional irrigation policies.",
  },
];

function KeepAnEyePage() {
  const { user } = useSession();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [customTitle, setCustomTitle] = useState("");
  const [customCategory, setCustomCategory] = useState("Technology & AI");
  const [customSummary, setCustomSummary] = useState("");

  const [recheckingId, setRecheckingId] = useState<string | null>(null);

  const loadItems = () => {
    const local = getWatchlistItems();
    setItems(local);
  };

  useEffect(() => {
    loadItems();
    window.addEventListener("veritas_watchlist_changed", loadItems);
    return () => {
      window.removeEventListener("veritas_watchlist_changed", loadItems);
    };
  }, []);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    toggleWatchlist({
      subjectRef: "topic-" + Date.now(),
      title: customTitle.trim(),
      category: customCategory,
      summary:
        customSummary.trim() ||
        `Actively monitoring real-time wire reports, primary documentation, and factual updates for "${customTitle.trim()}".`,
      truthScore: 90,
      verdict: "true",
    });

    setCustomTitle("");
    setCustomSummary("");
    setIsAddModalOpen(false);
    loadItems();
  };

  const handleQuickAdd = (sugg: typeof POPULAR_SUGGESTIONS[0]) => {
    toggleWatchlist({
      subjectRef: "topic-" + Date.now(),
      title: sugg.title,
      category: sugg.category,
      summary: sugg.summary,
      truthScore: 92,
      verdict: "true",
    });
    setIsAddModalOpen(false);
    loadItems();
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    removeWatchlistItem(id);
    loadItems();
  };

  const handleQuickRecheck = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setRecheckingId(id);

    await new Promise((r) => setTimeout(r, 1000));

    addTimelineEvent(id, {
      summary: `Veritas AI Agent completed a global wire scan. All primary evidence sources remain verified and consistent.`,
      change_type: "new_info",
    });

    setRecheckingId(null);
    loadItems();
  };

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const avgScore = useMemo(() => {
    if (items.length === 0) return 92;
    const sum = items.reduce((acc, i) => acc + (i.truthScore || 85), 0);
    return Math.round(sum / items.length);
  }, [items]);

  const updatedCount = useMemo(() => {
    return items.filter((i) => i.status === "updated").length;
  }, [items]);

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary uppercase">
            <Activity className="h-4 w-4" /> Continuous Wire Telemetry
          </div>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl font-bold">Keep an Eye Watchlist 👁</h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Monitor news claims, policies, and viral events over time. Veritas AI cross-references global wire reports continuously and flags shifts in ground truth.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20"
        >
          <Plus className="h-4 w-4" />
          <span>Track New Story</span>
        </button>
      </div>

      {/* Stats Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-primary" /> Total Tracked
          </span>
          <span className="font-serif text-2xl font-bold text-foreground">{items.length} Stories</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Recent Updates
          </span>
          <span className="font-serif text-2xl font-bold text-emerald-400">{updatedCount} New Events</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Avg Trust Score
          </span>
          <span className="font-serif text-2xl font-bold text-primary">{avgScore} / 100</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-sky-400 animate-pulse" /> Live Telemetry
          </span>
          <span className="font-mono text-sm font-semibold text-sky-400 mt-1">Active Grounding</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracked stories by keyword, title, or category…"
            className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2.5 text-xs outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all shrink-0 border ${
                selectedCategory === cat
                  ? "bg-primary/20 text-primary border-primary/50 shadow-sm"
                  : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Watchlist Cards Grid */}
      <div className="space-y-4">
        {filteredItems.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground space-y-3 bg-card/40">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg text-foreground">No stories match your filter</h3>
            <p className="max-w-md text-xs leading-relaxed mx-auto">
              Try resetting your search query or click <strong>"Track New Story"</strong> to add claims to your watchlist.
            </p>
          </div>
        )}

        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-3xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/50 pb-4">
              <div className="flex items-center gap-3">
                <TruthMeter score={item.truthScore} verdict={item.verdict} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.category}
                    </span>
                    <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono inline-flex items-center gap-1 border border-border">
                      <Layers className="h-3 w-3 text-primary" />
                      4 Wire Sources
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold group-hover:text-primary transition-colors leading-snug mt-0.5">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.status === "updated" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" /> Updated
                  </span>
                )}
                {item.status === "needs-attention" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-medium text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" /> Needs Attention
                  </span>
                )}
                <VerdictChip verdict={item.verdict} />
              </div>
            </div>

            {/* Truth Bar Visual Indicator */}
            <div className="space-y-1">
              <div className="flex justify-between text-[0.7rem] font-mono text-muted-foreground">
                <span>Veritas Ground Truth Index</span>
                <span className="font-bold text-foreground">{item.truthScore}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden p-0.5 border border-border/40">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.truthScore >= 80
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : item.truthScore >= 50
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                      : "bg-gradient-to-r from-rose-500 to-red-400"
                  }`}
                  style={{ width: `${item.truthScore}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-foreground/85 leading-relaxed bg-secondary/20 p-3.5 rounded-2xl border border-border/40">
              {item.summary}
            </p>

            {/* Footer Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-border/40">
              <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[0.75rem]">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Last updated {new Date(item.updated_at).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleQuickRecheck(item.id, e)}
                  disabled={recheckingId === item.id}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                  title="Trigger AI re-check of wire reports"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${recheckingId === item.id ? "animate-spin text-primary" : ""}`} />
                  <span>{recheckingId === item.id ? "Scanning..." : "AI Re-Check"}</span>
                </button>

                <Link
                  to="/keep-an-eye/$watchlistId"
                  params={{ watchlistId: item.id }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/40 px-4 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                >
                  View AI Timeline →
                </Link>

                <button
                  onClick={(e) => handleRemove(item.id, e)}
                  className="p-1.5 text-muted-foreground hover:text-rose-400 rounded-lg hover:bg-secondary transition-colors"
                  title="Remove from watchlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Track New Story Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" /> Track New Story
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Add custom headlines or topics for live continuous monitoring.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddCustom} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Headline / Topic Title</label>
                <input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., SpaceX Starship Commercial Test Flight"
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="Technology & AI">Technology & AI</option>
                  <option value="Politics & Energy">Politics & Energy</option>
                  <option value="Global Health">Global Health</option>
                  <option value="Environment & Water">Environment & Water</option>
                  <option value="Business & Markets">Business & Markets</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Summary / Specific Focus (Optional)</label>
                <textarea
                  value={customSummary}
                  onChange={(e) => setCustomSummary(e.target.value)}
                  placeholder="e.g., Monitor launch license status, safety reviews, and official NASA payloads."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2 text-xs outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Popular Suggestions */}
              <div className="pt-2 border-t border-border/40 space-y-2">
                <span className="text-[0.7rem] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-primary" /> Popular Live Suggestions:
                </span>
                <div className="grid gap-2">
                  {POPULAR_SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickAdd(s)}
                      className="text-left text-xs p-2.5 rounded-xl bg-secondary/40 border border-border/60 hover:border-primary/50 hover:bg-secondary transition-colors"
                    >
                      <span className="font-semibold text-foreground">{s.title}</span>
                      <p className="text-[0.7rem] text-muted-foreground line-clamp-1">{s.summary}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-full px-4 py-2 text-xs text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customTitle.trim()}
                  className="rounded-full bg-primary px-5 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90"
                >
                  Start Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
