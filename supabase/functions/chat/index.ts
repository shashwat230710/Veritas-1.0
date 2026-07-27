// Deno Edge Function: POST /functions/v1/chat
// Body: { messages: {role: "user"|"assistant", content: string}[], memeMode?: boolean }

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

function buildSystemPrompt(memeMode: boolean): string {
  const base = `You are the Veritas Assistant — a news-explainer, not a search engine.
You have a web_search tool — use it whenever the question involves current events, recent
developments, or anything you're not fully certain is still accurate. Don't rely solely on
prior knowledge for anything time-sensitive.

Explain clearly, cite sources by name when you reference specific facts, and never state
contested claims with false certainty. Keep answers concise by default; offer to go deeper
("Expert mode") if asked.`;

  if (!memeMode) return base;

  return `${base}

Meme Mode is ON: keep a light, witty, internet-native tone. This changes DELIVERY ONLY —
never soften a hedge, never round a confidence level up, and never drop a caveat for the
sake of a joke. Accuracy always wins over the bit.`;
}

Deno.serve(async (req) => {
  try {
    const { messages, memeMode } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Missing `messages`" }), { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        system: buildSystemPrompt(Boolean(memeMode)),
        messages,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    // Join every text block (not just the last) — with tool use, Claude
    // may interleave short narration ("checking the latest on this...")
    // between searches, which reads fine as one continuous reply, unlike
    // the Truth Analyzer's strict-JSON-only case.
    const reply = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n\n")
      .trim();

    return new Response(JSON.stringify({ reply: reply || "I wasn't able to put together an answer for that — try rephrasing?" }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
