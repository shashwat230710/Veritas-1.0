import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, ShieldCheck, User, Sliders, CheckCircle2, Key, Bell, Shield, Edit3, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import { useUserProfile } from "@/lib/userProfileStore";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const INTEREST_OPTIONS = [
  "Tech",
  "Automotive",
  "Politics",
  "Health",
  "Entertainment",
  "Science",
  "Sports",
  "Needs Attention",
];

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
];

function SettingsPage() {
  const { user } = useSession();
  const { profile, updateProfile } = useUserProfile();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "api" | "notifications">("profile");

  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.handle);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl);

  const [localInterests, setLocalInterests] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["Tech", "Health", "Politics"];
    try {
      const saved = localStorage.getItem("veritas_user_interests");
      return saved ? JSON.parse(saved) : ["Tech", "Health", "Politics"];
    } catch {
      return ["Tech", "Health", "Politics"];
    }
  });

  const [localMemeMode, setLocalMemeMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("veritas_meme_mode") === "true";
  });

  const { data: dbProfile } = useQuery({
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
    if (dbProfile?.interests) {
      setLocalInterests(dbProfile.interests);
    }
    if (dbProfile?.meme_mode !== undefined) {
      setLocalMemeMode(dbProfile.meme_mode);
    }
  }, [dbProfile]);

  const updateProfileMutation = useMutation({
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
      toast.success("Preferences updated.");
    },
  });

  function toggleInterest(topic: string) {
    const next = localInterests.includes(topic)
      ? localInterests.filter((t) => t !== topic)
      : [...localInterests, topic];
    updateProfileMutation.mutate({ interests: next });
  }

  function toggleMemeMode() {
    updateProfileMutation.mutate({ meme_mode: !localMemeMode });
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      handle: editHandle,
      avatarUrl: editAvatar,
    });
    toast.success("Account Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl space-y-8 font-sans pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-orange-400 uppercase">
          <Sliders className="h-4 w-4" /> Account & Preferences
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Account Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Manage your analyst identity, ground truth feed topics, and platform preferences.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: "profile", label: "Account Profile", icon: User },
          { id: "preferences", label: "Feed Preferences", icon: Sliders },
          { id: "api", label: "API & Access Key", icon: Key },
          { id: "notifications", label: "Notifications & Security", icon: Bell },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === id
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-[#161c2b] text-slate-400 border border-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: Account Profile */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* User Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161c2b] p-6 space-y-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-20 w-20 rounded-2xl object-cover border-2 border-orange-500/60 shadow-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white text-xl">{profile.name}</h2>
                  <CheckCircle2 className="h-5 w-5 text-orange-400 fill-orange-500/20" />
                </div>
                <p className="text-xs text-orange-400 font-mono">{profile.handle}</p>
                <p className="text-xs text-slate-400 pt-1">{profile.email}</p>
                <div className="pt-2">
                  <span className="rounded-md bg-orange-500/15 border border-orange-500/30 px-2.5 py-1 text-[0.68rem] font-bold text-orange-400 uppercase tracking-wider">
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSaveProfile} className="rounded-3xl border border-white/10 bg-[#161c2b] p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Edit3 className="h-4 w-4 text-orange-400" /> Edit Profile Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name / Display Title</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#121622] px-4 py-2.5 text-xs text-white outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Handle</label>
                <input
                  type="text"
                  value={editHandle}
                  onChange={(e) => setEditHandle(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#121622] px-4 py-2.5 text-xs text-white outline-none focus:border-orange-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Choose Avatar Photo</label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEditAvatar(url)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      editAvatar === url ? "border-orange-500 scale-105 shadow-md shadow-orange-500/20" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt="Avatar choice" className="h-14 w-14 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Preferences */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-[#161c2b] p-6 space-y-4 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-white">Feed Topic Preferences</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your primary areas of interest to customize story priority in your feed.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {INTEREST_OPTIONS.map((topic) => {
                const selected = localInterests.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleInterest(topic)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all border cursor-pointer ${
                      selected
                        ? "bg-orange-500/20 text-orange-400 border-orange-500/60 shadow-sm"
                        : "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {selected ? `✓ ${topic}` : topic}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#161c2b] p-6 shadow-sm">
            <div className="max-w-md space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <h2 className="text-base font-bold text-white">Assistant Meme Mode</h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enable witty, internet-native conversational responses from Veritas AI. Ground truth calculations remain 100% rigorous.
              </p>
            </div>

            <button
              onClick={toggleMemeMode}
              className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer ${
                localMemeMode
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-[#121622] text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              {localMemeMode ? "✨ MEME MODE ON" : "Off"}
            </button>
          </section>
        </div>
      )}

      {/* TAB 3: API & Access Key */}
      {activeTab === "api" && (
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-[#161c2b] p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-orange-400" />
              <h2 className="text-base font-bold text-white">Veritas Ground Truth API Key</h2>
            </div>
            <p className="text-xs text-slate-400">
              Use your API token to programmatically fetch ground truth metrics and claim verifications into custom applications.
            </p>

            <div className="flex items-center gap-3 bg-[#121622] rounded-2xl p-3 border border-white/10">
              <span className="font-mono text-xs text-orange-400 flex-1 truncate">
                vtr_live_8849201948192a4bf7e990001
              </span>
              <button
                onClick={() => toast.success("API token copied to clipboard!")}
                className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors cursor-pointer"
              >
                Copy Key
              </button>
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: Notifications & Security */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-[#161c2b] p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-400" />
              <h2 className="text-base font-bold text-white">Security & Verification Tier</h2>
            </div>
            <p className="text-xs text-slate-400">
              Your account is verified at <strong>Tier 1 Analyst Level</strong> with full real-time claim investigation privileges.
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Session Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Active & Secure
              </span>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
