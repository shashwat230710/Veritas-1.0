import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/keep-an-eye/$watchlistId")({
  component: TimelinePage,
});

function useTimeline(watchlistId: string) {
  return useQuery({
    queryKey: ["timeline", watchlistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("watchlist_id", watchlistId)
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

const CHANGE_LABEL: Record<string, string> = {
  progress: "Progressed",
  delay: "Delayed",
  cancel: "Cancelled",
  new_info: "New information",
};

function TimelinePage() {
  const { watchlistId } = Route.useParams();
  const { data: events, isLoading } = useTimeline(watchlistId);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl">Timeline</h1>

      {isLoading && <p className="mt-4 text-muted-foreground">Loading…</p>}
      {events?.length === 0 && (
        <p className="mt-4 text-muted-foreground">
          No updates yet — you'll see AI-summarized changes here as they happen.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4 border-l border-border pl-5">
        {events?.map((e) => (
          <div key={e.id} className="relative">
            <span className="absolute -left-[1.65rem] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
            <p className="text-xs text-muted-foreground">
              {new Date(e.event_date).toLocaleDateString()} ·{" "}
              {e.change_type && CHANGE_LABEL[e.change_type]}
            </p>
            <p className="mt-1 text-sm">{e.summary}</p>
            {e.source_url && (
              <a
                href={e.source_url}
                className="mt-1 inline-block text-xs underline decoration-dotted text-muted-foreground"
              >
                Source
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
