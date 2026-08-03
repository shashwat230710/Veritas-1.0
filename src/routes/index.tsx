import { createFileRoute, Link, useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, LayoutGrid, Flame, ShieldCheck, Filter, Sparkles } from "lucide-react";
import { FeedCard } from "@/components/feed/FeedCard";
import { ArticleDetailModal } from "@/components/feed/ArticleDetailModal";
import { CATEGORIES } from "@/components/layout/Sidebar";
import { useFeed, normalizeCategory, type FeedTab } from "@/lib/queries/useFeed";
import { useSession } from "@/lib/useSession";
import { useUserProfile } from "@/lib/userProfileStore";
import { useMemeMode } from "@/lib/useMemeMode";
import { ProfileDrawer } from "@/components/user/ProfileDrawer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  component: FeedPage,
});

function FeedPage() {
  const searchParams = useSearch({ from: "/" }) as { category?: string };
  const navigate = useNavigate({ from: "/" });
  const selectedCategory = searchParams?.category || "All";

  const [tab, setTab] = useState<FeedTab>("for-you");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSession();
  const { profile } = useUserProfile();
  const { memeMode, setMemeMode } = useMemeMode();
  const { data: items, isLoading, error } = useFeed(tab, user?.id);

  // Active story index for Next/Prev story scroll & modal navigation
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Account Profile Drawer modal toggle
  const [profileOpen, setProfileOpen] = useState(false);

  // Filter items by search query AND sidebar category cleanly
  const filteredItems = useMemo(() => {
    if (!items) return [];
    let list = items;

    // Filter by Category if selected
    if (selectedCategory && selectedCategory !== "All") {
      const catLower = selectedCategory.toLowerCase();
      list = list.filter((item) => {
        const normalized = normalizeCategory(item.category, item.title).toLowerCase();
        const rawCat = (item.category || "").toLowerCase();
        return normalized === catLower || rawCat.includes(catLower);
      });
    }

    // Filter by Search Query if typed
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.summary && item.summary.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [items, selectedCategory, searchQuery]);

  // Featured Trending Section uses top 2 stories from filtered view
  const trendingItems = useMemo(() => {
    if (!filteredItems || filteredItems.length === 0) return [];
    return filteredItems.slice(0, 2);
  }, [filteredItems]);

  const activeArticle = activeStoryIndex !== null ? filteredItems[activeStoryIndex] : null;

  const handleCategorySelect = (cat: string) => {
    navigate({ search: { category: cat } });
  };

  return (
    <div className="max-w-6xl space-y-6 sm:space-y-8 font-sans pb-16">
      {/* Meme Mode Top Ticker (if active) */}
      {memeMode && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300 flex items-center justify-between shadow-lg shadow-amber-500/10 animate-pulse">
          <div className="flex items-center gap-2 font-bold tracking-wide">
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
            <span>🔥 MEME MODE ACTIVE: 100% NO CAP • FAKE NEWS BUSTED WITH SPICE 🍿</span>
          </div>
          <button
            onClick={() => setMemeMode(false)}
            className="text-[0.68rem] bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-500/40 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer"
          >
            Turn Off
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border ${
            memeMode ? "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/20" : "bg-orange-500/15 border-orange-500/30 text-orange-400"
          }`}>
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                {memeMode ? "Explore feed 🌶️" : "Explore"}
              </h1>
              {selectedCategory !== "All" && (
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[0.68rem] font-bold uppercase shadow-md">
                  {selectedCategory}
                </span>
              )}
            </div>
            <p className="text-[0.75rem] sm:text-xs text-slate-400">
              {memeMode ? "No Cap Signal • Certified Hood Ground Truth 🗿" : "Signal over noise • Verified Ground Truth"}
            </p>
          </div>
        </div>

        {/* Top Search Bar, Meme Toggle Badge & Interactive Profile Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={memeMode ? "Search claims for cap... 🧢" : "Search news, claims, topics..."}
              className="w-full rounded-2xl border border-white/10 bg-[#161c2b] py-2 sm:py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 outline-none focus:border-orange-500/60 transition-colors shadow-inner"
            />
          </div>

          <button
            onClick={() => setMemeMode(!memeMode)}
            title="Toggle Assistant Meme Mode"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              memeMode
                ? "bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30 scale-105"
                : "bg-[#161c2b] text-slate-400 border-white/10 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{memeMode ? "✨ MEME ON" : "✨ Meme Mode"}</span>
          </button>

          <button
            onClick={() => setProfileOpen(true)}
            aria-label="Open User Account Profile"
            className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full overflow-hidden border-2 border-orange-500/60 shadow-md hover:scale-105 transition-transform cursor-pointer group"
          >
            <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
          </button>
        </div>
      </div>

      {/* Featured Trending Section (rendered if items exist) */}
      {trendingItems.length > 0 && (
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-sans">
              <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              {memeMode ? "🔥 Viral & Trending" : "Trending"} {selectedCategory !== "All" ? `in ${selectedCategory}` : ""}
            </h2>
            <button
              onClick={() => handleCategorySelect("All")}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trendingItems.map((item, idx) => (
              <FeedCard
                key={"trending-" + item.id}
                item={item}
                userId={user?.id}
                variant="trending"
                onOpenDetail={() => setActiveStoryIndex(idx)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Feed Section: Today's Read */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-sans">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
              {memeMode ? "Today's spicy ground truth 🍿" : "Today's read"}
            </h2>
            <Link
              to="/truth-analyzer"
              className="sm:hidden text-xs font-semibold text-orange-400 hover:underline"
            >
              Analyze Claim →
            </Link>
          </div>

          {/* Unified Category Pills Bar */}
          <div className="flex gap-2 text-xs overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={cn(
                    "rounded-xl px-3 sm:px-3.5 py-1.5 font-medium transition-all duration-200 whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold"
                      : "bg-[#161c2b] text-slate-400 border border-white/5 hover:text-white hover:bg-white/5",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Filter Status pill */}
        {selectedCategory !== "All" && (
          <div className="flex items-center justify-between bg-orange-500/10 border border-orange-500/30 rounded-xl px-3.5 py-2 text-xs text-orange-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Filter className="h-3.5 w-3.5" /> Filtered by category: <strong>{selectedCategory}</strong> ({filteredItems.length} {filteredItems.length === 1 ? "story" : "stories"})
            </span>
            <button
              onClick={() => handleCategorySelect("All")}
              className="underline font-semibold hover:text-white cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Grid List of Feed Items */}
        <div className="grid gap-4 sm:grid-cols-2">
          {isLoading && (
            <div className="col-span-2 py-8 text-center text-xs text-slate-400 animate-pulse">
              Loading verified ground truth stories…
            </div>
          )}

          {error && (
            <div className="col-span-2 rounded-2xl border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-400">
              Couldn't load feed: {error.message || "unknown error"}
            </div>
          )}

          {filteredItems.length === 0 && !isLoading && !error && (
            <div className="col-span-2 py-8 text-center text-xs text-slate-400 space-y-2">
              <p>No news items match "{selectedCategory !== "All" ? selectedCategory : searchQuery}".</p>
              <button
                onClick={() => handleCategorySelect("All")}
                className="inline-block text-orange-400 font-semibold underline cursor-pointer"
              >
                Clear Category Filter
              </button>
            </div>
          )}

          {filteredItems.map((item, idx) => (
            <FeedCard
              key={item.id}
              item={item}
              userId={user?.id}
              variant="standard"
              onOpenDetail={() => setActiveStoryIndex(idx)}
            />
          ))}
        </div>
      </section>

      {/* Global Story Detail Modal with Next / Prev Story Navigation */}
      {activeArticle && activeStoryIndex !== null && (
        <ArticleDetailModal
          item={activeArticle}
          userId={user?.id}
          onClose={() => setActiveStoryIndex(null)}
          hasNext={activeStoryIndex < filteredItems.length - 1}
          hasPrev={activeStoryIndex > 0}
          onNextStory={() => {
            if (activeStoryIndex < filteredItems.length - 1) {
              setActiveStoryIndex(activeStoryIndex + 1);
            }
          }}
          onPrevStory={() => {
            if (activeStoryIndex > 0) {
              setActiveStoryIndex(activeStoryIndex - 1);
            }
          }}
        />
      )}

      {/* Account Profile Drawer Modal */}
      <ProfileDrawer isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
