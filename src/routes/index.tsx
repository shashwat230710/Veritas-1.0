import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { FeedCard } from "@/components/feed/FeedCard";
import { useFeed, type FeedTab } from "@/lib/queries/useFeed";
import { useSession } from "@/lib/useSession";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: FeedPage,
});

const TABS: { id: FeedTab; label: string }[] = [
  { id: "for-you", label: "For you" },
  { id: "trending", label: "Trending" },
  { id: "breaking", label: "Breaking" },
  { id: "needs-attention", label: "Needs attention" },
  { id: "live", label: "Live" },
];

function FeedPage() {
  const [tab, setTab] = useState<FeedTab>("for-you");
  const { user } = useSession();
  const { data: items, isLoading, error } = useFeed(tab, user?.id);

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Today
          </p>
          <h1 className="mt-1 text-4xl md:text-5xl">
            What's <em className="italic">actually</em> true?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Signal over noise, verified over viral.
          </p>
        </div>
        <Link
          to="/truth-analyzer"
          className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <Sparkles className="h-4 w-4" />
          Analyze a claim
        </Link>
      </div>

      <div className="mt-8 flex gap-6 border-b border-border text-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "-mb-px border-b-2 pb-3 transition-colors",
              tab === t.id
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {isLoading && (
          <p className="text-muted-foreground">Loading the feed…</p>
        )}
        {error && (
          <p className="text-destructive">
            Couldn't load the feed: {error.message || "unknown error"}
            . Check your .env, that migrations have been pushed, and the
            browser console/network tab for more detail.
          </p>
        )}
        {items?.length === 0 && !isLoading && !error && (
          <p className="text-muted-foreground">
            No stories yet — deploy and invoke the <code>ingest-news</code>{" "}
            function to populate the Feed (see README).
          </p>
        )}
        {items?.map((item) => (
          <FeedCard key={item.id} item={item} userId={user?.id} />
        ))}
      </div>
    </div>
  );
}
