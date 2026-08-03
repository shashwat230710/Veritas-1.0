import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Shield, User, Sliders } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const INTEREST_OPTIONS = [
  "Technology & AI",
  "Politics & Governance",
  "Business & Finance",
  "Science & Space",
  "Global Health",
  "Environment & Energy",
  "Education",
  "Media & Social Claims",
];

function SettingsPage() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const [localInterests, setLocalInterests] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["Technology & AI", "Global Health"];
    try {
      const saved = localStorage.getItem("veritas_user_interests");
      return saved ? JSON.parse(saved) : ["Technology & AI", "Global Health"];
    } catch {
      return ["Technology & AI", "Global Health"];
    }
  });

  const [localMemeMode, setLocalMemeMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("veritas_meme_mode") === "true";
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      return data;
    },
  });

  useEffect(() => {
    if (profile?.interests) {
      setLocalInterests(profile.interests);
    }
    if (profile?.meme_mode !== undefined) {
      setLocalMemeMode(profile.meme_mode);
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async (patch: { interests?: string[]; meme_mode?: boolean }) => {
      if (patch.interests !== undefined) {
        setLocalInterests(patch.interests);
        localStorage.setItem("veritas_user_interests", JSON.stringify(patch.interests));
      }
      if (patch.meme_mode !== undefined) {
        setLocalMemeMode(patch.meme_mode);
        localStorage.setItem("veritas_meme_mode", String(patch.meme_mode));
      }

      if (user?.id) {
        await supabase.from("profiles").update(patch).eq("id", user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile-meme-mode", user?.id] });
    },
  });

  function toggleInterest(topic: string) {
    const next = localInterests.includes(topic)
      ? localInterests.filter((t) => t !== topic)
      : [...localInterests, topic];
    updateProfile.mutate({ interests: next });
  }

  function toggleMemeMode() {
    updateProfile.mutate({ meme_mode: !localMemeMode });
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary uppercase">
          <Sliders className="h-4 w-4" /> Preferences
        </div>
        <h1 className="mt-1 font-serif text-3xl md:text-4xl font-bold">Platform Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Customize feed topics, AI explanation tone, and continuous monitoring options.
        </p>
      </div>

      {/* Account Info Pill */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium">
              {user ? user.email : "Local & Demo User Mode"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {user ? "Signed in with Supabase Auth" : "Preferences saved locally in browser state"}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-400">
          Active Session
        </span>
      </div>

      {/* Interests Selection */}
      <section className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="font-serif text-xl font-semibold">Feed Topic Interests</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Personalizes your "For You" news feed. (Does not filter high-urgency "Needs Attention" stories).
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {INTEREST_OPTIONS.map((topic) => {
            const selected = localInterests.includes(topic);
            return (
              <button
                key={topic}
                onClick={() => toggleInterest(topic)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all border ${
                  selected
                    ? "bg-primary/20 text-primary border-primary/60 shadow-sm"
                    : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {selected ? `✓ ${topic}` : topic}
              </button>
            );
          })}
        </div>
      </section>

      {/* Meme Mode Switch */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="max-w-md space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h2 className="font-serif text-lg font-semibold">Assistant Meme Mode</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Optional witty, internet-native tone in the Veritas Chatbot. Accuracy & ground truth calculations are never modified.
          </p>
        </div>

        <button
          onClick={toggleMemeMode}
          className={`rounded-full px-5 py-2 text-xs font-bold transition-all shadow-md ${
            localMemeMode
              ? "bg-amber-500 text-black hover:bg-amber-400"
              : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          {localMemeMode ? "✨ MEME MODE ON" : "Off"}
        </button>
      </section>
    </div>
  );
}
