import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShieldCheck, Eye, Settings, LayoutGrid, Flame, Compass, Menu, X, CheckCircle2 } from "lucide-react";
import { useUserProfile } from "@/lib/userProfileStore";
import { ProfileDrawer } from "@/components/user/ProfileDrawer";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Explore Feed", icon: Home },
  { to: "/truth-analyzer", label: "Truth Analyzer", icon: ShieldCheck },
  { to: "/keep-an-eye", label: "Keep an Eye", icon: Eye },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export const CATEGORIES = [
  "All",
  "Tech",
  "Automotive",
  "Politics",
  "Health",
  "Entertainment",
  "Science",
  "Sports",
  "Needs Attention",
];

export function Sidebar() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const searchParams = (routerState.location.search as { category?: string }) || {};
  const currentCategory = searchParams.category || "All";

  const { profile } = useUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <header className="lg:hidden flex items-center justify-between border-b border-white/10 bg-[#121622] px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 text-slate-300 hover:text-white rounded-xl bg-white/5 border border-white/10"
            aria-label="Open Mobile Menu"
          >
            <Menu className="h-5 w-5 text-orange-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-sm shadow-md">
              V
            </div>
            <span className="font-bold text-white tracking-tight">Veritas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setProfileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-500/50 overflow-hidden shadow-md"
          >
            <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
          </button>
          <Link
            to="/truth-analyzer"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-500 text-white shadow-md shadow-orange-500/20 flex items-center gap-1"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Analyze</span>
          </Link>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          />

          <div className="relative w-4/5 max-w-xs bg-[#121622] border-r border-white/10 p-5 flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-base shadow-md">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-base">Veritas</div>
                    <div className="text-[0.65rem] font-mono tracking-wider text-orange-400">TRUTH PLATFORM</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <div className="px-2 pb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                  Navigation
                </div>
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                  const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all",
                        active
                          ? "bg-orange-500/15 text-orange-400 font-semibold border border-orange-500/30"
                          : "text-slate-300 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active ? "text-orange-400" : "text-slate-400")} />
                      {label}
                    </Link>
                  );
                })}
              </div>

              {/* Categories */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="px-2 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Categories</span>
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                </div>
                <div className="flex flex-col gap-1">
                  {CATEGORIES.map((cat) => {
                    const isSelected = currentCategory.toLowerCase() === cat.toLowerCase();
                    return (
                      <Link
                        key={cat}
                        to="/"
                        search={{ category: cat }}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between",
                          isSelected
                            ? "bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20"
                            : "text-slate-400 hover:text-white hover:bg-white/5",
                        )}
                      >
                        <span>{cat}</span>
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile User Profile Section */}
            <div
              onClick={() => {
                setMobileOpen(false);
                setProfileOpen(true);
              }}
              className="pt-4 border-t border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <img src={profile.avatarUrl} alt={profile.name} className="h-8 w-8 rounded-full object-cover border border-orange-500/50" />
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
                    {profile.name}
                    <CheckCircle2 className="h-3 w-3 text-orange-400" />
                  </div>
                  <div className="text-[0.65rem] text-slate-400 truncate">{profile.handle}</div>
                </div>
              </div>
              <Compass className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar (Sticky h-screen) */}
      <aside className="w-64 shrink-0 border-r border-white/10 bg-[#121622] px-4 py-6 hidden lg:flex lg:flex-col justify-between h-screen sticky top-0 z-30 font-sans overflow-y-auto">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xl shadow-lg shadow-orange-500/20">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-serif text-xl font-bold tracking-tight text-white">Veritas</div>
              <div className="text-[0.65rem] font-mono tracking-wider text-orange-400/90 uppercase">
                Truth Platform
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm transition-all duration-200 group relative",
                    active
                      ? "bg-[#1f283d] text-orange-400 font-semibold shadow-sm border border-orange-500/20"
                      : "text-slate-400 hover:bg-[#182030] hover:text-white",
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-orange-500 to-amber-500" />
                  )}
                  <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", active ? "text-orange-400" : "text-slate-400")} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Categories List */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between px-3 text-[0.68rem] font-semibold uppercase tracking-wider text-slate-400">
              <span>Categories</span>
              <Flame className="h-3.5 w-3.5 text-orange-400" />
            </div>

            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => {
                const isSelected = currentCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <Link
                    key={cat}
                    to="/"
                    search={{ category: cat }}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all",
                      isSelected
                        ? "bg-orange-500/15 text-orange-400 font-bold border-l-2 border-orange-500"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5",
                    )}
                  >
                    <span>{cat}</span>
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Permanent Bottom User Profile Card (Fixed in view) */}
        <div
          onClick={() => setProfileOpen(true)}
          className="pt-4 border-t border-white/10 flex items-center justify-between px-2.5 py-2 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group mt-4"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-9 w-9 rounded-full object-cover border-2 border-orange-500/60 shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#121622]" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors truncate flex items-center gap-1">
                {profile.name}
                <CheckCircle2 className="h-3 w-3 text-orange-400 shrink-0" />
              </div>
              <div className="text-[0.65rem] text-slate-400 truncate">{profile.handle}</div>
            </div>
          </div>
          <Compass className="h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-colors shrink-0" />
        </div>
      </aside>

      {/* Account Profile Drawer Modal */}
      <ProfileDrawer isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
