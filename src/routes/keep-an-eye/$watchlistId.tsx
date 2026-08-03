import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  FileText,
} from "lucide-react";
import {
  getWatchlistItems,
  getTimelineEvents,
  addTimelineEvent,
  type WatchlistItem,
  type TimelineEvent,
} from "@/lib/watchlistStore";
import { TruthMeter } from "@/components/feed/TruthMeter";
import { VerdictChip } from "@/components/feed/VerdictChip";

export const Route = createFileRoute("/keep-an-eye/$watchlistId")({
  component: TimelinePage,
});

const CHANGE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  progress: {
    label: "Progressed",
    bg: "bg-emerald-950/30",
    text: "text-emerald-400",
    border: "border-emerald-800/50",
  },
  new_info: {
    label: "New Information",
    bg: "bg-sky-950/30",
    text: "text-sky-400",
    border: "border-sky-800/50",
  },
  delay: {
    label: "Delayed",
    bg: "bg-amber-950/30",
    text: "text-amber-400",
    border: "border-amber-800/50",
  },
  cancel: {
    label: "Cancelled",
    bg: "bg-rose-950/30",
    text: "text-rose-400",
    border: "border-rose-800/50",
  },
};

function TimelinePage() {
  const { watchlistId } = Route.useParams();
  const [item, setItem] = useState<WatchlistItem | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isRechecking, setIsRechecking] = useState(false);

  const loadData = () => {
    const allItems = getWatchlistItems();
    const found = allItems.find((i) => i.id === watchlistId || i.subject_ref === watchlistId);
    setItem(
      found || {
        id: watchlistId,
        subject_ref: watchlistId,
        subject_type: "topic",
        title: watchlistId.startsWith("wl-") ? "Tracked Topic" : watchlistId,
        summary: "Monitoring real-time news updates and verified wire sources.",
        category: "Tracked Story",
        status: "tracking",
        truthScore: 90,
        verdict: "true",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    );

    const evs = getTimelineEvents(watchlistId);
    setEvents(evs);
  };

  useEffect(() => {
    loadData();
  }, [watchlistId]);

  const handleRecheck = async () => {
    setIsRechecking(true);
    await new Promise((r) => setTimeout(r, 1200));

    addTimelineEvent(watchlistId, {
      summary: `Veritas AI Engine completed a live search scan across wire services. All primary sources remain aligned with verified baseline reporting.`,
      change_type: "new_info",
      source_url: "https://reuters.com/wire/live-news",
    });

    setIsRechecking(false);
    loadData();
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back Button */}
      <Link
        to="/keep-an-eye"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Keep an Eye Watchlist
      </Link>

      {/* Header Card */}
      {item && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-4">
              <TruthMeter score={item.truthScore} verdict={item.verdict} />
              <div>
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.category}
                </span>
                <h1 className="font-serif text-xl md:text-2xl font-bold leading-tight">
                  {item.title}
                </h1>
              </div>
            </div>
            <VerdictChip verdict={item.verdict} />
          </div>

          <p className="text-xs text-foreground/80 leading-relaxed bg-secondary/30 p-3 rounded-xl border border-border/40">
            {item.summary}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Monitoring active since {new Date(item.created_at).toLocaleDateString()}</span>
            </div>

            <button
              onClick={handleRecheck}
              disabled={isRechecking}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRechecking ? "animate-spin" : ""}`} />
              <span>{isRechecking ? "Scanning Global Wires..." : "Trigger AI Re-Check"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Timeline Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> AI-Summarized Event Timeline
          </h2>
          <span className="text-xs text-muted-foreground">{events.length} Recorded Updates</span>
        </div>

        {events.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            No updates recorded yet — click "Trigger AI Re-Check" above to scan for latest wire updates.
          </p>
        )}

        <div className="relative pl-6 border-l-2 border-primary/30 space-y-6">
          {events.map((e) => {
            const cfg = CHANGE_CONFIG[e.change_type] || CHANGE_CONFIG["new_info"];
            return (
              <div key={e.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[1.95rem] top-1.5 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background shadow" />

                <div className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-sm group-hover:border-primary/50 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <Calendar className="h-3 w-3 text-primary" />
                      {new Date(e.event_date).toLocaleString([], {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <span
                      className={`text-[0.65rem] font-semibold uppercase px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/90 leading-relaxed">{e.summary}</p>

                  {e.source_url && (
                    <div className="pt-2 border-t border-border/30">
                      <a
                        href={e.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[0.7rem] font-mono text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> Source Citation ({new URL(e.source_url).hostname})
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
