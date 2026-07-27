import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link2, FileText, Youtube, Mic } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { VerdictChip } from "@/components/feed/VerdictChip";
import { TruthMeter } from "@/components/feed/TruthMeter";
import type { Verdict, Confidence } from "@/lib/database.types";

export const Route = createFileRoute("/truth-analyzer")({
  component: TruthAnalyzerPage,
});

interface AnalyzeResult {
  claim: string;
  truthScore: number;
  confidence: Confidence;
  verdict: Verdict;
  explanation: string;
  supporting: { snippet: string; url: string }[];
  contradicting: { snippet: string; url: string }[];
}

function useAnalyze() {
  return useMutation({
    mutationFn: async (input: string): Promise<AnalyzeResult> => {
      // Calls the `analyze` Edge Function (supabase/functions/analyze) —
      // see that function's stub for the orchestrator pipeline it runs.
      const { data, error } = await supabase.functions.invoke("analyze", {
        body: { input },
      });
      if (error) throw error;
      return data as AnalyzeResult;
    },
  });
}

function TruthAnalyzerPage() {
  const [input, setInput] = useState("");
  const { mutate, data, isPending, error } = useAnalyze();

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl">Truth Analyzer</h1>
      <p className="mt-1 text-muted-foreground">
        Paste text, an article excerpt, or a URL — grounded in live web search,
        not just training data. Image, PDF, and voice support is coming soon.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) mutate(input.trim());
        }}
        className="mt-6 rounded-2xl border border-border bg-card p-4"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a claim, article text, or a URL…"
          rows={4}
          className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-3 text-muted-foreground">
            <span title="URLs are auto-detected in the box above">
              <Link2 className="h-4 w-4 text-primary" />
            </span>
            <span title="Image/PDF upload — coming soon">
              <FileText className="h-4 w-4 opacity-40 cursor-not-allowed" />
            </span>
            <span title="YouTube analysis — coming soon">
              <Youtube className="h-4 w-4 opacity-40 cursor-not-allowed" />
            </span>
            <span title="Voice submissions — coming soon">
              <Mic className="h-4 w-4 opacity-40 cursor-not-allowed" />
            </span>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isPending}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {isPending ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-sm text-destructive">
          Couldn't reach the analyzer. The `analyze` Edge Function may not be
          deployed yet — see supabase/functions/analyze.
        </p>
      )}

      {data && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <TruthMeter score={data.truthScore} verdict={data.verdict} />
            <VerdictChip verdict={data.verdict} />
          </div>
          <p className="mt-3 font-serif text-lg">{data.claim}</p>
          <p className="mt-2 text-sm text-muted-foreground">{data.explanation}</p>

          {data.supporting.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-verdict-true">
                Supporting evidence
              </p>
              <ul className="mt-1 space-y-1 text-sm">
                {data.supporting.map((e, i) => (
                  <li key={i}>
                    <a href={e.url} className="underline decoration-dotted">
                      {e.snippet}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.contradicting.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-verdict-false">
                Contradicting evidence
              </p>
              <ul className="mt-1 space-y-1 text-sm">
                {data.contradicting.map((e, i) => (
                  <li key={i}>
                    <a href={e.url} className="underline decoration-dotted">
                      {e.snippet}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
