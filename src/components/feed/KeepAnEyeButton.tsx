import { useState, useEffect } from "react";
import { Eye, CheckCircle2 } from "lucide-react";
import { useKeepAnEye } from "@/lib/queries/useKeepAnEye";
import { isWatched as checkIsWatched } from "@/lib/watchlistStore";
import { cn } from "@/lib/utils";

export function KeepAnEyeButton({
  userId,
  subjectRef,
  title,
  category,
  summary,
  truthScore,
  verdict,
  isWatched = false,
  className,
}: {
  userId?: string | undefined;
  subjectRef: string;
  title?: string | null;
  category?: string | null;
  summary?: string | null;
  truthScore?: number | null;
  verdict?: "true" | "mixed" | "false" | "unverified" | null;
  isWatched?: boolean;
  className?: string;
}) {
  const { mutate, isPending } = useKeepAnEye();
  const [activeWatched, setActiveWatched] = useState(isWatched);

  useEffect(() => {
    setActiveWatched(checkIsWatched(subjectRef) || isWatched);

    const handleWatchChange = () => {
      setActiveWatched(checkIsWatched(subjectRef));
    };
    window.addEventListener("veritas_watchlist_changed", handleWatchChange);
    return () => {
      window.removeEventListener("veritas_watchlist_changed", handleWatchChange);
    };
  }, [subjectRef, isWatched]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    mutate(
      {
        userId,
        subjectRef,
        title: title ?? undefined,
        category: category ?? undefined,
        summary: summary ?? undefined,
        truthScore: truthScore ?? undefined,
        verdict: verdict ?? undefined,
      },
      {
        onSuccess: (res) => {
          setActiveWatched(res.isNowWatched);
        },
      }
    );
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-sm cursor-pointer",
        activeWatched
          ? "bg-orange-500/20 text-orange-400 border-orange-500/60 hover:bg-orange-500/30"
          : "border-white/10 text-slate-400 hover:text-white hover:border-orange-500/50 hover:bg-white/5",
        className
      )}
      title={activeWatched ? "Currently watching — click to remove" : "Add to Keep an Eye watchlist"}
    >
      {activeWatched ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-orange-400" />
          <span>Watching</span>
        </>
      ) : (
        <>
          <Eye className="h-3.5 w-3.5" />
          <span>Keep an Eye</span>
        </>
      )}
    </button>
  );
}
