import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

export const Route = createFileRoute("/keep-an-eye/")({
  component: KeepAnEyePage,
});

function useWatchlists(userId: string | undefined) {
  return useQuery({
    queryKey: ["watchlists", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("watchlists")
        .select("id, subject_ref, subject_type, status, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

function KeepAnEyePage() {
  const { user } = useSession();
  const { data: watchlists, isLoading } = useWatchlists(user?.id);

  if (!user) {
    return (
      <p className="text-muted-foreground">
        Sign in to start keeping an eye on stories.
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl">Keep an Eye 👁</h1>
      <p className="mt-1 text-muted-foreground">
        Everything you're tracking, with AI summaries whenever something changes.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {watchlists?.length === 0 && (
          <p className="text-muted-foreground">
            Nothing tracked yet — tap "Keep an Eye" on any Feed card to start.
          </p>
        )}
        {watchlists?.map((w) => (
          <Link
            key={w.id}
            to="/keep-an-eye/$watchlistId"
            params={{ watchlistId: w.id }}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-ring"
          >
            <div className="flex items-center gap-3">
              <Eye className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{w.subject_ref}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {w.subject_type} · {w.status}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
