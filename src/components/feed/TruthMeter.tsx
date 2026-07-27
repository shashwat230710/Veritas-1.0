import type { Verdict } from "@/lib/database.types";
import { verdictColorVar } from "./VerdictChip";

export function TruthMeter({
  score,
  verdict,
}: {
  score: number;
  verdict: Verdict;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-mono text-muted-foreground">
        Truth {Math.round(score)}
      </span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(0, Math.min(100, score))}%`,
            backgroundColor: verdictColorVar(verdict),
          }}
        />
      </div>
    </div>
  );
}
