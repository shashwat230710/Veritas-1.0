import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toggleWatchlist } from "@/lib/watchlistStore";

/**
 * Adds or toggles an article (or promise/event/topic) in Keep an Eye watchlist.
 * Works seamlessly for logged-in users AND guest/demo users with instant persistence.
 */
export function useKeepAnEye() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      subjectRef,
      subjectType = "topic",
      title,
      category,
      summary,
      truthScore,
      verdict,
    }: {
      userId?: string;
      subjectRef: string;
      subjectType?: "person" | "promise" | "event" | "topic";
      title?: string;
      category?: string;
      summary?: string;
      truthScore?: number;
      verdict?: "true" | "mixed" | "false" | "unverified";
    }) => {
      const isNowWatched = toggleWatchlist({
        subjectRef,
        title,
        category,
        summary,
        truthScore,
        verdict,
      });

      if (userId) {
        try {
          if (isNowWatched) {
            await supabase
              .from("watchlists")
              .insert({ user_id: userId, subject_ref: subjectRef, subject_type: subjectType });
          } else {
            await supabase
              .from("watchlists")
              .delete()
              .eq("user_id", userId)
              .eq("subject_ref", subjectRef);
          }
        } catch (err) {
          console.warn("Supabase watchlist sync note:", err);
        }
      }

      return { isNowWatched };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlists"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
