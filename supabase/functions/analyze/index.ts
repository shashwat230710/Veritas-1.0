// Deno Edge Function: POST /functions/v1/analyze
// Body: { input: string }  — raw text, an article excerpt, OR a URL.
//
// Uses Gemini (generous free tier) with Google Search grounding instead of
// Claude — same external contract as before (same request/response shape),
// so nothing in the frontend needed to change. Model name is current as of
// mid-2026 per Google's own docs; swap GEMINI_MODEL if they've since shipped
// something newer.

import { createClient } from "jsr:@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const GEMINI_MODEL = "gemini-3.5-flash";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface EvidenceItem {
  snippet: string;
  url: string;
}

interface FactCheckResult {
  claim: string;
  truthScore: number;
  confidence: "low" | "medium" | "high";
  verdict: "true" | "mixed" | "false" | "unverified";
  explanation: string;
  supporting: EvidenceItem[];
  contradicting: EvidenceItem[];
}

function isUrl(input: string): boolean {
  try {
    const u = new URL(input.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function resolveContent(input: string): Promise<{ content: string; sourceUrl: string | null }> {
  const trimmed = input.trim();
  if (!isUrl(trimmed)) return { content: trimmed, sourceUrl: null };

  const res = await fetch(trimmed, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; VeritasTruthAnalyzer/1.0)" },
  });
  if (!res.ok) {
    throw new Error(`Couldn't fetch that URL (HTTP ${res.status}). Some sites block automated requests.`);
  }
  const html = await res.text();
  const text = htmlToText(html).slice(0, 8000);
  if (text.length < 100) {
    throw new Error("Fetched the URL but couldn't extract readable text — the page may require JavaScript.");
  }
  return { content: text, sourceUrl: trimmed };
}

interface GeminiPart {
  text?: string;
}

async function callGemini(content: string, sourceUrl: string | null): Promise<FactCheckResult> {
  const systemPrompt = `You are the Fact Checker agent inside Veritas, a truth-verification platform.
You have Google Search grounding enabled — use it to check the claim against real, current sources
before answering. Don't rely solely on prior knowledge, especially for anything recent or fast-moving.
${sourceUrl ? `\nThe text below was fetched from: ${sourceUrl}` : ""}

Do your research, then reply with ONLY a single JSON object — no prose before or after it, no
markdown fences — matching this shape:
{
  "claim": string,
  "truthScore": number,
  "confidence": "low"|"medium"|"high",
  "verdict": "true"|"mixed"|"false"|"unverified",
  "explanation": string,
  "supporting": [{"snippet": string, "url": string}],
  "contradicting": [{"snippet": string, "url": string}]
}
Never state false certainty. If evidence is thin or search turns up nothing conclusive, say so and
lower confidence rather than the score. Prefer official/primary sources over aggregators.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: content }] }],
        tools: [{ google_search: {} }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const text: string =
    data.candidates?.[0]?.content?.parts
      ?.map((p: GeminiPart) => p.text ?? "")
      .join("") ?? "{}";

  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    // Model didn't comply with the strict-JSON instruction. Degrade
    // gracefully with what it actually said rather than 500ing.
    return {
      claim: content.slice(0, 200),
      truthScore: 50,
      confidence: "low",
      verdict: "unverified",
      explanation: text || "The analyzer couldn't produce a structured result for this input.",
      supporting: [],
      contradicting: [],
    };
  }
}

async function upsertSourceForUrl(url: string): Promise<string | null> {
  try {
    const domain = new URL(url).hostname.replace(/^www\./, "");
    const { data, error } = await supabase
      .from("sources")
      .upsert({ name: domain, domain }, { onConflict: "domain" })
      .select()
      .single();
    if (error) throw error;
    return data.id;
  } catch {
    return null; // Evidence is still saved, just without a linked source row.
  }
}

Deno.serve(async (req) => {
  try {
    const { input } = await req.json();
    if (!input || typeof input !== "string") {
      return new Response(JSON.stringify({ error: "Missing `input`" }), { status: 400 });
    }

    const { content, sourceUrl } = await resolveContent(input);
    const result = await callGemini(content, sourceUrl);

    const { data: claim, error: claimErr } = await supabase
      .from("claims")
      .insert({ text: result.claim })
      .select()
      .single();
    if (claimErr) throw claimErr;

    await supabase.from("fact_checks").insert({
      claim_id: claim.id,
      truth_score: result.truthScore,
      confidence: result.confidence,
      verdict: result.verdict,
      explanation: result.explanation,
    });

    const evidenceRows = [
      ...result.supporting.map((e) => ({ ...e, stance: "support" as const })),
      ...result.contradicting.map((e) => ({ ...e, stance: "contradict" as const })),
    ];
    for (const e of evidenceRows) {
      if (!e.url) continue;
      const source_id = await upsertSourceForUrl(e.url);
      await supabase.from("evidence").insert({
        claim_id: claim.id,
        source_id,
        snippet: e.snippet,
        url: e.url,
        stance: e.stance,
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});