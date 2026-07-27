import type { Verdict } from "@/lib/database.types";
import type { CSSProperties } from "react";

const VERDICT_LABEL: Record<Verdict, string> = {
  true: "True",
  mixed: "Mixed",
  false: "False",
  unverified: "Unverified",
};

const VERDICT_VAR: Record<Verdict, string> = {
  true: "var(--verdict-true)",
  mixed: "var(--verdict-mixed)",
  false: "var(--verdict-false)",
  unverified: "var(--verdict-unverified)",
};

export function VerdictChip({ verdict }: { verdict: Verdict }) {
  const style = { "--verdict": VERDICT_VAR[verdict] } as CSSProperties;
  return (
    <span className="verdict-chip" style={style}>
      {VERDICT_LABEL[verdict]}
    </span>
  );
}

// Exposed so TruthMeter can color its progress bar identically to the chip —
// the screenshot deliberately encodes verdict via color in two places at once.
export function verdictColorVar(verdict: Verdict) {
  return VERDICT_VAR[verdict];
}
