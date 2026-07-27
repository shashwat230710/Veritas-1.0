import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const INTEREST_OPTIONS = [
  "Technology",
  "Politics",
  "Business",
  "Science",
  "Health",
  "Environment",
  "Education",
  "Finance",
];

function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patch: { interests?: string[]; meme_mode?: boolean }) => {
      const { error } = await supabase.from("profiles").update(patch).eq("id", userId!);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", userId] }),
  });
}

function SettingsPage() {
  const { user } = useSession();
  const { data: profile } = useProfile(user?.id);
  const { mutate: updateProfile } = useUpdateProfile(user?.id);

  if (!user || !profile) {
    return <p className="text-muted-foreground">Sign in to manage settings.</p>;
  }

  const interests = profile.interests ?? [];

  function toggleInterest(topic: string) {
    const next = interests.includes(topic)
      ? interests.filter((t) => t !== topic)
      : [...interests, topic];
    updateProfile({ interests: next });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl">Settings</h1>

      <section className="mt-8">
        <h2 className="text-lg font-serif">Interests</h2>
        <p className="text-sm text-muted-foreground">
          Tunes your For You tab — doesn't affect Needs Attention, which is
          importance-ranked regardless of what you pick here.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleInterest(topic)}
              className={
                interests.includes(topic)
                  ? "rounded-full bg-primary/15 border border-primary/40 text-primary px-3 py-1.5 text-sm"
                  : "rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
              }
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
        <div>
          <h2 className="text-sm font-medium">Meme Mode</h2>
          <p className="text-xs text-muted-foreground">
            Optional lighter tone from the Assistant. Never changes a score or
            softens a hedge — just the delivery.
          </p>
        </div>
        <button
          onClick={() => updateProfile({ meme_mode: !profile.meme_mode })}
          className={
            profile.meme_mode
              ? "rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
              : "rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground"
          }
        >
          {profile.meme_mode ? "On" : "Off"}
        </button>
      </section>
    </div>
  );
}
