import type { Verdict } from "@/lib/database.types";
import type { CSSProperties } from "react";
import { useMemeMode } from "@/lib/useMemeMode";

const VERDICT_LABEL: Record<Verdict, string> = {
  true: "True",
  mixed: "Mixed",
  false: "False",
  unverified: "Unverified",
};

const MEME_VERDICT_LABEL: Record<Verdict, string> = {
  true: "💯 100% NO CAP",
  mixed: "🍿 SPICY & SUS",
  false: "💀 BIG CAP DETECTED",
  unverified: "❓ WAITING ON CHAD AI",
};

const VERDICT_VAR: Record<Verdict, string> = {
  true: "var(--verdict-true)",
  mixed: "var(--verdict-mixed)",
  false: "var(--verdict-false)",
  unverified: "var(--verdict-unverified)",
};

export function VerdictChip({ verdict }: { verdict: Verdict }) {
  const { memeMode } = useMemeMode();
  const style = { "--verdict": VERDICT_VAR[verdict] } as CSSProperties;

  if (memeMode) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border shadow-md animate-pulse ${
          verdict === "true"
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-emerald-500/30"
            : verdict === "false"
            ? "bg-rose-500/20 text-rose-300 border-rose-400/60 shadow-rose-500/30"
            : "bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-amber-500/30"
        }`}
      >
        {MEME_VERDICT_LABEL[verdict]}
      </span>
    );
  }

  return (
    <span className="verdict-chip" style={style}>
      {VERDICT_LABEL[verdict]}
    </span>
  );
}

export function verdictColorVar(verdict: Verdict) {
  return VERDICT_VAR[verdict];
}
