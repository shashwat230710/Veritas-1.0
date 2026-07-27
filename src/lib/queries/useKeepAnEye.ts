import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Adds an article (or promise/event/topic) to the current user's Keep an Eye
 * watchlist. `subjectRef` should be a stable identifier — an article id,
 * promise id, or a normalized topic string.
 */
export function useKeepAnEye() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      subjectRef,
      subjectType = "topic",
    }: {
      userId: string;
      subjectRef: string;
      subjectType?: "person" | "promise" | "event" | "topic";
    }) => {
      const { data, error } = await supabase
        .from("watchlists")
        .insert({ user_id: userId, subject_ref: subjectRef, subject_type: subjectType })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlists"] });
    },
  });
}
