import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useUserProfile, CARTOON_AVATARS } from "@/lib/userProfileStore";
import { useMemeMode } from "@/lib/useMemeMode";
import {
  X,
  ShieldCheck,
  User,
  Settings,
  Eye,
  CheckCircle2,
  Key,
  LogOut,
  Edit3,
  Camera,
  Award,
  ExternalLink,
  Sparkles,
  Flame,
} from "lucide-react";
import { toast } from "sonner";

export function ProfileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { profile, updateProfile } = useUserProfile();
  const { memeMode, setMemeMode } = useMemeMode();
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.handle);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      handle: editHandle,
      avatarUrl: editAvatar,
    });
    setIsEditing(false);
    toast.success("Cartoon Profile Avatar updated!");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over Drawer Panel */}
      <div className={`relative w-full max-w-md bg-[#121622] border-l p-6 flex flex-col justify-between z-10 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 ${
        memeMode ? "border-amber-500/40 shadow-amber-500/10" : "border-white/10"
      }`}>
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                memeMode ? "bg-amber-500/20 border-amber-500/40 text-amber-400" : "bg-orange-500/15 border-orange-500/30 text-orange-400"
              }`}>
                <User className="h-4 w-4" />
              </div>
              <span className="font-bold text-white text-base">
                {memeMode ? "Chad Account Profile 🗿" : "Account Profile"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Card Header */}
          <div className={`relative overflow-hidden rounded-3xl border p-6 space-y-4 shadow-xl ${
            memeMode ? "bg-gradient-to-b from-[#1b2133] to-[#141926] border-amber-500/40" : "bg-[#161c2b] border-white/10"
          }`}>
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <ShieldCheck className="h-24 w-24 text-orange-400" />
            </div>

            <div className="flex items-start gap-4">
              <div className="relative group">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className={`h-16 w-16 rounded-2xl object-cover border-2 shadow-md bg-slate-900 ${
                    memeMode ? "border-amber-400 shadow-amber-500/30" : "border-orange-500/60"
                  }`}
                />
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                >
                  <Camera className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-white text-lg tracking-tight">{profile.name}</h2>
                  <CheckCircle2 className="h-4 w-4 text-orange-400 fill-orange-500/20" />
                </div>
                <p className="text-xs text-orange-400 font-mono">{profile.handle}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className={`rounded-md border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                    memeMode ? "bg-amber-500/20 border-amber-500/40 text-amber-300" : "bg-orange-500/15 border-orange-500/30 text-orange-400"
                  }`}>
                    {memeMode ? "🔥 CHAD ANALYST — NO CAP TIER" : profile.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Analyst Impact Statistics Bar */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
              <div className="bg-[#121622]/60 rounded-xl p-2.5 border border-white/5">
                <div className="text-sm font-bold text-white">142</div>
                <div className="text-[0.65rem] text-slate-400">{memeMode ? "Caps Busted" : "Claims Verified"}</div>
              </div>
              <div className="bg-[#121622]/60 rounded-xl p-2.5 border border-white/5">
                <div className="text-sm font-bold text-orange-400">98.4%</div>
                <div className="text-[0.65rem] text-slate-400">{memeMode ? "Chad Precision" : "Precision"}</div>
              </div>
              <div className="bg-[#121622]/60 rounded-xl p-2.5 border border-white/5">
                <div className="text-sm font-bold text-white">8</div>
                <div className="text-[0.65rem] text-slate-400">Watched</div>
              </div>
            </div>
          </div>

          {/* Meme Mode Quick Switch Card */}
          <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
              <div>
                <div className="text-xs font-bold text-amber-300">Assistant Meme Mode</div>
                <div className="text-[0.65rem] text-slate-300">Witty tone, fun badges & neon vibes</div>
              </div>
            </div>
            <button
              onClick={() => {
                setMemeMode(!memeMode);
                toast.success(memeMode ? "Meme mode off." : "🔥 MEME MODE ENABLED!");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                memeMode ? "bg-amber-400 text-black shadow-md shadow-amber-400/30" : "bg-[#121622] text-slate-400 border border-white/10"
              }`}
            >
              {memeMode ? "ON ✨" : "Enable"}
            </button>
          </div>

          {/* Edit Profile Form Toggle */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 rounded-3xl border border-orange-500/30 bg-[#161c2b] p-5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" /> Edit Profile & Animated Avatar
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#121622] px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Handle</label>
                  <input
                    type="text"
                    value={editHandle}
                    onChange={(e) => setEditHandle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#121622] px-3 py-2 text-xs text-white outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Animated / Cartoonish 3D Character Avatar
                  </label>
                  <div className="grid grid-cols-4 gap-2 pb-2">
                    {CARTOON_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatar(url)}
                        className={`relative rounded-xl overflow-hidden border-2 bg-slate-900 transition-all p-1 cursor-pointer ${
                          editAvatar === url ? "border-orange-500 scale-105 shadow-md shadow-orange-500/30" : "border-white/5 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt={`Cartoon option ${idx + 1}`} className="h-12 w-12 object-cover mx-auto rounded-lg" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
              >
                Save Cartoon Avatar
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full rounded-2xl border border-white/10 bg-[#161c2b] py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-orange-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-orange-400" />
              Change Cartoon Avatar & Name
            </button>
          )}

          {/* Account Quick Features Navigation List */}
          <div className="space-y-2">
            <div className="px-1 text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
              Account Navigation & Tools
            </div>

            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#161c2b] p-3.5 text-xs text-slate-300 hover:text-white hover:border-orange-500/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                    Platform Settings
                  </div>
                  <div className="text-[0.68rem] text-slate-400">Interests, meme mode, preferences</div>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            </Link>

            <Link
              to="/keep-an-eye"
              onClick={onClose}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#161c2b] p-3.5 text-xs text-slate-300 hover:text-white hover:border-orange-500/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                    Watchlist Dashboard
                  </div>
                  <div className="text-[0.68rem] text-slate-400">Continuous background story monitoring</div>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            </Link>

            <div
              onClick={() => toast.info("API Key generated: vtr_live_994a28f10b")}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#161c2b] p-3.5 text-xs text-slate-300 hover:text-white hover:border-orange-500/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    Veritas API Key
                  </div>
                  <div className="text-[0.68rem] text-slate-400">Ground truth API telemetry token</div>
                </div>
              </div>
              <span className="font-mono text-[0.65rem] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Footer / Sign Out Button */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-orange-400" /> Veritas Pro Membership
            </span>
            <span className="font-semibold text-emerald-400">Active</span>
          </div>

          <button
            onClick={() => {
              toast.success("Signed out successfully.");
              onClose();
            }}
            className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out Session
          </button>
        </div>
      </div>
    </div>
  );
}
