import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShieldCheck, Eye, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/truth-analyzer", label: "Truth Analyzer", icon: ShieldCheck },
  { to: "/keep-an-eye", label: "Keep an Eye", icon: Eye },
  { to: "/assistant", label: "Assistant", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="w-64 shrink-0 border-r border-border px-4 py-6 hidden md:flex md:flex-col gap-8">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif text-lg">
          V
        </div>
        <div className="leading-tight">
          <div className="font-serif text-lg">Veritas</div>
          <div className="text-[0.65rem] tracking-widest text-muted-foreground">
            TRUTH PLATFORM
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
