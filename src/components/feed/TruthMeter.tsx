import type { Verdict } from "@/lib/database.types";
import { verdictColorVar } from "./VerdictChip";
import { useMemeMode } from "@/lib/useMemeMode";

export function TruthMeter({
  score,
  verdict,
}: {
  score: number;
  verdict: Verdict;
}) {
  const { memeMode } = useMemeMode();

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-mono font-bold ${memeMode ? "text-amber-400" : "text-slate-400"}`}>
        {memeMode ? `CHAD TRUTH ${Math.round(score)} 🔥` : `Truth ${Math.round(score)}`}
      </span>
      <div className={`h-2 w-24 overflow-hidden rounded-full ${memeMode ? "bg-black/60 border border-white/10" : "bg-slate-800"}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${memeMode ? "shadow-sm shadow-orange-500" : ""}`}
          style={{
            width: `${Math.max(0, Math.min(100, score))}%`,
            backgroundColor: verdictColorVar(verdict),
          }}
        />
      </div>
    </div>
  );
}
